import { Router } from "express"
import { randomBytes } from "node:crypto"
import { one, many, query } from "../db/pool.js"
import { route, bad, notFound, forbidden, str, int } from "../lib/http.js"
import { setCookie } from "../lib/cookies.js"
import { checkPassword, normalizeEmail, validEmail } from "../lib/auth.js"
import { rateLimit } from "../lib/ratelimit.js"
import { record, EVENT_TYPES, visitorHash } from "../lib/analytics.js"
import { storage } from "../storage/index.js"
import { serializeAll, serializeMedia, downloadKey } from "../lib/media.js"
import { zipEntries, zipStream } from "../lib/zip.js"
import { enqueue, poke } from "../jobs/queue.js"
import { loadBySlug, isUnlocked, canSee, unlockCookieName, unlockToken, serializeGallery, lockedGallery, reelsOf, linkAlbumIds } from "../lib/gallery.js"

export const guest = Router()

// Every guest route starts by loading the gallery and settling access.
guest.use(
  "/:slug",
  route(async (req, res, next) => {
    const found = await loadBySlug(req.params.slug)
    if (!found || !(await canSee(req, found.gallery))) throw notFound("This gallery does not exist or is no longer available")
    req.gallery = found.gallery
    req.link = found.link
    req.albumIds = linkAlbumIds(found.link)
    req.unlocked = isUnlocked(req, found.gallery, found.link)
    next()
  }),
)

function requireUnlocked(req) {
  if (!req.unlocked) throw forbidden("This gallery is password protected")
}

guest.get(
  "/:slug",
  route(async (req, res) => {
    const g = req.gallery
    if (!req.unlocked) return res.json(lockedGallery(g, req.link))
    res.json(await serializeGallery(g, { link: req.link }))
  }),
)

guest.post(
  "/:slug/unlock",
  rateLimit({ name: "unlock", limit: 20, windowMs: 15 * 60 * 1000 }),
  route(async (req, res) => {
    const g = req.gallery
    const hash = req.link ? req.link.password_hash : g.password_hash
    if (!hash) return res.json({ ok: true })
    const ok = await checkPassword(str(req.body?.password, 200), hash)
    if (!ok) throw forbidden("That password is not right")
    setCookie(res, unlockCookieName(g, req.link), unlockToken(g, req.link), { days: 30 })
    res.json({ ok: true })
  }),
)

// Media of one album, in pages, so a 3,000 photo album starts painting at
// once and the rest arrives behind it. "highlights" is the starred set.
const PAGE = 150
guest.get(
  "/:slug/albums/:album",
  route(async (req, res) => {
    requireUnlocked(req)
    const g = req.gallery
    const offset = Math.max(0, int(req.query.offset, 0))
    const limit = Math.min(500, Math.max(1, int(req.query.limit, PAGE)))
    let rows
    let total
    let album
    if (req.params.album === "highlights") {
      album = { id: "highlights", slug: "highlights", name: "Highlights" }
      const where = "gallery_id = $1 and highlighted and trashed_at is null and status in ('ready','attention') and album_id is not null and ($2::bigint[] is null or album_id = any($2::bigint[]))"
      total = (await one(`select count(*) as n from media where ${where}`, [g.id, req.albumIds])).n
      rows = await many(`select * from media where ${where} order by sort, captured_at nulls last, filename, id offset $3 limit $4`, [g.id, req.albumIds, offset, limit])
    } else {
      album = await one("select id, slug, name from albums where gallery_id = $1 and slug = $2 and ($3::bigint[] is null or id = any($3::bigint[]))", [g.id, req.params.album, req.albumIds])
      if (!album) throw notFound("Album not found")
      const where = "album_id = $1 and trashed_at is null and status in ('ready','attention')"
      total = (await one(`select count(*) as n from media where ${where}`, [album.id])).n
      rows = await many(`select * from media where ${where} order by sort, captured_at nulls last, filename, id offset $2 limit $3`, [album.id, offset, limit])
    }
    res.set("Cache-Control", "private, max-age=60")
    res.json({ album, media: await serializeAll(rows), total, offset, nextOffset: offset + rows.length < total ? offset + rows.length : null })
  }),
)

// ---- Guests and favorites -------------------------------------------------

function guestCookie(g) {
  return `guest_${g.id}`
}

async function currentGuest(req) {
  const token = req.cookies?.[guestCookie(req.gallery)]
  if (!token) return null
  return one("select * from guests where token = $1 and gallery_id = $2", [token, req.gallery.id])
}

async function favoriteIds(guestId) {
  const rows = await many("select media_id from favorites where guest_id = $1", [guestId])
  return rows.map((r) => r.media_id)
}

guest.get(
  "/:slug/me",
  route(async (req, res) => {
    const gst = await currentGuest(req)
    if (!gst) return res.json({ guest: null, favorites: [] })
    res.json({ guest: { name: gst.name, email: gst.email }, favorites: await favoriteIds(gst.id) })
  }),
)

// First heart: the email gate. The same email on another device restores
// the list without verification; README documents the trade-off.
guest.post(
  "/:slug/guest",
  rateLimit({ name: "guest", limit: 60, windowMs: 15 * 60 * 1000, countAll: true }),
  route(async (req, res) => {
    requireUnlocked(req)
    const email = normalizeEmail(req.body?.email)
    const name = str(req.body?.name, 120)
    if (!validEmail(email)) throw bad("Enter a valid email address")
    const token = randomBytes(24).toString("base64url")
    const gst = await one(
      `insert into guests(gallery_id, email, name, token) values ($1, $2, $3, $4)
       on conflict (gallery_id, email) do update set last_seen_at = now(), name = case when excluded.name <> '' then excluded.name else guests.name end
       returning *`,
      [req.gallery.id, email, name, token],
    )
    setCookie(res, guestCookie(req.gallery), gst.token, { days: 365 })
    res.json({ guest: { name: gst.name, email: gst.email }, favorites: await favoriteIds(gst.id) })
  }),
)

guest.put(
  "/:slug/favorites/:mediaId",
  route(async (req, res) => {
    requireUnlocked(req)
    const gst = await currentGuest(req)
    if (!gst) return res.status(401).json({ error: "Enter your email to save favorites", needEmail: true })
    const m = await one("select id from media where id = $1 and gallery_id = $2 and trashed_at is null", [int(req.params.mediaId), req.gallery.id])
    if (!m) throw notFound()
    await query("insert into favorites(guest_id, media_id) values ($1, $2) on conflict do nothing", [gst.id, m.id])
    await query("update guests set last_seen_at = now() where id = $1", [gst.id])
    res.json({ favorites: await favoriteIds(gst.id) })
  }),
)

guest.delete(
  "/:slug/favorites/:mediaId",
  route(async (req, res) => {
    const gst = await currentGuest(req)
    if (!gst) return res.status(401).json({ error: "Not signed in", needEmail: true })
    await query("delete from favorites where guest_id = $1 and media_id = $2", [gst.id, int(req.params.mediaId)])
    res.json({ favorites: await favoriteIds(gst.id) })
  }),
)

// ---- Downloads -------------------------------------------------------------

function sizeParam(v, allowBoth = false) {
  if (v === "social" || v === "full") return v
  if (allowBoth && v === "both") return v
  throw bad("size must be social or full")
}

guest.get(
  "/:slug/dl/:mediaId",
  route(async (req, res) => {
    requireUnlocked(req)
    const size = sizeParam(req.query.size)
    const m = await one("select * from media where id = $1 and gallery_id = $2 and trashed_at is null and status in ('ready','attention') and ($3::bigint[] is null or album_id is null or album_id = any($3::bigint[]))", [int(req.params.mediaId), req.gallery.id, req.albumIds])
    if (!m) throw notFound()
    const { key, filename } = downloadKey(m, size)
    const reel = await one("select id from reels where media_id = $1", [m.id])
    await record(req, { galleryId: req.gallery.id, mediaId: m.id, reelId: reel?.id || null, type: reel ? "reel_download" : size === "full" ? "download_full" : "download_social" })
    res.set("Cache-Control", "no-store")
    res.redirect(302, await storage.signGetUrl(key, { filename }))
  }),
)

// Small on-demand zip: a handful of selected items, or "Both" on iOS.
guest.get(
  "/:slug/zip",
  route(async (req, res) => {
    requireUnlocked(req)
    const size = sizeParam(req.query.size, true)
    const ids = String(req.query.ids || "").split(",").map((s) => int(s)).filter(Boolean).slice(0, 300)
    if (!ids.length) throw bad("No items selected")
    const rows = await many(
      `select m.*, a.name as album_name from media m left join albums a on a.id = m.album_id
       where m.gallery_id = $1 and m.id = any($2::bigint[]) and m.trashed_at is null and m.status in ('ready','attention') and ($3::bigint[] is null or m.album_id = any($3::bigint[])) order by m.sort, m.id`,
      [req.gallery.id, ids, req.albumIds],
    )
    await record(req, { galleryId: req.gallery.id, type: "download_zip" })
    sendZip(res, `${req.gallery.title} - selection.zip`, zipEntries(rows.map((media) => ({ media, albumName: media.album_name })), size))
  }),
)

guest.get(
  "/:slug/favorites.zip",
  route(async (req, res) => {
    requireUnlocked(req)
    const size = sizeParam(req.query.size, true)
    const gst = await currentGuest(req)
    if (!gst) throw forbidden("Enter your email to download favorites")
    const rows = await many(
      `select m.*, a.name as album_name from favorites f join media m on m.id = f.media_id left join albums a on a.id = m.album_id
       where f.guest_id = $1 and m.trashed_at is null and m.status in ('ready','attention') and ($2::bigint[] is null or m.album_id = any($2::bigint[])) order by m.sort, m.id`,
      [gst.id, req.albumIds],
    )
    if (!rows.length) throw bad("No favorites yet")
    await record(req, { galleryId: req.gallery.id, type: "download_zip" })
    sendZip(res, `${req.gallery.title} - favorites.zip`, zipEntries(rows.map((media) => ({ media, albumName: media.album_name })), size))
  }),
)

function sendZip(res, name, entries) {
  res.set("Content-Type", "application/zip")
  res.set("Content-Disposition", `attachment; filename="${name.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "'")}"; filename*=UTF-8''${encodeURIComponent(name)}`)
  res.set("Cache-Control", "no-store")
  const stream = zipStream(entries)
  stream.on("error", (err) => {
    console.error("[zip]", err)
    res.destroy(err)
  })
  stream.pipe(res)
}

// Download all: lazily built and cached per content version.
async function zipStatus(g, albumId, size, link) {
  const linkId = albumId ? null : link?.id || null
  const rows = await many(
    "select * from zips where gallery_id = $1 and coalesce(album_id, 0) = coalesce($2::bigint, 0) and coalesce(link_id, 0) = coalesce($5::bigint, 0) and size = $3 and content_version = $4 order by part",
    [g.id, albumId, size, g.content_version, linkId],
  )
  if (!rows.length) return { status: "none" }
  if (rows.some((r) => r.status === "failed")) return { status: "failed" }
  if (rows.some((r) => r.status !== "ready")) return { status: "building", done: rows.filter((r) => r.status === "ready").length, total: rows[0].parts }
  const parts = []
  for (const r of rows) {
    const label = albumId ? (await one("select name from albums where id = $1", [albumId]))?.name || "album" : g.title
    const name = `${label}${rows.length > 1 ? ` - part ${r.part} of ${rows.length}` : ""} (${size === "full" ? "full resolution" : "social"}).zip`
    parts.push({ part: r.part, bytes: r.bytes, url: await storage.signGetUrl(r.key, { filename: name }) })
  }
  return { status: "ready", parts }
}

guest.post(
  "/:slug/zips",
  route(async (req, res) => {
    requireUnlocked(req)
    const size = sizeParam(req.body?.size)
    const albumId = req.body?.albumId ? int(req.body.albumId) : null
    if (albumId) {
      const a = await one("select id from albums where id = $1 and gallery_id = $2 and ($3::bigint[] is null or id = any($3::bigint[]))", [albumId, req.gallery.id, req.albumIds])
      if (!a) throw notFound("Album not found")
    }
    const linkId = albumId ? null : req.link?.id || null
    const status = await zipStatus(req.gallery, albumId, size, req.link)
    if (status.status === "none" || status.status === "failed") {
      if (status.status === "failed") await query("delete from zips where gallery_id = $1 and coalesce(album_id, 0) = coalesce($2::bigint, 0) and coalesce(link_id, 0) = coalesce($5::bigint, 0) and size = $3 and content_version = $4", [req.gallery.id, albumId, size, req.gallery.content_version, linkId])
      await enqueue("build_zip", { galleryId: req.gallery.id, albumId, size, version: req.gallery.content_version, linkId, albumIds: req.albumIds }, { dedupe: true })
      poke()
      await record(req, { galleryId: req.gallery.id, type: "download_zip" })
      return res.json({ status: "building", done: 0, total: null })
    }
    if (status.status === "ready") await record(req, { galleryId: req.gallery.id, type: "download_zip" })
    res.json(status)
  }),
)

guest.get(
  "/:slug/zips",
  route(async (req, res) => {
    requireUnlocked(req)
    const size = sizeParam(req.query.size)
    const albumId = req.query.albumId ? int(req.query.albumId) : null
    res.set("Cache-Control", "no-store")
    res.json(await zipStatus(req.gallery, albumId, size, req.link))
  }),
)

// ---- Reels -----------------------------------------------------------------

guest.get(
  "/:slug/reel/:reelId",
  route(async (req, res) => {
    if (req.link && !req.link.include_reels) throw notFound("This video is not available")
    const reels = await reelsOf(req.gallery.id)
    const reel = reels.find((r) => r.id === int(req.params.reelId))
    if (!reel) throw notFound("This video is not available")
    if (!reel.isPublic && !req.unlocked) throw forbidden("This gallery is password protected")
    const g = req.gallery
    res.json({ reel, gallery: { slug: req.link ? req.link.slug : g.slug, title: g.title, subtitle: g.subtitle, eventDate: g.event_date, locked: !req.unlocked, settings: (await serializeGallery(g)).settings } })
  }),
)

// ---- Analytics events from the browser -------------------------------------

guest.post(
  "/:slug/events",
  route(async (req, res) => {
    const type = str(req.body?.type, 40)
    if (!EVENT_TYPES.has(type) || type.startsWith("download")) throw bad("Unknown event")
    const mediaId = req.body?.mediaId ? int(req.body.mediaId) : null
    const reelId = req.body?.reelId ? int(req.body.reelId) : null
    if (reelId) {
      const reel = await one("select is_public from reels where id = $1 and gallery_id = $2", [reelId, req.gallery.id])
      if (!reel) throw notFound()
      if (!reel.is_public && !req.unlocked) throw forbidden()
    } else if (!req.unlocked) throw forbidden()
    if (mediaId) {
      const m = await one("select id from media where id = $1 and gallery_id = $2", [mediaId, req.gallery.id])
      if (!m) throw notFound()
    }
    // One gallery view per visitor per day.
    if (type === "view") {
      const dup = await one("select 1 from events where gallery_id = $1 and type = 'view' and visitor = $2 and created_at > now() - interval '1 day' limit 1", [req.gallery.id, visitorHash(req)])
      if (dup) return res.json({ ok: true })
    }
    await record(req, { galleryId: req.gallery.id, mediaId, reelId, type })
    res.json({ ok: true })
  }),
)

export { serializeMedia }
