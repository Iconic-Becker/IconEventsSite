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
  ["Lead time", "Usually 8 to 10 months out; 30 days is the floor"],
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
  { n: 8, name: "On Site", line: "Day 0 is a full tech rehearsal. Show days are run by our show caller with the Event Director, so you spend the day with your audience, not in meetings." },
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
      "Live event production by Iconic Events: stage, light, sound, video and scenic, specified, negotiated and directed as one show, with a dedicated show caller and a Day 0 tech rehearsal at every event. Founded 2017, based in Miami.",
    buyer:
      "Live event production for founders, brands and creators who need a summit, launch or mastermind built, rehearsed and run as one show, with one team accountable for the room.",
    lead:
      "Live event production is the technical delivery of a live event: the stage, lighting, sound, video and scenic, specified for the show, built and rehearsed. On the day it is run to a locked run of show. We direct all of it under one line of authority, with a dedicated show caller and a tech rehearsal before doors open.",
    covers: {
      heading: "What is live event production?",
      paragraphs: [
        "Live event production is everything the audience sees and hears from the moment doors open: the stage and set, the lighting, the sound, the screens and cameras, and the scenic that holds it together. It also covers what the audience never sees: the rigging, the power, the crew, the Day 0 rehearsal, and the run of show that decides what happens in which minute. Our run of show is tentative at 14 days out and locked at 7.",
        "Most event planners oversee logistics. We engineer the room your audience decides in. In practice that means one team specifies every element of the production for the show you are putting on. It negotiates the production with local partners who know the venue, and directs it on the day through one show caller. The stage is drawn around the run of show rather than around what the venue has on a truss. The audio is designed for speech first, because a room that cannot hear clearly cannot be convinced.",
        "We own no equipment, and that is deliberate. It lets us produce anywhere in the country through local, trusted partners, and it means the production is specified for your show rather than built from what sits in a warehouse. Our own background in audio visual production is the reference point: we know what equipment should cost in any market, and what a show needs against what a quote tends to include.",
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
        { name: "Crew and vendor management", line: "Every crew member and supplier on one schedule, briefed and directed by our team, with the AV contract negotiated down to what the show needs." },
      ],
      decide:
        "You decide the budget, the venue, the design, and each creative deliverable in writing. Inside the plan you approved, our team decides on the day, so the show never waits for a meeting.",
      boundaries:
        "Venue power, internet, union labour and effects permits are arranged in the plan and paid to the venue or the authority that provides them. We produce the show. We do not sell the tickets or run your marketing.",
    },
    phases: {
      intro:
        "Live event production runs through all nine phases of the Iconic Standard. Three of them are where most of the production work happens.",
      focus: [3, 7, 8],
      notes: {
        3: "The production is specified here, before anything is rented: the stage drawn around the run of show, the audio designed for speech, the screens sized to the room. Then the quotes are read against it and negotiated down, usually by tens of thousands of dollars and sometimes by hundreds of thousands.",
        7: "Load-in for a 1,000-person summit takes one to two days. It is planned into the countdown from the start, because too little time for load-in and setup is the failure we see most often in rooms we did not produce.",
        8: "Day 0 is a full tech rehearsal, at every event, so every piece of tech is proven before anyone stands on the stage. On show days the show caller calls the cues, the Event Director runs the room, and you get a short check-in each morning rather than a day of meetings.",
      },
    },
    compare: {
      heading: "Live event production vs event planning",
      paragraphs: [
        "An event planner organises the event: the venue, the catering, the schedule, the suppliers, and the good ones do it well. Production is a different job. It is the technical build and the live running of the show itself. It needs a technical direction, a show caller, and a Day 0 rehearsal with the stage, the screens, the audio and the speakers before doors open.",
        "Many planners hire a production company for that part, and many production companies do only that part. We do both under one line of authority, and add the strategy and revenue work a production company does not offer: the strategy before anything is designed, and the revenue moment the room is built around. The difference shows on the day. There is one plan, one call sheet and one person to ask.",
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
    films: [
      { url: "https://youtu.be/GI3Un2dTjEY", title: "Women and Wealth 2026", caption: "3,000 people at the Broward County Convention Center. Our largest build to date, in four minutes." },
    ],
    terms: [
      ["Run of show", "The minute-by-minute script of the event: every cue, walk-on, video and transition, in order. Tentative at 14 days out, locked at 7."],
      ["Show caller", "The person who calls each cue to the crew during the show, so lighting, sound, video and the stage move together."],
      ["Day 0", "The day before the first show day, given over to a full technical rehearsal with the stage, the screens, the audio and the speakers."],
      ["Technical direction", "Ownership of the whole technical build, from drawings and specification through load-in, show and strike."],
      ["Load-in", "The days when the stage, rigging, screens, lighting and sound are brought into the venue and built. One to two days for a 1,000-person summit."],
    ],
    faqs: [
      ["What does a live event production company do?", "It designs, builds and runs the technical side of a live event: the stage, lighting, sound, video, screens and scenic, plus the crew and the rehearsal. We add the direction on top: one technical direction for the room, a show caller on the day, and the strategy and revenue work a production company does not offer."],
      ["How far in advance do we need to book live event production?", "Most clients bring us in 8 to 10 months before the event, and that is the lead time we design for: it leaves room to choose the venue and the dates as strategy decisions rather than defaults. Thirty days is the floor. We take a full production on at that notice as an emergency, and some experiences can be done in less depending on their complexity."],
      ["How long does load-in take for a 1,000-person summit?", "One to two days, followed by Day 0, a full tech rehearsal. Too little time for load-in and setup is the problem we see most often in events we did not produce, so the days are planned into the countdown from the start."],
      ["Do you bring your own equipment?", "No, and on purpose. Owning nothing lets us produce anywhere in the country through local partners who know the venue, and specify the production for your show rather than for a warehouse. Our AV background means we know what equipment should cost in any market."],
      ["Who runs the show on the day?", "A dedicated show caller, assigned to the event, calls the cues, working in tandem with the Event Director and the production partner. Your event day is treated like a wedding day, and you should not spend it in meetings with the coordinator. So before the event there is a State of the Union with your team, so everyone shares one objective. Everyone receives the Event Playbook, and on show days you get short check-ins."],
      ["What goes wrong most often at live events, and how do you prevent it?", "Two things. Not enough time planned for load-in, setup and deliveries, and no breaks for the attendees. Agendas packed to the edge leave no room to breathe, so attendees end up overwhelmed and the client spends more than they needed to. We design both out: time for the build, and air in the schedule."],
      ["How much does live event production cost?", "We charge a management fee, fixed at the outset and tied to scope. The production itself is specified for your show and negotiated with the production partners. Separating what the show needs from what a quote tends to include usually brings the AV contract down by tens of thousands of dollars, and sometimes by hundreds of thousands."],
      ["Who is on the team for a live event?", "The same six roles on every event: an Event Director, an Event Coordinator, an Experience Officer, a Sponsor Liaison, a Production Director and a Media Lead. For the show itself we add a dedicated show caller, and the production crew comes from local partners who know the venue."],
      ["What size of event do you produce?", "Rooms from 20 people to 3,000. The largest to date was a 3,000-person conference built on a 90-foot LED wall with six rigged delay screens; the smallest are masterminds of a few dozen."],
      ["How long have you been producing live events?", "Since 2017, when we were founded in Miami. We have produced in the United States, the United Kingdom, Spain, the United Arab Emirates, Mexico and Costa Rica."],
      ["Do you produce events outside Florida?", "Yes. Borders do not define our range. We have produced events in six countries, the United States, the United Kingdom, Spain, the United Arab Emirates, Mexico and Costa Rica, and we can expand to more without issue. We own no equipment, which is what lets us produce anywhere through local partners who know the venue, with the same team, the same run of show and the same Day 0 rehearsal. Miami is our headquarters and Las Vegas our second base."],
    ],
    related: ["audio-visual-event-production", "conference-and-summit-production", "event-video-production"],
    cta: {
      headline: "Discuss your live event production.",
      lead: "Tell us the event, the dates and the room you have in mind on the quote form. A director replies within 48 hours with the questions we need answered before a Vision Call.",
      label: "Start a conversation",
    },
  },
  {
    slug: "audio-visual-event-production",
    kind: "service",
    zone: "g3",
    draft: true,
    plate: "/images/gallery/bad-after-dark/03.webp",
    title: "Audio visual event production",
    seoTitle: "Audio Visual Event Production | Iconic Events, Miami and Las Vegas",
    description:
      "Audio visual event production by Iconic Events: sound, LED, video and lighting specified for your show, the AV contract negotiated down to what the show needs, and the room rehearsed on Day 0. Founded 2017, based in Miami.",
    buyer:
      "Audio visual event production for founders, brands and creators who need the sound, screens and lighting of a summit or launch specified for the show, negotiated to what it needs, and run as one instrument.",
    lead:
      "Audio visual event production is the design, supply and operation of the sound, video, LED and lighting for a live event. We specify every element for the show you are putting on, read the quotes against that specification and negotiate the contract down, then rehearse the room on Day 0 and run it through one show caller.",
    covers: {
      heading: "What is audio visual event production?",
      paragraphs: [
        "Audio visual event production, AV for short, is the sound system, the microphones, the LED walls and projection, the cameras, the lighting rig and the people who operate them. For a room of 3,000 that can mean a 90-foot LED wall, six rigged delay screens, more than fifty line array cabinets, four broadcast cameras and about 180 lighting fixtures. For a room of 200 it is a fraction of that. In both cases the question is the same: what does this show need?",
        "Most AV quotes answer a different question: what can be rented. We start from the run of show and specify the system for it. Audio is designed for speech first, with delays and front fills so every seat hears clearly and headset microphones so speakers can move. Screens are sized to the room and its sightlines. Lighting is cued to the moments in the show rather than left as a wash. Then the quotes are read against that specification, what the show needs is separated from what a quote tends to include, and the contract is negotiated down, usually by tens of thousands of dollars and sometimes by hundreds of thousands.",
        "We own no equipment, and that is deliberate. It means we can produce anywhere in the country through local partners who know the venue, and it means we are specifying for your show rather than for a warehouse. Our own background in audio visual production is the reference point: we know what equipment should cost in any market. Our clients range from first-time producers to teams with seasoned AV partners of their own, and both leave an engagement knowing what their show needs and why.",
      ],
    },
    included: {
      heading: "What is included in audio visual event production",
      items: [
        { name: "AV specification", line: "A written specification for the show: audio, video, LED, lighting, rigging, power and crew, drawn from the run of show before anything is quoted." },
        { name: "Contract negotiation", line: "The quotes read against the specification, what the show needs separated from what a quote tends to include, and the contract negotiated down. You sign it; we align the vision and do the negotiating." },
        { name: "Audio engineering", line: "Speech-first sound design, delays and front fills for every seat, headset microphones for speakers, playback with a backup, and a redundant network on a flagship build." },
        { name: "LED and projection", line: "Walls and screens sized to the room and the sightlines, with the processing, the graphics machines and their backups, and confidence monitors for the stage." },
        { name: "Lighting design", line: "A rig that makes the room feel like somewhere other than a ballroom, cued to the show's moments on a console, with haze, gobos and effects where the show calls for them." },
        { name: "Technical direction and show calling", line: "One technical direction for the room from the first drawing to strike, a full tech rehearsal on Day 0, and a dedicated show caller on show days." },
      ],
      decide:
        "You decide the budget, the look and each creative deliverable in writing. We specify the system, negotiate it and direct it; inside the plan you approved, our team decides on the day.",
      boundaries:
        "Venue power, internet, union labour and effects permits are arranged in the plan and paid to the venue or the authority that provides them. We produce the show; we do not sell the tickets or run your marketing.",
    },
    phases: {
      intro: "Audio visual event production runs through all nine phases of the Iconic Standard. Three of them are where the AV work is decided.",
      focus: [3, 6, 8],
      notes: {
        3: "The specification is written here, before anything is rented, and the quotes are negotiated against it. A client who arrives with an AV partner of their own keeps them; we still read the quote against what the show needs.",
        6: "The floor plan, the stage drawings and the renders come together with the run of show, so the screens, the cameras and the lighting cues are designed for the moments that matter: the walk-ons, the reveals, the offer.",
        8: "Day 0 is a full tech rehearsal at every event, so every microphone, screen and cue is proven before anyone stands on the stage. On show days the show caller calls the cues with the Event Director and the AV partner.",
      },
    },
    compare: {
      heading: "Audio visual production vs an AV rental",
      paragraphs: [
        "An AV rental house supplies and operates equipment, and the good ones do it well. The quote is built from what they have and what they have been asked for, and a client who does not know what a show needs will usually be quoted more than it needs.",
        "We sit on the client's side of that quote. We write the specification first, read the quote against it, and negotiate the contract down to what the show needs. On the day we direct the room through one show caller, so the AV partner, the stage and the speakers move together. The rental house is still in the room. The difference is who decided what it would be.",
      ],
    },
    proof: {
      intro: "Four rooms, and what the AV decision changed in each.",
      items: [
        { name: "Women and Wealth 2026", where: "Broward County Convention Center, 2026", attendance: "3,000", changed: "Our largest build to date: a 90-foot LED wall of 440 panels at 2.6 mm pitch, six rigged delay screens on laser projectors so all 3,000 could see, flown line arrays with ten subs, four broadcast cameras with six channels of record, about 180 lighting fixtures, 34 chain motors and 70 sections of truss, and cold sparks and CO2 on the entrances. Built hand in hand with a local AV provider over three days of load-in and rehearsal, two show days and a day of strike." },
        { slug: "pmuw-2025", changed: "Focusing the show on one main stage saved $140,000 on AV and made room for more sponsor booths. Everything was recorded in 4K with an editor on site for daily recaps." },
        { slug: "fast-start-forum-2026", changed: "Moved to the Guitar Hotel with a full sponsor hall and the event's own logo on the building, built for a room that more than doubled to 473." },
        { slug: "freedom-queen-live-2025", changed: "A Broadway-style show rather than a conference: every dance number cued to the AV and the stage, rehearsed around the speakers, and kept a surprise until the flash mob opened the event." },
      ],
    },
    films: [
      { url: "https://youtu.be/GI3Un2dTjEY", title: "Women and Wealth 2026", caption: "The 90-foot LED wall, the six delay screens, the flown arrays and the lighting rig, as the room saw them." },
      { url: "https://youtu.be/ZYvRLFzl59o", title: "PMU World 2024", caption: "Year two at the Seminole Hard Rock: the room halved, one stage, and a sponsor hall." },
    ],
    terms: [
      ["Delay screens", "Screens placed deeper in a large room, fed with the same picture, so the back rows see what the front rows see."],
      ["Front fill", "Small speakers along the front of the stage that cover the first rows the main arrays fire over."],
      ["Line array", "A column of speaker cabinets flown above the stage, shaped so the sound reaches the back of the room as clearly as the front."],
      ["Pixel pitch", "The distance between an LED wall's pixels, in millimetres. 2.6 mm reads sharply from a few metres; the larger the number, the further back a viewer needs to be."],
      ["Confidence monitor", "A screen facing the stage that shows the presenter their notes, the clock and the next slide."],
      ["Show caller", "The person who calls each cue to the crew during the show, so lighting, sound, video and the stage move together."],
    ],
    faqs: [
      ["What does audio visual event production include?", "Sound, microphones, LED walls and projection, cameras, lighting and the crew who operate them, plus the rigging and power they need. We add the specification before anything is quoted, the negotiation of the contract, a full tech rehearsal on Day 0 and a show caller on the day."],
      ["Do you own the AV equipment?", "No, and on purpose. Owning nothing lets us produce anywhere in the country through local partners who know the venue, and specify the system for your show rather than for a warehouse. Our own background in audio visual production means we know what equipment should cost in any market."],
      ["How do you keep AV costs down?", "By writing the specification first and reading the quote against it. What the show needs is separated from what a quote tends to include, and the contract is negotiated down, usually by tens of thousands of dollars and sometimes by hundreds of thousands. You sign the AV contract yourself; we align the vision with you, then negotiate it. Our fee is a management fee, fixed at the outset and tied to scope."],
      ["We already have an AV partner. Can you work with them?", "Yes. Our clients range from first-time producers to teams with seasoned AV partners, and the partner stays. We still write the specification, read their quote against it, and direct the room on the day so the partner, the stage and the speakers move together."],
      ["What do you insist on for sound in a speech-led room?", "Delays and front fills so every seat hears clearly, headset microphones so speakers can move, playback with a backup, and on a flagship build a redundant audio network. A room that cannot hear clearly cannot be convinced."],
      ["What was your largest AV build?", "Women and Wealth 2026 at the Broward County Convention Center, for 3,000 people: a 90-foot LED wall of 440 panels, six rigged delay screens, more than fifty line array cabinets, four broadcast cameras, about 180 lighting fixtures and 34 chain motors, with cold sparks and CO2 on the entrances."],
      ["Is a backup system standard?", "On a flagship build we specify a redundant audio network, backup playback and graphics machines, and a backup record feed, and Day 0 proves all of it before doors open. On a smaller show the backups are sized to what a failure would cost the room."],
      ["How far in advance should AV be specified?", "Most clients bring us in 8 to 10 months before the event, and the AV is specified once the venue and the run of show are known. Thirty days is the floor for a full production, taken on as an emergency."],
      ["Where do you produce?", "Yes. Borders do not define our range. We have produced events in six countries, the United States, the United Kingdom, Spain, the United Arab Emirates, Mexico and Costa Rica, and we can expand to more without issue. We own no equipment, which is what lets us produce anywhere through local partners who know the venue, with the same team, the same run of show and the same Day 0 rehearsal. Miami is our headquarters and Las Vegas our second base."],
    ],
    related: ["live-event-production", "event-video-production", "conference-and-summit-production"],
    cta: {
      headline: "Discuss the AV for your event.",
      lead: "Tell us the event, the room and the dates on the quote form, and send the AV quote you have if there is one. A director replies within 48 hours.",
      label: "Start a conversation",
    },
  },
  {
    slug: "event-video-production",
    kind: "service",
    zone: "g4",
    draft: true,
    plate: "/images/gallery/bulletproof-financial-accelerator/08.webp",
    title: "Event video production",
    seoTitle: "Event Video Production and Content Capture | Iconic Events",
    description:
      "Event video production by Iconic Events: a content crew on every show day, the top 20 photographs delivered by the next morning, Storymonials within 30 days, and every frame of raw footage yours in your own Drive. Founded 2017, based in Miami.",
    buyer:
      "Event video production for founders, brands and creators who need one night captured and cut into a quarter of content, with the raw footage theirs to keep.",
    lead:
      "Event video production is the capture of a live event on camera and its edit into finished content: the event film, the keynotes, speaker reels, social cutdowns and testimonials. We plan the capture into the run of show, put a content crew on every show day, edit in house at IconX Studios, and deliver the finished content and every frame of raw footage to your own Drive.",
    covers: {
      heading: "What is event video production?",
      paragraphs: [
        "Event video production is the work of turning a live event into content that keeps working after the doors close. It starts before the event, with the capture planned into the run of show so the crew is in position for the walk-ons, the reveals and the offer. It runs through the event with a content crew on every show day. It ends weeks later with the finished edits delivered and the raw footage organised in your Drive.",
        "Trust is built in a room, not on a social feed. The feed is where that trust travels afterwards, and that is what the capture is for. The top 20 photographs from each show day are edited in our downtime and delivered the same day or by the following morning, so you can post while the event is still happening, at no extra charge for the speed. Testimonials are captured in the last day or two, when the crews are repositioned to them, and cut as Storymonials: films that layer the attendee's story over footage from the event rather than a person answering a question at a camera.",
        "What you receive is not a folder of hundreds of gigabytes to search. Our own AI engines sort the footage and pull the best shots of each speaker and of the moments you chose, alongside all the raw footage organised by day in the way any editor or creative director expects. Once your bill is closed you own 100 percent of it, the footage and the edits.",
      ],
    },
    included: {
      heading: "What is included in event video production",
      items: [
        { name: "Capture plan", line: "The shots the event needs, written into the run of show so the crew is in position for every moment that matters." },
        { name: "Content crew", line: "The minimum is one crew: a videographer, a photographer and a creative director who makes sure every team is getting the shots the target needs. Content-heavy events get more crews, and a socials creator for real-time short-form." },
        { name: "Hot Picks", line: "The top 20 photographs from each show day, edited in downtime and delivered the same day or by the following morning." },
        { name: "Testimonials and Storymonials", line: "A portion of the show allocated to testimonials, the questions written with you beforehand, attendees coached on site, and the films cut with event footage and delivered within 30 days." },
        { name: "The edits", line: "The event film, keynote films, speaker reels and social cutdowns, plus the graphics for the screens: splash screens, speaker cards and banners, all edited in house at IconX Studios." },
        { name: "Raw footage and selects", line: "Every frame, organised by day in your own Drive, with the AI-sorted selects of each speaker and chosen moments. Yours, in full, once the bill is closed." },
      ],
      decide:
        "You decide the output: which moments matter, which speakers get reels, what the testimonials should say. Inside that brief, the creative director decides the shots on the day.",
      boundaries:
        "Testimonial capture depends on attendees volunteering and on conditions on the day, so no specific number of clips is promised. Raw footage is delivered organised, not graded. Distribution of the finished content is yours unless we are engaged for it.",
    },
    phases: {
      intro: "Event video production runs through the same nine phases of the Iconic Standard as the show it captures. Three of them are where the content is decided.",
      focus: [6, 8, 9],
      notes: {
        6: "The capture plan is written here, alongside the run of show: the shots, the camera positions, the testimonial questions, and how many crews the event needs.",
        8: "A content crew on every show day. Hot Picks go out the same day or the next morning. In the last day or two the crews are repositioned to testimonials, when there are the most stories in the room to tell.",
        9: "Raw footage reaches your Drive organised by day, the AI-sorted selects with it. The Storymonials are delivered within 30 days, and the closeout debrief decides how the content starts the plan for the next event.",
      },
    },
    compare: {
      heading: "A content crew vs a videographer",
      paragraphs: [
        "A videographer captures video, and a good one captures it well. What a single camera cannot do is cover a two-stage day, a sponsor hall and a testimonial station at once, or know which shot the edit will need three weeks later.",
        "A content crew is at least three people with three jobs: a videographer, a photographer, and a creative director whose only task is to make sure every team is getting the shots the target needs. A socials creator joins when the event wants real-time short-form. Behind them, a graphics editor and a video editor turn the capture into the finished content. The crew scales with the event; the roles do not change.",
      ],
    },
    proof: {
      intro: "Three events, and what the capture produced in each.",
      items: [
        { slug: "pmuw-2025", changed: "Built for social: red carpet hosts, social-first installations, and an editor on site for daily recaps and sponsor testimonial cuts, all recorded in 4K, for 1,500 people over four days." },
        { name: "PimCon", where: "2024 and 2025", attendance: null, changed: "Capture without the production. PimCon has renewed with us three years running for the content alone: the whole event captured, the splash screens, the graphics and the media handled, without our team producing the event or being on site to run it." },
        { slug: "creatorhub-live", changed: "A Lamborghini painted live in a glass box by the artist One of One as the networking mixer, with the event's logo on the car, captured and cut so that the video travelled far beyond the 1,500 people in the room." },
      ],
    },
    films: [
      { url: "https://youtu.be/ZYvRLFzl59o", title: "PMU World 2024", caption: "The aftermovie, cut from a content crew's capture across three days." },
      { url: "https://youtu.be/CmrSzYrgTWY", title: "The Guardians Annual", caption: "A retreat captured and cut into the film the next year sells on." },
      { url: "https://youtu.be/cCAnIgzz1I0", title: "Decentralized Masters Live", caption: "A first live event at the Fontainebleau Miami Beach, from the VIP mixer to the close." },
    ],
    terms: [
      ["Hot Picks", "The top 20 photographs from each show day, edited and delivered the same day or by the following morning."],
      ["Storymonial", "Our name for a testimonial film that layers the attendee's story over footage from the event, rather than a person answering a question at a camera. Delivered within 30 days."],
      ["Content crew", "The minimum unit on a show day: a videographer, a photographer and a creative director."],
      ["Selects", "The best shots of each speaker and of chosen moments, pulled from the raw footage by our own AI engines so you are not searching hundreds of gigabytes."],
      ["Cutdown", "A short edit of a longer piece, cut to a length and a shape for a social platform."],
    ],
    faqs: [
      ["What does event video production include?", "A capture plan written into the run of show, a content crew on every show day, the top 20 photographs by the next morning, testimonials captured and cut as Storymonials within 30 days, the finished edits and graphics made in house, and all the raw footage organised by day in your own Drive."],
      ["Who owns the footage?", "You do. Once your bill is closed you own 100 percent of it, the raw footage and the edits. It is delivered to your own Google Drive, organised by day in the way any editor or creative director expects, with the AI-sorted selects of each speaker beside it."],
      ["How quickly do we get photographs we can post?", "The top 20 from each show day, edited in our downtime and delivered the same day or by the following morning at the latest, so you can post while the event is still happening. There is no extra charge for the speed."],
      ["How many people are on a content crew?", "At least three: a videographer, a photographer and a creative director. Events that want more content get more crews, and a socials creator for real-time short-form. Behind the crews, a graphics editor and a video editor make the finished content."],
      ["What is a Storymonial?", "A testimonial film that tells a story. The attendee's words are layered over B-roll and footage from the event, so the film shows what they are describing instead of a face answering a question at a camera. We write the questions with you before the event, coach attendees on site, and deliver the films within 30 days."],
      ["Can you capture an event you are not producing?", "Yes. PimCon has renewed with us three years running for exactly that: the whole event captured and all the content, splash screens and graphics handled, without our team producing the event. The video and graphics teams can be booked on their own, well in advance."],
      ["Who edits the content?", "Our in-house studio, IconX Studios. A graphics editor handles the splash screens, speaker cards and banners for the screens; a video editor cuts the film, the reels and the cutdowns."],
      ["How much does event video production cost?", "We charge a management fee, fixed at the outset and tied to scope. The scope is the number of crews, the show days and the deliverables you want, and it is agreed before the event."],
    ],
    related: ["live-event-production", "audio-visual-event-production", "live-streaming-and-hybrid-event-production"],
    cta: {
      headline: "Discuss the content for your event.",
      lead: "Tell us the event, the dates and what the content needs to do afterwards on the quote form. A director replies within 48 hours.",
      label: "Start a conversation",
    },
  },
  {
    slug: "event-production-miami",
    kind: "city",
    city: "Miami",
    region: "FL",
    areaServed: ["Miami", "Miami Beach", "Fort Lauderdale", "Hollywood, FL", "South Florida"],
    draft: true,
    plate: "/images/gallery/pmuw-2023/15.webp",
    title: "Event production in Miami",
    seoTitle: "Event Production Company in Miami | Iconic Events",
    description:
      "Iconic Events is an event production company headquartered in Miami since 2017: more than 100 events across Miami, Miami Beach, Fort Lauderdale and Hollywood, at the venues we know best, with site visits on request.",
    buyer:
      "Event production in Miami for founders, brands and creators bringing a summit, launch or mastermind to South Florida and needing a team that already knows the venues.",
    lead:
      "We are an event production company headquartered in Miami, founded here in 2017, with more than 100 events produced across Miami, Miami Beach, Fort Lauderdale and Hollywood since. We have worked with almost every venue in South Florida, we walk them with you, and the volume we bring lets us negotiate rates and attrition that a client could not negotiate alone.",
    covers: {
      heading: "Event production in Miami, from a team based here",
      paragraphs: [
        "Miami is our first home ground and Fort Lauderdale our second. Since 2017 we have produced more than 100 events across South Florida: multi-day summits at the Seminole Hard Rock in Hollywood, a first live event at the Fontainebleau Miami Beach, a conference for 3,000 at the Broward County Convention Center, and a launch in an open-air parking garage at 1111 Miami when every ballroom in the city was capped at 75 people.",
        "That volume is the advantage a client cannot bring on their own. We have worked with almost every venue in South Florida, so we usually know the right room before the first call ends, and we hunt as many as it takes until you are happy. With the major hotels we are a repeat customer, which is what lets us negotiate rates, room blocks and forgiveness on attrition in the client's favour. When war broke out where one client's community was staying, that relationship was what waived $51,000 in hotel attrition fees and kept the event on track.",
        "If you are considering a venue, call us. A site visit with you is standard, not a favour. Most event planners oversee logistics. We engineer the room your audience decides in, and in Miami we have engineered more of them than anywhere else.",
      ],
    },
    included: {
      heading: "What we produce in Miami",
      items: [
        { name: "Strategy", line: "The Event Vision Brief, the audience journey, the ticket structure and the sponsorship plan, decided before the venue is signed." },
        { name: "Venue and hospitality", line: "Five to eight venues scored and walked, the contract negotiated with the rates and attrition terms our volume earns, and the room blocks and dining arranged." },
        { name: "Creative", line: "The stage, the lighting and the brand world, designed so the event's name reads from every angle of the room." },
        { name: "Production", line: "Audio visual specified for the show and negotiated down, a full tech rehearsal on Day 0, and a dedicated show caller on show days." },
        { name: "Content", line: "A content crew on every show day, the top 20 photographs by the next morning, and every frame of footage yours in your own Drive." },
        { name: "Operations and revenue", line: "Registration through our own check-in system, speakers you choose briefed with a Speaker Packet and a speaker liaison on request, sponsors looked after by a liaison, and the offer coached into the run of show." },
      ],
      decide:
        "You decide the venue, the budget, the design and each creative deliverable in writing. We bring the shortlist, the negotiation and the direction; inside the plan you approved, our team decides on the day.",
      boundaries:
        "Venue power, internet, union labour and effects permits are paid to the venue or the authority that provides them. You sign the venue and AV contracts; we align the vision, then negotiate them.",
    },
    phases: {
      intro: "Every Miami event runs through the nine phases of the Iconic Standard. Two of them are where being based here makes the difference.",
      focus: [2, 8],
      notes: {
        2: "In South Florida the shortlist is drawn from venues we have already produced in. We score five to eight on eight criteria, walk them with you, and negotiate the contract on the volume we bring, which is where the rates and the attrition terms come from.",
        8: "Our team is local. The Event Director, the Experience Officer and the crew are not flying in the night before, and the production partners are the ones who know the building.",
      },
    },
    proof: {
      intro: "Five rooms produced in South Florida, and what changed in each.",
      items: [
        { name: "Women and Wealth 2026", where: "Broward County Convention Center, Fort Lauderdale, 2026", attendance: "3,000", changed: "Our largest room to date, and the largest AV build: a 90-foot LED wall, six rigged delay screens, four broadcast cameras and about 180 lighting fixtures, built over three days of load-in and rehearsal." },
        { slug: "pmuw-2025", changed: "Year three of PMU World at the Seminole Hard Rock in Hollywood: 1,500 people over four days, the show focused on one main stage, which saved $140,000 on AV and made room for more sponsor booths." },
        { slug: "fast-start-forum-2026", changed: "Moved to the Guitar Hotel with a full sponsor hall and the event's own logo on the building, for a room that more than doubled to 473." },
        { slug: "decentralized-masters-live", changed: "A first live event at the Fontainebleau Miami Beach, opened with a VIP mixer in the Presidential Suite. When war broke out where the community was staying, we worked with the Eden Roc to waive $51,000 in attrition and kept the event on track." },
        { slug: "scaling-with-systems-live", changed: "April 2021, with rooms capped at 75: an open-air parking garage at 1111 Miami turned into a venue for 300, with supercars, drones and VIP lounges, in 90 days." },
      ],
    },
    venues: {
      heading: "Venues we have produced in",
      intro: "A selection, not the list. We have worked with almost every venue in South Florida; if yours is not here, we have very likely been in it.",
      list: [
        { name: "Seminole Hard Rock Hotel & Casino, the Guitar Hotel", where: "Hollywood" },
        { name: "Broward County Convention Center", where: "Fort Lauderdale" },
        { name: "Fontainebleau Miami Beach", where: "Miami Beach" },
        { name: "Eden Roc Miami Beach", where: "Miami Beach" },
        { name: "Hilton Fort Lauderdale Marina", where: "Fort Lauderdale" },
        { name: "Omni Fort Lauderdale", where: "Fort Lauderdale" },
        { name: "Hard Rock Stadium", where: "Miami Gardens" },
        { name: "1111 Miami", where: "Miami" },
      ],
    },
    films: [
      { url: "https://youtu.be/GI3Un2dTjEY", title: "Women and Wealth 2026", caption: "Broward County Convention Center, Fort Lauderdale. 3,000 people, our largest room to date." },
      { url: "https://youtu.be/cCAnIgzz1I0", title: "Decentralized Masters Live", caption: "Fontainebleau Miami Beach. A first live event, opened in the Presidential Suite." },
    ],
    terms: [
      ["Attrition", "The fee a hotel charges when a group books a block of rooms and fills fewer than it committed to. One of the terms our volume lets us negotiate."],
      ["Site visit", "A walk through a venue with you before it is chosen. Standard with our clients in South Florida; call and we will arrange it."],
      ["Room block", "A set of hotel rooms held at an agreed rate for an event's attendees."],
      ["Day 0", "The day before the first show day, given over to a full technical rehearsal."],
    ],
    faqs: [
      ["Are you based in Miami?", "Yes. We were founded in Miami in 2017 and it is our headquarters, with Las Vegas as a second base. Miami is our first home ground and Fort Lauderdale our second, and we have produced more than 100 events across South Florida."],
      ["Which Miami venues have you produced in?", "Almost every one in South Florida. Among them: the Seminole Hard Rock in Hollywood, the Guitar Hotel, the Broward County Convention Center, the Fontainebleau and the Eden Roc on Miami Beach, the Hilton Fort Lauderdale Marina, the Omni Fort Lauderdale, Hard Rock Stadium and 1111 Miami."],
      ["Can you walk a venue with us before we book it?", "Yes, and it is standard. If you are considering a venue in South Florida, call us and we will do the site visit with you."],
      ["How do you get better hotel rates than we could?", "Volume. We are a repeat customer at the major South Florida hotels, which lets us negotiate rates, room blocks and forgiveness on attrition that a client booking one event cannot. At one event that relationship waived $51,000 in attrition fees when a crisis abroad kept guests away."],
      ["What size of event do you produce in Miami?", "Rooms from 20 people to 3,000. The largest to date was Women and Wealth 2026 at the Broward County Convention Center; the smallest are masterminds of a few dozen."],
      ["How far in advance should we book?", "Most clients bring us in 8 to 10 months before the event, which leaves room to choose the venue and the dates as strategy decisions. Thirty days is the floor, taken on as an emergency."],
      ["Do you produce outside Miami?", "Yes. Borders do not define our range. We have produced events in six countries, the United States, the United Kingdom, Spain, the United Arab Emirates, Mexico and Costa Rica, and we can expand to more without issue. We own no equipment, which is what lets us produce anywhere through local partners who know the venue, with the same team, the same run of show and the same Day 0 rehearsal. Miami is our headquarters and Las Vegas our second base."],
      ["How much does event production in Miami cost?", "We charge a management fee, fixed at the outset and tied to scope. The venue, the production and the hospitality are specified for your event and negotiated on your behalf."],
    ],
    related: ["live-event-production", "audio-visual-event-production", "event-video-production"],
    cta: {
      headline: "Bring your event to Miami.",
      lead: "Tell us the event, the dates and the room you have in mind on the quote form. A director replies within 48 hours, and a site visit can be on the calendar the same week.",
      label: "Get a quote",
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
