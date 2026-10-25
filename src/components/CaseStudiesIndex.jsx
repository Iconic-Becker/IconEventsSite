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
export default function CaseStudiesIndex() {
  const cards = caseStudyCards()

  useEffect(() => {
    document.title = "Case Studies · Iconic Events"
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.setAttribute(
        "content",
        "Learn from the events Iconic Events has engineered for founders, agencies and creators across the US, UK, Spain and the UAE."
      )
    }
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Case Studies</p>
          <h1 className="mt-5 max-w-[16ch] font-serif text-4xl sm:max-w-[22ch] font-semibold leading-[0.98] sm:text-7xl">
            Learn from the events we&rsquo;ve engineered.
          </h1>
        </div>
      </section>

      {/* The same client logos as the home page row, run as a band. The set
          is drawn twice so the loop is seamless; the copy is hidden from
          assistive tech. See PRESS in content.js before touching the files. */}
      <section aria-label="Trusted by" className="border-y border-brass/25 py-6 sm:py-8">
        <p className="mx-auto max-w-6xl px-5 font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40 sm:px-6">
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const meta = card.client
              const place = card.location ?? card.venue

              const body = (
                <>
                  {card.cover ? (
                    <img
                      src={card.cover.src}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-[0.05]"
                      style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "300px auto" }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-transparent" />
                  <div className="relative p-5">
                    {card.format && (
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brass">
                        {card.format}
                      </span>
                    )}
                    <h2 className="mt-2 font-serif text-2xl font-semibold leading-tight">{card.name}</h2>
                    {meta && (
                      <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-bone/60">{meta}</p>
                    )}
                    {place && (
                      <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-bone/35">{place}</p>
                    )}
                  </div>
                </>
              )

              return (
                <li key={card.slug}>
                  {card.href ? (
                    <a
                      href={card.href}
                      className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden border border-brass/30 transition hover:border-brass"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="relative flex min-h-[260px] flex-col justify-end overflow-hidden border border-bone/12 bg-onyx">
                      {body}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-bone/10 py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 sm:px-6">
          <h2 className="max-w-[24ch] font-serif text-3xl font-semibold leading-tight sm:text-5xl">
            Tell us about the room you want to build.
          </h2>
          <a
            href="/#contact"
            className="bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx"
          >
            Start a conversation
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
