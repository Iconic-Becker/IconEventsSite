// Clicks every control on the guest gallery and the admin, on phone and
// desktop, and times the paths guests feel. Run against a local server:
//   node scripts/verify/sweep.mjs <realGallerySlug> <reelGallerySlug> <bigGallerySlug> [shotsDir]
import { chromium, request } from "playwright"
import { mkdirSync, writeFileSync, statSync } from "node:fs"

const [realSlug, reelSlug, bigSlug, shots = "data/sweep-shots", only = "all"] = process.argv.slice(2)
let currentPage = null
let currentErrs = null
const base = "http://localhost:3000"
const OWNER = { email: "owner@iconic.events", password: "test-password-123" }
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
mkdirSync(shots, { recursive: true })
const results = []
const RUN = Date.now().toString(36)
// A real album chip (not Highlights, not the home link).
const albumChip = (n = 0) => `.sticky a[href*="/"]:not([href$="/highlights"]):not([aria-label]):not(:has(img)) >> nth=${n}`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const assert = (c, m) => {
  if (!c) throw new Error(m)
}
async function step(name, fn) {
  const t = Date.now()
  if (currentErrs) currentErrs.length = 0
  try {
    const d = await fn()
    results.push({ name, ok: true, ms: Date.now() - t, detail: d || "" })
    console.log(`ok    ${String(Date.now() - t).padStart(5)}ms  ${name}${d ? `  [${d}]` : ""}`)
  } catch (e) {
    results.push({ name, ok: false, ms: Date.now() - t, detail: e.message })
    console.log(`FAIL  ${String(Date.now() - t).padStart(5)}ms  ${name}  ${e.message.split("\n")[0]}`)
    try {
      const file = `${shots}/fail-${results.length}.png`
      await currentPage?.screenshot({ path: file })
      console.log(`      url ${currentPage?.url()}  screenshot ${file}`)
    } catch {}
  }
}
const browser = await chromium.launch({ executablePath: CHROME })
const admin = await request.newContext({ baseURL: base, extraHTTPHeaders: { Origin: base } })
await admin.post("/api/admin/login", { data: OWNER })
const j = async (r) => {
  const b = await r.json().catch(() => ({}))
  if (!r.ok()) throw new Error(`${r.url()} ${r.status()} ${b.error || ""}`)
  return b
}

function ctxOpts(w) {
  return { viewport: { width: w, height: w < 700 ? 844 : 900 }, isMobile: w < 700, hasTouch: w < 700, acceptDownloads: true }
}
function watch(page) {
  const errors = []
  page.on("pageerror", (e) => errors.push(String(e).split("\n")[0]))
  page.on("console", (m) => m.type() === "error" && !/favicon|ERR_ABORTED/.test(m.text()) && errors.push(m.text().slice(0, 200)))
  page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()} ${r.request().method()} ${r.url().slice(0, 120)}`))
  page.on("dialog", (d) => d.accept(d.type() === "prompt" ? "new-password-12345" : undefined))
  currentErrs = errors
  return errors
}
async function mockShare(ctx) {
  await ctx.addInitScript(() => {
    window.__copied = null
    Object.defineProperty(navigator, "clipboard", { value: { writeText: async (t) => { window.__copied = t } }, configurable: true })
  })
}
const timing = (page) => page.evaluate(() => { const n = performance.getEntriesByType("navigation")[0]; return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), transfer: Math.round(n.transferSize / 1024) } })
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
const noErr = (errs, label) => assert(!errs.length, `${label}: ${errs.join(" | ")}`)

// ================= GUEST =================
for (const w of only === "admin" ? [] : [390, 1440]) {
  const ctx = await browser.newContext(ctxOpts(w))
  await mockShare(ctx)
  const page = await ctx.newPage()
  currentPage = page
  const errs = watch(page)
  const tag = w === 390 ? "phone" : "desktop"

  await step(`guest ${tag}: overview loads`, async () => {
    await page.goto(`${base}/${realSlug}`, { waitUntil: "networkidle" })
    const t = await timing(page)
    assert(await page.$("section.cover"), "no cover")
    assert(!(await overflow(page)), "overflow")
    noErr(errs, "load")
    return `DOMContentLoaded ${t.dcl}ms, load ${t.load}ms`
  })
  await step(`guest ${tag}: View the photos scrolls to the grid`, async () => {
    await page.click("text=View the photos")
    await sleep(900)
    const y = await page.evaluate(() => window.scrollY)
    assert(y > 200, `scrollY ${y}`)
    return `scrollY ${y}`
  })
  await step(`guest ${tag}: album tile opens album, Back returns`, async () => {
    const before = await page.evaluate(() => window.scrollY)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.click('#albums a >> nth=1')
    await page.waitForSelector(".tile")
    assert(/\/[a-z0-9-]+\/[a-z0-9-]+$/.test(page.url()), `url ${page.url()}`)
    await page.goBack()
    await page.waitForSelector("#albums")
    return `album url ok, back to overview`
  })
  await step(`guest ${tag}: album chips and All albums sheet`, async () => {
    await page.click(albumChip(0))
    await page.waitForSelector('.sticky a[aria-current="page"]')
    if (w > 700) {
      const arrows = await page.$$('button[aria-label^="Scroll albums"]')
      assert(arrows.length === 0 || arrows.length <= 2, "arrow buttons")
    }
    const all = await page.$('button[aria-label="All albums"]')
    assert(all, "no All albums button")
    await all.click()
    await page.waitForSelector('[role="dialog"] li a')
    await page.keyboard.press("Escape")
    await sleep(300)
    assert(!(await page.$('[role="dialog"]')), "Escape did not close")
    await all.click()
    await page.waitForSelector('[role="dialog"]')
    await page.click('[role="dialog"] button[aria-label="Close"]')
    await sleep(300)
    assert(!(await page.$('[role="dialog"]')), "X did not close")
    await all.click()
    await page.click('[role="dialog"] li a >> nth=0')
    await page.waitForSelector(".tile")
    return "chip, sheet open/close via Escape, X, item"
  })
  await step(`guest ${tag}: heart gate cancel, bad email, good email, toggle`, async () => {
    const heart = (await page.$$('.tile [aria-label="Add to favorites"]'))[0]
    await heart.click()
    await page.waitForSelector("text=Save your favorites")
    await page.click('[role="dialog"] button[aria-label="Close"]')
    await sleep(300)
    assert(!(await page.$("text=Save your favorites")), "cancel did not close")
    assert(!(await page.$('.tile [aria-pressed="true"]')), "favorited without email")
    await heart.click()
    await page.waitForSelector("text=Save your favorites")
    await page.fill('input[type="email"]', "not-an-email")
    await page.click('button:has-text("Save favorite")')
    await sleep(300)
    assert(await page.$("text=Save your favorites"), "invalid email accepted")
    await page.fill('input[type="email"]', `sweep-${RUN}-${w}@example.com`)
    await page.fill('input[type="text"]', "Sweep Guest")
    await page.click('button:has-text("Save favorite")')
    await page.waitForSelector('.tile [aria-pressed="true"]')
    await page.waitForSelector("text=Saved to your favorites")
    const pressed = await page.$('.tile [aria-pressed="true"]')
    await pressed.click()
    await page.waitForFunction(() => !document.querySelector('.tile [aria-pressed="true"]'))
    await (await page.$$('.tile [aria-label="Add to favorites"]'))[0].click()
    await (await page.$$('.tile [aria-label="Add to favorites"]'))[0].click()
    await page.waitForFunction(() => document.querySelectorAll('.tile [aria-pressed="true"]').length === 2)
    const badge = await page.textContent('button[aria-label="My favorites"]')
    assert(badge.includes("2"), `badge ${badge}`)
    return "gate closes on X, rejects bad email, saves, toggles, badge 2"
  })
  await step(`guest ${tag}: My favorites view and download`, async () => {
    await page.click('button[aria-label="My favorites"]')
    await page.waitForSelector("h2:has-text('My favorites')")
    await page.waitForFunction(() => document.querySelectorAll(".tile").length === 2)
    const [dl] = await Promise.all([
      page.waitForEvent("download", { timeout: 30000 }),
      (async () => {
        await page.click('button:has-text("Download favorites")')
        await page.waitForSelector("text=Full resolution")
        await page.click("text=Both")
      })(),
    ])
    const path = await dl.path()
    assert(statSync(path).size > 10000, "zip too small")
    await page.click('button[aria-label="My favorites"]')
    await page.waitForSelector("#albums")
    return `favorites zip ${Math.round(statSync(path).size / 1024)} KB`
  })
  await step(`guest ${tag}: Download button: album zip builds and downloads`, async () => {
    await page.click(albumChip(0))
    await page.waitForSelector('.sticky a[aria-current="page"]')
    await page.click('button[aria-label="Download"]')
    await page.waitForSelector("text=Whole gallery")
    await page.click("text=This album")
    await page.waitForSelector("text=Social")
    const [dl] = await Promise.all([page.waitForEvent("download", { timeout: 90000 }), page.click("text=Social")])
    const p = await dl.path()
    assert(statSync(p).size > 100000, "album zip too small")
    await page.keyboard.press("Escape")
    return `album zip ${Math.round(statSync(p).size / 1024)} KB`
  })
  await step(`guest ${tag}: lightbox buttons, keys, share, download, deep link`, async () => {
    const tiles = await page.$$(".tile > button:first-child")
    await tiles[1].click()
    await page.waitForSelector(".yarl__container")
    const p1 = new URL(page.url()).searchParams.get("p")
    await page.click('.yarl__button[aria-label="Next"]')
    await sleep(400)
    const p2 = new URL(page.url()).searchParams.get("p")
    assert(p2 !== p1, "Next button")
    await page.click('.yarl__button[aria-label="Previous"]')
    await sleep(400)
    assert(new URL(page.url()).searchParams.get("p") === p1, "Previous button")
    await page.click('.yarl__button[aria-label="Share"]')
    await page.waitForSelector("text=Link copied")
    const copied = await page.evaluate(() => window.__copied)
    assert(copied && copied.includes(`?p=${p1}`), `copied ${copied}`)
    await page.click('.yarl__button[aria-label="Download"]')
    await page.waitForSelector("text=Full resolution")
    const [dl] = await Promise.all([page.waitForEvent("download", { timeout: 30000 }), page.click("text=Full resolution")])
    assert((await dl.suggestedFilename()).match(/\.(jpe?g)$/i), `download name ${await dl.suggestedFilename()}`)
    assert(await page.$(".yarl__container"), "lightbox closed after download")
    await page.click('.yarl__button[aria-label="Zoom in"]')
    await sleep(300)
    await page.keyboard.press("Escape")
    await sleep(400)
    assert(!(await page.$(".yarl__container")), "Escape did not close")
    await page.goto(`${page.url().split("?")[0]}?p=${p2}`, { waitUntil: "networkidle" })
    await page.waitForSelector(".yarl__container")
    await page.click('.yarl__button[aria-label="Close"]')
    await sleep(400)
    assert(!(await page.$(".yarl__container")), "Close button")
    return `next/prev, share copied ?p=${p1}, full download ${await dl.suggestedFilename()}, zoom, Escape, deep link, X`
  })
  await step(`guest ${tag}: next album card and end of gallery`, async () => {
    await page.click("text=Next album")
    await page.waitForSelector(".tile")
    const chips = await page.$$('.sticky a[href*="/"]')
    await chips[chips.length - 1].click()
    await page.waitForSelector("text=Back to the start")
    await page.click("text=Back to the start")
    await page.waitForSelector("section.cover")
    return "next card, last album shows Back to the start"
  })
  await step(`guest ${tag}: reels: play, copy link, download, share page`, async () => {
    await page.goto(`${base}/${reelSlug}`, { waitUntil: "networkidle" })
    const play = await page.$('button[aria-label^="Play"]')
    assert(play, "no play button")
    await play.click()
    await page.waitForSelector("video")
    const btn = await page.$('button:has-text("Copy link"), button:has-text("Share")')
    await btn.click()
    await sleep(400)
    const copied = await page.evaluate(() => window.__copied)
    assert(copied && /\/reel\/\d+$/.test(copied), `copied ${copied}`)
    await page.click('button:has-text("Download") >> nth=0')
    await page.waitForSelector("text=Full resolution")
    await page.keyboard.press("Escape")
    await page.click("text=Open share page")
    await page.waitForSelector("text=See the full gallery")
    assert(await page.$('button[aria-label^="Play"]'), "reel page player")
    await page.click("text=See the full gallery")
    await page.waitForSelector("section.cover")
    noErr(errs, "reels")
    return `copied ${copied.split("/").slice(-2).join("/")}`
  })
  await step(`guest ${tag}: unknown gallery shows a clean not-found page`, async () => {
    const r = await page.goto(`${base}/does-not-exist-abc123`, { waitUntil: "networkidle" })
    assert(await page.$("text=This gallery is not available"), "no not-found copy")
    return `status ${r.status()}`
  })
  await ctx.close()
}

// Performance at scale: the large gallery.
if (bigSlug && bigSlug !== "-" && only !== "admin") {
  const ctx = await browser.newContext(ctxOpts(390))
  const page = await ctx.newPage()
  currentPage = page
  const errs = watch(page)
  await step("scale phone: 600-photo gallery album renders fast", async () => {
    const g = await j(await admin.get(`/api/g/${bigSlug}`))
    const albumSlug = g.albums.find((a) => a.count >= 100).slug
    const t0 = Date.now()
    const r = await admin.get(`/api/g/${bigSlug}/albums/${albumSlug}`)
    const apiMs = Date.now() - t0
    const body = await r.text()
    const t1 = Date.now()
    await page.goto(`${base}/${bigSlug}/${albumSlug}`, { waitUntil: "domcontentloaded" })
    await page.waitForSelector(".tile")
    const firstTile = Date.now() - t1
    await page.waitForLoadState("networkidle")
    const tiles = await page.$$eval(".tile", (t) => t.length)
    assert(tiles >= 100, `tiles ${tiles}`)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await sleep(600)
    noErr(errs, "scale")
    assert(!(await overflow(page)), "overflow")
    return `album JSON ${Math.round(body.length / 1024)} KB in ${apiMs}ms, first tiles at ${firstTile}ms, ${tiles} tiles`
  })
  await step("scale: whole-gallery zip (600 photos) builds", async () => {
    const t0 = Date.now()
    let d = await j(await admin.post(`/api/g/${bigSlug}/zips`, { data: { size: "social" } }))
    while (d.status === "building" && Date.now() - t0 < 180000) {
      await sleep(2000)
      d = await j(await admin.get(`/api/g/${bigSlug}/zips?size=social`))
      if (d.status === "none") d = await j(await admin.post(`/api/g/${bigSlug}/zips`, { data: { size: "social" } }))
    }
    assert(d.status === "ready", `status ${d.status}`)
    return `${d.parts.length} part(s), ${Math.round(d.parts[0].bytes / 1024 / 1024)} MB, ${Math.round((Date.now() - t0) / 1000)}s`
  })
  await ctx.close()
}

// ================= ADMIN =================
if (only !== "guest") {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true })
  await mockShare(ctx)
  const page = await ctx.newPage()
  currentPage = page
  const errs = watch(page)
  let gid
  await step("admin: wrong password is refused, right one signs in", async () => {
    await page.goto(`${base}/admin`, { waitUntil: "networkidle" })
    await page.fill('input[type="email"]', OWNER.email)
    await page.fill('input[type="password"]', "wrong-password-1")
    await page.click('button:has-text("Sign in")')
    await page.waitForSelector("text=Email or password is not right")
    await page.fill('input[type="password"]', OWNER.password)
    await page.click('button:has-text("Sign in")')
    await page.waitForSelector("h1:has-text('galler')")
  })
  await step("admin: gallery list copy link, new gallery sheet", async () => {
    await page.click('button[aria-label="Copy link"] >> nth=0')
    await sleep(200)
    assert(/^http/.test(await page.evaluate(() => window.__copied)), "copy link")
    await page.click('button:has-text("New gallery")')
    await page.waitForSelector("text=Event date")
    await page.keyboard.press("Escape")
    await sleep(300)
    assert(!(await page.$('[role="dialog"]')), "Escape did not close")
    await page.click('button:has-text("New gallery")')
    await page.fill('input[placeholder="Smith Gala"]', "Sweep Gallery")
    await page.fill('input[type="date"]', "2026-11-05")
    await page.click('button:has-text("Create")')
    await page.waitForURL(/galleries\/(\d+)/)
    gid = Number(page.url().match(/galleries\/(\d+)/)[1])
    return `gallery ${gid}`
  })
  await step("admin: upload via Choose folder and Choose files", async () => {
    const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.click('button:has-text("Choose folder")')])
    await chooser.setFiles("data/fixtures/event")
    await page.waitForSelector("text=/Uploaded \\d+ files/", { timeout: 120000 })
    const [chooser2] = await Promise.all([page.waitForEvent("filechooser"), page.click('button:has-text("Choose files")')])
    await chooser2.setFiles(["data/real/19_Takeover_Live_2/19 Takeover Live 2/01 F2643EEF-0721-4B5C-9BF4-636E9251C61A_1_105_c.jpeg"])
    await page.waitForSelector("text=/Uploaded \\d+ files/", { timeout: 60000 })
    // wait for processing
    const until = Date.now() + 240000
    while (Date.now() < until) {
      const { gallery } = await j(await admin.get(`/api/admin/galleries/${gid}`))
      if (gallery.media.every((m) => ["ready", "attention", "failed"].includes(m.status)) && gallery.media.length >= 36) return `${gallery.media.length} items ready`
      await sleep(2000)
    }
    throw new Error("processing timed out")
  })
  await step("admin: albums rename, reorder, add, select, bulk star/unstar/cover/move/delete/restore", async () => {
    await page.reload({ waitUntil: "networkidle" })
    await page.waitForSelector("text=drag to reorder")
    await page.hover("li:has-text('Keynote')")
    await page.click('li:has-text("Keynote") button[aria-label="Rename"]')
    await page.fill('li input.field', "Main Stage")
    await page.keyboard.press("Enter")
    await page.waitForSelector("li:has-text('Main Stage')")
    await page.hover("li:has-text('Main Stage')")
    await page.click('li:has-text("Main Stage") button[aria-label="Move up"]')
    await sleep(500)
    await page.fill('input[placeholder="New album"]', "Sponsors")
    await page.click('button[aria-label="Add album"]')
    await page.waitForSelector("li:has-text('Sponsors')")
    await page.click("li button:has-text('Main Stage')")
    await page.waitForSelector("h2:has-text('Main Stage')")
    await page.click('button:has-text("Select all")')
    await page.waitForSelector("text=/\\d+ selected/")
    await page.click('button:has-text("Star")')
    await page.waitForFunction(() => document.querySelectorAll("svg.lucide-star").length >= 10)
    await page.click('button:has-text("Select all")')
    await page.click('button:has-text("Unstar")')
    await sleep(600)
    const tiles = await page.$$(".aspect-square.cursor-pointer")
    await tiles[0].click()
    await page.click('button:has-text("Gallery cover")')
    await page.waitForSelector("text=Cover")
    await tiles[1].click()
    await page.click('button:has-text("Album cover")')
    await page.waitForSelector("text=Album cover")
    await tiles[2].click()
    await page.click('button:has-text("Move")')
    await page.click('[role="dialog"] button:has-text("Sponsors")')
    await sleep(600)
    await (await page.$$(".aspect-square.cursor-pointer"))[3].click()
    await page.click('button:has-text("Delete")')
    await page.waitForSelector("text=/Trash \\(1\\)/")
    await page.click("summary:has-text('Trash')")
    await page.click('button[title="Restore"]')
    await page.waitForFunction(() => !document.body.innerText.includes("Trash (1)"))
    await page.click('button:has-text("Sort by time")')
    await sleep(500)
    await page.dragAndDrop(".aspect-square.cursor-pointer >> nth=0", ".aspect-square.cursor-pointer >> nth=2")
    await sleep(600)
    noErr(errs, "photos tab")
    return "rename, move up, add album, star/unstar, covers, move, delete/restore, sort, drag"
  })
  await step("admin: design tab every control, pickers, focal, logo, save", async () => {
    await page.click('nav a:has-text("Design")')
    await page.waitForSelector("text=Live preview")
    for (const name of ["Split", "Video", "Mosaic", "Title card", "Full bleed", "Light (bone)", "Causten", "Masonry", "Compact", "Slow zoom", "Dark (onyx)"]) {
      await page.click(`button:has-text("${name}")`)
      await sleep(120)
    }
    await page.click('button:has-text("Phone")')
    await page.click('button:has-text("Desktop")')
    await page.click('.label:has-text("Mosaic photos") + button')
    await page.waitForSelector('[role="dialog"]')
    const picks = await page.$$('[role="dialog"] button.aspect-square')
    for (let i = 0; i < 4; i++) await picks[i].click()
    await page.click('[role="dialog"] button:has-text("Done")')
    await page.click('.label:has-text("Cover photo") + button')
    await page.waitForSelector('[role="dialog"]')
    await (await page.$$('[role="dialog"] button.aspect-square'))[5].click()
    await sleep(300)
    const focal = await page.$(".cursor-crosshair")
    const box = await focal.boundingBox()
    await page.mouse.click(box.x + box.width * 0.8, box.y + box.height * 0.3)
    await sleep(200)
    const marker = await page.$eval(".cursor-crosshair span", (el) => el.style.left)
    assert(marker === "80%", `focal left ${marker}`)
    await page.setInputFiles('input[type="file"][accept*="svg"]', "public/brand/logo-white.png")
    await page.waitForSelector('button:has-text("Remove")')
    await page.fill("textarea", "Sweep intro line.")
    await page.click('button:has-text("Save changes")')
    await page.waitForSelector('button:has-text("Saved")')
    await page.click('button:has-text("Remove")')
    await page.waitForSelector("text=Upload PNG or SVG")
    const { gallery } = await j(await admin.get(`/api/admin/galleries/${gid}`))
    assert(gallery.settings.focal.x === 0.8 && gallery.settings.mosaicIds.length === 4 && gallery.intro === "Sweep intro line.", "settings not saved")
    noErr(errs, "design")
    return "layouts, theme, type, grid, density, animation, device, mosaic 4, cover, focal 80%, logo add/remove, save"
  })
  await step("admin: reels tab controls", async () => {
    await page.click('nav a:has-text("Reels")')
    await page.waitForSelector("text=Drop a video")
    const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.click('button:has-text("Choose files")')])
    await chooser.setFiles("data/fixtures/event/reel-9x16.mp4")
    await page.waitForSelector("text=/Uploaded \\d+ files/", { timeout: 60000 })
    const until = Date.now() + 120000
    while (Date.now() < until) {
      const { gallery } = await j(await admin.get(`/api/admin/galleries/${gid}`))
      if (gallery.reels.length) break
      await sleep(2000)
    }
    await page.reload({ waitUntil: "networkidle" })
    await page.fill('input.field >> nth=0', "Sweep Reel")
    await page.keyboard.press("Tab")
    await sleep(500)
    await page.click('button:has-text("Private")')
    await page.waitForSelector('button:has-text("Public")')
    await page.click('button:has-text("Copy share link")')
    await sleep(200)
    assert(/\/reel\/\d+$/.test(await page.evaluate(() => window.__copied)), "copy share link")
    const { gallery } = await j(await admin.get(`/api/admin/galleries/${gid}`))
    assert(gallery.reels[0].title === "Sweep Reel" && gallery.reels[0].isPublic, "reel edits not saved")
    noErr(errs, "reels")
    return "upload, title, public, copy link"
  })
  await step("admin: favorites, analytics, settings, trash and restore gallery", async () => {
    await page.click('nav a:has-text("Favorites")')
    await page.waitForSelector("text=guest")
    await page.click('nav a:has-text("Analytics")')
    await page.waitForSelector("text=Unique visitors")
    await page.click('nav a:has-text("Settings")')
    await page.waitForSelector("text=Visibility")
    await page.fill('input[placeholder="Set a password"]', "sweep-pass")
    await page.click('button:has-text("Set")')
    await page.waitForSelector("text=Password set")
    const g1 = await j(await admin.get(`/api/admin/galleries/${gid}`))
    assert(g1.gallery.hasPassword, "password not set")
    await page.click('button:has-text("Remove")')
    await page.waitForSelector("text=Password removed")
    await page.click('input[type="checkbox"]')
    await page.waitForSelector("text=Gallery is hidden")
    const anon = await request.newContext({ baseURL: base })
    assert((await anon.get(`/api/g/${g1.gallery.slug}`)).status() === 404, "hidden gallery still visible")
    await page.click('input[type="checkbox"]')
    await page.waitForSelector("text=Gallery is visible")
    await page.click('button:has-text("Delete gallery")')
    await page.waitForURL(/\/admin$/)
    await page.click("summary:has-text('Trash')")
    await page.click('button:has-text("Restore")')
    await page.waitForFunction(() => !document.body.innerText.includes("Trash ("))
    const csv = await admin.get(`/api/admin/galleries/${gid}/favorites.csv`)
    assert(csv.ok(), "favorites csv")
    noErr(errs, "settings")
    return "password set/remove, hide/show (404 when hidden), delete/restore, csv"
  })
  await step("admin: users add, role, disable, reset password, delete; guests csv; logout", async () => {
    await page.click('nav a:has-text("Users")')
    await page.waitForSelector("h1:has-text('Users')")
    const email = `sweep-${Date.now()}@iconic.events`
    await page.fill('form input[type="email"]', email)
    await page.fill('form input[type="text"] >> nth=0', "Sweep User")
    await page.fill('form input[minlength="10"]', "sweep-password-1")
    await page.click('button:has-text("Add user")')
    await page.waitForSelector(`text=${email}`)
    const row = page.locator("tr", { hasText: email })
    await row.locator("select").selectOption("owner")
    await sleep(400)
    await row.locator('button:has-text("Active")').click()
    await row.locator('button:has-text("Disabled")').waitFor()
    await row.locator('button[title="Reset password"]').click()
    await sleep(400)
    await row.locator('button[title="Delete"]').click()
    await page.waitForFunction((e) => !document.body.innerText.includes(e), email)
    const csv = await admin.get("/api/admin/guests.csv")
    assert(csv.ok() && (await csv.text()).includes("Email"), "guests csv")
    await page.click('button[aria-label="Sign out"]')
    await page.waitForSelector('button:has-text("Sign in")')
    noErr(errs, "users")
    return "add, role, disable, reset, delete, csv, logout"
  })
  await ctx.close()
}

await browser.close()
const ok = results.filter((r) => r.ok).length
console.log(`\n${ok}/${results.length} steps passed`)
writeFileSync(`${shots}/sweep.json`, JSON.stringify(results, null, 2))
process.exit(ok === results.length ? 0 : 1)
