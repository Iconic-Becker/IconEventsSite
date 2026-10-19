// Cloudflare R2 through the S3 API. Browsers upload straight to the bucket
// with presigned URLs; the server only signs and completes. Media is served
// with presigned GET URLs whose signing time is rounded to a window so the
// same object yields the same URL for a while and browsers can cache it.
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  ListPartsCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  PutBucketCorsCommand,
  GetBucketCorsCommand,
} from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { createWriteStream } from "node:fs"
import { pipeline } from "node:stream/promises"
import { config } from "../config.js"

export function createR2Storage() {
  const { endpoint, accessKeyId, secretAccessKey, bucket } = config.r2
  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 storage needs R2_ACCOUNT_ID (or R2_ENDPOINT), R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY")
  }
  const client = new S3Client({
    region: "auto",
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    // R2 wants path-style addressing on the account endpoint.
    forcePathStyle: true,
  })

  const window = config.urlWindowSeconds
  const urlCache = new Map()

  function windowStart() {
    const now = Math.floor(Date.now() / 1000)
    return now - (now % window)
  }

  return {
    name: "r2",

    async createMultipart(key, contentType) {
      const out = await client.send(new CreateMultipartUploadCommand({ Bucket: bucket, Key: key, ContentType: contentType }))
      return out.UploadId
    },

    async signPartUrl(key, uploadId, partNumber) {
      return getSignedUrl(
        client,
        new UploadPartCommand({ Bucket: bucket, Key: key, UploadId: uploadId, PartNumber: partNumber }),
        { expiresIn: 3600 },
      )
    },

    async listParts(key, uploadId) {
      const parts = []
      let marker
      do {
        const out = await client.send(new ListPartsCommand({ Bucket: bucket, Key: key, UploadId: uploadId, PartNumberMarker: marker }))
        for (const p of out.Parts || []) parts.push({ partNumber: p.PartNumber, etag: p.ETag, size: p.Size })
        marker = out.IsTruncated ? out.NextPartNumberMarker : undefined
      } while (marker)
      return parts
    },

    async completeMultipart(key, uploadId, parts) {
      await client.send(
        new CompleteMultipartUploadCommand({
          Bucket: bucket,
          Key: key,
          UploadId: uploadId,
          MultipartUpload: { Parts: parts.map((p) => ({ PartNumber: p.partNumber, ETag: p.etag })) },
        }),
      )
    },

    async abortMultipart(key, uploadId) {
      await client.send(new AbortMultipartUploadCommand({ Bucket: bucket, Key: key, UploadId: uploadId })).catch(() => {})
    },

    async signPutUrl(key, contentType) {
      return getSignedUrl(client, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }), { expiresIn: 3600 })
    },

    // Stable within a window; valid for two windows so a URL handed out at
    // the end of one window still works for a full window afterwards.
    async signGetUrl(key, { filename, contentType } = {}) {
      const start = windowStart()
      const cacheKey = `${key}|${filename || ""}|${start}`
      const hit = urlCache.get(cacheKey)
      if (hit) return hit
      const cmd = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        ResponseContentDisposition: filename ? `attachment; filename="${asciiName(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}` : undefined,
        ResponseContentType: contentType,
      })
      const url = await getSignedUrl(client, cmd, { expiresIn: window * 2, signingDate: new Date(start * 1000) })
      if (urlCache.size > 20000) urlCache.clear()
      urlCache.set(cacheKey, url)
      return url
    },

    async getStream(key) {
      const out = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
      return out.Body
    },

    async downloadToFile(key, path) {
      const body = await this.getStream(key)
      await pipeline(body, createWriteStream(path))
    },

    async putObject(key, body, contentType) {
      const upload = new Upload({
        client,
        params: { Bucket: bucket, Key: key, Body: body, ContentType: contentType },
        partSize: 32 * 1024 * 1024,
        queueSize: 3,
      })
      await upload.done()
    },

    async head(key) {
      try {
        const out = await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
        return { size: out.ContentLength, contentType: out.ContentType }
      } catch (err) {
        if (err.$metadata?.httpStatusCode === 404 || err.name === "NotFound") return null
        throw err
      }
    },

    async deleteMany(keys) {
      for (let i = 0; i < keys.length; i += 1000) {
        const chunk = keys.slice(i, i + 1000)
        await client.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true } }))
      }
    },

    async list(prefix) {
      const keys = []
      let token
      do {
        const out = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: token }))
        for (const o of out.Contents || []) keys.push({ key: o.Key, size: o.Size })
        token = out.IsTruncated ? out.NextContinuationToken : undefined
      } while (token)
      return keys
    },

    // The bucket must allow the browser to PUT parts and GET media.
    async ensureCors(origins) {
      const rule = {
        AllowedOrigins: origins,
        AllowedMethods: ["GET", "PUT", "HEAD"],
        AllowedHeaders: ["*"],
        ExposeHeaders: ["ETag", "Content-Length", "Content-Type"],
        MaxAgeSeconds: 3600,
      }
      let current = null
      try {
        current = await client.send(new GetBucketCorsCommand({ Bucket: bucket }))
      } catch {
        // No CORS configured yet.
      }
      const have = current?.CORSRules?.[0]
      const same =
        have &&
        JSON.stringify([...(have.AllowedOrigins || [])].sort()) === JSON.stringify([...origins].sort()) &&
        (have.ExposeHeaders || []).includes("ETag")
      if (same) return false
      await client.send(new PutBucketCorsCommand({ Bucket: bucket, CORSConfiguration: { CORSRules: [rule] } }))
      return true
    },
  }
}

function asciiName(name) {
  return name.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'")
}
