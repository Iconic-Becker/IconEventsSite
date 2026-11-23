import { useEffect } from "react"
import { caseStudyCards } from "../case-studies.js"
import { PRESS } from "../content.js"
import { responsive } from "../lib/img.js"
import SiteHeader from "./SiteHeader.jsx"
import SiteFooter from "./SiteFooter.jsx"

/* The grid of every event Iconic has produced.

   Built events link to their page. The rest are listed but not linked: they
   have no page yet, so a link would lead nowhere. They still earn their place
   here, because the list itself is the proof of volume, and it gives one
   scannable view for deciding which to build next. */

const RECAP_GROUPS = [
  {
    name: "PMU World",
    client: "Danny Tran, Hollywood, FL and at sea",
    items: [
      ["pmuw-2023", "PMU World 2023", "800+ attendees against a projection of 600, the largest permanent makeup event in North America on the first try."],
      ["pmuw-2024", "PMU World 2024", "1,237 attendees in year two, in a smaller room."],
      ["pmuw-2025", "PMU World 2025", "2,000 attendees in year three, in an event built for social."],
      ["pmuw-at-sea", "PMU World at Sea", "455 attendees aboard Wonder of the Seas, buying Danny time to build Beauty World."],
    ],
  },
  {
    name: "Freedom Queen Live",
    client: "Bridget James Ling, St. Petersburg and Miami, FL",
    items: [
      ["freedom-queen-live-2024", "Freedom Queen Live 2024", "her first live event, and the launch of her Inner Circle."],
      ["freedom-queen-live-2025", "Freedom Queen Live 2025", "530 attendees at a Broadway-style show."],
      ["freedom-queen-live-2026", "Freedom Queen Live 2026", "359 women business owners, in its first year in Miami."],
    ],
  },
  {
    name: "Fast Start Forum",
    client: "Tom Wall",
    items: [
      ["fast-start-forum-2024", "Fast Start Forum 2025", "the first Fast Start Forum, in Fort Lauderdale, FL, which took life insurance agents out of the ballroom and launched Tom Wall's Inner Circle Mastermind."],
      ["fast-start-forum-2026", "Fast Start Forum 2026", "more than doubled to 473 attendees, in Hollywood, FL."],
    ],
  },
]

const CASE_STUDY_GROUP = [
  ["scale-or-sell", "Scale or Sell", "Cameron England, Fort Lauderdale, FL", "Sold out a month early, with $14K saved on the venue and AV."],
  ["the-sales-summit", "The Sales Summit", "Jeremy Miner, Irving, TX", "Produced 7th Level's largest event to date, with 700 attendees."],
  ["hell-yes-live", "Hell Yes Live 2026", "Becca Pike, Lexington, KY", "Sold 42 seats for next year within days."],
  ["net-rev-summit-2026", "Net Rev Summit 2026", "Ambro Dipilato, Marana, AZ", "At the Ritz-Carlton Dove Mountain, with a virtual ticket and livestream. $14.9K saved on the hotel."],
  ["decentralized-masters-live", "Decentralized Masters Live", "Tan and Salim, Miami Beach, FL", "A first live event that became a high-ticket club with 30+ new members."],
  ["creatorhub-live", "CreatorHub Live", "Orlando, FL", "1,500+ creators and entrepreneurs under one roof."],
  ["creator-fest", "Creator Fest 2024", "Orlando, FL", "The third-largest creator event in the country in its first year."],
  ["commas-air-traffic", "Commas Air Traffic", "Commas, Las Vegas", "An after party for 400 inside a retrofitted 747."],
  ["bad-takeover-2026", "Bad Takeover 2026", "Eddie Maalouf, Las Vegas", "900 guests after Funnel Hacking Live, with sponsors on every wall and table."],
  ["bad-after-dark", "Bad After Dark", "Eddie Maalouf, Las Vegas", "$146K in sponsorships in six days."],
  ["scaling-with-systems-live", "Scaling With Systems LIVE 2021", "Ravi Abuvala, Miami, FL", "300 attendees in an open-air Miami parking garage, in April 2021."],
]

const MORE_EVENTS = [
  ["Women and Wealth", "Shelby Sapp, Fort Lauderdale, FL"],
  ["Limitless Live", "Gil Valerio"],
  ["Agency Founders Dubai", "Eddie Maalouf, Dubai, UAE"],
  ["Creator Hub Madrid", "Universal Music Group, Madrid, Spain"],
  ["Closers.io Retreat", "Cole Gordon"],
  ["Maxxed Out Summit", "Max Willett"],
  ["Her Last Call", "Alexis Mai"],
  ["PimCon 2025", "Rankings.io"],
  ["DealCon 2025", "Tom Shipley"],
  ["PimCon 2024", "Rankings.io"],
  ["The Black Course", "Chase Hughes"],
  ["Viral Ecom Adz", "Noah Brewer"],
  ["HMS Belfast, London", "Chase Hughes, London, UK"],
  ["Behavior Pilot", "Chase Hughes"],
  ["Sales Momentum Live", "Aaron Platt"],
  ["E.P.I.C", "Kaaba Luum"],
  ["Founder OS", "Matt Gray"],
  ["Scaling With Systems LIVE 2023", "Ravi Abuvala"],
  ["The CEO Lawyer Summit 2022", "Ali Awad"],
  ["The Behavior Panel Live", "The Behavior Panel, Las Vegas, NV"],
  ["The Guardians Annual", "Thaddeus Gala"],
  ["Rise X", "Joel Kaplan and Sergio Tavarez, Costa Rica"],
  ["Bulletproof Financial Accelerator", "John Whiting, Orlando, FL"],
  ["Ace Interstellar", "Michael Sheridan, Mexico"],
  ["Powerhouse", "Los Silva"],
  ["EGC 2022", "Austin Zelan"],
  ["Scaling With Systems LIVE 2022", "Ravi Abuvala, Miami, FL"],
  ["The CEO Lawyer Summit 2021", "Ali Awad"],
  ["Epic Growth Conference 2021", "Tyler Cerny and Austin Zelan, Las Vegas, NV"],
  ["Behavioral Selling", "Chase Hughes, Miami, FL"],
  ["Takeover Live 3", "Danny Tran, Sundance, UT"],
  ["Group Convert Live", "Kim Dang, Las Vegas, NV"],
  ["Takeover Live 2", "Danny Tran, Las Vegas, NV"],
  ["7-Figure Agency", "Joel Kaplan, Playa del Carmen, Mexico"],
  ["Takeover Live 1", "Danny Tran, Las Vegas, NV"],
]

function findCard(cards, slug) {
  return cards.find((card) => card.slug === slug)
}

function StudyCard({ card, title, meta, description }) {
  const body = (
    <>
      {card?.cover ? (
        <img src={card.cover.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
      ) : (
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "300px auto" }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-transparent" />
      <div className="relative p-5">
        <h3 className="font-serif text-2xl font-semibold leading-tight">{title}</h3>
        <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-bone/60">{meta}</p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-bone/80">{description}</p>
      </div>
    </>
  )
  return card?.href ? <a href={card.href} className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden border border-brass/30 transition hover:border-brass">{body}</a> : <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden border border-bone/12 bg-onyx">{body}</div>
}

export default function CaseStudiesIndex() {
  const cards = caseStudyCards()

  useEffect(() => {
    document.title = "Event Production Case Studies for Founders | Iconic Events"
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.setAttribute(
        "content",
        "Event production case studies from Iconic Events: how we built summits, masterminds, and launches for founders, creators, and agencies in six countries."
      )
    }
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
          <h1 className="mx-auto max-w-[16ch] font-serif text-4xl sm:max-w-[22ch] font-semibold leading-[0.98] sm:text-7xl">
            Learn from the events we&rsquo;ve engineered.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl font-sans text-base leading-relaxed text-bone/65 sm:text-lg">
            Iconic Events is an event production company. These event production case studies show the rooms we have engineered for founders, creators, and agencies: summits, masterminds, retreats, and launches across the US, UK, Spain, the UAE, Mexico, and Costa Rica. Each one covers the problem, what we built, the scope of services, and how it went.
          </p>
        </div>
      </section>

      {/* The same client logos as the home page row, run as a band. The set
          is drawn twice so the loop is seamless; the copy is hidden from
          assistive tech. See PRESS in content.js before touching the files. */}
      <section aria-label="Trusted by" className="border-y border-brass/25 py-6 sm:py-8">
        <p className="mx-auto max-w-6xl px-5 text-center font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40 sm:px-6">
          Trusted by
        </p>
        <div className="logo-band mt-4 overflow-hidden">
          <div className="logo-band-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 items-center">
                {PRESS.logos.map((l) => (
                  <li key={l.name} className="shrink-0 px-2 sm:px-4">
                    <img
                      width={l.w}
                      height={l.h}
                      {...responsive(l.src, "200px")}
                      alt={copy === 0 ? l.name : ""}
                      loading="lazy"
                      className="h-10 w-auto opacity-60 sm:h-14"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">Events we have produced year after year</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {RECAP_GROUPS.map((group) => (
              <article key={group.name} className="border border-brass/40 bg-tidepool p-6 sm:p-7">
                <h3 className="font-serif text-3xl font-semibold leading-tight text-bone">{group.name}</h3>
                <p className="mt-2 font-sans text-sm text-bone/55">{group.client}</p>
                <ul className="mt-7 border-t border-bone/15">
                  {group.items.map(([slug, title, description]) => {
                    const card = findCard(cards, slug)
                    const item = <><span className="font-bold">{title}</span>: {description}</>
                    return (
                      <li key={slug} className="border-b border-bone/15 py-4 font-sans text-sm leading-relaxed text-bone/80 last:border-b-0">
                        {card?.href ? <a href={card.href} className="transition hover:text-brass">{item}</a> : item}
                      </li>
                    )
                  })}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-bone/10 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">Case studies</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CASE_STUDY_GROUP.map(([slug, title, meta, description]) => (
              <li key={slug}><StudyCard card={findCard(cards, slug)} title={title} meta={meta} description={description} /></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-bone/10 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-5xl">More events we have produced</h2>
          <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {MORE_EVENTS.map(([name, client]) => (
              <li key={name} className="border-b border-bone/12 pb-3 font-sans text-sm leading-relaxed text-bone/75"><span className="font-bold text-bone">{name}:</span> {client}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-bone/10 py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 sm:px-6">
          <div>
            <h2 className="max-w-[24ch] font-serif text-3xl font-semibold leading-tight sm:text-5xl">
              Tell us about the room you want to build.
            </h2>
            <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-bone/65">
              Begin with the vision call. No pricing is discussed. We are establishing whether your event is one we can build.
            </p>
            <a href="/services" className="mt-5 inline-block font-sans text-xs uppercase tracking-[0.15em] text-bone hover:text-brass">
              See our services
            </a>
          </div>
          <a
            href="/contact"
            className="bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx"
          >
            Request the vision call
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
