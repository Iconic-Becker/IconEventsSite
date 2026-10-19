// The built single page app is one index.html. Gallery and reel pages get
// their <head> tags filled in server side so shared links unfurl properly,
// and every page carries noindex.
import { readFileSync, existsSync } from "node:fs"
import { join, resolve } from "node:path"
import { config } from "./config.js"
import { loadGallery, isUnlocked, canSee, reelsOf, settingsOf } from "./lib/gallery.js"
import { storage } from "./storage/index.js"

const DIST = resolve("dist")
let template = null

export function loadTemplate() {
  const file = join(DIST, "index.html")
  if (!existsSync(file)) return null
  template = readFileSync(file, "utf8")
  return template
}

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

function render({ title, description, image, video, videoWidth, videoHeight, url, type = "website", themeColor }) {
  const html = template || loadTemplate()
  if (!html) return null
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:type" content="${esc(type)}">`,
    `<meta property="og:site_name" content="Iconic Events">`,
    url ? `<meta property="og:url" content="${esc(url)}">` : "",
    image ? `<meta property="og:image" content="${esc(image)}">` : "",
    image ? `<meta property="og:image:secure_url" content="${esc(image)}">` : "",
    video ? `<meta property="og:video" content="${esc(video)}">` : "",
    video ? `<meta property="og:video:secure_url" content="${esc(video)}">` : "",
    video ? `<meta property="og:video:type" content="video/mp4">` : "",
    video && videoWidth ? `<meta property="og:video:width" content="${videoWidth}">` : "",
    video && videoHeight ? `<meta property="og:video:height" content="${videoHeight}">` : "",
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(description)}">`,
    image ? `<meta name="twitter:image" content="${esc(image)}">` : "",
    `<meta name="robots" content="noindex, nofollow">`,
    themeColor ? `<meta name="theme-color" content="${esc(themeColor)}">` : "",
  ]
    .filter(Boolean)
    .join("\n    ")
  return html.replace(/<title>[\s\S]*?<\/title>/, "").replace("<!--head-->", tags)
}

function formatDate(d) {
  if (!d) return ""
  const date = typeof d === "string" ? new Date(d + "T00:00:00Z") : d
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
}

export async function galleryHtml(req, slug, albumSlug) {
  const g = await loadGallery(slug)
  if (!g || !(await canSee(req, g))) return render({ title: "Gallery not found | Iconic Photos", description: "This gallery does not exist or is no longer available." })
  const unlocked = isUnlocked(req, g)
  const s = settingsOf(g)
  const themeColor = s.theme === "light" ? "#F4F0E8" : "#0E1312"
  const subtitle = [g.subtitle, formatDate(g.event_date), g.location].filter(Boolean).join(" · ")
  const description = unlocked ? g.intro || subtitle || "Photos by Iconic Events" : "This gallery is password protected."
  let image = null
  if (unlocked && g.cover_media_id) {
    const { one } = await import("./db/pool.js")
    const cover = await one("select derivatives from media where id = $1 and trashed_at is null", [g.cover_media_id])
    const key = cover?.derivatives?.social?.key || cover?.derivatives?.display?.key || cover?.derivatives?.poster?.key
    if (key) image = await storage.signGetUrl(key)
  }
  const title = `${g.title} | Iconic Events`
  return render({ title, description, image, url: `${config.publicUrl}/${g.slug}${albumSlug ? `/${albumSlug}` : ""}`, themeColor })
}

export async function reelHtml(req, slug, reelId) {
  const g = await loadGallery(slug)
  if (!g || !(await canSee(req, g))) return render({ title: "Video not found | Iconic Photos", description: "This video is not available." })
  const reels = await reelsOf(g.id)
  const reel = reels.find((r) => r.id === Number(reelId))
  const unlocked = isUnlocked(req, g)
  const s = settingsOf(g)
  const themeColor = s.theme === "light" ? "#F4F0E8" : "#0E1312"
  if (!reel || (!reel.isPublic && !unlocked)) {
    return render({ title: `${g.title} | Iconic Events`, description: "This video is in a password protected gallery.", url: `${config.publicUrl}/${g.slug}/reel/${reelId}`, themeColor })
  }
  const title = `${reel.title || "Video"} | ${g.title}`
  const description = reel.description || [formatDate(g.event_date), g.location].filter(Boolean).join(" · ") || "A video by Iconic Events"
  return render({
    title,
    description,
    image: reel.media.poster,
    video: reel.media.web,
    videoWidth: reel.media.width,
    videoHeight: reel.media.height,
    url: `${config.publicUrl}/${g.slug}/reel/${reel.id}`,
    type: "video.other",
    themeColor,
  })
}

export function plainHtml(title, description) {
  return render({ title, description })
}
