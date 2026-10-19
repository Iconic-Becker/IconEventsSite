// Captures example screenshots of a gallery and the admin for review.
//   node scripts/verify/example-shots.mjs <gallerySlug> <galleryId> <albumSlug> <photoId> [outDir]
// Needs a running local server and the owner account from the verify suite.
import { chromium } from "playwright"
const [slug, gid, albumSlug, photoId, outArg] = process.argv.slice(2)
const base = "http://localhost:3000", out = outArg || "data/example-shots"
import { mkdirSync } from "node:fs"
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
async function shot(name, url, w, h, full, before) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700, deviceScaleFactor: w < 700 ? 2 : 1 })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: "networkidle" }); await page.waitForTimeout(1500)
  if (before) await before(page)
  await page.screenshot({ path: out + "/" + name + ".png", fullPage: full })
  await ctx.close()
}
await shot("1-cover-desktop", base + "/" + slug, 1440, 900, false)
await shot("2-overview-phone", base + "/" + slug, 390, 844, true)
await shot("3-album-desktop", base + "/" + slug + "/" + albumSlug, 1440, 900, true)
await shot("4-lightbox-phone", base + "/" + slug + "/" + albumSlug + "?p=" + photoId + "", 390, 844, false, (p) => p.waitForSelector(".yarl__container").then(() => p.waitForTimeout(1200)))
await shot("5-cover-mosaic-phone", base + "/" + slug, 390, 844, false, async (p) => {
  await p.request.post(base + "/api/admin/login", { data: { email: "owner@iconic.events", password: "test-password-123" }, headers: { Origin: base } })
  await p.request.patch(base + "/api/admin/galleries/" + gid + "", { data: { settings: { layout: "mosaic", font: "display" } }, headers: { Origin: base } })
  await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(1500)
})
await shot("6-cover-split-light-desktop", base + "/" + slug, 1440, 900, false, async (p) => {
  await p.request.post(base + "/api/admin/login", { data: { email: "owner@iconic.events", password: "test-password-123" }, headers: { Origin: base } })
  await p.request.patch(base + "/api/admin/galleries/" + gid + "", { data: { settings: { layout: "split", theme: "light", font: "serif" } }, headers: { Origin: base } })
  await p.reload({ waitUntil: "networkidle" }); await p.waitForTimeout(1500)
})
// Admin design tab
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
await page.goto(base + "/admin"); await page.fill('input[type="email"]', "owner@iconic.events"); await page.fill('input[type="password"]', "test-password-123"); await page.click('button:has-text("Sign in")')
await page.waitForSelector("h1:has-text('galler')"); await page.waitForTimeout(500)
await page.screenshot({ path: out + "/7-admin-galleries.png" })
await page.goto(base + "/admin/galleries/21/design"); await page.waitForSelector("text=Live preview"); await page.waitForTimeout(1500)
await page.screenshot({ path: out + "/8-admin-design.png" })
await page.goto(base + "/admin/galleries/21"); await page.waitForSelector("text=drag to reorder"); await page.waitForTimeout(800)
await page.screenshot({ path: out + "/9-admin-photos.png" })
await page.request.patch(base + "/api/admin/galleries/" + gid + "", { data: { settings: { layout: "full-bleed", theme: "dark" } }, headers: { Origin: base } })
await browser.close()
console.log("done")
