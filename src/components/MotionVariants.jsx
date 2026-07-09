import { useState, useEffect, useRef } from "react"
import { MONTAGE, GALLERY } from "../content.js"
import { useVoice } from "../voice.jsx"
import Icon from "./Icon.jsx"
import Brackets from "./Brackets.jsx"
import DriftParticles from "./DriftParticles.jsx"

function Kicker({ t, center = false, light = false }) {
  return (
    <div className={center ? "text-center" : ""}>
      <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
        {t(MONTAGE.kicker)}
      </div>
      <p
        className={`mt-3 font-serif text-2xl italic ${light ? "text-bone" : "text-bone/80"} ${
          center ? "mx-auto max-w-2xl" : "max-w-xl"
        }`}
      >
        {t(MONTAGE.line)}
      </p>
    </div>
  )
}

function Tile({ src, className = "h-56 w-[22rem]" }) {
  return (
    <div className={`group/tile relative shrink-0 overflow-hidden border border-brass/15 ${className}`}>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover grayscale contrast-[1.05] transition-all duration-700 ease-out group-hover/tile:scale-105 group-hover/tile:grayscale-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/50 to-transparent" />
    </div>
  )
}

/* ── A · Kinetic Marquee ──────────────────────────────────────────────
   Two full-bleed rows gliding in opposite directions; photos colourise on
   hover, the row pauses under the cursor. */
export function MotionA() {
  const { t } = useVoice()
  const row1 = [...GALLERY.band, ...GALLERY.band]
  const row2 = [...GALLERY.band.slice().reverse(), ...GALLERY.band.slice().reverse()]
  return (
    <div className="overflow-hidden border-y border-brass/20 bg-onyx py-14">
      <div className="mx-auto max-w-6xl px-6">
        <Kicker t={t} />
      </div>
      <div className="mt-8 space-y-3">
        <div className="motion-row motion-left">
          {row1.map((src, i) => (
            <Tile key={`a-${i}`} src={src} />
          ))}
        </div>
        <div className="motion-row motion-right">
          {row2.map((src, i) => (
            <Tile key={`b-${i}`} src={src} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── B · Cinematic Crossfade ──────────────────────────────────────────
   One full-bleed frame with a slow Ken-Burns zoom, auto-crossfading through
   the shots; kicker + progress overlaid. */
export function MotionB() {
  const { t } = useVoice()
  const shots = GALLERY.band
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % shots.length), 4200)
    return () => clearInterval(id)
  }, [shots.length])
  return (
    <div className="relative overflow-hidden border-y border-brass/20 bg-onyx">
      <div className="relative h-[64vh] min-h-[440px] w-full">
        {shots.map((src, idx) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === idx ? "opacity-100" : "opacity-0"
            } ${i === idx ? "kenburns" : ""}`}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-onyx/30" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-6 pb-12">
          <Kicker t={t} light />
          <div className="mt-8 flex gap-2">
            {shots.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Shot ${idx + 1}`}
                className={`h-0.5 w-10 transition-colors ${i === idx ? "bg-brass" : "bg-bone/25 hover:bg-bone/50"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── C · Type-Masked Motion ───────────────────────────────────────────
   The event footage pans through a giant headline (background-clip: text),
   with a slim marquee filmstrip beneath. */
export function MotionC() {
  const { t } = useVoice()
  const strip = [...GALLERY.band, ...GALLERY.band]
  return (
    <div className="overflow-hidden border-y border-brass/20 bg-onyx py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {t(MONTAGE.kicker)}
        </div>
        <h3
          className="bg-pan mx-auto mt-4 max-w-5xl bg-clip-text font-serif text-6xl font-semibold uppercase leading-[0.95] tracking-tight text-transparent sm:text-8xl"
          style={{
            backgroundImage: `url(${GALLERY.band[0]})`,
            backgroundSize: "180% auto",
            WebkitBackgroundClip: "text",
          }}
        >
          {t(MONTAGE.kicker)}
        </h3>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-2xl italic text-bone/80">
          {t(MONTAGE.line)}
        </p>
      </div>
      <div className="mt-12">
        <div className="motion-row motion-left">
          {strip.map((src, i) => (
            <Tile key={i} src={src} className="h-32 w-52" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── D · Type-Masked headline (readable) + Expanding Accordion ─────────
   Mix of C (footage inside the headline, over a brighter, legible image)
   and A (the proof collection) — shown as an accordion that auto-cycles and
   expands under the cursor. */
export function MotionD() {
  const { t } = useVoice()
  const imgs = GALLERY.band
  const [active, setActive] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setActive((v) => (v + 1) % imgs.length), 2800)
    return () => clearInterval(id)
  }, [imgs.length])

  return (
    <div className="overflow-hidden border-y border-brass/20 bg-onyx py-16">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {t(MONTAGE.kicker)}
        </div>
        <h3
          className="mx-auto mt-4 max-w-5xl bg-clip-text font-serif text-6xl font-semibold uppercase leading-[0.95] tracking-tight text-transparent sm:text-8xl"
          style={{
            backgroundImage: `linear-gradient(rgba(14,19,18,0.35), rgba(14,19,18,0.35)), url(${GALLERY.positionRoom})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            WebkitBackgroundClip: "text",
            WebkitTextStroke: "1px rgba(184,153,104,0.35)",
            filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.55))",
          }}
        >
          {t(MONTAGE.kicker)}
        </h3>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-2xl italic text-bone/80">
          {t(MONTAGE.line)}
        </p>
      </div>

      {/* expanding accordion — auto-cycles, hover to steer */}
      <div className="mt-12 flex h-[52vh] min-h-[360px] gap-2 px-4">
        {imgs.map((src, i) => {
          const on = active === i
          return (
            <div
              key={i}
              onMouseEnter={() => setActive(i)}
              className={`group relative min-w-0 basis-0 cursor-pointer overflow-hidden border border-brass/15 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                on ? "grow-[6]" : "grow"
              }`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className={`h-full w-full object-cover transition-all duration-700 ${
                  on ? "scale-100 grayscale-0" : "scale-105 grayscale"
                }`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />
              <div
                className={`absolute bottom-0 left-0 p-5 transition-opacity duration-500 ${
                  on ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="font-serif text-2xl text-bone">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-3 font-sans text-xs uppercase tracking-[0.15em] text-brass">
                  {t(MONTAGE.kicker)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── E · Type-Masked motion + click-to-expand gallery ─────────────────
   Keeps the footage panning inside the readable headline (from C). The proof
   gallery no longer moves on hover — hover only adds a brass accent gradient;
   a click expands the image; premium ← → buttons step through the collection. */
export function MotionE() {
  const { t } = useVoice()
  const imgs = GALLERY.motionWall
  const [active, setActive] = useState(0)
  const go = (d) => setActive((v) => (v + d + imgs.length) % imgs.length)
  const secRef = useRef(null)
  const move = (e) => {
    const el = secRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  const leave = () => {
    const el = secRef.current
    if (!el) return
    el.style.setProperty("--mx", "-9999px")
    el.style.setProperty("--my", "-9999px")
  }

  const pattern = {
    backgroundImage: "url(/images/patterns/pattern-white.webp)",
    backgroundSize: "640px auto",
    backgroundRepeat: "repeat",
  }
  const navBtn =
    "group absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-brass/60 bg-onyx/80 text-brass backdrop-blur transition-colors duration-300 hover:bg-brass hover:text-onyx"

  return (
    <div
      ref={secRef}
      onMouseMove={move}
      onMouseLeave={leave}
      className="relative overflow-hidden border-y border-brass/20 bg-onyx py-16"
    >
      {/* brand pattern — barely-visible base + a cursor-revealed layer */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={pattern} aria-hidden="true" />
      <div className="pattern-reveal pointer-events-none absolute inset-0 opacity-[0.16]" style={pattern} aria-hidden="true" />
      {/* heavy particles drifting left → right */}
      <DriftParticles />

      {/* headline — full-length gold gradient over the panning footage */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {t(MONTAGE.kicker)}
        </div>
        <h3
          className="gold-sheen mx-auto mt-4 max-w-5xl bg-clip-text font-serif text-6xl font-semibold uppercase leading-[0.95] tracking-tight text-transparent sm:text-8xl"
          style={{
            backgroundImage: `linear-gradient(100deg, rgba(184,153,104,0.55) 0%, rgba(232,206,150,0.72) 20%, rgba(184,153,104,0.5) 40%, rgba(232,206,150,0.72) 60%, rgba(184,153,104,0.5) 80%, rgba(232,206,150,0.72) 100%), linear-gradient(rgba(14,19,18,0.26), rgba(14,19,18,0.26)), url(${GALLERY.positionRoom})`,
            backgroundSize: "200% 100%, cover, 150% auto",
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            WebkitTextStroke: "1px rgba(184,153,104,0.4)",
            filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.55))",
          }}
        >
          {t(MONTAGE.kicker)}
        </h3>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-2xl italic text-bone/80">
          {t(MONTAGE.line)}
        </p>
      </div>

      {/* gallery — click to expand, hover for accent, ←/→ to step */}
      <div className="relative z-10 mt-12 px-4">
        <button onClick={() => go(-1)} aria-label="Previous" className={`${navBtn} left-6`}>
          <Icon name="arrow" className="h-5 w-5 rotate-180" />
          <Brackets hover />
        </button>

        <div className="mx-16 flex h-[52vh] min-h-[360px] gap-2">
          {imgs.map((src, i) => {
            const on = active === i
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View ${i + 1}`}
                className={`group relative min-w-0 basis-0 overflow-hidden border border-brass/15 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                  on ? "grow-[7]" : "grow hover:grow-[2.6]"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full object-cover transition-all duration-700 ${
                    on ? "scale-100 grayscale-0" : "scale-105 grayscale"
                  }`}
                />
                {/* hover accent gradient (only when collapsed) */}
                {!on && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brass/60 via-brass/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                )}
                {/* label — strong black gradient + prominent caption (active) */}
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 transition-opacity duration-500 ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="h-44 bg-gradient-to-t from-onyx via-onyx/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-left">
                    <div className="font-serif text-4xl font-semibold leading-none text-bone sm:text-5xl">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brass">
                      {t(MONTAGE.kicker)}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <button onClick={() => go(1)} aria-label="Next" className={`${navBtn} right-6`}>
          <Icon name="arrow" className="h-5 w-5" />
          <Brackets hover />
        </button>
      </div>
    </div>
  )
}
