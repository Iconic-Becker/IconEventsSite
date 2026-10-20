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
| 4 | **Casino Royale photos** | Position 01, hero of the room at capacity, 16:9. Position 05, a wide shot that reads 150 seats. Usage rights are confirmed for all photos; photographer credit is still to collect if it is wanted on the page. **Some frames on file are from other events**, and now show on `/gallery` labelled Casino Royale: `g34` is a Group Convert team photo, `g24` has a "Sean ...rien" stage screen, and `g32` is captioned "Ben Newman on stage" but shows guests at a casino table. `public/images/gallery/casino-royale/` holds 13 hand picked frames to choose replacements from. |
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

**Done on 1 October.** Measured on the built site, same method before and
after. Phone is a 390px viewport at 2x, desktop is 1440px.

| | before | after | |
|---|---|---|---|
| **Phone total** | 2,893 KB | **1,372 KB** | **-53%** |
| **Desktop total** | 2,916 KB | **1,892 KB** | **-35%** |
| Fonts | 621 KB | 89 KB | -86% |
| Images, phone | 1,770 KB | 752 KB | -58% |
| Images, desktop | 1,770 KB | 1,263 KB | -29% |

Two things went the other way and are worth knowing. The prerendered HTML
grew 157 KB to 182 KB, because the srcset attributes now live in the
markup; that is about 2.5 KB once gzipped, against 1,521 KB saved. The JS
grew 5 KB for the helper and its manifest.

| # | Step | Status |
|---|---|---|
| 22 | Subset the fonts | **done** |
| 23 | Responsive image sizes | **done** |
| 24 | Fetch less on load | **done** |
| 25 | Split the bundle | **not done, see below** |
| 26 | Confirm Railway serves gzip or Brotli | still open, needs the live site |

**22 / Fonts, done.** `fonts-src/` holds the originals and is not published.
`scripts/subset-fonts.mjs` writes the subsets into `public/fonts/`; the output
is committed so a deploy needs no Python. 1,054 KB to 162 KB across 11 files.

The charset is wider than what the site uses today: all of basic Latin,
Latin-1 and common typography, about 214 characters against the 145 actually
in use. That costs 44 KB and means an accent or a curly quote in new copy
cannot silently fall back to a system font. If copy ever needs something
outside it, widen the range in the script and re-run.

Verified: identical font family, size and text bounding boxes, and with
animation frozen the rendered page differs by 0.0098% of pixels, which is
antialiasing. Every character the site renders is present in every subset,
with one exception that predates this: the arrows in the three Helvetica
faces were never in the originals either, so those five glyphs fall back to
a system font exactly as before.

**23 / Responsive images, done.** `scripts/make-image-variants.mjs` writes
480w and 960w variants for the images fetched before first paint, listed in
`scripts/eager-images.json`, and a manifest at `src/image-variants.json`.
`src/lib/img.js` turns that into srcset; anything not in the manifest falls
through to a plain src, so it is safe to spread onto any image.

Scoped deliberately. Largest Contentful Paint is decided above the fold, so
variants for lazily loaded gallery photos would add tens of megabytes to the
repo and move the metric by nothing. 56 files, 1.5 MB.

Three things that srcset could not reach were fixed at source. The pattern
tiles are CSS backgrounds drawn between 300px and 640px wide and were up to
8000px: now 880w, 746 KB to 285 KB. The logo masters were 2400px for a mark
shown at 180px: now 1200w. The one gallery frame used as a CSS background
now points at its own 960w variant, so the same file serves the `<img>` too
and the browser fetches it once instead of twice.

**24 / Fetch less on load, done.** The hero wall is `hidden md:block`, but
Chromium fetches `display:none` images anyway, so a phone was pulling all 24
and showing none of them. They are lazy now: on a phone they never intersect
so they never load, and on desktop they are on screen so they load at once.
Watched for 14 seconds while the marquee rotated and no image in the
viewport was ever unpainted.

**25 / Splitting the bundle: measured, and not worth it.** The earlier
estimate of 30 to 40 KB gzipped was wrong. `case-studies.js` is 43 KB of
source, of which 15 KB is prose, so the real prize is about 12 KB gzipped
off a 77 KB chunk.

`routes.jsx` imports it to resolve a slug, which is what pulls it into the
main chunk. Getting it out means lazy loading the case study route, and
these pages are prerendered: a lazy route renders its Suspense fallback into
the static HTML instead of the prose, which is the whole AEO case for those
pages. Twelve kilobytes is not worth trading the prerendered content for,
and Total Blocking Time is green at 70ms, so the JS is not delaying
anything. Left alone on purpose.

**26 / Confirm Railway serves gzip or Brotli.** Not checkable from the
build container. If it is off, that is another 310 KB on the text assets
and it is a config toggle, not code.

No score is predicted. PageSpeed's number depends on their throttling model,
and the honest test is a fresh run against the live site once this is
deployed.

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
