import { useEffect } from "react"
import SiteFooter from "./SiteFooter.jsx"
import SiteHeader from "./SiteHeader.jsx"
import Cta from "./Cta.jsx"

const TITLE = "Miami Event Production Company | Iconic Events"
const DESCRIPTION =
  "Contact Iconic Events, a Miami and Las Vegas event production company, to talk about your next sell-from-stage membership or sponsorship room."

export default function ContactLocationPage() {
  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <section className="relative overflow-hidden bg-onyx py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "440px auto" }} aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-6">
          <h1 className="mx-auto max-w-5xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">Contact Iconic Events</h1>
          <p className="mx-auto mt-8 max-w-3xl font-sans text-lg leading-relaxed text-bone/75 sm:text-xl">We are Iconic Events, a Miami event production company and Las Vegas event production company for founder-led businesses. If your business is staking a launch, a membership, or a sponsorship push on a single room, tell us about it below.</p>
        </div>
      </section>
      <section className="bg-bone pb-8 pt-16 text-onyx sm:pb-10 sm:pt-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-6xl">Begin With the Vision Call</h2>
            <p className="mt-6 font-sans text-lg leading-relaxed text-onyx/75">No pricing is discussed on this call. We are establishing whether your event is one we can build. We accept a limited number of engagements each year and turn down more than we accept.</p>
            <p className="mt-6 font-sans text-lg leading-relaxed text-onyx/75">Fill out the form to start a conversation about the room you&apos;re building:</p>
          </div>
        </div>
      </section>
      <section className="bg-bone pb-16 text-onyx sm:pb-24">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:px-6 md:grid-cols-3">
          <div className="border border-onyx/15 bg-onyx/[0.03] p-6"><h3 className="font-serif text-2xl font-semibold">Business stage</h3><p className="mt-3 font-sans text-sm leading-relaxed text-onyx/65">e.g. Under $1M, $1M-$5M, $5M+</p></div>
          <div className="border border-onyx/15 bg-onyx/[0.03] p-6"><h3 className="font-serif text-2xl font-semibold">Timeline</h3><p className="mt-3 font-sans text-sm leading-relaxed text-onyx/65">e.g. Next 3 months, 3-6 months, 6+ months out</p></div>
          <div className="border border-onyx/15 bg-onyx/[0.03] p-6"><h3 className="font-serif text-2xl font-semibold">Desired outcomes</h3><p className="mt-3 font-sans text-sm leading-relaxed text-onyx/65">Select any that apply: sell a premium offer from the stage, launch a new offer or membership, move clients into a higher tier, deepen customer loyalty and retention, create months of authority content</p></div>
        </div>
      </section>
      <Cta eyebrow={false} title="Start a Conversation" lead="Fill out the form to start a conversation about the room you're building:" />
      <section className="bg-tidepool py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-6xl">Reach Us Directly</h2>
            <dl className="mt-8 border-t border-bone/15">
              <div className="border-b border-bone/15 py-5"><dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-brass">Email</dt><dd className="mt-2 font-sans text-lg"><a href="mailto:icon@iconicevents.com" className="underline underline-offset-4 hover:text-brass">icon@iconicevents.com</a></dd></div>
              <div className="border-b border-bone/15 py-5"><dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-brass">Phone</dt><dd className="mt-2 font-sans text-lg"><a href="tel:+13057915290" className="underline underline-offset-4 hover:text-brass">(305) 791-5290</a></dd></div>
            </dl>
          </div>
          <div>
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-6xl">Response Time</h2>
            <p className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-bone/75">We respond within 48 hours of every inquiry. If we are not the right fit for your event, we will tell you on the first call, not after a drawn-out sales process.</p>
          </div>
        </div>
      </section>
      <section className="bg-onyx py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
          <h2 className="mx-auto max-w-4xl font-serif text-4xl font-semibold leading-tight text-bone sm:text-6xl">Where We Work</h2>
          <div className="mx-auto mt-8 max-w-3xl font-sans text-lg leading-relaxed text-bone/75">
            <p>Miami and Las Vegas are our home base, but our production work has not stayed inside those two cities. We have produced events across South Florida, Mexico, London, Madrid, Dubai, and France.</p>
            <p className="mt-6">In London, we built a room for Chase Hughes aboard HMS Belfast, a decommissioned WWII warship on the Thames. Distance does not rule your event out.</p>
            <p className="mt-6">Tell us where in the world you are building, and we will confirm whether we can produce it there.</p>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
