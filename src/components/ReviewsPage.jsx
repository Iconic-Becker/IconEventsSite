import { useEffect } from "react"
import { CASE_STUDIES } from "../case-studies.js"
import SiteHeader from "./SiteHeader.jsx"
import SiteFooter from "./SiteFooter.jsx"
import CtaBand from "./CtaBand.jsx"
import InTheRoom from "./InTheRoom.jsx"

/* /reviews: what clients say, in their own words.

   Built only from case study quotes marked approved (house rule 4 in
   case-studies.js), so a quote appears here the moment it is approved there
   and an unapproved one never can. Below them, the creators rail from the
   homepage: who else has trusted us with a room. */

const TITLE = "Client Reviews | Iconic Events"
const DESCRIPTION =
  "What founders and creators say about working with Iconic Events, in their own words, with the event each review comes from."

const REVIEWS = CASE_STUDIES.filter((s) => s.testimonial?.approved).map((s) => ({
  slug: s.slug,
  quote: s.testimonial.quote,
  name: s.details.client,
  title: s.details.clientTitle,
  event: s.name,
}))

export default function ReviewsPage() {
  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Reviews</p>
          <h1 className="mx-auto mt-5 max-w-[18ch] font-serif text-4xl font-semibold leading-[0.98] sm:text-7xl">
            In their own words.
          </h1>
        </div>
      </section>

      <section className="bg-bone py-16 text-onyx sm:py-24">
        <ul className="mx-auto max-w-4xl space-y-16 px-5 sm:px-6">
          {REVIEWS.map((r) => (
            <li key={r.slug}>
              <figure>
                <span aria-hidden="true" className="block font-serif text-7xl leading-none text-brass">
                  &ldquo;
                </span>
                <blockquote className="mt-2 font-serif text-2xl leading-snug text-onyx sm:text-4xl">{r.quote}</blockquote>
                <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t-4 border-tidepool pt-4">
                  <span className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-onyx">{r.name}</span>
                  {r.title && <span className="font-sans text-sm text-onyx/60">{r.title}</span>}
                  <a
                    href={`/case-studies/${r.slug}`}
                    className="ml-auto font-sans text-xs font-bold uppercase tracking-[0.16em] text-tidepool underline decoration-brass underline-offset-4 transition hover:text-brass"
                  >
                    {r.event} →
                  </a>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <div className="pt-16 sm:pt-24">
        <InTheRoom />
      </div>

      <CtaBand
        headline="Tell us about the room you want to build."
        href="/contact"
        secondary={{ href: "/case-studies", label: "See the case studies →" }}
      />
      <SiteFooter />
    </main>
  )
}
