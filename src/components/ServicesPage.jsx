import { useEffect, useRef, useState } from "react"
import SiteHeader from "./SiteHeader.jsx"
import SiteFooter from "./SiteFooter.jsx"
import CtaBand from "./CtaBand.jsx"
import Icon from "./Icon.jsx"
import { SCOPE } from "../content.js"
import { responsive } from "../lib/img.js"

/* /services: what Iconic does, on a page of its own so the nav never sends
   anyone back to the homepage for it.

   Inspired by Everlast's services page, not a copy of it (Icon's call, 26
   Oct 2026): a title split over two clipped lines, a caption row, a
   full-width photograph, then the disciplines as long rows, each numbered,
   and a numbered grid of the formats we build before the call to action.

   Where Everlast sets a poster sans over a serif, this page flips it: the
   serif italic leads and Helvetica Bold caps answer. The rows are flipped
   too, photograph first, then the title, then the copy and tags. Brand
   fonts only: the section headers are the guideline's Helvetica Bold caps,
   scaled up.

   The intro line is the copy guide's own example of a category term in a
   frame, used as written. The closing line on weddings is the guide's
   approved qualification copy. The format lines are new copy drawn from the
   guide's Formats paragraph. Run any change past Icon first. */

const TITLE = "Event Production Services | Iconic Events"
const DESCRIPTION =
  "Strategy, creative, production, content, operations and revenue for live events, under one team and a single line of authority. Iconic Events, event production since 2017."

/* One photograph per discipline, from the gallery. The first four are the
   methodology stills; the last two are room shots that show the discipline
   at work rather than the people doing it. */
const PHOTOS = {
  g1: "/images/gallery/strategy.webp",
  g2: "/images/gallery/creative.webp",
  g3: "/images/gallery/production.webp",
  g4: "/images/gallery/amplification.webp",
  g5: "/images/gallery/g2.webp",
  g6: "/images/gallery/position-room.webp",
}

const HERO_PHOTO = "/images/gallery/uncontested-room.webp"

/* The formats we build, from the copy guide: multi-day conferences and
   summits, high-ticket brand launches, ascension masterminds, corporate
   retreats, and single-day activations. The sixth is the guide's creator
   case. Duration is not the qualifier. Stake is. */
const FORMATS = [
  {
    name: "Summits & conferences",
    line: "Multi-day rooms built as one arc, from the registration line to the close.",
  },
  {
    name: "Ascension masterminds",
    line: "Smaller rooms, higher stake. The environment is engineered for the next tier to be offered and believed.",
  },
  {
    name: "Brand launches",
    line: "A brand or an offer put in front of its audience in person for the first time, with the moment written into the run of show.",
  },
  {
    name: "Corporate retreats",
    line: "Leadership and sales rooms off site, run to the minute so the agenda is what people remember, not the logistics.",
  },
  {
    name: "Single-day activations",
    line: "One day with a reputation riding on it. Duration is not the qualifier. Stake is.",
  },
  {
    name: "Creator live events",
    line: "A creator meeting the audience that has only ever known them through a screen. Trust is built in a room, not on a social feed.",
  },
]

// Toggle a class once the element scrolls into view (one-shot).
function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen]
}

/* A section heading the way Everlast sets theirs: the title in caps on the
   left, its number in brackets on the right, a rule beneath. */
function SectionTitle({ title, num, id }) {
  const [ref, seen] = useInView(0.5)
  return (
    <div ref={ref} id={id} className={`flex items-end justify-between gap-6 border-b border-bone/15 pb-5 ${seen ? "in" : ""}`}>
      <h2 className="sv-fade font-sans text-4xl font-bold uppercase leading-[0.9] tracking-tight text-bone sm:text-6xl lg:text-7xl">
        {title}
      </h2>
      <span className="sv-fade sv-fade-2 shrink-0 font-serif text-2xl italic leading-none text-brass sm:text-4xl">({num})</span>
    </div>
  )
}

/* The hero photograph, drifting a little slower than the page. The image is
   scaled up so the drift never shows its edges; the scale is in CSS so the
   static render matches. */
function Parallax() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const tick = () => {
      raf = 0
      const r = el.parentElement.getBoundingClientRect()
      const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight))
      el.style.transform = `translateY(${(-p * 7).toFixed(2)}%) scale(1.15)`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    window.addEventListener("scroll", on, { passive: true })
    window.addEventListener("resize", on)
    return () => {
      window.removeEventListener("scroll", on)
      window.removeEventListener("resize", on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="relative mt-10 aspect-[4/3] overflow-hidden border border-brass/25 sm:mt-14 sm:aspect-[21/9]">
      <img
        ref={ref}
        {...responsive(HERO_PHOTO, "100vw")}
        alt="A full room on its feet at a summit produced by Iconic Events, seen from the stage"
        fetchpriority="high"
        decoding="async"
        className="sv-parallax h-full w-full object-cover [filter:saturate(1.08)_contrast(1.06)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/50 via-transparent to-transparent" />
    </div>
  )
}

/* The six discipline names on a slow loop, the way Everlast runs their
   wordmark. Decorative; the names are read in the rows below. */
function Strip() {
  const names = SCOPE.doGroups.map((g) => g.group)
  const half = (k) => (
    <div key={k} className="flex shrink-0 items-center">
      {names.map((n) => (
        <span key={n} className="flex items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
          <span className="font-serif text-4xl italic leading-none text-bone/25 sm:text-6xl">{n}</span>
          <img src="/logos/IE_sigil_gold.png" alt="" className="h-6 w-auto opacity-50 sm:h-8" loading="lazy" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="overflow-hidden border-y border-bone/10 py-5 sm:py-6" aria-hidden="true">
      <div className="motion-row motion-left sv-marquee">{[0, 1].map(half)}</div>
    </div>
  )
}

function Discipline({ g, i, last }) {
  const [ref, seen] = useInView(0.2)
  // The section title already rules above the first row.
  const rules = `${i > 0 ? "border-t" : ""} ${last ? "border-b" : ""}`
  return (
    <li
      ref={ref}
      className={`grid gap-x-8 gap-y-7 border-bone/10 py-10 sm:py-14 lg:grid-cols-12 ${rules} ${seen ? "in" : ""}`}
    >
      <div className="lg:col-span-4">
        <div className="sv-curtain relative aspect-[4/3] overflow-hidden border border-brass/25">
          <img
            {...responsive(PHOTOS[g.id], "(min-width: 1024px) 33vw, 100vw")}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover [filter:saturate(1.08)_contrast(1.06)_brightness(1.05)]"
          />
          <span className="sv-veil" aria-hidden="true" />
        </div>
      </div>

      <div className="sv-fade lg:col-span-4">
        <div className="flex items-center gap-4 font-sans text-[11px] font-bold tracking-[0.2em] text-bone/40">
          <span>{String(i + 1).padStart(2, "0")}</span>
          {g.beyond && <span className="uppercase text-brass">Beyond production</span>}
        </div>
        <h3 className="mt-4 font-sans text-3xl font-bold uppercase leading-[0.9] tracking-tight text-bone sm:text-4xl lg:text-[2.75rem]">
          {g.group}
        </h3>
      </div>

      <div className="sv-fade sv-fade-2 lg:col-span-4">
        <p className="max-w-[34ch] font-serif text-2xl leading-snug text-bone/85 sm:text-[1.7rem]">{g.line}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {g.items.map((item) => (
            <li
              key={item}
              className="border border-bone/15 px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-bone/60"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

function Formats() {
  const [ref, seen] = useInView(0.15)
  return (
    <ol ref={ref} className={`mt-10 grid gap-px border border-bone/10 bg-bone/10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 ${seen ? "in" : ""}`}>
      {FORMATS.map((f, i) => (
        <li key={f.name} className={`sv-fade flex flex-col bg-onyx p-6 sm:p-8 ${i % 3 === 1 ? "sv-fade-2" : i % 3 === 2 ? "sv-fade-3" : ""}`}>
          <span className="font-serif text-2xl italic leading-none text-brass">{String(i + 1).padStart(2, "0")}.</span>
          <h3 className="mt-6 font-sans text-xl font-bold uppercase leading-[1] tracking-tight text-bone sm:text-2xl">{f.name}</h3>
          <p className="mt-4 font-sans text-sm leading-relaxed text-bone/65">{f.line}</p>
        </li>
      ))}
    </ol>
  )
}

export default function ServicesPage() {
  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  const rise = (delay) => ({ animationDelay: `${delay}ms` })

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />

      {/* Hero: the title on two clipped lines, caps then italic, the intro
          line, a caption row, then the photograph. */}
      <section className="pt-12 sm:pt-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="sv-rise font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Services</p>
          <h1 className="mt-5 text-[clamp(3rem,13vw,10rem)] leading-[0.88] tracking-tight text-bone">
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="sv-rise block font-serif font-medium italic" style={rise(80)}>
                Services &amp;
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="sv-rise block font-sans font-bold uppercase" style={rise(200)}>
                capabilities
              </span>
            </span>
          </h1>
          <p className="sv-rise mt-8 max-w-[54ch] font-sans text-lg leading-relaxed text-bone/70 sm:mt-10" style={rise(340)}>
            Most event planners oversee logistics. We engineer the room your audience decides in. Strategy,
            creative, production, content, operations and revenue sit with one team, so nothing falls between
            vendors.
          </p>

          <div
            className="sv-rise mt-10 grid gap-3 border-t border-bone/15 pt-5 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-bone/55 sm:mt-14 sm:grid-cols-3"
            style={rise(460)}
          >
            <span>Event production since 2017</span>
            <span className="sm:text-center">(Miami · Las Vegas)</span>
            <a href="#expertise" className="group inline-flex items-center gap-2 transition-colors hover:text-brass sm:justify-self-end">
              Scroll down
              <Icon name="arrow" className="h-4 w-4 rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </div>

          <Parallax />
        </div>
      </section>

      <div className="mt-16 sm:mt-24">
        <Strip />
      </div>

      {/* Expertise: the six disciplines as rows. */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <SectionTitle title="Expertise" num="01" id="expertise" />
          <ol className="mt-4 sm:mt-6">
            {SCOPE.doGroups.map((g, i) => (
              <Discipline key={g.id} g={g} i={i} last={i === SCOPE.doGroups.length - 1} />
            ))}
          </ol>
        </div>
      </section>

      {/* Formats: what the disciplines are applied to. */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <SectionTitle title="Formats" num="02" id="formats" />
          <Formats />
          <p className="mt-10 max-w-[64ch] font-sans text-sm leading-relaxed text-bone/50">
            We do not produce weddings or personal celebrations. When that work comes to us, we place it with
            people who do it properly.
          </p>
        </div>
      </section>

      <CtaBand
        headline="Tell us about the room you want to build."
        href="/contact"
        secondary={{ href: "/case-studies", label: "See the case studies →" }}
      />
      <SiteFooter />
    </main>
  )
}
