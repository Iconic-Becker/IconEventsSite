/* Renders the social sharing cards for the home page and the case studies
 * index: the image WhatsApp, iMessage, Slack and LinkedIn show when a link is
 * shared. Case study cards (public/og/<slug>.jpg) are not made here.
 *
 * Messaging apps crop the 1200x630 card toward a square from the centre, so
 * everything that matters sits in the middle 640px: the wordmark, the line,
 * and nothing at the edges that a crop would cut in half. Behind it, strips
 * of photography from the written case studies, the same pool as the hero.
 *
 * Run by hand after changing a line or the photo pool; the output is
 * committed, so a deploy needs nothing from this.
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
import { heroFrames } from "../src/case-studies.js"

const { chromium } = createRequire(import.meta.url)("playwright")

const PUBLIC = resolve("public")
const file = (rel) => `file://${PUBLIC}${rel}`

// The home card carries the copy guide's fixed top-of-funnel line, verbatim.
const CARDS = [
  {
    out: "og/default.jpg",
    eyebrow: null,
    line: "Your reputation enters the room before you do.",
    sub: "We make sure the room agrees with it.",
    photos: heroFrames(12).slice(0, 6),
  },
  {
    out: "og/case-studies.jpg",
    eyebrow: "Case Studies",
    line: "Learn from the events we’ve engineered.",
    sub: null,
    photos: heroFrames(12).slice(6, 12),
  },
]

const page = (card) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "Cormorant Garamond"; src: url("${file("/fonts/CormorantGaramond-SemiBold.woff2")}"); font-weight: 600; }
@font-face { font-family: "Cormorant Garamond"; src: url("${file("/fonts/CormorantGaramond-Italic.woff2")}"); font-style: italic; }
@font-face { font-family: "Helvetica"; src: url("${file("/fonts/Helvetica-Bold.woff2")}"); font-weight: 700; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0E1312; overflow: hidden; position: relative; }
.strips { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; }
.strips div { background-size: cover; background-position: center; filter: grayscale(1) contrast(1.05) brightness(0.55); }
.shade { position: absolute; inset: 0;
  background: radial-gradient(ellipse 38% 62% at 50% 50%, rgba(14,19,18,0.94) 0%, rgba(14,19,18,0.86) 55%, rgba(14,19,18,0.55) 100%); }
.glow { position: absolute; left: 50%; top: 0; width: 520px; height: 300px; transform: translateX(-50%);
  background: radial-gradient(ellipse 50% 60% at 50% 0%, rgba(184,153,104,0.28), transparent 70%); }
.content { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 620px; text-align: center; }
.logo { height: 74px; width: auto; }
.rule { width: 72px; height: 2px; background: #B89968; margin: 26px auto 24px; }
.eyebrow { font: 700 15px/1 "Helvetica"; letter-spacing: 0.28em; text-transform: uppercase; color: #B89968; margin-bottom: 16px; }
h1 { font: 600 50px/1.04 "Cormorant Garamond"; color: #F4F0E8; letter-spacing: -0.005em; }
.sub { margin-top: 16px; font: italic 400 28px/1.2 "Cormorant Garamond"; color: #B89968; }
</style></head><body>
<div class="strips">${card.photos.map((f) => `<div style="background-image:url('${file(f.thumbs[1][0])}')"></div>`).join("")}</div>
<div class="shade"></div><div class="glow"></div>
<div class="content">
  <img class="logo" src="${file("/logos/IE_logo_white.png")}" alt="">
  <div class="rule"></div>
  ${card.eyebrow ? `<div class="eyebrow">${card.eyebrow}</div>` : ""}
  <h1>${card.line}</h1>
  ${card.sub ? `<div class="sub">${card.sub}</div>` : ""}
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
