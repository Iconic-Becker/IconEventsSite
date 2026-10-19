// Screenshot helper: node scripts/verify/shot.mjs <url> <out.png> [width] [height] [fullPage]
import { chromium } from "playwright"
const [url, out, w = "390", h = "844", full = "0"] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" })
const ctx = await browser.newContext({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1, isMobile: Number(w) < 700, hasTouch: Number(w) < 700 })
const page = await ctx.newPage()
const errors = []
page.on("console", (m) => m.type() === "error" && errors.push(m.text()))
page.on("pageerror", (e) => errors.push(String(e)))
await page.goto(url, { waitUntil: "networkidle" })
await page.waitForTimeout(800)
const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
await page.screenshot({ path: out, fullPage: full === "1" })
console.log(JSON.stringify({ url, w, h, overflow, errors }))
await browser.close()
