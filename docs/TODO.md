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

**Layout shift on the homepage.** It loads 175 images and **none of them
carry `width` or `height` attributes**. The browser cannot reserve space
before an image arrives, so content moves as they load. That is cumulative
layout shift, which Google measures directly as a Core Web Vital, and it is
worst on phones, which is where Google Business Profile traffic lands.
The fix is mechanical: read each file's real dimensions and set them.

**Images loading eagerly.** 102 of the 175 are lazy loaded, so **73 are
requested immediately**, including ones below the fold. Worth checking how
many are actually needed for first paint. This may cost more than the
missing dimensions do.

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
