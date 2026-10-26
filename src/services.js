import { SCOPE } from "./content.js"

/* The individual service pages, one per zone of service and support, at
   /services/<slug>. Each is prerendered with its own title, description,
   canonical and structured data (Service, FAQPage, BreadcrumbList), and
   written to answer the question a search or answer engine is carrying:
   the lead paragraph says what the service is in plain terms, the H2s use
   the category terms, and the questions at the foot are the ones a
   prospect asks before the call.

   Only the first zone has a page so far. It is the layout for Icon to
   react to; the rest are added here once it is approved, and adding an
   entry is enough: the route, the prerender and the sitemap all read this
   list. `zone` is the id of the group in SCOPE.doGroups, which supplies
   the name, the one-line description and the deliverable names; `included`
   gives each deliverable its line, keyed by the exact deliverable name.

   `draft: true` keeps a page live for review but out of the sitemap and
   marked noindex; remove it when the copy is signed off.

   House rules: no em dashes; category terms run freely in H2s and body
   copy on these pages, framed ("not just", or a comparison) in the lead;
   every claim anchors to a mechanism a prospect could verify. All of this
   copy is new and goes through Icon before it is final. */

export const FORMATS = [
  {
    name: "Summits & conferences",
    line: "Multi-day rooms built as one arc, from the registration line to the close.",
  },
  {
    name: "Ascension masterminds",
    line: "Smaller rooms, higher stake. The environment is engineered for the next tier to be offered and believed.",
  },
  {
    name: "Brand launches",
    line: "A brand or an offer put in front of its audience in person for the first time, with the moment written into the run of show.",
  },
  {
    name: "Corporate retreats",
    line: "Leadership and sales rooms off site, run to the minute so the agenda is what people remember, not the logistics.",
  },
  {
    name: "Single-day activations",
    line: "One day with a reputation riding on it. Duration is not the qualifier. Stake is.",
  },
  {
    name: "Creator live events",
    line: "A creator meeting the audience that has only ever known them through a screen. Trust is built in a room, not on a social feed.",
  },
]

export const SERVICE_PAGES = [
  {
    slug: "event-strategy",
    zone: "g1",
    draft: true,
    plate: "/images/gallery/the-black-course/17.webp",
    title: "Event strategy",
    seoTitle: "Event Strategy for Summits, Masterminds and Launches | Iconic Events",
    description:
      "Event strategy from Iconic Events: the vision brief, audience journey, ticket tiers and sponsorship architecture, mapped before a single production decision is made.",
    // The direct answer, for a reader or an engine that reads nothing else.
    lead:
      "Event strategy is the work that happens before a venue is booked or a stage is drawn. Iconic Events maps what the room is for, who will be in it, what they are asked to decide, and how the event pays for itself. Every production decision that follows traces back to that map.",
    covers: {
      heading: "What event strategy covers",
      paragraphs: [
        "Most event planning companies start with logistics. We start with intent. The Event Vision Brief sets the outcome on one page: the audience, the belief they arrive with, the belief they should leave with, and the moment the room is asked to decide.",
        "The audience journey is mapped from the first email to the last goodbye, so the registration line, the seating and the breaks are decisions rather than defaults. Ticket tiers and sponsorship are designed at the same time, because the economics shape the room as much as the staging does.",
      ],
    },
    included: {
      "Event Vision Brief":
        "One page that states what the event is for, who it is for, and what the room must produce. Signed off before anything is designed.",
      "Audience journey mapping":
        "Every touchpoint from the invitation to the follow-up, with the moments that build trust and the moments that can break it.",
      "Revenue & ticket-tier strategy":
        "Tier structure, pricing logic and capacity, set so the room fills with the right people at the right price.",
      "Sponsorship architecture":
        "Packages built around what a sponsor can actually be given in the room, priced against the audience they reach.",
    },
    sits: {
      heading: "Where it sits in an engagement",
      paragraphs: [
        "Strategy is the second phase of the Iconic Standard, our five-phase operating system, after insight and before creative. It is fixed before anything is designed, and the run of show is locked fourteen days out and does not change, so the strategy is not revisited on site.",
        "A production company delivers the stage you ask for. Strategy is the work of deciding what to ask for, and it is one of the two zones where we go beyond what a production company offers.",
      ],
    },
    faqs: [
      [
        "What is an Event Vision Brief?",
        "A one-page document that states what the event is for, who will be in the room, what they believe when they arrive, what they should believe when they leave, and the moment they are asked to decide. It is signed off before any design or production work begins, and every later decision is checked against it.",
      ],
      [
        "When should event strategy start?",
        "Before the venue is signed. Venue, dates and capacity are strategy decisions, and the brief is what makes them deliberately rather than by default. We can join a project after the venue is booked, but the brief then works within those limits instead of setting them.",
      ],
      [
        "Does strategy include the offer made from the stage?",
        "The ticket tiers and the sponsorship, yes. The offer itself sits in the Revenue zone, and the two are built together, so the tier a guest buys and the offer they hear on day two belong to the same plan.",
      ],
      [
        "How is this different from hiring an event planner?",
        "Most event planners oversee logistics. We engineer the room your audience decides in. Strategy is where that difference starts: it decides what the room is for before anyone decides what it looks like.",
      ],
    ],
  },
]

export const SERVICE_PAGE_BY_ZONE = Object.fromEntries(SERVICE_PAGES.map((p) => [p.zone, p]))

export function zoneFor(page) {
  return SCOPE.doGroups.find((g) => g.id === page.zone)
}

export function zoneNumber(page) {
  return String(SCOPE.doGroups.findIndex((g) => g.id === page.zone) + 1).padStart(2, "0")
}

export function servicePageFromPath(pathname) {
  const slug = pathname.replace(/\/+$/, "").split("/").pop()
  return SERVICE_PAGES.find((p) => p.slug === slug) ?? null
}
