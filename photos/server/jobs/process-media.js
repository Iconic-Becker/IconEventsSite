// Turns an uploaded original into the derivatives the site serves. Runs in
// the worker: downloads the original to a temp file, writes derivatives
// beside it, uploads them, and updates the media row.
import sharp from "sharp"
import exifReader from "exif-reader"
import { fileTypeFromFile } from "file-type"
import { mkdtemp, rm, stat, readFile } from "node:fs/promises"
import { createReadStream } from "node:fs"
import { join } from "node:path"
import { config } from "../config.js"
import { one, query } from "../db/pool.js"
import { storage, keys } from "../storage/index.js"
import { register, enqueue, poke } from "./queue.js"
import { probe, run, scaleFilter } from "./ffmpeg.js"

const ALLOWED_PHOTO = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/tiff"])
const ALLOWED_VIDEO = new Set(["video/mp4", "video/quicktime", "video/x-m4v", "video/webm", "video/x-matroska", "video/x-msvideo"])

register("process_media", async ({ mediaId }) => {
  const m = await one("select * from media where id = $1", [mediaId])
  if (!m || m.trashed_at) return
  await query("update media set status = 'processing', error = null where id = $1", [mediaId])
  const dir = await mkdtemp(join(config.tmpDir, "ip-"))
  try {
    const src = join(dir, "original")
    await storage.downloadToFile(m.original_key, src)
    const size = (await stat(src)).size
    const detected = await fileTypeFromFile(src)
    const mime = detected?.mime || ""
    const ok = m.kind === "photo" ? ALLOWED_PHOTO.has(mime) : ALLOWED_VIDEO.has(mime)
    if (!ok) {
      const err = new Error(`File content is ${mime || "unrecognised"}, not a ${m.kind}`)
      err.permanent = true
      throw err
    }
    const update = m.kind === "photo" ? await processPhoto(m, src, dir) : await processVideo(m, src, dir)
    await query(
      `update media set status = $2, width = $3, height = $4, duration_s = $5, captured_at = coalesce($6, captured_at),
         derivatives = $7, meta = meta || $8, size_bytes = $9, content_type = $10, error = $11 where id = $1`,
      [
        mediaId,
        update.status || "ready",
        update.width,
        update.height,
        update.duration ?? null,
        update.capturedAt ?? null,
        JSON.stringify(update.derivatives),
        JSON.stringify(update.meta || {}),
        size,
        mime,
        update.error || null,
      ],
    )
    await afterReady(m)
  } catch (err) {
    await query("update media set status = 'failed', error = $2 where id = $1", [mediaId, String(err.message).slice(0, 2000)])
    throw err
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

async function upload(m, name, path, contentType) {
  const key = keys.derivative(m.gallery_id, m.id, name)
  await storage.putObject(key, createReadStream(path), contentType)
  const { size } = await stat(path)
  return { key, size }
}

async function processPhoto(m, src, dir) {
  const image = sharp(src, { failOn: "none", limitInputPixels: 300e6 })
  const meta = await image.metadata()
  let exif = {}
  if (meta.exif) {
    try {
      exif = exifReader(meta.exif) || {}
    } catch {
      exif = {}
    }
  }
  const capturedAt = parseExifDate(exif.Photo?.DateTimeOriginal || exif.Image?.DateTime)
  const copyright = exif.Image?.Copyright
  const artist = exif.Image?.Artist

  // Dimensions after honouring the orientation tag, which rotate() applies.
  const swap = meta.orientation >= 5
  const width = swap ? meta.height : meta.width
  const height = swap ? meta.width : meta.height

  const base = () => sharp(src, { failOn: "none", limitInputPixels: 300e6 }).rotate()

  const thumbPath = join(dir, "thumb.webp")
  const t = await base().resize({ width: 600, height: 600, fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(thumbPath)

  const displayPath = join(dir, "display.webp")
  const d = await base().resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true }).webp({ quality: 84 }).toFile(displayPath)

  // Social: 2048 long edge JPEG, sRGB, GPS and everything else stripped
  // except copyright and artist, which are written back.
  const socialPath = join(dir, "social.jpg")
  const ifd0 = {}
  if (copyright) ifd0.Copyright = String(copyright)
  if (artist) ifd0.Artist = String(artist)
  let social = base()
    .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
    .toColorspace("srgb")
    .withIccProfile("srgb")
    .jpeg({ quality: 82, mozjpeg: true })
  const exifOut = { IFD0: ifd0 }
  const dto = exif.Photo?.DateTimeOriginal
  if (dto) exifOut.IFD2 = { DateTimeOriginal: formatExifDate(dto) }
  if (Object.keys(ifd0).length || exifOut.IFD2) social = social.withExif(exifOut)
  const s = await social.toFile(socialPath)

  const derivatives = {
    thumb: { ...(await upload(m, "thumb.webp", thumbPath, "image/webp")), width: t.width, height: t.height },
    display: { ...(await upload(m, "display.webp", displayPath, "image/webp")), width: d.width, height: d.height },
    social: { ...(await upload(m, "social.jpg", socialPath, "image/jpeg")), width: s.width, height: s.height },
  }
  return {
    width,
    height,
    capturedAt,
    derivatives,
    meta: { camera: [exif.Image?.Make, exif.Image?.Model].filter(Boolean).join(" ") || undefined, copyright: copyright || undefined },
  }
}

async function processVideo(m, src, dir) {
  const info = await probe(src)
  const posterAt = Math.min(1, Math.max(0, info.duration / 2))
  const posterPath = join(dir, "poster.jpg")
  await run("ffmpeg", ["-y", "-v", "error", "-ss", String(posterAt), "-i", src, "-frames:v", "1", "-vf", scaleFilter(2048), "-q:v", "3", posterPath])
  const thumbPath = join(dir, "thumb.webp")
  const t = await sharp(posterPath).resize({ width: 600, height: 600, fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(thumbPath)
  const p = await sharp(posterPath).metadata()

  const derivatives = {
    poster: { ...(await upload(m, "poster.jpg", posterPath, "image/jpeg")), width: p.width, height: p.height },
    thumb: { ...(await upload(m, "thumb.webp", thumbPath, "image/webp")), width: t.width, height: t.height },
  }

  let status = "ready"
  let error = null
  if (info.duration > config.maxTranscodeSeconds) {
    status = "attention"
    error = `Video is ${Math.round(info.duration / 60)} minutes long, over the ${config.maxTranscodeSeconds / 60} minute transcode cap. The original will play as is. Trim it or raise MAX_TRANSCODE_MINUTES.`
  } else {
    const webPath = join(dir, "web.mp4")
    const args = ["-y", "-v", "error", "-i", src, "-vf", `${scaleFilter(1920)},format=yuv420p`, "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-profile:v", "high", "-level", "4.1", "-movflags", "+faststart"]
    if (info.hasAudio) args.push("-c:a", "aac", "-b:a", "160k", "-ac", "2")
    else args.push("-an")
    args.push(webPath)
    await run("ffmpeg", args, { timeoutMs: 3 * 60 * 60 * 1000 })
    const web = await probe(webPath)
    derivatives.web = { ...(await upload(m, "web.mp4", webPath, "video/mp4")), width: web.width, height: web.height }
  }
  return { width: info.width, height: info.height, duration: info.duration, derivatives, status, error, meta: { codec: info.codec } }
}

// After a media item is ready: a reel gets its cover clip; cached zips for
// the gallery are stale.
async function afterReady(m) {
  await query("update galleries set content_version = content_version + 1, updated_at = now() where id = $1", [m.gallery_id])
  const reel = await one("select id from reels where media_id = $1", [m.id])
  if (reel) {
    await enqueue("cover_clip", { reelId: reel.id })
    poke()
  }
}

// The looping cover clip: 8 seconds, muted, 720p, from the chosen start.
register("cover_clip", async ({ reelId }) => {
  const r = await one("select r.*, m.original_key, m.gallery_id, m.duration_s, m.derivatives, m.id as media_id from reels r join media m on m.id = r.media_id where r.id = $1", [reelId])
  if (!r) return
  const srcKey = r.derivatives?.web?.key || r.original_key
  const dir = await mkdtemp(join(config.tmpDir, "ip-clip-"))
  try {
    const src = join(dir, "src.mp4")
    await storage.downloadToFile(srcKey, src)
    const dur = Number(r.duration_s || 0)
    const start = Math.min(Math.max(0, Number(r.clip_start_s || 0)), Math.max(0, dur - 2))
    const len = Math.min(8, Math.max(2, dur - start))
    const out = join(dir, "clip.mp4")
    await run("ffmpeg", ["-y", "-v", "error", "-ss", String(start), "-t", String(len), "-i", src, "-an", "-vf", `${scaleFilter(1280)},format=yuv420p`, "-c:v", "libx264", "-preset", "medium", "-crf", "28", "-movflags", "+faststart", out])
    const key = keys.derivative(r.gallery_id, r.media_id, `clip-${Math.round(start)}.mp4`)
    await storage.putObject(key, createReadStream(out), "video/mp4")
    const { size } = await stat(out)
    await query("update media set derivatives = derivatives || $2 where id = $1", [r.media_id, JSON.stringify({ clip: { key, size, start } })])
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

function formatExifDate(v) {
  const d = v instanceof Date ? v : parseExifDate(v)
  if (!d) return String(v)
  const p = (n) => String(n).padStart(2, "0")
  return `${d.getUTCFullYear()}:${p(d.getUTCMonth() + 1)}:${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
}

function parseExifDate(v) {
  if (!v) return null
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v
  const m = String(v).match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/)
  if (!m) return null
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]))
  return Number.isNaN(d.getTime()) ? null : d
}
