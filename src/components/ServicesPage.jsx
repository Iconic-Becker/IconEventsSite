import { useEffect, useRef, useState } from "react"
import SiteHeader from "./SiteHeader.jsx"
import SiteFooter from "./SiteFooter.jsx"
import CtaBand from "./CtaBand.jsx"
import Icon from "./Icon.jsx"
import { SCOPE } from "../content.js"
import { FORMATS, SERVICE_PAGE_BY_ZONE } from "../services.js"
import { responsive } from "../lib/img.js"

/* /services: what Iconic does, on a page of its own so the nav never sends
   anyone back to the homepage for it.

   Designed from the copy (Icon's call, 26 Oct 2026). "Six zones of service
   and support. One line of authority" is a scope document, so the page is
   laid out as one: a centred hero, a contents column that stays put while
   you read, the six zones as numbered entries with their deliverables set
   out as a schedule (1.1, 1.2 and so on), and the formats as a ledger. The
   one line of authority is drawn, literally: a brass rule beside the
   entries that fills as you read down, with a mark at each zone that
   lights when you reach it. The contents column carries a plate for
   whichever zone you are on. "Zones of service and support" is Icon's
   term for the six groups; the content file still calls them doGroups.

   The intro line is the copy guide's own example of a category term in a
   frame, used as written. The closing line on weddings is the guide's
   approved qualification copy. The format lines and the "beyond production"
   note are new copy drawn from the guide. Run any change past Icon first. */

const TITLE = "Event Production Services | Iconic Events"
const DESCRIPTION =
  "Strategy, creative, production, content, operations and revenue for live events, under one team and a single line of authority. Iconic Events, event production since 2017."

/* One plate per zone, from the gallery. The first four are the
   methodology stills; the last two are room shots. */
const PLATES = {
  g1: "/images/gallery/strategy.webp",
  g2: "/images/gallery/creative.webp",
  g3: "/images/gallery/production.webp",
  g4: "/images/gallery/amplification.webp",
  g5: "/images/gallery/g2.webp",
  g6: "/images/gallery/position-room.webp",
}

const num = (i) => String(i + 1).padStart(2, "0")
const groups = SCOPE.doGroups

/* Which entry the reader is on, and how far down the schedule they are.
   Both are read off the scroll position: the entry whose top has passed
   the middle of the viewport is the active one, and the brass rule fills
   to the same point. */
function useReadingPosition(listRef, count) {
  const [active, setActive] = useState(0)
  const fillRef = useRef(null)
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    let raf = 0
    const tick = () => {
      raf = 0
      const mid = window.innerHeight * 0.45
      const r = list.getBoundingClientRect()
      const p = Math.max(0, Math.min(1, (mid - r.top) / r.height))
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p.toFixed(4)})`
      const entries = list.querySelectorAll("[data-entry]")
      let a = 0
      entries.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= mid) a = i
      })
      setActive((v) => (v === a ? v : a))
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
  }, [listRef, count])
  return { active, fillRef }
}

/* The hero's brand pattern, shown through a soft circle under the cursor. */
function useCursorReveal() {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--mx", "-9999px")
    el.style.setProperty("--my", "-9999px")
  }
  return { ref, move, leave }
}

function Hero() {
  const { ref, move, leave } = useCursorReveal()
  const pattern = {
    backgroundImage: "url(/images/patterns/pattern-gold.webp)",
    backgroundSize: "520px auto",
    backgroundRepeat: "repeat",
  }
  return (
    <section ref={ref} onMouseMove={move} onMouseLeave={leave} className="relative overflow-hidden border-b border-bone/10">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={pattern} aria-hidden="true" />
      <div className="pattern-reveal pointer-events-none absolute inset-0 opacity-[0.14]" style={pattern} aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-14 text-center sm:px-6 sm:pb-14 sm:pt-20">
        <p className="fade-rise font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Services</p>
        <h1
          className="fade-rise mx-auto mt-5 max-w-[26ch] font-serif text-5xl font-semibold leading-[0.96] [text-wrap:balance] sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "80ms" }}
        >
          Six zones of service and support. One line of authority.
        </h1>
        <p className="fade-rise mx-auto mt-6 max-w-[68ch] font-sans text-lg leading-relaxed text-bone/70" style={{ animationDelay: "180ms" }}>
          Most event planners oversee logistics. We engineer the room your audience decides in. Strategy,
          creative, production, content, operations and revenue sit with one team, so nothing falls between
          vendors.
        </p>

      </div>
    </section>
  )
}

/* The contents column. Stays put beside the entries from lg up; on a phone
   it is a row of anchors above them. */
function Contents({ active }) {
  return (
    <aside className="min-w-0 lg:col-span-4">
      <div className="lg:sticky lg:top-28">
        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40">Scope of service</p>
        <ol className="mobile-nav mt-4 flex gap-x-6 gap-y-2 overflow-x-auto pb-2 font-sans text-xs font-bold uppercase tracking-[0.16em] lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
          {groups.map((g, i) => (
            <li key={g.id} className="shrink-0">
              <a
                href={`#${g.id}`}
                aria-current={active === i ? "true" : undefined}
                className={`group relative inline-flex items-center gap-3 py-1.5 transition-colors duration-300 lg:pl-6 ${
                  active === i ? "text-bone" : "text-bone/40 hover:text-bone/80"
                }`}
              >
                <span
                  className={`absolute left-0 top-1/2 hidden h-px w-3 -translate-y-1/2 bg-brass transition-transform duration-500 lg:block ${
                    active === i ? "scale-x-100" : "scale-x-0"
                  }`}
                  style={{ transformOrigin: "left" }}
                  aria-hidden="true"
                />
                <span className={`tracking-[0.2em] ${active === i ? "text-brass" : "text-bone/30"}`}>{num(i)}</span>
                {g.group}
                {g.beyond && <span className="h-1 w-1 bg-brass" aria-hidden="true" />}
              </a>
            </li>
          ))}
        </ol>

        {/* The plate for the active zone. From lg up it runs off the left
            edge of the page and dissolves at its edges, so it reads as a
            scene behind the schedule rather than a thumbnail beside it. */}
        <figure className="svc-plate relative mt-10 hidden h-[min(54vh,560px)] lg:ml-[calc(-1*(max(0px,(100vw-72rem)/2)+1.5rem))] lg:block lg:w-[calc(100%+max(0px,(100vw-72rem)/2)+1.5rem)]">
          {groups.map((g, i) => (
            <img
              key={g.id}
              {...responsive(PLATES[g.id], "40vw")}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 [filter:saturate(1.08)_contrast(1.06)_brightness(1.05)] ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </figure>
        <p className="mt-3 hidden font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-bone/50 lg:block" aria-live="polite">
          Plate {num(active)} <span className="mx-2 text-bone/25">·</span> {groups[active].group}
        </p>

        <p className="mt-6 hidden max-w-[30ch] font-sans text-[11px] leading-relaxed text-bone/40 lg:block">
          <span className="mr-2 inline-block h-1 w-1 translate-y-[-2px] bg-brass" aria-hidden="true" />
          Beyond production: a production company's scope ends before these. Ours does not.
        </p>
      </div>
    </aside>
  )
}

function Entry({ g, i, active }) {
  const reached = active >= i
  return (
    <article
      id={g.id}
      data-entry
      className="relative scroll-mt-24 border-t border-bone/10 py-10 pl-8 sm:py-14 sm:pl-10"
    >
      {/* The mark on the line of authority. */}
      <span
        className={`absolute left-0 top-10 h-2 w-2 -translate-x-1/2 border border-brass transition-colors duration-500 sm:top-14 ${
          reached ? "bg-brass" : "bg-onyx"
        }`}
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-brass">{num(i)}</span>
        <h2 className="font-serif text-4xl font-semibold leading-none text-bone sm:text-6xl">{g.group}</h2>
        {g.beyond && (
          <span className="border border-brass/40 px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-brass">
            Beyond production
          </span>
        )}
      </div>
      <p className="mt-5 max-w-[38ch] font-serif text-2xl italic leading-snug text-bone/85 sm:text-3xl">{g.line}</p>

      {/* The deliverables, as a schedule. */}
      <ol className="mt-8 grid gap-x-10 sm:grid-cols-2">
        {g.items.map((item, j) => (
          <li key={item} className="flex items-baseline gap-4 border-b border-bone/10 py-3 font-sans text-sm text-bone/70">
            <span className="w-7 shrink-0 font-sans text-[10px] font-bold tracking-[0.18em] text-bone/35">
              {i + 1}.{j + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>

      {SERVICE_PAGE_BY_ZONE[g.id] && (
        <a
          href={`/services/${SERVICE_PAGE_BY_ZONE[g.id].slug}`}
          className="group mt-6 inline-flex items-center gap-2 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brass transition-colors hover:text-bone"
        >
          About {g.group.toLowerCase()}
          <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      )}

      {/* On smaller screens the plate sits with its entry. */}
      <div className="relative mt-8 aspect-[21/9] overflow-hidden border border-brass/25 lg:hidden">
        <img
          {...responsive(PLATES[g.id], "100vw")}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover [filter:saturate(1.08)_contrast(1.06)_brightness(1.05)]"
        />
      </div>
    </article>
  )
}

function Formats() {
  return (
    <section className="border-t border-bone/10 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-bone/15 pb-5">
          <h2 className="font-serif text-4xl font-semibold leading-none text-bone sm:text-6xl">Formats</h2>
          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40">What the six are applied to</p>
        </div>
        <ol>
          {FORMATS.map((f, i) => (
            <li
              key={f.name}
              className="group grid gap-x-8 gap-y-2 border-b border-bone/10 py-6 transition-colors duration-300 hover:border-brass/40 sm:grid-cols-12 sm:items-baseline sm:py-7"
            >
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-brass sm:col-span-1">{num(i)}</span>
              <h3 className="font-serif text-2xl font-semibold leading-tight text-bone sm:col-span-4 sm:text-3xl">{f.name}</h3>
              <p className="max-w-[52ch] font-sans text-sm leading-relaxed text-bone/65 sm:col-span-7">{f.line}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 max-w-[64ch] font-sans text-sm leading-relaxed text-bone/50">
          We do not produce weddings or personal celebrations. When that work comes to us, we place it with
          people who do it properly.
        </p>
      </div>
    </section>
  )
}

export default function ServicesPage() {
  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  const listRef = useRef(null)
  const { active, fillRef } = useReadingPosition(listRef, groups.length)

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <Hero />

      <section className="py-12 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <Contents active={active} />
          <div className="lg:col-span-8">
            <div ref={listRef} className="relative border-b border-bone/10">
              {/* The line of authority: a track, and a brass fill that
                  follows the reader down the schedule. */}
              <span className="absolute bottom-0 left-0 top-0 w-px bg-bone/10" aria-hidden="true" />
              <span ref={fillRef} className="svc-fill absolute bottom-0 left-0 top-0 w-px bg-brass" aria-hidden="true" />
              {groups.map((g, i) => (
                <Entry key={g.id} g={g} i={i} active={active} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <Formats />

      <CtaBand
        headline="Tell us about the room you want to build."
        href="/contact"
        secondary={{ href: "/case-studies", label: "See the case studies →" }}
      />
      <SiteFooter />
    </main>
  )
}
