// Zip streaming shared by the lazy "download all" builder and the small
// on-demand zips (favorites, "Both" on iOS). Files are stored, not
// deflated: JPEGs and MP4s do not shrink and deflate would only burn CPU.
import { ZipArchive } from "archiver"
import { PassThrough } from "node:stream"
import { storage } from "../storage/index.js"
import { downloadKey } from "./media.js"

// items: [{ media, albumName }]; size: 'social' | 'full' | 'both'
export function zipEntries(items, size) {
  const entries = []
  const seen = new Map()
  for (const { media, albumName } of items) {
    const sizes = size === "both" ? ["social", "full"] : [size]
    for (const s of sizes) {
      const { key, filename } = downloadKey(media, s)
      let name = albumName ? `${albumName}/${filename}` : filename
      if (size === "both") name = `${s === "social" ? "Social" : "Full resolution"}/${name}`
      // Two files with the same name in one album would collide.
      const n = (seen.get(name) || 0) + 1
      seen.set(name, n)
      if (n > 1) name = name.replace(/(\.[^.]+)$/, ` (${n})$1`)
      entries.push({ key, name, bytes: estimateBytes(media, s) })
    }
  }
  return entries
}

export function estimateBytes(media, size) {
  const d = media.derivatives || {}
  if (size === "full") return Number(media.size_bytes || 0)
  if (media.kind === "video") return Number(d.web?.size || media.size_bytes || 0)
  return Number(d.social?.size || media.size_bytes / 4 || 0)
}

// Returns a readable stream of the zip. Errors propagate on the stream.
export function zipStream(entries) {
  const out = new PassThrough()
  const archive = new ZipArchive({ zlib: { level: 0 }, store: true })
  archive.on("error", (err) => out.destroy(err))
  archive.on("warning", (err) => console.warn("[zip]", err.message))
  archive.pipe(out)
  ;(async () => {
    for (const e of entries) {
      const stream = await storage.getStream(e.key)
      archive.append(stream, { name: e.name })
    }
    await archive.finalize()
  })().catch((err) => out.destroy(err))
  return out
}

// Greedy split into parts no larger than `limit` bytes (one file may still
// exceed it on its own).
export function splitParts(entries, limit) {
  const parts = [[]]
  let acc = 0
  for (const e of entries) {
    if (acc + e.bytes > limit && parts.at(-1).length) {
      parts.push([])
      acc = 0
    }
    parts.at(-1).push(e)
    acc += e.bytes
  }
  return parts
}
