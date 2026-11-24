import { useEffect, useState } from "react"
import SiteFooter from "./SiteFooter.jsx"
import SiteHeader from "./SiteHeader.jsx"
import Cta from "./Cta.jsx"
import { GALLERY } from "../content.js"
import { responsive } from "../lib/img.js"

const ABOUT_GALLERY = [2, 6, 16, 22, 24, 25, 26, 28, 32, 33, 34, 35].map((n) => `/images/gallery/g${n}.webp`)
const TITLE = "Event Production Company | Iconic Events"
const DESCRIPTION =
  "Iconic Events is an event production company and agency engineering sell-from-stage events that drive membership and sponsorship revenue for founders."

function FormBrief() {
  return (
    <ul className="mt-10 max-w-xl border-t border-bone/15">
      <li className="border-b border-bone/15 py-5 font-sans text-sm leading-relaxed text-bone/70">
        <strong className="font-bold text-bone">Business stage</strong> (e.g., Under $1M, $1M-$5M, $5M+)
      </li>
      <li className="border-b border-bone/15 py-5 font-sans text-sm leading-relaxed text-bone/70">
        <strong className="font-bold text-bone">Timeline</strong> (e.g., Next 3 months, 3-6 months, 6+ months out)
      </li>
      <li className="border-b border-bone/15 py-5 font-sans text-sm leading-relaxed text-bone/70">
        <strong className="font-bold text-bone">Desired outcomes</strong> (select any that apply): sell a premium offer from the stage, launch a new offer or membership, move clients into a higher tier, deepen customer loyalty and retention, create months of authority content
      </li>
    </ul>
  )
}

export default function AboutPage() {
  const [bandImage, setBandImage] = useState(0)
  const [galleryImage, setGalleryImage] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBandImage((current) => (current + 1) % GALLERY.capability.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setGalleryImage((current) => (current + 1) % ABOUT_GALLERY.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />

      {/* Hero follows the homepage: one thesis, one supporting line, no card. */}
      <section className="relative overflow-hidden bg-onyx py-20 sm:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "440px auto" }} aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-6">
          <h1 className="mx-auto max-w-5xl font-serif text-5xl font-semibold leading-[0.96] tracking-tight sm:text-7xl lg:text-8xl">
            Not Just Event Planners. We&apos;re <span className="text-brass">Experience Engineers.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-2xl leading-snug text-bone/80 sm:text-3xl">
            Your reputation enters the room before you do. We make sure the room agrees with it.
          </p>
        </div>
      </section>

      {/* The homepage About section uses this bone editorial treatment. */}
      <section className="bg-bone py-16 text-onyx sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-[70ch] text-center font-sans text-lg leading-relaxed text-onyx/75">
            <p>Iconic Events is an event production company founded in 2017 and based in Miami</p>
            <p className="mt-6">We design and produce live events for founder-led businesses, coaches, and creators with past $1 million in revenue, and we build every event around one outcome: the room has to produce revenue and relational capital.</p>
            <p className="mt-6">We treat the event itself as a revenue instrument. Before we design a single production element, we study audience psychology, offer economics, and room physics: the same three inputs that separate our work from a logistics-first planner.</p>
          </div>
        </div>
      </section>

      <div className="relative h-[34vw] min-h-[220px] w-full overflow-hidden bg-onyx sm:h-[28vw]" aria-hidden="true">
        {GALLERY.capability.map((src, index) => (
          <img
            key={src}
            {...responsive(src, "100vw")}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-center grayscale transition-opacity duration-[1800ms] ${index === bandImage ? "opacity-100" : "opacity-0"}`}
          />
        ))}
      </div>

      {/* What We Build follows the homepage services treatment: title bar, then
          a quiet introduction and the content as a set of related objects. */}
      <section className="bg-onyx py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-brass/40 pb-3">
            <h2 className="font-serif text-4xl font-semibold leading-tight sm:text-6xl">What We Build</h2>
          </div>
          <p className="max-w-3xl font-sans text-lg leading-relaxed text-bone/70">As an event production agency, we run six disciplines as one sequence.</p>
          <ol className="mt-10 grid gap-px border border-bone/10 bg-bone/10 md:grid-cols-3">
            <li className="bg-onyx p-6 sm:p-8">
              <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-bone/35">01</span>
              <p className="mt-5 font-serif text-2xl leading-snug"><strong className="font-semibold">Strategy</strong> sets the revenue and ticket-tier plan and the sponsorship architecture before we design anything else.</p>
            </li>
            <li className="bg-onyx p-6 sm:p-8">
              <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-bone/35">02</span>
              <p className="mt-5 font-serif text-2xl leading-snug"><strong className="font-semibold">Creative and Production</strong> turn that plan into a stage, a set, and a show flow built to support it. Content captures the room while it happens</p>
            </li>
            <li className="bg-onyx p-6 sm:p-8">
              <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-bone/35">03</span>
              <p className="mt-5 font-serif text-2xl leading-snug"><strong className="font-semibold">Operations</strong> keeps the logistics from becoming the headache</p>
            </li>
          </ol>
          <div className="mt-10 max-w-3xl font-sans text-lg leading-relaxed text-bone/70">
            <p>We are equally clear about what we do not build: weddings, trade-show booths, corporate town halls, single-day panels or fireside chats, and events under 75 attendees unless private activations.</p>
            <p className="mt-6">We do not take on white-label agency work or day-of-only coordination either.</p>
          </div>
        </div>
      </section>

      {/* The homepage Method is a dark, patterned argument with a clear list. */}
      <section className="relative overflow-hidden bg-tidepool py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "440px auto" }} aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-8 border-b border-brass/40 pb-3">
            <h2 className="font-serif text-4xl font-semibold leading-tight text-bone sm:text-6xl">Why We Engineer the Room</h2>
          </div>
          <div className="max-w-3xl font-sans text-lg leading-relaxed text-bone/75">
            <p>Trust is built in a room, not on a social feed. An audience can follow a founder online for years without fully believing them; a few days in the same room settles that permanently, in one direction or the other.</p>
            <p className="mt-6">A room only gets one shot to close. Engineering it means making five specific choices, each one built around that constraint:</p>
          </div>
          <ul className="mt-10 grid gap-px border border-bone/15 bg-bone/15 md:grid-cols-2">
            <li className="bg-tidepool p-6 sm:p-8"><strong className="font-serif text-2xl font-semibold">Decisions stay in-house.</strong><p className="mt-3 font-sans leading-relaxed text-bone/70">A launch, a membership, or a sponsorship pitch does not survive being split across a stack of vendors who never rehearsed the offer together.</p></li>
            <li className="bg-tidepool p-6 sm:p-8"><strong className="font-serif text-2xl font-semibold">Room psychology gets designed on purpose.</strong><p className="mt-3 font-sans leading-relaxed text-bone/70">Trust and attention have to be built, not assumed, in the time between doors opening and the offer landing.</p></li>
            <li className="bg-tidepool p-6 sm:p-8"><strong className="font-serif text-2xl font-semibold">Production functions as an instrument for the offer.</strong><p className="mt-3 font-sans leading-relaxed text-bone/70">A lighting cue or a stage transition either supports the close or works against it.</p></li>
            <li className="bg-tidepool p-6 sm:p-8"><strong className="font-serif text-2xl font-semibold">Revenue is the success metric, not attendance or applause.</strong><p className="mt-3 font-sans leading-relaxed text-bone/70">Those numbers are what tell us whether the room did its job.</p></li>
            <li className="bg-tidepool p-6 sm:p-8 md:col-span-2"><strong className="font-serif text-2xl font-semibold">One person holds authority over the room, not a committee of subcontractors.</strong><p className="mt-3 font-sans leading-relaxed text-bone/70">A sell-from-stage moment cannot wait on a group agreeing in real time.</p></li>
          </ul>
        </div>
      </section>

      <section className="bg-bone text-onyx" aria-label="Event production gallery">
        <div className="grid h-[920px] w-full grid-cols-2 grid-rows-3 md:h-[840px] md:grid-cols-3 md:grid-rows-2">
          {Array.from({ length: 6 }, (_, offset) => ABOUT_GALLERY[(galleryImage + offset) % ABOUT_GALLERY.length]).map((src, offset) => (
            <div key={`${src}-${offset}`} className="relative min-h-0 overflow-hidden">
              {ABOUT_GALLERY.map((image) => (
                <img key={`${offset}-${image}`} {...responsive(image, "(min-width: 768px) 33vw, 50vw")} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-[3000ms] ease-in-out ${image === src ? "opacity-100" : "opacity-0"}`} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bone py-16 text-onyx sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-8 border-b-4 border-tidepool pb-3">
            <h2 className="font-serif text-4xl font-semibold leading-tight text-onyx sm:text-6xl">Built for Founders</h2>
          </div>
          <div className="grid gap-8 font-sans text-lg leading-relaxed text-onyx/75 md:grid-cols-2 md:gap-14">
            <div>
              <p>We work with founder-led businesses specifically because those operators are staking a launch, a membership tier, or a sponsorship push on a single room, and they need every element of that room working toward the same close.</p>
              <p className="mt-6">The people who end up in that room, an audience considering a premium offer, a membership, or a sponsorship pitched from the stage, feel that same engineering. The event reads as deliberate: a stage built around what the offer needs to prove, lighting and space designed around how a room reads trust, and a single point of authority running the event.</p>
            </div>
            <div>
              <p>Our published case work backs that up. A 2023 event we built for Ben Newman at the Palms Casino Resort generated $1.8 million in membership sales across 150 attendees, and its 2024 follow-up sold out completely. An event ecosystem by design helped grow PMU World from 40 attendees to over 2,000 in just two years. A single-night event we built for Bad After Dark produced $146,000 in sponsorships within six days.</p>
              <p className="mt-6">If a launch, a membership tier, or a sponsorship push is riding on your next room, begin with the vision call. No pricing is discussed on it. We accept a limited number of engagements each year and turn down more than we accept.</p>
            </div>
          </div>
        </div>
      </section>

      <Cta
        eyebrow={false}
        title="Start a Conversation"
        lead="Fill out the form below and a senior director will follow up directly:"
        aside={<FormBrief />}
      />

      <SiteFooter />
    </main>
  )
}
