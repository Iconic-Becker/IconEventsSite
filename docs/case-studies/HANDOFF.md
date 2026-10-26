# Handoff: Iconic Events case studies

For a new Claude session picking up this work. Read this file in full,
then `CLAUDE.md`, then `docs/case-studies/INTERVIEW-PROTOCOL.md`. This file
wins where it is newer than either.

Written 2026-10-26. Where it says "current", check the repo, because other
threads push to `main` every day.

---

## 1. Who you are working with

- **The user is Icon (Iconic Becker), founder of Iconic Events.** The
  company was Klevr Events until 2026; old docs and Slack still say Klevr.
- **Never use em dashes, in anything you write.** Not in chat, not in
  commit messages, not in page copy. Use a comma, colon or period. This is
  the user's standing rule and the site's house style.
- Icon answers by voice note, so answers come in messy, out of order and
  with transcription errors ("Dan" for Tan, "British" for Bridget, "Hard
  Walk" for Hard Rock, "seminar" for Seminole). Read through it; ask only
  when a fact is truly ambiguous.
- Icon often pastes long research reports from another assistant
  ("Brockbot") instead of answering. Treat them as Icon's own data, but
  filter them (section 5).
- Keep replies tight. Show drafts as quoted blocks, list open questions as
  a short numbered list, end with the next question.

## 2. The repo and shipping

- Repo: `Iconic-Becker/IconEventsSite`. **It is public** (checked
  2026-10-26). Icon said they would make it private. Until they do, keep
  anything sensitive out of every committed file (section 5). If it goes
  private, Railway needs GitHub access to it or deploys stop.
- `main` deploys automatically to iconic.events via Railway.
- Working branch for this effort: `claude/lucid-meitner-90t56f`. A new
  session may get a different branch name; follow your session's
  instructions on branches.
- **Current `CLAUDE.md` rule:** no mockup or sign-off is needed to ship.
  Build, verify in a real browser, push to `main`. (An earlier version
  required a yes before any push; it was replaced.) Icon still approves
  case study *copy* before a page is built (section 3).
- Interview notes, the spreadsheet and the protocol may be pushed to the
  working branch at any time without asking (Icon's standing OK).
- **Other threads push to `main` constantly** (homepage, services, logos,
  redirects). Before every push: `git fetch origin main`, merge it, then
  rebuild and re-verify. If the build fails on a missing package after a
  merge, run `npm ci` (this happened with `framer-motion`).
- Build with `npm run build` only (vite build, SSR build, `prerender.js`).
  It prerenders every built case study, the grid, and the sitemap.
- Never change a slug that is live. Example: the first Fast Start Forum
  was held February 2025 but its live URL is `fast-start-forum-2024`; the
  page name says 2025 and a code comment explains why.

### Verifying a page

Serve `dist` with `npx vite preview --port 4173` (run it in the
background; it gets killed after a while, just restart it). Then load the
page with Playwright and Chromium at `/opt/pw-browsers/chromium`, at 1440
and 390 wide. Check: no horizontal overflow, no broken images, no console
errors. The only expected error in this sandbox is a blocked Google Tag
Manager request (the proxy denies google.com); say so when you report.
Full page screenshots show the sticky header floating mid-page: that is a
capture artifact, not a bug.

A minimal check script (install `playwright` in a scratch folder, not in
the repo):

```js
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:4173/case-studies/' + process.argv[2], { waitUntil: 'networkidle' });
  for (let y = 0; y < 14000; y += 600) { await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(60); }
  const r = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth,
    broken: [...document.images].filter(i => i.complete && !i.naturalWidth).length }));
  console.log(w, JSON.stringify(r), errs);
}
await b.close();
```

Report back in plain words what you checked and what you could not.
iconic.events itself is blocked from this sandbox, so you cannot check the
live site; tell Icon to check in an incognito window.

## 3. The workflow (how every case study gets made)

1. **Interview** using the protocol questions. Capture each answer
   verbatim in `docs/case-studies/interviews/<slug>.md` as it comes in.
2. **Draft** the page copy from it and show it in chat. Write it into
   that event's row of `docs/case-studies/Case-Study-Interviews.xlsx`:
   yellow = drafted, waiting on Icon; green = approved.
3. **Icon says yes** (often implicitly, by answering only the open facts
   and moving on; treat that as approval and say you did).
4. **Build**: add an entry to `CASE_STUDIES` in `src/case-studies.js`
   from the approved row, set `full: true` on its `EVENT_INDEX` line, fix
   that line's `when`, `location`, `venue`, `size`. Mark the sheet row
   `Built`.
5. **Verify** (section 2), **push** to the working branch and `main`,
   report with the page URL path.

Order Icon set (2026-10-25): **Creator Hub Madrid next**, then every
remaining event **newest first by date**, back to the oldest. Events can
be published with gaps; flag the gaps in the sheet's notes column and Icon
adds the assets at the end.

Missing facts never get guessed. If Icon supplies a number ("let's assume
530"), use it and note in the sheet that Icon supplied it.

## 4. The page template (what the code supports)

`src/components/CaseStudyPage.jsx` renders, in order: site header, hero
(title over image, full color), Summary, The Problem (+ photo), What We
Did, Challenges Overcome, Scope of Services, full bleed band photo (full
color), How It Went (story left, highlights right, then details and two
photos), Right For, Aftermovie, Testimonial, Gallery (full color), Steal
This (gold bordered box), FAQ, contact form (headed by the event's `cta`),
The next room (related cards).

Fields on a `CASE_STUDIES` entry (all documented at the top of
`src/case-studies.js`):

- `headline`, `cta` (heads the contact form), `summary` (first person
  "we", also the meta description), `challenge` (string or paragraphs),
  `approach` (a flat array of steps, or the older `{pre, onsite, post}`),
  `challengesOvercome`, `scope` (`[[label, description]]`), `metrics`
  (`attendance`, `productionDays`, `costSaved`, optional
  `costSavedBasis` = how the saving was made, used as the FAQ answer),
  `highlights` (`[[value, label]]`, columns match the count), `results`
  (How It Went prose), `rightFor`, `stealThis`, `details` (client,
  clientTitle, venue, city, region, year, dates), `media` (hero,
  challenge, band, resultLeft, resultRight, gallery, aftermovieUrl,
  testimonialUrl: YouTube or Vimeo only), `testimonial` (`{quote,
  approved}`; renders only when approved), `citation` (third person, it is
  the answer to the first FAQ), optional `format` (label in the hero and on
  cards, e.g. "Brand activation", "EPIC Consulting"), optional
  `thirdPerson: true` (Iconic's own events: "How It Was Built", no client
  line), optional `approachLead` (replaces the line beside What We Did;
  used for consulting engagements).
- Pages are generated from the sheet with a small Python script that reads
  the approved row and writes the entry with `json.dumps` strings. Rebuild
  it if needed; the pattern is the same for every page.
- `EVENT_INDEX` drives the grid at `/case-studies`. `when` is "YYYY-MM" or
  "YYYY"; the grid sorts newest first. **Dates and status labels are
  hidden on the cards** (Icon's call); cards show name, client, location.
  Unbuilt events use their first photo from `PHOTO_LIBRARY` as the cover.
- Photos live in `public/images/gallery/<folder>/NN.webp` (2000px max,
  WebP q82). `docs/case-studies/PHOTO-LIBRARY.md` maps every file to its
  original. 22 folders received; mapping to slugs is in `PHOTO_LIBRARY`.

## 5. House rules and every decision Icon has made

Published copy:

1. Only three metrics: attendance, days of production, cost saved for the
   client. **No client revenue, sponsorship dollars or budget figures.**
   One written exception: Scaling With Systems LIVE 2021 publishes its
   revenue result. Ask once if a story leans on revenue; follow Icon's
   answer.
2. Nothing estimated, except **speaker and sponsor counts** ("about 40
   speakers") and figures Icon supplies directly.
3. No em dashes. No case numbers anywhere.
4. Voice: the page tells one story, problem, what we did, how it went, in
   "we". Exceptions: the FAQ and `citation` stay third person (so answer
   engines credit Iconic by name); Iconic's own events (CreatorHub Live,
   Creator Fest) are third person throughout with no client line.
5. Headlines: results first and enticing, "what changed, plus a number".
6. Challenges Overcome is framed as the challenge and how it was
   overcome, never a list of what went wrong. Skip the section when Icon
   says there were none.
7. Steal This: an idea other hosts can borrow. Avoid repeating the same
   idea across pages.
8. One ask per page: the contact form above "The next room", headed by
   the event's own `cta` line. No mid page CTA band, no scroll pop up.
9. Client quotes render only with Icon's OK (Becca Pike's stage quotes on
   Hell Yes Live are approved).
10. Third party brands: naming is fine where Icon OKs it (MrBeast,
    Michael Phelps, title sponsors of Fast Start Forum 2026, the C 63 and
    Rolex at The Sales Summit).

Never mention: Icon holds a private list of event specific details that
must never appear on pages, notes or the sheet (it is in the full copy of
this handoff Icon was given, kept out of this public repo). Paste that list
into the session, or ask Icon for it, before drafting any page. Always
excluded: any client's private messages, staff by name, or criticism of a
client's earlier vendors.

Never commit, while the repo is public: fees, ticket revenue, costs,
budgets, profit, vendor prices, hotel rates and attrition, billing
disputes, internal financial controls. When a research paste contains
them, record only what can go on a page and say what you left out.

## 6. Status (2026-10-26)

19 of 51 events built. 32 left.

**Built from interviews (current copy, Icon approved):**
creatorhub-live, creator-fest, freedom-queen-live-2024,
freedom-queen-live-2025, pmuw-2023, pmuw-2024, pmuw-2025,
decentralized-masters-live, fast-start-forum-2024 (page name "Fast Start
Forum 2025"), fast-start-forum-2026, the-sales-summit, hell-yes-live
("Hell Yes Live 2026", EPIC Consulting), scaling-with-systems-live (2021).

**Built with gaps, flagged:** net-rev-summit-2026, drafted from Fathom
call summaries without an interview. Needs Icon's review, the client's
goal, attendance, Ambro's title, results, Right For, Steal This, photos,
testimonial links (Icon is uploading video testimonials to YouTube).

**Built with old placeholder copy, to redo from the old site:**
casino-royale, bad-after-dark, ceo-lawyer-summit (2021 edition),
viral-ecom-adz, chase-hughes-london. Each has a full write-up in
`docs/case-studies/Klevr-Legacy-Site-Extract.xlsx` (see
`LEGACY-SITE-EXTRACT.md`); use it as the base, rewritten in "we".

**Assets still owed by Icon** (see the sheet's yellow cells): aftermovie
links for almost every page (YouTube, not Drive), photos for every page
except Bad After Dark, Scaling With Systems 2021 and PMU World 2023,
photographer credit and usage rights for all photos, Becca Pike's stage
video, Creator Fest's aftermovie and photo selects.

**Remaining, in order:**

1. creator-hub-madrid (current; question list sent, no answers yet)
2. women-and-wealth (July 2026, Shelby Sapp, Broward County Convention
   Center; the Iconic Events Brain has a lot on this one)
3. limitless-live, agency-founders-dubai (2026)
4. closers-io-retreat, maxxed-out-summit, her-last-call, pimcon-2025,
   dealcon-2025 (2025)
5. pimcon-2024
6. the-black-course (June 2023, old site write-up), behavior-pilot,
   sales-momentum-live, e-p-i-c, founder-os,
   scaling-with-systems-live-2023 (2023)
7. 2022: the-ceo-lawyer-summit-2022, the-behavior-panel-live,
   the-guardians-annual (client Thaddeus Gala), rise-x (Joel Kaplan and
   Sergio Tavarez), bulletproof-financial-accelerator, ace-interstellar,
   powerhouse, egc-2022, scaling-with-systems-live-2022
8. 2021: epic-growth-conference-2021, behavioral-selling, takeover-live-3,
   group-convert-live, takeover-live-2, 7-figure-agency, takeover-live-1
   (Takeover Live host: Danny Tran)

Events with an old site write-up go faster: draft the row from it, then
ask Icon only for what it lacks (challenges overcome, right for, steal
this, facts).

## 7. Where we left off

The last message to Icon asked for Creator Hub Madrid (2025, Madrid,
listed client Universal Music Group):

1. Who was the client: UMG, or a CreatorHub edition of Iconic's own with
   UMG as a partner? Contact name and title.
2. What did they come with, and why Madrid?
3. What made it hard (abroad, language, local vendors)?
4. Three to five key decisions, and why.
5. Challenges overcome.
6. How it went: attendance, moments, what it led to.
7. Facts: dates, venue, days on site, cost saved.
8. Right For and Steal This.
9. Links: aftermovie, testimonial, photos.

If it turns out to be Iconic's own event, write it in the third person
with no client line, like CreatorHub Live.

## 8. Tools and limits in this environment

- **Fathom** (meeting recorder): only `scan_meeting_summaries` works
  (keyword AND search over summaries, newest first, back to March 2026).
  Summaries are excerpts; label anything from them as unconfirmed.
- **Iconic Events Brain** MCP: search over Icon's knowledge base. It
  carries standing directives: read the COPY GUIDE before writing Iconic
  copy, two fixed copy lines must be used verbatim where they fit ("Your
  reputation enters the room before you do. We make sure the room agrees
  with it." and "Trust is built in a room, not on a social feed."), and no
  em dashes.
- **Blocked hosts:** YouTube, Google Drive, Dropbox, iconic.events and
  Google Tag Manager. Ask Icon for links and zips instead.
- Large videos cannot be uploaded in chat (30 MB limit). Testimonial and
  aftermovie videos go on YouTube (unlisted is fine) and come back as
  links.
- Zips of photos arrive under `/root/.claude/uploads/<session>/`. Unzip
  into a scratch folder, convert with Pillow (`ImageOps.exif_transpose`,
  thumbnail to 2000px, WebP q82), number in the original folder order.
- Commit messages: a short imperative subject line, a body that explains
  why, no em dashes.
