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
  data = await (await api.get("/api/admin/galleries/21/people")).json()
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
r = await api.post(`/api/admin/galleries/21/people/${person.id}/reject`, { data: { mediaIds: [confident[0]] } })
assert(r.ok(), "reject")
let d2 = await (await api.get("/api/admin/galleries/21/people")).json()
assert(d2.people.find((p) => p.id === person.id).matches.find((m) => m.mediaId === confident[0]).rejected, "rejected flag")
await api.post(`/api/admin/galleries/21/people/${person.id}/reject`, { data: { mediaIds: [confident[0]], undo: true } })
d2 = await (await api.get("/api/admin/galleries/21/people")).json()
assert(!d2.people.find((p) => p.id === person.id).matches.find((m) => m.mediaId === confident[0]).rejected, "undo")
// Removing a reference keeps the person but recomputes.
await api.delete(`/api/admin/people/${person.id}/refs/${p2.refs[2].id}`)
const p3 = (await (await api.get("/api/admin/people")).json()).people.find((p) => p.id === person.id)
assert(p3.refs.length === 2 && p3.ready, "ref removed")

// Browser: People page and the person view on the Photos tab.
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
await page.click('nav a:has-text("People")')
await page.waitForSelector("h2:has-text('Verify Person')")
await page.screenshot({ path: `${out}/people-page.png` })
await page.goto(`${base}/admin/galleries/21`)
await page.waitForSelector('button:has-text("Verify Person")')
await page.click('button:has-text("Verify Person")')
await page.waitForSelector("h2:has-text('Verify Person')")
await sleep(500)
const tile = "div.aspect-square.cursor-pointer"
const shown = await page.locator(tile).count()
assert(shown === confident.length, `view shows ${shown}, expected ${confident.length}`)
await page.screenshot({ path: `${out}/people-view.png` })
// Hide the first one from the UI, confirm it leaves the list.
await page.click(`${tile} >> nth=0 >> [aria-label="Select"]`)
await page.click('button:has-text("Not Verify Person")')
await page.waitForFunction((n) => document.querySelectorAll("div.aspect-square.cursor-pointer").length === n, confident.length - 1)
assert(!errors.length, `console errors: ${errors.join(" | ")}`)
await browser.close()
// Guests see nothing of this.
const guest = await (await api.get(`/api/g/scaling-with-systems-live-bvrdwv`)).json()
assert(!JSON.stringify(guest).includes("Verify Person"), "guest payload mentions people")
await api.delete(`/api/admin/people/${person.id}`)
console.log("PASS  People: refs refused without a face, 3 refs stored, all expected photos matched with confidence, hide and put back, People page and person view in the browser, nothing on the guest side")
