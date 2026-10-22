// Turns media rows into what the browser needs, with signed URLs for every
// derivative. Only called once the caller has established the viewer may
// see this gallery.
import { storage } from "../storage/index.js"

const PHOTO_EXT = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif", "tif", "tiff"])
const VIDEO_EXT = new Set(["mp4", "mov", "m4v", "webm", "mkv", "avi"])

export function kindFromName(name) {
  const ext = name.split(".").pop().toLowerCase()
  if (PHOTO_EXT.has(ext)) return "photo"
  if (VIDEO_EXT.has(ext)) return "video"
  return null
}

export function contentTypeFor(name, fallback) {
  const ext = name.split(".").pop().toLowerCase()
  const map = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", heic: "image/heic", heif: "image/heif",
    tif: "image/tiff", tiff: "image/tiff", mp4: "video/mp4", mov: "video/quicktime", m4v: "video/x-m4v", webm: "video/webm",
    mkv: "video/x-matroska", avi: "video/x-msvideo",
  }
  return map[ext] || fallback || "application/octet-stream"
}

async function u(key, opts) {
  return key ? storage.signGetUrl(key, opts) : null
}

export async function serializeMedia(m, { admin = false } = {}) {
  const d = m.derivatives || {}
  const out = {
    id: m.id,
    albumId: m.album_id,
    kind: m.kind,
    filename: m.filename,
    width: m.width,
    height: m.height,
    duration: m.duration_s,
    capturedAt: m.captured_at,
    highlighted: m.highlighted,
    status: m.status,
    thumb: await u(d.thumb?.key),
    display: await u(d.display?.key),
    poster: await u(d.poster?.key),
    web: await u(d.web?.key),
    hasSocial: Boolean(d.social?.key || d.web?.key),
  }
  if (m.kind === "video" && !d.web?.key && m.status === "attention") {
    // Over the transcode cap: the original is the only playable file.
    out.web = await u(m.original_key)
  }
  if (admin) {
    Object.assign(out, {
      relPath: m.rel_path,
      sizeBytes: m.size_bytes,
      sort: m.sort,
      error: m.error,
      trashedAt: m.trashed_at,
      createdAt: m.created_at,
      websiteSentAt: m.website_sent_at,
      websitePath: m.website_path,
      derivativeSizes: Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v.size || null])),
    })
  }
  return out
}

export async function serializeAll(rows, opts) {
  return Promise.all(rows.map((r) => serializeMedia(r, opts)))
}

// Which stored object a given download size maps to.
export function downloadKey(m, size) {
  const d = m.derivatives || {}
  if (size === "full") return { key: m.original_key, filename: m.filename }
  if (m.kind === "video") {
    if (d.web?.key) return { key: d.web.key, filename: replaceExt(m.filename, "mp4") }
    return { key: m.original_key, filename: m.filename }
  }
  if (d.social?.key) return { key: d.social.key, filename: replaceExt(m.filename, "jpg") }
  return { key: m.original_key, filename: m.filename }
}

export function replaceExt(name, ext) {
  return name.replace(/\.[^.]+$/, "") + "." + ext
}
