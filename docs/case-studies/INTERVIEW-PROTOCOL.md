# Case Study Interview Protocol

Instructions for a Claude Code session running case study interviews with
Iconic Becker. Read this file in full before the first question.

The job: interview the user one event at a time, write that event's page,
ship it, and move to the next. 37 events, 6 built, 31 to go.

---

## The prompt that starts a session

> Read `docs/case-studies/INTERVIEW-PROTOCOL.md` and follow it. Pick up
> where we left off and interview me about the next case study.

Nothing else is needed. Everything below is the protocol.

---

## 1. Work out where we are

State lives in the code and in this folder, not in memory.

1. Read `EVENT_INDEX` in `src/case-studies.js`. Each entry has `full: true`
   (page built and live) or `full: false` (not built).
2. Look in `docs/case-studies/interviews/` for `<slug>.md`.

That gives three states:

| Interview notes | `full` | Meaning |
|---|---|---|
| absent | false | Not started. Begin a new interview. |
| present | false | Interviewed, page not built. **Resume here first.** |
| either | true | Done. Skip. |

Always resume an unfinished event before starting a new one. Tell the user
in one line where you are: *"Next up is Fast Start Forum 2024, event 10 of
37. Nothing recorded for it yet."*

Work top to bottom through `EVENT_INDEX` unless the user names an event.

## 2. Run the interview

Six questions, asked one or two at a time, never all at once. The user
answers by voice note or typing. Answers will be messy, out of order, and
will jump between events. That is expected.

1. **What did they come to you with?** The problem in their words, before
   it was polished. And the part everyone leaves out: what happened if the
   night flopped? A launch window, a partner commitment, a year of revenue.
   Without the downside the result has nothing to measure against.
2. **What made this one hard?** The load-in window, a ballroom that could
   not take rigging, a budget ceiling, a host who wanted ninety minutes on
   stage. Anyone can build a good room without constraints.
3. **Walk me through three to five decisions, and why each one.** The why
   is the entire product. Not "we projection-mapped the back wall" but
   "we projection-mapped the back wall because the audience had heard him
   before and the room had to feel unfamiliar within ninety seconds."
4. **What nearly broke?** What went sideways, when, and what the team did
   about it live. This will feel wrong to answer. Ask anyway.
5. **Who is this build right for, and who is it wrong for?**
6. **Anything else about the night?** Details, moments, things that stuck.

Then the facts, which are quick:

- Seats sold · days of production on site · cost saved for the client
- Venue, city, month and year
- What Iconic delivered, as a scope list
- Client's exact name, job title and company
- Links: aftermovie, testimonial video, photo folder

### Rules for the interview itself

- **Never invent an answer.** If the user does not know a number, it stays
  out. A missing field renders as nothing; a guessed one is a liability.
- **Do not tidy their phrasing when capturing it.** Their unpolished words
  are usually the quotable part. Polish happens when you write the page,
  and the raw version stays in the notes file.
- **Ask follow-ups when an answer is abstract.** "It was a tight timeline"
  is not usable; "we had the room from 6am and doors were at 6pm" is.
- **One event at a time.** If the user drifts to another event, capture it
  in that event's notes file and steer back.

### Capture as you go

Write every answer to `docs/case-studies/interviews/<slug>.md` **as the
interview happens**, not at the end. If the session stops halfway, that file
is what lets the next one resume. Keep the user's own words verbatim under
each question, with a short `## Facts` block underneath.

Commit the notes file even when the page is not built yet.

## 3. Write the page

Add an entry to `CASE_STUDIES` in `src/case-studies.js`, copy the shape of
an existing one, then set `full: true` on that slug in `EVENT_INDEX`.

Fields, and which question feeds them:

| Field | Source |
|---|---|
| `headline` | Results first: "How <client> <result> at <event>" |
| `summary` | 50 to 100 words. Client, challenge, solution, result, in that order. This is the block answer engines lift. |
| `challenge` | Q1 and Q2, 2 to 4 sentences, plainly stated |
| `approach` | Q3, split into `pre` / `onsite` / `post` arrays. Rendered as one continuously numbered list. |
| `scope` | `[[label, description]]` for the Scope of Services block |
| `metrics` | `attendance`, `productionDays`, `costSaved`. Nulls render as nothing. |
| `details` | client, clientTitle, venue, city, region, year, dates |
| `media` | hero, challenge, band, resultLeft, resultRight, gallery, aftermovieUrl, testimonialUrl |
| `testimonial` | `{ quote, approved }`. See rule 4 below. |
| `citation` | One sentence naming client, event, venue, city and scope |
| `eventType` | `BusinessEvent` for a mastermind, summit or conference, which is most of them and the default. `SocialEvent` for a brand activation or party. Ask if it is not obvious. |

**Q4 and Q5 have no home in the current template.** There is no "what
nearly broke" section and no "who this is wrong for" block. Capture both in
the notes file regardless. Before rendering them, ask the user whether to
add the two sections; they are strong trust signals and rarely published,
but it is their call and it changes every page.

## 4. House rules, enforced by the code

These are not style preferences. `src/case-studies.js` and
`CaseStudyPage.jsx` implement them.

1. **Only three metrics are ever published**: attendance, days of
   production, cost saved for the client. Never client revenue, sponsorship
   dollars, revenue per seat, lead count or repeat booking.
2. **No budget figure or range is ever published.** There is no field.
3. **Nothing is estimated.** A null renders as nothing. Never fill a gap
   with a plausible number.
4. **A quote renders only when `approved: true`**, which requires the
   client's verbatim words *and* written permission. Review schema is
   emitted on the same condition. Unapproved or sample copy must never
   reach the page.
5. **No em dashes in published copy.**
6. **Never change a slug that is already live.** It is indexed.

If the user asks for something that breaks 1 or 2, say so once, and follow
their decision if they confirm. Both rules were deliberate, and there is an
open question about whether rule 1 should extend to the homepage, which
still publishes client revenue in three places.

## 5. Photography

Eight positions per page. The user supplies files; put them in
`public/images/gallery/` and reference them from `media`.

| # | Position | Ratio | Note |
|---|---|---|---|
| 01 | Hero, room at capacity | 16:9 | Title overlays the lower third, keep it clear of faces |
| 02 | Beside the challenge | 4:5 | |
| 03 | Full bleed after the approach | 21:9 | |
| 04 | Under the results, left | 4:3 | |
| 05 | Under the results, right | 4:3 | |
| 06 to 08 | Gallery | 4:3 | |

Every frame needs its own alt text: event, venue, city, and what is shown.
Never a generic label. Also ask for photographer credit and written usage
rights; both are required before publication.

Any position can be null. The page collapses cleanly around missing images,
so ship without them rather than waiting.

## 6. Ship it

```bash
npm run build      # vite build + SSR build + prerender.js
```

The build prerenders every full case study, the `/case-studies` grid, the
homepage and `/nextsteps`, and regenerates `sitemap.xml` and `404.html`.
A new event needs no change to `prerender.js`.

Before pushing, verify in a browser rather than assuming:

- The new page renders and hydrates with no console errors
- It appears in the grid at `/case-studies`, linked
- It is in `dist/sitemap.xml`
- No horizontal overflow at 390px wide

Then commit and push to `main`. Railway deploys `main` automatically, from
`Iconic-Becker/IconEventsSite`. Deploys take a couple of minutes.

Cache note: the user's browser holds old HTML aggressively. Tell them to
check in incognito, or they will report a page as broken when it is fine.

## 7. Open decisions

Raise these once if they are still unresolved; do not re-litigate them each
session.

- **Savings basis.** Every headline leads with a cost-saved figure. How it
  is calculated must be consistent across all events, or the numbers will
  not survive a prospect asking "saved against what?"
- **Client revenue site wide.** The homepage still publishes `$1.8M`,
  `$146K` and `$25K+ average ticket` while the case studies carry none.
- **Third party brands.** Internal copy says "007 Casino Royale"; the case
  study says "Casino Royale themed", because an indexed page courting AI
  citation carries trademark exposure internal copy does not.
- **Missing names.** Viral Ecom Adz has no client on file, DealCon 2025 is
  "Tom, surname needed", and Freedom Queen Live is undated so it cannot be
  told apart from the 2025 edition.
- **PimCon** is dated Oct 2026 and may not have happened yet. Confirm
  before writing it up.

## 8. Reference

| | |
|---|---|
| Repo | `Iconic-Becker/IconEventsSite`, branch `main` |
| Data | `src/case-studies.js`, holding `CASE_STUDIES` (built) and `EVENT_INDEX` (all 37) |
| Page template | `src/components/CaseStudyPage.jsx` |
| Grid | `src/components/CaseStudiesIndex.jsx` |
| Routing | `src/routes.jsx`, used by both the browser and the prerender |
| Prerender | `prerender.js` |
| Notes | `docs/case-studies/interviews/<slug>.md` |
| Intake workbook | `docs/case-studies/Case-Study-Collection.xlsx` |
| Worked example | `docs/case-studies/casino-royale.md` |
