// End to end check of People: reference photos in, matches out, hide and
// put back, and the Photos tab view. Expects the app on $BASE and three
// reference crops plus expected.json in $REFS (see README, Verification).
import { readFileSync } from "node:fs"
import { request, chromium } from "playwright"
const base = process.env.BASE || "http://localhost:3000"
const refs = process.env.REFS || "/tmp/claude-0/-home-user/df087097-d261-573d-bb2f-a8aa49cc8d02/scratchpad/refs"
const out = process.env.SHOTS || "/tmp"
const login = { email: "owner@iconic.events", password: "test-password-123" }
const assert = (c, m) => { if (!c) throw new Error(m) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const expected = JSON.parse(readFileSync(`${refs}/expected.json`, "utf8"))
const galleryId = Number(process.env.GALLERY || expected.galleryId || 21)
const gallerySlug = process.env.SLUG || expected.slug || "scaling-with-systems-live-bvrdwv"

const api = await request.newContext({ baseURL: base, extraHTTPHeaders: { Origin: base } })
assert((await api.post("/api/admin/login", { data: login })).ok(), "login")
// Clean slate for the test person.
for (const p of (await (await api.get("/api/admin/people")).json()).people) if (p.name === "Verify Person") await api.delete(`/api/admin/people/${p.id}`)
let r = await api.post("/api/admin/people", { data: { name: "Verify Person" } })
assert(r.ok(), "create person")
const person = (await r.json()).person
assert(person.ready === false, "person should not be ready without refs")
// A photo with no face is refused.
r = await api.put(`/api/admin/people/${person.id}/refs`, { data: readFileSync("data/fixtures/event/Keynote/IMG_1001.jpg"), headers: { "Content-Type": "image/jpeg" } })
assert(r.status() === 400, `no-face ref -> ${r.status()}`)
for (let i = 0; i < 3; i++) {
  r = await api.put(`/api/admin/people/${person.id}/refs`, { data: readFileSync(`${refs}/ref-${i}.jpg`), headers: { "Content-Type": "image/jpeg" } })
  assert(r.ok(), `ref ${i} -> ${r.status()} ${await r.text()}`)
}
const p2 = (await (await api.get("/api/admin/people")).json()).people.find((p) => p.id === person.id)
assert(p2.ready && p2.refs.length === 3 && p2.refs.every((x) => x.url), "refs stored")

// Wait for the scan of gallery 21 and the match job.
let data
for (let i = 0; i < 600; i++) {
  data = await (await api.get(`/api/admin/galleries/${galleryId}/people`)).json()
  const me = data.people.find((p) => p.id === person.id)
  if (data.scan.pending === 0 && me && me.matches.length >= expected.photos.length) break
  await sleep(2000)
}
const me = data.people.find((p) => p.id === person.id)
assert(data.scan.pending === 0, `scan still pending ${data.scan.pending}`)
const confident = me.matches.filter((m) => m.confident).map((m) => m.mediaId)
const missing = expected.photos.filter((id) => !confident.includes(id))
console.log("expected", expected.photos.length, "confident", confident.length, "missing", missing, "possible", me.matches.filter((m) => !m.confident).length)
assert(missing.length === 0, `missing expected photos ${missing}`)
assert(me.matches.every((m) => m.quality >= 0 && m.quality <= 1 && m.box), "quality and box present")
// Hide one, then put it back.
r = await api.post(`/api/admin/galleries/${galleryId}/people/${person.id}/reject`, { data: { mediaIds: [confident[0]] } })
assert(r.ok(), "reject")
let d2 = await (await api.get(`/api/admin/galleries/${galleryId}/people`)).json()
assert(d2.people.find((p) => p.id === person.id).matches.find((m) => m.mediaId === confident[0]).rejected, "rejected flag")
await api.post(`/api/admin/galleries/${galleryId}/people/${person.id}/reject`, { data: { mediaIds: [confident[0]], undo: true } })
d2 = await (await api.get(`/api/admin/galleries/${galleryId}/people`)).json()
assert(!d2.people.find((p) => p.id === person.id).matches.find((m) => m.mediaId === confident[0]).rejected, "undo")
// Confirming teaches: the match is confirmed, a learned reference appears.
r = await api.post(`/api/admin/galleries/${galleryId}/people/${person.id}/confirm`, { data: { mediaIds: [confident[0], confident[1]] } })
assert(r.ok(), `confirm -> ${r.status()}`)
let learnedRefs = []
for (let i = 0; i < 30; i++) {
  learnedRefs = (await (await api.get("/api/admin/people")).json()).people.find((p) => p.id === person.id).refs.filter((x) => x.source === "confirmed")
  if (learnedRefs.length === 2) break
  await sleep(1000)
}
assert(learnedRefs.length === 2 && learnedRefs.every((x) => x.url && x.mediaId), `learned refs ${learnedRefs.length}`)
d2 = await (await api.get(`/api/admin/galleries/${galleryId}/people`)).json()
let mine = d2.people.find((p) => p.id === person.id)
assert(mine.matches.filter((m) => m.confirmed).length === 2, "two confirmed")
assert(mine.matches[0].confirmed && mine.matches[1].confirmed, "confirmed sort first")
// Mark from an album: a photo with no match yet (or any) becomes confirmed; one with no face still lists.
const other = (await (await api.get(`/api/admin/galleries/${galleryId}`)).json()).gallery.media.find((m) => m.kind === "photo" && m.status === "ready" && !mine.matches.some((x) => x.mediaId === m.id))
r = await api.post(`/api/admin/galleries/${galleryId}/people/${person.id}/confirm`, { data: { mediaIds: [other.id] } })
assert(r.ok(), "mark from album")
d2 = await (await api.get(`/api/admin/galleries/${galleryId}/people`)).json()
mine = d2.people.find((p) => p.id === person.id)
assert(mine.matches.find((m) => m.mediaId === other.id)?.confirmed, "marked photo listed as confirmed")
// Unconfirm the marked one: gone from the list unless it matched on its own.
await api.post(`/api/admin/galleries/${galleryId}/people/${person.id}/confirm`, { data: { mediaIds: [other.id], undo: true } })
d2 = await (await api.get(`/api/admin/galleries/${galleryId}/people`)).json()
mine = d2.people.find((p) => p.id === person.id)
assert(!mine.matches.find((m) => m.mediaId === other.id)?.confirmed, "unconfirmed")
// Rejecting a confirmed photo forgets what was learned from it.
await api.post(`/api/admin/galleries/${galleryId}/people/${person.id}/reject`, { data: { mediaIds: [confident[1]] } })
for (let i = 0; i < 30; i++) {
  learnedRefs = (await (await api.get("/api/admin/people")).json()).people.find((p) => p.id === person.id).refs.filter((x) => x.source === "confirmed")
  if (learnedRefs.length === 1) break
  await sleep(1000)
}
assert(learnedRefs.length === 1, `learned refs after reject ${learnedRefs.length}`)
await api.post(`/api/admin/galleries/${galleryId}/people/${person.id}/reject`, { data: { mediaIds: [confident[1]], undo: true } })

// Removing a reference keeps the person but recomputes.
await api.delete(`/api/admin/people/${person.id}/refs/${p2.refs[2].id}`)
const p3 = (await (await api.get("/api/admin/people")).json()).people.find((p) => p.id === person.id)
assert(p3.refs.filter((x) => x.source !== "confirmed").length === 2 && p3.ready, "ref removed")

// Browser: People page and the person view on the Photos tab.
const browser = await chromium.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium" })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on("console", (m) => m.type() === "error" && !/favicon/.test(m.text()) && errors.push(m.text()))
page.on("pageerror", (e) => errors.push(String(e)))
await page.goto(`${base}/admin`)
await page.fill('input[type="email"]', login.email)
await page.fill('input[type="password"]', login.password)
await page.click('button:has-text("Sign in")')
await page.waitForSelector("h1:has-text('galler')")
await page.click('nav a:has-text("People")')
await page.waitForSelector("h2:has-text('Verify Person')")
await page.screenshot({ path: `${out}/people-page.png` })
await page.goto(`${base}/admin/galleries/${galleryId}`)
await page.waitForSelector('button:has-text("Verify Person")')
await page.click('button:has-text("Verify Person")')
await page.waitForSelector("h2:has-text('Verify Person')")
await sleep(500)
const tile = "div.aspect-square.cursor-pointer"
const shown = await page.locator(tile).count()
assert(shown >= confident.length, `view shows ${shown}, expected at least ${confident.length}`)
await page.screenshot({ path: `${out}/people-view.png` })
// Hide the first one from the UI, confirm it leaves the list.
// Confirmed badge shows; "Yes, it's" confirms from the view; "Mark as" works from an album.
assert((await page.locator(`${tile} >> text=Confirmed`).count()) >= 1, "confirmed badge")
await page.click(`${tile} >> nth=${confident.length - 1} >> [aria-label="Select"]`)
await page.click('button:has-text("Yes, it\'s Verify Person")')
await page.waitForFunction(() => document.querySelectorAll("div.aspect-square.cursor-pointer span").length > 0)
// Learning from the confirmations may have added matches, so count now.
const before = await page.locator(tile).count()
await page.click(`${tile} >> nth=0 >> [aria-label="Select"]`)
await page.click('button:has-text("Not Verify Person")')
// The hidden one leaves at once; the re-match may then adjust the rest.
await page.waitForFunction((n) => { const c = document.querySelectorAll("div.aspect-square.cursor-pointer").length; return c > 0 && c < n }, before)
await page.click(`text=${expected.album || "Main Stage"}`)
await page.waitForSelector(tile)
await page.click(`${tile} >> nth=2 >> [aria-label="Select"]`)
await page.click('button:has-text("Mark as")')
await page.click('[role="dialog"] button:has-text("Verify Person")')
await page.waitForSelector('[role="dialog"]', { state: "detached" })
await page.click('button:has-text("Verify Person")')
await page.waitForSelector("h2:has-text('Verify Person')")
await sleep(500)
await page.screenshot({ path: `${out}/people-confirm.png` })
assert(!errors.length, `console errors: ${errors.join(" | ")}`)
await browser.close()
// Guests see nothing of this.
const guest = await (await api.get(`/api/g/${gallerySlug}`)).json()
assert(!JSON.stringify(guest).includes("Verify Person"), "guest payload mentions people")
await api.delete(`/api/admin/people/${person.id}`)
console.log("PASS  People: refs refused without a face, 3 refs stored, all expected photos matched, confirm teaches and sorts first, mark from an album, unconfirm, reject forgets, hide and put back, People page and person view in the browser, nothing on the guest side")
