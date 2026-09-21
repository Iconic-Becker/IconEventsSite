import { useEffect } from "react"
import { TESTIMONIALS, GALLERY } from "../content.js"
import { CASE_STUDIES } from "../case-studies.js"

/* The confirmation page a visitor reaches after a successful enquiry.
   Its job is to close the loop, then keep them on the site: proof from a
   client, the work itself, and the room in photographs.

   Reached by client side navigation from the form, so it does not depend on
   the host rewrite. A direct load or refresh of /nextsteps does, and that
   rewrite is still outstanding. */
export default function NextSteps() {
  /* Featured testimonial. The content file carries no dates, so "most
     recent" cannot be derived: this takes the first item, and reordering
     TESTIMONIALS.items in src/content.js changes which one appears. */
  const testimonial = TESTIMONIALS.items[0]
  const studies = CASE_STUDIES.slice(0, 3)
  const frames = GALLERY.band.slice(0, 6)

  useEffect(() => {
    document.title = "Request confirmed · Iconic Events"
    const description = document.querySelector('meta[name="description"]')
    if (description) {
      description.setAttribute(
        "content",
        "Your request has been received. A director from Iconic Events will be in touch within 48 hours."
      )
    }
    /* A confirmation page has no business in search results. */
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement("meta")
      robots.setAttribute("name", "robots")
      document.head.appendChild(robots)
    }
    robots.setAttribute("content", "noindex, nofollow")
    return () => robots.setAttribute("content", "index, follow")
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <header className="border-b border-bone/10 bg-onyx">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <a href="/" aria-label="Iconic Events home">
            <img src="/logos/IE_logo_white.png" alt="Iconic Events" className="h-8 w-auto" />
          </a>
          <a href="/" className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-bone/60 hover:text-brass">
            Back to site
          </a>
        </nav>
      </header>

      {/* confirmation */}
      <section className="relative overflow-hidden border-b border-brass/25 py-20 sm:py-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "420px auto" }}
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <img src="/logos/IE_sigil_gold.png" alt="" className="h-12 w-auto" />
          <p className="mt-9 font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">
            Request confirmed
          </p>
          <h1 className="mt-5 max-w-[20ch] font-serif text-4xl font-semibold leading-[0.98] sm:text-7xl">
            Your request is in. We&rsquo;ll be in touch.
          </h1>
          <p className="mt-7 max-w-[58ch] font-sans text-lg leading-relaxed text-bone/70">
            A senior director has your brief and will write to you within 48 hours. If we are not the right
            fit, we will tell you on the first call.
          </p>
        </div>
      </section>

      {/* testimonial */}
      <section className="border-b border-bone/10 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">
            Our most recent testimonial
          </p>
          <div className="mt-9 grid items-center gap-9 md:grid-cols-[0.34fr_1fr] md:gap-14">
            <img
              src={testimonial.img}
              alt={testimonial.name}
              className="aspect-square w-full max-w-[260px] object-cover grayscale"
            />
            <div>
              <blockquote className="max-w-[24ch] font-serif text-3xl font-semibold leading-tight sm:text-5xl">
                {testimonial.quote.iconic}
              </blockquote>
              <p className="mt-7 font-serif text-2xl">
                {testimonial.name}
                <span className="mt-2 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brass">
                  {testimonial.role.iconic}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* case studies */}
      <section className="border-b border-bone/10 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">
                While you wait
              </p>
              <h2 className="mt-4 max-w-[22ch] font-serif text-4xl font-semibold leading-none sm:text-6xl">
                Read how the rooms were built.
              </h2>
            </div>
            <a href="/#work" className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass hover:text-bone">
              All case studies →
            </a>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {studies.map((study) => {
              const cover = study.media.hero ?? study.media.band ?? study.media.resultLeft
              return (
                <a
                  key={study.slug}
                  href={`/case-studies/${study.slug}`}
                  className="group relative min-h-[280px] overflow-hidden border border-bone/15"
                >
                  {cover && (
                    <img
                      src={cover.src}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brass">
                      {study.caseNumber}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold">{study.name}</h3>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* gallery */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="font-serif text-4xl font-semibold leading-none sm:text-6xl">From the room.</h2>
            <a href="/#gallery" className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass hover:text-bone">
              Full gallery →
            </a>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {frames.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`Iconic Events production frame ${index + 1}`}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover grayscale transition duration-700 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-bone/10 py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <a
            href="/"
            className="inline-block bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx"
          >
            Back to Iconic Events
          </a>
        </div>
      </footer>
    </main>
  )
}
