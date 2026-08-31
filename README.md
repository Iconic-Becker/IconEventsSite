# Iconic Events — Homepage (dual brand voice)

The Iconic Events agency homepage ("experience engineers"), built as **one page
that speaks in two brand voices**. A floating top-right toggle switches every
line of copy between **Iconic Events** (heritage, engraved) and **Genflow**
(creator-economy, conversion) — the layout and design stay the same.

## Stack

- **React 18** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- Self-hosted brand fonts; official logo assets; no runtime dependencies

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Source-of-truth files (priority order)

Three concerns, three sources. When they conflict, the concern's own file wins.

| Concern | Authoritative file |
|---|---|
| **Structure** — section order, layout, what content | `Iconic-Events_Homepage_Structure.md` |
| **Design** — color, type, logo, layout rules | `Iconic-Events_Brand-Reference.md` |
| **Voice** — copy register | `Iconic-Events_Brand-Voice.md` + `Genflow_Brand-Voice.md` |

Resolved conflicts: the structure file's "Bound Leather `#0C3010`" and "Gold"
defer to the Brand Reference → **Tide Pool `#112E2E`** and **Antique Brass
`#B89968`**. The pricing section is removed and eyebrows renumbered 01–09, per
the structure file.

## The dual-voice system

- All copy lives in [`src/content.js`](src/content.js) as `V("<Iconic>", "<Genflow>")`
  pairs — both voices sit **side by side** on every line.
- **Editing rule:** when you change any copy, change *both* sides of its `V()`
  pair, each true to its own voice guide. Never edit one voice alone.
- [`src/voice.jsx`](src/voice.jsx) holds the active voice; `t(pair)` resolves it.
  Plain strings (names, numbers) pass through unchanged.
- [`src/components/VoiceToggle.jsx`](src/components/VoiceToggle.jsx) is the
  floating switch; the active voice is filled and named.

## Case studies

Every event gets its own dedicated page at `/case-studies/<slug>` and a tile
under **02 · Selected Work** on the lander. Six are live: `casino-royale`,
`bad-after-dark`, `ceo-lawyer-summit`, `scaling-with-systems-live`,
`viral-ecom-adz`, `chase-hughes-london`.

All case-study content lives in [`src/case-studies.js`](src/case-studies.js) —
one object per event. [`CaseStudyPage.jsx`](src/components/CaseStudyPage.jsx) is
a template that renders whichever study the URL resolves to; an unknown slug
renders a not-found state rather than defaulting to another event.

### Adding a new event

1. **Add the study** — append an object to `CASE_STUDIES` in
   `src/case-studies.js`. Copy an existing entry's shape; each field is
   documented in the header comment. `slug` becomes the URL and should never
   change once it is live and indexed.
2. **List it on the lander** — add a tile to `WORK.archive` in
   `src/content.js` with the **same `slug`**. Lander tiles keep their `V()`
   dual-voice copy; case-study pages are Iconic voice only (matching how the
   page already behaved).
3. **Add the photography** — drop files in `public/images/gallery/` and
   reference them from `heroImg`, `result.img`, and `gallery`.

Routing, the "next room" strip on sibling pages, and the per-page `<title>`
pick the new event up automatically. `npm run dev` warns in the console if a
lander tile has no case study behind it, so a tile can never ship with a dead
link.

Studies with only partial detail on file carry `// TODO(copy):` markers where
verified facts are still needed — search for them before launch. Stats are
omitted rather than invented: an entry with an empty `stats` array simply
hides the figures band.

## Brand assets

Logo, fonts, color tokens, and layout rules are recorded in
[`docs/brand-assets.md`](docs/brand-assets.md).

- **Logo** — `public/logos/IE_logo_{white,black}.png` (trimmed web copies); masters in `docs/logos/`.
- **Type** — Cormorant Garamond (serif), Helvetica (sans), Causten Bold (reserved). Self-hosted from `public/fonts/`.
- **Color** — Onyx, Tide Pool (the only green), Bone (paper), Antique Brass (flourish only).
- **Layout** — sharp corners always, gold eyebrow ordinals, IP disclaimer in footer.

## Wiring the qualifier form

[`src/components/QualifierForm.jsx`](src/components/QualifierForm.jsx) captures
business stage, timing, and outcome. It currently simulates a submit — replace
the `TODO` block with your inbox/CRM call, keeping the 48-hour promise copy.

## Structure

```
docs/
├── brand-assets.md         # Logo, type, color, layout record
├── logos/                  # Master logo PNGs (do not overwrite)
└── images/                 # Master placeholder image
fonts/                      # Full archived brand font families
public/
├── fonts/                  # Self-hosted web fonts (@font-face)
├── logos/                  # Trimmed web logo copies
├── images/placeholder.png  # Portrait / case / video poster placeholder
└── favicon.svg
src/
├── App.jsx                 # Page composition — all 12 sections + nav/footer
├── content.js              # ← Edit copy here (both voices, side by side)
├── voice.jsx               # Voice context + t() resolver
├── useScrolled.js          # Nav solidify + sticky-bar trigger
├── index.css               # Fonts, brand tokens, sharp-corner reset
└── components/
    ├── Icon.jsx            # Restrained line marks
    ├── QualifierForm.jsx   # Stage / timing / outcome qualifier
    └── VoiceToggle.jsx     # Floating brand-voice switch
```
