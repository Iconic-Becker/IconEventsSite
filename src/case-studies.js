/* ═══════════════════════════════════════════════════════════════════════
   CASE STUDIES — one object per event, one dedicated page each.

   THE FORMULA (settled; don't drift from it without a decision)

   Page order:  site header · hero (title over image) · summary
                · the problem + photo · what we did, in three stages
                · scope of services · full bleed photo · how it went
                (story, details and highlights) + two photos · Event
                Aftermovie · "What <client> had to say about working with
                us" · gallery · FAQ (the citation answers the first
                question) · contact form · related cases

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
   name         Event name.
   headline     Results first: "How <client> <result> at <event>".
   cta          The closing ask, specific to this event and in our voice,
                e.g. "Want to build a brand activation like Eddie's?" Heads
                the contact form above "The next room".
   summary      50 to 100 words, in our voice ("we"). Client, challenge,
                solution, result. Also the meta description.
   challenge    The client's problem, from the client's own case study copy
                where it exists. A string or an array of paragraphs.
   highlights   Optional [[value, label]] shown large beside the results,
                e.g. ["300", "Attendees"]. Falls back to the metrics.
   challengesOvercome  Optional. Each challenge and how it was overcome,
                never a list of what went wrong.
   rightFor     Optional. Who a build like this is right for.
   stealThis    Optional. An idea other hosts can borrow.
   thirdPerson  Optional. Iconic's own events: no first person, no client.
   results      How it went, in prose, above the metrics. A string or an
                array of paragraphs. No client revenue (house rule 1).
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
                The answer to the first FAQ, "Who produced ...?"
   format       What kind of event this was, in Iconic's own terms:
                "Mastermind", "Summit", "Conference", "Brand activation".
                Shown in the hero meta line. This is a business
                categorisation, not a schema one.
   eventType    schema.org type. Leave it unset. Every event Iconic runs is
                commercial, so BusinessEvent is correct for all of them,
                brand activations included; schema.org has no activation
                type, and SocialEvent means a social gathering, which these
                are not. The field exists only in case a genuinely
                non-commercial event ever turns up.
   ═══════════════════════════════════════════════════════════════════════ */

export const CASE_STUDIES = [
  {
    slug: "casino-royale",
    name: "Casino Royale",
    headline:
      "How Ben Newman Filled 150 Seats at Casino Royale and Saved $100K in Production",
    cta: "Want to bring your community back into one room like Ben did?",
    summary:
      "Ben Newman was coming back to live events after five years away, and he needed a room built around a single decision. We took the whole job: strategy, creative direction, production, show flow and the night itself. We turned Palms Casino Resort in Las Vegas into a projection mapped Casino Royale for 150 guests across three days of production. Because one team held all of it, Ben saved $100,000 against a multi vendor build.",
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
    name: "Bad After Dark",
    format: "Brand activation",
    headline: "How Eddie Maalouf Built Bad After Dark With One Accountable Team",
    cta: "Want to build a brand activation like Eddie's?",
    summary:
      "Eddie Maalouf needed an evening that looked effortless and still did commercial work for his partners. We took the whole job: strategy, creative direction, production, show flow and on site execution. We designed a tightly held room where partner presence was built into the architecture of the night, not bolted onto it.",
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
      // TODO(confirm): venue for alt text, photographer credit, usage rights.
      hero: { src: "/images/gallery/bad-after-dark/03.webp", alt: "Full room at Bad After Dark in Las Vegas, guests on the floor under wall to wall projection of the event and partner logos" },
      challenge: { src: "/images/gallery/bad-after-dark/01.webp", alt: "Host speaking on stage with a microphone at Bad After Dark in Las Vegas, partner logos projected behind him" },
      band: { src: "/images/gallery/bad-after-dark/02.webp", alt: "Guests in evening wear talking at the neon lit bar at Bad After Dark in Las Vegas" },
      resultLeft: { src: "/images/gallery/bad-after-dark/07.webp", alt: "Five guests in black tie posing in front of the projected backdrop at Bad After Dark in Las Vegas" },
      resultRight: { src: "/images/gallery/bad-after-dark/08.webp", alt: "DJ booth at Bad After Dark in Las Vegas, the DJ talking with a guest in black tie" },
      gallery: [
        { src: "/images/gallery/bad-after-dark/06.webp", alt: "Guests crowded around a branded casino table at Bad After Dark in Las Vegas" },
        { src: "/images/gallery/bad-after-dark/04.webp", alt: "Guests playing at a custom branded table at the Bad After Dark casino after party in Las Vegas" },
        { src: "/images/gallery/bad-after-dark/05.webp", alt: "Close up of cards and chips on a branded table felt at Bad After Dark in Las Vegas" },
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
    name: "The CEO Lawyer Summit 2021",
    headline: "How Ali Awad Sold a $25K Offer Without Pressure at The CEO Lawyer Summit",
    cta: "Want a summit that sells from the stage like Ali's?",
    summary:
      "Ali Awad needed to present a high value offer to a room of professionals who negotiate for a living. We took the whole job: strategy, creative direction, production, show flow and on site execution. We wrote the close into the choreography of the room instead of the script.",
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
      year: "2021",
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
    name: "Scaling With Systems LIVE 2021",
    // Source: the client's own case study, old site row 20. See
    // docs/case-studies/interviews/scaling-with-systems-live.md.
    headline: "How Ravi Abuvala Launched Scaling With Systems LIVE in a Miami Parking Garage Mid Pandemic",
    cta: "Want to launch a live event people said couldn't happen, like Ravi did?",
    summary:
      "In April 2021, with rooms capped at 75 people and most live events canceled, Ravi Abuvala wanted to debut Scaling With Systems LIVE in person anyway. We moved it into 1111 Miami, an open air parking garage, which cut the risk of infection and made room for 300 attendees. In 90 days we combed through more than 94 vendors and turned the garage into a venue with supercars, drones, open bars, VIP lounges and custom stages. All 300 attendees returned home safely.",
    challenge: [
      "In April 2021 the pandemic had reached an all time high. Most live events had been canceled, and many leaders in the industry were switching to virtual events as a fallback. A national mandate said no more than 75 people could be in a room together, and this is where most other companies gave up.",
      "Scaling With Systems was adamant about letting attendees make their own choice on masks, so finding a venue open to both sides would be critical. On top of keeping 300 attendees safely together during a pandemic, this was the debut of Scaling With Systems LIVE, and it had to be a massive success both as an experience and as a business.",
    ],
    approach: {
      pre: [
        "Moved the venue to an open concept parking garage. Yes, a parking garage. Open air meant a significantly lower risk of infection, and it gave us room for 300 attendees. We brought the idea to Ravi, he approved it, and we officially partnered on the first ever Scaling With Systems LIVE.",
        "Gave ourselves 90 days and combed through more than 94 vendors to turn a traditional parking garage into an experience that had never been done before.",
        "Walked Ravi through our ascension model, an internal strategy we designed to move a community into a partner's high ticket offer without it feeling salesy or like a pitch fest. We designed the event offer, how it was deployed, the tactics to convert members on site and the entire sales process.",
      ],
      onsite: [
        "Built the garage out with supercars, drones, open bars, VIP lounges and custom stages. The venue became a hallmark of the Scaling With Systems legacy.",
      ],
      post: [],
    },
    scope: [
      ["Venue", "Sourced 1111 Miami, an open air parking garage, and made the case for it to Ravi."],
      ["Vendors", "More than 94 vendors combed through and coordinated in 90 days."],
      ["Build", "Supercars, drones, open bars, VIP lounges and custom stages."],
      ["Offer", "Event offer design and how it was deployed."],
      ["Sales", "Tactics to convert on site and the entire sales process."],
      ["Content", "Event content."],
    ],
    metrics: { attendance: "300", productionDays: null, costSaved: null },
    // Revenue published by the client's explicit exception to house rules 1
    // and 2, for this event only.
    highlights: [
      ["$1.2M", "Generated in less than 24 hours"],
      ["300", "Attendees, all home safely"],
      ["2022", "Ravi booked us again"],
    ],
    results: [
      "We created a massively successful event at a time when most people said it would be impossible. It was the first 300 attendee event hosted in South Beach that month, and all 300 attendees returned home safely.",
      "The offer and sales process we built with Ravi brought in $1,200,000 in less than 24 hours, a 12X return on the event budget.",
      "Ravi brought us back to produce Scaling With Systems LIVE again in 2022.",
    ],
    details: {
      client: "Ravi Abuvala",
      clientTitle: null,
      venue: "1111 Miami",
      city: "Miami",
      region: "FL",
      year: "2021",
      dates: null, // TODO(confirm): old site lists April 8, 2021.
    },
    media: {
      // TODO(confirm): which edition this page is, venue, photographer credit, usage rights.
      hero: { src: "/images/gallery/scaling-with-systems-live-2021/16.webp", alt: "Attendees packed onto the bow of a yacht on the water, arms raised for the group photo, during Scaling With Systems LIVE in Miami" },
      challenge: { src: "/images/gallery/scaling-with-systems-live-2021/12.webp", alt: "Speaker with a microphone on stage above the Miami skyline at Scaling With Systems LIVE in Miami" },
      band: { src: "/images/gallery/scaling-with-systems-live-2021/01.webp", alt: "Attendees at round tables filling an open air concrete venue at Scaling With Systems LIVE in Miami" },
      resultLeft: { src: "/images/gallery/scaling-with-systems-live-2021/11.webp", alt: "Three guests posing in front of the Scaling With Systems stage screen at Scaling With Systems LIVE in Miami" },
      resultRight: { src: "/images/gallery/scaling-with-systems-live-2021/08.webp", alt: "Two hosts in suits on a rooftop at sunset over the Miami skyline during Scaling With Systems LIVE in Miami" },
      gallery: [
        { src: "/images/gallery/scaling-with-systems-live-2021/09.webp", alt: "Speaker taking a selfie with the full audience behind him at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/05.webp", alt: "Attendees taking notes at their tables during a session at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/14.webp", alt: "Speaker presenting in front of a slide on the main stage at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/04.webp", alt: "White lounge seating on turf behind red rope stanchions at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/10.webp", alt: "Blue convertible sports car on display in the venue at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/13.webp", alt: "Attendees talking between sessions at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/02.webp", alt: "Videographer with headphones and a camera rig capturing content at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/03.webp", alt: "Tiered dessert display on a catering table at Scaling With Systems LIVE in Miami" },
        { src: "/images/gallery/scaling-with-systems-live-2021/15.webp", alt: "Two men laughing in front of the Scaling With Systems screen at Scaling With Systems LIVE in Miami" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced the first Scaling With Systems LIVE for Ravi Abuvala in April 2021, converting 1111 Miami, an open air parking garage in Miami, Florida, into a live event venue during the pandemic and delivering venue sourcing, vendor coordination, the build, offer design and the on site sales process.",
  },

  {
    slug: "viral-ecom-adz",
    name: "Viral Ecom Adz",
    // TODO(copy): least detail on file of the six. Replace headline, summary,
    // challenge and approach with the real account before publication.
    headline: "How Viral Ecom Adz Carried Partner Revenue Without Feeling Sponsored",
    cta: "Want a retreat your partners pay to be part of?",
    summary:
      "Viral Ecom Adz needed a room that carried real partner revenue without losing an audience that came for the content. We took creative direction, production and on site execution as one job, and built partner presence into the architecture of the evening.",
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
      client: "Noah Brewer",
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
    name: "Chase Hughes, London",
    headline: "How Chase Hughes Staged a Room Aboard HMS Belfast in London",
    cta: "Want to take your people somewhere nobody expects, like Chase did?",
    summary:
      "Chase Hughes wanted his room on a heritage warship moored on the Thames. We took creative direction, production, show flow and on site execution as one job, and built the event into the geometry of HMS Belfast instead of over it.",
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

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "creatorhub-live",
    name: "CreatorHub Live",
    headline: "How CreatorHub Live Brought 1,500+ Creators and Entrepreneurs Under One Roof",
    cta: "Want to bring your community under one roof?",
    thirdPerson: true, // Iconic's own event: no first person, no client line.
    summary:
      "CreatorHub Live set out to fill a gap: no event brought entrepreneurs and creators together to learn business and media production, and the biggest event at this capacity belonged to MrBeast. Sponsors and attendees were wary of a brand new event. The answer was a hub model, where other events ran their own stages inside CreatorHub, plus a la carte sponsorships and a Lamborghini painted live at the mixer. More than 1,500 people attended over three and a half days at the Marriott Bonnet Creek in Orlando, and the event is now building toward 3,000 in 2027.",
    challenge: [
      "There was no event where entrepreneurs and creators could come together to learn business and media production. The largest event at this capacity was run and owned by MrBeast, the biggest media entity on the planet, so building something people would trust enough to pay for meant pushing through heavy resistance.",
      "A brand new event with no history is a hard sell in the creator economy. Sponsors did not want to be first in, the platforms that mattered most, YouTube, TikTok and Snapchat, had to be won over, and getting bodies in the room was just as hard.",
      "The stakes were a multi six figure investment, the reputation of everyone involved, and the trust of the speakers and creators brought in by co-owner Xtend Creators. If it flopped, Patrick Israel and Xtend would lose relational capital with every sponsor and creator they had brought to the table.",
    ],
    approach: [
      "Rebuilt the sponsorship strategy around in person meetings, and used after party brand activations to give partners a way in.",
      "Replaced the standard gold, platinum and silver packages with a la carte options, so each sponsor could find a natural way into the event.",
      "Built the hub model: other events contract one of the stages and run their own mini event inside CreatorHub, which is where the name comes from. It put attendees from several communities under one roof with the same purpose, and it is what delivered the attendance.",
      "Ran three stages at once as three separate events that happened to share a building, each with its own dedicated stage manager.",
      "Brought a Lamborghini into the Marriott Bonnet Creek to be painted live during the networking mixer, inside a 50 foot glass enclosure built with the Marriott so not a drop of paint touched the venue.",
      "Planned the content strategy around live podcast studios that ran throughout the event, so every hour on site doubled as content production.",
    ],
    challengesOvercome: [
      "Ticket sales opened before the hubs were ready, and the first couple of months were uncertain. The answer was the hub model itself: once other events could contract a stage and bring their own communities, attendance followed.",
      "The Lamborghini turned out to be the performance version, wider than planned. Getting it inside took removing a door from the Marriott and threading it through with a couple of millimeters to spare on each side, then sealing it in a 50 foot glass enclosure so not a drop of paint reached the venue. The mixer went ahead with its centerpiece, Lamborghini got the moment it signed up for, and the venue stayed spotless.",
    ],
    scope: [
      ["Strategy", "Event strategy and positioning in the creator economy."],
      ["Sponsorship", "A la carte packages and after party brand activations in place of tiered packages."],
      ["Hub model", "Stages contracted to other events, each running its own mini event inside CreatorHub."],
      ["Content", "Content strategy and live podcast studios running throughout the event."],
      ["Venue", "Coordination with the Marriott Bonnet Creek, including the Lamborghini enclosure."],
      ["Production", "Three stage production and show flow, with a stage manager per stage."],
      ["On site", "On site execution across three and a half days."],
    ],
    metrics: { attendance: "1,500+", productionDays: "3.5", costSaved: null },
    highlights: [
      ["1,500+", "Attendees"],
      ["3", "Stages running at once"],
      ["3.5 hrs", "Round tables, planned for 45 minutes"],
    ],
    results: [
      "The hub model delivered the attendance the event needed: more than 1,500 people over three and a half days. Three stages ran at once on a clean run of show, with about 40 speakers across them.",
      "The round tables, fireside chats with a speaker at each table, were planned for 45 minutes. Attendees loved them so much they stayed for about three and a half hours.",
      "The standout moment came at the mixer. The live Lamborghini painting was the draw, and an auto tune microphone passed around the room took it up a level, with attendees singing to each other.",
      "The live podcast studios captured dozens of testimonials and hundreds of clips. That organic content is what the event is renewing on: it fuels the 2027 edition, which is aiming for 3,000 people.",
    ],
    rightFor: "Companies that want a front row seat in the creator economy and a direct line to creators who are building real businesses, and companies that help brands build digital media empires, with total coverage across the internet.",
    stealThis: [
      "Two ideas any event host can take:",
      "Run a live podcast studio the whole time. Attendees and speakers step in between sessions, and the event walks away with dozens of testimonials and hundreds of clips to market the next edition.",
      "Borrow the hub model. Let other events contract a stage and run their own mini event inside yours. Each one brings its own community, so the room fills from several audiences at once, all there for the same reason.",
    ],
    details: {
      client: null,
      clientTitle: null,
      venue: "Marriott Bonnet Creek",
      city: "Orlando",
      region: "FL",
      year: "2025",
      dates: null,
    },
    media: {
      // TODO(collect): photos, aftermovie and testimonial links to come from Iconic.
      hero: null,
      challenge: null,
      band: null,
      resultLeft: null,
      resultRight: null,
      gallery: [],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced CreatorHub Live, its own event co-owned with Xtend Creators, at the Marriott Bonnet Creek in Orlando, Florida in August 2025 for more than 1,500 attendees, delivering event strategy, sponsorship design, the hub model, live podcast studios, three stage production and on site execution.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "freedom-queen-live-2024",
    name: "Freedom Queen Live 2024",
    headline: "How Bridget James Ling Launched Her First Live Event and Her Inner Circle at Freedom Queen Live",
    cta: "Want your community's first live event to feel like it has always existed?",
    summary:
      "Bridget James Ling had built a devoted community of Freedom Queens but had never run a live event. Her first had to meet their expectations and live up to the elegance of her brand. We chose the Vinoy in St. Petersburg for its timeless feel, built installations like a wishing tree where attendees hung a written prayer, and helped her design the offer for her first sales from stage event. 451 attendees left bonded and connected, Bridget launched her offer, and she opened her inner circle community.",
    challenge: [
      "Bridget James Ling had never run a live event, but she had already built a devoted community of Freedom Queens. Her first event had to meet their expectations and live up to the legacy and class of the Freedom Queen name.",
      "Attendees did not know what to expect, so the room had to answer that question the moment they walked in. It had to be in the Tampa area at Bridget's request, and it had to feel as elegant and timeless as her brand.",
    ],
    approach: [
      "Chose the Vinoy in St. Petersburg: in the Tampa Bay area as Bridget asked, and as elegant and timeless as the Freedom Queen brand.",
      "Built installations that added to the experience instead of decorating it, like a wishing tree where attendees wrote a physical prayer and hung it on the branches.",
      "Helped Bridget design the offer for her first large sales from stage event.",
    ],
    challengesOvercome: null,
    scope: [
      ["Venue", "Sourcing and selecting the Vinoy in St. Petersburg."],
      ["Installations", "Installation design, including the wishing tree."],
      ["Offer", "Offer design support for Bridget's first sales from stage event."],
      ["Production", "Event production and on site execution."],
    ],
    metrics: { attendance: "451", productionDays: "3.5", costSaved: null },
    highlights: [
      ["451", "Freedom Queens on site"],
      ["1st", "Live event, and her first offer launched from stage"],
    ],
    results: [
      "The event went phenomenally, with 451 attendees on site over three and a half days. Bridget launched her offer from the stage, and her Freedom Queens left thrilled, bonded and connected to each other. That connection became the foundation of her next step: she launched her inner circle community.",
    ],
    rightFor: "A founder with a loyal community who wants a more reserved, timeless experience. Less about mixers and parties, more about the education.",
    stealThis: [
      "Build a wishing tree. Give attendees a physical place to write a prayer or intention for the next event and hang it on the branches. It turns a moment of reflection into a shared installation, and it gives your community a reason to come back and see what came true.",
    ],
    details: {
      client: "Bridget James Ling",
      clientTitle: null,
      venue: "The Vinoy",
      city: "St. Petersburg",
      region: "FL",
      year: "2024",
      dates: null,
    },
    media: {
      // TODO(collect): photos, aftermovie and testimonial links to come from Iconic.
      hero: null,
      challenge: null,
      band: null,
      resultLeft: null,
      resultRight: null,
      gallery: [],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced the first Freedom Queen Live for Bridget James Ling at the Vinoy in St. Petersburg, Florida in November 2024, delivering venue selection, installation design, offer design support, production and on site execution for 451 attendees.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "freedom-queen-live-2025",
    name: "Freedom Queen Live 2025",
    headline: "How Freedom Queen Live Rewrote the Business Event Format and Drew 530 Attendees to a Broadway Style Show",
    cta: "Want your next event to feel like opening night?",
    summary:
      "For year two of Freedom Queen Live, Bridget James Ling wanted a show, not a business conference: Broadway style, with performers and rehearsed dance numbers. We sourced the dancers, fitted their rehearsals around the speakers', and cued every performance to the AV and stage while keeping it all a surprise. A flash mob opened the event, dance numbers ran through the day, and even the butler service became part of the performance. Attendance grew to 530 over three and a half days, and the media from the show set the event apart.",
    challenge: [
      "For year two, Bridget James Ling wanted to move away from the idea of a business conference and lean into her theatrical roots. She wanted a show: Broadway style, with performers, rehearsed dance numbers and a room that felt less like a conference and more like a theatrical performance.",
      "A show needs a cast, rehearsals and split second timing, and all of it had to stay a surprise for the attendees.",
    ],
    approach: [
      "Returned to the Vinoy in St. Petersburg, the venue Bridget's community already knew from year one.",
      "Sourced the dance performers and built the program around rehearsed musical sets and dance numbers.",
      "Opened with a flash mob, then ran rehearsed dance performances through the day, every cue timed and synced with the AV and stage elements.",
      "Turned the butler service into part of the performance, staged at the front of the stage.",
    ],
    challengesOvercome: [
      "Fitting dance rehearsals around speaker rehearsals was the hard part. Both had to happen in the same rooms on the same days, and the performances had to stay a secret from the attendees until the flash mob opened the event. The schedule held, every cue landed with the AV and stage, and the surprises arrived intact.",
    ],
    scope: [
      ["Show", "Show concept and program design."],
      ["Talent", "Sourcing the dance performers."],
      ["Rehearsals", "Dance rehearsals scheduled around speaker rehearsals."],
      ["Cueing", "Every performance cued with the AV and stage."],
      ["Staging", "The butler service staged as part of the performance."],
      ["Production", "Venue, production and on site execution."],
    ],
    metrics: { attendance: "530", productionDays: "3.5", costSaved: null },
    highlights: [
      ["530", "Attendees, up from 451 in year one"],
      ["1", "Flash mob to open the show"],
    ],
    results: [
      "Attendees loved it. The opening was a wild, show stopping moment that woke the room up and told everyone this was not another business conference.",
      "The show also made the event's media. The content that came out of it set the expectation that Freedom Queen Live is meant to be different from every other event, and attendance grew to 530 in its second year.",
    ],
    rightFor: null,
    stealThis: [
      "Open with a surprise. A flash mob or rehearsed performance in the first minutes tells attendees this is not another conference, and it hands your social team the clip that sells the next edition.",
    ],
    details: {
      client: "Bridget James Ling",
      clientTitle: null,
      venue: "The Vinoy",
      city: "St. Petersburg",
      region: "FL",
      year: "2025",
      dates: null,
    },
    media: {
      // TODO(collect): photos, aftermovie and testimonial links to come from Iconic.
      hero: null,
      challenge: null,
      band: null,
      resultLeft: null,
      resultRight: null,
      gallery: [],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Freedom Queen Live 2025 for Bridget James Ling at the Vinoy in St. Petersburg, Florida in November 2025, delivering a Broadway style show with rehearsed dance performances, a flash mob opening and staged butler service for 530 attendees.",
  },
]

/* Every event, in the order Iconic keeps them. This drives the grid at
   /case-studies.

   `full: true` means the event has a built page at /case-studies/<slug>,
   and its card reads from CASE_STUDIES so the two cannot drift. The rest
   are listed but not linked: they have no page yet, so they are not
   prerendered, not in the sitemap, and cannot be reached by URL.

   `when` is "YYYY-MM" or "YYYY", or null when not known. The grid sorts on
   it, newest first. It is not shown on the cards (Iconic's call). Never
   guess a month.

   To promote one: add a full entry to CASE_STUDIES with the same slug and
   flip `full` to true here. */
export const EVENT_INDEX = [
  { slug: "creatorhub-live", name: "CreatorHub Live", client: null, when: "2025-08", location: "Orlando, FL", venue: "Marriott Bonnet Creek", size: "1,500+", full: true },
  { slug: "creator-fest", name: "Creator Fest", client: null, when: "2024-08", location: "Orlando, FL", venue: "Marriott Bonnet Creek", size: null, full: false },
  { slug: "creator-hub-madrid", name: "Creator Hub Madrid", client: "Universal Music Group", when: "2025", location: "Madrid, Spain", venue: null, size: null, full: false },
  { slug: "freedom-queen-live-2024", name: "Freedom Queen Live 2024", client: "Bridget James Ling", when: "2024-11", location: "St. Petersburg, FL", venue: "The Vinoy", size: "451", full: true },
  { slug: "freedom-queen-live-2025", name: "Freedom Queen Live 2025", client: "Bridget James Ling", when: "2025-11", location: "St. Petersburg, FL", venue: "The Vinoy", size: "530", full: true },
  { slug: "pmuw-2023", name: "PMUW 2023", client: "Danny Tran", when: "2023-04", location: null, venue: null, size: null, full: false },
  { slug: "pmuw-2024", name: "PMUW 2024", client: "Danny Tran", when: "2024", location: null, venue: null, size: null, full: false },
  { slug: "pmuw-2025", name: "PMUW 2025", client: "Danny Tran", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "net-rev-summit-2026", name: "Net Rev Summit 2026", client: "Ambro Dipilato", when: "2026-05", location: "Marana, AZ", venue: "Ritz-Carlton Dove Mountain", size: null, full: false },
  { slug: "decentralized-masters-live", name: "Decentralized Masters Live", client: "Tan and Salim", when: "2026", location: null, venue: null, size: null, full: false },
  { slug: "fast-start-forum-2024", name: "Fast Start Forum 2024", client: "Tom Wall", when: "2024", location: null, venue: null, size: null, full: false },
  { slug: "fast-start-forum-2025", name: "Fast Start Forum 2025", client: "Tom Wall", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "the-sales-summit", name: "The Sales Summit", client: "Jeremy Miner", when: "2026", location: null, venue: null, size: null, full: false },
  { slug: "hell-yes-live", name: "Hell Yes Live", client: "Becca Pike", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "limitless-live", name: "Limitless Live", client: "Gil Valerio", when: "2026", location: null, venue: null, size: null, full: false },
  { slug: "women-and-wealth", name: "Women and Wealth", client: "Shelby Sapp", when: "2026-07", location: "Fort Lauderdale, FL", venue: "Broward County Convention Center", size: null, full: false },
  { slug: "closers-io-retreat", name: "Closers.io Retreat", client: "Cole Gordon", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "bad-after-dark", name: "Bad After Dark", client: "Eddie Maalouf", when: "2024-01", location: null, venue: null, size: null, full: true },
  { slug: "agency-founders-dubai", name: "Agency Founders Dubai", client: "Eddie Maalouf", when: "2026", location: "Dubai, UAE", venue: null, size: null, full: false },
  { slug: "maxxed-out-summit", name: "Maxxed Out Summit", client: "Max Willett", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "her-last-call", name: "Her Last Call", client: "Alexis Mai", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "pimcon-2025", name: "PimCon 2025", client: "Rankings.io", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "pimcon-2024", name: "PimCon 2024", client: "Rankings.io", when: "2024", location: null, venue: null, size: null, full: false },
  { slug: "the-black-course", name: "The Black Course", client: "Chase Hughes", when: "2023-06", location: null, venue: null, size: null, full: false },
  { slug: "behavior-pilot", name: "Behavior Pilot", client: "Chase Hughes", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "chase-hughes-london", name: "HMS Belfast, London", client: "Chase Hughes", when: "2023-02", location: "London, UK", venue: "HMS Belfast", size: null, full: true },
  { slug: "sales-momentum-live", name: "Sales Momentum Live", client: "Aaron Platt", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "the-guardians-annual", name: "The Guardians Annual", client: "Thaddeus Gala", when: "2022-04", location: null, venue: null, size: null, full: false },
  { slug: "e-p-i-c", name: "E.P.I.C", client: "Kaaba Luum", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "powerhouse", name: "Powerhouse", client: "Los Silva", when: "2022", location: null, venue: null, size: null, full: false },
  { slug: "founder-os", name: "Founder OS", client: "Matt Gray", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "the-ceo-lawyer-summit-2022", name: "The CEO Lawyer Summit 2022", client: "Ali Awad", when: "2022-12", location: null, venue: null, size: null, full: false },
  { slug: "ceo-lawyer-summit", name: "The CEO Lawyer Summit 2021", client: "Ali Awad", when: "2021-12", location: null, venue: null, size: null, full: true },
  { slug: "scaling-with-systems-live-2023", name: "Scaling With Systems LIVE 2023", client: "Ravi Abuvala", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "scaling-with-systems-live", name: "Scaling With Systems LIVE 2021", client: "Ravi Abuvala", when: "2021-04", location: null, venue: null, size: null, full: true },
  { slug: "egc-2022", name: "EGC 2022", client: "Austin Zelan", when: "2022", location: null, venue: null, size: null, full: false },
  { slug: "dealcon-2025", name: "DealCon 2025", client: "Tom Shipley", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "casino-royale", name: "Casino Royale", client: "Ben Newman", when: "2023-10", location: "Las Vegas, NV", venue: "Palms Casino Resort", size: "150", full: true },
  { slug: "viral-ecom-adz", name: "Viral Ecom Adz", client: "Noah Brewer", when: "2023-06", location: null, venue: null, size: null, full: true },
  // From the old klevr.events site (docs/case-studies/LEGACY-SITE-EXTRACT.md).
  { slug: "scaling-with-systems-live-2022", name: "Scaling With Systems LIVE 2022", client: "Ravi Abuvala", when: "2022", location: "Miami, FL", venue: "1111 Miami", size: null, full: false },
  { slug: "rise-x", name: "Rise X", client: "Joel Kaplan and Sergio Tavarez", when: "2022-04", location: "Costa Rica", venue: null, size: null, full: false },
  { slug: "bulletproof-financial-accelerator", name: "Bulletproof Financial Accelerator", client: "John Whiting", when: "2022-03", location: "Orlando, FL", venue: null, size: null, full: false },
  { slug: "ace-interstellar", name: "Ace Interstellar", client: "Michael Sheridan", when: "2022-01", location: "Mexico", venue: "OZEN Rajneesh Resort", size: null, full: false },
  { slug: "behavioral-selling", name: "Behavioral Selling", client: "Chase Hughes", when: "2021-10", location: "Miami, FL", venue: null, size: null, full: false },
  { slug: "takeover-live-3", name: "Takeover Live 3", client: "Danny Tran", when: "2021-08", location: "Sundance, UT", venue: null, size: null, full: false },
  { slug: "group-convert-live", name: "Group Convert Live", client: "Kim Dang", when: "2021-08", location: "Las Vegas, NV", venue: null, size: null, full: false },
  { slug: "takeover-live-2", name: "Takeover Live 2", client: "Danny Tran", when: "2021-05", location: "Las Vegas, NV", venue: null, size: null, full: false },
  { slug: "7-figure-agency", name: "7-Figure Agency", client: "Joel Kaplan", when: "2021-01", location: "Playa del Carmen, Mexico", venue: null, size: null, full: false },
  { slug: "takeover-live-1", name: "Takeover Live 1", client: "Danny Tran", when: "2021-01", location: "Las Vegas, NV", venue: null, size: null, full: false },
  { slug: "the-behavior-panel-live", name: "The Behavior Panel Live", client: "The Behavior Panel", when: "2022-07", location: "Las Vegas, NV", venue: null, size: null, full: false },
  { slug: "epic-growth-conference-2021", name: "Epic Growth Conference 2021", client: "Tyler Cerny and Austin Zelan", when: "2021-11", location: "Las Vegas, NV", venue: null, size: null, full: false },
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

  /* The citation sentence is the answer: one standalone line naming who
     produced the event, where, and what was delivered. */
  faqs.push([
    `Who produced ${d.client ? `${d.client}'s ` : ""}${study.name}?`,
    study.citation,
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
      `${study.metrics.attendance} attendees. The room was sized against the commercial objective rather than a headcount target.`,
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

/* Hand selected photos per event, in public/images/gallery/<folder>/ as
   01.webp, 02.webp and so on, in the order Iconic picked them. An event not
   yet written up uses its 01 as the cover on the grid.
   See docs/case-studies/PHOTO-LIBRARY.md. */
export const PHOTO_LIBRARY = {
  "bad-after-dark": { folder: "bad-after-dark", count: 8 },
  "casino-royale": { folder: "casino-royale", count: 13 },
  "viral-ecom-adz": { folder: "viral-ecom-adz", count: 49 },
  "chase-hughes-london": { folder: "chase-hughes-london", count: 19 },
  "the-black-course": { folder: "the-black-course", count: 43 },
  "pmuw-2023": { folder: "pmuw-2023", count: 20 },
  "the-guardians-annual": { folder: "the-guardians-annual", count: 16 },
  "rise-x": { folder: "rise-x", count: 26 },
  // 14 of the 16 in Iconic's folder; 06 and 07 were left out, so the
  // numbering skips them.
  "scaling-with-systems-live": { folder: "scaling-with-systems-live-2021", count: 14, missing: [6, 7] },
  "scaling-with-systems-live-2022": { folder: "scaling-with-systems-live-2022", count: 16 },
  "bulletproof-financial-accelerator": { folder: "bulletproof-financial-accelerator", count: 16 },
  "ace-interstellar": { folder: "ace-interstellar", count: 17 },
  "epic-growth-conference-2021": { folder: "epic-growth-conference", count: 16 },
  "the-behavior-panel-live": { folder: "the-behavior-panel-live", count: 16 },
  "behavioral-selling": { folder: "behavioral-selling", count: 40 },
  "takeover-live-3": { folder: "takeover-live-3", count: 20 },
  "group-convert-live": { folder: "group-convert-live", count: 19 },
  "7-figure-agency": { folder: "7-figure-agency", count: 16 },
  "takeover-live-1": { folder: "takeover-live-1", count: 35 },
  "takeover-live-2": { folder: "takeover-live-2", count: 22 },
  "ceo-lawyer-summit": { folder: "the-ceo-lawyer-summit-2021", count: 23 },
  "the-ceo-lawyer-summit-2022": { folder: "the-ceo-lawyer-summit-2022", count: 50 },
}

/* Every file in a PHOTO_LIBRARY folder, in Iconic's order. Numbering is
   01, 02 and so on, less any numbers listed as missing. */
export function libraryPhotos({ folder, count, missing = [] }) {
  const out = []
  for (let n = 1; out.length < count; n++) {
    if (!missing.includes(n)) out.push(`/images/gallery/${folder}/${String(n).padStart(2, "0")}.webp`)
  }
  return out
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// "2023-10" reads "October 2023"; "2025" reads "2025".
export function whenLabel(when) {
  if (!when) return null
  const [year, month] = when.split("-")
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year
}

/* Cards for the /case-studies grid, newest first. Year-only events sort
   after the dated months of their year, undated events last, and ties keep
   EVENT_INDEX order. A built event takes its name and client from
   CASE_STUDIES, so the grid and the page always agree. */
/* Every photograph across every written case study, interleaved so that
   consecutive frames come from different events rather than three in a row
   from one night.

   Deliberately not random. These pages are prerendered, so a Math.random()
   order would differ between the server and the browser and React would
   throw away the markup it was given. Round robin gives the spread without
   that cost, and it widens on its own as case studies are added.

   Returns {src, alt, slug, study, href}: the alt text is the one written
   for the case study, which is better than anything a gallery could invent,
   and every frame remembers the case study it came from so the /gallery
   page can send a visitor on to that event. */
export function galleryPool() {
  const perStudy = CASE_STUDIES.map((study) => {
    const m = study.media
    return [m.hero, m.challenge, m.band, m.resultLeft, m.resultRight, ...(m.gallery ?? [])]
      .filter((frame) => frame && frame.src)
      .map((frame) => ({
        ...frame,
        slug: study.slug,
        study: study.name,
        href: `/case-studies/${study.slug}`,
      }))
  })
  const out = []
  const seen = new Set()
  const longest = Math.max(0, ...perStudy.map((list) => list.length))
  for (let i = 0; i < longest; i++) {
    for (const list of perStudy) {
      const frame = list[i]
      if (!frame || seen.has(frame.src)) continue
      seen.add(frame.src)
      out.push(frame)
    }
  }
  return out
}

export function caseStudyCards() {
  const key = (when) => (when ? (when.length === 4 ? `${when}-00` : when) : "")
  return EVENT_INDEX.map((entry, order) => ({ entry, order }))
    .sort((a, b) => key(b.entry.when).localeCompare(key(a.entry.when)) || a.order - b.order)
    .map(({ entry }) => {
      const built = entry.full ? CASE_STUDY_BY_SLUG[entry.slug] : null
      return {
        slug: entry.slug,
        name: built?.name ?? entry.name,
        client: built?.details.client ?? entry.client,
        when: whenLabel(entry.when),
        location: entry.location,
        venue: built?.details.venue ?? entry.venue,
        size: entry.size,
        href: built ? `/case-studies/${entry.slug}` : null,
        cover: built
          ? built.media.hero ?? built.media.band ?? built.media.resultLeft
          : PHOTO_LIBRARY[entry.slug]
            ? { src: `/images/gallery/${PHOTO_LIBRARY[entry.slug].folder}/01.webp` }
            : null,
        format: built?.format ?? null,
      }
    })
}

/* Frames on case study pages that turned out to be from other events (see
   docs/TODO.md, Casino Royale photos). Kept off /gallery, where every photo
   names its event, until they are replaced. */
const MISFILED = new Set(["/images/gallery/g34.webp", "/images/gallery/g24.webp", "/images/gallery/g32.webp"])

/* Photos Iconic's folders hold twice (the same shot, or two frames a moment
   apart), found by comparing every library photo. The first copy is kept on
   /gallery and the repeat left out, so the page never shows one shot twice. */
const REPEATS = new Set([
  "behavioral-selling/13", "behavioral-selling/12", "group-convert-live/05",
  "the-behavior-panel-live/16", "the-ceo-lawyer-summit-2021/04",
  "the-ceo-lawyer-summit-2022/13", "the-ceo-lawyer-summit-2022/32",
  "takeover-live-1/30", "chase-hughes-london/17",
].map((name) => `/images/gallery/${name}.webp`))

/* Every event photograph on the site, for /gallery: the frames placed on the
   written case studies plus the whole photo library, one entry per file.

   Each carries its event. `href` is the case study page when one is written,
   and null when the event is listed but not yet written up. `thumbs` lists
   the smaller files the grid loads instead of the full one. Alt text is the
   case study's own where a frame has one; library photos get a plain line
   naming the event, client and place, never a guess at what is in shot. */
export function galleryFrames() {
  const frames = []
  const seen = new Set()
  const add = (frame) => {
    if (seen.has(frame.src) || MISFILED.has(frame.src) || REPEATS.has(frame.src)) return
    seen.add(frame.src)
    frames.push(frame)
  }

  for (const frame of galleryPool()) {
    add({ src: frame.src, alt: frame.alt, slug: frame.slug, event: frame.study, href: frame.href })
  }

  for (const [slug, entry] of Object.entries(PHOTO_LIBRARY)) {
    const built = CASE_STUDY_BY_SLUG[slug]
    const listed = EVENT_INDEX.find((e) => e.slug === slug)
    const event = built?.name ?? listed?.name ?? slug
    const client = built?.details.client ?? listed?.client
    const place = listed?.location ?? (built ? [built.details.city, built.details.region].filter(Boolean).join(", ") : null)
    libraryPhotos(entry).forEach((src) => {
      add({
        src,
        alt: `${event}${client ? ` for ${client}` : ""}${place ? ` in ${place}` : ""}, produced by Iconic Events`,
        slug,
        event,
        href: built ? `/case-studies/${slug}` : null,
      })
    })
  }
  // Every frame has 480w and 960w thumbnails beside it, made by
  // scripts/make-gallery-thumbs.mjs.
  return frames.map((frame) => ({
    ...frame,
    thumbs: [480, 960].map((w) => [frame.src.replace(/\.webp$/, `-${w}.webp`), w]),
  }))
}
