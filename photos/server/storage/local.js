// Disk-backed storage with the same interface as the R2 driver. Development
// and tests use it so nothing needs a bucket. "Presigned" URLs point back at
// this server and carry an HMAC; server/routes/local-storage.js serves them.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"
import { createReadStream, createWriteStream } from "node:fs"
import { mkdir, stat, rename, rm, readdir, open, unlink } from "node:fs/promises"
import { dirname, join, resolve, sep } from "node:path"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"
import { config } from "../config.js"

export function createLocalStorage() {
  const root = join(config.dataDir, "storage")
  const secret = config.sessionSecret
  const window = config.urlWindowSeconds

  function pathFor(key) {
    const p = resolve(join(root, key))
    if (!p.startsWith(root + sep)) throw new Error("bad key")
    return p
  }

  function sign(parts) {
    return createHmac("sha256", secret).update(parts.join("\n")).digest("base64url")
  }

  function windowStart() {
    const now = Math.floor(Date.now() / 1000)
    return now - (now % window)
  }

  function url(path, params) {
    const qs = new URLSearchParams(params).toString()
    return `${config.publicUrl}/_local/${path.split("/").map(encodeURIComponent).join("/")}?${qs}`
  }

  const storage = {
    name: "local",
    root,

    async createMultipart(key) {
      const uploadId = randomBytes(12).toString("hex")
      await mkdir(pathFor(`${key}.parts-${uploadId}`), { recursive: true })
      return uploadId
    },

    async signPartUrl(key, uploadId, partNumber) {
      const exp = Math.floor(Date.now() / 1000) + 3600
      return url(key, { op: "part", uploadId, partNumber, exp, sig: sign(["part", key, uploadId, String(partNumber), String(exp)]) })
    },

    async listParts(key, uploadId) {
      const dir = pathFor(`${key}.parts-${uploadId}`)
      let names = []
      try {
        names = await readdir(dir)
      } catch {
        return []
      }
      const parts = []
      for (const n of names) {
        if (!/^\d+$/.test(n)) continue
        const s = await stat(join(dir, n))
        parts.push({ partNumber: Number(n), etag: `"local-${n}-${s.size}"`, size: s.size })
      }
      return parts.sort((a, b) => a.partNumber - b.partNumber)
    },

    async completeMultipart(key, uploadId, parts) {
      const dir = pathFor(`${key}.parts-${uploadId}`)
      const target = pathFor(key)
      await mkdir(dirname(target), { recursive: true })
      const out = createWriteStream(target + ".tmp")
      for (const p of [...parts].sort((a, b) => a.partNumber - b.partNumber)) {
        await new Promise((res, rej) => {
          const rs = createReadStream(join(dir, String(p.partNumber)))
          rs.on("error", rej)
          rs.on("end", res)
          rs.pipe(out, { end: false })
        })
      }
      await new Promise((res) => out.end(res))
      await rename(target + ".tmp", target)
      await rm(dir, { recursive: true, force: true })
    },

    async abortMultipart(key, uploadId) {
      await rm(pathFor(`${key}.parts-${uploadId}`), { recursive: true, force: true })
    },

    async signPutUrl(key) {
      const exp = Math.floor(Date.now() / 1000) + 3600
      return url(key, { op: "put", exp, sig: sign(["put", key, String(exp)]) })
    },

    async signGetUrl(key, { filename } = {}) {
      const exp = windowStart() + window * 2
      const params = { exp, sig: sign(["get", key, filename || "", String(exp)]) }
      if (filename) params.dl = filename
      return url(key, params)
    },

    async getStream(key) {
      return createReadStream(pathFor(key))
    },

    async downloadToFile(key, path) {
      await pipeline(createReadStream(pathFor(key)), createWriteStream(path))
    },

    async putObject(key, body) {
      const target = pathFor(key)
      await mkdir(dirname(target), { recursive: true })
      const src = Buffer.isBuffer(body) || typeof body === "string" ? Readable.from([body]) : body
      await pipeline(src, createWriteStream(target + ".tmp"))
      await rename(target + ".tmp", target)
    },

    async head(key) {
      try {
        const s = await stat(pathFor(key))
        return { size: s.size }
      } catch {
        return null
      }
    },

    async deleteMany(keys) {
      for (const k of keys) await unlink(pathFor(k)).catch(() => {})
    },

    async list(prefix) {
      const base = pathFor(prefix)
      const out = []
      async function walk(dir) {
        let entries
        try {
          entries = await readdir(dir, { withFileTypes: true })
        } catch {
          return
        }
        for (const e of entries) {
          const p = join(dir, e.name)
          if (e.isDirectory()) await walk(p)
          else {
            const s = await stat(p)
            out.push({ key: p.slice(root.length + 1), size: s.size })
          }
        }
      }
      await walk(base)
      return out
    },

    async ensureCors() {
      return false
    },

    // Used by the local route to check a URL's signature.
    verify(op, key, params) {
      const exp = Number(params.exp)
      if (!exp || exp < Date.now() / 1000) return false
      const expected =
        op === "get"
          ? sign(["get", key, params.dl || "", String(exp)])
          : op === "put"
            ? sign(["put", key, String(exp)])
            : sign(["part", key, params.uploadId, String(params.partNumber), String(exp)])
      const a = Buffer.from(expected)
      const b = Buffer.from(String(params.sig || ""))
      return a.length === b.length && timingSafeEqual(a, b)
    },

    async writeFromRequest(key, req, { uploadId, partNumber } = {}) {
      const target = uploadId ? pathFor(`${key}.parts-${uploadId}/${partNumber}`) : pathFor(key)
      await mkdir(dirname(target), { recursive: true })
      await pipeline(req, createWriteStream(target))
      const s = await stat(target)
      return `"local-${partNumber || 0}-${s.size}"`
    },

    pathFor,
  }
  return storage
}
