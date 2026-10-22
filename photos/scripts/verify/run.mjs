// End-to-end verification against a running local server. Covers the
// "Done means" checklist in docs/BUILD-PROMPT.md as far as a headless
// browser allows, and prints what was measured.
//   node scripts/verify/run.mjs [baseUrl] [shotsDir]
import { chromium, request } from "playwright"
import sharp from "sharp"
import exifReader from "exif-reader"
import { execFileSync } from "node:child_process"
import { writeFileSync, mkdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const base = process.argv[2] || "http://localhost:3000"
const shots = process.argv[3] || "data/verify-shots"
mkdirSync(shots, { recursive: true })
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
const OWNER = { email: "owner@iconic.events", password: "test-password-123" }
const results = []
const t0 = Date.now()

async function check(name, fn) {
  const start = Date.now()
  try {
    const detail = await fn()
    results.push({ name, ok: true, detail })
    console.log(`PASS  ${name}${detail ? `  [${detail}]` : ""}`)
  } catch (err) {
    results.push({ name, ok: false, detail: err.message })
    console.log(`FAIL  ${name}  ${err.message}`)
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---- API helpers -------------------------------------------------------------
async function apiCtx(login) {
  const ctx = await request.newContext({ baseURL: base, extraHTTPHeaders: { Origin: base } })
  if (login) {
    const r = await ctx.post("/api/admin/login", { data: login })
    assert(r.ok(), `login failed ${r.status()}`)
  }
  return ctx
}
async function j(res) {
  const body = await res.json().catch(() => ({}))
  if (!res.ok()) throw Object.assign(new Error(`${res.url()} -> ${res.status()} ${body.error || ""}`), { status: res.status(), body })
  return body
}
async function waitProcessed(admin, galleryId, expectMin, timeoutMs = 240000) {
  const until = Date.now() + timeoutMs
  while (Date.now() < until) {
    const { gallery } = await j(await admin.get(`/api/admin/galleries/${galleryId}`))
    const pending = gallery.media.filter((m) => !["ready", "attention", "failed"].includes(m.status))
    if (!pending.length && gallery.media.length >= expectMin) return gallery
    await sleep(2000)
  }
  throw new Error("processing did not finish in time")
}
function uploadViaApi(galleryId, folder, reel) {
  execFileSync("node", ["scripts/api-upload.mjs", base, OWNER.email, OWNER.password, String(galleryId), folder, ...(reel ? ["--reel", reel] : [])], { stdio: "pipe" })
}
async function adminLogin(page) {
  await page.goto(`${base}/admin`)
  await page.fill('input[type="email"]', OWNER.email)
  await page.fill('input[type="password"]', OWNER.password)
  await page.click('button:has-text("Sign in")')
  await page.waitForSelector("h1:has-text('galler')")
}
function watchErrors(page) {
  const errors = []
  page.on("console", (m) => m.type() === "error" && !/favicon/.test(m.text()) && errors.push(m.text()))
  page.on("pageerror", (e) => errors.push(String(e)))
  return errors
}
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)

const browser = await chromium.launch({ executablePath: CHROME })
const admin = await apiCtx(OWNER)
let G // Verify Event gallery (full)
let slug

// ---- A. Admin: create a gallery by dropping a folder --------------------------
await check("Admin: folder upload creates albums and derivatives", async () => {
  const { gallery } = await j(await admin.post("/api/admin/galleries", { data: { title: "Verify Event", eventDate: "2026-10-03" } }))
  G = gallery
  slug = gallery.slug
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const errors = watchErrors(page)
  await adminLogin(page)
  await page.goto(`${base}/admin/galleries/${G.id}`)
  await page.waitForSelector("text=drag to reorder")
  await page.setInputFiles("input[webkitdirectory]", resolve("data/fixtures/event"))
  await page.waitForSelector("text=/Uploaded \\d+ files/", { timeout: 120000 })
  // Reel through the Reels tab.
  await page.click('nav a:has-text("Reels")')
  await page.setInputFiles('input[type="file"][accept^="video"]', resolve("data/fixtures/event/reel-9x16.mp4"))
  await page.waitForSelector("text=/Uploaded \\d+ files/", { timeout: 60000 })
  await page.close()
  G = await waitProcessed(admin, G.id, 36)
  for (let i = 0; i < 20 && !G.reels[0]?.clip; i++) {
    await sleep(2000)
    G = (await j(await admin.get(`/api/admin/galleries/${G.id}`))).gallery
  }
  const albums = G.albumRows.map((a) => a.name).sort()
  // The gallery starts with an empty Photos album; the dropped folder is its own
  // album (loose files at its root go there) and each sub-folder is another.
  assert(JSON.stringify(albums) === JSON.stringify(["Keynote", "Photos", "Reception", "event"]), `albums were ${albums}`)
  const photos = G.media.filter((m) => m.kind === "photo")
  const videos = G.media.filter((m) => m.kind === "video")
  assert(photos.length === 33, `photos ${photos.length}`)
  assert(videos.length === 3, `videos ${videos.length}`) // trailer in Keynote, loose reel file, featured reel
  assert(photos.every((m) => m.status === "ready" && m.thumb && m.display && m.hasSocial), "photo derivatives missing")
  assert(videos.every((m) => m.status === "ready" && m.poster && m.web), "video derivatives missing")
  assert(G.reels.length === 1 && G.reels[0].clip, "reel or cover clip missing")
  assert(!errors.length, `console errors: ${errors.join(" | ")}`)
  return `33 photos, 3 videos, 4 albums, 1 reel with clip; ${(G.media.length)} items processed`
})

// ---- B. Upload resumes after the network is cut -------------------------------
await check("Upload resumes after network cut mid-file", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await ctx.newPage()
  await adminLogin(page)
  await page.goto(`${base}/admin/galleries/${G.id}`)
  await page.waitForSelector("text=drag to reorder")
  const puts = []
  page.on("requestfinished", (r) => r.method() === "PUT" && r.url().includes("/_local/") && puts.push(new URL(r.url()).searchParams.get("partNumber")))
  const failed = []
  page.on("requestfailed", (r) => r.method() === "PUT" && failed.push(r.url()))
  // Drop the connection in the middle of part 2: the request is aborted
  // and the browser is taken offline for a few seconds.
  let cut = false
  await page.route((url) => url.pathname.startsWith("/_local/"), async (route) => {
    const req = route.request()
    if (req.method() === "PUT" && new URL(req.url()).searchParams.get("partNumber") === "2" && !cut) {
      cut = true
      await ctx.setOffline(true)
      setTimeout(() => ctx.setOffline(false), 4000)
      return route.abort("connectionreset")
    }
    return route.continue()
  })
  await page.setInputFiles('input[type="file"]:not([webkitdirectory])', resolve("data/fixtures/big/big-trailer.mp4"))
  await page.waitForSelector("text=/Uploaded \\d+ files/", { timeout: 120000 })
  await page.close()
  await ctx.close()
  const { gallery } = await j(await admin.get(`/api/admin/galleries/${G.id}`))
  const m = gallery.media.find((x) => x.filename === "big-trailer.mp4")
  assert(m && ["uploaded", "processing", "ready"].includes(m.status), `status ${m?.status}`)
  assert(Number(m.sizeBytes) === 29353181 || m.status !== "ready", `size ${m.sizeBytes}`)
  const parts = [...new Set(puts.filter(Boolean))].sort()
  assert(cut && failed.length >= 1, "the connection cut did not interrupt a part upload")
  assert(parts.join(",") === "1,2", `parts completed ${parts}`)
  return `part 2 PUT aborted and browser offline 4 s; ${failed.length} failed PUT(s) retried; parts completed ${parts.join(",")}; final status ${m.status}`
})

// Give the big file time to process while we do guest checks.

// ---- C. Guest at 390 --------------------------------------------------------
await check("Guest at 390px: cover, bar, grid, lightbox, swipe, no overflow/errors", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  const errors = watchErrors(page)
  await page.goto(`${base}/${slug}`, { waitUntil: "networkidle" })
  assert(await page.$("section.cover"), "no cover")
  assert(!(await overflow(page)), "horizontal overflow on overview")
  await page.screenshot({ path: `${shots}/guest-390-overview.png`, fullPage: true })
  await page.click("text=View the photos")
  await page.click('a:has-text("Keynote")')
  await page.waitForSelector(".tile")
  assert(!(await overflow(page)), "horizontal overflow on album")
  const bar = await page.$eval(".sticky", (el) => getComputedStyle(el).position)
  assert(bar === "sticky", `bar position ${bar}`)
  await page.evaluate(() => window.scrollTo(0, 600))
  await sleep(300)
  const scrollBefore = await page.evaluate(() => window.scrollY)
  // A tile that is on screen at this scroll position, so the click itself
  // does not scroll the page.
  const tiles = await page.$$(".tile > button:first-child")
  let target = null
  for (const t of tiles) {
    const b = await t.boundingBox()
    if (b && b.y > 80 && b.y + b.height < 760) {
      target = t
      break
    }
  }
  assert(target, "no tile visible at scroll 600")
  await target.click()
  await page.waitForSelector(".yarl__container")
  const p1 = new URL(page.url()).searchParams.get("p")
  await page.keyboard.press("ArrowRight")
  await sleep(500)
  const p2 = new URL(page.url()).searchParams.get("p")
  assert(p1 && p2 && p1 !== p2, "keyboard navigation did not advance")
  // Swipe left.
  const box = await (await page.$(".yarl__container")).boundingBox()
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2)
  await page.mouse.down()
  for (let i = 1; i <= 8; i++) await page.mouse.move(box.x + box.width * (0.8 - i * 0.08), box.y + box.height / 2)
  await page.mouse.up()
  await sleep(600)
  const p3 = new URL(page.url()).searchParams.get("p")
  assert(p3 !== p2, "swipe did not advance")
  await page.screenshot({ path: `${shots}/guest-390-lightbox.png` })
  await page.goBack()
  await sleep(400)
  assert(!(await page.$(".yarl__container")), "lightbox did not close on back")
  const scrollAfter = await page.evaluate(() => window.scrollY)
  assert(Math.abs(scrollAfter - scrollBefore) < 40, `scroll moved ${scrollBefore} -> ${scrollAfter}`)
  await page.screenshot({ path: `${shots}/guest-390-album.png`, fullPage: true })
  assert(!errors.length, `console errors: ${errors.join(" | ")}`)
  await ctx.close()
  return `sticky bar, lightbox opened p=${p1}, key -> ${p2}, swipe -> ${p3}, back restored scroll ${scrollBefore}->${scrollAfter}`
})

// ---- D. Favorites and the email gate -----------------------------------------
const GUEST = { email: "guest@example.com", name: "Test Guest" }
let favFilenames = []
await check("First heart asks for email, later hearts do not, same email restores", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  await page.goto(`${base}/${slug}/keynote`)
  await page.waitForSelector(".tile")
  const hearts = await page.$$('.tile [aria-label="Add to favorites"]')
  await hearts[0].click()
  await page.waitForSelector("text=Save your favorites")
  await page.fill('input[type="email"]', GUEST.email)
  await page.fill('input[type="text"]', GUEST.name)
  await page.click('button:has-text("Save favorite")')
  await page.waitForSelector('.tile [aria-pressed="true"]')
  await hearts[1].click()
  await sleep(600)
  assert(!(await page.$("text=Save your favorites")), "gate shown again")
  await page.waitForFunction(() => document.querySelectorAll('.tile [aria-pressed="true"]').length === 2)
  const me = await (await ctx.request.get(`${base}/api/g/${slug}/me`)).json()
  assert(me.favorites.length === 2, `favorites ${me.favorites.length}`)
  favFilenames = G.media.filter((m) => me.favorites.includes(m.id)).map((m) => m.filename)
  await ctx.close()
  // Fresh browser, same email.
  const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const page2 = await ctx2.newPage()
  await page2.goto(`${base}/${slug}/keynote`)
  await page2.waitForSelector(".tile")
  assert((await page2.$$('.tile [aria-pressed="true"]')).length === 0, "fresh browser already had favorites")
  await (await page2.$$('.tile [aria-label="Add to favorites"]'))[0].click()
  await page2.waitForSelector("text=Save your favorites")
  await page2.fill('input[type="email"]', GUEST.email)
  await page2.click('button:has-text("Save favorite")')
  await page2.waitForFunction(() => document.querySelectorAll('.tile [aria-pressed="true"]').length === 2)
  const me2 = await (await ctx2.request.get(`${base}/api/g/${slug}/me`)).json()
  assert(me2.favorites.length === 2 && me2.guest.name === GUEST.name, "list not restored")
  await ctx2.close()
  return `2 favorites saved, restored in a fresh browser with name "${me2.guest.name}"`
})

// ---- E. Downloads: Social / Full / Both -------------------------------------
async function follow(ctx, path) {
  const r = await ctx.get(path, { maxRedirects: 0 })
  assert(r.status() === 302, `expected 302, got ${r.status()}`)
  const loc = r.headers()["location"]
  const f = await ctx.get(loc)
  assert(f.ok(), `download ${f.status()}`)
  return { buf: Buffer.from(await f.body()), headers: f.headers(), loc }
}
await check("Social, Full and Both downloads produce the right files", async () => {
  const ctx = await apiCtx()
  const photo = G.media.find((m) => m.kind === "photo" && m.albumId && m.filename.startsWith("IMG_10"))
  const social = await follow(ctx, `/api/g/${slug}/dl/${photo.id}?size=social`)
  const sm = await sharp(social.buf).metadata()
  const sx = sm.exif ? exifReader(sm.exif) : {}
  assert(Math.max(sm.width, sm.height) === 2048, `social long edge ${Math.max(sm.width, sm.height)}`)
  assert(!sx.GPSInfo, "GPS present in social")
  assert(sx.Image?.Copyright === "Iconic Events", "copyright missing in social")
  assert(/attachment/.test(social.headers["content-disposition"] || ""), "social not an attachment")
  const full = await follow(ctx, `/api/g/${slug}/dl/${photo.id}?size=full`)
  const fm = await sharp(full.buf).metadata()
  const fx = fm.exif ? exifReader(fm.exif) : {}
  assert(Math.max(fm.width, fm.height) === 3000, `full long edge ${Math.max(fm.width, fm.height)}`)
  assert(fx.GPSInfo, "GPS missing in full (original untouched)")
  // Both (the iOS path): one zip with two files.
  const both = await ctx.get(`/api/g/${slug}/zip?ids=${photo.id}&size=both`)
  assert(both.ok() && both.headers()["content-type"] === "application/zip", "both zip failed")
  writeFileSync(`${shots}/both.zip`, Buffer.from(await both.body()))
  const list = execFileSync("unzip", ["-Z1", `${shots}/both.zip`]).toString().trim().split("\n")
  assert(list.length === 2 && list.some((l) => l.startsWith("Social/")) && list.some((l) => l.startsWith("Full resolution/")), `zip entries ${list}`)
  return `social ${sm.width}x${sm.height} no GPS, copyright kept; full ${fm.width}x${fm.height} with GPS; both -> zip [${list.join(", ")}]`
})

// ---- F. Download all ----------------------------------------------------------
async function zipAll(ctx, albumId, size) {
  let d = await j(await ctx.post(`/api/g/${slug}/zips`, { data: { albumId, size } }))
  const until = Date.now() + 120000
  while (d.status !== "ready" && Date.now() < until) {
    await sleep(1500)
    d = await j(await ctx.get(`/api/g/${slug}/zips?size=${size}${albumId ? `&albumId=${albumId}` : ""}`))
    if (d.status === "none") d = await j(await ctx.post(`/api/g/${slug}/zips`, { data: { albumId, size } }))
    if (d.status === "failed") throw new Error("zip failed")
  }
  assert(d.status === "ready", "zip not ready")
  const f = await ctx.get(d.parts[0].url)
  const file = `${shots}/all-${albumId || "gallery"}-${size}.zip`
  writeFileSync(file, Buffer.from(await f.body()))
  return execFileSync("unzip", ["-Z1", file]).toString().trim().split("\n")
}
await check("Download all works per album and whole gallery at each size", async () => {
  const ctx = await apiCtx()
  const { gallery: g } = await j(await admin.get(`/api/admin/galleries/${G.id}`))
  const keynote = g.albumRows.find((a) => a.name === "Keynote")
  const inKeynote = g.media.filter((m) => m.albumId === keynote.id && ["ready", "attention"].includes(m.status)).length
  const inGallery = g.media.filter((m) => m.albumId && ["ready", "attention"].includes(m.status)).length
  const out = []
  const countNow = async (albumId) => {
    const { gallery: gg } = await j(await admin.get(`/api/admin/galleries/${G.id}`))
    return gg.media.filter((m) => m.albumId && (!albumId || m.albumId === albumId) && ["ready", "attention"].includes(m.status)).length
  }
  for (const size of ["social", "full"]) {
    const a = await zipAll(ctx, keynote.id, size)
    assert(a.length === inKeynote || a.length === (await countNow(keynote.id)), `keynote ${size} zip has ${a.length}, expected ${inKeynote}`)
    const w = await zipAll(ctx, null, size)
    assert(w.length === inGallery || w.length === (await countNow(null)), `gallery ${size} zip has ${w.length}, expected ${inGallery}`)
    assert(w.every((n) => n.includes("/")), "gallery zip entries lack album folders")
    out.push(`${size}: album ${a.length}, gallery ${w.length}`)
  }
  return out.join("; ")
})

// ---- H. Cover layouts at 390 and 1440 with focal point ----------------------
await check("Each of the 5 cover layouts renders at 390 and 1440 and the focal point holds", async () => {
  const photos = G.media.filter((m) => m.kind === "photo" && m.albumId && m.status === "ready")
  await j(await admin.patch(`/api/admin/galleries/${G.id}`, { data: { coverMediaId: photos[3].id, subtitle: "A night to remember", location: "Cipriani Wall Street", intro: "Tap any photo to see it large. Heart the ones you love.", settings: { focal: { x: 0.2, y: 0.8 }, mosaicIds: photos.slice(0, 5).map((m) => m.id) } } }))
  const notes = []
  for (const layout of ["full-bleed", "split", "video", "mosaic", "title-card"]) {
    await j(await admin.patch(`/api/admin/galleries/${G.id}`, { data: { settings: { layout, theme: layout === "split" || layout === "title-card" ? "light" : "dark", font: layout === "mosaic" ? "display" : "serif" } } }))
    for (const [w, h] of [[390, 844], [1440, 900]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 })
      const page = await ctx.newPage()
      const errors = watchErrors(page)
      await page.goto(`${base}/${slug}`, { waitUntil: "networkidle" })
      await page.waitForSelector("section.cover")
      await sleep(1300)
      const got = await page.$eval("section.cover", (el) => el.dataset.layout)
      assert(got === layout, `${layout}@${w}: rendered ${got}`)
      if (layout === "full-bleed" || layout === "split" || layout === "mosaic") {
        const pos = await page.$eval("section.cover img.cover-media", (el) => getComputedStyle(el).objectPosition)
        assert(pos === "20% 80%", `${layout}@${w}: object-position ${pos}`)
      }
      if (layout === "video") assert(await page.$("section.cover video"), "video cover has no video element")
      assert(!(await overflow(page)), `${layout}@${w}: overflow`)
      await page.screenshot({ path: `${shots}/cover-${layout}-${w}.png` })
      assert(!errors.length, `${layout}@${w}: ${errors.join(" | ")}`)
      await ctx.close()
    }
    notes.push(layout)
  }
  return `${notes.join(", ")} at 390 and 1440; object-position 20% 80% on image layouts`
})

// ---- I. No customization looks finished --------------------------------------
await check("A gallery with no customization looks finished", async () => {
  const { gallery } = await j(await admin.post("/api/admin/galleries", { data: { title: "Scaling with Systems LIVE", eventDate: "2021-11-04" } }))
  uploadViaApi(gallery.id, "data/real/20_Scaling_with_Systems_LIVE_2021_2")
  const g = await waitProcessed(admin, gallery.id, 30)
  const api = await j(await (await apiCtx()).get(`/api/g/${g.slug}`))
  assert(api.cover && api.cover.display, "no automatic cover")
  for (const [w, h] of [[390, 844], [1440, 900]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 700 })
    const errors = watchErrors(page)
    await page.goto(`${base}/${g.slug}`, { waitUntil: "networkidle" })
    await sleep(1300)
    await page.screenshot({ path: `${shots}/plain-${w}.png`, fullPage: w > 700 })
    assert(!errors.length, errors.join(" | "))
    await page.close()
  }
  return `${g.media.length} real photos in ${g.albumRows.length} albums, auto cover, screenshots plain-390/1440`
})

// ---- J. 25-album gallery navigation -----------------------------------------
await check("Album navigation with a 25-album gallery", async () => {
  const { gallery } = await j(await admin.post("/api/admin/galleries", { data: { title: "Many Albums", eventDate: "2026-05-20" } }))
  uploadViaApi(gallery.id, "data/fixtures/many")
  const g = await waitProcessed(admin, gallery.id, 50)
  const s = g.slug
  const guest = await j(await (await apiCtx()).get(`/api/g/${s}`))
  assert(guest.albums.length >= 25, `albums ${guest.albums.length}`)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = watchErrors(page)
  await page.goto(`${base}/${s}`, { waitUntil: "networkidle" })
  const tiles = await page.$$('#albums a[href^="/"]')
  assert(tiles.length === guest.albums.length, `overview tiles ${tiles.length}`)
  await page.screenshot({ path: `${shots}/many-overview-1440.png`, fullPage: true })
  // Chips in the sticky bar; the "All albums" sheet with filter.
  await page.click('a:has-text("Dinner")')
  await page.waitForSelector("h2:has-text('Dinner')")
  // The album's photos arrive after the heading; the page cannot scroll
  // until they give it height.
  await page.waitForSelector(".tile")
  await page.evaluate(() => window.scrollTo(0, 500))
  await sleep(300)
  const barTop = (await (await page.$(".sticky")).boundingBox()).y
  assert(barTop === 0, `bar top ${barTop} when scrolled`)
  const active = await page.$eval('.sticky a[aria-current="page"]', (el) => el.textContent)
  assert(/Dinner/.test(active), `active chip ${active}`)
  await page.click('button[aria-label="All albums"]')
  await page.waitForSelector('input[placeholder="Find an album"]')
  await page.fill('input[placeholder="Find an album"]', "Terr")
  const items = await page.$$eval('[role="dialog"] li a', (els) => els.map((e) => e.textContent))
  assert(items.length === 1 && /Terrace/.test(items[0]), `filter gave ${items}`)
  await page.click('[role="dialog"] li a')
  await page.waitForSelector("h2:has-text('Terrace')")
  await page.screenshot({ path: `${shots}/many-album-1440.png`, fullPage: true })
  // Next-album card names the following album.
  const idx = guest.albums.findIndex((a) => a.name === "Terrace")
  const nextName = guest.albums[idx + 1].name
  const card = await page.$eval("text=Next album >> xpath=..", (el) => el.textContent)
  assert(card.includes(nextName), `next card says "${card}", expected ${nextName}`)
  await page.click("text=Next album")
  await page.waitForSelector(`h2:has-text('${nextName}')`)
  // Back and forward.
  await page.goBack()
  await page.waitForSelector("h2:has-text('Terrace')")
  await page.goForward()
  await page.waitForSelector(`h2:has-text('${nextName}')`)
  // Deep link loads directly.
  const page2 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await page2.goto(`${base}/${s}/dinner`, { waitUntil: "networkidle" })
  await page2.waitForSelector("h2:has-text('Dinner')")
  assert((await page2.$$(".tile")).length === 2, "deep link grid wrong")
  assert(!(await overflow(page2)), "overflow at 390 on album page")
  await page2.screenshot({ path: `${shots}/many-album-390.png`, fullPage: true })
  await page2.close()
  assert(!errors.length, errors.join(" | "))
  await page.close()
  return `${tiles.length} tiles, sticky bar at y=0, active chip Dinner, filter "Terr" -> Terrace, next card -> ${nextName}, back/forward ok, deep link ok`
})

// ---- K. Reels -----------------------------------------------------------------
await check("Featured 9:16 reel and 16:9 trailer: player geometry and web MP4 metadata", async () => {
  // Upload the 16:9 trailer as a second featured reel.
  mkdirSync("data/fixtures/reel2", { recursive: true })
  execFileSync("cp", ["data/fixtures/event/Keynote/trailer-16x9.mp4", "data/fixtures/reel2/trailer-16x9.mp4"])
  const files = [{ path: "trailer-16x9.mp4", size: readFileSync("data/fixtures/reel2/trailer-16x9.mp4").length }]
  const plan = await j(await admin.post(`/api/admin/galleries/${G.id}/uploads`, { data: { target: "reel", files } }))
  const e = plan.files[0]
  if (!e.skipped) {
    const put = await admin.put(e.putUrl, { data: readFileSync("data/fixtures/reel2/trailer-16x9.mp4"), headers: { "Content-Type": "video/mp4" } })
    assert(put.ok(), "reel put failed")
    await j(await admin.post(`/api/admin/uploads/${e.mediaId}/complete`, { data: {} }))
  }
  const g = await waitProcessed(admin, G.id, 1)
  assert(g.reels.length === 2, `reels ${g.reels.length}`)
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const errors = watchErrors(page)
  await page.goto(`${base}/${slug}`, { waitUntil: "networkidle" })
  const notes = []
  for (const r of g.reels) {
    const btn = await page.$(`button[aria-label="Play ${r.title}"]`)
    assert(btn, `no play button for ${r.title}`)
    const box = await (await btn.evaluateHandle((el) => el.parentElement)).asElement().boundingBox()
    const want = r.media.width / r.media.height
    const got = box.width / box.height
    assert(Math.abs(got - want) < 0.03, `${r.title}: box ratio ${got.toFixed(3)} vs video ${want.toFixed(3)}`)
    assert(box.width <= 390 && box.height <= 844 * 0.8, `${r.title}: box ${box.width}x${box.height} does not fit`)
    await btn.click()
    const v = await page.waitForSelector("video", { timeout: 5000 })
    const vb = await v.boundingBox()
    assert(Math.abs(vb.width / vb.height - want) < 0.03, `${r.title}: video element ratio ${(vb.width / vb.height).toFixed(3)}`)
    // Codec facts from the served file.
    const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", `data/storage/g/${G.id}/d/${r.media.id}/web.mp4`]).toString())
    const vs = probe.streams.find((s) => s.codec_type === "video")
    assert(vs.codec_name === "h264" && vs.pix_fmt === "yuv420p", `${r.title}: codec ${vs.codec_name} ${vs.pix_fmt}`)
    const head = execFileSync("head", ["-c", "64", `data/storage/g/${G.id}/d/${r.media.id}/web.mp4`]).toString("latin1")
    assert(head.includes("moov") || head.includes("ftyp"), "mp4 header")
    notes.push(`${r.title} ${r.media.width}x${r.media.height} box ${Math.round(box.width)}x${Math.round(box.height)} h264/yuv420p`)
    await page.reload({ waitUntil: "networkidle" })
  }
  assert(!errors.filter((e) => !/media|video|source/i.test(e)).length, errors.join(" | "))
  await page.close()
  return notes.join("; ") + ". Headless Chromium here has no H.264 decoder, so actual playback was not exercised."
})

// ---- L. Reel share page unfurls --------------------------------------------
let reel
await check("Reel share page carries Open Graph tags with poster and video", async () => {
  const { gallery: g } = await j(await admin.get(`/api/admin/galleries/${G.id}`))
  reel = g.reels[0]
  await j(await admin.patch(`/api/admin/reels/${reel.id}`, { data: { title: "Recap reel", description: "Ninety seconds from the night." } }))
  const ctx = await apiCtx()
  const html = await (await ctx.get(`/${slug}/reel/${reel.id}`)).text()
  const tag = (p) => (html.match(new RegExp(`<meta (?:property|name)="${p}" content="([^"]*)"`)) || [])[1]
  assert(tag("og:title") === "Recap reel | Verify Event", `og:title ${tag("og:title")}`)
  assert(tag("og:description") === "Ninety seconds from the night.", "og:description")
  const img = await ctx.get(tag("og:image").replace(/&amp;/g, "&"))
  assert(img.ok() && /image\/jpeg/.test(img.headers()["content-type"]), "og:image not fetchable")
  const vid = await ctx.get(tag("og:video").replace(/&amp;/g, "&"), { headers: { Range: "bytes=0-99" } })
  assert([200, 206].includes(vid.status()) && /video\/mp4/.test(vid.headers()["content-type"]), "og:video not fetchable")
  assert(tag("og:video:type") === "video/mp4" && tag("twitter:card") === "summary_large_image", "video type or twitter card")
  assert(/<title>Recap reel \| Verify Event<\/title>/.test(html), "title tag")
  return `og:title, og:description, og:image (200 image/jpeg), og:video (${vid.status()} video/mp4), twitter:card. Real unfurlers need the live domain.`
})

// ---- M. Native share on mobile ------------------------------------------------
await check("Native share opens on mobile (Web Share API)", async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, "share", { value: async (d) => { window.__shared = d }, configurable: true })
    Object.defineProperty(navigator, "canShare", { value: () => false, configurable: true })
  })
  const page = await ctx.newPage()
  await page.goto(`${base}/${slug}/reel/${reel.id}`, { waitUntil: "networkidle" })
  await page.click('button:has-text("Share")')
  await sleep(500)
  const shared = await page.evaluate(() => window.__shared)
  assert(shared && shared.url === `${base}/${slug}/reel/${reel.id}`, `shared ${JSON.stringify(shared)}`)
  await page.screenshot({ path: `${shots}/reel-page-390.png` })
  await ctx.close()
  return `navigator.share called with ${shared.url}`
})

// ---- G + N. Password gallery and public reel ---------------------------------
await check("Password gallery: media URLs cannot be fetched before unlock", async () => {
  await j(await admin.patch(`/api/admin/galleries/${G.id}`, { data: { password: "velvet-rope" } }))
  const ctx = await apiCtx()
  const locked = await j(await ctx.get(`/api/g/${slug}`))
  assert(locked.locked === true && !locked.albums && !locked.cover && !locked.reels, "locked payload leaks")
  const photo = G.media.find((m) => m.kind === "photo" && m.albumId)
  for (const path of [`/api/g/${slug}/albums/keynote`, `/api/g/${slug}/dl/${photo.id}?size=social`, `/api/g/${slug}/zip?ids=${photo.id}&size=social`, `/api/g/${slug}/favorites.zip?size=social`]) {
    const r = await ctx.get(path, { maxRedirects: 0 })
    assert(r.status() === 403, `${path} -> ${r.status()}`)
  }
  const z = await ctx.post(`/api/g/${slug}/zips`, { data: { size: "social" } })
  assert(z.status() === 403, `zips -> ${z.status()}`)
  const html = await (await ctx.get(`/${slug}`)).text()
  assert(!/og:image/.test(html), "locked gallery HTML exposes og:image")
  const bad = await ctx.post(`/api/g/${slug}/unlock`, { data: { password: "wrong" } })
  assert(bad.status() === 403, "wrong password accepted")
  await j(await ctx.post(`/api/g/${slug}/unlock`, { data: { password: "velvet-rope" } }))
  const open = await j(await ctx.get(`/api/g/${slug}/albums/keynote`))
  assert(open.media.length > 0, "unlock did not open")
  // Browser: the password page renders at 390.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true })
  await page.goto(`${base}/${slug}`, { waitUntil: "networkidle" })
  await page.waitForSelector('input[type="password"]')
  await page.screenshot({ path: `${shots}/password-390.png` })
  await page.fill('input[type="password"]', "velvet-rope")
  await page.click('button:has-text("Enter")')
  await page.waitForSelector("section.cover")
  await page.close()
  return "locked payload has title only; album, dl, zip, favorites.zip and zips all 403; HTML has no og:image; unlock works via API and browser"
})

await check("Public reel in a password gallery plays without the password; photos stay locked", async () => {
  await j(await admin.patch(`/api/admin/reels/${reel.id}`, { data: { isPublic: true } }))
  const ctx = await apiCtx()
  const r = await j(await ctx.get(`/api/g/${slug}/reel/${reel.id}`))
  assert(r.reel.media.web && r.gallery.locked === true, "public reel not served or gallery not reported locked")
  const html = await (await ctx.get(`/${slug}/reel/${reel.id}`)).text()
  assert(/og:video/.test(html), "public reel page lacks og:video")
  const album = await ctx.get(`/api/g/${slug}/albums/keynote`)
  assert(album.status() === 403, `album -> ${album.status()}`)
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true })
  await page.goto(`${base}/${slug}/reel/${reel.id}`, { waitUntil: "networkidle" })
  assert(await page.$('button[aria-label^="Play"]'), "player missing")
  assert(await page.$("text=The photo gallery is private"), "locked notice missing")
  await page.close()
  // The other, private reel still needs the password.
  const { gallery: g } = await j(await admin.get(`/api/admin/galleries/${G.id}`))
  const other = g.reels.find((x) => x.id !== reel.id)
  const priv = await ctx.get(`/api/g/${slug}/reel/${other.id}`)
  assert(priv.status() === 403, `private reel -> ${priv.status()}`)
  await j(await admin.patch(`/api/admin/galleries/${G.id}`, { data: { password: null } }))
  return "public reel 200 with og:video, album 403, private reel 403"
})

// ---- O. Admin favorites view and Copy filenames -----------------------------
await check("Admin favorites view shows picks; Copy filenames pastes cleanly", async () => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t) => { window.__copied = t } }, configurable: true })
  })
  const page = await ctx.newPage()
  await adminLogin(page)
  await page.goto(`${base}/admin/galleries/${G.id}/favorites`)
  await page.waitForSelector(`text=${GUEST.email}`)
  assert((await page.$$("img")).length >= 2, "pick thumbnails missing")
  await page.click('button:has-text("Copy filenames")')
  await sleep(200)
  const copied = await page.evaluate(() => window.__copied)
  const expected = favFilenames.join(", ")
  assert(copied.split(", ").sort().join(", ") === favFilenames.sort().join(", "), `copied "${copied}" expected "${expected}"`)
  await page.screenshot({ path: `${shots}/admin-favorites.png` })
  const csv = await (await admin.get(`/api/admin/galleries/${G.id}/favorites.csv`)).text()
  assert(csv.includes(GUEST.email) && csv.split("\n").length >= 3, "csv")
  await ctx.close()
  return `copied "${copied}"; CSV has ${csv.trim().split("\n").length - 1} rows`
})

// ---- P. Counts --------------------------------------------------------------
await check("Counts increment for views and downloads", async () => {
  const a = await j(await admin.get(`/api/admin/galleries/${G.id}/analytics`))
  const t = a.totals
  assert(Number(t.visitors) >= 1 && Number(t.views) >= 1, `views ${t.views}`)
  assert(Number(t.lightbox) >= 1, "lightbox")
  assert(Number(t.social) >= 1 && Number(t.full) >= 1 && Number(t.zips) >= 5, `downloads ${t.social}/${t.full}/${t.zips}`)
  assert(Number(t.reel_shares) >= 1, "reel share")
  const list = await j(await admin.get("/api/admin/galleries"))
  const row = list.galleries.find((g) => g.id === G.id)
  assert(row.views >= 1 && row.downloads >= 7 && row.favorites === 2, `list row ${JSON.stringify(row)}`)
  return `visitors ${t.visitors}, views ${t.views}, lightbox ${t.lightbox}, social ${t.social}, full ${t.full}, zips ${t.zips}, reel shares ${t.reel_shares}`
})

// ---- Q. Editor role -----------------------------------------------------------
await check("Editor role cannot manage users", async () => {
  const email = `editor-${Date.now()}@iconic.events`
  await j(await admin.post("/api/admin/users", { data: { email, name: "Editor", role: "editor", password: "editor-pass-123" } }))
  const ed = await apiCtx({ email, password: "editor-pass-123" })
  const users = await ed.get("/api/admin/users")
  assert(users.status() === 403, `users -> ${users.status()}`)
  const add = await ed.post("/api/admin/users", { data: { email: "x@y.z", password: "0123456789", role: "owner" } })
  assert(add.status() === 403, `add user -> ${add.status()}`)
  const gal = await ed.get("/api/admin/galleries")
  assert(gal.ok(), "editor cannot list galleries")
  return "GET and POST /users -> 403 for editor; galleries 200"
})

// ---- R. noindex and robots ----------------------------------------------------
await check("noindex header present; robots.txt disallows", async () => {
  const ctx = await apiCtx()
  for (const path of [`/${slug}`, `/api/g/${slug}`, `/${slug}/reel/${reel.id}`, "/admin"]) {
    const r = await ctx.get(path)
    assert(r.headers()["x-robots-tag"] === "noindex, nofollow", `${path} header ${r.headers()["x-robots-tag"]}`)
  }
  const robots = await (await ctx.get("/robots.txt")).text()
  assert(/Disallow: \/\s*$/m.test(robots), robots)
  const html = await (await ctx.get(`/${slug}`)).text()
  assert(/<meta name="robots" content="noindex, nofollow">/.test(html), "meta robots")
  return "X-Robots-Tag on gallery, API, reel and admin; robots.txt Disallow: /; meta robots in HTML"
})

// ---- The resumed upload should be ready by now --------------------------------
await check("Resumed 29 MB upload processed to a playable web version", async () => {
  const g = await waitProcessed(admin, G.id, 1)
  const m = g.media.find((x) => x.filename === "big-trailer.mp4")
  assert(m.status === "ready" && m.web && Number(m.sizeBytes) === 29353181, `status ${m.status} size ${m.sizeBytes}`)
  return `status ready, stored size ${m.sizeBytes}, web ${Math.round(m.derivativeSizes.web / 1024)} KB`
})

await browser.close()
await admin.dispose()
const ok = results.filter((r) => r.ok).length
console.log(`\n${ok}/${results.length} checks passed in ${Math.round((Date.now() - t0) / 1000)}s. Screenshots in ${shots}`)
writeFileSync(`${shots}/report.json`, JSON.stringify(results, null, 2))
process.exit(ok === results.length ? 0 : 1)
