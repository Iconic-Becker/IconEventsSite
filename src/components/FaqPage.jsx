import { useEffect, useState } from "react"
import SiteFooter from "./SiteFooter.jsx"
import SiteHeader from "./SiteHeader.jsx"
import Icon from "./Icon.jsx"

const TITLE = "Event Production FAQ | Iconic Events"
const DESCRIPTION =
  "Common questions about Iconic Events' event production timeline, requirements, and process, from who we work with to what happens after you reach out."

const FAQS = [
  [
    "What does Iconic Events do?",
    "Iconic Events is an event production company and experience engineering studio based in Miami and Las Vegas. We design and produce live events for founder-led businesses, coaches, and creators with past $1 million in revenue, and we judge every room we build by what it sells, not how smoothly it runs.",
  ],
  [
    "What is an event production company, and how is Iconic different from a typical one?",
    "An event production company designs and builds the stage, technical, and creative elements of a live event, not just the logistics around it. We go a step further and hold five differences from a generic planner: decisions stay in-house, room psychology gets designed on purpose, production functions as an instrument for the offer, revenue is the success metric, and one person holds authority over the room.",
  ],
  [
    "Who does Iconic work with?",
    "We work with founder-led businesses, coaches, and creators past $1 million in revenue. We don't work with Fortune 500 brands chasing enterprise budgets; our scope is built around operators staking a launch, a membership, or a sponsorship push in a single room.",
  ],
  [
    "What types of events does Iconic produce?",
    "We produce multi-day conferences and summits, high-ticket brand launches, ascension masterminds, corporate retreats, and single-day activations.",
  ],
  [
    "What events does Iconic not produce?",
    "We do not produce weddings and galas, trade-show booths, corporate town halls, single-day panels or fireside chats, events under 75 attendees, or any event without a sell-from-stage or revenue component. We also do not take on white-label agency work or day-of-only coordination.",
  ],
  [
    "Is there a minimum event size?",
    "Yes. We do not take on events under 75 attendees. This is one of the boundaries in our scope, alongside not producing weddings, trade shows, town halls, or events without a revenue component.",
  ],
  [
    "Where is Iconic based, and do you travel for events?",
    "We are based in Miami and Las Vegas, but that is not a hard boundary on where we produce. We took our production to London for Chase Hughes's Behavior Pilot build aboard HMS Belfast, so a project outside those two cities is not automatically out of scope. Contact us directly to confirm we can produce your event's specific location.",
  ],
  [
    "How to hire an event production company like Iconic",
    "Reach out through our contact process and describe your business stage, timeline, and desired outcome for the room, whether that is a premium offer, a membership launch, or a sponsorship push. We respond within 48 hours, and if we are not the right fit, we will tell you on the first call.",
  ],
  [
    "How much does an Iconic event cost?",
    "Engagements start at $30,000, with an average client budget around $1,000,000. The fee is fixed at the outset and tied to scope, not spend. The vision call itself involves no pricing discussion; it establishes whether we can build your event.",
  ],
  [
    "What happens after I reach out?",
    "We respond within 48 hours. If we are not the right fit for your event, we will tell you on the first call.",
  ],
  [
    "What does Iconic's event production timeline look like?",
    "Our six disciplines run in a fixed order. Strategy comes first and locks the revenue and ticket-tier plan before anything else gets designed. Creative and Production come next, building the stage and show flow around that plan. Content runs during the event itself, capturing the room live. Operations holds the logistics together throughout, and Revenue is the final stage, converting what Strategy set out to sell. That order is the event production timeline every room we build follows, from start to close.",
  ],
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0)

  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
      }).replace(/</g, "\\u003c") }} />
      <SiteHeader />

      <section className="relative overflow-hidden bg-onyx py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "440px auto" }} aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-6">
          <h1 className="mx-auto max-w-5xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">Frequently Asked Questions About Iconic Events</h1>
        </div>
      </section>

      <section className="bg-bone py-16 text-onyx sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          {FAQS.map(([question, answer], index) => (
            <details key={question} className="group border-b border-onyx/15 py-7 first:border-t" open={openIndex === index} onToggle={(event) => { if (event.currentTarget.open) setOpenIndex(index) }}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-8 font-serif text-2xl font-semibold leading-tight text-onyx transition-colors duration-300 marker:hidden group-open:text-tidepool hover:text-tidepool/80 [&::-webkit-details-marker]:hidden sm:text-3xl">
                <span>{question}</span>
                <Icon name="plus" className="mt-2 h-5 w-5 shrink-0 text-brass transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="mt-5 max-w-[72ch] font-sans text-lg leading-relaxed text-onyx/70 transition-all duration-300 ease-in-out group-open:mt-5 group-open:opacity-100">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-tidepool py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
          <p className="font-serif text-3xl font-semibold leading-snug text-bone sm:text-5xl">A launch, a membership, a sponsorship push: if your business is staking one of those on a single room, begin with the vision call.</p>
          <p className="mt-8 font-sans text-lg leading-relaxed text-bone/75">
            Or reach us directly: <a href="mailto:icon@iconicevents.com" className="underline underline-offset-4 hover:text-brass">icon@iconicevents.com</a> or <a href="tel:+13057915290" className="underline underline-offset-4 hover:text-brass">(305) 791-5290</a>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
