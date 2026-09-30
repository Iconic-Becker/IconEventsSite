# Website to-do

Running list. Update it as things move; do not let it go stale.
Last updated: 2026-09-30, after the homepage resequence shipped.

---

## Waiting on Iconic

Nothing here can start without you.

| # | Item | Why it matters |
|---|---|---|
| 2 | **The five new pages** | About, FAQ, Recaps, and two more I cannot read from the screenshot. Tell me what each holds. Note "Recaps" may be the same thing as the case studies grid; worth deciding before both get built. |
| 3 | **Shelby Sapp testimonial** | Quote, name, role, image. The section on `/nextsteps` stays hidden until it is filled. Her event is Women and Wealth. |
| 4 | **Casino Royale photos** | Position 01, hero of the room at capacity, 16:9. Position 05, a wide shot that reads 150 seats. Plus photographer credit and written usage rights for all eight frames. |
| 5 | **Ben Newman quote** | Verbatim words, written permission, and his exact job title. The quote on file is sample copy with `approved: false`, so nothing renders and Review schema is withheld. |
| 6 | **Which video is which** | One link was sent as "a link for us" and placed as the testimonial; the other was named as the aftermovie. Confirm, or they swap. |
| 7 | **Casino Royale gaps** | Exact dates, verified venue address, weeks of planning, which vendors Iconic managed directly. |
| 9 | **PimCon** | Dated "Oct 2026?" and may not have happened. Confirm before it is written up. |
| 27 | **Two trusted-by logos are stand-ins** | Live now, but neither is the real artwork. **Closers.io** was supplied in its dark brand colour, `#041116`, within a few values of the section background; it is reversed to bone here, red half disc included, because the red went muddy at the row's opacity. **Women & Wealth** was not in the batch of five, so it is re-canvassed onto 1400x400 at 24% fill. Both files were sent more than once and never arrived, so try another route: commit them to the repo directly, or rename before sending. Keep new logos on the 1400x400 canvas and **do not trim them**. |

## GHL consolidation

Agreed in principle, to do later. Everything routes through GoHighLevel,
which Iconic already pays for, rather than adding tools alongside it.

| # | Item | Note |
|---|---|---|
| A | **Enquiry form posts to GHL** | Today it goes to Web3Forms, which emails `contact@iconic.events` and nothing more. No contact record, no pipeline entry, no automated follow-up, and the qualifier answers are not stored anywhere searchable. `sendEnquiry` already posts JSON to a configurable endpoint, so this is a small change once there is a GHL form or webhook URL. Web3Forms then comes out entirely. |
| B | **Booking calendar on `/nextsteps`** | Nobody can book a call on the site today. The calendar belongs after the qualifier, not before it, so only people who answered stage, timing and outcome ever see it. Needs the GHL calendar embed. |
| C | **Conversion measurement** | `enquiry_submitted` already fires. A booking happens inside the GHL iframe, so a `call_booked` event may not reach the parent page; GHL's own reporting may have to cover it. Confirm when wiring. |

## Decisions

Each one affects every case study, so settling them early avoids rework across 37 pages.

| # | Decision | Context |
|---|---|---|
| 10 | **How is the savings figure calculated?** | Every headline leads with a cost saved number. Casino Royale says $100,000. If that was a one-off estimate rather than a repeatable basis, the figures will not survive a prospect asking "saved against what?" Highest priority of the four. |
| 11 | **Does the no-client-revenue rule apply site wide?** | Case study pages publish only attendance, days of production and cost saved. The homepage still sells on `$1.8M`, `$146K` and `$25K+ average ticket`. They currently contradict each other. |
| 12 | **Do we name third party brands?** | Internal copy says "007 Casino Royale". The case study says "Casino Royale themed", because an indexed page courting AI citation carries trademark exposure internal copy does not. |
| 13 | **Add the two extra sections?** | Interview questions 4 and 5, what nearly broke and who the build is wrong for, have nowhere to render. Both are strong trust signals and rarely published. Adding them changes every page, so decide before the interviews start. |
| 14 | **Retire the `k-aido` repo** | Railway now deploys `Iconic-Becker/IconEventsSite`. The old repo held the GTM container and possibly other changes from the past month. Someone should diff it before it is forgotten. |

## Their team, or outside the code

| # | Item | Note |
|---|---|---|
| 15 | **`klevr.events` redirect** | DNS and host config, not code. **Leave the MX records alone**: that domain carries Iconic's email. Redirect the web traffic only. |
| 16 | **GBP booking URL** | `https://www.iconic.events/#contact`. The form is live and delivering, so this is unblocked. Status unconfirmed. |
| 17 | **GBP services and products sheet** | I can draft it from the existing services copy so the GBP entries match the site language. |

## Flagged for the SEO team

Findings from an audit on 30 September, passed over rather than actioned.
Measured in a real browser at 390px wide, on the current build.

**Layout shift: withdrawn, and it was my error.** An earlier note here said
the missing `width` and `height` attributes were causing cumulative layout
shift. PageSpeed measures **CLS of 0**. 152 of 158 images still carry no
dimensions, but they sit in fixed aspect ratio containers that already
reserve the space, so nothing moves. Do not spend time on this.

**Already fixed, do not redo.** Three items from the team's own list were
resolved once the deploy pipeline was unstuck on 28 September:

- Homepage title. It still read "The Iconic Table, An Invitation-Only
  Evening" while the description described event production. Now
  "Event Production in South Florida | Iconic Events".
- Missing canonical tags. All pages now carry a self-referencing canonical,
  generated per route.
- JS-only rendering. Pages are prerendered to static HTML. The homepage
  serves about 1,480 words before any JavaScript runs; a case study serves
  about 800.

**Clean at the time of the audit.** One `h1` per page, `lang` set, no
missing `alt` attributes, no unlabelled buttons, no console errors,
no horizontal overflow at 390px.

## Load times

PageSpeed Insights, 30 September: Performance **64**. Accessibility 93,
Best Practices 100, SEO 100.

The report splits cleanly. Total Blocking Time 70ms and CLS 0 are both
green, so JavaScript is not jamming the main thread and nothing is
shifting. First Contentful Paint **3.5s** and Largest Contentful Paint
**6.4s** are both red. The page is waiting on bytes before it can paint.

Measured on the built site at 390px: the homepage pulls **2,894 KB over 45
requests**. Fonts 621 KB, images 1,770 KB, JS 263 KB, HTML 157 KB, CSS
82 KB.

The number that decides the approach: **2,391 KB of that is fonts and
images**, formats that are already compressed, so gzip and Brotli cannot
touch them. The text assets already compress well (JS 264K to 76K, HTML
160K to 17K). Server compression will not rescue this. Only shipping
fewer bytes will.

Ranked by measured saving, not by guesswork.

| # | Step | Saving | Effort | Risk |
|---|---|---|---|---|
| 22 | **Subset the fonts** | **937 KB (89%)** | one build step | near zero |
| 23 | **Responsive image sizes** | **425 KB** on four files alone | moderate | low |
| 24 | **Fetch less on load** | several hundred KB | moderate | low, needs eyes |
| 25 | **Split the bundle** | 30 to 40 KB gzipped | moderate | low |

**22 / Subset the fonts.** Not subset at all: Cormorant carries about 975
glyphs per weight, Helvetica about 2,010. The site uses **145 characters**.
Subsetting was run and measured, not estimated: 1,054 KB to 118 KB across
11 files, every file down 84 to 94%. On the homepage that is 621 KB down to
roughly 70 KB. Rendering is identical, there is no design decision in it,
and `font-display: swap` and the preloads are already correct. Do this one
first and alone: it is the largest single saving, it is risk free, and it
gives a clean read on what the fonts were costing before anything visual
moves.

**23 / Responsive image sizes.** There is no `srcset` anywhere, so a phone
downloads desktop artwork. Every one of the 101 rendered images exceeds
twice the pixels it needs. `position-room.webp` is 1900x1259 shown at
356x445, 5.3x oversized, 263 KB, and eager. `IE_logo_white.png` is a
2400px PNG shown at 145px, 16.6x oversized; as a 300w WebP it is 3 KB
instead of 43 KB. Generating two or three widths for the four heaviest
files took them from 628 KB to 203 KB on a phone. Needs a build script
and `srcset` plus `sizes` on the components.

**24 / Fetch less on load.** 35 image requests fire immediately, 1,770 KB.
The hero wall and the montage are decorative and a phone shows few of
them. Audit what is genuinely above the fold and defer the rest. Defer the
wrong one and the hero pops in, so this wants a pair of eyes rather than a
rule.

**25 / Split the bundle.** Every case study's prose sits in the homepage
chunk: "parking garage", "Casino Royale" and "Broward County" are all in
the built JS. Someone who never leaves the homepage downloads all 37
events. Worth doing, but it is 30 to 40 KB gzipped against roughly 1 MB
from 22 and 23. Last.

**26 / Confirm Railway serves gzip or Brotli.** Not checkable from the
build container. If it is off, that is another 310 KB on the text assets
and it is a config toggle, not code.

No score is predicted here. PageSpeed's number depends on their throttling
model. Do 22 and 23, re-run the test, and compare the real before and
after.

## Ready to build

| # | Item | Note |
|---|---|---|
| 18 | **Case study interviews** | 31 of 37 events still to write up. Protocol is ready: `docs/case-studies/INTERVIEW-PROTOCOL.md`. Start whenever. |
| 21 | **Event formats are unset** | You said every event is a mastermind, summit, conference, or brand activation. Only Bad After Dark has `format` filled in, so every other card falls back to the client name instead of naming the kind of event. Six built studies need it now; the rest come with their interviews. |

---

## Recently shipped

For context on what is already done, so it does not get re-raised.

- Homepage resequenced so the page answers who we are, who it is for, what we do, how, proof, then work. Section numbering removed. Calls to action added through the middle: the longest stretch with no CTA went from 17.6 phone screens to 5.3, and the page from 22.0 screens to 16.0.
- Three homepage sections taken out. Capability, and the In the room and From the host pair that put three showcase sections back to back. The Uncontested Room is **hidden, not deleted**: it sits behind `SHOW_NICHE` in `App.jsx`, component and copy intact, so it is a one-word change to bring back.
- Navigation rebuilt to match the new order: Services, Method, Results, Work, Gallery, Contact. It had been pointing at the old sequence and carried a dead `#testimonials` link.
- Navigation shared across pages as `SiteHeader`. On the homepage the links are in-page anchors; elsewhere they return to the homepage sections, except Contact on a case study page, which carries its own form.
- Mobile nav fixed. Six labels measured 513px against a 390px screen, so Contact sat off the right edge where nobody swipes. Six even columns now, all visible down to 320px, tap targets still 44px.
- `Position` was carrying `id="work"`, a copy-paste leftover, so every "see the work" link landed on it instead of Selected Work. Now `id="position"`.
- Hero trimmed. The audience line and est. mark above the headline are out; the copy stays in `content.js` unrendered. New subhead names the work and says "live in person events".
- Dead success-state code and the unused 630KB placeholder image removed.

- Deploy pipeline fixed. Railway was watching `k-aido/IconEventsSite`; it had been serving a build from a month earlier, so neither the team's prerender work nor anything since had gone live.
- Six case study pages, prerendered, each with its own title, description and canonical.
- `/case-studies` grid listing all 37 events. Six link through; the rest are listed and marked in progress, so no thin pages are published.
- Enquiry form wired to Web3Forms, delivering to `contact@iconic.events`. It fails visibly rather than silently, including when the provider reports a soft failure inside a 200.
- `/nextsteps` confirmation page, noindex.
- Contact email corrected and moved to a role account. The footer shows a link to the form rather than a scrapeable address.
- Deep links to `#contact` now land on the form. Previously a visitor arrived 16,000px above it.
- Homepage title fixed. It still said "The Iconic Table" while the description described event production.
- Favicon set from the gold sigil, transparent.
- Fonts converted to woff2: 4.91MB down to 1.03MB, 79% smaller, no visual change.
- Open Graph and Twitter card tags with a per page 1200x630 share image. The site previously had none, so every shared link rendered as a bare URL.
- Google Tag Manager container GTM-PS4743JW, plus the second Search Console verification tag. The site had no analytics at all since the container was lost in the repository switch.
- `enquiry_submitted` and `spa_page_view` pushed to dataLayer, so the confirmation page and the enquiry conversion are measurable in a single page app. Kevin needs to create triggers on those two event names.
- Client names resolved for all 37 events. The undated Freedom Queen Live is the 2024 edition and is now named and slugged as such.
