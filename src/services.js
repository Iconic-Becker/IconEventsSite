import { SCOPE } from "./content.js"
import { CASE_STUDY_BY_SLUG } from "./case-studies.js"

/* The individual service pages: the 12 the SEO brief names, at
   /services/<slug>, and the two city pages at /<slug>. Each is prerendered
   with its own title, description, canonical and structured data (Service
   or LocalBusiness, FAQPage, BreadcrumbList), and written to answer the
   question a search or answer engine is carrying: a plain buyer line, a
   lead that defines the service in a few sentences, headings phrased the
   way people ask, proof with numbers, and the questions a prospect asks
   before the call.

   Adding a page is an entry in SERVICE_PAGES: the route, the prerender,
   the sitemap and the structured data all read this list. `draft: true`
   keeps a page live for review but out of the sitemap and marked noindex;
   remove it when Icon signs the copy off.

   Every fact here traces to Icon's answers of 26 October 2026 (the plan
   doc, "Questions for Icon") or to a published case study. House rules:
   no em dashes; no partner, client or competitor named beyond the event
   names; no prices, no event count, no viewer counts; pricing is a
   management fee fixed at the outset and tied to scope; the run of show is
   tentative at fourteen days and locked at seven. */

export const FORMATS = [
  { name: "Summits & conferences", line: "Multi-day rooms built as one arc, from the registration line to the close." },
  { name: "Ascension masterminds", line: "Smaller rooms, higher stake. The environment is engineered for the next tier to be offered and believed." },
  { name: "Brand launches", line: "A brand or an offer put in front of its audience in person for the first time, with the moment written into the run of show." },
  { name: "Corporate events", line: "Summits, sales kickoffs, leadership retreats, offsites and award nights, run to the minute so the agenda is what people remember." },
  { name: "Single-day activations", line: "One day with a reputation riding on it. Duration is not the qualifier. Stake is." },
  { name: "Creator live events", line: "A creator meeting the audience that has only ever known them through a screen. Trust is built in a room, not on a social feed." },
]

/* The key facts table every page carries. The same facts appear in the
   structured data. */
export const FACTS = [
  ["Headquarters", "Miami, Florida, with Las Vegas as a second base"],
  ["Founded", "2017"],
  ["Rooms produced", "20 to 3,000 people"],
  ["Produced in", "United States, United Kingdom, Spain, United Arab Emirates, Mexico, Costa Rica"],
  ["Run of show", "Tentative at 14 days out, final locked at 7"],
  ["Lead time", "About 30 days for a full production"],
  ["Fee", "A management fee, fixed at the outset and tied to scope"],
  ["On every event", "Event Director, Event Coordinator, Experience Officer, Sponsor Liaison, Production Director, Media Lead"],
]

/* The Iconic Standard, the nine-phase event lifecycle. One line each; the
   pages that lean on a phase add a note of their own. */
export const PHASES = [
  { n: 1, name: "Vision and Kickoff", line: "The Vision Call sets what the room is for. The Event Playbook and tracker are set up within 24 hours of signing, and the kickoff call is held within five business days." },
  { n: 2, name: "Venue and Hospitality", line: "Five to eight venues scored on eight criteria and presented within two weeks. Rates, room blocks and attrition negotiated on your behalf." },
  { n: 3, name: "Vendors and Production", line: "AV and every supplier specified for the show, what it needs separated from what a quote tends to include, and the contracts negotiated down." },
  { n: 4, name: "Attendee Experience", line: "Registration, the waiver and the event brochure built and approved before a single ticket goes on sale." },
  { n: 5, name: "Creative", line: "The eight standard design deliverables, from badges and signage to splash screens and speaker cards, each approved in writing." },
  { n: 6, name: "Program and Content", line: "The floor plan, the speakers, the sponsors and the capture plan, written into one run of show." },
  { n: 7, name: "Pre-Event Operations", line: "The countdown from 60 days out: the tentative run of show at 14 days, the Playbook in every hand at 10, the final run of show locked at 7 and changed only in an emergency." },
  { n: 8, name: "On Site", line: "Day 0 is a full tech rehearsal. Show days are run by a dedicated show caller with the Event Director, so you spend the day with your audience, not in meetings." },
  { n: 9, name: "Closeout", line: "A client debrief within seven business days: what went right, what to fix, and the plan that makes the next event easier to sell. Your footage and final films follow." },
]

export const CONTENT_CREW = [
  ["Videographer", "Captures video."],
  ["Photographer", "Captures and edits the photographs."],
  ["Creative director", "Makes sure every team is getting the shots the target needs."],
  ["Socials creator", "Makes real-time short-form content on a phone, cut and posted fast."],
  ["Graphics editor", "Splash screens, speaker cards, banners and everything on the screens."],
  ["Video editor", "The event's cut: the film, the reels and the cutdowns."],
]

export const SERVICE_PAGES = [
  {
    slug: "live-event-production",
    kind: "service",
    zone: "g3",
    draft: true,
    plate: "/images/gallery/scaling-with-systems-live-2022/03.webp",
    title: "Live event production",
    seoTitle: "Live Event Production Company | Iconic Events, Miami and Las Vegas",
    description:
      "Live event production from Iconic Events: stage, light, sound, video and scenic specified, negotiated and directed as one show, with a dedicated show caller and a Day 0 tech rehearsal at every event. Founded 2017, based in Miami.",
    buyer:
      "Live event production for founders, brands and creators who need a summit, launch or mastermind built, rehearsed and run as one show, with one team accountable for the room.",
    lead:
      "Live event production is the technical delivery of a live event: the stage, lighting, sound, video and scenic, specified for the show, built and rehearsed. On the day it is run to a locked run of show. Iconic Events directs all of it under one line of authority, with a dedicated show caller and a tech rehearsal before doors open.",
    covers: {
      heading: "What is live event production?",
      paragraphs: [
        "Live event production is everything the audience sees and hears from the moment doors open: the stage and set, the lighting, the sound, the screens and cameras, and the scenic that holds it together. It also covers what the audience never sees: the rigging, the power, the crew, the Day 0 rehearsal, and the run of show that decides what happens in which minute. At Iconic that run of show is tentative at 14 days out and locked at 7.",
        "Most event planners oversee logistics. We engineer the room your audience decides in. In practice that means one team specifies every element of the production for the show you are putting on. It negotiates the production with local partners who know the venue, and directs it on the day through one show caller. The stage is drawn around the run of show rather than around what the venue has on a truss. The audio is designed for speech first, because a room that cannot hear clearly cannot be convinced.",
        "Iconic owns no equipment, and that is deliberate. It lets the team produce anywhere in the country through local, trusted partners, and it means the production is specified for your show rather than built from what sits in a warehouse. The team's own background in audio visual production is the reference point: it knows what equipment should cost in any market, and what a show needs against what a quote tends to include.",
      ],
    },
    included: {
      heading: "What is included in live event production",
      items: [
        { name: "Technical direction", line: "One technical direction for the whole room, from the first drawing to strike, so every department answers to the same plan." },
        { name: "Show calling", line: "A dedicated show caller on the day, working in tandem with the Event Director and the production partner, calling every cue from the locked run of show." },
        { name: "Audio engineering", line: "Speech-first sound design for the room, with delays and front fills so every seat hears clearly, headset microphones for speakers, and playback with a backup." },
        { name: "Lighting and LED", line: "Lighting that makes the room feel like somewhere other than a ballroom, cued to the show's moments, and LED or projection sized to the room and its sightlines." },
        { name: "Live video and broadcast", line: "Cameras for the screens in the room and a recorded cut of the stage, directed as a show. When the event calls for it, a stream for the audience that is not in the room." },
        { name: "Crew and vendor management", line: "Every crew member and supplier on one schedule, briefed and directed by Iconic, with the AV contract negotiated down to what the show needs." },
      ],
      decide:
        "You decide the budget, the venue, the design, and each creative deliverable in writing. Inside the plan you approved, Iconic decides on the day, so the show never waits for a meeting.",
      boundaries:
        "Venue power, internet, union labour and effects permits are arranged in the plan and paid to the venue or the authority that provides them. Iconic produces the show; it does not sell the tickets or run your marketing.",
    },
    phases: {
      intro:
        "Live event production runs through all nine phases of the Iconic Standard. Three of them are where most of the production work happens.",
      focus: [3, 7, 8],
      notes: {
        3: "The production is specified here, before anything is rented: the stage drawn around the run of show, the audio designed for speech, the screens sized to the room. Then the quotes are read against it and negotiated down, usually by tens of thousands of dollars and sometimes by hundreds of thousands.",
        7: "Load-in for a 1,000-person summit takes one to two days. It is planned into the countdown from the start, because too little time for load-in and setup is the failure Iconic sees most often in rooms it did not produce.",
        8: "Day 0 is a full tech rehearsal, at every event, so every piece of tech is proven before anyone stands on the stage. On show days the show caller calls the cues, the Event Director runs the room, and you get a short check-in each morning rather than a day of meetings.",
      },
    },
    compare: {
      heading: "Live event production vs event planning",
      paragraphs: [
        "An event planner organises the event: the venue, the catering, the schedule, the suppliers, and the good ones do it well. Production is a different job. It is the technical build and the live running of the show itself. It needs a technical direction, a show caller, and a Day 0 rehearsal with the stage, the screens, the audio and the speakers before doors open.",
        "Many planners hire a production company for that part, and many production companies do only that part. Iconic does both under one line of authority, and adds the strategy and revenue work a production company does not offer: the strategy before anything is designed, and the revenue moment the room is built around. The difference shows on the day. There is one plan, one call sheet and one person to ask.",
      ],
    },
    proof: {
      intro: "Three rooms produced this way, with what changed in each.",
      items: [
        { slug: "pmuw-2025", changed: "Focusing the show on one main stage saved $140,000 on AV and made room for more sponsor booths. Four days, recorded in 4K with an editor on site for daily recaps." },
        { slug: "the-sales-summit", changed: "The client's largest event after years of mostly virtual ones: three days at the Irving Convention Center built around live call reviews from the stage, opened with a gala on the terrace." },
        { slug: "creatorhub-live", changed: "A hub model where other events ran their own stages inside CreatorHub, plus a Lamborghini painted live on the floor, for more than 1,500 creators and entrepreneurs." },
      ],
    },
    terms: [
      ["Run of show", "The minute-by-minute script of the event: every cue, walk-on, video and transition, in order. Tentative at 14 days out, locked at 7."],
      ["Show caller", "The person who calls each cue to the crew during the show, so lighting, sound, video and the stage move together."],
      ["Day 0", "The day before the first show day, given over to a full technical rehearsal with the stage, the screens, the audio and the speakers."],
      ["Technical direction", "Ownership of the whole technical build, from drawings and specification through load-in, show and strike."],
      ["Load-in", "The days when the stage, rigging, screens, lighting and sound are brought into the venue and built. One to two days for a 1,000-person summit."],
    ],
    faqs: [
      ["What does a live event production company do?", "It designs, builds and runs the technical side of a live event: the stage, lighting, sound, video, screens and scenic, plus the crew and the rehearsal. Iconic adds the direction on top: one technical direction for the room, a show caller on the day, and the strategy and revenue work a production company does not offer."],
      ["How far in advance do we need to book live event production?", "About 30 days is the shortest lead time Iconic takes on a full production, and some experiences can be done in less depending on their complexity. Earlier is better, because the venue, the dates and the capacity are strategy decisions, and the earlier they are made the more room the production has."],
      ["How long does load-in take for a 1,000-person summit?", "One to two days, followed by Day 0, a full tech rehearsal. Too little time for load-in and setup is the problem Iconic sees most often in events it did not produce, so the days are planned into the countdown from the start."],
      ["Do you bring your own equipment?", "No, and on purpose. Owning nothing lets Iconic produce anywhere in the country through local partners who know the venue, and specify the production for your show rather than for a warehouse. The team's AV background means it knows what equipment should cost in any market."],
      ["Who runs the show on the day?", "A dedicated show caller, assigned to the event, calls the cues, working in tandem with the Event Director and the production partner. Your event day is treated like a wedding day, and you should not spend it in meetings with the coordinator. So before the event there is a State of the Union with your team, so everyone shares one objective. Everyone receives the Event Playbook, and on show days you get short check-ins."],
      ["What goes wrong most often at live events, and how do you prevent it?", "Two things. Not enough time planned for load-in, setup and deliveries, and no breaks for the attendees. Agendas packed to the edge leave no room to breathe, so attendees end up overwhelmed and the client spends more than they needed to. Iconic designs both out: time for the build, and air in the schedule."],
      ["How much does live event production cost?", "Iconic charges a management fee, fixed at the outset and tied to scope. The production itself is specified for your show and negotiated with the production partners. Separating what the show needs from what a quote tends to include usually brings the AV contract down by tens of thousands of dollars, and sometimes by hundreds of thousands."],
      ["Do you produce events outside Florida?", "Yes. Iconic is based in Miami with Las Vegas as a second base, and has produced in the United States, the United Kingdom, Spain, the United Arab Emirates, Mexico and Costa Rica."],
    ],
    related: ["audio-visual-event-production", "conference-and-summit-production", "event-video-production"],
    cta: {
      headline: "Discuss your live event production.",
      lead: "Tell us the event, the dates and the room you have in mind. A director replies within 48 hours with the questions we need answered before a Vision Call.",
      label: "Start a conversation",
    },
  },
]

export const SERVICE_PAGE_BY_SLUG = Object.fromEntries(SERVICE_PAGES.map((p) => [p.slug, p]))
export const SERVICE_PAGE_BY_ZONE = Object.fromEntries(
  SERVICE_PAGES.filter((p) => p.kind === "service").map((p) => [p.zone, p]).reverse()
)

export function pagePath(page) {
  return page.kind === "city" ? `/${page.slug}` : `/services/${page.slug}`
}

export function zoneFor(page) {
  return SCOPE.doGroups.find((g) => g.id === page.zone) ?? null
}

export function zoneNumber(page) {
  const i = SCOPE.doGroups.findIndex((g) => g.id === page.zone)
  return i < 0 ? null : String(i + 1).padStart(2, "0")
}

/* A proof item resolved against the published case studies: the event's
   name, room and attendance come from the case study so they cannot drift. */
export function proofItem(item) {
  const study = item.slug ? CASE_STUDY_BY_SLUG[item.slug] : null
  if (!study) return { name: item.name, where: item.where ?? null, attendance: item.attendance ?? null, href: null, changed: item.changed }
  const d = study.details ?? {}
  return {
    name: study.name,
    where: [d.venue, d.year].filter(Boolean).join(", ") || null,
    attendance: study.metrics?.attendance ?? null,
    href: `/case-studies/${study.slug}`,
    changed: item.changed,
  }
}

export function servicePageFromPath(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/"
  return SERVICE_PAGES.find((p) => pagePath(p) === path) ?? null
}
