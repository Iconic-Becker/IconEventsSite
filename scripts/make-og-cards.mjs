/* Renders the social sharing cards for the home page and the case studies
 * index: the image WhatsApp, iMessage, Slack and LinkedIn show when a link is
 * shared, plus a card for each case study listed in CASE_CARDS below.
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

/* Case study cards: a photograph from that case study's own page with the
   client in it (Iconic's rule), the event name and the client set in the
   middle so a square crop keeps both the face and the words. `pos` is the
   CSS background-position that keeps the client in frame. */
const CASE_CARDS = [
  {
    out: "og/bad-after-dark.jpg",
    img: "/images/gallery/bad-after-dark/01.webp",
    pos: "50% 22%",
    eyebrow: "Iconic Events · Eddie Maalouf",
    title: "Bad After Dark.",
  },
  {
    out: "og/scaling-with-systems-live.jpg",
    img: "/images/gallery/scaling-with-systems-live-2021/09.webp",
    pos: "50% 35%",
    eyebrow: "Iconic Events · Ravi Abuvala",
    title: "Scaling With Systems LIVE.",
  },
]

const casePage = (card) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face { font-family: "Helvetica"; src: url("${file("/fonts/Helvetica-Bold.woff2")}"); font-weight: 700; }
@font-face { font-family: "Cormorant Garamond"; src: url("${file("/fonts/CormorantGaramond-SemiBold.woff2")}"); font-weight: 600; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #0E1312; overflow: hidden; position: relative; }
.photo { position: absolute; inset: 0; background: url("${file(card.img)}") ${card.pos} / cover no-repeat; filter: brightness(0.8); }
.shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,19,18,0.95) 0%, rgba(14,19,18,0.55) 38%, rgba(14,19,18,0.05) 70%); }
.content { position: absolute; left: 50%; bottom: 56px; transform: translateX(-50%); width: 620px; text-align: center; }
.eyebrow { font: 700 15px/1 "Helvetica"; letter-spacing: 0.24em; text-transform: uppercase; color: #B89968; }
h1 { margin-top: 16px; font: 600 64px/1.02 "Cormorant Garamond"; color: #F4F0E8; }
.rule { width: 72px; height: 2px; background: #B89968; margin: 22px auto 0; }
</style></head><body>
<div class="photo"></div><div class="shade"></div>
<div class="content"><div class="eyebrow">${card.eyebrow}</div><h1>${card.title}</h1><div class="rule"></div></div>
</body></html>`

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
// ONLY=case renders just the case study cards, leaving the others as they are.
const jobs = [
  ...(process.env.ONLY === "case" ? [] : CARDS.map((card) => [card, page(card)])),
  ...CASE_CARDS.map((card) => [card, casePage(card)]),
]
for (const [card, markup] of jobs) {
  const html = join(dir, "card.html")
  writeFileSync(html, markup)
  await tab.goto(`file://${html}`, { waitUntil: "load" })
  await tab.evaluate(() => document.fonts.ready)
  await tab.screenshot({ path: join(PUBLIC, card.out), type: "jpeg", quality: 86 })
  console.log(`  wrote public/${card.out}`)
}
await browser.close()
