// Serves the local storage driver's signed URLs. Mounted only when
// STORAGE_DRIVER=local, so it never exists in production.
import { Router } from "express"
import { createReadStream } from "node:fs"
import { stat } from "node:fs/promises"
import { storage } from "../storage/index.js"
import { route, forbidden, notFound } from "../lib/http.js"

export const localStorageRoutes = Router()

const TYPES = { webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", mp4: "video/mp4", mov: "video/quicktime", zip: "application/zip", svg: "image/svg+xml" }

localStorageRoutes.all(
  /^\/(.+)$/,
  route(async (req, res) => {
    const key = decodeURIComponent(req.params[0])
    const q = req.query
    if (req.method === "PUT") {
      const op = q.op === "part" ? "part" : "put"
      if (!storage.verify(op, key, q)) throw forbidden("Bad signature")
      const etag = await storage.writeFromRequest(key, req, op === "part" ? { uploadId: String(q.uploadId), partNumber: Number(q.partNumber) } : {})
      res.set("ETag", etag)
      return res.status(200).end()
    }
    if (req.method !== "GET" && req.method !== "HEAD") return res.status(405).end()
    if (!storage.verify("get", key, q)) throw forbidden("Bad signature")
    const path = storage.pathFor(key)
    let s
    try {
      s = await stat(path)
    } catch {
      throw notFound()
    }
    const ext = key.split(".").pop().toLowerCase()
    res.set("Content-Type", TYPES[ext] || "application/octet-stream")
    res.set("Cache-Control", "private, max-age=3600")
    res.set("Accept-Ranges", "bytes")
    if (q.dl) res.set("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent(String(q.dl))}`)
    const range = req.headers.range
    if (range) {
      const m = range.match(/bytes=(\d*)-(\d*)/)
      const start = m[1] ? Number(m[1]) : 0
      const end = m[2] ? Math.min(Number(m[2]), s.size - 1) : s.size - 1
      res.status(206)
      res.set("Content-Range", `bytes ${start}-${end}/${s.size}`)
      res.set("Content-Length", String(end - start + 1))
      if (req.method === "HEAD") return res.end()
      return createReadStream(path, { start, end }).pipe(res)
    }
    res.set("Content-Length", String(s.size))
    if (req.method === "HEAD") return res.end()
    createReadStream(path).pipe(res)
  }),
)
