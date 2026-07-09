import { useRef } from "react"
import {
  NAV,
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
  PLACEHOLDER,
  GALLERY,
  MONTAGE,
  HERO_WALL,
} from "./content.js"
import { useVoice } from "./voice.jsx"
import Icon from "./components/Icon.jsx"
import Photo from "./components/Photo.jsx"
import QualifierForm from "./components/QualifierForm.jsx"
import VoiceToggle from "./components/VoiceToggle.jsx"
import { CtaBrackets } from "./components/CtaButtons.jsx"

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
// so positions stay put across re-renders (e.g. voice toggle).
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
      className="spotlight-img absolute left-1/2 top-[54px] z-30 h-[168px] w-[85vw] max-w-3xl -translate-x-1/2 object-contain"
    />
  )
}

// Nav menu link — echoes the primary button: brass corner ticks snap in on hover.
function NavLink({ href, children }) {
  const tick =
    "pointer-events-none absolute h-1.5 w-1.5 border-brass opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"
  return (
    <a href={href} className="group relative px-2 py-1.5 transition-colors duration-300 hover:text-brass">
      {children}
      <span className={`${tick} left-1 top-0 border-l border-t group-hover:left-0`} />
      <span className={`${tick} right-1 top-0 border-r border-t group-hover:right-0`} />
      <span className={`${tick} bottom-0 left-1 border-b border-l group-hover:left-0`} />
      <span className={`${tick} bottom-0 right-1 border-b border-r group-hover:right-0`} />
    </a>
  )
}

/* ── Layout primitives ──────────────────────────────────────────────── */
function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-6 ${className}`}>
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
export default function App() {
  const { t } = useVoice()

  return (
    <div className="min-h-screen bg-onyx text-bone">
      <VoiceToggle />

      {/* NAV — its own solid-black section. Centered logo, menus split L/R,
          no CTA. Sticky so it persists on scroll. */}
      <header className="sticky top-0 z-40 border-b border-bone/10 bg-onyx relative">
        <div className="nav-beam" aria-hidden="true" />
        <nav className="mx-auto grid max-w-6xl grid-cols-3 items-center px-6 py-4">
          <div className="hidden items-center gap-6 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:flex">
            {NAV.left.map((n) => (
              <NavLink key={n.href} href={n.href}>
                {n.label}
              </NavLink>
            ))}
          </div>
          <a href="#top" aria-label="Iconic Events — home" className="flex justify-center">
            <Logo tone="white" className="h-8 w-auto" />
          </a>
          <div className="hidden items-center justify-end gap-6 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:flex">
            {NAV.right.map((n) => (
              <NavLink key={n.href} href={n.href}>
                {n.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

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
          className="fade-rise relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-28 text-center"
        >
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-brass">
            {t(HERO.audience)} <span className="text-bone/45">· {HERO.est}</span>
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-bone sm:text-7xl">
            {highlight(t(HERO.headline), "live events")}
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
            {t(HERO.outcome)}
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

      {/* ── 03 · PORTRAIT CAROUSEL — In the Room ──────────────────────── */}
      <Section className="py-20">
        <div className="mb-10">
          <h2 className="font-serif text-4xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
          <p className="mt-3 max-w-xl font-sans text-bone/60">{t(ROOM.sub)}</p>
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-brass">{ROOM.meta}</p>
        </div>
        <div className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-4">
          {ROOM.people.map((p) => (
            <div key={p.id} className="group w-56 shrink-0 snap-start">
              <div className="relative aspect-[4/5] overflow-hidden border border-brass/20">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale contrast-[1.05] transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />
              </div>
              <div className="mt-3 font-serif text-lg text-bone">{p.name}</div>
              <div className="font-sans text-xs uppercase tracking-[0.12em] text-brass">{t(p.result)}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 04 · POSITIONING ──────────────────────────────────────────── */}
      <Section id="work" className="py-20">
        <Eyebrow dark>{POSITION.eyebrow}</Eyebrow>
        <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-bone sm:text-5xl">
          {t(POSITION.title)}
        </h2>
        <p className="mt-5 max-w-2xl font-sans text-bone/65">{t(POSITION.body)}</p>
        <div className="mt-12 grid border border-bone/15 md:grid-cols-2">
          <div className="border-b border-bone/15 p-5 md:border-b-0 md:border-r">
            <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-bone/45">
              {t(POSITION.colPlanner)}
            </div>
          </div>
          <div className="bg-tidepool p-5">
            <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">
              {t(POSITION.colEngineer)}
            </div>
          </div>
          {POSITION.rows.map((r, i) => (
            <div key={i} className="contents">
              <div className="border-t border-bone/15 p-5 font-sans text-sm text-bone/55 md:border-r">
                {r.planner}
              </div>
              <div className="border-t border-bone/15 bg-tidepool/40 p-5 font-sans text-sm text-bone">
                {t(r.engineer)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Montage band — full-bleed atmosphere filmstrip ────────────── */}
      <div className="overflow-hidden border-y border-brass/20 bg-onyx py-16">
        <Section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
                {t(MONTAGE.kicker)}
              </div>
              <p className="mt-3 max-w-xl font-serif text-2xl italic text-bone/80">
                {t(MONTAGE.line)}
              </p>
            </div>
          </div>
        </Section>
        {/* Filmstrip bleeds past the container edges for energy. */}
        <div className="mt-10 flex gap-3 px-6 [--h:15rem] sm:[--h:19rem]">
          {GALLERY.band.map((src, i) => (
            <Photo
              key={src}
              src={src}
              overlay="from-onyx/30 via-transparent to-transparent"
              className={`h-[var(--h)] shrink-0 ${
                i % 3 === 0 ? "w-[36vw] sm:w-[26vw]" : "w-[30vw] sm:w-[20vw]"
              } ${i % 2 ? "translate-y-4" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* ── 05 · SELECTED WORK ────────────────────────────────────────── */}
      <Section className="py-20">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <Eyebrow dark>{WORK.eyebrow}</Eyebrow>
          </div>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-serif text-4xl font-semibold text-bone sm:text-5xl">{t(WORK.title)}</h2>
          <a href="#contact" className="font-sans text-xs uppercase tracking-[0.15em] text-brass hover:text-bone">
            {t(WORK.index)}
          </a>
        </div>

        {/* Featured case */}
        <div className="mt-10 grid border border-bone/15 lg:grid-cols-[1.2fr_1fr]">
          <div className="border-b border-bone/15 lg:border-b-0 lg:border-r">
            <img src={PLACEHOLDER} alt="" className="aspect-[16/10] w-full object-cover grayscale" />
          </div>
          <div className="p-8">
            <div className="font-sans text-xs uppercase tracking-[0.18em] text-brass">
              {WORK.featured.label}
            </div>
            <div className="mt-2 font-sans text-xs uppercase tracking-[0.12em] text-bone/45">
              {WORK.featured.meta}
            </div>
            <h3 className="mt-4 font-serif text-3xl font-semibold text-bone">
              {t(WORK.featured.headline)}
            </h3>
            <dl className="mt-5 space-y-3 font-sans text-sm">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-brass">
                  {t(WORK.featured.challengeLabel)}
                </dt>
                <dd className="mt-1 text-bone/65">{t(WORK.featured.challenge)}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.14em] text-brass">
                  {t(WORK.featured.approachLabel)}
                </dt>
                <dd className="mt-1 text-bone/65">{t(WORK.featured.approach)}</dd>
              </div>
            </dl>
            <div className="mt-6 grid grid-cols-3 border-t border-bone/15 pt-5">
              {WORK.featured.stats.map((s, i) => (
                <div key={i}>
                  <div className="font-serif text-2xl font-semibold text-brass">{s.value}</div>
                  <div className="mt-1 font-sans text-[11px] uppercase tracking-[0.1em] text-bone/50">
                    {t(s.label)}
                  </div>
                </div>
              ))}
            </div>
            <a href="#contact" className="mt-6 inline-block font-sans text-xs uppercase tracking-[0.15em] text-brass hover:text-bone">
              {t(WORK.featured.cta)}
            </a>
          </div>
        </div>

        {/* Archive strip */}
        <div className="mt-8 font-sans text-xs uppercase tracking-[0.18em] text-bone/45">
          {t(WORK.archiveLabel)}
        </div>
        <div className="mt-3 border-t border-bone/15">
          {WORK.archive.map((a) => (
            <a
              key={a.id}
              href="#contact"
              className="group flex items-center justify-between gap-4 border-b border-bone/15 py-4 transition hover:bg-tidepool/20"
            >
              <span className="font-serif text-xl text-bone">{a.name}</span>
              <span className="flex items-center gap-4">
                <span className="font-sans text-xs uppercase tracking-[0.12em] text-brass">{t(a.result)}</span>
                <Icon name="arrow" className="h-4 w-4 text-bone/40 transition group-hover:translate-x-1 group-hover:text-brass" />
              </span>
            </a>
          ))}
        </div>
      </Section>

      {/* ── 06 · SERVICES (full-bleed Tide Pool) ──────────────────────── */}
      <div id="services" className="bg-tidepool py-24">
        <Section>
          <Eyebrow dark>{SERVICES.eyebrow}</Eyebrow>
          <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-bone sm:text-5xl">
            {t(SERVICES.title)}
          </h2>
          <p className="mt-5 max-w-2xl font-sans text-bone/70">{t(SERVICES.intro)}</p>
          {/* Craft detail strip. */}
          <div className="mt-10 grid grid-cols-3 gap-3">
            {GALLERY.detail.map((src) => (
              <Photo
                key={src}
                src={src}
                overlay="from-tidepool/40 via-transparent to-transparent"
                className="aspect-[5/3]"
              />
            ))}
          </div>
          <div className="mt-12 border-t border-brass/25">
            {SERVICES.items.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[auto_1fr] gap-x-6 border-b border-brass/25 py-6 sm:grid-cols-[4rem_1fr_1.2fr] sm:items-baseline"
              >
                <span className="font-serif text-2xl text-brass">{s.num}</span>
                <h3 className="font-serif text-2xl font-semibold text-bone">{t(s.title)}</h3>
                <div className="col-span-2 mt-2 sm:col-span-1 sm:mt-0">
                  <p className="font-sans text-sm text-bone/70">{t(s.body)}</p>
                  <p className="mt-1 font-sans text-xs uppercase tracking-[0.12em] text-brass">
                    {t(s.replaces)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* ── 07 · SCOPE OF SERVICE ─────────────────────────────────────── */}
      <Section className="py-20">
        <Eyebrow dark>{SCOPE.eyebrow}</Eyebrow>
        <h2 className="max-w-3xl font-serif text-4xl font-semibold leading-[1.05] text-bone sm:text-5xl">
          {t(SCOPE.title)}
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Do */}
          <div className="border border-bone/15 p-8">
            <div className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-brass">
              {t(SCOPE.doLabel)}
            </div>
            <dl className="mt-6 space-y-5">
              {SCOPE.doGroups.map((g) => (
                <div key={g.id}>
                  <dt className="font-serif text-xl text-bone">{g.group}</dt>
                  <dd className="mt-1 font-sans text-sm leading-relaxed text-bone/60">{g.items}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* Don't */}
          <div className="border border-bone/15 bg-onyx p-8">
            <div className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-bone/45">
              {t(SCOPE.dontLabel)}
            </div>
            <ul className="mt-6 space-y-3">
              {SCOPE.dont.map((d) => (
                <li key={d} className="flex items-center gap-3 font-sans text-sm text-bone/60">
                  <span className="font-serif text-brass">×</span>
                  {d}
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-bone/15 pt-5 font-sans text-xs leading-relaxed text-bone/45">
              {t(SCOPE.referral)}
            </p>
          </div>
        </div>
      </Section>

      {/* ── 08 · METHODOLOGY ──────────────────────────────────────────── */}
      <Section id="method" className="py-20">
        <Eyebrow dark>{METHOD.eyebrow}</Eyebrow>
        <h2 className="font-serif text-4xl font-semibold text-bone sm:text-5xl">{t(METHOD.title)}</h2>
        <p className="mt-4 max-w-2xl font-sans text-bone/65">{t(METHOD.sub)}</p>
        <div className="mt-12 border-t border-bone/15">
          {METHOD.phases.map((p) => (
            <div
              key={p.id}
              className="grid grid-cols-[auto_1fr] gap-x-6 border-b border-bone/15 py-6 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline"
            >
              <span className="font-serif text-2xl italic text-brass">{p.num}</span>
              <h3 className="font-serif text-2xl font-semibold text-bone">{t(p.name)}</h3>
              <p className="col-span-2 mt-1 font-sans text-sm text-bone/65 sm:col-span-1 sm:mt-0">
                {t(p.body)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 09 · RECEIPTS ─────────────────────────────────────────────── */}
      <Section id="receipts" className="py-20">
        <Eyebrow dark>{RECEIPTS.eyebrow}</Eyebrow>
        <h2 className="font-serif text-4xl font-semibold text-bone sm:text-5xl">{t(RECEIPTS.title)}</h2>
        <div className="mt-12 grid grid-cols-2 gap-px border border-bone/15 bg-bone/15 lg:grid-cols-4">
          {RECEIPTS.stats.map((s) => (
            <div key={s.id} className="bg-onyx px-6 py-10">
              <div className="font-serif text-5xl font-semibold text-brass sm:text-6xl">{s.value}</div>
              <div className="mt-3 font-sans text-xs uppercase tracking-[0.14em] text-bone/55">
                {t(s.label)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 10 · VIDEO TESTIMONIALS ───────────────────────────────────── */}
      <Section id="testimonials" className="py-20">
        <Eyebrow dark>{TESTIMONIALS.eyebrow}</Eyebrow>
        <h2 className="max-w-3xl font-serif text-4xl font-semibold text-bone sm:text-5xl">
          {t(TESTIMONIALS.title)}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.items.map((v) => (
            <div key={v.id} className="group border border-bone/15">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={v.img}
                  alt={v.name}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale [object-position:50%_28%] transition duration-700 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-onyx/40 transition group-hover:bg-onyx/25">
                  <span className="flex h-14 w-14 items-center justify-center border border-brass text-brass transition group-hover:bg-brass group-hover:text-onyx">
                    ▶
                  </span>
                </div>
                <span className="absolute bottom-3 right-3 bg-onyx/80 px-2 py-1 font-sans text-[10px] tracking-wide text-bone">
                  {v.duration}
                </span>
              </div>
              <div className="p-6">
                <p className="font-serif text-lg italic text-bone">{t(v.quote)}</p>
                <div className="mt-4 font-serif text-base text-bone">{v.name}</div>
                <div className="font-sans text-xs uppercase tracking-[0.12em] text-brass">{t(v.role)}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 11 · NICHE (full-bleed Tide Pool close) ───────────────────── */}
      <div className="relative overflow-hidden bg-tidepool py-28">
        {/* Crowd atmosphere. Radial Tide Pool scrim keeps the centred copy
            legible while the image reads at the edges. */}
        <div className="pointer-events-none absolute inset-0">
          <img
            src={GALLERY.nicheBg}
            alt=""
            className="h-full w-full object-cover opacity-55 [filter:saturate(1.05)_contrast(1.05)]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 75% at center, rgba(17,46,46,0.92) 0%, rgba(17,46,46,0.72) 55%, rgba(17,46,46,0.5) 100%)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-8 z-10 border border-brass/15" />
        <Section className="relative z-10 text-center">
          <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
            {NICHE.eyebrow}
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[1.02] text-bone sm:text-6xl">
            {t(NICHE.title)}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-lg leading-relaxed text-bone/75">
            {t(NICHE.body)}
          </p>
          <div className="mt-10 font-sans text-xs uppercase tracking-[0.35em] text-brass">
            {NICHE.seal}
          </div>
        </Section>
      </div>

      {/* ── 12 · CTA FORM ─────────────────────────────────────────────── */}
      <Section id="contact" className="py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Eyebrow dark>{CTA.eyebrow}</Eyebrow>
            <h2 className="max-w-md font-serif text-4xl font-semibold leading-[1.05] text-bone sm:text-5xl">
              {t(CTA.title)}
            </h2>
            <div className="mt-10 space-y-5 border-t border-bone/15 pt-8">
              {CTA.stats.map((s) => (
                <div key={s.id} className="flex items-baseline gap-5">
                  <span className="w-12 shrink-0 font-serif text-4xl font-semibold text-brass">
                    {s.value}
                  </span>
                  <span className="font-sans text-sm text-bone/65">{t(s.label)}</span>
                </div>
              ))}
            </div>
            <Photo
              src={GALLERY.ctaImg}
              overlay="from-onyx/70 via-onyx/10 to-transparent"
              className="mt-10 hidden aspect-[16/9] lg:block"
            />
          </div>
          <div className="border border-bone/15 bg-onyx p-8 sm:p-10">
            <QualifierForm />
          </div>
        </div>
      </Section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="rule-tidepool border-t border-bone/10 bg-onyx">
        <Section className="py-14">
          <div className="grid gap-10 border-b border-bone/10 pb-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div>
              <Logo tone="white" className="h-9 w-auto" />
              <p className="mt-4 max-w-xs font-sans text-sm text-bone/55">{t(FOOTER.line)}</p>
            </div>
            {FOOTER.columns.map((c) => (
              <div key={c.id}>
                <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">
                  {c.head}
                </div>
                <ul className="mt-4 space-y-2 font-sans text-sm text-bone/60">
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-bone/50">
              {FOOTER.legal} · {FOOTER.tagStrip}
            </p>
            <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-footer-grey">
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
