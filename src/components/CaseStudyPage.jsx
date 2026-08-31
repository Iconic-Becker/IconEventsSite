import { useEffect, useState } from "react"
import { METHOD } from "../content.js"
import { otherCaseStudies } from "../case-studies.js"
import { CtaBrackets } from "./CtaButtons.jsx"
import Cta from "./Cta.jsx"

const FAQS = [
  { q: "When should Iconic enter the process?", a: "Before venue, production, and programming decisions are locked. The earlier the outcome is defined, the more precisely the room can be engineered around it." },
  { q: "Do you manage the full event?", a: "Yes. Strategy, creative direction, production, show flow, and on-site execution are held by one team, with one line of accountability." },
  { q: "What size room is the right fit?", a: "The room follows the commercial objective, not a minimum headcount. We begin with the offer, the audience, and the decision the event needs to produce." },
  { q: "Can you work with our existing team?", a: "Yes. Internal teams and trusted partners are integrated into one operating plan. Roles, approvals, and decision rights are established before production begins." },
  { q: "How far in advance should we begin?", a: "Six to twelve months is the strongest working window. Shorter timelines are assessed against venue, production, and creative availability." },
]

function CaseStudyGallery({ study }) {
  const images = study.gallery
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const move = (direction) => setActive((current) => (current + direction + images.length) % images.length)

  useEffect(() => {
    if (!lightboxOpen) return undefined
    const onKey = (event) => {
      if (event.key === "Escape") setLightboxOpen(false)
      if (event.key === "ArrowLeft") move(-1)
      if (event.key === "ArrowRight") move(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxOpen])

  if (!images.length) return null

  return (
    <section className="bg-bone py-16 text-onyx sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b-4 border-tidepool pb-4">
          <div><p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Photo gallery</p><h2 className="mt-3 font-serif text-4xl font-semibold sm:text-6xl">Inside {study.name}.</h2></div>
          <p className="font-sans text-xs uppercase tracking-[0.16em] text-onyx/45">Select a frame · Open to enlarge</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {images.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => { setActive(index); setLightboxOpen(true) }}
              className="group relative aspect-[4/3] min-w-0 basis-full flex-grow overflow-hidden bg-onyx sm:basis-[240px]"
              aria-label={`Open gallery image ${index + 1} of ${images.length}`}
            >
              <img src={image.src} alt={image.alt} loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx/55 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 font-serif text-3xl font-semibold text-bone">{String(index + 1).padStart(2, "0")}</span>
              <span className="absolute bottom-4 right-4 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-bone/70 opacity-0 transition group-hover:opacity-100">Open frame</span>
            </button>
          ))}
        </div>
      </div>
      {lightboxOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-onyx/95 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label="Case study photo gallery" onMouseDown={() => setLightboxOpen(false)}>
          <button type="button" onClick={() => setLightboxOpen(false)} className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center border border-bone/25 text-2xl text-bone hover:border-brass" aria-label="Close gallery">×</button>
          <button type="button" onClick={(event) => { event.stopPropagation(); move(-1) }} className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center border border-brass/60 bg-onyx/80 text-2xl text-brass sm:left-6" aria-label="Previous image">←</button>
          <img src={images[active].src} alt={images[active].alt} className="max-h-[88svh] max-w-full object-contain" onMouseDown={(event) => event.stopPropagation()} />
          <button type="button" onClick={(event) => { event.stopPropagation(); move(1) }} className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center border border-brass/60 bg-onyx/80 text-2xl text-brass sm:right-6" aria-label="Next image">→</button>
          <span className="absolute bottom-4 font-sans text-[10px] uppercase tracking-[0.18em] text-bone/55">{String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        </div>
      )}
    </section>
  )
}

function Archive({ study }) {
  const siblings = otherCaseStudies(study.slug, 4)
  if (!siblings.length) return null
  return (
    <section className="border-t border-bone/10 bg-onyx py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div><p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">More from the archive</p><h2 className="mt-4 font-serif text-4xl font-semibold sm:text-6xl">The next room.</h2></div>
          <a href="/#work" className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass hover:text-bone">View all work →</a>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siblings.map((item) => (
            <a key={item.slug} href={`/case-studies/${item.slug}`} className="group relative min-h-[250px] overflow-hidden border border-bone/15 sm:min-h-[300px]">
              <img src={item.heroImg} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5"><h3 className="font-serif text-2xl font-semibold">{item.name}</h3><p className="mt-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">{item.result.headline}</p></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function CaseStudyMethodology({ study }) {
  return (
    <section className="relative overflow-hidden bg-onyx py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "420px auto" }} />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-8 border-b border-brass/35 pb-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div><p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">How the room was built</p><h2 className="mt-4 font-serif text-4xl font-semibold leading-none sm:text-7xl">Five decisions.<br />One outcome.</h2></div>
          <p className="max-w-xl font-sans text-lg leading-relaxed text-bone/65 md:justify-self-end">{study.methodIntro}</p>
        </div>
        <div className="mobile-card-scroll mt-10 flex snap-x gap-3 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {METHOD.phases.map((phase, index) => (
            <article key={phase.id} className="group w-[76vw] max-w-[310px] shrink-0 snap-start border border-bone/15 bg-onyx/35 lg:w-auto">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={phase.img} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/80 to-transparent" />
                <span className="absolute bottom-3 left-4 font-serif text-4xl font-semibold text-brass">{phase.num}</span>
              </div>
              <div className="p-5"><p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brass">Decision {String(index + 1).padStart(2, "0")}</p><h3 className="mt-3 font-serif text-2xl font-semibold leading-tight">{phase.name.iconic}</h3><p className="mt-4 font-sans text-sm leading-relaxed text-bone/60">{phase.body.iconic}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section className="bg-bone py-16 text-onyx sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Questions, answered</p>
        <div className="mt-6 grid gap-10 md:grid-cols-[0.75fr_1.25fr]">
          <h2 className="font-serif text-5xl font-semibold leading-none sm:text-7xl">Before we build.</h2>
          <div className="border-t border-onyx/20">
            {FAQS.map((item, index) => (
              <details key={item.q} className="group border-b border-onyx/20 py-6" open={index === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-2xl font-semibold marker:hidden">{item.q}<span className="font-sans text-xl font-normal text-brass transition-transform group-open:rotate-45">+</span></summary>
                <p className="mt-4 max-w-2xl font-sans leading-relaxed text-onyx/65">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* Shown when the URL carries a slug that has no case study on file. */
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
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const heroMeta = [study.caseNumber, study.client, study.venue, study.year].filter(Boolean).join(" · ")

  /* Each case study is its own page, so it gets its own title and description
     rather than inheriting the homepage's. */
  useEffect(() => {
    document.title = `${study.name} · Case Study · Iconic Events`
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute("content", study.brief)
  }, [study])

  useEffect(() => {
    if (dismissed) return undefined
    const reveal = () => setShowPrompt(true)
    const onScroll = () => {
      const progress = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      if (progress > 0.35) reveal()
    }
    const timer = window.setTimeout(reveal, 4500)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.clearTimeout(timer); window.removeEventListener("scroll", onScroll) }
  }, [dismissed])

  useEffect(() => {
    if (!formOpen) return undefined
    const close = (event) => { if (event.key === "Escape") setFormOpen(false) }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", close)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", close)
    }
  }, [formOpen])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <header className="border-b border-bone/10 bg-onyx"><nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6"><a href="/" aria-label="Iconic Events home"><img src="/logos/IE_logo_white.png" alt="Iconic Events" className="h-8 w-auto" /></a><a href="/#work" className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-bone/60 hover:text-brass">← All work</a></nav></header>
      <section className="relative min-h-[58svh] overflow-hidden sm:min-h-[64svh]">
        <img src={study.heroImg} alt={`${study.name} event`} className="absolute inset-0 h-full w-full object-cover grayscale" /><div className="absolute inset-0 bg-gradient-to-t from-onyx via-onyx/55 to-onyx/15" />
        <div className="relative mx-auto flex min-h-[58svh] max-w-6xl items-end px-5 pb-10 pt-20 sm:min-h-[64svh] sm:px-6 sm:pb-14 sm:pt-24"><div className="max-w-4xl"><p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brass sm:text-xs sm:tracking-[0.24em]">{heroMeta}</p><h1 className="mt-5 font-serif text-4xl font-semibold leading-[0.95] sm:text-8xl">{study.title}<br />{study.subtitle}</h1></div></div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 border-b border-bone/15 pb-16 md:grid-cols-[0.75fr_1.25fr]"><p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brass">The brief</p><p className="font-serif text-3xl leading-tight text-bone sm:text-5xl">{study.brief}</p></div>
        <div className="grid gap-12 py-16 md:grid-cols-2"><article><p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brass">Challenge</p><p className="mt-5 font-sans text-lg leading-relaxed text-bone/70">{study.challenge}</p></article><article><p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brass">Approach</p><p className="mt-5 font-sans text-lg leading-relaxed text-bone/70">{study.approach}</p></article></div>
        {study.stats.length > 0 && (
          <div className="grid border-y border-brass/30 sm:grid-cols-3">{study.stats.map((stat) => <div key={stat.value} className="border-b border-brass/30 px-4 py-10 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><div className="font-serif text-5xl font-semibold text-brass sm:text-6xl">{stat.value}</div><div className="mt-2 font-sans text-xs uppercase tracking-[0.16em] text-bone/55">{stat.label}</div></div>)}</div>
        )}
      </section>
      <section className="grid min-h-[70svh] md:grid-cols-2"><img src={study.result.img} alt={`${study.name} production detail`} className="h-full min-h-[420px] w-full object-cover grayscale" /><div className="flex items-center bg-tidepool px-6 py-16 sm:px-14"><div><p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brass">The result</p><h2 className="mt-6 font-serif text-5xl font-semibold leading-none sm:text-7xl">{study.result.headline}</h2><p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-bone/70">{study.result.body}</p><div className="mt-10"><CtaBrackets href="#conversation-form" onClick={(event) => { event.preventDefault(); setFormOpen(true) }}>Build the next room</CtaBrackets></div></div></div></section>

      <CaseStudyGallery study={study} />
      <Archive study={study} />
      <CaseStudyMethodology study={study} />
      <FAQ />

      {showPrompt && !dismissed && (
        <aside className="fixed inset-x-2 bottom-2 z-50 mx-auto flex max-w-4xl items-center gap-2 border border-brass/50 bg-tidepool px-2 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.5)] sm:inset-x-3 sm:bottom-5 sm:gap-5 sm:px-5 sm:py-3" aria-label="Start a conversation">
          <img src="/logos/IE_sigil_gold.png" alt="" className="hidden h-11 w-auto shrink-0 sm:block" />
          <p className="min-w-0 flex-1 font-serif text-sm font-semibold leading-tight text-bone sm:text-2xl"><strong>Tell us about the room you want to build.</strong></p>
          <button type="button" onClick={() => setFormOpen(true)} className="shrink-0 bg-brass px-2.5 py-2.5 font-sans text-[8px] font-bold uppercase tracking-[0.1em] text-onyx sm:px-5 sm:py-3 sm:text-[10px] sm:tracking-[0.14em]"><span className="sm:hidden">Start</span><span className="hidden sm:inline">Start a conversation</span></button>
          <button type="button" onClick={() => { setDismissed(true); setShowPrompt(false) }} className="shrink-0 px-1 font-sans text-xl text-bone/50 hover:text-bone" aria-label="Close inquiry prompt">×</button>
        </aside>
      )}
      {formOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-onyx/85 p-1.5 backdrop-blur-sm sm:p-6" onMouseDown={() => setFormOpen(false)} role="dialog" aria-modal="true" aria-label="Start a conversation form">
          <div id="conversation-form" className="relative max-h-[97svh] w-full max-w-5xl overflow-y-auto border border-brass/50 bg-onyx shadow-[0_28px_90px_rgba(0,0,0,0.7)] sm:max-h-[92svh]" onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setFormOpen(false)} className="sticky right-4 top-3 z-20 ml-auto mr-3 mt-3 grid h-10 w-10 place-items-center border border-bone/20 bg-onyx font-sans text-2xl text-bone/60 hover:border-brass hover:text-bone" aria-label="Close form">×</button>
            <Cta modal />
          </div>
        </div>
      )}
    </main>
  )
}
