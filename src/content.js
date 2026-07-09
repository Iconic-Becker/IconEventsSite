// ── Dual-voice content ────────────────────────────────────────────────
// Page STRUCTURE follows Iconic-Events_Homepage_Structure.md.
// DESIGN follows Iconic-Events_Brand-Reference.md (Onyx/Tide Pool/Brass/Bone).
// COPY exists in BOTH brand voices, side by side:  V("<Iconic>", "<Genflow>")
//
//   Iconic  = engraved, declarative, quiet, specific. No hype, no "scale",
//             no superlatives, no exclamation, no emoji.
//   Genflow = outcome-first, second person, bold, proof-driven, conversion
//             energy. Short punchy clauses.
//
// RULE: change any line → change BOTH sides of its V() pair, each true to its
// own voice guide. Plain strings (no V) are voice-neutral (names, numbers).

const V = (iconic, genflow) => ({ iconic, genflow })

export const VOICES = {
  iconic: { name: "Iconic Events", tag: "Engraved" },
  genflow: { name: "Genflow", tag: "Convert" },
}

export const DEFAULT_VOICE = "iconic"

export const PLACEHOLDER = "/images/placeholder.png"

// Event-atmosphere photography (backgrounds & montages only — never labelled
// as a specific client or case study).
const g = (n) => `/images/gallery/g${n}.webp`
const cl = (s) => `/images/clients/${s}.webp`
export const GALLERY = {
  band: [g(8), g(3), g(35), g(23), g(30), g(13), g(19)],
  detail: [g(6), g(2), g(19)],
  nicheBg: g(33),
  ctaImg: g(22),
  positionRoom: "/images/gallery/position-room.webp",
  motionWall: [g(8), g(9), g(28), g(31), g(3), g(35), g(23), g(30), g(13), g(19)],
}

// Hero image walls: four vertical marquee columns mixing client portraits and
// event atmosphere. Left columns drift up, right columns drift down.
export const HERO_WALL = {
  leftA: [g(9), cl("ben-newman"), g(31), cl("eddie-maalouf"), g(23), g(3)],
  leftB: [cl("ali-awad"), g(8), g(30), cl("ravi-abuvala"), g(35), cl("chase-hughes")],
  rightA: [g(28), cl("ed-mylett"), g(13), g(19), cl("ali-awad"), g(26)],
  rightB: [cl("ben-newman"), g(9), g(22), cl("eddie-maalouf"), g(8), cl("ravi-abuvala")],
}

// Voiced captions for the full-bleed montage band.
export const MONTAGE = {
  kicker: V("The Room, In Motion", "The Energy We Engineer"),
  line: V(
    "Stage, light, cadence, crowd — the levers set before the doors open.",
    "Fire, stage, crowd, close — this is the room we build for you."
  ),
}

/* ── NAV ──────────────────────────────────────────────────────────────── */
// Centered-logo navigation: a few menus on each side, no CTA.
export const NAV = {
  left: [
    { href: "#work", label: "Work" },
    { href: "#services", label: "Services" },
    { href: "#method", label: "Method" },
  ],
  right: [
    { href: "#receipts", label: "Proof" },
    { href: "#testimonials", label: "Voices" },
    { href: "#contact", label: "Contact" },
  ],
}

/* ── 01 · HERO ────────────────────────────────────────────────────────── */
export const HERO = {
  audience: V("For founder-led businesses past $1M", "For founders scaling past $1M"),
  est: "Est. 2017",
  headline: V(
    "We engineer live events that sell from the stage.",
    "We engineer live events that convert audiences into buyers."
  ),
  subhead: V(
    "Through psychology-led stage design, production, and experience architecture.",
    "Through psychology-driven stage design, production, and experience architecture."
  ),
  outcome: V(
    "$1.8M from a single room of 150. That is the room we build.",
    "$1.8M sold from a single room of 150. That's the room we build."
  ),
  ctaPrimary: V("Start a Conversation", "Book the Call"),
  ctaSecondary: V("See the Work", "See the Work"),
  scroll: "Scroll",
}

/* ── 02 · PRESS ───────────────────────────────────────────────────────── */
export const PRESS = {
  label: V("As featured in · As built at", "As featured in · As built at"),
  logos: ["BizBash", "Event Marketer", "Forbes", "Entrepreneur", "Palms", "HMS Belfast", "T&C Las Vegas"],
}

/* ── 03 · PORTRAIT CAROUSEL — In the Room ─────────────────────────────── */
export const ROOM = {
  title: V("In the Room", "In the Room"),
  sub: V(
    "Founders who trust us with the biggest moments of their year.",
    "The founders you follow trust us with their biggest rooms."
  ),
  meta: "Selected clients · 2017—2024",
  people: [
    {
      id: "r1",
      img: "/images/clients/ben-newman.webp",
      name: "Ben Newman",
      result: V("$1.8M · 150 seats", "$1.8M from 150 seats"),
      about: V(
        "A 007 Casino Royale evening at the Palms — projection-mapped, choreographed, and built to sell a new membership tier from the stage. $1.8M from a hundred and fifty seats.",
        "We turned the Palms into a 007 Casino Royale night — projection-mapped and built to close. 150 seats, $1.8M in membership sold from the stage."
      ),
    },
    {
      id: "r2",
      img: "/images/clients/ed-mylett.webp",
      name: "Ed Mylett",
      result: V("Sold-out keynote", "Sold-out keynote"),
      about: V(
        "A keynote built to the minute for a room that was sold out before the doors opened. Every beat placed; nothing left to chance.",
        "A keynote room so dialed in it sold out before doors — every beat built to move the audience."
      ),
    },
    {
      id: "r3",
      img: "/images/clients/ali-awad.webp",
      name: "Ali Awad",
      result: V("$25K+ average ticket", "$25K+ avg ticket"),
      about: V(
        "The CEO Lawyer Summit — a room engineered to sell a $25K offer without a hint of pressure. The close was written into the choreography.",
        "The CEO Lawyer Summit — we engineered the room to sell a $25K+ ticket. The close was baked into the flow, and it closed."
      ),
    },
    {
      id: "r4",
      img: "/images/clients/chase-hughes.webp",
      name: "Chase Hughes",
      result: V("HMS Belfast build", "HMS Belfast build"),
      about: V(
        "A bespoke build aboard HMS Belfast on the Thames — a warship staged as a room, to the last rivet.",
        "We built the room on a warship — HMS Belfast on the Thames — staged end to end for one unforgettable night."
      ),
    },
    {
      id: "r5",
      img: "/images/clients/eddie-maalouf.webp",
      name: "Eddie Maalouf",
      result: V("$146K in six days", "$146K in 6 days"),
      about: V(
        "Bad After Dark — an evening that returned $146K in sponsorship inside six days. Restraint on the surface, revenue underneath.",
        "Bad After Dark pulled $146K in sponsorship in 6 days — a night that looked effortless and printed money."
      ),
    },
    {
      id: "r6",
      img: "/images/clients/ravi-abuvala.webp",
      name: "Ravi Abuvala",
      result: V("Parking-garage summit", "Parking-garage summit"),
      about: V(
        "Scaling With Systems LIVE — a summit staged in a parking garage and made to feel inevitable. The unlikeliest room, fully authored.",
        "Scaling With Systems LIVE — we turned a parking garage into a summit that looked like a seven-figure production."
      ),
    },
  ],
}

/* ── 04 · POSITIONING ─────────────────────────────────────────────────── */
export const POSITION = {
  eyebrow: "01 · Position",
  title: V("Not event planners. Experience engineers.", "Not event planners. Experience engineers."),
  body: V(
    "Every element of a room is a lever — stage, light, cadence, the physics of the space. We move an audience from seated to decided.",
    "Every element of a room is a lever — stage, light, cadence, the room's physics. We move your audience from seated to sold."
  ),
  colPlanner: V("The Event Planner", "The Event Planner"),
  colEngineer: V("The Experience Engineer", "The Experience Engineer"),
  rows: [
    { planner: "Coordinates vendors", engineer: V("Directs every decision in-house", "Directs every decision in-house") },
    { planner: "Manages logistics and timelines", engineer: V("Designs the room's psychology", "Designs the room's psychology") },
    { planner: "Production as a line item", engineer: V("Production as an instrument", "Production as a conversion tool") },
    { planner: "Measures success in applause", engineer: V("Measures success in revenue", "Measures success in revenue") },
    { planner: "Presents a vendor list", engineer: V("Presents a single authority", "Presents a single authority") },
  ],
}

/* ── 05 · SELECTED WORK ───────────────────────────────────────────────── */
export const WORK = {
  eyebrow: "02 · Selected Work",
  title: V("Rooms we've engineered.", "Rooms we've engineered."),
  index: V("Full Index →", "Full Index →"),
  featured: {
    label: "Featured · Case 001",
    meta: "Ben Newman · Palms Casino Resort · 2023",
    headline: V("Casino Royale, built to sell from the stage.", "Casino Royale — built to sell from the stage."),
    challengeLabel: V("Challenge", "Challenge"),
    challenge: V(
      "A five-year wait and a new membership tier to sell.",
      "A 5-year wait and a new membership tier to sell."
    ),
    approachLabel: V("Approach", "Approach"),
    approach: V(
      "A 007 Casino Royale build, projection-mapped, with the close engineered into the choreography.",
      "A 007 Casino Royale build, projection-mapped, with the close engineered into the choreography."
    ),
    stats: [
      { value: "$1.8M", label: V("membership sales", "in sales") },
      { value: "150", label: V("attendees", "attendees") },
      { value: "100%", label: V("2024 sold out", "2024 sold out") },
    ],
    cta: V("Read the case study →", "Read the case study →"),
  },
  archiveLabel: V("More from the archive", "More from the archive"),
  archive: [
    { id: "a1", name: "Bad After Dark", result: V("$146K sponsorships", "$146K sponsorships") },
    { id: "a2", name: "The CEO Lawyer Summit", result: V("$25K+ average ticket", "$25K+ avg ticket") },
    { id: "a3", name: "Scaling With Systems LIVE", result: V("Parking-garage summit", "Parking-garage summit") },
    { id: "a4", name: "Viral Ecom Adz", result: V("Six-figure sponsorship", "6-figure sponsorship") },
    { id: "a5", name: "Chase Hughes — London", result: V("HMS Belfast build", "HMS Belfast build") },
  ],
}

/* ── 06 · SERVICES (green full-bleed) ─────────────────────────────────── */
export const SERVICES = {
  eyebrow: "03 · Capability",
  title: V("Five disciplines. One authored room.", "Five disciplines. One room, fully built."),
  intro: V(
    "Every service directed in-house. We hold creative authority end to end.",
    "Every service directed in-house — we own the whole build, end to end."
  ),
  items: [
    {
      id: "s1",
      num: "01",
      title: V("Experience Strategy & Design", "Experience Strategy & Design"),
      replaces: V("replaces event planning", "replaces event planning"),
      body: V(
        "The room's intent, mapped before a single decision is made.",
        "We map the room's intent before a single decision gets made.",
      ),
    },
    {
      id: "s2",
      num: "02",
      title: V("Production Design & Technical Direction", "Production Design & Technical Direction"),
      replaces: V("replaces AV coordination", "replaces AV coordination"),
      body: V(
        "Stage, light, sound, and scenic, directed as one instrument.",
        "Stage, light, sound, and scenic — directed as one machine.",
      ),
    },
    {
      id: "s3",
      num: "03",
      title: V("Content Capture & Amplification", "Content Capture & Amplification"),
      replaces: V("IconX Studios · the long tail", "IconX Studios · the long tail"),
      body: V(
        "One night, captured and cut into a quarter of content.",
        "One night becomes a quarter of content that keeps selling.",
      ),
    },
    {
      id: "s4",
      num: "04",
      title: V("Event Operations & Management", "Event Operations & Management"),
      replaces: V("the quiet engine", "the quiet engine"),
      body: V(
        "The logistics run to the minute, and out of sight.",
        "Logistics run to the minute so you never see the seams.",
      ),
    },
    {
      id: "s5",
      num: "05",
      title: V("Revenue Architecture", "Revenue Architecture"),
      replaces: V("a category of one", "a category of one"),
      body: V(
        "Tiers, offers, and the sell-from-stage moment, engineered.",
        "Tiers, offers, and the sell-from-stage moment — engineered to convert.",
      ),
    },
  ],
}

/* ── 07 · SCOPE OF SERVICE ────────────────────────────────────────────── */
export const SCOPE = {
  eyebrow: "04 · Scope of Service",
  title: V("Everything we do. Everything we don't.", "Everything we do. Everything we don't."),
  doLabel: V("What we do — 6 disciplines · 35+ deliverables", "What we do — 6 disciplines · 35+ deliverables"),
  doGroups: [
    { id: "g1", group: "Strategy", items: "Event Vision Brief · journey mapping · revenue & tier strategy · sponsorship architecture" },
    { id: "g2", group: "Creative", items: "Stage & set · lighting psychology · LED · scenic fabrication · show-flow direction" },
    { id: "g3", group: "Production", items: "Technical direction · audio · live show-calling · crew & vendor command" },
  ],
  dontLabel: V(
    "What we don't — if you need these, we are not your studio.",
    "What we don't — if you need these, we're not your studio."
  ),
  dont: ["Weddings & socials", "Corporate AV rental", "Trade-show booths", "Generic conferences"],
  referral: V(
    "A private list of trusted studios for weddings, corporate, and trade-show work. Ask on the call.",
    "We keep a private list of trusted studios for weddings, corporate, and trade-show work. Ask on the call."
  ),
}

/* ── 08 · METHODOLOGY ─────────────────────────────────────────────────── */
export const METHOD = {
  eyebrow: "05 · Methodology",
  title: V("The Iconic Standard.", "The Iconic Standard."),
  sub: V(
    "Five phases, one operating system, applied to every room.",
    "Five phases, one operating system, run on every room."
  ),
  phases: [
    { id: "m1", num: "I", name: V("Insight", "Insight"), body: V("Audience psychology, offer economics, room physics.", "Audience psychology, offer economics, room physics.") },
    { id: "m2", num: "II", name: V("Strategy", "Strategy"), body: V("A revenue-first blueprint; every sell-from-stage moment mapped.", "A revenue-first blueprint; every sell-from-stage moment mapped.") },
    { id: "m3", num: "III", name: V("Creative", "Creative"), body: V("Story, room, rhythm — the world the audience lives in.", "Story, room, rhythm — the world your audience lives in.") },
    { id: "m4", num: "IV", name: V("Production", "Production"), body: V("Stage, light, sound, scenic in-house. No vendor seams.", "Stage, light, sound, scenic in-house. No vendor seams.") },
    { id: "m5", num: "V", name: V("Amplification", "Amplification"), body: V("Capture, edit, distribute — a quarter of content from one night.", "Capture, edit, distribute — a quarter of content from one night.") },
  ],
}

/* ── 09 · RECEIPTS ────────────────────────────────────────────────────── */
export const RECEIPTS = {
  eyebrow: "06 · Receipts",
  title: V("The only numbers that matter.", "The only numbers that matter."),
  stats: [
    { id: "n1", value: "$1.8M", label: V("membership, from 150 seats", "membership from 150 seats") },
    { id: "n2", value: "$146K", label: V("sponsorship, in six days", "sponsorship in 6 days") },
    { id: "n3", value: "40+", label: V("rooms engineered", "rooms engineered") },
    { id: "n4", value: "100%", label: V("2024 events sold out", "2024 events sold out") },
  ],
}

/* ── 10 · VIDEO TESTIMONIALS ──────────────────────────────────────────── */
export const TESTIMONIALS = {
  eyebrow: "07 · From the Host",
  title: V("They sold from our rooms. Hear them say so.", "They sold from our rooms. Hear it from them."),
  items: [
    { id: "t1", img: "/images/clients/ben-newman.webp", duration: "00:42", name: "Ben Newman", role: V("Palms Casino Resort", "Palms Casino Resort"), quote: V("“The room did what a year of marketing couldn't.”", "“The room did what a year of marketing couldn't.”") },
    { id: "t2", img: "/images/clients/ali-awad.webp", duration: "01:18", name: "Ali Awad", role: V("The CEO Lawyer Summit", "The CEO Lawyer Summit"), quote: V("“They engineered the room to close. It closed.”", "“They engineered the room to close. It closed.”") },
    { id: "t3", img: "/images/clients/eddie-maalouf.webp", duration: "00:56", name: "Eddie Maalouf", role: V("Bad After Dark", "Bad After Dark"), quote: V("“$146K in six days. From one night.”", "“$146K in 6 days. From one night.”") },
  ],
}

/* ── 11 · NICHE (green full-bleed close) ──────────────────────────────── */
export const NICHE = {
  eyebrow: "08 · The Uncontested Room",
  title: V("Built for founders. Not for brands.", "Built for founders. Not for brands."),
  body: V(
    "Every major experience agency chases Fortune 500 budgets. We do not. We engineer live events for coaches, creators, and founder-led businesses — operators who need the room to produce revenue, not applause. No one else builds for it. It is the only room we build.",
    "Every major experience agency chases Fortune 500 budgets. We don't. We build live events for coaches, creators, and founder-led businesses — operators who need the room to generate revenue, not applause. Nobody else builds for it. It's the only room we build."
  ),
  seal: "IE · EST · MMXVII",
}

/* ── 12 · CTA FORM ────────────────────────────────────────────────────── */
export const CTA = {
  eyebrow: "09 · Start a Conversation",
  title: V("Tell us about the room you want to build.", "Tell us about the room you want to build."),
  stats: [
    { id: "c1", value: "30", label: V("minutes with a senior director", "minutes with a senior director") },
    { id: "c2", value: "48", label: V("hours to respond, every time", "hours to respond, every time") },
    { id: "c3", value: "0", label: V("pitch decks — just the conversation", "pitch decks — just the conversation") },
  ],
  form: {
    stageLabel: V("Your business stage", "Your business stage"),
    stages: ["Under $1M", "$1M–$5M", "$5M–$25M", "$25M+"],
    timingLabel: V("When is the room?", "When is the room?"),
    timings: ["Next 3 months", "3–6 months", "6–12 months", "Exploring"],
    outcomeLabel: V("What outcome are you engineering?", "What outcome are you engineering?"),
    outcomePlaceholder: V(
      "The result the room has to produce.",
      "The result you need the room to drive.",
    ),
    submit: V("Start a conversation", "Book the call"),
    sending: V("Sending…", "Locking it in…"),
    reassurance: V(
      "We respond within 48 hours. If we are not the right fit, we will tell you on the first call.",
      "We respond within 48 hours. If we're not the right fit, we'll tell you on the first call."
    ),
    successTitle: V("Received. A director will write within 48 hours.", "You're in. A director replies within 48 hours."),
    successBody: V(
      "Watch {email} for the reply. If we are not the right fit, we will say so first.",
      "Watch {email} — that's where the reply lands. If we're not the fit, we'll say so first."
    ),
  },
}

/* ── FOOTER ───────────────────────────────────────────────────────────── */
export const FOOTER = {
  line: V("Experience engineers. Est. 2017.", "Experience engineers for the creator economy. Est. 2017."),
  columns: [
    { id: "col1", head: "Studio", items: ["Work", "Services", "Method", "Journal"] },
    { id: "col2", head: "Contact", items: ["icon@iconicevents.com", "(305) 791-5290", "Miami · Las Vegas"] },
    { id: "col3", head: "Follow", items: ["Instagram", "LinkedIn", "Vimeo"] },
  ],
  tagStrip: "ICONIC · EXPERIENCE · ENGINEERED",
  legal: "© 2026 Iconic Events LLC",
  ip: "This page is the exclusive intellectual property of Iconic Events LLC. Unauthorized reproduction, distribution, or modification is prohibited. All rights reserved.",
}
