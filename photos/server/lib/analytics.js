// View and download counts without a third party. Visitors are identified
// by a hash of IP and user agent salted per day, so no raw IP is stored and
// the same visitor cannot be followed across days.
import { createHash } from "node:crypto"
import { hmac } from "./cookies.js"
import { query } from "../db/pool.js"

export const EVENT_TYPES = new Set([
  "view",
  "lightbox",
  "download_social",
  "download_full",
  "download_zip",
  "reel_play",
  "reel_complete",
  "reel_share",
  "reel_download",
  "banner_click",
])

export function visitorHash(req) {
  const day = new Date().toISOString().slice(0, 10)
  const salt = hmac("visitor-salt", day)
  return createHash("sha256").update(`${salt}|${req.ip}|${req.get("user-agent") || ""}`).digest("hex").slice(0, 32)
}

export async function record(req, { galleryId, mediaId = null, reelId = null, type }) {
  if (!EVENT_TYPES.has(type)) return
  await query("insert into events(gallery_id, media_id, reel_id, type, visitor, link_id) values ($1, $2, $3, $4, $5, $6)", [
    galleryId,
    mediaId,
    reelId,
    type,
    visitorHash(req),
    req.link?.id || null,
  ])
}
