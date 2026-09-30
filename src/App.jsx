import { useEffect, useRef } from "react"
import {
  HERO,
  PRESS,
  ROOM,
  POSITION,
  WORK,
  SERVICES,
  SCOPE,
  METHOD,
  RECEIPTS,
  TESTIMONIALS,
  NICHE,
  CTA,
  FOOTER,
  GALLERY,
  MONTAGE,
  HERO_WALL,
} from "./content.js"
import { useVoice } from "./voice.jsx"
import Icon from "./components/Icon.jsx"
import Photo from "./components/Photo.jsx"
import { CtaBrackets } from "./components/CtaButtons.jsx"
import InTheRoom from "./components/InTheRoom.jsx"
import Brackets from "./components/Brackets.jsx"
import Position from "./components/Position.jsx"
import Motion from "./components/Motion.jsx"
import Work from "./components/Work.jsx"
import Gallery from "./components/Gallery.jsx"
import Scope from "./components/Scope.jsx"
import Method from "./components/Method.jsx"
import Receipts from "./components/Receipts.jsx"
import Testimonials from "./components/Testimonials.jsx"
import Niche from "./components/Niche.jsx"
import Cta from "./components/Cta.jsx"
import SiteHeader from "./components/SiteHeader.jsx"
import CtaBand from "./components/CtaBand.jsx"

/* ── Identity ───────────────────────────────────────────────────────── */
function Logo({ tone = "black", className = "" }) {
  const src = tone === "white" ? "/logos/IE_logo_white.png" : "/logos/IE_logo_black.png"
  return <img src={src} alt="Iconic Events — Est. 2017" className={className} />
}

// One vertical marquee column for the hero walls. Content is duplicated so the
// translate loops seamlessly; grayscale keeps the mixed sources cohesive.
// (Column visibility/width is controlled by the wrapper in the hero, so the
// `.marquee-track` display rule doesn't fight Tailwind's `hidden`.)
function MarqueeTrack({ images, dir, duration }) {
  const doubled = [...images, ...images]
  return (
    <div
      className={`marquee-track ${dir === "up" ? "anim-up" : "anim-down"}`}
      style={{ animationDuration: `${duration}s` }}
    >
      {doubled.map((src, i) => (
        <div key={i} className="relative overflow-hidden border border-brass/15">
          <img
            src={src}
            alt=""
            className="aspect-[3/4] w-full object-cover [filter:grayscale(1)_contrast(1.05)_brightness(0.85)]"
          />
          <div className="pointer-events-none absolute inset-0 bg-onyx/25" />
        </div>
      ))}
    </div>
  )
}

// Hero light particles — static config (left % is relative to the container),
// so positions stay put across re-renders.
const HERO_PARTICLES = [
  { left: "50%", size: "2px", fall: "210px", dur: 7.5, delay: 0 },
  { left: "43%", size: "1px", fall: "230px", dur: 9, delay: 1.2 },
  { left: "57%", size: "1px", fall: "200px", dur: 8, delay: 2.1 },
  { left: "48%", size: "2px", fall: "220px", dur: 10, delay: 0.6 },
  { left: "62%", size: "1px", fall: "190px", dur: 8.5, delay: 3 },
  { left: "37%", size: "1px", fall: "205px", dur: 9.5, delay: 1.8 },
  { left: "53%", size: "1px", fall: "235px", dur: 11, delay: 2.6 },
  { left: "46%", size: "1px", fall: "195px", dur: 7, delay: 4 },
  { left: "60%", size: "2px", fall: "215px", dur: 10.5, delay: 3.6 },
  { left: "40%", size: "2px", fall: "225px", dur: 9.2, delay: 5 },
  { left: "55%", size: "1px", fall: "200px", dur: 8.2, delay: 4.6 },
  { left: "50%", size: "1px", fall: "240px", dur: 12, delay: 5.8 },
]

// Wrap the first occurrence of `phrase` in an accent span (leaves the rest).
function highlight(text, phrase, cls = "text-brass") {
  const i = text.indexOf(phrase)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className={cls}>{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  )
}
// Keep desktop copy inline while allowing an intentional mobile-only break.
function mobileBreakAfter(text, phrase) {
  const i = text.indexOf(phrase)
  if (i === -1) return text
  const end = i + phrase.length
  return (
    <>
      {text.slice(0, end)}
      <br className="md:hidden" />
      <span className="hidden md:inline"> </span>
      {text.slice(end).trimStart()}
    </>
  )
}

function heroHeadline(text) {
  const phrase = " through"
  const i = text.indexOf(phrase)
  if (i === -1) return text
  const end = i + phrase.length
  return (
    <>
      <span className="md:whitespace-nowrap">{text.slice(0, end)}</span>
      <br className="hidden md:block" />
      <span className="md:hidden"> </span>
      <span className="md:whitespace-nowrap">{text.slice(end).trimStart()}</span>
    </>
  )
}

// Easter egg: a big wordmark hidden in the dark; a circular spotlight follows
// the cursor and reveals it as you sweep left/right (CSS radial-gradient mask).
function EasterEggReveal() {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  const hide = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--mx", "-999px")
    el.style.setProperty("--my", "-999px")
  }
  return (
    <img
      ref={ref}
      onMouseMove={move}
      onMouseLeave={hide}
      src="/logos/IE_logo_white.png"
      alt=""
      className="spotlight-img absolute left-1/2 hidden md:block top-[54px] z-30 h-[168px] w-[85vw] max-w-3xl -translate-x-1/2 object-contain"
    />
  )
}

/* ── Section switches ───────────────────────────────────────────────────
   Hidden sections stay in the tree, copy and component intact, so bringing
   one back is a one-word change. Nothing is deleted. */

// The Uncontested Room. Hidden at Iconic's call: it read as a secondary
// ribbon repeating the call to action that already sits below it.
const SHOW_NICHE = false

/* ── Layout primitives ──────────────────────────────────────────────── */
function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-5 sm:px-6 ${className}`}>
      {children}
    </section>
  )
}

// Gold eyebrow ordinal + Tide Pool 4pt rule. `dark` for use on onyx.
function Eyebrow({ children, dark = false }) {
  return (
    <div className={`mb-8 border-b pb-3 ${dark ? "border-brass/40" : "rule-tidepool"}`}>
      <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
        {children}
      </span>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────── */
/* A deep link like /#contact arrives before React has rendered, so the browser
   finds no #contact to jump to and leaves the visitor at the top of a very long
   page. Anything landing cold on an anchor (a Google Business Profile booking
   link, an email, a QR code) depends on this running after mount. Re-tries
   briefly because images above the target still change its offset. */
function useHashLanding() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return undefined
    let frame = 0
    const settle = () => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ block: "start" })
      frame += 1
      if (frame < 4) timer = window.setTimeout(settle, 220)
    }
    let timer = window.setTimeout(settle, 0)
    return () => window.clearTimeout(timer)
  }, [])
}

export default function App() {
  const { t } = useVoice()
  useHashLanding()
  return (
    <div className="min-h-screen bg-onyx text-bone">

      <SiteHeader home />
      {/* ── 01 · HERO ─────────────────────────────────────────────────── */}
      <div id="top" />
      <div className="relative grid min-h-screen grid-cols-1 overflow-hidden bg-onyx md:grid-cols-[22vw_1fr_22vw] xl:grid-cols-[28vw_1fr_28vw]">
        {/* Centred dark scrim — transparent at the edges, 80% black at centre —
            to tame the inner columns and lift text contrast. */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.8) 50%, transparent 100%)",
          }}
        />

        {/* Foggy brass light ray — a glowing source point + soft-edged volumetric
            beam + outer fog. All edges feathered by radial masks (no straight
            lines); layered blur reads as haze. */}
        {/* source hotspot */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-[6] -translate-x-1/2"
          style={{
            width: "34vw",
            height: "30vh",
            background:
              "radial-gradient(ellipse 55% 60% at 50% 0%, rgba(184,153,104,0.32), rgba(184,153,104,0.08) 45%, transparent 70%)",
            filter: "blur(26px)",
          }}
        />
        {/* core beam */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-[6] -translate-x-1/2"
          style={{
            width: "42vw",
            height: "64vh",
            background:
              "linear-gradient(to bottom, rgba(184,153,104,0.20) 0%, rgba(184,153,104,0.07) 45%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(52% 96% at 50% -6%, #000 44%, transparent 82%)",
            maskImage: "radial-gradient(52% 96% at 50% -6%, #000 44%, transparent 82%)",
            filter: "blur(18px)",
          }}
        />
        {/* outer fog */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-[6] -translate-x-1/2"
          style={{
            width: "54vw",
            height: "62vh",
            background: "linear-gradient(to bottom, rgba(184,153,104,0.08), transparent 78%)",
            WebkitMaskImage: "radial-gradient(58% 92% at 50% -8%, #000 30%, transparent 84%)",
            maskImage: "radial-gradient(58% 92% at 50% -8%, #000 30%, transparent 84%)",
            filter: "blur(55px)",
          }}
        />

        {/* Descending light particles — fade out before the headline. */}
        <div className="pointer-events-none absolute left-1/2 top-14 z-[7] h-[240px] w-[380px] -translate-x-1/2">
          {HERO_PARTICLES.map((p, i) => (
            <span
              key={i}
              className="hero-particle"
              style={{
                left: p.left,
                top: 0,
                width: p.size,
                height: p.size,
                "--fall": p.fall,
                animation: `particle-fall ${p.dur}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Easter egg — cursor spotlight reveals the wordmark. */}
        <EasterEggReveal />

        {/* Left wall — drifts up. */}
        <div className="hero-fade relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 flex items-start gap-3 px-3">
            <div className="flex-1">
              <MarqueeTrack images={HERO_WALL.leftA} dir="up" duration={42} />
            </div>
            <div className="hidden flex-1 xl:block">
              <MarqueeTrack images={HERO_WALL.leftB} dir="up" duration={58} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-onyx to-transparent" />
        </div>

        {/* Centre content. */}
        <div
          key={t({ iconic: "i", genflow: "g" })}
          className="fade-rise relative z-10 flex min-h-screen flex-col items-center justify-center px-5 sm:px-6 py-28 text-center"
        >
          <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-[0.96] tracking-tight text-bone sm:text-[3.5rem]">
            {heroHeadline(t(HERO.headline))}
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-sans text-lg leading-relaxed text-bone/70">
            {t(HERO.subhead)}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <CtaBrackets href="#contact">{t(HERO.ctaPrimary)}</CtaBrackets>
            <a
              href="#work"
              className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-bone/60 transition hover:text-bone"
            >
              {t(HERO.ctaSecondary)}
              <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>
          <p className="mx-auto mt-8 max-w-md font-serif text-xl italic text-brass">
            {mobileBreakAfter(t(HERO.outcome), "room of 150.")}
          </p>
        </div>

        {/* Right wall — drifts down. */}
        <div className="hero-fade relative hidden overflow-hidden md:block">
          <div className="absolute inset-0 flex items-start gap-3 px-3">
            <div className="flex-1">
              <MarqueeTrack images={HERO_WALL.rightA} dir="down" duration={50} />
            </div>
            <div className="hidden flex-1 xl:block">
              <MarqueeTrack images={HERO_WALL.rightB} dir="down" duration={64} />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-onyx to-transparent" />
        </div>

        <span className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.3em] text-bone/40">
          {HERO.scroll} ↓
        </span>
      </div>

      {/* ── 02 · PRESS ────────────────────────────────────────────────── */}
      <Section className="border-t border-bone/10 py-12">
        <p className="text-center font-sans text-xs uppercase tracking-[0.25em] text-bone/40">
          {t(PRESS.label)}
        </p>
        {/* TODO: swap these text placeholders for the official mono/white logo
            files once provided (drop them in /public/images/press). */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PRESS.logos.map((l) => (
            <span
              key={l}
              className="font-serif text-lg text-bone/25 transition-colors duration-300 hover:text-bone/50"
            >
              {l}
            </span>
          ))}
        </div>
      </Section>

      {/* ── The Room, In Motion ──────────────────────────────────────────── */}
      <Motion />

      {/* Order below answers a prospect's questions in the order they ask
          them: who you are, whether you are for them, what is and is not in
          scope, how you do it, whether it works, and what it looked like.
          Every component is unchanged; only the sequence and the calls to
          action are new. */}

      {/* ── WHO WE ARE ──────────────────────────────────────────────────── */}
      <Position />

      {/* ── WHO IT IS FOR — moved ahead of the offer: naming who we are not
             for qualifies the reader before we explain anything. Currently
             hidden; see SHOW_NICHE above. ──────────────────────────────── */}
      {SHOW_NICHE && <Niche />}

      {/* ── WHAT IS AND IS NOT INCLUDED ─────────────────────────────────── */}
      <Scope />

      <CtaBand
        headline="Tell us about the room you want to build."
        secondary={{ href: "/case-studies", label: "See all 37 case studies →" }}
      />

      {/* ── HOW WE DO IT ────────────────────────────────────────────────── */}
      <Method />

      {/* ── PROOF — the numbers, and only the numbers. The founder portraits
             and the testimonial cards came out: with Selected Work and the
             gallery below, the page was carrying five proof sections. The
             client's own words now live on the case study pages, one per
             event, where they belong to something ─────────────────────── */}
      <Receipts />

      <CtaBand headline="Six figures of production, one accountable team." />

      {/* ── SELECTED WORK — a teaser now that /case-studies carries the
             full index ────────────────────────────────────────────────── */}
      <Work />

      <Gallery />

      {/* ── START A CONVERSATION — The Brief (locked in) ────────────────── */}
      <Cta />

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="rule-tidepool relative border-t border-bone/10 bg-onyx">
        <Section className="py-14">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-bone/10 pb-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
            <div className="col-span-2 text-center md:col-span-1 md:text-left">
              <Logo tone="white" className="mx-auto h-14 w-auto md:mx-0 md:h-9" />
              <p className="mx-auto mt-4 max-w-xs font-sans text-sm text-bone/55 md:mx-0">{t(FOOTER.line)}</p>
            </div>
            {FOOTER.columns.map((c) => (
              <div key={c.id} className="min-w-0">
                <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">
                  {c.head}
                </div>
                <ul className="mt-4 space-y-2 break-words font-sans text-sm leading-relaxed text-bone/60">
                  {c.items.map((it) => {
                    const label = typeof it === "string" ? it : it.label
                    return (
                      <li key={label}>
                        {typeof it === "string" ? (
                          label
                        ) : (
                          <a href={it.href} className="transition hover:text-brass">
                            {label}
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 items-start gap-4 md:flex md:items-center md:justify-between">
            <p className="font-sans text-[10px] uppercase leading-relaxed tracking-[0.14em] text-bone/50 md:text-xs md:tracking-[0.2em]">
              {FOOTER.legal} · {FOOTER.tagStrip}
            </p>
            <p className="text-right font-sans text-[10px] uppercase leading-relaxed tracking-[0.12em] text-footer-grey md:text-left md:text-[11px] md:tracking-[0.15em]">
              Privacy · Terms
            </p>
          </div>
          <p className="mt-6 max-w-3xl font-sans text-[11px] leading-relaxed text-footer-grey">
            {FOOTER.ip}
          </p>
        </Section>
      </footer>
    </div>
  )
}
