# Website to-do

Running list. Update it as things move; do not let it go stale.
Last updated: 2026-09-30.

---

## Waiting on Iconic

Nothing here can start without you.

| # | Item | Why it matters |
|---|---|---|
| 1 | **GTM container ID** | The site has no analytics at all. The container lived in the old `k-aido` repo and was lost when Railway repointed. GBP traffic is arriving unmeasured. Five minute job once you send the ID. |
| 2 | **The five new pages** | About, FAQ, Recaps, and two more I cannot read from the screenshot. Tell me what each holds. Note "Recaps" may be the same thing as the case studies grid; worth deciding before both get built. |
| 3 | **Shelby Sapp testimonial** | Quote, name, role, image. The section on `/nextsteps` stays hidden until it is filled. Her event is Women and Wealth. |
| 4 | **Casino Royale photos** | Position 01, hero of the room at capacity, 16:9. Position 05, a wide shot that reads 150 seats. Plus photographer credit and written usage rights for all eight frames. |
| 5 | **Ben Newman quote** | Verbatim words, written permission, and his exact job title. The quote on file is sample copy with `approved: false`, so nothing renders and Review schema is withheld. |
| 6 | **Which video is which** | One link was sent as "a link for us" and placed as the testimonial; the other was named as the aftermovie. Confirm, or they swap. |
| 7 | **Casino Royale gaps** | Exact dates, verified venue address, weeks of planning, which vendors Iconic managed directly. |
| 8 | **Three missing client names** | Viral Ecom Adz has no client on file. DealCon 2025 is "Tom, surname needed". Freedom Queen Live is undated, so it cannot be told apart from the 2025 edition. |
| 9 | **PimCon** | Dated "Oct 2026?" and may not have happened. Confirm before it is written up. |

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

## Ready to build

| # | Item | Note |
|---|---|---|
| 18 | **Case study interviews** | 31 of 37 events still to write up. Protocol is ready: `docs/case-studies/INTERVIEW-PROTOCOL.md`. Start whenever. |
| 19 | **Remove dead success-state code** | The `Done` component and `successTitle` / `successBody` in `content.js` are unreachable since the form goes to `/nextsteps`. Harmless, but it will confuse whoever edits that copy next. |
| 20 | **Remove the unused placeholder image** | `public/images/placeholder.png` is 630KB, imported in `App.jsx`, and never rendered. |

---

## Recently shipped

For context on what is already done, so it does not get re-raised.

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
