# Iconic Events — Homepage Structure & Wireframe Spec

*Reverse-engineered from the client's approved file (`Iconic_Website_Standalone.html`). Based on **Direction A — "The Standard"** (the default, full-length direction). The **Pricing / Engagement section has been removed** per client direction. This document is a build spec: section order, layout, content, and notes sufficient to rebuild the page.*

---

## 0. What This File Is

The source file is a **design canvas** containing three homepage directions that share the same positioning, content, and case studies but differ in aesthetic:

| Direction | Name | Aesthetic | Length |
|---|---|---|---|
| **A** *(approved)* | The Standard | Onyx + gold, structured editorial, generous negative space | ~15,400px (full page) |
| B | The Dossier | Bone/ivory, magazine-archive, serif-heavy | ~6,000px |
| C | The Cinema | Cinematic kinetic type, full-bleed drama | ~7,200px |

The canvas also exposed exploration "Tweaks" (Accent: Gold/Teal/Copper/Ivory · Motion: On/Slow/Still · Headline variant: Convert/Engineer/Authored). These are **design controls, not live page features.** The approved configuration is **Direction A · Gold accent · "Convert" headline.**

---

## 1. Global Design Notes

**Artboard width:** 1440px desktop. (Source is desktop-only; mobile behavior is not specified — see §14.)

**Palette (as used on this editorial surface):**

| Token | Hex | Role |
|---|---|---|
| Onyx | `#0E1312` | Primary background |
| Onyx raised / card | `#161C1B` / `#1D2524` | Section and card surfaces |
| Bound Leather (green) | `#0C3010` | Full-bleed feature sections (Services), accents |
| Gold | `#C9963A` | The single disciplined accent — eyebrows, rules, key numbers |
| Bone | `#F4F0E8` | Warm light type on dark |

> **Palette conflict to resolve:** the Brand Manual specifies Tide Pool `#112E2E` as the only green; this build uses Bound Leather `#0C3010`. Confirm which is canonical before final build.

**Type:** Cormorant (display serif — headlines, case titles), Helvetica (sans — body, nav, labels), Causten (reserved, all-caps seal moments only).

**Rhythm:** one disciplined gold accent per view; generous negative space; sharp corners throughout; intentional full-bleed green moments to break the onyx.

**Numbering:** each section carries a gold eyebrow ordinal (`01 · Position`, `02 · Selected Work`…). The source numbering is inconsistent (two "08"s, a jump to 12–14) because pricing sat mid-sequence. **After removing pricing, renumber the eyebrows sequentially 01–10.** A clean sequence is proposed in §13.

---

## 2. Section Stack (bird's-eye)

```
┌─────────────────────────────────────────────┐
│  NAV  (sticky)                               │
├─────────────────────────────────────────────┤
│  01 · HERO — video-first                     │
│  └ sticky CTA bar (appears on hero exit)     │
├─────────────────────────────────────────────┤
│  02 · PRESS / FEATURED IN                    │
├─────────────────────────────────────────────┤
│  03 · PORTRAIT CAROUSEL — "In the Room"      │
├─────────────────────────────────────────────┤
│  04 · POSITIONING — planner vs engineer      │
├─────────────────────────────────────────────┤
│  05 · SELECTED WORK — featured + archive     │
├─────────────────────────────────────────────┤
│  06 · SERVICES  (full-bleed GREEN)           │
├─────────────────────────────────────────────┤
│  07 · SCOPE — what we do / don't             │
├─────────────────────────────────────────────┤
│  08 · METHODOLOGY — The Iconic Standard      │
├─────────────────────────────────────────────┤
│  09 · PROOF / RECEIPTS — metrics             │
├─────────────────────────────────────────────┤
│  10 · VIDEO TESTIMONIALS                     │
├─────────────────────────────────────────────┤
│  ✗  PRICING / ENGAGEMENT   ← REMOVED         │
├─────────────────────────────────────────────┤
│  11 · NICHE — closing argument (TEAL/GREEN)  │
├─────────────────────────────────────────────┤
│  12 · CTA FORM — qualifier                   │
├─────────────────────────────────────────────┤
│  FOOTER                                      │
└─────────────────────────────────────────────┘
```

---

## 3. NAV

**Purpose:** persistent wayfinding + primary CTA. Sticky.

```
┌──────────────────────────────────────────────────────────┐
│ IE ICONIC EVENTS   Work  Services  Method  Studio  Journal   [ Start a Conversation ] │
└──────────────────────────────────────────────────────────┘
```

- **Left:** wordmark (IE sigil + "ICONIC EVENTS").
- **Center:** Work · Services · Method · Studio · Journal.
- **Right:** primary CTA button — "Start a Conversation."
- Transparent over hero; solidifies to onyx on scroll.

---

## 4. 01 · HERO (video-first)

**Purpose:** state the outcome, the mechanism, and the market in one screen. Full-viewport.

```
┌──────────────────────────────────────────────────────────┐
│  [ background: showreel video · muted loop ]             │
│  ▸ Showreel · 02:14      Miami · Las Vegas · Est. 2017   │
│                                                          │
│  WE ENGINEER LIVE EVENTS THAT                            │
│  CONVERT AUDIENCES INTO BUYERS.        ← Cormorant, XL   │
│                                                          │
│  Through psychology-driven stage design, production,     │
│  and experience architecture.          ← sub, sans       │
│                                                          │
│  [ composite outcome stat line ]                         │
│  [ Start a Conversation → ]   [ See the Work ]           │
│                                          ↓ Scroll        │
└──────────────────────────────────────────────────────────┘
```

- **Eyebrow row:** "Showreel · 02:14" · "For founder-led businesses scaling past $1M" · "Miami · Las Vegas · Worldwide · Est. 2017."
- **Headline (approved "Convert" variant):** *We engineer live events that convert audiences into buyers.*
- **Subhead:** *Through psychology-driven stage design, production, and experience architecture.*
- **Outcome line:** a single composite stat above the CTAs (lifts "what we do" to "what we cause").
- **CTAs:** primary "Start a Conversation →"; secondary "See the Work." Scroll cue bottom.

**Sticky bar:** on hero exit, a slim persistent bar appears with condensed positioning + CTA.

---

## 5. 02 · PRESS / FEATURED IN

**Purpose:** third trust signal inside the first scroll. Credibility transfer.

```
   As featured in · As built at
   BizBash   Event Marketer   Forbes   Entrepreneur
   Palms     HMS Belfast      T&C Las Vegas
```

- Label: "As featured in · As built at."
- Logo/wordmark strip (publications + notable venues), mixed type styles, muted on onyx.

---

## 6. 03 · PORTRAIT CAROUSEL — "In the Room"

**Purpose:** the people who trust Iconic, each tagged with a result.

```
   In the Room
   Founders who trust us with the biggest moments of their year.
   Selected clients · 2017—2024

   [BN]        [EM]        [TG]        [AA]        [CH] …
   Ben Newman  Ed Mylett   Tim Grover  Ali Awad    Chase Hughes
   $1.8M/150   Sold-out    Standing    $25K+ avg   HMS Belfast
   seats       keynote     room close  ticket room bespoke build
   →  (duotone portrait tiles, horizontal scroll)
```

- Duotone portrait tiles, name + credential + **result caption**.
- Roster: Ben Newman, Ed Mylett, Tim Grover, Ali Awad, Chase Hughes, Eddie Maalouf (looped for carousel).

---

## 7. 04 · POSITIONING — Experience Engineers

**Purpose:** the category claim. Reframe "event planner" → "experience engineer."

```
   01 · Position
   Not event planners. Experience engineers.

   Every element of a room is a lever — stage, light, cadence,
   the room's physics. We move an audience from seated to sold.

   ┌── The Event Planner ────────┬── The Experience Engineer ──┐
   │ Coordinates vendors         │ Directs every decision in-house│
   │ Manages logistics/timelines │ Designs the room's psychology  │
   │ Production as a line item   │ Production as a conversion tool│
   │ Measures success in applause│ Measures success in revenue    │
   │ Presents a vendor list      │ Presents a single authority    │
   └─────────────────────────────┴────────────────────────────┘
```

- Two-column **versus** table is the centerpiece. Left = planner (what they're not); right = engineer (what they are).

---

## 8. 05 · SELECTED WORK

**Purpose:** metrics-forward proof through one deep case + a compact archive.

```
   02 · Selected Work
   Rooms we've engineered.                        Full Index →

   ┌─ FEATURED · Case 001 ──────────────────────────────────┐
   │ Ben Newman · Palms Casino Resort · 2023                 │
   │ "Casino Royale, built to sell from the stage."          │
   │ Challenge: … 5-year wait, new membership tier to sell.  │
   │ Approach:  007 Casino Royale build, projection-mapped,  │
   │            close engineered into the choreography.      │
   │   $1.8M      150         100%                           │
   │   sales      attendees   2024 sold out                  │
   │ Read the case study →                                   │
   └────────────────────────────────────────────────────────┘

   More from the archive                          Full Index →
   ─ Bad After Dark ················· $146K sponsorships →
   ─ The CEO Lawyer Summit ·········· $25K+ avg ticket   →
   ─ Scaling With Systems LIVE ······ parking-garage summit →
   ─ Viral Ecom Adz ················· 6-fig sponsorship  →
   ─ Chase Hughes — London Warship ·· HMS Belfast build  →
```

- **Featured case** (large): client/venue/date line, headline, Challenge, Approach, 3 stat blocks, "Read the case study."
- **Archive strip:** 5 single-line rows so the featured case stays the focal point.

---

## 9. 06 · SERVICES  (full-bleed GREEN centerpiece)

**Purpose:** capability depth. The lux full-bleed moment that breaks the onyx.

```
▓▓▓ GREEN FULL-BLEED ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
   03 · Capability
   Five disciplines. One authored room.
   Every service directed in-house — we own creative authority end to end.

   01  Experience Strategy & Design        (replaces event planning)
   02  Production Design & Technical Dir.   (replaces AV coordination)
   03  Content Capture & Amplification      (IconX Studios · the long tail)
   04  Event Operations & Management        (the quiet engine)
   05  Revenue Architecture                 (a category of one)
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

- 5 numbered services, each with title, body, and a short "replaces…" positioning tag.

---

## 10. 07 · SCOPE OF SERVICE — do / don't

**Purpose:** SEO surface + qualifier/disqualifier. Deliberate narrowness as a selling point.

```
   04 · Scope of Service
   Everything we do. Everything we don't.

   ┌── What we do — 6 disciplines · 35+ deliverables ──────┐
   │ Strategy:   Event Vision Brief · journey mapping ·     │
   │             revenue & tier strategy · sponsorship arch │
   │ Creative:   stage & set · lighting psychology · LED ·  │
   │             scenic fabrication · show-flow direction   │
   │ Production: technical direction · audio · live …       │
   └───────────────────────────────────────────────────────┘

   What we don't  — "If you need these, we are not your studio."
   × … × … × …

   A note on referrals: a private list of trusted studios for
   weddings, corporate, and trade-show work. Ask on the call.
```

- Left/primary: **What we do** grouped by discipline (Strategy / Creative / Production …).
- **What we don't**: explicit disqualifiers with × markers.
- Referral note softens the "no."

---

## 11. 08 · METHODOLOGY — The Iconic Standard

**Purpose:** proprietary framework = defensible process.

```
   04 · Methodology
   The Iconic Standard.
   Five phases, one operating system, applied to every room.

   I   Insight        — audience psychology, offer economics, room physics
   II  Strategy       — revenue-first blueprint, every sell-from-stage moment
   III Creative       — story, room, rhythm; the world the audience lives in
   IV  Production     — stage/light/sound/scenic in-house; no vendor seams
   V   Amplification  — capture, edit, distribute; a quarter of content
```

- Five roman-numeral phases, each with a one-line thesis. `data-method-name` is swappable ("The Iconic Standard" is the approved label).

---

## 12. 09 · PROOF / RECEIPTS

**Purpose:** the hard numbers, isolated.

```
   05 · Receipts
   The only numbers that matter.

   $1.8M            $146K            40+            100%
   membership       sponsorship      rooms          2024 events
   from 150 seats   in six days      engineered     sold out
```

- 4 large stat blocks (gold numerals), revenue/conversion oriented.

---

## 13. 10 · VIDEO TESTIMONIALS

**Purpose:** clients say, in their own words, that they sold from the room.

```
   06 · From the Host
   They sold from our rooms. Hear them say so.

   ┌─ ▶ 00:42 ─┐  ┌─ ▶ 01:18 ─┐  ┌─ ▶ 00:56 ─┐
   │ Ben Newman│  │ Ali Awad  │  │ Eddie M.  │
   │ "…Tony    │  │ "engineered│  │ "$146K in │
   │ Robbins…" │  │ the room…" │  │ 6 days…"  │
   └───────────┘  └───────────┘  └───────────┘
```

- 3 video tiles: poster + play trigger + duration + short pull-quote + name/role.

---

## 14. ✗ PRICING / ENGAGEMENT — REMOVED

The source contained a section titled *"What it costs to work with us"* with tiered engagements (Vision Brief from $25K, etc.). **Per client direction, this section is removed entirely.**

Consequences to handle on rebuild:
1. **Renumber** section eyebrows sequentially (proposed clean order: 01 Position → 02 Selected Work → 03 Capability → 04 Scope → 05 Methodology → 06 Receipts → 07 From the Host → 08 The Uncontested Room → 09 Start a Conversation).
2. The qualifier form (§16) originally carried some pricing-adjacent framing via the "business stage" field — keep the field (it's a qualifier), just ensure no dollar tiers reappear.
3. Check anchor links / nav that may have pointed to a pricing anchor.

---

## 15. 11 · NICHE — the closing argument  (TEAL/GREEN surface)

**Purpose:** the emotional close — the uncontested category.

```
▓▓▓ GREEN / TEAL ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
   07 · The Uncontested Room
   Built for founders. Not for brands.

   Every major experience agency chases Fortune 500 budgets.
   We don't. We engineer live events for coaches, creators, and
   founder-led businesses — operators who need the room to
   generate revenue, not applause. Nobody else builds for it.
   It's the only room we build.

                    IE  ·  EST · MMXVII
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

- Single bold statement + supporting paragraph, sigil seal. Full-bleed contrast surface.

---

## 16. 12 · CTA FORM — embedded qualifier

**Purpose:** replace a generic "book a call" with an on-page qualifier that filters for fit.

```
   08 · Start a Conversation
   Tell us about the room you want to build.

   30 — minutes with a senior director
   48 — hours to respond, every time
   0  — pitch decks. Just the conversation.

   ┌────────────────────────────────────────────┐
   │ Your business stage:  ▢ <$1M ▢ $1–5M        │
   │                       ▢ $5–25M ▢ $25M+       │
   │ When is the room?     ▢ Next 3mo ▢ 3–6mo …   │
   │ What outcome are you engineering? [ text ]   │
   │ [ Start a conversation → ]                   │
   └────────────────────────────────────────────┘
   We respond within 48 hours. If we're not the right fit,
   we'll tell you on the first call.
```

- Three trust stats (30 / 48 / 0).
- Fields: **business stage** (select), **timing** (select), **outcome** (free text).
- Reassurance line under submit.

---

## 17. FOOTER

```
   IE ICONIC EVENTS
   Experience engineers for the creator economy. Est. 2017.

   Studio        Contact                 Follow
   Work          icon@iconicevents.com   Instagram
   Services      (305) 791-5290          LinkedIn
   Method        Miami · Las Vegas       Vimeo
   Journal
   ─────────────────────────────────────────────
   © 2026 Iconic Events LLC   ·   ICONIC · EXPERIENCE · ENGINEERED
   Privacy · Terms
```

---

## 18. Build Checklist

- [ ] Confirm Direction A is the approved direction (assumed from default).
- [ ] Resolve green conflict: Bound Leather `#0C3010` vs Brand Manual Tide Pool `#112E2E`.
- [ ] Reconcile positioning (creator-economy site vs heritage-luxury Brand Manual voice).
- [ ] Remove pricing section; renumber eyebrows 01–09.
- [ ] Sticky CTA bar behavior on hero exit.
- [ ] Portrait carousel: real duotone assets + result captions.
- [ ] Wire the qualifier form (stage / timing / outcome) to inbox; keep 48h promise copy.
- [ ] Define mobile layout (source is desktop-1440 only): nav → hamburger, versus table → stacked, carousel → swipe, stat rows → 2-up.

---

*Structure derived from Direction A of the client's approved design file. Copy references are the client's own draft content (case studies noted in-source as pulled from klevr.events — verify before publishing).*
