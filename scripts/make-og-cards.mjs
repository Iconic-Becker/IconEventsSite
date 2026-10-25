/* Renders the social sharing cards for the home page and the case studies
 * index: the image WhatsApp, iMessage, Slack and LinkedIn show when a link is
 * shared. Case study cards (public/og/<slug>.jpg) are not made here.
 *
 * Iconic's own direction: the white wordmark on Tide Pool, the brand pattern
 * faint behind it. Messaging apps crop the 1200x630 card toward a square from
 * the centre, so the wordmark is sized to sit inside the middle 600px.
 *
 * Run by hand after changing a card; the output is committed, so a deploy
 * needs nothing from this.
 *
 *   node scripts/make-og-cards.mjs
 *
 * Needs Playwright with Chromium. It is not a project dependency, so it is
 * loaded with require, which also finds a globally installed copy.
 */
import { createRequire } from "node:module"
import { writeFileSync, mkdtempSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const { chromium } = createRequire(import.meta.url)("playwright")

const PUBLIC = resolve("public")
const file = (rel) => `file://${PUBLIC}${rel}`

const CARDS = [
  { out: "og/default.jpg", label: null },
  { out: "og/case-studies.jpg", label: "Case Studies" },
]

const page = (card) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "Helvetica"; src: url("${file("/fonts/Helvetica-Bold.woff2")}"); font-weight: 700; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #112E2E; overflow: hidden; position: relative; }
.pattern { position: absolute; inset: 0; opacity: 0.07;
  background-image: url("${file("/images/patterns/pattern-white.webp")}"); background-size: 440px auto; }
.vignette { position: absolute; inset: 0;
  background: radial-gradient(ellipse 46% 70% at 50% 50%, rgba(17,46,46,0.92) 0%, rgba(17,46,46,0.55) 60%, rgba(17,46,46,0) 100%); }
.content { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center; }
.logo { width: 560px; height: auto; display: block; }
.label { margin-top: 30px; font: 700 15px/1 "Helvetica"; letter-spacing: 0.32em; text-transform: uppercase; color: #B89968; }
</style></head><body>
<div class="pattern"></div><div class="vignette"></div>
<div class="content">
  <img class="logo" src="${file("/logos/IE_logo_white.png")}" alt="">
  ${card.label ? `<div class="label">${card.label}</div>` : ""}
</div>
</body></html>`

const dir = mkdtempSync(join(tmpdir(), "og-"))
const browser = await chromium.launch()
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } })
for (const card of CARDS) {
  const html = join(dir, "card.html")
  writeFileSync(html, page(card))
  await tab.goto(`file://${html}`, { waitUntil: "load" })
  await tab.evaluate(() => document.fonts.ready)
  await tab.screenshot({ path: join(PUBLIC, card.out), type: "jpeg", quality: 86 })
  console.log(`  wrote public/${card.out}`)
}
await browser.close()
