/* ═══════════════════════════════════════════════════════════════════════
   CASE STUDIES — one object per event, one dedicated page each.

   THE FORMULA (settled; don't drift from it without a decision)

   Page order:  hero (title over image) · summary · challenge + photo
                · approach in three stages · scope of services
                · full bleed photo · results (3 metrics) + event details
                · two photos · Event Aftermovie · "What <client> had to
                say about working with us" · gallery · FAQ · citation
                · related cases

   House rules, enforced by this file and CaseStudyPage.jsx:
   1. Only three metrics are ever published: attendance, days of
      production, cost saved for the client. No client revenue, no
      sponsorship dollars, no revenue per seat, no lead count, no repeat
      booking.
   2. No budget figure or range is ever published. There is no field for it.
   3. Nothing is estimated. A null renders as nothing, never as a guess.
   4. A quote renders only when `approved` is true. Unapproved or sample
      copy never reaches the page, and Review schema never ships without it.
   5. No em dashes in published copy.

   ADDING AN EVENT
   1. Add an object below. Copy the shape; every field is described in
      FIELDS. The slug becomes /case-studies/<slug> and never changes once
      it is live and indexed.
   2. Add the matching tile to WORK.archive in src/content.js with the SAME
      slug, so it is listed under "02 · Selected Work". Lander tiles keep
      their V() dual-voice copy; case study pages are Iconic voice only.
   3. Put photography in public/images/gallery/ and reference it from
      `media`. Eight positions, listed in FIELDS.

   FIELDS
   slug         URL segment, lowercase and hyphenated.
   caseNumber   "Case 001". Ordering label only.
   name         Event name.
   headline     Results first: "How <client> <result> at <event>".
   summary      50 to 100 words. The block answer engines lift verbatim.
   challenge    2 to 4 sentences, plainly stated.
   approach     { pre, onsite, post } arrays of strings. Rendered as one
                continuously numbered list across the three stages.
   scope        [[label, description]] for the Scope of Services block.
   metrics      { attendance, productionDays, costSaved } strings or null.
   details      { client, clientTitle, venue, city, region, year, dates }.
   media        hero, challenge, band, resultLeft, resultRight: {src, alt}
                or null. gallery: array of {src, alt}, normally three.
                aftermovieUrl, testimonialUrl: YouTube or Vimeo watch links.
   testimonial  { quote, approved }. Renders only when approved is true.
   faqExtra     Optional [[q, a]] beyond the generated set.
   citation     One sentence naming client, event, venue, city and scope.
   ═══════════════════════════════════════════════════════════════════════ */

export const CASE_STUDIES = [
  {
    slug: "casino-royale",
    caseNumber: "Case 001",
    name: "Casino Royale",
    headline:
      "How Ben Newman Filled 150 Seats at Casino Royale and Saved $100K in Production",
    summary:
      "Ben Newman returned to live events after a five year gap and needed a room built around a single decision. Iconic Events, a Florida based event production and coordination company, held strategy, creative direction, production, show flow and on site execution as one scope, converting Palms Casino Resort in Las Vegas into a projection mapped Casino Royale build for 150 guests across three days of production. Consolidating the work under one accountable team saved the client $100,000 against a multi vendor build.",
    challenge:
      "Ben Newman had not held a live event in five years, and he was bringing a new membership tier to an audience that already knew both him and his offer. Familiarity was the problem: the room had to renew attention rather than introduce anything. The new tier also needed a setting that made a high value commitment feel proportionate to the decision being asked for.",
    approach: {
      pre: [
        "Fixed the commercial outcome first: sell the new membership tier from the stage, not by follow up.",
        "Mapped the audience's existing relationship to host and offer, to locate where attention would drop.",
        "Set capacity against the commercial objective rather than a headcount target, landing on 150 seats.",
        "Fixed the moment of the close, then sequenced every other decision backward from it.",
        "Built the Casino Royale world as one continuous environment, so the theme carried the evening instead of decorating it.",
      ],
      onsite: [
        "Projection mapped the venue to convert the Palms space into the themed build.",
        "Choreographed pacing, lighting and stage transitions toward the decision point.",
        "Ran show calling and on site execution with the same team that designed the room.",
      ],
      post: [
        "Captured content through the evening for use after the close, including the following year's launch.",
      ],
    },
    scope: [
      ["Strategy", "Commercial objective, audience mapping, capacity and format set against the outcome."],
      ["Creative", "Theme concept and creative direction, built as one continuous environment."],
      ["Production", "Projection mapping, lighting, staging and the full technical build."],
      ["Show flow", "Run of show, pacing and choreography, written around the decision point."],
      ["On site", "Show calling and execution by the same team that designed the room."],
      ["Content", "Capture through the evening for use after the close."],
    ],
    metrics: { attendance: "150", productionDays: "3", costSaved: "$100,000" },
    details: {
      client: "Ben Newman",
      // TODO(confirm): exact job title and company, currently assumed.
      clientTitle: "Founder, Ben Newman Companies",
      venue: "Palms Casino Resort",
      city: "Las Vegas",
      region: "NV",
      year: "2023",
      dates: null, // TODO(confirm): exact dates, ISO 8601, for Event schema.
    },
    media: {
      hero: null, // TODO(shoot): room at capacity, 16:9, 2400x1350, lower third clear of faces.
      challenge: { src: "/images/gallery/g34.webp", alt: "Guests at the gaming tables during Casino Royale at Palms Casino Resort in Las Vegas" },
      band: { src: "/images/gallery/g31.webp", alt: "Projection mapped walls and gold accent lighting in the Casino Royale build at Palms Casino Resort" },
      resultLeft: { src: "/images/gallery/g32.webp", alt: "Ben Newman on stage at Casino Royale at Palms Casino Resort, Las Vegas, introducing the new membership tier" },
      resultRight: null, // TODO(shoot): room wide enough to read 150 seats, 4:3.
      gallery: [
        { src: "/images/gallery/g9.webp", alt: "Casino Royale themed room set at Palms Casino Resort in Las Vegas, produced by Iconic Events" },
        { src: "/images/gallery/g24.webp", alt: "Table setting and gaming floor styling at Casino Royale, a Ben Newman event" },
        { src: "/images/gallery/g25.webp", alt: "Lighting and projection design at Casino Royale, Palms Casino Resort, Las Vegas" },
      ],
      aftermovieUrl: "https://www.youtube.com/watch?v=CmrSzYrgTWY",
      // TODO(confirm): sent as "a link for us"; confirm it is the testimonial and not the aftermovie.
      testimonialUrl: "https://www.youtube.com/watch?v=3XTRiuOMD4k",
    },
    testimonial: {
      // Sample copy written to size the layout. NOT Ben Newman's words.
      // approved stays false, so nothing renders and Review schema is held.
      quote:
        "I came to them with a room I had waited five years to fill and no real idea how to make it feel like an event again. They took the concept, the build and the run of show, and on the night I walked in and did my part. One team, one person to call.",
      approved: false,
    },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Casino Royale for Ben Newman at Palms Casino Resort in Las Vegas, Nevada, delivering strategy, creative direction, projection mapped production, show flow and on site execution for a 150 guest room across three days, saving the client $100,000 against a multi vendor build.",
  },

  {
    slug: "bad-after-dark",
    caseNumber: "Case 002",
    name: "Bad After Dark",
    headline: "How Eddie Maalouf Built Bad After Dark With One Accountable Team",
    summary:
      "Eddie Maalouf needed an evening that looked effortless and still did commercial work for its partners. Iconic Events, a Florida based event production and coordination company, held strategy, creative direction, production, show flow and on site execution as one scope, designing a tightly held room where partner presence was built into the architecture of the night rather than bolted onto it.",
    challenge:
      "Sponsorship had to be earned rather than sold. The room needed to feel like an invitation, not an activation, while still giving partners a return they could measure.",
    approach: {
      pre: [
        "Set the guest list and room size against what the evening had to return, not a headcount target.",
        "Designed partner presence into the environment before any creative was signed off.",
      ],
      onsite: [
        "Built and ran a single unbroken atmosphere across the evening.",
        "Ran show calling and on site execution with the same team that designed the room.",
      ],
      post: [], // TODO(copy): what was delivered after the event.
    },
    scope: [
      ["Strategy", "Objective, guest list and format set against what the evening had to return."],
      ["Creative", "Creative direction for a single continuous atmosphere."],
      ["Production", "Lighting, staging and technical build."],
      ["On site", "Show calling and execution by the design team."],
    ],
    // TODO(collect): all three metrics.
    metrics: { attendance: null, productionDays: null, costSaved: null },
    details: {
      client: "Eddie Maalouf",
      clientTitle: null,
      venue: null,
      city: null,
      region: null,
      year: null,
      dates: null,
    },
    media: {
      hero: null,
      challenge: null,
      band: { src: "/images/gallery/g28.webp", alt: "Bad After Dark room at capacity" },
      resultLeft: { src: "/images/gallery/g33.webp", alt: "Lighting detail at Bad After Dark" },
      resultRight: null,
      gallery: [
        { src: "/images/gallery/g35.webp", alt: "Guests through the evening at Bad After Dark" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Bad After Dark for Eddie Maalouf, delivering strategy, creative direction, production and on site execution as a single scope.",
  },

  {
    slug: "ceo-lawyer-summit",
    caseNumber: "Case 003",
    name: "The CEO Lawyer Summit",
    headline: "How Ali Awad Sold a $25K Offer Without Pressure at The CEO Lawyer Summit",
    summary:
      "Ali Awad needed to present a high value offer to an audience of professionals who negotiate for a living. Iconic Events, a Florida based event production and coordination company, held strategy, creative direction, production, show flow and on site execution as one scope, writing the close into the choreography of the room rather than into the script.",
    challenge:
      "A high ticket offer to a room of lawyers. Any pressure in the room would read instantly, and cost the close.",
    approach: {
      pre: [
        "Fixed the moment of the close, then sequenced authority and proof backward from it.",
        "Mapped where a professional audience would resist, and designed around it.",
      ],
      onsite: [
        "Ran a room where the sequence, not the script, carried the decision.",
        "Ran show calling and on site execution with the same team that designed the room.",
      ],
      post: [],
    },
    scope: [
      ["Strategy", "Objective, audience mapping and format set against the close."],
      ["Creative", "Creative direction and room design."],
      ["Show flow", "Run of show and choreography built around the decision point."],
      ["On site", "Show calling and execution by the design team."],
    ],
    metrics: { attendance: null, productionDays: null, costSaved: null },
    details: {
      client: "Ali Awad",
      clientTitle: null,
      venue: null,
      city: null,
      region: null,
      year: null,
      dates: null,
    },
    media: {
      hero: null,
      challenge: null,
      band: { src: "/images/gallery/g13.webp", alt: "The CEO Lawyer Summit main room" },
      resultLeft: { src: "/images/gallery/g16.webp", alt: "The CEO Lawyer Summit stage" },
      resultRight: null,
      gallery: [
        { src: "/images/gallery/g19.webp", alt: "The CEO Lawyer Summit audience" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced The CEO Lawyer Summit for Ali Awad, delivering strategy, creative direction, show flow and on site execution as a single scope.",
  },

  {
    slug: "scaling-with-systems-live",
    caseNumber: "Case 004",
    name: "Scaling With Systems LIVE",
    headline: "How Ravi Abuvala Held a Room Across a Full Multi Session Summit",
    summary:
      "Ravi Abuvala needed a multi session summit to hold attention across its full run. Iconic Events, a Florida based event production and coordination company, held strategy, creative direction, production, show flow and on site execution as one scope, shaping the event as one continuous audience journey from arrival through the final moment on stage.",
    challenge:
      "A multi session summit risks becoming a schedule rather than an experience. Attention had to carry across the full run without a flat stretch.",
    approach: {
      pre: [
        "Shaped the event as one journey rather than a programme of sessions.",
        "Set arrival, pacing and session order against where attention would drop.",
      ],
      onsite: [
        "Ran production decisions toward the moments that mattered on stage.",
        "Ran show calling and on site execution with the same team that designed the room.",
      ],
      post: [],
    },
    scope: [
      ["Strategy", "Audience journey and session order set against attention."],
      ["Creative", "Creative direction across the full run."],
      ["Production", "Staging, lighting and technical build."],
      ["Show flow", "Run of show and pacing across multiple sessions."],
      ["On site", "Show calling and execution by the design team."],
    ],
    metrics: { attendance: null, productionDays: null, costSaved: null },
    details: {
      client: "Ravi Abuvala",
      clientTitle: null,
      venue: null,
      city: null,
      region: null,
      year: null,
      dates: null,
    },
    media: {
      hero: null,
      challenge: null,
      band: { src: "/images/gallery/g26.webp", alt: "Scaling With Systems LIVE main stage" },
      resultLeft: { src: "/images/gallery/g22.webp", alt: "Scaling With Systems LIVE audience" },
      resultRight: null,
      gallery: [
        { src: "/images/gallery/g23.webp", alt: "Production detail at Scaling With Systems LIVE" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Scaling With Systems LIVE for Ravi Abuvala, delivering strategy, creative direction, production, show flow and on site execution as a single scope.",
  },

  {
    slug: "viral-ecom-adz",
    caseNumber: "Case 005",
    name: "Viral Ecom Adz",
    // TODO(copy): least detail on file of the six. Replace headline, summary,
    // challenge and approach with the real account before publication.
    headline: "How Viral Ecom Adz Carried Partner Revenue Without Feeling Sponsored",
    summary:
      "Viral Ecom Adz needed a room that carried significant partner revenue while keeping an audience that came for the content. Iconic Events, a Florida based event production and coordination company, held creative direction, production and on site execution as one scope, building partner presence into the architecture of the evening.",
    challenge:
      "Partner revenue in a room whose audience came for the content rather than the brands.",
    approach: {
      pre: ["Designed partner presence into the structure of the evening rather than around it."],
      onsite: ["Ran production and on site execution with the same team that designed the room."],
      post: [],
    },
    scope: [
      ["Creative", "Creative direction and room design."],
      ["Production", "Staging, lighting and technical build."],
      ["On site", "Show calling and execution by the design team."],
    ],
    metrics: { attendance: null, productionDays: null, costSaved: null },
    details: {
      client: null, // TODO(confirm): host name.
      clientTitle: null,
      venue: null,
      city: null,
      region: null,
      year: null,
      dates: null,
    },
    media: {
      hero: null,
      challenge: null,
      band: { src: "/images/gallery/g3.webp", alt: "Viral Ecom Adz room" },
      resultLeft: { src: "/images/gallery/g2.webp", alt: "Viral Ecom Adz stage" },
      resultRight: null,
      gallery: [
        { src: "/images/gallery/g6.webp", alt: "Production detail at Viral Ecom Adz" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Viral Ecom Adz, delivering creative direction, production and on site execution as a single scope.",
  },

  {
    slug: "chase-hughes-london",
    caseNumber: "Case 006",
    name: "Chase Hughes, London",
    headline: "How Chase Hughes Staged a Room Aboard HMS Belfast in London",
    summary:
      "Chase Hughes needed a room on a heritage warship moored on the Thames. Iconic Events, a Florida based event production and coordination company, held creative direction, production, show flow and on site execution as one scope, building the event into the geometry of HMS Belfast rather than over it.",
    challenge:
      "A heritage warship is not a venue. Every sightline, power run and load in path had to be engineered around a structure that could not be altered.",
    approach: {
      pre: [
        "Surveyed the vessel and designed staging to its existing geometry.",
        "Planned load in and power around a structure that could not be modified.",
      ],
      onsite: [
        "Built the room into the ship, down to the last rivet.",
        "Ran show calling and on site execution with the same team that designed the room.",
      ],
      post: [],
    },
    scope: [
      ["Creative", "Creative direction designed to the vessel's own geometry."],
      ["Production", "Staging, lighting, power and load in on a heritage structure."],
      ["Show flow", "Run of show across a non standard space."],
      ["On site", "Show calling and execution by the design team."],
    ],
    metrics: { attendance: null, productionDays: null, costSaved: null },
    details: {
      client: "Chase Hughes",
      clientTitle: null,
      venue: "HMS Belfast, River Thames",
      city: "London",
      region: null,
      year: null,
      dates: null,
    },
    media: {
      hero: null,
      challenge: null,
      band: { src: "/images/gallery/g30.webp", alt: "HMS Belfast build on the River Thames for Chase Hughes" },
      resultLeft: { src: "/images/gallery/g8.webp", alt: "Staging detail aboard HMS Belfast, London" },
      resultRight: null,
      gallery: [],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Chase Hughes London aboard HMS Belfast on the River Thames, delivering creative direction, production, show flow and on site execution as a single scope.",
  },
]

export const CASE_STUDY_BY_SLUG = Object.fromEntries(
  CASE_STUDIES.map((study) => [study.slug, study])
)

/* Resolve "/case-studies/casino-royale" to a study, or null for an unknown
   slug so the page can render a real not-found state. */
export function caseStudyFromPath(pathname) {
  const slug = pathname.replace(/^\/case-studies\/?/, "").replace(/\/+$/, "")
  return CASE_STUDY_BY_SLUG[slug] ?? null
}

export function otherCaseStudies(slug, limit = 4) {
  return CASE_STUDIES.filter((study) => study.slug !== slug).slice(0, limit)
}

/* The three published metrics, in order, skipping any that are not yet known.
   Rule 1 and rule 3 live here: nothing else is ever published as a metric,
   and a null is simply absent. */
export function publishedMetrics(study) {
  return [
    ["Attendance", study.metrics.attendance],
    ["Days of production", study.metrics.productionDays],
    ["Cost saved for the client", study.metrics.costSaved],
  ].filter(([, value]) => Boolean(value))
}

/* Photography positions in page order. Gallery frames are flattened in so a
   single call reports what the page holds and what is still missing. */
export function photoPositions(study) {
  const m = study.media
  const fixed = [
    ["Hero, room at capacity", "16:9", m.hero],
    ["Beside the challenge", "4:5", m.challenge],
    ["Full bleed after the approach", "21:9", m.band],
    ["Under the results, left", "4:3", m.resultLeft],
    ["Under the results, right", "4:3", m.resultRight],
  ]
  const gallery = [0, 1, 2].map((i) => [`Gallery ${i + 1}`, "4:3", m.gallery[i] ?? null])
  return [...fixed, ...gallery].map(([position, ratio, asset]) => ({ position, ratio, asset }))
}

/* Only answered questions become FAQs, so an unanswered one can never ship
   and FAQPage schema never carries a placeholder. Budget is absent by rule 2
   and has no field to draw from. */
export function faqsFor(study) {
  const d = study.details
  const where = [d.venue, d.city].filter(Boolean).join(" in ")
  const faqs = []

  faqs.push([
    `Who produced ${d.client ? `${d.client}'s ` : ""}${study.name}?`,
    `Iconic Events, a Florida based event production and coordination company, produced ${study.name}` +
      `${d.client ? ` for ${d.client}` : ""}${where ? ` at ${where}` : ""}${d.year ? ` in ${d.year}` : ""}. ` +
      `Iconic Events held strategy, creative direction, production, show flow and on site execution as one scope.`,
  ])

  faqs.push([
    `What did Iconic Events actually deliver for ${study.name}?`,
    study.scope.map(([label, body]) => `${label}: ${body}`).join(" "),
  ])

  if (study.metrics.costSaved) {
    faqs.push([
      "How much did working with Iconic Events save on production?",
      `Consolidating strategy, creative, production and on site execution under one accountable team saved the client ${study.metrics.costSaved} against a multi vendor build.`,
    ])
  }

  if (study.metrics.productionDays) {
    faqs.push([
      "How long did production take?",
      `${study.metrics.productionDays} days of on site production${where ? ` at ${where}` : ""}. Iconic Events advises a six to twelve month window as the strongest planning runway for an event of this type.`,
    ])
  }

  if (study.metrics.attendance) {
    faqs.push([
      `How many people attended ${study.name}?`,
      `${study.metrics.attendance} guests. The room was sized against the commercial objective rather than a headcount target.`,
    ])
  }

  return [...faqs, ...(study.faqExtra ?? [])]
}

/* Dev-only guard: every lander tile must have a case study behind it. */
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
