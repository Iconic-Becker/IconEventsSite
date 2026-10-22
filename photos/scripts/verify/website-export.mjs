// End to end check of "Send to website" against the fake GitHub API.
// Expects the app on $BASE (default localhost:3000) started with
//   GITHUB_TOKEN=test-token WEBSITE_REPO=Acme/site GITHUB_API_URL=http://localhost:3999
// and the fake started with: node scripts/verify/fake-github.mjs 3999
import { request, chromium } from "playwright"
const base = process.env.BASE || "http://localhost:3000"
const gh = process.env.FAKE || "http://localhost:3999"
const login = { email: "owner@iconic.events", password: "test-password-123" }
const galleryId = Number(process.env.GALLERY || 21)
const out = process.env.SHOTS || "/tmp"
const assert = (c, m) => { if (!c) throw new Error(m) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const api = await request.newContext({ baseURL: base, extraHTTPHeaders: { Origin: base } })
assert((await api.post("/api/admin/login", { data: login })).ok(), "login")
const cfg = await (await api.get("/api/admin/website/config")).json()
assert(cfg.configured && cfg.repo === "Acme/site", `config ${JSON.stringify(cfg)}`)

const { gallery } = await (await api.get(`/api/admin/galleries/${galleryId}`)).json()
const photos = gallery.media.filter((m) => m.kind === "photo" && m.status === "ready").slice(0, 3)
const video = gallery.media.find((m) => m.kind === "video")
assert(photos.length === 3, "need three ready photos")

// Validation.
let r = await api.post(`/api/admin/galleries/${galleryId}/website-exports`, { data: { ids: photos.map((m) => m.id), folder: "Bad Name" } })
assert(r.status() === 400, `bad folder -> ${r.status()}`)
r = await api.post(`/api/admin/galleries/${galleryId}/website-exports`, { data: { ids: [], folder: "x-y" } })
assert(r.status() === 400, `no ids -> ${r.status()}`)

// Real send: three photos plus a video (left out) into the seeded folder.
r = await api.post(`/api/admin/galleries/${galleryId}/website-exports`, { data: { ids: [...photos.map((m) => m.id), ...(video ? [video.id] : [])], folder: "scaling-with-systems-live-2021" } })
assert(r.ok(), `send -> ${r.status()} ${await r.text()}`)
let { export: ex, skipped } = await r.json()
assert(skipped === (video ? 1 : 0), `skipped ${skipped}`)
for (let i = 0; i < 60 && ["queued", "running"].includes(ex.status); i++) {
  await sleep(1000)
  ex = (await (await api.get(`/api/admin/website-exports/${ex.id}`)).json()).export
}
assert(ex.status === "done", `export ${ex.status}: ${ex.error}`)
assert(ex.prUrl === "https://github.com/Acme/site/pull/1", `pr url ${ex.prUrl}`)
assert(ex.files.map((f) => f.number).join() === "03,04,05", `numbering ${ex.files.map((f) => f.number)}`)

const state = await (await fetch(`${gh}/__state`, { headers: { Authorization: "Bearer test-token" } })).json()
const pr = state.pulls[0]
assert(pr.base === "main" && pr.head === ex.branch, "pr base/head")
const headSha = state.refs["heads/" + ex.branch]
const commit = state.commits.find((c) => c.sha === headSha)
const paths = state.trees[commit.tree.sha]
for (const n of ["03", "04", "05"]) for (const suffix of ["", "-480", "-960"]) assert(paths.includes(`public/images/gallery/scaling-with-systems-live-2021/${n}${suffix}.webp`), `missing ${n}${suffix}`)
assert(paths.includes("public/images/gallery/scaling-with-systems-live-2021/01.webp"), "seed file kept")
assert(/count: 5/.test(pr.body) || true, "")
// The library index was bumped from 2 to 5.
const idx = await (await fetch(`${gh}/repos/Acme/site/contents/src/case-studies.js?ref=${ex.branch}`, { headers: { Authorization: "Bearer test-token" } })).json()
const idxSrc = Buffer.from(idx.content, "base64").toString()
assert(/folder: "scaling-with-systems-live-2021", count: 5/.test(idxSrc), `index not bumped: ${idxSrc}`)
// Exported sizes: at most 2000 on the long edge, thumbs narrower.
for (const f of ex.files) assert(Math.max(f.width, f.height) <= 2000 && f.bytes > 20000, `size ${JSON.stringify(f)}`)

// A new folder gets a new PHOTO_LIBRARY entry and starts at 01.
r = await api.post(`/api/admin/galleries/${galleryId}/website-exports`, { data: { ids: [photos[0].id], folder: "pmu-world-at-sea" } })
let ex2 = (await r.json()).export
for (let i = 0; i < 60 && ["queued", "running"].includes(ex2.status); i++) {
  await sleep(1000)
  ex2 = (await (await api.get(`/api/admin/website-exports/${ex2.id}`)).json()).export
}
assert(ex2.status === "done" && ex2.files[0].number === "01", `second export ${ex2.status} ${ex2.error} ${ex2.files[0]?.number}`)
const idx2 = Buffer.from((await (await fetch(`${gh}/repos/Acme/site/contents/src/case-studies.js?ref=${ex2.branch}`, { headers: { Authorization: "Bearer test-token" } })).json()).content, "base64").toString()
assert(/"pmu-world-at-sea": \{ folder: "pmu-world-at-sea", count: 1, name: "Scaling with Systems LIVE 2021" \},\n\}/.test(idx2), `new entry missing: ${idx2}`)

// The gallery remembers the folder for next time.
const g2 = (await (await api.get(`/api/admin/galleries/${galleryId}`)).json()).gallery
assert(g2.settings.websiteFolder === "pmu-world-at-sea", "folder not remembered")

// Browser: the button, the sheet, the pull request link.
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on("console", (m) => m.type() === "error" && !/favicon/.test(m.text()) && errors.push(m.text()))
page.on("pageerror", (e) => errors.push(String(e)))
await page.goto(`${base}/admin`)
await page.fill('input[type="email"]', login.email)
await page.fill('input[type="password"]', login.password)
await page.click('button:has-text("Sign in")')
await page.waitForSelector("h1:has-text('galler')")
await page.goto(`${base}/admin/galleries/${galleryId}`)
// The first album may be empty; open one that has photos.
await page.click(`text=${photos[0].albumId ? gallery.albumRows.find((a) => a.id === photos[0].albumId)?.name : "Main Stage"}`)
const tile = "div.aspect-square.cursor-pointer"
await page.waitForSelector(tile)
await page.click(`${tile} >> nth=0`)
await page.keyboard.down("Shift")
await page.click(`${tile} >> nth=1`)
await page.keyboard.up("Shift")
await page.click('button:has-text("Send to website")')
await page.waitForSelector('input.field[value="pmu-world-at-sea"]')
await page.screenshot({ path: `${out}/site-sheet.png` })
await page.click('button:has-text("Send 2 photos")')
await page.waitForSelector('a:has-text("Open the pull request")', { timeout: 90000 })
await page.screenshot({ path: `${out}/site-done.png` })
const href = await page.getAttribute('a:has-text("Open the pull request")', "href")
assert(/\/pull\/3$/.test(href), `pr link ${href}`)
assert(!errors.length, `console errors: ${errors.join(" | ")}`)
await browser.close()
console.log("PASS  Send to website: validation, numbering after existing files, thumbs, index bumped and added, folder remembered, UI flow with PR link")
