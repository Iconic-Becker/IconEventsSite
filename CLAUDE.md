# Working agreement

## Show before you push

**Never push anything, to any branch, before showing Iconic a mockup or a
render and getting a yes.** This includes the working branch, not only
`main`. A push to a branch is still a push.

Build it locally, render it, show it, wait. The site is Iconic's shop
window and their design team's work; they see it before it moves.

What counts as showing: a published artifact, screenshots of the real
rendered page, or both. A description in chat does not count.

## Deploys

`main` is deployed automatically by Railway from
`Iconic-Becker/IconEventsSite`. Merging to `main` puts it live, so that
step in particular waits for an explicit yes.

Do not change a URL that is already live and indexed.

## The site

- Vite single page app, prerendered to static HTML by `prerender.js`
  after `vite build`. Always run `npm run build`, never `vite build`.
- Routing lives in `src/routes.jsx` and is shared by the browser and the
  prerender, so the two cannot disagree.
- Case study content and the event index: `src/case-studies.js`.
  House rules are documented in that file's header and enforced in code.
- Interviews to write up the remaining events:
  `docs/case-studies/INTERVIEW-PROTOCOL.md`.
- Running list of outstanding work: `docs/TODO.md`.

## Verify before you claim

Check in a real browser, not by reasoning about the code: the page
renders, hydration is clean, no console errors, no horizontal overflow at
390px. Say what was measured, and say plainly when something could not be
checked.

## House style

No em dashes in published copy.
