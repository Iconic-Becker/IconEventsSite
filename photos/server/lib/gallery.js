// Shared gallery loading and access rules for the guest API and the HTML
// routes. The rule in one sentence: a gallery with a password shows nothing
// but its title until the unlock cookie is present, except reels the owner
// marked public.
import { one, many } from "../db/pool.js"
import { hmac, safeEqual } from "./cookies.js"
import { currentUser } from "./auth.js"
import { serializeMedia } from "./media.js"
import { storage } from "../storage/index.js"

export const RESERVED_ALBUM_SLUGS = new Set(["highlights", "favorites", "reel", "all", "admin", "api"])

export async function loadGallery(slug) {
  return one("select * from galleries where slug = $1 and trashed_at is null", [slug])
}

// A slug is either a gallery's main link or one of its extra links. The
// result carries the link (null for the main one) so callers can filter
// albums and apply the link's own password.
export async function loadBySlug(slug) {
  const g = await loadGallery(slug)
  if (g) return { gallery: g, link: null }
  let link = await one("select * from links where slug = $1", [slug])
  if (!link) {
    // An old address kept as an alias after a rename.
    const alias = await one("select * from slug_aliases where slug = $1", [slug])
    if (!alias) return null
    if (alias.link_id) link = await one("select * from links where id = $1", [alias.link_id])
    else {
      const ag = await one("select * from galleries where id = $1 and trashed_at is null", [alias.gallery_id])
      return ag ? { gallery: ag, link: null } : null
    }
    if (!link) return null
  }
  const gallery = await one("select * from galleries where id = $1 and trashed_at is null", [link.gallery_id])
  if (!gallery || !link.visible) return null
  return { gallery, link }
}

export function unlockCookieName(g, link) {
  return link ? `g_${g.id}_l${link.id}` : `g_${g.id}`
}

export function unlockToken(g, link) {
  return link ? hmac("unlock-link", String(link.id), String(link.password_version)) : hmac("unlock", String(g.id), String(g.password_version))
}

// A link has its own password (or none). The main link uses the gallery's.
export function isUnlocked(req, g, link) {
  const hash = link ? link.password_hash : g.password_hash
  if (!hash) return true
  return safeEqual(req.cookies?.[unlockCookieName(g, link)], unlockToken(g, link))
}

// Which album ids a link may show; null means all.
export function linkAlbumIds(link) {
  return link?.album_ids?.length ? link.album_ids.map(Number) : null
}

// The albums a viewer of this gallery or link may see, always as a list:
// a link that names albums shows exactly those (private ones included);
// the main link and "all albums" links show every album that is not
// private.
export async function visibleAlbumIds(gallery, link) {
  const explicit = linkAlbumIds(link)
  if (explicit) return explicit
  const rows = await many("select id from albums where gallery_id = $1 and not is_private", [gallery.id])
  return rows.map((r) => r.id)
}

// Hidden galleries are reachable only by signed-in admins (for preview).
export async function canSee(req, g) {
  if (g.visible) return true
  return Boolean(await currentUser(req))
}

export const DEFAULT_SETTINGS = {
  layout: "full-bleed", // full-bleed | split | video | mosaic | title-card
  theme: "dark", // dark | light
  font: "serif", // serif (Cormorant Garamond) | display (Causten)
  grid: "justified", // justified | masonry | square
  density: "comfortable", // comfortable | compact
  animation: "fade", // fade | zoom | none
  align: "center", // center | left: logo and text on the cover
  banner: null, // { text, cta, url } sponsor strip under the cover and on album pages
  focal: { x: 0.5, y: 0.5 },
  mosaicIds: [],
  coverVideoId: null,
}

export function settingsOf(g) {
  const s = { ...DEFAULT_SETTINGS, ...(g.settings || {}) }
  s.focal = { ...DEFAULT_SETTINGS.focal, ...(s.focal || {}) }
  return s
}

export async function albumsOf(galleryId, albumIds = null) {
  const rows = await many(
    `select a.*, 
       (select count(*) from media m where m.album_id = a.id and m.trashed_at is null and m.status in ('ready','attention')) as count,
       cm.derivatives as cover_derivatives,
       (select derivatives from media m where m.album_id = a.id and m.trashed_at is null and m.status in ('ready','attention') order by m.sort, m.captured_at nulls last, m.filename, m.id limit 1) as first_derivatives
     from albums a left join media cm on cm.id = a.cover_media_id and cm.trashed_at is null
     where a.gallery_id = $1 and ($2::bigint[] is null or a.id = any($2::bigint[])) order by a.sort, a.id`,
    [galleryId, albumIds],
  )
  const out = []
  for (const a of rows) {
    if (!a.count) continue
    const d = a.cover_derivatives || a.first_derivatives || {}
    out.push({
      id: a.id,
      slug: a.slug,
      name: a.name,
      count: a.count,
      cover: d.thumb?.key ? await storage.signGetUrl(d.thumb.key) : null,
      coverLarge: d.display?.key ? await storage.signGetUrl(d.display.key) : d.poster?.key ? await storage.signGetUrl(d.poster.key) : null,
      coverRatio: d.thumb?.width && d.thumb?.height ? d.thumb.width / d.thumb.height : 1.5,
    })
  }
  return out
}

export async function highlightsAlbum(galleryId, albumIds = null) {
  const row = await one(
    `select count(*) as count,
       (select derivatives from media where gallery_id = $1 and highlighted and trashed_at is null and status in ('ready','attention') and ($2::bigint[] is null or album_id = any($2::bigint[])) order by sort, captured_at nulls last, filename, id limit 1) as d
     from media where gallery_id = $1 and highlighted and trashed_at is null and status in ('ready','attention') and ($2::bigint[] is null or album_id = any($2::bigint[]))`,
    [galleryId, albumIds],
  )
  if (!row || !row.count) return null
  const d = row.d || {}
  return {
    id: "highlights",
    slug: "highlights",
    name: "Highlights",
    count: row.count,
    cover: d.thumb?.key ? await storage.signGetUrl(d.thumb.key) : null,
    coverLarge: d.display?.key ? await storage.signGetUrl(d.display.key) : null,
    coverRatio: d.thumb?.width && d.thumb?.height ? d.thumb.width / d.thumb.height : 1.5,
    isHighlights: true,
  }
}

export async function reelsOf(galleryId, { includePrivate = true } = {}) {
  const rows = await many(
    `select r.*, m.* , r.id as reel_id, m.id as media_id from reels r join media m on m.id = r.media_id
     where r.gallery_id = $1 and m.trashed_at is null and m.status in ('ready','attention') ${includePrivate ? "" : "and r.is_public"}
     order by r.sort, r.id`,
    [galleryId],
  )
  const out = []
  for (const r of rows) {
    const media = await serializeMedia({ ...r, id: r.media_id })
    out.push({
      id: r.reel_id,
      title: r.title,
      description: r.description,
      isPublic: r.is_public,
      clipStart: r.clip_start_s,
      clip: r.derivatives?.clip?.key ? await storage.signGetUrl(r.derivatives.clip.key) : null,
      webSize: r.derivatives?.web?.size || null,
      media,
    })
  }
  return out
}

export async function serializeGallery(g, { admin = false, link = null } = {}) {
  const s = settingsOf(g)
  const ids = admin ? null : await visibleAlbumIds(g, link)
  const albums = await albumsOf(g.id, ids)
  const highlights = await highlightsAlbum(g.id, ids)
  // No cover chosen: the first photo stands in, so a gallery with no
  // customization still opens on an image.
  let cover = g.cover_media_id ? await one("select * from media where id = $1 and trashed_at is null", [g.cover_media_id]) : null
  if (!cover) cover = await one("select * from media where gallery_id = $1 and kind = 'photo' and album_id is not null and trashed_at is null and status = 'ready' order by highlighted desc, sort, captured_at nulls last, filename, id limit 1", [g.id])
  const mosaicRows = s.mosaicIds?.length
    ? await many("select * from media where gallery_id = $1 and id = any($2::bigint[]) and trashed_at is null and status in ('ready','attention')", [g.id, s.mosaicIds])
    : []
  const mosaic = s.mosaicIds.map((id) => mosaicRows.find((m) => m.id === id)).filter(Boolean)
  const counts = await one(
    `select count(*) filter (where kind = 'photo') as photos, count(*) filter (where kind = 'video') as videos
     from media where gallery_id = $1 and trashed_at is null and status in ('ready','attention') and album_id is not null and ($2::bigint[] is null or album_id = any($2::bigint[]))`,
    [g.id, ids],
  )
  const reels = link && !link.include_reels ? [] : await reelsOf(g.id)
  const coverVideo = s.coverVideoId ? reels.find((r) => r.id === s.coverVideoId) || reels[0] : reels[0]
  return {
    id: g.id,
    slug: link ? link.slug : g.slug,
    link: link ? { id: link.id, name: link.name } : null,
    title: g.title,
    subtitle: g.subtitle,
    eventDate: g.event_date ? toDateString(g.event_date) : null,
    location: g.location,
    intro: g.intro,
    hasPassword: Boolean(link ? link.password_hash : g.password_hash),
    visible: g.visible,
    settings: s,
    cover: cover ? await serializeMedia(cover) : null,
    mosaic: await Promise.all(mosaic.map((m) => serializeMedia(m))),
    coverVideo: coverVideo || null,
    clientLogo: g.client_logo_key ? await storage.signGetUrl(g.client_logo_key) : null,
    albums: highlights ? [highlights, ...albums] : albums,
    reels,
    counts: { photos: counts?.photos || 0, videos: counts?.videos || 0 },
    contentVersion: g.content_version,
    locked: false,
    ...(admin ? { createdAt: g.created_at, updatedAt: g.updated_at, trashedAt: g.trashed_at } : {}),
  }
}

export function lockedGallery(g, link = null) {
  const s = settingsOf(g)
  return {
    slug: link ? link.slug : g.slug,
    title: g.title,
    subtitle: g.subtitle,
    eventDate: g.event_date ? toDateString(g.event_date) : null,
    location: g.location,
    settings: { theme: s.theme, font: s.font, layout: "title-card", animation: s.animation },
    hasPassword: true,
    locked: true,
  }
}

export function toDateString(d) {
  if (typeof d === "string") return d.slice(0, 10)
  return d.toISOString().slice(0, 10)
}
