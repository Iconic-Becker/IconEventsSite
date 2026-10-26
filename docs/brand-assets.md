# Iconic Events — Brand Assets (Sales Page)

Working record of the logo and type assets used to build this page, and the
rules that govern them. Distilled from *Brand Guidelines, Edition 02*.

---

## 1. Logo

A serif wordmark — **ICONIC · [IE sigil] · EVENTS**, "EST. 2017" beneath. The
IE sigil sits at centre as part of the lockup.

### Files

**Wordmark** (ICONIC · IE · EVENTS lockup) — for identification:

| File | Ink | Use on |
|---|---|---|
| `docs/logos/IE_logo_BLACK.png` | Onyx/black | Master — light surfaces |
| `docs/logos/IE_logo_WHITE.png` | White | Master — dark surfaces |
| `public/logos/IE_logo_black.png` | Onyx/black | Web copy — trimmed, 2400px wide |
| `public/logos/IE_logo_white.png` | White | Web copy — trimmed, 2400px wide |

**Sigil** (vertical interlocked IE monogram) — for *details* where the brand is
already established (seals, ordinals, small flourishes). Never paired with the
wordmark in one composition.

| File | Ink | Use on |
|---|---|---|
| `docs/logos/IE_Sigil_Vectors_BLACK.png` | Onyx/black | Master — light surfaces |
| `docs/logos/IE_Sigil_Vectors_WHITE.png` | White | Master — dark surfaces |
| `public/logos/IE_sigil_black.png` | Onyx/black | Web copy — trimmed, 194×640 |
| `public/logos/IE_sigil_white.png` | White | Web copy — trimmed, 194×640 |

The `public/` copies are the originals with transparent padding trimmed and
width capped for delivery. The `docs/logos/` files are the untouched masters —
never overwrite them.

### Placement on the page

| Location | Surface | Asset |
|---|---|---|
| Header banner | Tide Pool | white |
| Hero | Onyx | white (large) |
| Invitation band | Tide Pool | white |
| Footer | Onyx | white |

Rendered via the `Logo` component in [`src/App.jsx`](../src/App.jsx).

### Rules

- **Black on light surfaces. White on Onyx, Tide Pool, Antique Brass, or photography.**
- Never pair the wordmark with a separate sigil in the same composition.
- Never distort, rotate, add shadow/outline, recolor off-system, or place on a gradient.
- Minimum screen size: 120 px wide (wordmark).

---

## 2. Typography (self-hosted)

Brand fonts live in `public/fonts/` and are declared with `@font-face` in
[`src/index.css`](../src/index.css). Full weight sets are archived in the
project-root `fonts/` folder.

| Typeface | Role | Weights loaded |
|---|---|---|
| **Cormorant Garamond** | Display serif — titles, headlines, pull quotes | 400/500/600/700 + italics |
| **Helvetica** | Body sans — section headers, subheaders, body | 400, 400 italic, 700 |
| **Causten Bold** | Reserved — all-caps poster moments only | 700 (hero edition line) |

Tailwind exposes these as `font-serif`, `font-sans`, and `font-display`
(Causten). Causten is used sparingly — the hero's edition line — and never for
body copy, per the guideline.

---

## 3. Color

| Name | Hex | Token | Use |
|---|---|---|---|
| Onyx | `#0E1312` | `onyx` | Dark editorial surface, body text |
| Tide Pool | `#112E2E` | `tidepool` | The only green. Headers, accents, CTA band |
| Antique Brass | `#B89968` | `brass` | Flourishes only — ordinals, hairlines, sigil. Never a body fill |
| Bone | `#F4F0E8` | `bone` | Warm paper — the page background |

One accent per view: Tide Pool leads on Bone; Brass is the single deliberate flourish.

---

## 4. Layout

Sharp corners always (Tailwind radii are zeroed in `index.css`). Section headers
carry a 4pt Tide Pool rule and a gold eyebrow ordinal (`01 · Position` …). The
footer carries the Iconic Events IP disclaimer. Full-bleed Tide Pool sections
(Services, Niche) break the onyx, one disciplined brass accent per view.

---

## 5. Placeholder image

`public/images/placeholder.png` stands in for portrait-carousel tiles, the
featured-case image, and video-testimonial posters (rendered grayscale/duotone).
Master in `docs/images/placeholdersquare.png`. Swap for real duotone assets
before publishing.

---

## 6. Atmosphere photography (montages)

Source masters live in the project-root `imagesfolder/` (35 high-res event
shots). Web-optimised WebP copies used on the page are in
`public/images/gallery/` (`g<n>.webp`), keyed to the source numbers.

Rules of use:

- **Backgrounds and montages only** — never labelled as a specific client or
  case study (that's what the neutral placeholder is for).
- All montage imagery is rendered through the `Photo` component
  ([`src/components/Photo.jsx`](../src/components/Photo.jsx)): sharp corners,
  brass hairline, a cohesive punchy grade, and a light scrim for legibility.
- Placements (shared across both voices) are mapped in `GALLERY` in
  [`src/content.js`](../src/content.js): hero background + triptych, the
  "In Motion" band, the Services craft strip, the Niche crowd background, and
  the CTA image. The band's caption is the only voiced copy (`MONTAGE`).
