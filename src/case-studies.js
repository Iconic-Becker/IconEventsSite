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
   approachLead Optional. Replaces the line beside What We Did, for
                engagements that were not full production (EPIC Consulting).
   thirdPerson  Optional. Iconic's own events: no first person, no client.
   results      How it went, in prose, above the metrics. A string or an
                array of paragraphs. No client revenue (house rule 1).
   approach     { pre, onsite, post } arrays of strings. Rendered as one
                continuously numbered list across the three stages.
   scope        [[label, description]] for the Scope of Services block.
   metrics      { attendance, productionDays, costSaved } strings or null.
                Optional costSavedBasis: one sentence on how the saving was
                made, used as the FAQ answer.
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
    slug: "bad-after-dark",
    name: "Bad After Dark",
    format: "Brand activation",
    metaTitle: "Bad After Dark: Brand Activation Case Study | Iconic Events",
    metaDescription: "Bad After Dark brand activation case study: how Iconic Events produced a Las Vegas night for Eddie Maalouf that earned $146K in sponsorships in six days.",
    headline: "How Eddie Maalouf Built Bad After Dark With One Accountable Team",
    cta: "Want to build a brand activation like Eddie's?",
    summary:
      "Bad After Dark was a brand activation for Eddie Maalouf, an evening that looked effortless and still did commercial work for his partners. We took the whole job: strategy, creative direction, production, show flow, and on-site execution. We designed a tightly held room where partner presence was built into the architecture of the night, not bolted onto it. Held in Las Vegas, the night earned $146K in sponsorships in six days.",
    challenge:
      "Sponsorship had to be earned rather than sold. The room needed to feel like an invitation, not an activation, while still giving partners a measurable return.",
    approach: {
      pre: [
        "Set the guest list and room size against what the evening had to return, not a headcount target.",
        "Designed partner presence into the environment before any creative was signed off, with partner logos on the projection wall.",
      ],
      onsite: [
        "Built and ran a single unbroken atmosphere across the evening.",
        "Ran show calling and on-site execution with the same team that designed the room.",
      ],
      post: [], // TODO(copy): what was delivered after the event.
    },
    scope: [
      ["Strategy", "Objective, guest list and format set against what the evening had to return."],
      ["Creative", "Creative direction for a single continuous atmosphere."],
      ["Production", "Lighting, staging and technical build."],
      ["On-site", "Show calling and execution by the design team."],
    ],
    results: "$146K in sponsorships in six days.",
    locationLabel: "Location",
    // TODO(collect): all three metrics.
    metrics: { attendance: null, productionDays: null, costSaved: null },
    details: {
      client: "Eddie Maalouf",
      clientTitle: null,
      venue: null,
      city: "Las Vegas",
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
      "Iconic Events, a Miami and Las Vegas event production company, produced Bad After Dark for Eddie Maalouf in Las Vegas. Iconic Events delivered strategy, creative direction, production, and on-site execution as a single scope.",
    faqs: [
      [
        "Who produced Eddie Maalouf's Bad After Dark?",
        "Iconic Events, a Miami and Las Vegas event production company, produced Bad After Dark for Eddie Maalouf in Las Vegas. Iconic Events delivered strategy, creative direction, production, and on-site execution as a single scope.",
      ],
      [
        "How did Bad After Dark earn $146K in sponsorships?",
        "Bad After Dark earned $146K in sponsorships in six days. It was also a sponsor activation. Iconic Events designed partner presence into the room before any creative was signed off, and partner logos ran across the projection wall.",
      ],
    ],
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
    slug: "creatorhub-live",
    name: "CreatorHub Live",
    headline: "How CreatorHub Live Brought 1,500+ Creators and Entrepreneurs Under One Roof",
    cta: "Want to bring your community under one roof?",
    thirdPerson: true, // Iconic's own event: no first person, no client line.
    summary:
      "CreatorHub Live set out to fill a gap: no event brought entrepreneurs and creators together to learn business and media production, and the biggest event at this capacity belonged to MrBeast. Sponsors and attendees were wary of a brand new event. The answer was a hub model, where other events ran their own stages inside CreatorHub, plus a la carte sponsorships and a Lamborghini painted live at the mixer. More than 1,500 people attended over three and a half days at the JW Marriott Orlando Bonnet Creek in Orlando, and the event is now building toward 3,000 in 2027.",
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
      "Brought a Lamborghini into the JW Marriott Orlando Bonnet Creek to be painted live during the networking mixer, inside a 50 foot glass enclosure built with the Marriott so not a drop of paint touched the venue.",
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
      ["Venue", "Coordination with the JW Marriott Orlando Bonnet Creek, including the Lamborghini enclosure."],
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
      venue: "JW Marriott Orlando Bonnet Creek",
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
      "Iconic Events, a Florida based event production and coordination company, produced CreatorHub Live, its own event co-owned with Xtend Creators, at the JW Marriott Orlando Bonnet Creek in Orlando, Florida in August 2025 for more than 1,500 attendees, delivering event strategy, sponsorship design, the hub model, live podcast studios, three stage production and on site execution.",
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
      aftermovieUrl: "https://youtu.be/nyFd3Z6pqwk",
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Freedom Queen Live 2025 for Bridget James Ling at the Vinoy in St. Petersburg, Florida in November 2025, delivering a Broadway style show with rehearsed dance performances, a flash mob opening and staged butler service for 530 attendees.",
  },

  // Source: docs/case-studies/interviews/commas-air-traffic.md, Icon's answer
  // of 2026-11-23. Client printed as Commas, no person named (Icon). Hand
  // written FAQs, so the generated "Commas's Commas Air Traffic" never shows.
  {
    slug: "commas-air-traffic",
    name: "Commas Air Traffic",
    format: "After party",
    headline: "How Commas Turned a 747 at AREA15 Into an After Party for 400 Guests",
    cta: "Want an after party people talk about all year?",
    summary:
      "Commas wanted an after party worthy of its reputation: a place for the industry to connect, and proof that Commas throws the wildest, most unique parties around. We built it in about a week inside AREA15's brand new plane, a retrofitted 747 rebranded as Air Traffic, with flight attendants and a champagne cart, cigar rollers, performers, magicians, models and a Kanye West impersonator on a custom stage. 400 guests came.",
    challenge: [
      "Commas has a name in the industry as the company that hosts wild, unique parties. During Vegas week it wanted an after party that kept that name: somewhere the industry would come to connect, and a night nobody else could have thrown.",
      "There was about a week to build it, and the room was a 747.",
    ],
    approach: [
      "Took over AREA15's brand new plane, a retrofitted 747, and the sky lounge around it, and rebranded the whole space Air Traffic.",
      "Dressed the night as an airline: performers in flight attendant uniforms, a flight attendant champagne cart, gobos on the plane and a sponsor ticker board like a departures screen.",
      "Filled it with activations: cigar rollers, performers, magicians, models and an ice luge.",
      "Brought in the showstopper, a Kanye West impersonator on a custom stage.",
      "Rolled out a red carpet and step and repeat for Commas and its partners.",
    ],
    challengesOvercome: [
      "The party went from first call to doors in about seven days. We met the venue's food and drink minimum by switching to passed appetizers and a bar charged on consumption, so the plan held without cutting the experience.",
      "Inside the plane, the projector hung too high for the performance. We moved the show outside to the patio, where it played to the crowd in the open air.",
    ],
    scope: [
      ["Concept", "The Air Traffic theme across the plane and the sky lounge."],
      ["Activations", "Cigar rollers, performers, magicians, models and an ice luge."],
      ["Talent", "A Kanye West impersonator on a custom stage, and flight attendant performers."],
      ["Branding", "Gobos on the plane, a sponsor ticker board, and a red carpet step and repeat."],
      ["Production", "Venue, food and drink, and on site execution, built in about a week."],
    ],
    metrics: { attendance: "400", productionDays: null, costSaved: null },
    highlights: [
      ["400", "Guests"],
      ["1", "Retrofitted 747"],
    ],
    results: [
      "400 guests came through the plane by the end of the night. Commas got its after party, a place to connect and another night that kept its name as the company that throws the parties everyone remembers.",
    ],
    rightFor: null,
    stealThis: [
      "Pick a theme and commit to it. A plane became an airline, from the flight attendants to the departures board, and every guest knew where they were the moment they walked in.",
    ],
    details: {
      client: "Commas",
      clientTitle: null,
      venue: "AREA15",
      city: "Las Vegas",
      region: "NV",
      year: "2026",
      dates: "September 21, 2026",
    },
    media: {
      // TODO(collect): photos, coming from Icon.
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
      "Iconic Events, a Florida based event production and coordination company, produced Commas Air Traffic, an after party for Commas inside AREA15's retrofitted 747 in Las Vegas, Nevada on September 21, 2026, delivering the airline theme, live activations, talent and on site execution for 400 guests.",
    faqs: [
      [
        "Who produced the Commas Air Traffic after party?",
        "Iconic Events, a Florida based event production and coordination company, produced Commas Air Traffic, an after party for Commas inside AREA15's retrofitted 747 in Las Vegas, Nevada on September 21, 2026, delivering the airline theme, live activations, talent and on site execution for 400 guests.",
      ],
      [
        "What did Iconic Events deliver for Commas Air Traffic?",
        "Concept: the Air Traffic theme across the plane and the sky lounge. Activations: cigar rollers, performers, magicians, models and an ice luge. Talent: a Kanye West impersonator on a custom stage, and flight attendant performers. Branding: gobos on the plane, a sponsor ticker board, and a red carpet step and repeat. Production: venue, food and drink, and on site execution, built in about a week.",
      ],
      [
        "How many people attended Commas Air Traffic?",
        "400 guests.",
      ],
    ],
  },

  // Source: docs/case-studies/interviews/bad-takeover-2026.md, Icon's answer
  // of 2026-11-22. Not to be confused with Bad After Dark (January 2024).
  // Attendance is the highest count on record (the AREA15 planning call).
  {
    slug: "bad-takeover-2026",
    name: "Bad Takeover 2026",
    format: "Brand activation",
    headline: "How Bad Takeover Became the Party to Be at After Funnel Hacking Live, and Handed Its Sponsors the Whole Room",
    cta: "Want the party everyone goes to after the main event?",
    summary:
      "Every Funnel Hacking Live, Eddie Maalouf's BAD Marketing throws Bad Takeover, the party the industry heads to when the main event closes. For 2026 Eddie wanted something attendees had not seen: not another night of projection mapping and gambling, but the hub, the place to be. We added a hookah lounge, brought back the custom branded casino tables with every sponsor's logo on the felt, and turned the projection wall over to the sponsors, each with a spotlight of their own content on rotation. 900 guests came.",
    challenge: [
      "Every Funnel Hacking Live, Eddie Maalouf's BAD Marketing throws Bad Takeover, a party that rides alongside the main event and brings the industry, and its sponsors, into one room.",
      "For 2026 Eddie wanted something attendees had not seen before. Projection mapping and gambling had become what people expected. This year the party had to be the hub: the place everyone wanted to be the moment Funnel Hacking Live closed.",
    ],
    approach: [
      "Built a hookah lounge on site, an intimate place to sit, talk and stay.",
      "Brought back the custom branded blackjack and casino tables, with every sponsor's logo on the felt.",
      "Turned the projection mapping wall over to the sponsors: each had a spotlight of their own content, cycling through the night, so the sponsors took over the whole room.",
      "Held it at AREA15 in Las Vegas, the home of every BAD party.",
    ],
    challengesOvercome: null,
    scope: [
      ["Concept", "A new format for the party: the hub after Funnel Hacking Live."],
      ["Lounge", "An on site hookah lounge."],
      ["Casino", "Custom branded blackjack and casino tables carrying every sponsor's logo."],
      ["Sponsors", "A content spotlight for each sponsor on the projection mapping wall."],
      ["Venue", "AREA15, Las Vegas."],
    ],
    metrics: { attendance: "900", productionDays: null, costSaved: null },
    highlights: [
      ["900", "Guests"],
    ],
    results: [
      "Bad Takeover was the place to be after Funnel Hacking Live, and 900 guests came. Sponsors did not get a booth. They took over the whole room.",
    ],
    rightFor: null,
    stealThis: [
      "Give every sponsor the room, not a booth: a spotlight of their own on the projection wall, cycling all night.",
    ],
    details: {
      client: "Eddie Maalouf",
      clientTitle: null,
      venue: "AREA15",
      city: "Las Vegas",
      region: "NV",
      year: "2026",
      dates: "September 22, 2026",
    },
    media: {
      // TODO(collect): photos.
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
      "Iconic Events, a Florida based event production and coordination company, produced Bad Takeover 2026 for Eddie Maalouf of BAD Marketing at AREA15 in Las Vegas, Nevada on September 22, 2026, after Funnel Hacking Live, delivering a hookah lounge, custom branded casino tables and sponsor spotlights on the projection mapping wall for 900 guests.",
  },

  // Source: docs/case-studies/interviews/pmu-at-sea.md, Icon's answers of
  // 2026-11-22. Sponsors may be named (Icon). No cost saved by Icon's call.
  {
    slug: "pmuw-at-sea",
    name: "PMU World at Sea",
    format: "Conference",
    headline: "How PMU World Took 455 Attendees to Sea and Bought Danny Tran the Time to Build Beauty World",
    cta: "Want to keep your community's momentum while you build what's next?",
    summary:
      "After three years of PMU World growing every year, Danny Tran is preparing its next leap: Beauty World, a 5,000 to 10,000 person event that takes a year or two to build. To keep the momentum without another ballroom, we suggested taking PMU World to sea. On Wonder of the Seas, from Miami to Nassau and CocoCay, 455 attendees learned in the ship's main theater by day and trained hands on with mentors in the afternoons, with every sponsor's razors, machines and pigments cleared through port security.",
    challenge: [
      "PMU World has grown every year since its first edition, and Danny Tran, founder and CEO of Highstoke Media, is preparing the next leap: Beauty World, the jump from a 2,000 person conference to a 5,000 to 10,000 person one. A jump that size takes a year or two to build.",
      "Danny needed that time without losing the momentum of an annual event. Our answer was a different format: take PMU World onto a cruise ship, a closer, more intentional and more connected version of the event than had ever been done in the industry, and build Beauty World behind it.",
    ],
    approach: [
      "Suggested the format: PMU World at sea, a closer and more connected edition to hold the community together while Beauty World is built.",
      "Built the program around the ship: education in the main theater by day, and afternoon workshops where VIPs trained hands on alongside the mentors.",
      "Oversaw the logistics of every sponsor shipment, from Hanafy, MAST PMU, Tina Davies, NUE and the American Academy of Micropigmentation, shipped far earlier than usual and cleared by international and port security.",
      "Ran the AV ourselves on board, with no outside AV company: confidence monitors, capture and the master slideshow.",
      "Packed the sponsor bags on board, two extra cabins and long days of prep, and managed boarding with porters.",
      "Opened the week with a welcome mixer in the Solarium, and kept a content team on the program throughout.",
    ],
    challengesOvercome: [
      "At sea, nothing can be bought once the ship leaves, and an attendee who misses boarding misses the event. Every item and every arrival had to be planned for in advance, with no second chance.",
      "Workshop kits are not things you walk onto a ship: razors, tattoo machines and pigments. Every sponsor's materials shipped far earlier than any hotel event needs and were cleared by international and port security, with the paperwork to match. We oversaw all of it, so every sponsor could lead their workshop.",
    ],
    scope: [
      ["Format", "The cruise concept, to hold momentum while Beauty World is built."],
      ["Program", "Theater sessions by day and hands on VIP workshops with mentors."],
      ["Sponsor logistics", "Shipping and security clearance for every sponsor's workshop materials. The sponsorships themselves were sold and managed by Danny's team, not by us."],
      ["AV", "AV run in house on board."],
      ["Logistics", "Sponsor bags, boarding and the welcome mixer."],
      ["Content", "A content team throughout the program."],
    ],
    metrics: { attendance: "455", productionDays: null, costSaved: null },
    highlights: [
      ["455", "Attendees at sea"],
      ["2", "Ports of call, Nassau and CocoCay"],
    ],
    results: [
      "The format gave attendees something no land event could: constant community. Nobody went home at night. They woke up and had breakfast together, went to the sessions together, went ashore in Nassau and CocoCay together, and found each other at the pool after the program ended.",
      "It was a huge success. Attendees who have come for years loved it, and first timers found a new home in the PMU community. Many cited it as the breakthrough they needed, or the assurance to keep going.",
      "It also gave Danny the breathing room he needed to focus on the wider vision: Beauty World, planned for late 2027 or 2028.",
    ],
    rightFor: "An established event brand with a community that already knows and trusts it, and has been to the experience before. A cruise is a fun extension of an event that works, never a first event.",
    stealThis: [
      "When you need a year to build something bigger, change the format, not the calendar. A smaller, closer edition keeps the community together and buys the time.",
    ],
    details: {
      client: "Danny Tran",
      clientTitle: "Founder and CEO, Highstoke Media",
      venue: "Wonder of the Seas",
      city: "Miami",
      region: "FL",
      year: "2026",
      dates: "October 12 to 16, 2026",
    },
    media: {
      // From the PMU World at Sea gallery on photos.iconic.events (Iconic's
      // own content team).
      hero: { src: "/images/gallery/pmuw-at-sea/01.webp", alt: "Hundreds of PMU World at Sea attendees gathered on the main theater stage under the PMU World at Sea backdrop, aboard Wonder of the Seas" },
      challenge: { src: "/images/gallery/pmuw-at-sea/02.webp", alt: "Sponsor workshop kits laid out on a table, cartridges, tools and pigments for the hands on sessions at PMU World at Sea, aboard Wonder of the Seas" },
      band: { src: "/images/gallery/pmuw-at-sea/03.webp", alt: "Attendees dressed in white filling the dance floor at the PMU World at Sea VIP party, aboard Wonder of the Seas" },
      resultLeft: { src: "/images/gallery/pmuw-at-sea/04.webp", alt: "Attendees cheering with arms raised in the ship's main theater at PMU World at Sea, aboard Wonder of the Seas" },
      resultRight: { src: "/images/gallery/pmuw-at-sea/05.webp", alt: "Three attendees smiling at a hands on workshop table at PMU World at Sea, aboard Wonder of the Seas" },
      gallery: [
        { src: "/images/gallery/pmuw-at-sea/06.webp", alt: "An attendee at the PMU World at Sea 2026 shell and coral photo wall, aboard Wonder of the Seas" },
        { src: "/images/gallery/pmuw-at-sea/07.webp", alt: "A speaker on the main theater stage in front of the PMU World at Sea backdrop, aboard Wonder of the Seas" },
        { src: "/images/gallery/pmuw-at-sea/08.webp", alt: "Two attendees holding up PMU World signs on the pool deck at night, aboard Wonder of the Seas" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced PMU World at Sea for Danny Tran of Highstoke Media aboard Wonder of the Seas from Miami to Nassau and CocoCay in October 2026, delivering the cruise format, theater and workshop program, sponsor shipping and security clearance, and onboard AV for 455 attendees.",
    faqExtra: [
      [
        "How do you host a conference on a cruise ship?",
        "Plan for a venue where nothing can be bought once it sails and late arrivals miss the event. For PMU World at Sea, Iconic Events shipped every sponsor's workshop materials far earlier than a hotel event needs and cleared them through international and port security, ran the AV on board, held sessions in the ship's main theater and workshops in the afternoons, and managed boarding for 455 attendees.",
      ],
    ],
  },

  // Source: docs/case-studies/interviews/scale-or-sell.md, draft v2 and
  // Icon's answers of 2026-11-22. A coaching engagement presented like Hell
  // Yes Live: Icon coached, Pablo ran the days on site. The testimonial and
  // a testimonial video are to come from Cameron.
  {
    slug: "scale-or-sell",
    name: "Scale or Sell",
    format: "Mastermind",
    approachLead: "Icon coached Cameron and his team from the first plan to the event. Pablo ran all three days on site.",
    headline: "How Scale or Sell Sold Out a Month Early and Became Cameron England's Best Event Yet, Inside a Fort Lauderdale Motor Club",
    cta: "Want your next event to be your best one yet?",
    summary:
      "Cameron England's earlier events had strong content and poor execution: bad venues and mic failures that pulled him into logistics when he should have been teaching and selling. For Scale or Sell he hired Icon as his event coach. We moved the dates away from Thanksgiving travel, took the mastermind into the Rebel Motor Club in Fort Lauderdale, cut $14,000 from the venue and AV, and had Pablo run all three days on site. It sold out a month early with a waitlist, and 150 attendees came.",
    challenge: [
      "Cameron England runs License and Scale. His earlier live events had strong content but poor execution, from bad venues to mic failures, and every problem landed on him. Instead of teaching and selling, he spent his own events running logistics.",
      "His last event, in Dubai, was run to a good standard (but the venue had no aura). For Scale or Sell he wanted a step change: a bigger room than ever before, a venue people would remember, and the best event he had run.",
    ],
    approach: [
      "Coached Cameron and his team through weekly calls and one playbook for the whole event.",
      "Took the event out of the hotel ballroom and into the Rebel Motor Club, so that every photo and every story told anyone following along that this was a Cameron England event. Attendees spent three days surrounded by Ferrari F40s, Lamborghini Aventadors and classic Mercedes, a step through the history of wealth, and the event avoided hotel contracts altogether.",
      "Negotiated the venue from $30,000 to $20,000, and helped Cam's team bring the AV from $18,000 to $14,000.",
      "Turned the cars into the brand: Cam's logo on the side of a Lamborghini Aventador.",
      "Packed the attendee gifts as stim packs, energy drinks and Zyn pouches inside Cam's branded boxes, to keep the room switched on.",
      "Briefed the on site team, then Pablo ran all three days: a VIP day and an evening mixer on Friday, two main days, and a VIP dinner on Saturday at MAASS in the Four Seasons.",
    ],
    challengesOvercome: [
      "The first plan put the event in Miami across Sunday to Tuesday, the week before Thanksgiving. We moved it to a Friday to Sunday, so nobody had to choose between the mastermind and travelling home.",
      "A motor club is not a hotel. We built the room from nothing: 132 seats on the floor and a mezzanine above, with 150 upgraded chairs, because Cam would not put his attendees in plastic ones.",
    ],
    scope: [
      ["Coaching", "Weekly calls with Cameron and his team."],
      ["Systems", "One playbook for the whole event."],
      ["Venue", "The Rebel Motor Club, set for a mastermind, with no hotel contracts."],
      ["Negotiations", "The venue from $30,000 to $20,000, and the AV from $18,000 to $14,000."],
      ["Experience", "The branded Aventador and the stim pack gifts."],
      ["Schedule", "New dates clear of Thanksgiving travel."],
      ["On site", "Day of coordination for all three days."],
    ],
    metrics: {
      attendance: "150",
      productionDays: null,
      costSaved: "$14,000",
      costSavedBasis: "Iconic Events negotiated the Rebel Motor Club from $30,000 to $20,000 and helped Cameron England's team bring the AV from $18,000 to $14,000 for Scale or Sell.",
    },
    highlights: [
      ["150", "Attendees"],
      ["30", "Days early, sold out with a waitlist"],
      ["$14K", "Saved on the venue and AV"],
    ],
    results: [
      "Scale or Sell sold out a month before the doors opened, with a waitlist of people asking for tickets, and 150 attendees came. The jump in quality from Cam's earlier events was obvious to the people who had been to them, and Cam called it his best event ever.",
      "The room did its job before anyone spoke. The speakers were amazed when they walked in, surrounded by Ferrari F40s, Aventadors and classic Mercedes, and every photo from the weekend could only have come from a Cameron England event.",
    ],
    rightFor: "Hosts ready to kick off a mastermind who are not yet ready for a big hotel contract or a full AV build. A smaller, memorable venue that you bring the AV into, with an event coach in your corner, is the format to start with.",
    stealThis: [
      "Make your event an extension of your brand. Cameron is loud and outrageous, and he owns it, so his attendee gifts were stim packs: energy drinks and Zyn pouches in his own branded boxes. Attendees felt closer to him for it. Plan on carrying your brand inside the walls of your event.",
    ],
    details: {
      client: "Cameron England",
      clientTitle: "Founder, License and Scale",
      venue: "Rebel Motor Club",
      city: "Fort Lauderdale",
      region: "FL",
      year: "2026",
      dates: "November 6 to 8, 2026",
    },
    media: {
      // From Icon, 23 Nov 2026. TODO(collect): Cameron's testimonial video.
      hero: { src: "/images/gallery/scale-or-sell/01.webp", alt: "Rows of attendees at their tables watching the stage, vintage and new cars racked on the wall behind them and chandeliers overhead, at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
      challenge: { src: "/images/gallery/scale-or-sell/02.webp", alt: "Cameron England in white on stage in front of the room at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
      band: { src: "/images/gallery/scale-or-sell/03.webp", alt: "The whole group outside the motor club, arms in the air, beside a red sports car, at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
      resultLeft: { src: "/images/gallery/scale-or-sell/04.webp", alt: "Cameron England on stage under the License and Scale logo at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
      resultRight: { src: "/images/gallery/scale-or-sell/05.webp", alt: "The matte black Lamborghini Aventador with the License and Scale logo on its door, attendees gathered around it outside, at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
      gallery: [
        { src: "/images/gallery/scale-or-sell/06.webp", alt: "Guests at a candlelit table at the Saturday VIP dinner at MAASS in the Four Seasons, Scale or Sell menus at every place, Fort Lauderdale" },
        { src: "/images/gallery/scale-or-sell/07.webp", alt: "The evening mixer seen from above, attendees talking at the bar under the chandeliers, at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
        { src: "/images/gallery/scale-or-sell/08.webp", alt: "The full room from the mezzanine, rows of attendees at laptops, slides on screens either side and cars racked along the wall, at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
        { src: "/images/gallery/scale-or-sell/09.webp", alt: "The matte black Lamborghini Aventador inside the club, its door raised to show the License and Scale logo, under the chandeliers at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
        { src: "/images/gallery/scale-or-sell/10.webp", alt: "A guest speaker on stage under the License and Scale logo, the room at their tables at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
        { src: "/images/gallery/scale-or-sell/11.webp", alt: "Cameron England on stage seen from the back of the room, cars racked along the wall and chandeliers overhead, at Scale or Sell, the Rebel Motor Club, Fort Lauderdale" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    // TODO(collect): Cameron's testimonial, with written permission. It
    // replaces "Cam called it his best event ever" in results.
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, coached Cameron England through Scale or Sell, a mastermind at the Rebel Motor Club in Fort Lauderdale, Florida in November 2026, delivering event coaching, venue and AV negotiations saving $14,000, and day of coordination for 150 attendees.",
    faqExtra: [
      [
        "What are cool event venues in Fort Lauderdale?",
        "The Rebel Motor Club in Fort Lauderdale hosted Scale or Sell 2026, a mastermind for 150 surrounded by vintage and modern cars, from Ferrari F40s to Lamborghini Aventadors, with 132 seats on the floor and a mezzanine above. Iconic Events coached the host through the event.",
      ],
      [
        "What are unique venues to host a business conference?",
        "Look for a space that already says something about your brand. Scale or Sell held its mastermind in a Fort Lauderdale motor club rather than a hotel ballroom, so every photo and story marked it as a Cameron England event, and it avoided hotel contracts altogether.",
      ],
    ],
  },

  // Source: docs/case-studies/interviews/freedom-queen-live-2026.md, draft v3,
  // approved by Iconic 2026-11-22. No cost saved by Iconic's call: our role
  // was coordination and liaison, not production.
  {
    slug: "freedom-queen-live-2026",
    name: "Freedom Queen Live 2026",
    format: "Conference",
    approachLead: "Day of coordination: we ran the event and managed every team on site, so Bridget and her team could focus on the stage. Her team held the venue, AV and stage design contracts.",
    headline: "How Freedom Queen Live Took 359 Women Business Owners to Miami to Redefine What Freedom Means",
    cta: "Want an event that moves your community forward, wherever it meets?",
    summary:
      "Freedom Queen Live is the three day conference for women in business who sell high ticket offers, lead movements and are ready to scale, and its promise is freedom: a company that keeps growing without its founder as the constant face of the brand. For year three, Bridget James Ling moved it from St. Petersburg to Miami, within reach of women flying in from as far as Hong Kong. We coordinated the conference for 359 attendees. Bridget, who has trusted us with it three years in a row, is already planning 2027.",
    challenge: [
      "Freedom Queen Live is for women who were born to lead: founders who sell high ticket offers, want to become known for their work and are building companies that compound year after year. Freedom, as Bridget James Ling teaches it, is a business that keeps growing without its founder as the constant face of the brand.",
      "After two years at the Vinoy in St. Petersburg, Bridget wanted the event where the real motion in business is. Miami is the hub for where commerce and business owners are going, and an international one: her community travels from as far as Hong Kong and New Zealand. Year three had to move cities without losing what made it Freedom Queen.",
    ],
    approach: {
      pre: [
        "Stepped into Bridget's team and its systems with very little lead time, and became the single liaison between her team, the hotel and every supplier.",
        "Built and owned the run of show across three show days.",
      ],
      onsite: [
        "Ran the general sessions in the Royal Ballroom, the Diamond and Platinum lunches and the Platinum Dinner on the Veranda.",
        "Reprinted every badge on site with tiered QR codes.",
      ],
      post: [],
    },
    challengesOvercome: [
      "We came in with very little preparation time. The job was to fit into an ecosystem Bridget's team had already built, take the running of the event off their hands and drive it forward, without changing what made it theirs.",
      "Bridget's own team held the venue, AV, vendors, security and stage design for the first time. We kept one plan across all of them as the single liaison, so nobody worked from an old version.",
      "Registration needed new badges on site. We reprinted every one overnight, laminated, with a QR code for each ticket tier, before doors opened.",
    ],
    scope: [
      ["Day of coordination", "Running the event and managing every team on site, so Bridget's team could focus on the stage."],
      ["Run of show", "Run of show for three show days."],
      ["Liaison", "One point of contact across the hotel, AV, vendors and security, all contracted by the client."],
      ["Registration", "Badges with tiered QR codes, reprinted on site."],
    ],
    metrics: { attendance: "359", productionDays: null, costSaved: null },
    highlights: [
      ["359", "Women business owners"],
      ["3", "Years in a row Bridget has trusted us with Freedom Queen Live"],
    ],
    results: [
      "Freedom Queen Live drew 359 women to its first year in Miami, business owners from across the United States and around the world, across Gold, Diamond and Platinum tiers.",
      "Three days ran on the themes of Excellence, Sales and Growth, from the first Freedom Queen Live mastermind session to an award ceremony that celebrated the community's wins on stage, in front of everyone. Bridget is already planning Freedom Queen Live 2027.",
      "It was the third year in a row Bridget trusted us with Freedom Queen Live, from her first event at the Vinoy to her first in Miami.",
    ],
    rightFor: "Any woman bringing womanhood forward: founders and leaders whose events gather women in business, and who want a team to run the event so they can lead from the stage.",
    stealThis: [
      "Make media night a photo shoot for every attendee. Freedom Queen Live set up stations, each with its own activation and intention, so every woman left with content of her own from the event.",
    ],
    details: {
      client: "Bridget James Ling",
      clientTitle: "CEO, Freedom Queen",
      venue: "JW Marriott Miami Turnberry Resort & Spa",
      city: "Aventura",
      region: "FL",
      year: "2026",
      dates: "November 19 to 21, 2026",
    },
    media: {
      // TODO(collect): more photos and the aftermovie from the content team.
      hero: { src: "/images/gallery/freedom-queen-live-2026/01.webp", alt: "Bridget James Ling speaking on stage under the Freedom Queen backdrop to a ballroom of women at Freedom Queen Live 2026, JW Marriott Miami Turnberry, Aventura, Florida" },
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
      "Iconic Events, a Florida based event production and coordination company, coordinated Freedom Queen Live 2026 for Bridget James Ling of Freedom Queen at the JW Marriott Miami Turnberry Resort & Spa in Aventura, Florida in November 2026, delivering day of coordination, run of show and supplier liaison for 359 attendees.",
    faqExtra: [
      [
        "How do you coordinate a women's business conference?",
        "Decide who runs what before anything else. At Freedom Queen Live 2026, the host's own team held the venue, AV and stage contracts, and Iconic Events ran day of coordination: one liaison across every supplier, the run of show, and every team on site, so the founder could lead from the stage instead of running logistics.",
      ],
      [
        "Where can you hold a women's business conference in Miami?",
        "Freedom Queen Live 2026 brought 359 women business owners to the JW Marriott Miami Turnberry Resort & Spa in Aventura, with general sessions in the Royal Ballroom and VIP lunches and dinners on the Veranda. Iconic Events, a Florida based event production and coordination company, coordinated it.",
      ],
    ],
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "pmuw-2023",
    name: "PMU World 2023",
    headline: "How Danny Tran Defied the Odds and Built the Largest Permanent Makeup Event in North America on His First Try",
    cta: "Want to build the biggest event in your industry?",
    summary:
      "The permanent makeup industry's largest live event drew about 300 people. Danny Tran, founder and CEO of Highstoke Media, wanted to build the biggest one in North America with a seven month old brand, no attendee list and an industry that doubted him. We ran teaser videos while the venue was still being secured, took the Seminole Hard Rock in Hollywood, Florida, ran two stages like a music festival and built more than 16 interactive installations ourselves. More than 800 attendees came, against a projection of 600.",
    challenge: [
      "The permanent makeup industry had been underserved for too long: its largest live event drew only about 300 people. Danny Tran wanted to blow that out of the water, and not with another boring PMU conference. He wanted workshops and business combined, and he wanted it to be the largest PMU event in the country.",
      "This was the first PMU World. The brand was only seven months old, with no attendee list and no past footage to market with, and Danny had never run an event this size. We had five months to build it.",
    ],
    approach: [
      "Ran teaser videos while the venue was still being secured, building curiosity before there was anything to buy. When they landed, ticket sales jumped from 100 to over 300 overnight.",
      "Secured the Seminole Hard Rock Hotel & Casino Hollywood, the Guitar Hotel, on one of the most popular weekends of the year.",
      "Ran two stages at once like a music festival: one for business, one for practice, so attendees could learn and do on site. Added a sponsor hall and a VIP area.",
      "Built more than 16 interactive installations ourselves, made for selfies and content, after South Florida installation companies could not produce what we needed.",
    ],
    challengesOvercome: [
      "Nobody believed in this event. Danny ran a marketing agency in an industry that is mostly women, and many doubted a man could pull it off. No permanent makeup event had ever been attempted at this size, and the brand was only seven months old, with no attendee list and no past footage to show.",
      "So the event had to prove itself before anyone could see it. Teaser videos built the story while the venue was still being secured, and when they landed, ticket sales jumped from 100 to over 300 overnight. By the event, more than 800 people were on site, against a projection of 600.",
    ],
    scope: [
      ["Coordination", "Planning and coordination from first concept to the last day."],
      ["Production", "Two stages run at once, one for business and one for practice."],
      ["Content", "Teaser videos and event content."],
      ["Installations", "More than 16 interactive installations, built in house."],
      ["Attendees", "Attendee management."],
      ["Negotiations", "Venue and vendor negotiations, saving $148,000 off contracts."],
      ["Sponsors", "Sponsorship management and the sponsor hall."],
      ["Speakers", "Speaker management."],
      ["Post", "Post production content."],
    ],
    metrics: { attendance: "800+", productionDays: null, costSaved: "$148,000", costSavedBasis: "Iconic Events negotiated $148,000 off the venue and vendor contracts for PMU World 2023." },
    highlights: [
      ["800+", "Attendees on site, against 600 projected"],
      ["#1", "Largest PMU event in North America"],
      ["$148K", "Saved off contracts"],
    ],
    results: [
      "More than 800 attendees were on site, against a projection of 600, making it the largest PMU event in North America. Seven months earlier the brand did not exist.",
      "Attendees loved the two stage format and left wanting to come back next year.",
    ],
    rightFor: "Female beauty entrepreneurs and salon owners in an underserved niche, and the founders who serve a niche like that and want to give it an event of its own.",
    stealThis: [
      "The riches are in the niches. PMU World could have been a beauty world or a beauty con, and it would have been too wide. Focusing on permanent makeup, a corner of the beauty industry many people do not even know exists, made a room built for one group of people, where they felt at home and every session and piece of content was made for them.",
      "Sell the story before the venue is signed. Teaser videos that ran while the Hard Rock was still being secured took ticket sales from 100 to over 300 overnight.",
    ],
    details: {
      client: "Danny Tran",
      clientTitle: "Founder and CEO, Highstoke Media",
      venue: "Seminole Hard Rock Hotel & Casino",
      city: "Hollywood",
      region: "FL",
      year: "2023",
      dates: null,
    },
    media: {
      // TODO(confirm): photographer credit and usage rights. Aftermovie link to come.
      hero: { src: "/images/gallery/pmuw-2023/02.webp", alt: "Organizers and speakers behind giant PMU WORLD letters in front of the full ballroom at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
      challenge: { src: "/images/gallery/pmuw-2023/18.webp", alt: "An attendee asking a question into a microphone during a session at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
      band: { src: "/images/gallery/pmuw-2023/03.webp", alt: "Two speakers on the main stage facing a packed, darkened ballroom at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
      resultLeft: { src: "/images/gallery/pmuw-2023/19.webp", alt: "A hands on practice session, an artist working on a training mannequin at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
      resultRight: { src: "/images/gallery/pmuw-2023/04.webp", alt: "Attendees dancing and celebrating on the ballroom floor at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
      gallery: [
        { src: "/images/gallery/pmuw-2023/05.webp", alt: "A crowd of attendees posing together at the evening party at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/08.webp", alt: "Attendees filling the pool deck at sunset at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/13.webp", alt: "An attendee listening under purple stage light at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/16.webp", alt: "Attendees on their feet at their tables during the general session at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/17.webp", alt: "Attendees taking notes at their tables at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/20.webp", alt: "Attendees cheering a guest walking through the ballroom at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/07.webp", alt: "Attendees dancing at the party at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/12.webp", alt: "A group of attendees relaxing poolside at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
        { src: "/images/gallery/pmuw-2023/15.webp", alt: "Attendees filming the stage from the floor at PMU World 2023, the Seminole Hard Rock Hotel & Casino in Hollywood, Florida" },
      ],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced the first PMU World for Danny Tran of Highstoke Media at the Seminole Hard Rock Hotel & Casino in Hollywood, Florida in April 2023, delivering coordination, production, content, installation buildout and attendee, sponsorship and speaker management for more than 800 attendees.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "pmuw-2024",
    name: "PMU World 2024",
    headline: "How PMU World Grew to 1,237 Attendees in Year Two by Making the Room Smaller",
    cta: "Want year two to beat year one?",
    summary:
      "For year two of PMU World, Danny Tran wanted an elegant sponsor hall and a room where sponsors got real value. We halved the room, cut to one stage, opened a sponsor hall and a new expo floor sold in smaller packages, and turned the ballrooms into compliant stations for live tattoo workshops. When a tropical storm delayed shipments, backup vendors lined up a week earlier kept everything on schedule, down to badges reprinted at a local print shop. Attendance grew to 1,237 over three days in August 2024.",
    challenge: [
      "Year one proved PMU World could fill a room. Year two had to make that room work harder. Danny Tran wanted an elegant sponsor hall and an event where sponsors got real value, without losing what attendees loved.",
      "The rules changed too. New Florida requirements meant an ASL interpreter request and registration rules for the live tattoo workshops, on top of a bigger crowd.",
    ],
    approach: [
      "Halved the size of the room and went from two stages to one, with one major sponsor hall beside it.",
      "Sold smaller sponsorship packages, so more brands could buy in, and used that room to open a new expo floor.",
      "Covered the ballroom floors end to end in visqueen plastic, turning them into temporary, near medical grade stations for the live tattoo workshops.",
      "Started sourcing backup local vendors a week out, the moment a tropical storm appeared on the forecast, and made the virtual options far more deliberate for attendees the storm might keep at home.",
    ],
    challengesOvercome: [
      "An ASL interpreter request would have broken the budget. Instead we turned on a real time caption service on the event livestream, which the attendee could follow from the crowd. It met the accommodation and cost Danny nothing.",
      "A tropical storm came out of nowhere. Because backup vendors were already lined up a week out, delayed shipments did not stop the event, and attendees held back by the storm still had a deliberate way to take part virtually. When the badges did not arrive, a local vinyl print shop printed them on a different cardstock, on time and still with the luxury feel.",
    ],
    scope: [
      ["Floor plan", "The room halved, one stage, a sponsor hall and a new expo floor."],
      ["Sponsorship", "Smaller sponsorship packages, so more brands could buy in."],
      ["Compliance", "Visqueen floors and stations for the live tattoo workshops under new Florida rules."],
      ["Access", "A real time caption service on the livestream for the ASL request."],
      ["Contingency", "Backup local vendors and virtual options ahead of a tropical storm."],
      ["Badges", "Badges reprinted at a local vinyl print shop when shipments were delayed."],
      ["Production", "Production and on site execution."],
    ],
    metrics: { attendance: "1,237", productionDays: "3", costSaved: null },
    highlights: [
      ["1,237", "Attendees, up from 800+ in year one"],
      ["1", "Stage, focused, with a full expo floor beside it"],
    ],
    results: [
      "PMU World grew to 1,237 attendees in its second year, up from more than 800 in 2023. Attendees enjoyed the new expo floor more than the old format, sponsors got better value from a single, focused hall, and the event felt more dynamic for everyone in it.",
    ],
    rightFor: "Female beauty entrepreneurs and salon owners in an underserved niche, and the founders who serve a niche like that, along with any conference or expo that wants its sponsors and its attendees to both come out ahead.",
    stealThis: [
      "Sell year two with year one. A soft launch in December used a teaser cut from the 2023 footage, so the event sold on proof instead of promises.",
      "Sell next year in the room. Pre-sale tickets for 2025 went on sale at the 2024 event itself, while attendees were at their most convinced.",
    ],
    details: {
      client: "Danny Tran",
      clientTitle: "Founder and CEO, Highstoke Media",
      venue: "Seminole Hard Rock Hotel & Casino",
      city: "Hollywood",
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
      aftermovieUrl: "https://youtu.be/ZYvRLFzl59o",
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced PMU World 2024 for Danny Tran of Highstoke Media at the Seminole Hard Rock Hotel & Casino in Hollywood, Florida in August 2024, delivering a single stage show with a sponsor hall and new expo floor, compliant live tattoo workshop stations and storm contingency planning for 1,237 attendees.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "pmuw-2025",
    name: "PMU World 2025",
    headline: "How PMU World Reached 2,000 Attendees in Year Three by Building the Event for Social",
    cta: "Want an event that keeps selling after it ends?",
    summary:
      "For year three of PMU World, Danny Tran wanted the event to live on social media as much as in the room. We hired red carpet hosts, built social first installations and put an editor on site for daily recaps and sponsor testimonial cuts, all recorded in 4K. Focusing the show on one main stage saved $140,000 on AV and made room for more sponsor booths. Over four days in September 2025, 1,500 people came in person and 500 joined virtually, and about 130 rooms for the 2026 cruise were booked within a week.",
    challenge: [
      "By year three, PMU World had the room and the sponsors. Danny Tran wanted the event to travel further than the room: less straight event footage, more social content that attendees and creators would actually post.",
    ],
    approach: [
      "Returned to the Seminole Hard Rock Hotel & Casino Hollywood for a third year.",
      "Hired red carpet hosts to turn arrivals into content.",
      "Built more installations designed to be shared on social media.",
      "Put an editor on site to cut daily recap videos, and gave sponsors testimonial cuts for their own decks. Every session was recorded in 4K.",
      "Focused the show on one main stage, saving $140,000 on AV, and traded the VIP lounge for more sponsor booths.",
      "Moved the closing party to the Hard Rock's own pool areas.",
    ],
    challengesOvercome: null,
    scope: [
      ["Social", "Social content strategy and red carpet hosts."],
      ["Installations", "Installations designed to be shared on social media."],
      ["Content", "An on site editor for daily recaps, sponsor testimonial cuts and 4K recording."],
      ["Layout", "One main stage, saving $140,000 on AV, and more sponsor booths in place of the VIP lounge."],
      ["Closing party", "The closing party on the Hard Rock's own pool areas."],
      ["Production", "Production and on site execution."],
    ],
    metrics: { attendance: "1,500", productionDays: "4", costSaved: "$140,000", costSavedBasis: "Focusing PMU World 2025 on one main stage saved the client $140,000 on AV." },
    highlights: [
      ["1,500", "Attendees in person"],
      ["500", "Attendees virtual"],
      ["$140K", "Saved on AV"],
    ],
    results: [
      "PMU World reached 1,500 attendees in person and 500 more virtually in its third year. The daily recaps, sponsor testimonial cuts and 4K recordings gave the event a life well beyond the room.",
      "Within a week of the show, about 130 rooms were already booked for the 2026 PMU World cruise.",
    ],
    rightFor: "Founders in permanent makeup and the neighboring corners of the beauty industry, who want an event that lives on social media as much as in the room.",
    stealThis: [
      "Hire red carpet hosts. Arrival becomes a moment worth posting, and the event's social content starts before the first session does.",
    ],
    details: {
      client: "Danny Tran",
      clientTitle: "Founder and CEO, Highstoke Media",
      venue: "Seminole Hard Rock Hotel & Casino",
      city: "Hollywood",
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
      "Iconic Events, a Florida based event production and coordination company, produced PMU World 2025 for Danny Tran of Highstoke Media at the Seminole Hard Rock Hotel & Casino in Hollywood, Florida in September 2025, delivering social content strategy, red carpet hosts, social first installations, on site editing and 4K recording for 1,500 attendees in person and 500 virtually.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "decentralized-masters-live",
    name: "Decentralized Masters Live",
    headline: "How Decentralized Masters Turned Its First Live Event Into a High Ticket Club With 30+ New Members",
    cta: "Want your community's first event to launch your next offer?",
    summary:
      "Tan and Salim, co-founders of Decentralized Masters, had a community of accredited investors from around the world and no live event behind them. We designed their first, at the Fontainebleau Miami Beach, opening with a VIP mixer in the Presidential Suite. When war broke out where they were staying, we worked with the Eden Roc to waive $51,000 in hotel attrition fees and kept the event on track. About 280 investors attended, more than 30 joined the new Inflection Club, and attendees asked for the next one.",
    challenge: [
      "Tan and Salim had built a community of accredited investors, an established and discerning group. They wanted to bring them together in person for the first time, to impress them and connect them with the team, but they did not know where to start. This was their first live event, and the guests were coming from countries and cultures around the world.",
    ],
    approach: [
      "Took the Fontainebleau's Presidential Suite for the VIP opening mixer, negotiating it from $22,000 a night down to $16,000, so the first night opened in a penthouse with views over the ocean and the whole city.",
      "Moved fast when plans changed, from hotel commitments to the program, so attendees never felt the pivots.",
    ],
    challengesOvercome: [
      "Shortly before the event, war broke out where Tan and Salim were staying in Dubai, and the hotel commitments became almost impossible to honor. Plenty of event companies would have walked away. We went to the Eden Roc and worked with them to waive the contractual hotel commitments, which saved the client $51,000 in attrition fees they would otherwise have had to pay, and the event went ahead.",
    ],
    scope: [
      ["Event design", "Their first live event, designed from the ground up for an established investor community."],
      ["Venue", "The Fontainebleau Miami Beach, with rooms at the Eden Roc."],
      ["Negotiations", "The Presidential Suite from $22,000 a night down to $16,000, and $51,000 in hotel attrition fees waived."],
      ["VIP", "The VIP opening mixer in the Presidential Suite."],
      ["Production", "Program, production and on site execution across three and a half days."],
    ],
    metrics: { attendance: "280", productionDays: "3.5", costSaved: "$51,000", costSavedBasis: "Iconic Events worked with the Eden Roc to waive $51,000 in hotel attrition fees the client would otherwise have had to pay after war broke out where the founders were staying." },
    highlights: [
      ["280", "Accredited investors on site"],
      ["30+", "New Inflection Club members"],
      ["$51K", "Hotel attrition fees waived"],
    ],
    results: [
      "The investors loved it. Meeting Tan and Salim in person, among peers from around the world, turned an online community into a room that wanted more.",
      "So much more that Tan and Salim launched their first high ticket offer on the back of it: the Inflection Club, built as a continuation of the community attendees had just experienced. More than 30 new members joined. Attendees kept asking where the next one would be. Now members build their year around it: Miami first, then Austin with the Inflection Club, and next Las Vegas in November 2026, which we are producing.",
    ],
    rightFor: "Any founder with an investment community, or any community they want to keep for the long term. The strongest way to retain it is to strengthen the connections between members by bringing them together in person. That is what Decentralized Masters did, and it is what let them launch the Inflection Club, open new investment opportunities and build an experience members plan their year around.",
    stealThis: [
      "Design the room as the first chapter of your next offer. Decentralized Masters built the Inflection Club as a continuation of the community attendees had just experienced in person, so joining felt like staying, not buying.",
    ],
    details: {
      client: "Tan and Salim",
      clientTitle: "Co-Founders, Decentralized Masters",
      venue: "Fontainebleau Miami Beach",
      city: "Miami Beach",
      region: "FL",
      year: "2026",
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
      aftermovieUrl: "https://youtu.be/cCAnIgzz1I0",
      testimonialUrl: null,
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced the first Decentralized Masters Live for co-founders Tan and Salim at the Fontainebleau Miami Beach in March 2026, delivering event design, venue and hotel negotiations including $51,000 in waived attrition fees, a VIP opening mixer in the Presidential Suite and on site execution for about 280 accredited investors.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "fast-start-forum-2024",
    // Held February 2025; the slug says 2024 because it was sold in 2024 and
    // the URL was already live when the year was corrected. Never change it.
    name: "Fast Start Forum 2025",
    headline: "How Fast Start Forum Took Life Insurance Agents Out of the Ballroom and Launched Tom Wall's Inner Circle Mastermind",
    cta: "Want an event your industry has never seen before?",
    summary:
      "Life insurance events usually start and end in a stuffy ballroom. Tom Wall of Whole Life Mastermind wanted something better for his agents. For the first Fast Start Forum, at the Hilton Fort Lauderdale Marina, we opened with a Sunday mixer, took Monday night to Topgolf and closed with a VIP dinner and live jazz at YOLO, around a program of 11 speakers. 194 attendees came, and Tom sold several spots in his first offer and in the Inner Circle Mastermind we helped him design.",
    challenge: [
      "Life insurance events had a reputation: stuffy ballrooms, no excitement and no mixers worth staying for. Tom Wall, who runs Whole Life Mastermind, a mastermind and support group for life insurance agents, wanted to build something better for the agents in his community.",
    ],
    approach: [
      "Launched publicly with about three months to sell the room.",
      "Opened Sunday with registration and a mixer, so agents met before the first session.",
      "Took Monday night to Topgolf instead of another ballroom reception and open bar, so agents bonded over something they could do together. Tom is a big golfer, and it gave him the chance to show it.",
      "Closed Tuesday with a VIP dinner at YOLO, one of Fort Lauderdale's hottest destinations, with live jazz and a floor to dance on.",
      "Built a speaker lineup of 11, hosted by Tom Wall, including Garrett Gunderson, Vince D'Addona and Kristin Andree.",
    ],
    challengesOvercome: null,
    scope: [
      ["Event design", "Event design and management for the first Fast Start Forum."],
      ["Offer", "Design of Tom's Inner Circle Mastermind offer."],
      ["Venue", "The Hilton Fort Lauderdale Marina."],
      ["Program", "A program of 11 speakers, hosted by Tom Wall."],
      ["Experiences", "A Sunday mixer, a Monday night at Topgolf and a VIP dinner with live jazz at YOLO."],
      ["Production", "Production and on site execution."],
    ],
    metrics: { attendance: "194", productionDays: null, costSaved: null },
    highlights: [
      ["194", "Attendees at the first Fast Start Forum"],
      ["11", "Speakers on the program"],
    ],
    results: [
      "It went really well. 194 attendees came to the first Fast Start Forum, and Tom sold several spots in his first offer, along with a couple of places in the Inner Circle Mastermind we helped him design. The agents left having bonded over golf and jazz instead of another ballroom reception, and Tom brought the event back the next year.",
    ],
    rightFor: "Any industry whose events tend to be standardized and stale, such as insurance or health and wellness, where events usually start and end in a ballroom. Fast Start Forum is a model for breaking that pattern.",
    stealThis: [
      "Replace the ballroom mixer with an experience. A night at Topgolf gave agents something to do together, not just something to drink, and the bonding carried back into the sessions. Pick an activity your host loves, too: Tom is a big golfer, and it showed.",
    ],
    details: {
      client: "Tom Wall",
      clientTitle: "Whole Life Mastermind",
      venue: "Hilton Fort Lauderdale Marina",
      city: "Fort Lauderdale",
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
      "Iconic Events, a Florida based event production and coordination company, produced the first Fast Start Forum for Tom Wall of Whole Life Mastermind at the Hilton Fort Lauderdale Marina in February 2025, delivering event design and management, offer design for his Inner Circle Mastermind, an 11 speaker program, a Topgolf night and a VIP dinner at YOLO for 194 attendees.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "fast-start-forum-2026",
    name: "Fast Start Forum 2026",
    headline: "How Fast Start Forum More Than Doubled to 473 Attendees, With Michael Phelps and Its Own Logo on the Guitar Hotel",
    cta: "Want your event's second year to make the first look small?",
    summary:
      "For year two of Fast Start Forum, Tom Wall of Whole Life Mastermind wanted to go bigger and more premium, with sponsors carrying more of the event. We moved it to the Seminole Hard Rock, the Guitar Hotel, built a room with a full sponsor hall led by title sponsors Madan+, Wealth Building Cornerstones and OneAmerica, and brought in Michael Phelps as the keynote. Tom sold more of his Inner Circle Mastermind from a custom booth, the afterparty went out on the water with Tom's logo on the Guitar, and attendance grew from 194 to 473.",
    challenge: [
      "Year one proved that life insurance agents wanted something better than a ballroom. For year two, Tom Wall wanted to go bigger and more premium, and to have sponsors carry more of the event.",
    ],
    approach: [
      "Moved from the Hilton Fort Lauderdale Marina to the Seminole Hard Rock Hotel & Casino, the Guitar Hotel, one of the most exciting venues in the country.",
      "Designed a room big enough for more attendees and a full sponsor hall, and brought in a dedicated sponsor liaison. Title sponsors Madan+, Wealth Building Cornerstones and OneAmerica led about 16 partners in all.",
      "Brought in Olympic legend Michael Phelps as the keynote, alongside a program led by Tom Wall with speakers including Wade Pfau and Garrett Gunderson.",
      "Built Tom a custom booth for his Inner Circle Mastermind on the sponsor floor.",
      "Added a VIP track: a VIP cocktail hour and dinner, and a full VIP day to close the event.",
      "Threw an on the water afterparty, and put Tom's logo on the Guitar Hotel itself for everyone to see.",
    ],
    challengesOvercome: [
      "The original dates landed on a school vacation week, and the hotel's only other window was January 19 to 22, with very few rooms on the Sunday. We moved the event, then negotiated 50 more Sunday rooms so attendees could arrive the night before.",
    ],
    scope: [
      ["Venue", "The move to the Seminole Hard Rock Hotel & Casino, the Guitar Hotel."],
      ["Sponsors", "Room and sponsor hall design, and a dedicated sponsor liaison."],
      ["Program", "The Michael Phelps keynote and a speaker program led by Tom Wall."],
      ["Offer", "A custom booth for Tom's Inner Circle Mastermind."],
      ["VIP", "A VIP cocktail hour and dinner, and a full VIP day."],
      ["Experiences", "The on the water afterparty, and Tom's logo on the Guitar."],
      ["Production", "Production and on site execution."],
    ],
    metrics: { attendance: "473", productionDays: "4", costSaved: null },
    highlights: [
      ["473", "Attendees, up from 194 in year one"],
      ["3", "Title sponsors"],
      ["1", "Olympic legend on the main stage"],
    ],
    results: [
      "It went well. 473 people came, more than double the 194 at the first Fast Start Forum, and everyone loved the chance to learn from an Olympic legend.",
      "Tom sold more of his Inner Circle Mastermind than the year before, from the custom booth we set up for him. And the attendees loved the on the water afterparty, with Tom's logo lit up on the Guitar for everyone to see.",
    ],
    rightFor: "Membership and mastermind communities ready to step up from a first event to a premium, sponsor backed one, especially in industries whose events usually start and end in a ballroom.",
    stealThis: [
      "Put the client's name on the landmark. Tom's logo on the Guitar Hotel turned a venue into a moment, and every photo from the afterparty carried his brand.",
    ],
    details: {
      client: "Tom Wall",
      clientTitle: "Whole Life Mastermind",
      venue: "Seminole Hard Rock Hotel & Casino",
      city: "Hollywood",
      region: "FL",
      year: "2026",
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
      "Iconic Events, a Florida based event production and coordination company, produced Fast Start Forum 2026 for Tom Wall of Whole Life Mastermind at the Seminole Hard Rock Hotel & Casino in Hollywood, Florida in January 2026, delivering the venue move, a sponsor hall led by title sponsors Madan+, Wealth Building Cornerstones and OneAmerica, a Michael Phelps keynote, a VIP track and an on the water afterparty for 473 attendees.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "the-sales-summit",
    name: "The Sales Summit",
    headline: "How 7th Level Drew 700 to Its Largest Event Yet, the First Step Toward Filling Stadiums",
    cta: "Want your first big live event to feel like a stadium tour?",
    summary:
      "Jeremy Miner, CEO of 7th Level, wanted to grow his impact until it filled stadiums, and the Sales Summit was the first step: the largest event 7th Level had ever put on, after years of mostly virtual events. We took the Irving Convention Center at Las Colinas, opened with a gala on the terrace and built three days around live call reviews from the stage, a Rolex giveaway and a 2023 Mercedes-AMG C 63 given away from the stage. 700 people attended, with lines out the door every day.",
    challenge: [
      "Jeremy Miner was riding a massive wave of authority and impact, and his team at 7th Level wanted to grow it until it filled stadiums. The Sales Summit was the first step: the largest event they had ever put on. Until then, most of their events had been virtual. Jeremy wanted this one large and loud.",
    ],
    approach: [
      "Took the Irving Convention Center at Las Colinas, outside Dallas, with the Westin next door so attendees could walk to every session.",
      "Opened with a gala on the outdoor terrace the night before day one.",
      "Built a three day program around Jeremy, Anthony Vizzari and Michael Bernoff, with live call reviews from the stage, guest panels and sponsor spotlights.",
      "Went large and loud: a $10,000 Rolex giveaway and a $100,000 car, a 2023 Mercedes-AMG C 63, given away from the stage, built around a skill based challenge.",
      "Gave Elite attendees their own track: a private workshop and an offsite dinner at the Constellation Club.",
    ],
    challengesOvercome: [
      "A competing event landed on the same weekend, and the public launch moved to April 20, leaving about two months to sell the room. The fire marshal declined the permit at first; it was approved on July 7, three days before the doors opened.",
    ],
    scope: [
      ["Venue", "The Irving Convention Center at Las Colinas, with the Westin next door."],
      ["Opening", "The opening gala on the outdoor terrace."],
      ["Program", "A three day program and speakers, led by Jeremy Miner, Anthony Vizzari and Michael Bernoff."],
      ["Giveaways", "The Rolex and car giveaways, built around a skill based challenge."],
      ["Elite", "The Elite track: a private workshop and a dinner at the Constellation Club."],
      ["Sponsors", "Sponsor spotlights on the main stage."],
      ["Production", "Production and on site execution."],
      ["Content", "Post event content: recordings, storymonials and a trailer."],
    ],
    metrics: { attendance: "700", productionDays: "3", costSaved: null },
    highlights: [
      ["700", "Attendees"],
      ["3", "Days, with lines out the door every one"],
      ["10 to 12", "Person sales teams sent by their companies"],
    ],
    results: [
      "The room loved it. There were lines out the door every single day, and locals passing by came in to see what was happening. People stayed for hours, from the first session to the last, to level up their sales skills.",
      "Companies sent whole teams, some of 10 to 12 people, paid for by the business. 700 people attended, and the Sales Summit became the first step toward the stadiums Jeremy is building toward.",
    ],
    rightFor: "Experts and brands with a fast growing audience who have run mostly virtual events and are ready for a large, loud live one, and companies that want to send their whole sales team to level up together.",
    stealThis: [
      "Use the giveaway to send people to your sponsors. A $10,000 Rolex giveaway drove a huge turnout at the sponsor booths. If that is what it costs to engage your sponsors and bring them back year over year, you make the money back on sponsorship and then some.",
    ],
    details: {
      client: "Jeremy Miner",
      clientTitle: "CEO, 7th Level",
      venue: "Irving Convention Center at Las Colinas",
      city: "Irving",
      region: "TX",
      year: "2026",
      dates: null,
    },
    media: {
      // TODO(collect): photos, trailer and testimonial links to come from Iconic.
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
      "Iconic Events, a Florida based event production and coordination company, produced The Sales Summit for Jeremy Miner, CEO of 7th Level, at the Irving Convention Center at Las Colinas in Irving, Texas in July 2026, delivering the venue, an opening gala, a three day program, Rolex and car giveaways, an Elite track and post event content for 700 attendees.",
  },

  // Source: Fathom call summaries (M141), published with gaps at Iconic's
  // request. TODO(collect): see the interview sheet row for what is missing.
  {
    slug: "net-rev-summit-2026",
    name: "Net Rev Summit 2026",
    headline: "How Net Rev Summit 2026 Moved the World of Sales Forward With a High Class, High Impact Event",
    cta: "Want your summit to reach far beyond the room?",
    summary:
      "Net Rev Summit 2026 brought its community to the Ritz-Carlton Dove Mountain in Marana, Arizona, and opened the stage to a virtual audience as well. We restructured the run of show so the story built across the weekend, added a virtual ticket and livestream hosted with 7th Level, turned the full catering minimum into extras for attendees, and after the event negotiated a $16,000 hotel overage down to $1,067.",
    challenge: [
      "Net Rev wanted its summit to reach beyond the room: an in person weekend at the Ritz-Carlton Dove Mountain, plus a virtual audience far larger than the ballroom could hold.",
    ],
    approach: [
      "Restructured the run of show for narrative flow, moving the event's \"why\" talk to Sunday morning and adding a Sunday afternoon roundtable.",
      "Added a virtual ticket and a livestream, hosted with 7th Level, so the stage reached people who could not be in Arizona.",
      "Put the full catering minimum to work for attendees: a continental breakfast and Ritz-Carlton gift cards.",
      "Redesigned the LED wall graphics to match the brand.",
    ],
    challengesOvercome: [
      "A $16,000 hotel overage arrived after the event. We negotiated it down to $1,067, saving the client $14,933.",
    ],
    scope: [
      ["Program", "Run of show and session order, built for the weekend's narrative."],
      ["Virtual", "A virtual ticket and livestream, hosted with 7th Level."],
      ["Hospitality", "Catering, a continental breakfast and Ritz-Carlton gift cards for attendees."],
      ["Branding", "LED wall graphics redesigned to match the brand."],
      ["Negotiations", "The hotel overage, cut from $16,000 to $1,067."],
      ["Content", "Event content delivered after the show."],
    ],
    metrics: { attendance: null, productionDays: null, costSaved: "$14,933", costSavedBasis: "Iconic Events negotiated a $16,000 hotel overage down to $1,067 after Net Rev Summit 2026." },
    highlights: [
      ["$14.9K", "Hotel overage negotiated away"],
    ],
    results: [
      "The weekend ran at the Ritz-Carlton Dove Mountain as planned, and the full set of event content was delivered after the show.",
    ],
    rightFor: null,
    stealThis: null,
    details: {
      client: "Ambro Dipilato",
      clientTitle: null,
      venue: "Ritz-Carlton Dove Mountain",
      city: "Marana",
      region: "AZ",
      year: "2026",
      dates: null,
    },
    media: {
      hero: null,
      challenge: null,
      band: null,
      resultLeft: null,
      resultRight: null,
      gallery: [],
      aftermovieUrl: null,
      testimonialUrl: "https://youtu.be/4j77Mc4tc5M",
    },
    testimonial: { quote: null, approved: false },
    citation:
      "Iconic Events, a Florida based event production and coordination company, produced Net Rev Summit 2026 for Ambro Dipilato at the Ritz-Carlton Dove Mountain in Marana, Arizona in May 2026, delivering the run of show, a virtual ticket and livestream hosted with 7th Level, attendee hospitality, brand graphics and hotel negotiations.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  // An EPIC Consulting engagement: Icon coached the event remotely.
  {
    slug: "hell-yes-live",
    name: "Hell Yes Live 2026",
    format: "EPIC Consulting",
    approachLead: "Icon coached Becca and her team from the first brief to the debrief. Becca's team ran the event on site.",
    headline: "How Hell Yes Live Packed the Room and Sold 42 Seats for Next Year Within Days",
    cta: "Want an event coach in your corner?",
    summary:
      "Becca Pike of Hell Yes Coaching wanted her second live event to be bigger and to work as a selling room, and she hired Icon as her event coach. With months of slow sales, a capped room and a key team member gone 72 hours before she was needed, we reframed the event around one promise, rebuilt the sales plan in June and coached the offer on stage. 99 people packed the room, sign-ups from the stage were strong, and 42 tickets for next year sold within days.",
    challenge: [
      "Becca Pike runs Hell Yes Coaching, which sells coaching and masterminds including Scale to Seven and The Circle. For her second live event she wanted something bigger, a room that worked as a selling room, and she hired Icon as her event coach to get there.",
      "Tickets sold slowly for months in a regional market, the fire department capped the room, and a target sponsor dropped out.",
    ],
    approach: [
      "Reframed the event around one promise: from overextended and underpaid to Hell Yes CEO.",
      "Merged everything into one playbook and one tracker, to protect Becca's time.",
      "Put GA and VIP on one checkout page.",
      "Pivoted sales in June: plus-one and gifted tickets, a local campaign that excluded existing leads, and personal calls to people who abandoned checkout.",
      "Led the on stage offer with the transformation, and kept it to a single public offer.",
    ],
    challengesOvercome: [
      "Mid-build, the team member who held every moving part for Becca left without warning, and she had about 72 hours to replace her. She called Icon, who gave her love, reassurance and a plan. A replacement stepped in, and the show went on.",
      "In June, a full week passed with zero ticket sales. The June pivots, from gifted tickets to personal calls on abandoned checkouts, brought the room back.",
    ],
    scope: [
      ["Vision", "The vision brief, and the promise and transformation copy."],
      ["Systems", "One playbook and one tracker for the whole event."],
      ["Sales", "Funnel and checkout changes, ad review and sales coaching, including the June pivot."],
      ["Program", "Run of show, and review of the pitch and slides."],
      ["Coaching", "Biweekly calls with Becca and her team, and the debrief."],
    ],
    metrics: { attendance: "99", productionDays: null, costSaved: null },
    highlights: [
      ["99", "Attendees on site"],
      ["42", "Tickets for next year sold within days"],
      ["5 of 6", "Scholarship seats became high ticket clients"],
    ],
    results: [
      "The room was packed, 99 people on site, and Becca's opening drew praise. Sign-ups from the stage were strong, and 42 tickets for next year sold within days of the event. The next Hell Yes Live moves to the larger Manchester Reserve.",
    ],
    rightFor: "Coaches and hosts whose live event is the front door to a high ticket offer, and who have a small team that needs structure.",
    stealThis: [
      "Give a handful of scholarship tickets to qualified owners. Hell Yes Live gave out 6, and 5 became high ticket clients.",
    ],
    details: {
      client: "Becca Pike",
      clientTitle: "Hell Yes Coaching",
      venue: "The Manchester Hotel",
      city: "Lexington",
      region: "KY",
      year: "2026",
      dates: null,
    },
    media: {
      // TODO(collect): Becca's stage testimonial video (Iconic to upload to YouTube), photos.
      hero: null,
      challenge: null,
      band: null,
      resultLeft: null,
      resultRight: null,
      gallery: [],
      aftermovieUrl: null,
      testimonialUrl: null,
    },
    // Said publicly from the stage; published with Iconic's OK, 2026-10-25.
    testimonial: {
      quote: "I don't think that there's anyone smarter in the event industry. I hired Icon as my event coach because I knew that he understood this world inside and out. Every single conversation ended with me feeling smarter than when it started.",
      approved: true,
    },
    citation:
      "Iconic Events, a Florida based event production and coordination company, coached Becca Pike of Hell Yes Coaching through Hell Yes Live 2026 at The Manchester Hotel in Lexington, Kentucky in July 2026 as part of its EPIC Consulting offer, delivering the event's promise, sales strategy, systems, run of show and pitch coaching for 99 attendees.",
  },

  // Source: docs/case-studies/Case-Study-Interviews.xlsx, approved by Iconic.
  {
    slug: "creator-fest",
    name: "Creator Fest 2024",
    headline: "How Creator Fest Became the Third Largest Creator Event in the Country in Its First Year",
    cta: "Want to launch the event your industry is missing?",
    thirdPerson: true, // Iconic's own event: no first person, no client line.
    summary:
      "Creator Fest set out to be the first true business event for the creator economy, up against an event owned by the largest creator in the world, with no sponsors willing to back year one. With partner Xtend Creators running talent and sales, Iconic ran the venue, production and speakers at the JW Marriott Orlando Bonnet Creek and won over backers like Snapchat and former VidCon CEO Jim Louderback. 1,031 people came, making it the third largest creator event in the country in its first year, and it returned in 2025 as CreatorHub Live.",
    challenge: [
      "Creators had events built for fans, and the only creator event aimed at business owners belonged to the largest creator in the world: MrBeast's VidSummit. Creator Fest set out to be the first true business event for the creator economy, built on five pillars: product, distribution, management, monetization and growth.",
      "Nobody wanted to back it at first. Sponsors wanted to see what the first three years looked like before they committed, and a brand new event had to earn its credibility with creators and the industry from scratch.",
    ],
    approach: [
      "Partnered from the start with Patrick Israel of Xtend Creators: Iconic ran the venue, production and speakers, and Xtend ran talent, sponsors and ticket sales.",
      "Built the program on five pillars of the creator business: product, distribution, management, monetization and growth.",
      "Got tactical with speakers and relational capital, until major players like Snapchat and former VidCon CEO Jim Louderback were behind the event.",
      "Closed general admission the Saturday before and sold only VIP from then on, to push upgrades.",
      "Turned a sponsor bought block of 100 tickets into giveaways, five per speaker, so every speaker brought part of their own audience.",
      "Reworked the founder's opening into a hero's journey talk with an intro video, to build trust from the first minute.",
      "Gave every attendee a lanyard by category: Creator, Industry, Production or Brand, so the right people found each other.",
    ],
    challengesOvercome: [
      "With no sponsors willing to bet on year one, the event had to win its backers one relationship at a time. It started slow and ramped up quickly, until Snapchat and the former CEO of VidCon were behind it. In the final weeks the speaker lineup kept shifting and sponsor management changed hands, and the program was reshaped around the speakers who were confirmed. The event ran its full four days.",
    ],
    scope: [
      ["Venue", "The JW Marriott Orlando Bonnet Creek Resort & Spa."],
      ["Production", "Production across four event days."],
      ["Speakers", "The speaker program, from Snapchat to former VidCon CEO Jim Louderback."],
      ["Program", "Five pillars: product, distribution, management, monetization and growth."],
      ["Partner", "Xtend Creators ran talent, sponsors and ticket sales."],
    ],
    metrics: { attendance: "1,031", productionDays: "4", costSaved: null },
    highlights: [
      ["1,031", "Attendees in year one"],
      ["#3", "Largest creator event in the country"],
      ["70+", "Podcasts recorded on site"],
    ],
    results: [
      "1,031 people came, making Creator Fest the third largest creator event in the country in its first year, and the first true business event for the creator economy. Breakout rooms ran anywhere from 45 minutes to three and a half hours, more than 70 podcasts were recorded on site, and about 7 TB of content was captured. Snapchat's representative and former VidCon CEO Jim Louderback both praised the event.",
      "The lessons shaped what came next. The event was renamed CreatorHub, stayed at the JW Marriott, added virtual tickets and returned in 2025 as CreatorHub Live.",
    ],
    rightFor: "A first time event that needs industry credibility fast, with a partner who brings the talent and the sales.",
    stealThis: [
      "Open with the founder's story. A hero's journey film before the first talk builds trust before anyone takes the stage.",
      "Sort the room with lanyards. Creator, Industry, Production and Brand lanyards told everyone who to talk to.",
      "Let sponsors fund the seats. A sponsor bought block of tickets, given away by speakers, filled the room with each speaker's audience.",
    ],
    details: {
      client: null,
      clientTitle: null,
      venue: "JW Marriott Orlando Bonnet Creek",
      city: "Orlando",
      region: "FL",
      year: "2024",
      dates: null,
    },
    media: {
      // TODO(collect): aftermovie as a YouTube link, photo selects.
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
      "Iconic Events, a Florida based event production and coordination company, produced Creator Fest, its own event with partner Xtend Creators, at the JW Marriott Orlando Bonnet Creek in Orlando, Florida in August 2024 for 1,031 attendees, delivering the venue, production and speaker program for the first business event for the creator economy.",
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
  { slug: "creatorhub-live", name: "CreatorHub Live", client: null, when: "2025-08", location: "Orlando, FL", venue: "JW Marriott Orlando Bonnet Creek", size: "1,500+", full: true },
  { slug: "creator-fest", name: "Creator Fest 2024", client: null, when: "2024-08", location: "Orlando, FL", venue: "JW Marriott Orlando Bonnet Creek", size: "1,031", full: true },
  { slug: "creator-hub-madrid", name: "Creator Hub Madrid", client: "Universal Music Group", when: "2025", location: "Madrid, Spain", venue: null, size: null, full: false },
  { slug: "freedom-queen-live-2024", name: "Freedom Queen Live 2024", client: "Bridget James Ling", when: "2024-11", location: "St. Petersburg, FL", venue: "The Vinoy", size: "451", full: true },
  { slug: "scale-or-sell", name: "Scale or Sell", client: "Cameron England", when: "2026-11", location: "Fort Lauderdale, FL", venue: "Rebel Motor Club", size: "150", full: true },
  { slug: "freedom-queen-live-2026", name: "Freedom Queen Live 2026", client: "Bridget James Ling", when: "2026-11", location: "Aventura, FL", venue: "JW Marriott Miami Turnberry Resort & Spa", size: "359", full: true },
  { slug: "freedom-queen-live-2025", name: "Freedom Queen Live 2025", client: "Bridget James Ling", when: "2025-11", location: "St. Petersburg, FL", venue: "The Vinoy", size: "530", full: true },
  { slug: "pmuw-2023", name: "PMU World 2023", client: "Danny Tran", when: "2023-04", location: "Hollywood, FL", venue: "Seminole Hard Rock Hotel & Casino", size: "800+", full: true },
  { slug: "pmuw-2024", name: "PMU World 2024", client: "Danny Tran", when: "2024-08", location: "Hollywood, FL", venue: "Seminole Hard Rock Hotel & Casino", size: "1,237", full: true },
  { slug: "pmuw-at-sea", name: "PMU World at Sea", client: "Danny Tran", when: "2026-10", location: "Miami to Nassau and CocoCay", venue: "Wonder of the Seas", size: "455", full: true },
  { slug: "pmuw-2025", name: "PMU World 2025", client: "Danny Tran", when: "2025-09", location: "Hollywood, FL", venue: "Seminole Hard Rock Hotel & Casino", size: "1,500", full: true },
  { slug: "net-rev-summit-2026", name: "Net Rev Summit 2026", client: "Ambro Dipilato", when: "2026-05", location: "Marana, AZ", venue: "Ritz-Carlton Dove Mountain", size: null, full: true },
  { slug: "decentralized-masters-live", name: "Decentralized Masters Live", client: "Tan and Salim", when: "2026-03", location: "Miami Beach, FL", venue: "Fontainebleau Miami Beach", size: "280", full: true },
  { slug: "fast-start-forum-2024", name: "Fast Start Forum 2025", client: "Tom Wall", when: "2025-02", location: "Fort Lauderdale, FL", venue: "Hilton Fort Lauderdale Marina", size: "194", full: true },
  { slug: "fast-start-forum-2026", name: "Fast Start Forum 2026", client: "Tom Wall", when: "2026-01", location: "Hollywood, FL", venue: "Seminole Hard Rock Hotel & Casino", size: "473", full: true },
  { slug: "the-sales-summit", name: "The Sales Summit", client: "Jeremy Miner", when: "2026-07", location: "Irving, TX", venue: "Irving Convention Center at Las Colinas", size: "700", full: true },
  { slug: "hell-yes-live", name: "Hell Yes Live 2026", client: "Becca Pike", when: "2026-07", location: "Lexington, KY", venue: "The Manchester Hotel", size: "99", full: true },
  { slug: "limitless-live", name: "Limitless Live", client: "Gil Valerio", when: "2026", location: null, venue: null, size: null, full: false },
  { slug: "women-and-wealth", name: "Women and Wealth", client: "Shelby Sapp", when: "2026-07", location: "Fort Lauderdale, FL", venue: "Broward County Convention Center", size: null, full: false },
  { slug: "closers-io-retreat", name: "Closers.io Retreat", client: "Cole Gordon", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "commas-air-traffic", name: "Commas Air Traffic", client: "Commas", when: "2026-09", location: "Las Vegas, NV", venue: "AREA15", size: "400", full: true },
  { slug: "bad-takeover-2026", name: "Bad Takeover 2026", client: "Eddie Maalouf", when: "2026-09", location: "Las Vegas, NV", venue: "AREA15", size: "900", full: true },
  { slug: "bad-after-dark", name: "Bad After Dark", client: "Eddie Maalouf", when: "2024-01", location: null, venue: null, size: null, full: true },
  { slug: "agency-founders-dubai", name: "Agency Founders Dubai", client: "Eddie Maalouf", when: "2026", location: "Dubai, UAE", venue: null, size: null, full: false },
  { slug: "maxxed-out-summit", name: "Maxxed Out Summit", client: "Max Willett", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "her-last-call", name: "Her Last Call", client: "Alexis Mai", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "pimcon-2025", name: "PimCon 2025", client: "Rankings.io", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "pimcon-2024", name: "PimCon 2024", client: "Rankings.io", when: "2024", location: null, venue: null, size: null, full: false },
  { slug: "the-black-course", name: "The Black Course", client: "Chase Hughes", when: "2023-06", location: null, venue: null, size: null, full: false },
  { slug: "behavior-pilot", name: "Behavior Pilot", client: "Chase Hughes", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "chase-hughes-london", name: "HMS Belfast, London", client: "Chase Hughes", when: "2023-02", location: "London, UK", venue: "HMS Belfast", size: null, full: false },
  { slug: "sales-momentum-live", name: "Sales Momentum Live", client: "Aaron Platt", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "the-guardians-annual", name: "The Guardians Annual", client: "Thaddeus Gala", when: "2022-04", location: null, venue: null, size: null, full: false },
  { slug: "e-p-i-c", name: "E.P.I.C", client: "Kaaba Luum", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "powerhouse", name: "Powerhouse", client: "Los Silva", when: "2022", location: null, venue: null, size: null, full: false },
  { slug: "founder-os", name: "Founder OS", client: "Matt Gray", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "the-ceo-lawyer-summit-2022", name: "The CEO Lawyer Summit 2022", client: "Ali Awad", when: "2022-12", location: null, venue: null, size: null, full: false },
  { slug: "ceo-lawyer-summit", name: "The CEO Lawyer Summit 2021", client: "Ali Awad", when: "2021-12", location: null, venue: null, size: null, full: false },
  { slug: "scaling-with-systems-live-2023", name: "Scaling With Systems LIVE 2023", client: "Ravi Abuvala", when: "2023", location: null, venue: null, size: null, full: false },
  { slug: "scaling-with-systems-live", name: "Scaling With Systems LIVE 2021", client: "Ravi Abuvala", when: "2021-04", location: null, venue: null, size: null, full: true },
  { slug: "egc-2022", name: "EGC 2022", client: "Austin Zelan", when: "2022", location: null, venue: null, size: null, full: false },
  { slug: "dealcon-2025", name: "DealCon 2025", client: "Tom Shipley", when: "2025", location: null, venue: null, size: null, full: false },
  { slug: "viral-ecom-adz", name: "Viral Ecom Adz", client: "Noah Brewer", when: "2023-06", location: null, venue: null, size: null, full: false },
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

/* Resolve "/case-studies/bad-after-dark" to a study, or null for an unknown
   slug so the page can render a real not-found state. */
export function caseStudyFromPath(pathname) {
  const slug = pathname.replace(/^\/case-studies\/?/, "").replace(/\/+$/, "")
  return CASE_STUDY_BY_SLUG[slug] ?? null
}

/* The case studies suggested at the foot of a case study page: the newest
   events first, by `when` in the event index, so the suggestions lead with
   current work. Nothing on the page says they are recent (Iconic's call). */
export function otherCaseStudies(slug, limit = 4) {
  const when = (study) => EVENT_INDEX.find((e) => e.slug === study.slug)?.when ?? ""
  return CASE_STUDIES.filter((study) => study.slug !== slug)
    .sort((a, b) => when(b).localeCompare(when(a)))
    .slice(0, limit)
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
  if (study.faqs) return study.faqs
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
      study.metrics.costSavedBasis ??
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
   yet written up uses its 01 as the cover on the grid. An entry may carry a
   name, used on /gallery when the key matches no event in the index.
   See docs/case-studies/PHOTO-LIBRARY.md. */
export const PHOTO_LIBRARY = {
  "bad-after-dark": { folder: "bad-after-dark", count: 8 },
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
    // An event not yet in the index carries its name from the entry, which
    // Send to website in Iconic Photos fills in from the gallery title.
    const event = built?.name ?? listed?.name ?? entry.name ?? slug
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
