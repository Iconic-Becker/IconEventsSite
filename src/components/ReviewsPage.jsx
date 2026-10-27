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

/* Video testimonials, from Icon on 27 Oct 2026. Ambro's also sits on the
   Net Rev Summit case study. Scott's and Daniel's titles and events are
   still to come from Icon; until then they carry no event link. */
const VIDEO_REVIEWS = [
  { name: "Ambro Dipilato", title: null, event: "Net Rev Summit 2026", slug: "net-rev-summit-2026", url: "https://youtu.be/4j77Mc4tc5M" },
  { name: "Scott Rodrigues", title: null, event: null, slug: null, url: "https://youtu.be/WSRpzsUqEak" },
  { name: "Daniel Dipilato", title: null, event: null, slug: null, url: "https://youtu.be/h2NEy-b0mFo" },
]

const embedSrc = (url) => {
  const m = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/)
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null
}

function VideoReviews() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">On camera</p>
        <h2 className="mt-4 max-w-[22ch] font-serif text-4xl font-semibold leading-none text-bone sm:text-6xl">
          Three clients, in their own words.
        </h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-3">
          {VIDEO_REVIEWS.map((r) => (
            <li key={r.url}>
              <figure>
                <div className="relative aspect-video w-full border border-brass/40 bg-onyx">
                  <iframe
                    src={embedSrc(r.url)}
                    title={`${r.name} on working with Iconic Events`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-bone/15 pt-3">
                  <span className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-bone">{r.name}</span>
                  {r.title && <span className="font-sans text-sm text-bone/60">{r.title}</span>}
                  {r.event &&
                    (r.slug ? (
                      <a href={`/case-studies/${r.slug}`} className="ml-auto font-sans text-xs font-bold uppercase tracking-[0.16em] text-brass transition hover:text-bone">
                        {r.event} →
                      </a>
                    ) : (
                      <span className="ml-auto font-sans text-xs font-bold uppercase tracking-[0.16em] text-bone/50">{r.event}</span>
                    ))}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

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

      <VideoReviews />

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
        href="/get-a-quote"
        secondary={{ href: "/case-studies", label: "See the case studies →" }}
      />
      <SiteFooter />
    </main>
  )
}
