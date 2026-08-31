/* ═══════════════════════════════════════════════════════════════════════
   CASE STUDIES — one object per event, one dedicated page each.

   ADDING A NEW EVENT (the whole process):

   1. Add an object to CASE_STUDIES below. Copy the shape of an existing
      entry; every field is described in the comment block above the array.
      The `slug` becomes the URL: /case-studies/<slug>.
   2. Add the matching tile to WORK.archive in src/content.js with the SAME
      `slug`, so it is listed under "02 · Selected Work" on the lander.
      (Lander tiles keep their V() dual-voice copy; case-study pages are
      Iconic voice only, matching how the page already behaved.)
   3. Drop the event's photography in public/images/gallery/ and reference
      it from `heroImg`, `result.img`, and `gallery`.

   That is it — routing, the archive strip on sibling pages, and the "next
   room" links all pick the new event up automatically.

   FIELDS
   slug        URL segment. Lowercase, hyphenated, never changes once live.
   caseNumber  Displayed as "Case 001". Ordering label only.
   name        Event name, used in headings and alt text.
   client      Founder / host name.
   venue,year  Shown in the hero meta line. Leave "" if not public.
   heroImg     Full-bleed hero image.
   title       Hero headline, line one (the event name, with a full stop).
   subtitle    Hero headline, line two (what the room was built to do).
   brief       One large pull-quote paragraph: the situation.
   challenge   What the room had to overcome.
   approach    What we built.
   stats       Up to three { value, label } pairs. Only verified numbers.
   result      { headline, body, img } — the split result panel.
   gallery     [{ src, alt }] frames for the lightbox gallery.
   methodIntro One line framing the five-decision sequence for this event.
   ═══════════════════════════════════════════════════════════════════════ */

export const CASE_STUDIES = [
  {
    slug: "casino-royale",
    caseNumber: "Case 001",
    name: "Casino Royale",
    client: "Ben Newman",
    venue: "Palms Casino Resort",
    year: "2023",
    heroImg: "/images/gallery/g9.webp",
    title: "Casino Royale.",
    subtitle: "Built to sell from the stage.",
    brief:
      "A five-year wait. A new membership tier. One room tasked with making the decision feel inevitable.",
    challenge:
      "The audience knew the host and the offer. The event had to turn familiarity into renewed attention, then give the new membership tier a setting worthy of the decision.",
    approach:
      "We built a 007 Casino Royale world at the Palms—projection-mapped, tightly choreographed, and paced around the close. Production and psychology worked as one system.",
    stats: [
      { value: "$1.8M", label: "membership sales" },
      { value: "150", label: "attendees" },
      { value: "100%", label: "2024 sold out" },
    ],
    result: {
      headline: "$1.8M from 150 seats.",
      body:
        "The new tier sold from the stage. The following year sold out. The room did the work it was built to do.",
      img: "/images/gallery/g31.webp",
    },
    gallery: [
      { src: "/images/gallery/g9.webp", alt: "Casino Royale room set at the Palms" },
      { src: "/images/gallery/g31.webp", alt: "Casino Royale production detail" },
      { src: "/images/gallery/g32.webp", alt: "Casino Royale stage during the close" },
      { src: "/images/gallery/g24.webp", alt: "Casino Royale table setting" },
      { src: "/images/gallery/g34.webp", alt: "Casino Royale guests at the gaming floor" },
      { src: "/images/gallery/g25.webp", alt: "Casino Royale lighting and projection" },
    ],
    methodIntro:
      "Casino Royale moved through one continuous operating sequence—from audience insight to the content captured after the close.",
  },

  {
    slug: "bad-after-dark",
    caseNumber: "Case 002",
    name: "Bad After Dark",
    client: "Eddie Maalouf",
    // TODO(copy): confirm venue and year with the client before launch.
    venue: "",
    year: "",
    heroImg: "/images/gallery/g28.webp",
    title: "Bad After Dark.",
    subtitle: "Restraint on the surface, revenue underneath.",
    brief:
      "An evening built to look effortless, and engineered to return sponsorship revenue inside a single week.",
    challenge:
      "Sponsorship had to be earned rather than sold. The room needed to feel like an invitation, not an activation—while still giving partners a return they could measure.",
    approach:
      "We designed an evening of deliberate restraint: a tightly held guest list, a single unbroken atmosphere, and partner presence woven into the room instead of bolted onto it.",
    stats: [
      { value: "$146K", label: "sponsorship returned" },
      { value: "6", label: "days to close" },
      // TODO(copy): add attendee count if it is public.
    ],
    result: {
      headline: "$146K in six days.",
      body:
        "An evening that returned $146K in sponsorship inside six days. Restraint on the surface, revenue underneath.",
      img: "/images/gallery/g33.webp",
    },
    gallery: [
      { src: "/images/gallery/g28.webp", alt: "Bad After Dark room at capacity" },
      { src: "/images/gallery/g33.webp", alt: "Bad After Dark lighting detail" },
      { src: "/images/gallery/g35.webp", alt: "Bad After Dark guests through the evening" },
    ],
    methodIntro:
      "Bad After Dark ran on the same five-decision sequence—every choice measured against the revenue the evening had to return.",
  },

  {
    slug: "ceo-lawyer-summit",
    caseNumber: "Case 003",
    name: "The CEO Lawyer Summit",
    client: "Ali Awad",
    // TODO(copy): confirm venue and year.
    venue: "",
    year: "",
    heroImg: "/images/gallery/g13.webp",
    title: "The CEO Lawyer Summit.",
    subtitle: "A $25K offer, sold without pressure.",
    brief:
      "A room engineered to sell a $25K offer without a hint of pressure. The close was written into the choreography.",
    challenge:
      "A high-ticket offer to an audience of professionals who negotiate for a living. Any pressure in the room would read instantly, and cost the close.",
    approach:
      "We wrote the close into the choreography rather than the script—sequencing authority, proof, and quiet permission so the decision arrived as the audience's own.",
    stats: [
      { value: "$25K+", label: "average ticket" },
      // TODO(copy): add total revenue and attendee count if they can be published.
    ],
    result: {
      headline: "$25K+ average ticket.",
      body:
        "The offer sold at a $25K+ average ticket, in a room where nothing ever felt like a pitch.",
      img: "/images/gallery/g16.webp",
    },
    gallery: [
      { src: "/images/gallery/g13.webp", alt: "The CEO Lawyer Summit main room" },
      { src: "/images/gallery/g16.webp", alt: "The CEO Lawyer Summit stage" },
      { src: "/images/gallery/g19.webp", alt: "The CEO Lawyer Summit audience" },
    ],
    methodIntro:
      "The summit moved through the five-decision sequence with the close as the fixed point every other decision answered to.",
  },

  {
    slug: "scaling-with-systems-live",
    caseNumber: "Case 004",
    name: "Scaling With Systems LIVE",
    client: "Ravi Abuvala",
    // TODO(copy): confirm venue and year.
    venue: "",
    year: "",
    heroImg: "/images/gallery/g26.webp",
    title: "Scaling With Systems LIVE.",
    subtitle: "One continuous audience journey.",
    brief:
      "A founder-led live summit shaped as one continuous audience journey—from arrival through the final moment on stage.",
    challenge:
      "A multi-session summit risks becoming a schedule rather than an experience. Attention had to carry across the full run without a single flat stretch.",
    approach:
      "We shaped the event as one journey instead of a programme: arrival, pacing, and every production decision working toward the moments that mattered on stage.",
    stats: [
      // TODO(copy): supply verified figures — attendees, revenue, retention.
    ],
    result: {
      headline: "A summit that held the room.",
      body:
        "Every production decision worked toward the moments that mattered on stage, and the audience journey held from arrival to close.",
      img: "/images/gallery/g22.webp",
    },
    gallery: [
      { src: "/images/gallery/g26.webp", alt: "Scaling With Systems LIVE main stage" },
      { src: "/images/gallery/g22.webp", alt: "Scaling With Systems LIVE audience" },
      { src: "/images/gallery/g23.webp", alt: "Scaling With Systems LIVE production detail" },
    ],
    methodIntro:
      "The summit ran the five-decision sequence end to end, with the audience journey as the through-line.",
  },

  {
    slug: "viral-ecom-adz",
    caseNumber: "Case 005",
    name: "Viral Ecom Adz",
    // TODO(copy): confirm host name, venue, and year — no detail on file yet.
    client: "",
    venue: "",
    year: "",
    heroImg: "/images/gallery/g3.webp",
    title: "Viral Ecom Adz.",
    subtitle: "A six-figure sponsorship room.",
    // TODO(copy): this event has the least on file. Replace brief, challenge,
    // and approach with the real account before launch.
    brief:
      "A room built to carry six figures of sponsorship without ever feeling sponsored.",
    challenge:
      "Partner revenue at six figures, in a room whose audience came for the content rather than the brands.",
    approach:
      "We built partner presence into the architecture of the evening, so sponsorship read as part of the experience instead of an interruption to it.",
    stats: [
      { value: "6-figure", label: "sponsorship" },
      // TODO(copy): supply exact figure, attendees, and year if publishable.
    ],
    result: {
      headline: "Six-figure sponsorship.",
      body:
        "The room carried six figures of partner revenue while keeping the audience's attention on the stage.",
      img: "/images/gallery/g2.webp",
    },
    gallery: [
      { src: "/images/gallery/g3.webp", alt: "Viral Ecom Adz room" },
      { src: "/images/gallery/g2.webp", alt: "Viral Ecom Adz stage" },
      { src: "/images/gallery/g6.webp", alt: "Viral Ecom Adz production detail" },
    ],
    methodIntro:
      "The same five-decision sequence, applied to a room where partner revenue and audience attention had to hold together.",
  },

  {
    slug: "chase-hughes-london",
    caseNumber: "Case 006",
    name: "Chase Hughes — London",
    client: "Chase Hughes",
    venue: "HMS Belfast, River Thames",
    // TODO(copy): confirm year.
    year: "",
    heroImg: "/images/gallery/g30.webp",
    title: "Chase Hughes, London.",
    subtitle: "A warship staged as a room.",
    brief:
      "A bespoke build aboard HMS Belfast on the Thames—a warship staged as a room, to the last rivet.",
    challenge:
      "A heritage warship is not a venue. Every sightline, power run, and load-in path had to be engineered around a structure that could not be altered.",
    approach:
      "We built the room into the ship rather than over it—staging, lighting, and flow designed to the vessel's own geometry, down to the last rivet.",
    stats: [
      // TODO(copy): supply verified figures — attendees, revenue.
    ],
    result: {
      headline: "The room was the ship.",
      body:
        "A bespoke build aboard HMS Belfast, staged end to end for one night on the Thames.",
      img: "/images/gallery/g8.webp",
    },
    gallery: [
      { src: "/images/gallery/g30.webp", alt: "HMS Belfast build on the River Thames" },
      { src: "/images/gallery/g8.webp", alt: "Chase Hughes London staging detail" },
    ],
    methodIntro:
      "Five decisions, made against a venue that could not be changed—only understood.",
  },
]

/* Slug → study lookup, used by the router in src/main.jsx. */
export const CASE_STUDY_BY_SLUG = Object.fromEntries(
  CASE_STUDIES.map((study) => [study.slug, study])
)

/* Resolve a pathname like "/case-studies/casino-royale" to a study.
   Returns null for an unknown slug so the page can render a real not-found
   state instead of silently serving the wrong event. */
export function caseStudyFromPath(pathname) {
  const slug = pathname.replace(/^\/case-studies\/?/, "").replace(/\/+$/, "")
  return CASE_STUDY_BY_SLUG[slug] ?? null
}

/* Sibling events for the "next room" strip, in order, current one removed. */
export function otherCaseStudies(slug, limit = 4) {
  return CASE_STUDIES.filter((study) => study.slug !== slug).slice(0, limit)
}

/* Dev-only guard: every lander tile in WORK must have a case study behind it,
   so a new event can never be listed with a dead link. Runs in `npm run dev`
   only and is stripped from the production build. */
export function assertLanderSlugsResolve(work) {
  const listed = [work.featured, ...work.archive]
  const missing = listed.filter((tile) => !tile.slug || !CASE_STUDY_BY_SLUG[tile.slug])
  if (missing.length) {
    console.warn(
      "[case-studies] These lander tiles have no case study on file: " +
        missing.map((tile) => tile.name ?? tile.label ?? "(unnamed)").join(", ") +
        ". Add an object to src/case-studies.js with a matching slug."
    )
  }
}
