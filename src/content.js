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


// Event-atmosphere photography (backgrounds & montages only — never labelled
// as a specific client or case study).
const g = (n) => `/images/gallery/g${n}.webp`
export const GALLERY = {
  band: [g(8), g(3), g(35), g(23), g(30), g(13), g(19)],
  // Widest, highest-resolution frames — used where an image bleeds full-width
  // behind a section (e.g. the Capability ledger flood).
  capability: [g(33), g(6), g(35), g(2), g(23)],
  detail: [g(6), g(2), g(19)],
  nicheBg: "/images/gallery/uncontested-room.webp",
  ctaImg: g(22),
  positionRoom: "/images/gallery/position-room.webp",
  // The same frame at 960w. Used where it is a CSS background, which cannot
  // take a srcset, and where it sits under two gradient overlays so the
  // detail is invisible anyway. Sharing the file with the <img> variants
  // means the browser fetches it once rather than twice.
  positionRoomWide: "/images/gallery/position-room-960.webp",
  motionWall: [g(8), g(9), g(28), g(31), g(3), g(35), g(23), g(30), g(13), g(19)],
}

// Voiced captions for the full-bleed montage band.
export const MONTAGE = {
  kicker: V("The Room, In Motion", "The Energy We Engineer"),
  line: V(
    "Stage, light, cadence, crowd: the levers set before the doors open.",
    "Fire, stage, crowd, close. This is the room we build for you."
  ),
}

/* ── NAV ──────────────────────────────────────────────────────────────── */
// Centered-logo navigation: a few menus on each side, no CTA.
/* Follows the page in scroll order, left to right. Labels say what the
   section is rather than naming it: "Proof" and "Voices" told a prospect
   nothing, and "Voices" pointed at the testimonial section that no longer
   exists. Every href below resolves to a real id on the page. */
export const NAV = {
  // Every link is a page of its own, so the bar never sends anyone back to
  // the homepage to find something (Iconic's call, 26 Oct 2026). Case
  // Studies is smallOnly: from md up the brass tab under the bar covers it.
  links: [
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/case-studies", label: "Case Studies", smallOnly: true },
    { href: "/reviews", label: "Reviews" },
    { href: "/contact", label: "Contact" },
  ],
}

/* ── 01 · HERO ────────────────────────────────────────────────────────── */
export const HERO = {
  // Kept, not rendered. The audience line, the est. mark and the hero's "See
  // the Work" link came out at Iconic's call: the hero is the headline, the
  // subhead and one button. The copy stays here in case any returns
  // (ctaSecondary is still used by Testimonials and Niche). The old outcome
  // line went for good with the Casino Royale case study.
  audience: V("For founder-led businesses past $1M", "For founders scaling past $1M"),
  est: "Est. 2017",
  headline: V(
    "More than $100M moves through the events we manage each year.",
    "More than $100M moves through the events we manage each year."
  ),
  subhead: V(
    "Through psychology-led stage design, production, and experience architecture for live in person events.",
    "Through psychology-led stage design, production, and experience architecture for live in person events."
  ),
  ctaPrimary: V("Start a Conversation", "Book the Call"),
  ctaSecondary: V("See the Work", "See the Work"),
  scroll: "Scroll",
}

/* ── 02 · PRESS ───────────────────────────────────────────────────────── */
export const PRESS = {
  label: V("Brands who trust us", "Brands who trust us"),
  // Every file ships on the same 1400x400 canvas, bone on transparent, the
  // logo optically balanced inside it: a long wordmark set smaller, a stacked
  // mark larger. That padding is the balancing, so the row sets one height for
  // all of them and the files decide their own weight.
  //
  // Keep new logos on the same canvas, and do not trim them. Trimming would
  // throw the balancing away and put a long wordmark back to the same height
  // as a square mark, which reads wrong.
  logos: [
    { name: "7th Level", src: "/images/press/7th-level.webp", w: 1400, h: 400 },
    { name: "Commas", src: "/images/press/commas.webp", w: 1400, h: 400 },
    { name: "Scaling With Systems", src: "/images/press/scaling-with-systems.webp", w: 1400, h: 400 },
    // Re-canvassed here to match the set, pending a supplied version.
    { name: "Shelby Sapp's Women & Wealth", src: "/images/press/women-and-wealth.webp", w: 1400, h: 400 },
    { name: "NetRevenue", src: "/images/press/netrevenue.webp", w: 1400, h: 400 },
    { name: "Closers.io", src: "/images/press/closers-io.webp", w: 1400, h: 400 },
  ],
  // Kept, not rendered. The row ran on these names before the logo files
  // arrived. They are press mentions and venues rather than clients, so if
  // they come back they probably want a row and a label of their own.
  retired: ["BizBash", "Event Marketer", "Forbes", "Entrepreneur", "Palms", "HMS Belfast", "T&C Las Vegas"],
}

/* ── 03 · PORTRAIT CAROUSEL — In the Room ─────────────────────────────── */
export const ROOM = {
  title: V("Creators who trust us", "Creators who trust us"),
  sub: V(
    "Founders who trust us with the biggest moments of their year.",
    "The founders you follow trust us with their biggest rooms."
  ),
  meta: "Selected clients · Since 2017",
  // Order is Iconic's call, front of the rail first: Jeremy Miner, Eddie
  // Maalouf, Shelby Sapp, Ambro Dipilato, Chase Hughes, Alexis Mai, then the
  // rest. Ed Mylett came off on 26 Oct 2026. Shelby, Ambro and Alexis carry
  // img: null, which draws a branded placeholder, until their headshots are
  // on file. Ben Newman and Ali Awad stay, but not at the front.
  people: [
    {
      id: "r7",
      img: "/images/clients/jeremy-miner.webp",
      name: "Jeremy Miner",
      event: "The Sales Summit",
      slug: "the-sales-summit",
      // Audience and reps trained: 7th Level's own speaker card for Net Rev
      // Summit 2026 (Drive, speaker_jeremy_miner.png). Attendance: the case study.
      stats: [
        { value: "2.5M+", label: "Followers" },
        { value: "400K+", label: "Reps trained" },
        { value: "700", label: "Attendees" },
      ],
      result: V("700 attendees", "700 attendees"),
      about: V(
        "The Sales Summit: 7th Level's largest event yet, three days at the Irving Convention Center built around live call reviews from the stage.",
        "The Sales Summit. 7th Level's biggest event ever, 700 people and three days of live call reviews from the stage."
      ),
    },
    {
      id: "r5",
      img: "/images/clients/eddie-maalouf.webp",
      name: "Eddie Maalouf",
      stats: [{ value: "$146K", label: "Sponsorship in six days" }],
      event: "Bad After Dark",
      slug: "bad-after-dark",
      result: V("$146K in six days", "$146K in 6 days"),
      about: V(
        "Bad After Dark, an evening that returned $146K in sponsorship inside six days. Restraint on the surface, revenue underneath.",
        "Bad After Dark pulled $146K in sponsorship in 6 days. A night that looked effortless and printed money."
      ),
    },
    {
      id: "r8",
      // Placeholder card until a headshot is on file. No case study yet, so no link.
      img: null,
      name: "Shelby Sapp",
      event: "Women and Wealth",
      stats: [
        { value: "July 2026", label: "Fort Lauderdale, FL" },
      ],
      result: V("Women and Wealth", "Women and Wealth"),
    },
    {
      id: "r9",
      // Placeholder card until a headshot is on file. Figure: the Net Rev Summit 2026 case study.
      img: null,
      name: "Ambro Dipilato",
      event: "Net Rev Summit 2026",
      slug: "net-rev-summit-2026",
      stats: [
        { value: "$14.9K", label: "Saved on the hotel" },
      ],
      result: V("Net Rev Summit 2026", "Net Rev Summit 2026"),
    },
    {
      id: "r4",
      img: "/images/clients/chase-hughes.webp",
      name: "Chase Hughes",
      // Audience: ThoughtLeaders estimate, undated. His London case study was
      // withdrawn on 26 Oct 2026 as inaccurate, so no link and no figures from it.
      event: "HMS Belfast, London",
      stats: [{ value: "730K+", label: "YouTube" }],
      result: V("HMS Belfast build", "HMS Belfast build"),
      about: V("A build aboard HMS Belfast on the Thames for Chase Hughes.", "A build aboard HMS Belfast on the Thames for Chase Hughes."),
    },
    {
      id: "r10",
      // Placeholder card until a headshot is on file. No case study yet, so no link.
      img: null,
      name: "Alexis Mai",
      event: "Her Last Call",
      stats: [
        { value: "2025", label: "Produced" },
      ],
      result: V("Her Last Call", "Her Last Call"),
    },
    {
      id: "r6",
      img: "/images/clients/ravi-abuvala.webp",
      name: "Ravi Abuvala",
      // From the Scaling With Systems LIVE case study.
      stats: [
        { value: "300", label: "Attendees" },
        { value: "$1.2M", label: "Sold in 24 hours" },
        { value: "2022", label: "Booked again" },
      ],
      event: "Scaling With Systems LIVE",
      slug: "scaling-with-systems-live",
      result: V("300 attendees", "300 attendees"),
      about: V(
        "A founder-led live summit shaped as one continuous audience journey, from arrival through the final moment on stage.",
        "A live summit built around the full audience journey, with every production decision working toward the moments that mattered on stage."
      ),
    },
    {
      id: "r1",
      img: "/images/clients/ben-newman.webp",
      name: "Ben Newman",
      // Audience: CreatorDB, refreshed 8 Oct 2026 (@continuedfight). His event
      // figures and case study link came out with the Casino Royale case study.
      stats: [{ value: "704K", label: "Instagram" }],
      result: V("Live event production", "Live event production"),
      about: V("Live event production for Ben Newman.", "Live event production for Ben Newman."),
    },
    {
      id: "r3",
      img: "/images/clients/ali-awad.webp",
      name: "Ali Awad",
      // The CEO Lawyer Summit happened; its case study was withdrawn on
      // 26 Oct 2026 as inaccurate, so no link and no figures from it.
      event: "The CEO Lawyer Summit",
      stats: [],
      result: V("Live event production", "Live event production"),
      about: V("The CEO Lawyer Summit, produced for Ali Awad.", "The CEO Lawyer Summit, produced for Ali Awad."),
    },
  ],
}

/* ── 04 · POSITIONING ─────────────────────────────────────────────────── */
export const POSITION = {
  eyebrow: "Position",
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

/* ── ABOUT US ─────────────────────────────────────────────────────────── */
// The first section after the logo row, in place of POSITION. The title is a
// fixed line from the COPY GUIDE and is used verbatim; the body is built from
// the guide's approved premise copy. Run any change past Icon first.
export const ABOUT = {
  eyebrow: "About Us",
  title: V("Trust is built in a room, not on a social feed.", "Trust is built in a room, not on a social feed."),
  body: [
    V(
      "An audience can follow you for years without fully believing you. A few days in the same room settles it permanently, in one direction or the other.",
      "An audience can follow you for years without fully believing you. A few days in the same room settles it permanently, in one direction or the other."
    ),
    V(
      "Iconic Events has engineered those rooms since 2017, for founders, brands and creators whose reputation rides on the answer. We are not just an event planning company. Strategy, creative, production and the night itself sit with one team, under a single line of authority.",
      "Iconic Events has engineered those rooms since 2017, for founders, brands and creators whose reputation rides on the answer. We are not just an event planning company. Strategy, creative, production and the night itself sit with one team, under a single line of authority."
    ),
  ],
  link: V("See the case studies →", "See the case studies →"),
}

/* ── THE NUMBERS ─────────────────────────────────────────────────────── */
// A slim bar straight after About Us, the way the agencies Iconic benchmarks
// against lead with three or four figures. Every figure is one the site
// already stands behind: the hero's annual figure, the largest attendance in
// the case studies (CreatorHub Live, PMU World 2025), Iconic's own country
// list, and the founding year. No event count, at Iconic's call.
export const NUMBERS = [
  { value: "$100M+", label: "Moves through our events each year" },
  { value: "1,500+", label: "Attendees at a single event" },
  { value: "6", label: "Countries: US, UK, Spain, UAE, Mexico, Costa Rica" },
  { value: "2017", label: "Founded" },
]

/* ── 05 · SELECTED WORK ───────────────────────────────────────────────── */
export const WORK = {
  eyebrow: "Selected Work",
  title: V("Rooms we've engineered.", "Rooms we've engineered."),
  index: V("Full Index →", "Full Index →"),
  readMore: V("Read the case study →", "Read the case study →"),
  // PMU World 2023 since 26 Oct 2026, when the Casino Royale case study was
  // withdrawn at Iconic's call. All three figures come from its case study.
  featured: {
    slug: "pmuw-2023",
    label: "Featured",
    meta: "Danny Tran · Seminole Hard Rock · 2023",
    img: "/images/gallery/pmuw-2023/02.webp",
    headline: V("PMU World, the largest in North America on the first try.", "PMU World. The largest in North America, first try."),
    challengeLabel: V("Challenge", "Challenge"),
    challenge: V(
      "A seven month old brand, no attendee list, and an industry that doubted it.",
      "A seven month old brand, no attendee list, and an industry full of doubters."
    ),
    approachLabel: V("Approach", "Approach"),
    approach: V(
      "Two stages run like a music festival, and more than 16 interactive installations built in-house.",
      "Two stages run like a music festival, plus 16+ interactive installations we built ourselves."
    ),
    stats: [
      { value: "800+", label: V("attendees, 600 projected", "attendees vs 600 projected") },
      { value: "#1", label: V("PMU event in North America", "PMU event in North America") },
      { value: "$148K", label: V("saved off contracts", "saved off contracts") },
    ],
    cta: V("Read the case study →", "Read the case study →"),
  },
  archiveLabel: V("More from the archive", "More from the archive"),
  // Each tile uses a photograph from its own case study with the client in
  // it (Iconic's rule): Eddie Maalouf hosting Bad After Dark, Ravi Abuvala
  // on stage at Scaling With Systems LIVE. `imgPos` keeps a face in frame
  // when a tall photo is cropped to a wide card.
  archive: [
    { id: "a1", img: "/images/gallery/bad-after-dark/01.webp", imgPos: "center 52%", name: "Bad After Dark", slug: "bad-after-dark", result: V("$146K sponsorships", "$146K sponsorships"), outcome: V("Partner presence built into the night, not bolted on.", "Partner presence built into the night, not bolted on.") },
    { id: "a3", img: "/images/gallery/scaling-with-systems-live-2021/09.webp", name: "Scaling With Systems LIVE", slug: "scaling-with-systems-live", result: V("Founder-led live summit", "Founder-led live summit"), outcome: V("300 attendees, all home safely.", "300 attendees, all home safely.") },
  ],
}

/* ── 06 · SERVICES (green full-bleed) ─────────────────────────────────── */
export const SERVICES = {
  eyebrow: "Capability",
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
      process: V(
        "We begin at the outcome and reverse-engineer the room — audience psychology, offer economics, and the physics of the space.",
        "We start from the number you need and design the room backwards — psychology, offer, and space, all pointed at the close.",
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
      process: V(
        "Every technical layer is designed, built, and show-called in-house, so each cue lands on the beat it was written for.",
        "We design, build, and show-call every technical layer in-house — so every cue lands exactly on the beat.",
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
      process: V(
        "We capture the night in full and cut it into months of content that keeps working long after the doors close.",
        "We film the whole night and cut it into months of content that keeps selling long after everyone goes home.",
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
      process: V(
        "Crew, vendors, and timeline run under a single command — to the minute, and out of the audience's sight.",
        "Crew, vendors, and timeline run under one command — to the minute, so you never see the seams.",
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
      process: V(
        "Tiers, offers, and the sell-from-stage moment are engineered into the run of show, so the close feels inevitable.",
        "We build the tiers, offers, and the sell-from-stage moment straight into the run of show, so the close feels inevitable.",
      ),
    },
  ],
}

/* ── 07 · SCOPE OF SERVICE ────────────────────────────────────────────── */
/* The services page and the homepage teaser read the six disciplines below.
   `line` is each one in a sentence; `beyond` marks the two a production
   company does not offer, which the page sets apart. The group names and
   items are the client's exact copy. */
export const SCOPE = {
  eyebrow: "Scope of Service",
  title: V("Everything we do. Everything we don't.", "Everything we do. Everything we don't."),
  // Exact client copy — voice-neutral, verbatim in both voices.
  doHead: "What we do",
  doMeta: "6 disciplines · 35+ deliverables",
  doGroups: [
    {
      id: "g1",
      group: "Strategy",
      line: "The room's intent, mapped before a single decision is made.",
      beyond: true,
      items: [
        "Event Vision Brief",
        "Audience journey mapping",
        "Revenue & ticket-tier strategy",
        "Sponsorship architecture",
      ],
    },
    {
      id: "g2",
      group: "Creative",
      line: "Story, set, light and pacing, built as one world your audience steps into.",
      items: [
        "Stage & set design",
        "Lighting psychology",
        "LED environment design",
        "Scenic fabrication",
        "Show flow direction",
      ],
    },
    {
      id: "g3",
      group: "Production",
      line: "Stage, light, sound and scenic, directed as one instrument.",
      items: [
        "Technical direction",
        "Audio engineering",
        "Live video & broadcast",
        "Projection mapping",
        "Crew & vendor management",
      ],
    },
    {
      id: "g4",
      group: "Content",
      line: "One night, captured and cut into a quarter of content.",
      items: [
        "Live content capture",
        "Multi-cam reel production",
        "Social cutdowns & distribution",
        "Speaker reel production",
        "Post-event content packages",
      ],
    },
    {
      id: "g5",
      group: "Operations",
      line: "The logistics run to the minute, and out of sight.",
      items: [
        "Venue sourcing & negotiation",
        "Logistics & timeline management",
        "Vendor coordination",
        "Speaker management",
        "On-site execution",
      ],
    },
    {
      id: "g6",
      group: "Revenue",
      line: "Tiers, offers and the sell-from-stage moment, engineered into the run of show.",
      beyond: true,
      items: [
        "Sell-from-stage coaching",
        "Offer suite design",
        "Sponsorship package design",
        "Conversion environment engineering",
      ],
    },
  ],
  dontHead: "What we don't",
  dontLine: "If you need any of these, we are not your studio.",
  dont: [
    "Weddings, galas, or social events",
    "Trade-show booths or expo activations",
    "Corporate town halls or all-hands",
    "One-off fireside chats or single-day panels",
    "Events under 75 attendees",
    "Events without a sell-from-stage or revenue moment",
    "White-label work for other agencies",
    "Day-of-event coordination without strategy ownership",
  ],
  referralHead: "A note on referrals",
  referral:
    "If your project lives outside our scope, we keep a private list of trusted studios for weddings, corporate, and trade-show work. Ask on the call.",
  // Short, punchy words for the manifesto headline strike-through (the columns
  // carry the full, exact disqualifier list).
  headlineDont: ["weddings", "trade-shows", "town halls", "single-day panels"],
}

/* ── 08 · METHODOLOGY ─────────────────────────────────────────────────── */
export const METHOD = {
  eyebrow: "Methodology",
  title: V("The Iconic Standard.", "The Iconic Standard."),
  sub: V(
    "Five phases, one operating system, applied to every room.",
    "Five phases, one operating system, run on every room."
  ),
  phases: [
    {
      id: "m1", num: "I", name: V("Insight", "Insight"), img: "/images/gallery/insight.webp",
      body: V("Audience psychology, offer economics, room physics.", "Audience psychology, offer economics, room physics."),
      detail: V(
        "Before a single element is designed, we study who is in the room and why they came — their beliefs, their objections, the economics of the offer, and the physics of the space itself. Every decision that follows traces back to what we learn here.",
        "Before we design a single element, we study who's in your room and why they showed up — their beliefs, their objections, the math of your offer, and the space itself. Every decision that follows is built on it.",
      ),
    },
    {
      id: "m2", num: "II", name: V("Strategy", "Strategy"), img: "/images/gallery/strategy.webp",
      body: V("A revenue-first blueprint; every sell-from-stage moment mapped.", "A revenue-first blueprint; every sell-from-stage moment mapped."),
      detail: V(
        "The insight becomes a revenue-first blueprint: the arc of the day, the tier structure, and the exact moments the room is asked to decide. Nothing on stage is left to improvisation.",
        "That insight becomes a revenue-first blueprint — the arc of the day, your tier structure, and the exact moments you ask the room to buy. Nothing on stage is left to chance.",
      ),
    },
    {
      id: "m3", num: "III", name: V("Creative", "Creative"), img: "/images/gallery/creative.webp",
      body: V("Story, room, rhythm — the world the audience lives in.", "Story, room, rhythm — the world your audience lives in."),
      detail: V(
        "Story, set, light, and pacing are composed into a single world the audience steps inside. The creative is never decoration — it is built to carry the message and hold attention all the way to the close.",
        "Story, set, light, and pacing come together into one world your audience steps into. The creative isn't decoration — it's engineered to carry your message and hold the room to the close.",
      ),
    },
    {
      id: "m4", num: "IV", name: V("Production", "Production"), img: "/images/gallery/production.webp",
      body: V("Stage, light, sound, scenic in-house. No vendor seams.", "Stage, light, sound, scenic in-house. No vendor seams."),
      detail: V(
        "Stage, light, sound, and scenic are engineered and operated by one team, in-house. The room runs to the second, and there are no vendor seams for the audience to feel.",
        "Stage, light, sound, and scenic are built and run by one in-house team. The room runs to the second, with no vendor seams for your audience to feel.",
      ),
    },
    {
      id: "m5", num: "V", name: V("Amplification", "Amplification"), img: "/images/gallery/amplification.webp",
      body: V("Capture, edit, distribute — a quarter of content from one night.", "Capture, edit, distribute — a quarter of content from one night."),
      detail: V(
        "The night is captured in full and cut into a quarter of content — keynotes, reels, and social edits that keep working long after the doors close. One room becomes months of reach.",
        "We capture the whole night and cut it into a quarter of content — keynotes, reels, and social edits that keep selling long after the doors close. One room becomes months of reach.",
      ),
    },
  ],
}

/* ── 09 · RECEIPTS ────────────────────────────────────────────────────── */
export const RECEIPTS = {
  eyebrow: "Receipts",
  title: V("The only numbers that matter.", "The only numbers that matter."),
  stats: [
    { id: "n1", value: "$1.8M", img: "/images/gallery/g32.webp", label: V("membership, from 150 seats", "membership from 150 seats") },
    { id: "n2", value: "$146K", img: "/images/gallery/g34.webp", label: V("sponsorship, in six days", "sponsorship in 6 days") },
    { id: "n3", value: "40+", img: "/images/gallery/g25.webp", label: V("rooms engineered", "rooms engineered") },
    { id: "n4", value: "100%", img: "/images/gallery/g24.webp", imgPos: "center 52%", label: V("2024 events sold out", "2024 events sold out") },
  ],
}

/* ── 10 · VIDEO TESTIMONIALS ──────────────────────────────────────────── */
export const TESTIMONIALS = {
  eyebrow: "From the Host",
  title: V("They sold from our rooms. Hear them say so.", "They sold from our rooms. Hear it from them."),
  items: [
    { id: "t1", img: "/images/clients/ben-newman.webp", duration: "00:42", name: "Ben Newman", role: V("Palms Casino Resort", "Palms Casino Resort"), quote: V("“The room did what a year of marketing couldn't.”", "“The room did what a year of marketing couldn't.”") },
    { id: "t2", img: "/images/clients/ali-awad.webp", duration: "01:18", name: "Ali Awad", role: V("The CEO Lawyer Summit", "The CEO Lawyer Summit"), quote: V("“They engineered the room to close. It closed.”", "“They engineered the room to close. It closed.”") },
    { id: "t3", img: "/images/clients/eddie-maalouf.webp", duration: "00:56", name: "Eddie Maalouf", role: V("Bad After Dark", "Bad After Dark"), quote: V("“$146K in six days. From one night.”", "“$146K in 6 days. From one night.”") },
  ],
}

/* ── 11 · NICHE (green full-bleed close) ──────────────────────────────── */
export const NICHE = {
  eyebrow: "The Uncontested Room",
  title: V("Built for founders. Not for brands.", "Built for founders. Not for brands."),
  body: V(
    "Every major experience agency chases Fortune 500 budgets. We do not. We engineer live events for coaches, creators, and founder-led businesses — operators who need the room to produce revenue, not applause. No one else builds for it. It is the only room we build.",
    "Every major experience agency chases Fortune 500 budgets. We don't. We build live events for coaches, creators, and founder-led businesses — operators who need the room to generate revenue, not applause. Nobody else builds for it. It's the only room we build."
  ),
  seal: "IE · EST · MMXVII",
}

/* ── 12 · CTA FORM ────────────────────────────────────────────────────── */
export const CTA = {
  eyebrow: "Start a Conversation",
  title: V("Tell us about the room you want to build.", "Tell us about the room you want to build."),
  formLead: V(
    "A minute of answers, and a senior director will take it from there.",
    "A minute of answers, and a senior director will take it from there. No pitch decks, just the conversation."
  ),
  stats: [
    { id: "c1", value: "30", label: V("minutes with a senior director", "minutes with a senior director") },
    { id: "c2", value: "48", label: V("hours to respond, every time", "hours to respond, every time") },
    { id: "c3", value: "0", label: V("pitch decks — just the conversation", "pitch decks — just the conversation") },
  ],
  form: {
    /* Every choice is required and none is pre-selected, so an answer in the
       inbox is always one the visitor actually picked. */
    eventLabel: "What's the event?",
    events: [
      "Client summit or conference",
      "Launch",
      "Retreat or mastermind",
      "Customer or VIP event",
      "Not sure yet",
    ],
    guestsLabel: "How many guests?",
    guests: ["Under 50", "50 to 150", "150 to 500", "500+"],
    budgetLabel: "Event budget",
    budgets: ["Under $50k", "$50k to $150k", "$150k to $500k", "$500k+", "I don't know yet"],
    timingLabel: "When is the room?",
    timings: ["Within 3 months", "3 to 6 months", "6 to 12 months", "Just exploring"],
    notesLabel: "Anything else we should know?",
    notesPlaceholder: V(
      "What the room has to achieve, where you need support, what is already in place.",
      "What the room needs to do, where you need a hand, what's already sorted."
    ),
    submit: V("Start a conversation", "Book the call"),
    sending: V("Sending…", "Locking it in…"),
    reassurance: V(
      "We respond within 48 hours. If we are not the right fit, we will tell you on the first call.",
      "We respond within 48 hours. If we're not the right fit, we'll tell you on the first call."
    ),
  },
}

/* ── FOOTER ───────────────────────────────────────────────────────────── */
export const FOOTER = {
  line: V("Experience engineers. Est. 2017.", "Experience engineers for the creator economy. Est. 2017."),
  columns: [
    // Every item links to a page of its own, the same set as the header.
    {
      id: "col1",
      head: "Explore",
      items: [
        { label: "Services", href: "/services" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Gallery", href: "/gallery" },
        { label: "Reviews", href: "/reviews" },
      ],
    },
    {
      id: "col2",
      head: "Contact",
      // The address is deliberately not printed here: a mailto in the footer of
      // every page is the easiest thing on the site to scrape. The form reaches
      // the same inbox. CONTACT_EMAIL is still the fallback when a submission
      // fails (see src/lib/enquiry.js).
      items: [
        { label: "Start a conversation", href: "/contact" },
        { label: "Vendor sign-up", href: "/vendors" },
        { label: "(305) 791-5290", href: "tel:+13057915290" },
        "Miami · Las Vegas",
      ],
    },
    // Iconic's company profiles, the same as sameAs in index.html. Vimeo was
    // listed here with no link and no account found, so it came out.
    {
      id: "col3",
      head: "Follow",
      items: [
        { label: "Instagram", href: "https://www.instagram.com/iconicbecker", external: true },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/iconiceventsusa", external: true },
        { label: "YouTube", href: "https://www.youtube.com/@iconiceventsUSA", external: true },
      ],
    },
  ],
  tagStrip: "ICONIC · EXPERIENCE · ENGINEERED",
  legal: "© 2026 Iconic Events LLC",
  ip: "This page is the exclusive intellectual property of Iconic Events LLC. Unauthorized reproduction, distribution, or modification is prohibited. All rights reserved.",
}
