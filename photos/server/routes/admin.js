import { Router } from "express"
import { one, many, query, withTransaction } from "../db/pool.js"
import { config } from "../config.js"
import { route, bad, notFound, forbidden, str, int } from "../lib/http.js"
import { hashPassword, checkPassword, startSession, endSession, requireUser, noContributor, ROLES, validPassword, normalizeEmail, validEmail } from "../lib/auth.js"
import { rateLimit } from "../lib/ratelimit.js"
import { gallerySlug, slugify, randomSuffix } from "../lib/slug.js"
import { storage, keys, safeName } from "../storage/index.js"
import { kindFromName, contentTypeFor, serializeAll, serializeMedia } from "../lib/media.js"
import { serializeGallery, DEFAULT_SETTINGS, RESERVED_ALBUM_SLUGS, toDateString } from "../lib/gallery.js"
import { enqueue, poke, recoverStale } from "../jobs/queue.js"

export const admin = Router()

// Compared against when the email is unknown, so a login attempt takes the
// same time whether or not the account exists.
const DUMMY_HASH = await hashPassword("not-a-real-password")

// ---- Session ---------------------------------------------------------------

admin.post(
  "/login",
  rateLimit({ name: "login", limit: 10, windowMs: 15 * 60 * 1000 }),
  route(async (req, res) => {
    const email = normalizeEmail(req.body?.email)
    const password = str(req.body?.password, 200)
    const user = await one("select * from users where email = $1 and not disabled", [email])
    // Same timing whether or not the account exists.
    const ok = user ? await checkPassword(password, user.password_hash) : await checkPassword(password, DUMMY_HASH).then(() => false)
    if (!ok) throw forbidden("Email or password is not right")
    await startSession(res, user.id)
    res.json({ user: publicUser(user) })
  }),
)

admin.post(
  "/logout",
  route(async (req, res) => {
    await endSession(req, res)
    res.json({ ok: true })
  }),
)

admin.get(
  "/me",
  route(async (req, res) => {
    const { currentUser } = await import("../lib/auth.js")
    const user = await currentUser(req)
    res.json({ user: user ? publicUser(user) : null, needsSetup: !user && !(await one("select 1 from users limit 1")) })
  }),
)

const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, disabled: u.disabled, createdAt: u.created_at })

// Everything below needs a signed-in admin.
admin.use(requireUser())

// ---- Users (owner only) ----------------------------------------------------

admin.get(
  "/users",
  requireUser("owner"),
  route(async (req, res) => {
    res.json({ users: (await many("select * from users order by created_at")).map(publicUser) })
  }),
)

admin.post(
  "/users",
  requireUser("owner"),
  route(async (req, res) => {
    const email = normalizeEmail(req.body?.email)
    const name = str(req.body?.name, 120)
    const role = ROLES.includes(req.body?.role) ? req.body.role : "editor"
    const password = req.body?.password
    if (!validEmail(email)) throw bad("Enter a valid email address")
    if (!validPassword(password)) throw bad("Password must be at least 10 characters")
    if (await one("select 1 from users where email = $1", [email])) throw bad("That email already has an account")
    const u = await one("insert into users(email, name, role, password_hash) values ($1, $2, $3, $4) returning *", [email, name, role, await hashPassword(password)])
    res.json({ user: publicUser(u) })
  }),
)

admin.patch(
  "/users/:id",
  requireUser("owner"),
  route(async (req, res) => {
    const u = await one("select * from users where id = $1", [int(req.params.id)])
    if (!u) throw notFound()
    const b = req.body || {}
    const name = b.name !== undefined ? str(b.name, 120) : u.name
    const role = ROLES.includes(b.role) ? b.role : u.role
    const disabled = b.disabled !== undefined ? Boolean(b.disabled) : u.disabled
    if (u.id === req.user.id && (role !== "owner" || disabled)) throw bad("You cannot demote or disable your own account")
    let hash = u.password_hash
    if (b.password) {
      if (!validPassword(b.password)) throw bad("Password must be at least 10 characters")
      hash = await hashPassword(b.password)
      await query("delete from sessions where user_id = $1", [u.id])
    }
    const out = await one("update users set name = $2, role = $3, disabled = $4, password_hash = $5 where id = $1 returning *", [u.id, name, role, disabled, hash])
    res.json({ user: publicUser(out) })
  }),
)

admin.delete(
  "/users/:id",
  requireUser("owner"),
  route(async (req, res) => {
    const id = int(req.params.id)
    if (id === req.user.id) throw bad("You cannot delete your own account")
    await query("delete from users where id = $1", [id])
    res.json({ ok: true })
  }),
)

// ---- Galleries -------------------------------------------------------------

admin.get(
  "/galleries",
  route(async (req, res) => {
    const rows = await many(`
      select g.*,
        (select count(*) from media m where m.gallery_id = g.id and m.trashed_at is null and m.kind = 'photo' and m.album_id is not null) as photos,
        (select count(*) from media m where m.gallery_id = g.id and m.trashed_at is null and m.kind = 'video') as videos,
        (select coalesce(sum(size_bytes), 0) from media m where m.gallery_id = g.id and m.trashed_at is null) as bytes,
        (select count(*) from media m where m.gallery_id = g.id and m.trashed_at is null and m.status in ('uploading','uploaded','processing')) as pending,
        (select count(*) from media m where m.gallery_id = g.id and m.trashed_at is null and m.status in ('failed','attention')) as flagged,
        (select count(distinct visitor) from events e where e.gallery_id = g.id and e.type = 'view') as views,
        (select count(*) from events e where e.gallery_id = g.id and e.type like 'download%') as downloads,
        (select count(*) from favorites f join guests gu on gu.id = f.guest_id where gu.gallery_id = g.id) as favorites,
        (select count(*) from guests gu where gu.gallery_id = g.id) as guests,
        (select count(*) from links l where l.gallery_id = g.id) as links
      from galleries g order by g.trashed_at nulls first, g.event_date desc nulls last, g.created_at desc`)
    res.json({
      galleries: rows.map((g) => ({
        id: g.id,
        slug: g.slug,
        title: g.title,
        eventDate: g.event_date ? toDateString(g.event_date) : null,
        visible: g.visible,
        hasPassword: Boolean(g.password_hash),
        photos: g.photos,
        videos: g.videos,
        bytes: g.bytes,
        pending: g.pending,
        flagged: g.flagged,
        views: g.views,
        downloads: g.downloads,
        favorites: g.favorites,
        guests: g.guests,
        links: g.links,
        trashedAt: g.trashed_at,
        createdAt: g.created_at,
        url: `${config.publicUrl}/${g.slug}`,
      })),
    })
  }),
)

admin.post(
  "/galleries",
  route(async (req, res) => {
    const title = str(req.body?.title, 160)
    if (!title) throw bad("A title is needed")
    const eventDate = dateOrNull(req.body?.eventDate)
    let slug = gallerySlug(title)
    while (await one("select 1 from galleries where slug = $1", [slug])) slug = gallerySlug(title)
    const g = await one("insert into galleries(slug, title, event_date) values ($1, $2, $3) returning *", [slug, title, eventDate])
    // A default album takes files dropped without a folder.
    await query("insert into albums(gallery_id, name, slug, sort) values ($1, 'Photos', 'photos', 0)", [g.id])
    res.json({ gallery: await fullGallery(g.id) })
  }),
)

async function loadAdminGallery(id) {
  const g = await one("select * from galleries where id = $1", [int(id)])
  if (!g) throw notFound("Gallery not found")
  return g
}

async function fullGallery(id) {
  const g = await loadAdminGallery(id)
  const out = await serializeGallery(g, { admin: true })
  const media = await many("select * from media where gallery_id = $1 and trashed_at is null order by album_id nulls last, sort, captured_at nulls last, filename, id", [g.id])
  out.media = await serializeAll(media, { admin: true })
  out.albumRows = await many("select id, name, slug, sort, cover_media_id as \"coverMediaId\" from albums where gallery_id = $1 order by sort, id", [g.id])
  out.url = `${config.publicUrl}/${g.slug}`
  out.trash = await serializeAll(await many("select * from media where gallery_id = $1 and trashed_at is not null order by trashed_at desc", [g.id]), { admin: true })
  out.links = await linksOf(g.id)
  return out
}

admin.get(
  "/galleries/:id",
  route(async (req, res) => {
    res.json({ gallery: await fullGallery(req.params.id) })
  }),
)

const SETTING_OPTIONS = {
  layout: ["full-bleed", "split", "video", "mosaic", "title-card"],
  theme: ["dark", "light"],
  font: ["serif", "display"],
  grid: ["justified", "masonry", "square"],
  density: ["comfortable", "compact"],
  animation: ["fade", "zoom", "none"],
  align: ["center", "left"],
}

admin.patch(
  "/galleries/:id",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const b = req.body || {}
    const fields = {
      title: b.title !== undefined ? str(b.title, 160) || g.title : g.title,
      subtitle: b.subtitle !== undefined ? str(b.subtitle, 200) : g.subtitle,
      event_date: b.eventDate !== undefined ? dateOrNull(b.eventDate) : g.event_date,
      location: b.location !== undefined ? str(b.location, 200) : g.location,
      intro: b.intro !== undefined ? str(b.intro, 600) : g.intro,
      visible: b.visible !== undefined ? Boolean(b.visible) : g.visible,
      cover_media_id: b.coverMediaId !== undefined ? (b.coverMediaId ? int(b.coverMediaId) : null) : g.cover_media_id,
    }
    if (fields.cover_media_id) {
      const m = await one("select id from media where id = $1 and gallery_id = $2 and trashed_at is null", [fields.cover_media_id, g.id])
      if (!m) throw bad("Cover photo must belong to this gallery")
    }
    // Settings: only known keys with known values get through.
    const settings = { ...DEFAULT_SETTINGS, ...(g.settings || {}) }
    if (b.settings && typeof b.settings === "object") {
      for (const [k, options] of Object.entries(SETTING_OPTIONS)) {
        if (b.settings[k] !== undefined) {
          if (!options.includes(b.settings[k])) throw bad(`Invalid ${k}`)
          settings[k] = b.settings[k]
        }
      }
      if (b.settings.focal) {
        const x = Number(b.settings.focal.x)
        const y = Number(b.settings.focal.y)
        if (!(x >= 0 && x <= 1 && y >= 0 && y <= 1)) throw bad("Focal point must be within the image")
        settings.focal = { x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 }
      }
      if (b.settings.mosaicIds !== undefined) {
        const ids = (Array.isArray(b.settings.mosaicIds) ? b.settings.mosaicIds : []).map((v) => int(v)).filter(Boolean).slice(0, 5)
        if (ids.length) {
          const rows = await many("select id from media where gallery_id = $1 and id = any($2::bigint[]) and trashed_at is null", [g.id, ids])
          if (rows.length !== ids.length) throw bad("Mosaic photos must belong to this gallery")
        }
        settings.mosaicIds = ids
      }
      if (b.settings.coverVideoId !== undefined) {
        settings.coverVideoId = b.settings.coverVideoId ? int(b.settings.coverVideoId) : null
      }
    }
    let passwordHash = g.password_hash
    let passwordVersion = g.password_version
    if (b.password !== undefined) {
      if (b.password === null || b.password === "") {
        passwordHash = null
      } else {
        const pw = str(b.password, 200)
        if (pw.length < 4) throw bad("Gallery password must be at least 4 characters")
        passwordHash = await hashPassword(pw)
      }
      passwordVersion = g.password_version + 1
    }
    await query(
      `update galleries set title = $2, subtitle = $3, event_date = $4, location = $5, intro = $6, visible = $7, cover_media_id = $8,
         settings = $9, password_hash = $10, password_version = $11, updated_at = now() where id = $1`,
      [g.id, fields.title, fields.subtitle, fields.event_date, fields.location, fields.intro, fields.visible, fields.cover_media_id, JSON.stringify(settings), passwordHash, passwordVersion],
    )
    res.json({ gallery: await fullGallery(g.id) })
  }),
)

admin.delete(
  "/galleries/:id",
  noContributor,
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    await query("update galleries set trashed_at = now(), visible = false where id = $1", [g.id])
    res.json({ ok: true })
  }),
)

admin.post(
  "/galleries/:id/restore",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    await query("update galleries set trashed_at = null where id = $1", [g.id])
    res.json({ gallery: await fullGallery(g.id) })
  }),
)

// Client logo: a small PNG or SVG sent as the raw request body.
admin.put(
  "/galleries/:id/logo",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const type = req.get("content-type") || ""
    const ext = type.includes("svg") ? ".svg" : type.includes("png") ? ".png" : type.includes("jpeg") ? ".jpg" : type.includes("webp") ? ".webp" : null
    if (!ext) throw bad("Logo must be PNG, SVG, JPEG or WebP")
    if (!req.body?.length) throw bad("Empty file")
    const key = keys.logo(g.id, `-${randomSuffix(4)}${ext}`)
    await storage.putObject(key, req.body, type.split(";")[0])
    if (g.client_logo_key) await storage.deleteMany([g.client_logo_key])
    await query("update galleries set client_logo_key = $2, updated_at = now() where id = $1", [g.id, key])
    res.json({ gallery: await fullGallery(g.id) })
  }),
)

admin.delete(
  "/galleries/:id/logo",
  noContributor,
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    if (g.client_logo_key) await storage.deleteMany([g.client_logo_key])
    await query("update galleries set client_logo_key = null, updated_at = now() where id = $1", [g.id])
    res.json({ gallery: await fullGallery(g.id) })
  }),
)

// ---- Uploads ---------------------------------------------------------------
//
// The browser sends the file list. For each file we create (or find) the
// media row and hand back what it needs to upload straight to storage:
// a single PUT URL for small files, or a multipart upload id plus the parts
// already stored, so a dropped connection or a re-dropped folder resumes.

async function albumForPath(galleryId, relPath, cache) {
  const parts = relPath.split("/").filter(Boolean)
  // Browsers include the dropped folder itself as the first segment, so
  // "Event/Keynote/x.jpg" is album Keynote and "Event/x.jpg" is loose.
  const folder = parts.length >= 3 ? parts[1] : null
  const name = folder ? folder.trim().slice(0, 80) : "Photos"
  if (cache.has(name)) return cache.get(name)
  let slug = slugify(name) || "album"
  if (RESERVED_ALBUM_SLUGS.has(slug)) slug = `${slug}-album`
  let album = await one("select * from albums where gallery_id = $1 and (lower(name) = lower($2) or slug = $3)", [galleryId, name, slug])
  if (!album) {
    const max = await one("select coalesce(max(sort), -1) + 1 as next from albums where gallery_id = $1", [galleryId])
    album = await one("insert into albums(gallery_id, name, slug, sort) values ($1, $2, $3, $4) returning *", [galleryId, name, slug, max.next])
  }
  cache.set(name, album)
  return album
}

admin.post(
  "/galleries/:id/uploads",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const files = Array.isArray(req.body?.files) ? req.body.files.slice(0, 5000) : []
    const target = req.body?.target === "reel" ? "reel" : "album"
    if (!files.length) throw bad("No files")
    const cache = new Map()
    const out = []
    for (const f of files) {
      const relPath = str(f.path, 600).replace(/^\/+/, "")
      const filename = relPath.split("/").pop()
      const size = Number(f.size)
      const kind = kindFromName(filename)
      if (!kind || (target === "reel" && kind !== "video")) {
        out.push({ path: relPath, skipped: true, reason: target === "reel" ? "Reels must be videos" : "Unsupported file type" })
        continue
      }
      if (!(size > 0) || size > config.maxFileBytes) {
        out.push({ path: relPath, skipped: true, reason: "File is empty or too large" })
        continue
      }
      const album = target === "reel" ? null : await albumForPath(g.id, relPath, cache)
      // Same path and size already in this gallery: finished → skip,
      // unfinished → resume.
      const existing = await one(
        "select * from media where gallery_id = $1 and rel_path = $2 and size_bytes = $3 and trashed_at is null and coalesce(album_id, 0) = coalesce($4::bigint, 0) order by id desc limit 1",
        [g.id, relPath, size, album?.id || null],
      )
      if (existing && existing.status !== "uploading") {
        out.push({ path: relPath, mediaId: existing.id, skipped: true, reason: "Already uploaded" })
        continue
      }
      let m = existing
      if (!m) {
        const contentType = contentTypeFor(filename, str(f.type, 100))
        // New items share the highest sort value so they land at the end,
        // ordered among themselves by capture time then filename.
        const sort = await one("select coalesce(max(sort), 0) as next from media where gallery_id = $1 and coalesce(album_id, 0) = coalesce($2::bigint, 0)", [g.id, album?.id || null])
        m = await one(
          `insert into media(gallery_id, album_id, kind, filename, rel_path, size_bytes, content_type, original_key, sort, captured_at)
           values ($1, $2, $3, $4, $5, $6, $7, '', $8, $9) returning *`,
          [g.id, album?.id || null, kind, filename, relPath, size, contentType, sort.next, f.lastModified ? new Date(Number(f.lastModified)) : null],
        )
        const key = keys.original(g.id, m.id, filename)
        let uploadId = null
        if (size > config.partSizeBytes) uploadId = await storage.createMultipart(key, contentType)
        m = await one("update media set original_key = $2, upload_id = $3 where id = $1 returning *", [m.id, key, uploadId])
        if (target === "reel") {
          await query("insert into reels(gallery_id, media_id, title, sort) values ($1, $2, $3, (select coalesce(max(sort), -1) + 1 from reels where gallery_id = $1))", [g.id, m.id, filename.replace(/\.[^.]+$/, "")])
        }
      }
      const entry = { path: relPath, mediaId: m.id, albumId: m.album_id, partSize: config.partSizeBytes }
      if (m.upload_id) {
        entry.multipart = true
        entry.parts = await storage.listParts(m.original_key, m.upload_id)
      } else {
        entry.multipart = false
        entry.putUrl = await storage.signPutUrl(m.original_key, m.content_type)
      }
      out.push(entry)
    }
    res.json({ files: out })
  }),
)

async function loadUploading(id) {
  const m = await one("select * from media where id = $1 and status = 'uploading' and trashed_at is null", [int(id)])
  if (!m) throw notFound("Upload not found or already finished")
  return m
}

admin.post(
  "/uploads/:id/part-url",
  route(async (req, res) => {
    const m = await loadUploading(req.params.id)
    const n = int(req.body?.partNumber)
    if (!m.upload_id || !(n >= 1 && n <= 10000)) throw bad("Bad part")
    res.json({ url: await storage.signPartUrl(m.original_key, m.upload_id, n) })
  }),
)

admin.get(
  "/uploads/:id/parts",
  route(async (req, res) => {
    const m = await loadUploading(req.params.id)
    res.json({ parts: m.upload_id ? await storage.listParts(m.original_key, m.upload_id) : [] })
  }),
)

admin.post(
  "/uploads/:id/complete",
  route(async (req, res) => {
    const m = await loadUploading(req.params.id)
    if (m.upload_id) {
      const parts = (Array.isArray(req.body?.parts) ? req.body.parts : []).map((p) => ({ partNumber: int(p.partNumber), etag: str(p.etag, 200) })).filter((p) => p.partNumber && p.etag)
      if (!parts.length) throw bad("No parts")
      await storage.completeMultipart(m.original_key, m.upload_id, parts)
    }
    const head = await storage.head(m.original_key)
    if (!head) throw bad("The file did not arrive in storage")
    if (Number(head.size) !== Number(m.size_bytes)) {
      await storage.deleteMany([m.original_key])
      throw bad(`Stored size ${head.size} does not match the file size ${m.size_bytes}; upload it again`)
    }
    await query("update media set status = 'uploaded', upload_id = null where id = $1", [m.id])
    await enqueue("process_media", { mediaId: m.id })
    poke()
    res.json({ ok: true, mediaId: m.id })
  }),
)

admin.post(
  "/uploads/:id/abort",
  route(async (req, res) => {
    const m = await loadUploading(req.params.id)
    if (m.upload_id) await storage.abortMultipart(m.original_key, m.upload_id)
    await query("delete from media where id = $1", [m.id])
    res.json({ ok: true })
  }),
)

// Status of in-flight processing, for the admin to poll.
admin.get(
  "/galleries/:id/status",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const rows = await many("select status, count(*) as n from media where gallery_id = $1 and trashed_at is null group by status", [g.id])
    const recent = await many("select * from media where gallery_id = $1 and trashed_at is null and status <> 'uploading' order by id desc limit 500", [g.id])
    res.json({ counts: Object.fromEntries(rows.map((r) => [r.status, r.n])), media: await serializeAll(recent, { admin: true }) })
  }),
)

// ---- Albums ----------------------------------------------------------------

async function loadAlbum(id) {
  const a = await one("select * from albums where id = $1", [int(id)])
  if (!a) throw notFound("Album not found")
  return a
}

async function bump(galleryId) {
  await query("update galleries set content_version = content_version + 1, updated_at = now() where id = $1", [galleryId])
}

admin.post(
  "/galleries/:id/albums",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const name = str(req.body?.name, 80)
    if (!name) throw bad("Album needs a name")
    let slug = slugify(name) || "album"
    if (RESERVED_ALBUM_SLUGS.has(slug)) slug = `${slug}-album`
    while (await one("select 1 from albums where gallery_id = $1 and slug = $2", [g.id, slug])) slug = `${slug}-${randomSuffix(3)}`
    const max = await one("select coalesce(max(sort), -1) + 1 as next from albums where gallery_id = $1", [g.id])
    await query("insert into albums(gallery_id, name, slug, sort) values ($1, $2, $3, $4)", [g.id, name, slug, max.next])
    res.json({ gallery: await fullGallery(g.id) })
  }),
)

admin.patch(
  "/albums/:id",
  route(async (req, res) => {
    const a = await loadAlbum(req.params.id)
    const b = req.body || {}
    const name = b.name !== undefined ? str(b.name, 80) || a.name : a.name
    let coverMediaId = a.cover_media_id
    if (b.coverMediaId !== undefined) {
      coverMediaId = b.coverMediaId ? int(b.coverMediaId) : null
      if (coverMediaId && !(await one("select 1 from media where id = $1 and gallery_id = $2", [coverMediaId, a.gallery_id]))) throw bad("Cover must be from this gallery")
    }
    // Renaming keeps the slug: album links already shared must not break.
    await query("update albums set name = $2, cover_media_id = $3 where id = $1", [a.id, name, coverMediaId])
    if (name !== a.name) await bump(a.gallery_id)
    res.json({ gallery: await fullGallery(a.gallery_id) })
  }),
)

admin.post(
  "/galleries/:id/albums/reorder",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const ids = (Array.isArray(req.body?.ids) ? req.body.ids : []).map((v) => int(v)).filter(Boolean)
    await withTransaction(async (c) => {
      for (let i = 0; i < ids.length; i++) await c.query("update albums set sort = $2 where id = $1 and gallery_id = $3", [ids[i], i, g.id])
    })
    await bump(g.id)
    res.json({ gallery: await fullGallery(g.id) })
  }),
)

admin.delete(
  "/albums/:id",
  noContributor,
  route(async (req, res) => {
    const a = await loadAlbum(req.params.id)
    const count = await one("select count(*) as n from albums where gallery_id = $1", [a.gallery_id])
    if (count.n <= 1) throw bad("A gallery needs at least one album")
    // Photos move to trash with the album.
    await query("update media set trashed_at = now() where album_id = $1 and trashed_at is null", [a.id])
    await query("delete from albums where id = $1", [a.id])
    await bump(a.gallery_id)
    res.json({ gallery: await fullGallery(a.gallery_id) })
  }),
)

// ---- Media -----------------------------------------------------------------

async function loadMedia(id) {
  const m = await one("select * from media where id = $1", [int(id)])
  if (!m) throw notFound("Photo not found")
  return m
}

admin.patch(
  "/media/:id",
  route(async (req, res) => {
    const m = await loadMedia(req.params.id)
    const b = req.body || {}
    const highlighted = b.highlighted !== undefined ? Boolean(b.highlighted) : m.highlighted
    let albumId = m.album_id
    if (b.albumId !== undefined && m.album_id) {
      const a = await one("select id from albums where id = $1 and gallery_id = $2", [int(b.albumId), m.gallery_id])
      if (!a) throw bad("Album must be in this gallery")
      albumId = a.id
    }
    await query("update media set highlighted = $2, album_id = $3 where id = $1", [m.id, highlighted, albumId])
    if (albumId !== m.album_id) await bump(m.gallery_id)
    res.json({ media: await serializeMedia(await loadMedia(m.id), { admin: true }) })
  }),
)

admin.post(
  "/media/bulk",
  route(async (req, res) => {
    const ids = (Array.isArray(req.body?.ids) ? req.body.ids : []).map((v) => int(v)).filter(Boolean).slice(0, 5000)
    const action = str(req.body?.action, 40)
    if (!ids.length) throw bad("Nothing selected")
    const rows = await many("select distinct gallery_id from media where id = any($1::bigint[])", [ids])
    if (rows.length !== 1) throw bad("Select photos from one gallery")
    const galleryId = rows[0].gallery_id
    if (action === "trash" && req.user.role === "contributor") throw forbidden("Contributors can upload and arrange but not delete. Ask an owner or editor.")
    if (action === "trash") await query("update media set trashed_at = now() where id = any($1::bigint[])", [ids])
    else if (action === "restore") await query("update media set trashed_at = null where id = any($1::bigint[])", [ids])
    else if (action === "star") await query("update media set highlighted = true where id = any($1::bigint[])", [ids])
    else if (action === "unstar") await query("update media set highlighted = false where id = any($1::bigint[])", [ids])
    else if (action === "move") {
      const a = await one("select id from albums where id = $1 and gallery_id = $2", [int(req.body?.albumId), galleryId])
      if (!a) throw bad("Album must be in this gallery")
      await query("update media set album_id = $2 where id = any($1::bigint[]) and album_id is not null", [ids, a.id])
    } else if (action === "reprocess") {
      for (const id of ids) await enqueue("process_media", { mediaId: id }, { dedupe: true })
      poke()
    } else throw bad("Unknown action")
    await bump(galleryId)
    res.json({ gallery: await fullGallery(galleryId) })
  }),
)

admin.post(
  "/albums/:id/reorder",
  route(async (req, res) => {
    const a = await loadAlbum(req.params.id)
    const ids = (Array.isArray(req.body?.ids) ? req.body.ids : []).map((v) => int(v)).filter(Boolean)
    await withTransaction(async (c) => {
      for (let i = 0; i < ids.length; i++) await c.query("update media set sort = $2 where id = $1 and album_id = $3", [ids[i], i, a.id])
    })
    await bump(a.gallery_id)
    res.json({ ok: true })
  }),
)

// Default order: capture time, then filename.
admin.post(
  "/albums/:id/sort-by-capture",
  route(async (req, res) => {
    const a = await loadAlbum(req.params.id)
    await query(
      `with ordered as (select id, row_number() over (order by captured_at nulls last, filename, id) - 1 as rn from media where album_id = $1 and trashed_at is null)
       update media m set sort = o.rn from ordered o where o.id = m.id`,
      [a.id],
    )
    await bump(a.gallery_id)
    res.json({ gallery: await fullGallery(a.gallery_id) })
  }),
)

admin.delete(
  "/media/:id",
  noContributor,
  route(async (req, res) => {
    const m = await loadMedia(req.params.id)
    await query("update media set trashed_at = now() where id = $1", [m.id])
    await bump(m.gallery_id)
    res.json({ ok: true })
  }),
)

// ---- Reels -----------------------------------------------------------------

admin.patch(
  "/reels/:id",
  route(async (req, res) => {
    const r = await one("select * from reels where id = $1", [int(req.params.id)])
    if (!r) throw notFound("Reel not found")
    const b = req.body || {}
    const title = b.title !== undefined ? str(b.title, 160) : r.title
    const description = b.description !== undefined ? str(b.description, 600) : r.description
    const isPublic = b.isPublic !== undefined ? Boolean(b.isPublic) : r.is_public
    const clipStart = b.clipStart !== undefined ? Math.max(0, Number(b.clipStart) || 0) : r.clip_start_s
    const sort = b.sort !== undefined ? int(b.sort, r.sort) : r.sort
    await query("update reels set title = $2, description = $3, is_public = $4, clip_start_s = $5, sort = $6 where id = $1", [r.id, title, description, isPublic, clipStart, sort])
    if (clipStart !== r.clip_start_s) {
      await enqueue("cover_clip", { reelId: r.id }, { dedupe: true })
      poke()
    }
    res.json({ gallery: await fullGallery(r.gallery_id) })
  }),
)

admin.delete(
  "/reels/:id",
  noContributor,
  route(async (req, res) => {
    const r = await one("select * from reels where id = $1", [int(req.params.id)])
    if (!r) throw notFound("Reel not found")
    await query("update media set trashed_at = now() where id = $1", [r.media_id])
    await query("delete from reels where id = $1", [r.id])
    res.json({ gallery: await fullGallery(r.gallery_id) })
  }),
)

// ---- Links -----------------------------------------------------------------
//
// Extra share links per gallery: each shows chosen albums and has its own
// optional password. The gallery's main slug stays the link to everything.

async function linksOf(galleryId) {
  const rows = await many("select * from links where gallery_id = $1 order by created_at, id", [galleryId])
  return rows.map((l) => ({
    id: l.id,
    slug: l.slug,
    name: l.name,
    albumIds: l.album_ids ? l.album_ids.map(Number) : null,
    includeReels: l.include_reels,
    hasPassword: Boolean(l.password_hash),
    visible: l.visible,
    createdAt: l.created_at,
    url: `${config.publicUrl}/${l.slug}`,
  }))
}

admin.get(
  "/galleries/:id/links",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    res.json({ links: await linksOf(g.id) })
  }),
)

async function linkFields(g, b, current = {}) {
  const name = b.name !== undefined ? str(b.name, 80) : current.name || ""
  let albumIds = current.album_ids || null
  if (b.albumIds !== undefined) {
    if (b.albumIds === null) albumIds = null
    else {
      const ids = (Array.isArray(b.albumIds) ? b.albumIds : []).map((v) => int(v)).filter(Boolean)
      if (!ids.length) throw bad("Pick at least one album, or choose all albums")
      const rows = await many("select id from albums where gallery_id = $1 and id = any($2::bigint[])", [g.id, ids])
      if (rows.length !== ids.length) throw bad("Albums must belong to this gallery")
      albumIds = ids
    }
  }
  const includeReels = b.includeReels !== undefined ? Boolean(b.includeReels) : current.include_reels ?? true
  const visible = b.visible !== undefined ? Boolean(b.visible) : current.visible ?? true
  let passwordHash = current.password_hash || null
  let passwordVersion = current.password_version || 0
  if (b.password !== undefined) {
    if (b.password === null || b.password === "") passwordHash = null
    else {
      const pw = str(b.password, 200)
      if (pw.length < 4) throw bad("Link password must be at least 4 characters")
      passwordHash = await hashPassword(pw)
    }
    passwordVersion++
  }
  return { name, albumIds, includeReels, visible, passwordHash, passwordVersion }
}

admin.post(
  "/galleries/:id/links",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const f = await linkFields(g, req.body || {})
    let slug = gallerySlug(f.name ? `${g.title} ${f.name}` : g.title)
    while ((await one("select 1 from galleries where slug = $1", [slug])) || (await one("select 1 from links where slug = $1", [slug]))) slug = gallerySlug(g.title)
    await query(
      "insert into links(gallery_id, slug, name, album_ids, include_reels, password_hash, password_version, visible) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [g.id, slug, f.name, f.albumIds, f.includeReels, f.passwordHash, f.passwordVersion, f.visible],
    )
    res.json({ links: await linksOf(g.id) })
  }),
)

admin.patch(
  "/links/:id",
  route(async (req, res) => {
    const l = await one("select * from links where id = $1", [int(req.params.id)])
    if (!l) throw notFound("Link not found")
    const g = await loadAdminGallery(l.gallery_id)
    const f = await linkFields(g, req.body || {}, l)
    await query(
      "update links set name = $2, album_ids = $3, include_reels = $4, password_hash = $5, password_version = $6, visible = $7 where id = $1",
      [l.id, f.name, f.albumIds, f.includeReels, f.passwordHash, f.passwordVersion, f.visible],
    )
    // Album changes make the link's cached zip stale.
    await query("delete from zips where link_id = $1", [l.id])
    res.json({ links: await linksOf(g.id) })
  }),
)

admin.delete(
  "/links/:id",
  noContributor,
  route(async (req, res) => {
    const l = await one("select * from links where id = $1", [int(req.params.id)])
    if (!l) throw notFound("Link not found")
    await query("delete from links where id = $1", [l.id])
    res.json({ links: await linksOf(l.gallery_id) })
  }),
)

// ---- Favorites view --------------------------------------------------------

async function favoritesReport(galleryId) {
  const guests = await many("select * from guests where gallery_id = $1 order by first_seen_at desc", [galleryId])
  const picks = await many(
    `select f.guest_id, f.created_at, m.* from favorites f join media m on m.id = f.media_id join guests g on g.id = f.guest_id
     where g.gallery_id = $1 and m.trashed_at is null order by f.created_at`,
    [galleryId],
  )
  const out = []
  for (const g of guests) {
    const mine = picks.filter((p) => p.guest_id === g.id)
    out.push({
      id: g.id,
      name: g.name,
      email: g.email,
      firstSeen: g.first_seen_at,
      lastSeen: g.last_seen_at,
      picks: await serializeAll(mine, { admin: true }),
    })
  }
  return out
}

admin.get(
  "/galleries/:id/favorites",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    res.json({ guests: await favoritesReport(g.id) })
  }),
)

admin.get(
  "/galleries/:id/favorites.csv",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const guests = await favoritesReport(g.id)
    const rows = [["Name", "Email", "First seen", "Filename", "Album", "Favorited at"]]
    for (const gu of guests) for (const p of gu.picks) rows.push([gu.name, gu.email, iso(gu.firstSeen), p.filename, p.relPath.split("/").slice(0, -1).join("/"), iso(p.createdAt)])
    sendCsv(res, `${g.slug}-favorites.csv`, rows)
  }),
)

// ---- Analytics -------------------------------------------------------------

admin.get(
  "/galleries/:id/analytics",
  route(async (req, res) => {
    const g = await loadAdminGallery(req.params.id)
    const totals = await one(
      `select
         count(distinct visitor) filter (where type = 'view') as visitors,
         count(*) filter (where type = 'view') as views,
         count(*) filter (where type = 'lightbox') as lightbox,
         count(*) filter (where type = 'download_social') as social,
         count(*) filter (where type = 'download_full') as full,
         count(*) filter (where type = 'download_zip') as zips,
         count(*) filter (where type = 'reel_play') as reel_plays,
         count(*) filter (where type = 'reel_complete') as reel_completes,
         count(*) filter (where type = 'reel_share') as reel_shares,
         count(*) filter (where type = 'reel_download') as reel_downloads
       from events where gallery_id = $1`,
      [g.id],
    )
    const perDay = await many(
      "select date_trunc('day', created_at)::date as day, count(distinct visitor) filter (where type = 'view') as visitors, count(*) filter (where type like 'download%') as downloads from events where gallery_id = $1 and created_at > now() - interval '90 days' group by 1 order by 1",
      [g.id],
    )
    const perMedia = await many(
      `select m.id, m.filename, m.kind, m.derivatives,
         count(*) filter (where e.type = 'lightbox') as lightbox,
         count(*) filter (where e.type = 'download_social') as social,
         count(*) filter (where e.type = 'download_full') as full,
         (select count(*) from favorites f where f.media_id = m.id) as favorites
       from media m join events e on e.media_id = m.id where m.gallery_id = $1 and m.trashed_at is null
       group by m.id order by (count(*) filter (where e.type like 'download%')) desc, count(*) desc limit 100`,
      [g.id],
    )
    const perReel = await many(
      `select r.id, r.title, r.is_public,
         count(*) filter (where e.type = 'reel_play') as plays,
         count(*) filter (where e.type = 'reel_complete') as completes,
         count(*) filter (where e.type = 'reel_share') as shares,
         count(*) filter (where e.type = 'reel_download') as downloads
       from reels r left join events e on e.reel_id = r.id where r.gallery_id = $1 group by r.id order by r.sort`,
      [g.id],
    )
    const media = []
    for (const m of perMedia) media.push({ id: m.id, filename: m.filename, kind: m.kind, lightbox: m.lightbox, social: m.social, full: m.full, favorites: m.favorites, thumb: m.derivatives?.thumb?.key ? await storage.signGetUrl(m.derivatives.thumb.key) : null })
    res.json({ totals, perDay: perDay.map((d) => ({ day: toDateString(d.day), visitors: d.visitors, downloads: d.downloads })), media, reels: perReel.map((r) => ({ id: r.id, title: r.title, isPublic: r.is_public, plays: r.plays, completes: r.completes, shares: r.shares, downloads: r.downloads })) })
  }),
)

// ---- Guests export (the GoHighLevel bridge) --------------------------------

admin.get(
  "/guests.csv",
  route(async (req, res) => {
    const rows = await many(
      "select gu.email, gu.name, gu.first_seen_at, gu.last_seen_at, g.title, g.slug, (select count(*) from favorites f where f.guest_id = gu.id) as favorites from guests gu join galleries g on g.id = gu.gallery_id order by gu.first_seen_at desc",
    )
    const csv = [["Email", "Name", "Gallery", "Gallery link", "First seen", "Last seen", "Favorites"]]
    for (const r of rows) csv.push([r.email, r.name, r.title, `${config.publicUrl}/${r.slug}`, iso(r.first_seen_at), iso(r.last_seen_at), String(r.favorites)])
    sendCsv(res, "iconic-photos-guests.csv", csv)
  }),
)

// ---- Jobs (for the dashboard) ----------------------------------------------

admin.get(
  "/jobs",
  route(async (req, res) => {
    const rows = await many("select id, type, payload, status, attempts, error, created_at, finished_at from jobs where status in ('queued','running','failed') order by id desc limit 100")
    res.json({ jobs: rows })
  }),
)

// Kicks anything that looks stuck: jobs without a heartbeat, uploaded
// files with no job, failed jobs for files still waiting.
admin.post(
  "/jobs/recover",
  route(async (req, res) => {
    res.json(await recoverStale())
  }),
)

admin.post(
  "/jobs/:id/retry",
  route(async (req, res) => {
    await query("update jobs set status = 'queued', attempts = 0, run_after = now(), error = null where id = $1", [int(req.params.id)])
    poke()
    res.json({ ok: true })
  }),
)

// ---- helpers ---------------------------------------------------------------

function dateOrNull(v) {
  if (!v) return null
  const s = String(v).slice(0, 10)
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null
}

const iso = (d) => (d ? new Date(d).toISOString() : "")

function sendCsv(res, name, rows) {
  const esc = (v) => {
    const s = String(v ?? "")
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  res.set("Content-Type", "text/csv; charset=utf-8")
  res.set("Content-Disposition", `attachment; filename="${name}"`)
  res.send("﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n") + "\r\n")
}
