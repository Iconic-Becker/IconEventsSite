# Working agreement

## Deploys

`main` is deployed automatically by Railway from
`Iconic-Becker/IconEventsSite`. Merging to `main` puts it live. No mockup
or sign-off is needed first: build it, verify it (below), and ship.

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
