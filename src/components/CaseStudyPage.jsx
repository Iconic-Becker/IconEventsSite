import { useEffect, useState } from "react"
import {
  otherCaseStudies,
  publishedMetrics,
  faqsFor,
} from "../case-studies.js"
import Cta from "./Cta.jsx"
import SiteHeader from "./SiteHeader.jsx"

/* ── helpers ───────────────────────────────────────────────────────────── */

/* youtube.com/watch?v=ID or youtu.be/ID -> privacy friendly embed src */
function embedSrc(url) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/)([\w-]{6,})/)
  if (match) return `https://www.youtube-nocookie.com/embed/${match[1]}`
  const vimeo = url.match(/vimeo\.com\/(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return null
}

function Photo({ asset, className = "", ratio = "" }) {
  if (!asset) return null
  return (
    <img
      src={asset.src}
      alt={asset.alt}
      loading="lazy"
      className={`w-full object-cover grayscale transition duration-700 hover:grayscale-0 ${ratio} ${className}`}
    />
  )
}

function VideoEmbed({ url, title }) {
  const src = embedSrc(url)
  if (!src) return null
  return (
    <div className="relative aspect-video w-full border border-brass/40 bg-onyx">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}

/* ── structured data ───────────────────────────────────────────────────────
   Article and FAQPage always. Review only when the quote is approved: never
   assert that a named person said something they have not signed off. */
function StructuredData({ study, faqs }) {
  const d = study.details
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.headline,
    description: study.summary,
    author: { "@type": "Organization", name: "Iconic Events" },
    publisher: { "@type": "Organization", name: "Iconic Events" },
    about: {
      "@type": "Event",
      name: study.name,
      ...(d.dates ? { startDate: d.dates } : {}),
      ...(d.venue
        ? {
            location: {
              "@type": "Place",
              name: d.venue,
              ...(d.city
                ? {
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: d.city,
                      ...(d.region ? { addressRegion: d.region } : {}),
                    },
                  }
                : {}),
            },
          }
        : {}),
      organizer: { "@type": "Organization", name: "Iconic Events" },
      ...(d.client ? { performer: { "@type": "Person", name: d.client } } : {}),
    },
  }

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }

  const blocks = [article, faqPage]

  if (study.testimonial.approved && study.testimonial.quote && d.client) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Review",
      itemReviewed: {
        "@type": "Service",
        name: "Event production and experience engineering",
        provider: {
          "@type": "Organization",
          name: "Iconic Events",
          address: { "@type": "PostalAddress", addressRegion: "FL", addressCountry: "US" },
        },
      },
      author: { "@type": "Person", name: d.client },
      reviewBody: study.testimonial.quote,
    })
  }

  return (
    <>
      {blocks.map((block, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  )
}

/* ── sections ──────────────────────────────────────────────────────────── */

function Approach({ study }) {
  const { pre, onsite, post } = study.approach
  const stages = [
    ["Pre production", pre],
    ["On site production", onsite],
    ["Post event", post],
  ].filter(([, steps]) => steps && steps.length)
  let counter = 0
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-11 px-5 sm:px-6 md:grid-cols-[0.4fr_1fr] md:gap-14">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">What We Did</p>
          <p className="mt-5 font-sans text-sm leading-relaxed text-bone/55">
            Here is how we built it, from the first plan to the last guest out. One team held all of it.
          </p>
        </div>
        <div>
          {stages.map(([label, steps], stageIndex) => (
            <div key={label} className={stageIndex ? "border-t border-bone/10 py-8" : "pb-8"}>
              <h3 className="font-serif text-2xl font-semibold">{label}</h3>
              <ol className="mt-4">
                {steps.map((step) => {
                  counter += 1
                  return (
                    <li key={step} className="grid grid-cols-[2.6ch_1fr] gap-4 py-2">
                      <span className="font-serif text-lg text-brass">{counter}</span>
                      <span className="font-sans text-[15.5px] leading-relaxed text-bone/70">{step}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Scope({ study }) {
  if (!study.scope.length) return null
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-11 px-5 sm:px-6 md:grid-cols-[0.4fr_1fr] md:gap-14">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Scope of Services</p>
          <p className="mt-5 font-sans text-sm leading-relaxed text-bone/55">
            Everything we were accountable for.
          </p>
        </div>
        <div>
          {study.scope.map(([label, body]) => (
            <div key={label} className="grid gap-3 border-t border-bone/10 py-4 sm:grid-cols-[11ch_1fr] sm:gap-5">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brass">{label}</span>
              <span className="font-sans text-[15.5px] leading-relaxed text-bone/70">{body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Copy fields take one string or an array of paragraphs.
function paragraphs(value) {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

function Results({ study }) {
  const d = study.details
  /* The right hand column: the event's own highlights where it has them,
     otherwise the published metrics. Value first, label under it. */
  const stats = study.highlights?.length
    ? study.highlights
    : publishedMetrics(study).map(([label, value]) => [value, label])
  const place = d.venue && d.city && d.venue.includes(d.city) ? d.venue : [d.venue, d.city].filter(Boolean).join(", ")
  const details = [
    ["Client", d.client],
    ["Venue", place],
    ["Year", d.year],
  ].filter(([, value]) => Boolean(value))
  const story = paragraphs(study.results)

  return (
    <section className="bg-bone py-16 text-onyx sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="border-b-4 border-tidepool pb-4">
          <h2 className="font-serif text-4xl font-semibold sm:text-6xl">How It Went</h2>
        </div>
        <div className={`mt-10 grid gap-12 ${stats.length ? "lg:grid-cols-[1fr_0.72fr] lg:gap-16" : ""}`}>
          <div className="min-w-0">
            {story.length > 0 && (
              <div className="grid max-w-[60ch] gap-5 font-serif text-xl leading-snug sm:text-2xl">
                {story.map((text) => <p key={text}>{text}</p>)}
              </div>
            )}
            {details.length > 0 && (
              <dl className={`grid gap-x-10 gap-y-4 sm:grid-cols-3 ${story.length ? "mt-10" : ""}`}>
                {details.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brass">{label}</dt>
                    <dd className="mt-1 font-serif text-xl">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {stats.length > 0 && (
            <dl className="grid content-start grid-cols-3 border-y border-tidepool/25">
              {stats.map(([value, label]) => (
                <div key={label} className="min-w-0 border-r border-tidepool/25 px-3 py-6 last:border-r-0 sm:px-5">
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-serif text-3xl font-semibold leading-none text-tidepool sm:text-5xl">{value}</dd>
                  <dd className="mt-3 font-sans text-[10px] uppercase leading-snug tracking-[0.14em] text-onyx/60 sm:text-xs">{label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        {(study.media.resultLeft || study.media.resultRight) && (
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            <Photo asset={study.media.resultLeft} ratio="aspect-[4/3]" />
            <Photo asset={study.media.resultRight} ratio="aspect-[4/3]" />
          </div>
        )}
      </div>
    </section>
  )
}

function Aftermovie({ study }) {
  if (!study.media.aftermovieUrl) return null
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2 className="max-w-[26ch] font-serif text-4xl font-semibold leading-none sm:text-6xl">
          Event Aftermovie.
        </h2>
        <div className="mt-9">
          <VideoEmbed url={study.media.aftermovieUrl} title={`${study.name} aftermovie`} />
        </div>
      </div>
    </section>
  )
}

/* Video left, quote as large type right. The quote half only renders when the
   client has approved it; the video half only when a video exists. */
function Testimonial({ study }) {
  const hasVideo = Boolean(embedSrc(study.media.testimonialUrl))
  const hasQuote = Boolean(study.testimonial.approved && study.testimonial.quote)
  if (!hasVideo && !hasQuote) return null
  const d = study.details
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2 className="max-w-[26ch] font-serif text-4xl font-semibold leading-none sm:text-6xl">
          What {d.client ?? "our client"} had to say about working with us.
        </h2>
        <div
          className={`mt-11 grid items-center gap-10 ${hasVideo && hasQuote ? "lg:grid-cols-2 lg:gap-14" : ""}`}
        >
          {hasVideo && (
            <VideoEmbed url={study.media.testimonialUrl} title={`${d.client ?? study.name} testimonial`} />
          )}
          {hasQuote && (
            <div>
              <p className="font-serif text-5xl leading-none text-brass">&ldquo;</p>
              <blockquote className="mt-4 border-l-2 border-brass pl-6 font-serif text-2xl leading-snug sm:text-3xl">
                {study.testimonial.quote}
              </blockquote>
              <p className="mt-7 font-serif text-2xl">
                {d.client}
                {d.clientTitle && (
                  <span className="mt-2 block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brass">
                    {d.clientTitle}
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function Gallery({ study }) {
  const images = study.media.gallery
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  const move = (direction) => setActive((current) => (current + direction + images.length) % images.length)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false)
      if (event.key === "ArrowLeft") move(-1)
      if (event.key === "ArrowRight") move(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  if (!images.length) return null

  return (
    <section className="bg-bone py-16 text-onyx sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-4 border-tidepool pb-4">
          <h2 className="font-serif text-4xl font-semibold sm:text-6xl">Inside {study.name}.</h2>
          <p className="font-sans text-xs uppercase tracking-[0.16em] text-onyx/45">Select a frame · Open to enlarge</p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => { setActive(index); setOpen(true) }}
              className="group relative aspect-[4/3] overflow-hidden bg-onyx"
              aria-label={`Open gallery image ${index + 1} of ${images.length}`}
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/55 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 font-serif text-3xl font-semibold text-bone">{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-onyx/95 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label="Case study photo gallery" onMouseDown={() => setOpen(false)}>
          <button type="button" onClick={() => setOpen(false)} className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center border border-bone/25 text-2xl text-bone hover:border-brass" aria-label="Close gallery">×</button>
          <button type="button" onClick={(event) => { event.stopPropagation(); move(-1) }} className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center border border-brass/60 bg-onyx/80 text-2xl text-brass sm:left-6" aria-label="Previous image">←</button>
          <img src={images[active].src} alt={images[active].alt} className="max-h-[88svh] max-w-full object-contain" onMouseDown={(event) => event.stopPropagation()} />
          <button type="button" onClick={(event) => { event.stopPropagation(); move(1) }} className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center border border-brass/60 bg-onyx/80 text-2xl text-brass sm:right-6" aria-label="Next image">→</button>
          <span className="absolute bottom-4 font-sans text-[10px] uppercase tracking-[0.18em] text-bone/55">{String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        </div>
      )}
    </section>
  )
}

function FAQ({ faqs }) {
  if (!faqs.length) return null
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-11 px-5 sm:px-6 md:grid-cols-[0.4fr_1fr] md:gap-14">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Questions, answered</p>
        <div>
          {faqs.map(([question, answer], index) => (
            <details key={question} className="group border-t border-bone/12 py-6" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-serif text-2xl font-semibold marker:hidden">
                {question}
                <span className="font-sans text-xl font-normal text-brass transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-bone/65">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Related({ study }) {
  const siblings = otherCaseStudies(study.slug, 4)
  if (!siblings.length) return null
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="font-serif text-4xl font-semibold sm:text-6xl">The next room.</h2>
          <a href="/case-studies" className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass hover:text-bone">View all work →</a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siblings.map((item) => {
            const cover = item.media.hero ?? item.media.band ?? item.media.resultLeft
            return (
              <a key={item.slug} href={`/case-studies/${item.slug}`} className="group relative min-h-[250px] overflow-hidden border border-bone/15 sm:min-h-[300px]">
                {cover && <img src={cover.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />}
                <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-serif text-2xl font-semibold">{item.name}</h3>
                  <p className="mt-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">{item.details.client}</p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CaseStudyNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-onyx px-5 text-bone">
      <div className="max-w-xl text-center">
        <img src="/logos/IE_sigil_gold.png" alt="" className="mx-auto h-12 w-auto" />
        <p className="mt-8 font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Case study not found</p>
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-6xl">This room isn't in the archive.</h1>
        <p className="mt-6 font-sans text-lg leading-relaxed text-bone/65">The case study you're looking for may have moved. The full archive is on the main page.</p>
        <a href="/#work" className="mt-10 inline-block bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx">View all work</a>
      </div>
    </main>
  )
}

export default function CaseStudyPage({ study }) {
  const faqs = faqsFor(study)
  const d = study.details
  const heroMeta = [d.client, d.venue, d.year].filter(Boolean).join(" · ")

  useEffect(() => {
    document.title = `${study.name} · Case Study · Iconic Events`
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute("content", study.summary)
  }, [study])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <StructuredData study={study} faqs={faqs} />

      <SiteHeader contactHere />

      {/* hero: the title sits on the image */}
      <section className="relative flex min-h-[62svh] items-end overflow-hidden sm:min-h-[78svh]">
        {study.media.hero && (
          <img src={study.media.hero.src} alt={study.media.hero.alt} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/60 to-onyx/20" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-24 sm:px-6 sm:pb-16">
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brass sm:text-xs sm:tracking-[0.24em]">{heroMeta}</p>
          <h1 className="mt-5 max-w-[22ch] font-serif text-4xl font-semibold leading-[0.98] sm:text-7xl">{study.headline}</h1>
        </div>
      </section>

      {/* summary */}
      <section className="bg-bone py-16 text-onyx sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="border-b-4 border-tidepool pb-4">
            <h2 className="font-serif text-4xl font-semibold sm:text-6xl">Summary</h2>
          </div>
          <p className="mt-9 max-w-[66ch] border-l-[3px] border-brass pl-7 font-serif text-2xl leading-snug sm:text-3xl">
            {study.summary}
          </p>
        </div>
      </section>

      {/* challenge, with its photo alongside */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-11 px-5 sm:px-6 md:grid-cols-[1fr_0.62fr] md:gap-14">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">The Problem</p>
            <div className="mt-5 grid max-w-[65ch] gap-5 font-sans text-lg leading-relaxed text-bone/70">
              {paragraphs(study.challenge).map((text) => <p key={text}>{text}</p>)}
            </div>
          </div>
          <Photo asset={study.media.challenge} ratio="aspect-[4/5]" />
        </div>
      </section>

      <Approach study={study} />
      <Scope study={study} />

      {study.media.band && (
        <div className="w-full">
          <img src={study.media.band.src} alt={study.media.band.alt} loading="lazy" className="aspect-[21/9] w-full object-cover" />
        </div>
      )}

      <Results study={study} />

      <Aftermovie study={study} />
      <Testimonial study={study} />
      <Gallery study={study} />
      <FAQ faqs={faqs} />

      {/* citation sentence: one standalone answer to "who produced this" */}
      <section className="border-t border-bone/10 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="max-w-[60ch] font-sans text-base leading-relaxed text-bone/55">{study.citation}</p>
        </div>
      </section>

      {/* the one ask on the page: the site's contact form, headed by this event's line */}
      <Cta eyebrow="Start a Conversation" title={study.cta} />

      <Related study={study} />

    </main>
  )
}
