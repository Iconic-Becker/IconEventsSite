import { useState, useRef } from "react"
import { POSITION, GALLERY } from "../content.js"
import { useVoice } from "../voice.jsx"
import Particles from "./Particles.jsx"

const POINTS = [
  { x: "22%", y: "40%", place: "below" },
  { x: "48%", y: "26%", place: "below" },
  { x: "73%", y: "44%", place: "below" },
  { x: "35%", y: "66%", place: "above" },
  { x: "63%", y: "70%", place: "above" },
]

// "Not event planners. Experience engineers." — Immersive Annotated Room.
// Headline carries the foggy ray + sparkles; the image carries a cursor
// colour-reveal lens and the logo-reveal spotlight at its centre.
export default function Position() {
  const { t } = useVoice()
  const [active, setActive] = useState(0)
  const imgRef = useRef(null)

  const move = (e) => {
    const el = imgRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  const leave = () => {
    const el = imgRef.current
    if (!el) return
    el.style.setProperty("--mx", "-9999px")
    el.style.setProperty("--my", "-9999px")
  }

  const title = t(POSITION.title)
  const key = "Experience engineers"
  const ki = title.indexOf(key)

  return (
    <section id="work" className="relative overflow-hidden py-16 sm:py-20">
      {/* atmosphere — a wide blurred glow behind the top of the image +
          particles rising up */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-[24%] h-[38%] w-[92%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 55% 60% at 50% 50%, rgba(184,153,104,0.42) 0%, rgba(184,153,104,0.14) 44%, transparent 74%)",
            filter: "blur(50px)",
          }}
        />
        <Particles dir="up" />
      </div>

      {/* headline */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 pt-10 text-center">
        <div className="mb-8 inline-block border-b border-brass/40 pb-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
            {POSITION.eyebrow}
          </span>
        </div>
        <h2 className="mx-auto max-w-4xl font-serif text-5xl font-semibold leading-[1.02] text-bone sm:text-7xl">
          {ki === -1 ? (
            title
          ) : (
            <>
              {title.slice(0, ki)}
              <span className="text-brass">{key}</span>
              {title.slice(ki + key.length)}
            </>
          )}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl font-sans text-bone/65">{t(POSITION.body)}</p>
      </div>

      {/* immersive annotated room */}
      <div className="relative z-10 mt-10 px-4">
        <div
          ref={imgRef}
          onMouseMove={move}
          onMouseLeave={leave}
          className="relative border border-brass/25"
        >
          {/* greyscale base */}
          <img
            src={GALLERY.positionRoom}
            alt=""
            className="aspect-[4/5] w-full object-cover grayscale contrast-[1.08] sm:aspect-[21/9]"
          />
          {/* legibility scrim (beneath the colour reveal) */}
          <div className="pointer-events-none absolute inset-0 bg-onyx/45" />
          {/* colour reveal — big soft circle following the cursor */}
          <img
            src={GALLERY.positionRoom}
            alt=""
            aria-hidden="true"
            className="color-reveal pointer-events-none absolute inset-0 h-full w-full object-cover contrast-[1.05] saturate-[1.06]"
          />
          {/* logo reveal — centred wordmark, revealed by the cursor spotlight */}
          <img
            src="/logos/IE_logo_white.png"
            alt=""
            aria-hidden="true"
            className="spotlight-img pointer-events-none absolute inset-0 h-full w-full object-contain px-[27%] py-[8%]"
          />

          {/* Mobile: a feathered full-colour reveal follows the selected marker. */}
          <img
            key={`mobile-reveal-${active}`}
            src={GALLERY.positionRoom}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover saturate-[1.12] md:hidden"
            style={{
              WebkitMaskImage: `radial-gradient(circle 82px at ${POINTS[active].x} ${POINTS[active].y}, #000 0%, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.35) 72%, transparent 100%)`,
              maskImage: `radial-gradient(circle 82px at ${POINTS[active].x} ${POINTS[active].y}, #000 0%, rgba(0,0,0,0.9) 48%, rgba(0,0,0,0.35) 72%, transparent 100%)`,
              filter: "drop-shadow(0 0 18px rgba(184,153,104,0.5))",
            }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute z-[5] h-28 w-28 -translate-x-1/2 -translate-y-1/2 bg-brass/20 blur-2xl md:hidden"
            style={{ left: POINTS[active].x, top: POINTS[active].y }}
          />

          {/* reticles + explanatory cards */}
          {POSITION.rows.map((r, i) => {
            const on = active === i
            return (
              <div key={i} className="absolute z-10" style={{ left: POINTS[i].x, top: POINTS[i].y }}>
                <button
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-label={t(r.engineer)}
                  className="relative block -translate-x-1/2 -translate-y-1/2"
                >
                  <span className={`absolute inset-0 border border-brass ${on ? "" : "reticle-ping"}`} />
                  <span
                    className={`relative flex h-11 w-11 items-center justify-center border-2 md:h-9 md:w-9 shadow-[0_0_14px_rgba(184,153,104,0.45)] transition-all duration-300 ${
                      on ? "scale-125 border-brass bg-brass/25" : "border-brass bg-onyx/50"
                    }`}
                  >
                    <span className="h-2 w-2 bg-brass" />
                  </span>
                </button>

                <div
                  className={`pointer-events-none absolute left-0 top-0 z-20 hidden transition-opacity duration-300 md:block ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    transform:
                      POINTS[i].place === "below"
                        ? "translate(-50%, 24px)"
                        : "translate(-50%, calc(-100% - 24px))",
                  }}
                >
                  <div className="w-max max-w-[360px] border border-brass/60 bg-onyx/92 p-5 text-left backdrop-blur">
                    <div className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brass">
                      {t(POSITION.colEngineer)}
                    </div>
                    <div className="mt-2 font-serif text-2xl leading-tight text-bone">
                      {t(r.engineer)}
                    </div>
                    <div className="mt-4 flex items-baseline gap-2 border-t border-bone/15 pt-3 font-sans text-xs">
                      <span className="uppercase tracking-wide text-bone/35">Not</span>
                      <span className="text-bone/45 line-through decoration-bone/30">{r.planner}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Mobile: one stable balloon updated by whichever marker is tapped. */}
          <div className="absolute inset-x-4 bottom-0 z-20 border border-brass/60 bg-onyx/95 p-4 text-left shadow-[0_12px_35px_rgba(0,0,0,0.45)] backdrop-blur md:hidden">
            <div className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brass">
              {t(POSITION.colEngineer)}
            </div>
            <div className="mt-1 font-serif text-2xl leading-tight text-bone">
              {t(POSITION.rows[active].engineer)}
            </div>
            <div className="mt-3 flex items-baseline gap-2 border-t border-bone/15 pt-3 font-sans text-xs">
              <span className="uppercase tracking-wide text-bone/35">Not</span>
              <span className="text-bone/50 line-through decoration-bone/30">
                {POSITION.rows[active].planner}
              </span>
            </div>
          </div>        </div>
      </div>

      {/* legend row — full image width, primary-button bracket + sheen treatment */}
      <div className="relative z-10 mt-4 hidden px-4 md:block">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {POSITION.rows.map((r, i) => {
            const on = active === i
            const tick = "pointer-events-none absolute h-2.5 w-2.5 border-brass transition-all duration-300 ease-out"
            const show = on ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            return (
              <button
                key={i}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className={`group relative overflow-hidden border p-5 text-left transition-colors duration-300 ${
                  on ? "border-brass/50" : "border-bone/15 hover:border-brass/40"
                }`}
              >
                {/* sheen */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brass/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                {/* corner ticks */}
                <span className={`${tick} border-l border-t ${show} ${on ? "left-0 top-0" : "left-1.5 top-1.5 group-hover:left-0 group-hover:top-0"}`} />
                <span className={`${tick} border-r border-t ${show} ${on ? "right-0 top-0" : "right-1.5 top-1.5 group-hover:right-0 group-hover:top-0"}`} />
                <span className={`${tick} border-b border-l ${show} ${on ? "bottom-0 left-0" : "bottom-1.5 left-1.5 group-hover:bottom-0 group-hover:left-0"}`} />
                <span className={`${tick} border-b border-r ${show} ${on ? "bottom-0 right-0" : "bottom-1.5 right-1.5 group-hover:bottom-0 group-hover:right-0"}`} />
                {/* content */}
                <span className="relative z-10 block">
                  <span className={`font-sans text-xs font-bold ${on ? "text-brass" : "text-bone/35"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mt-2 block font-sans text-xs font-bold uppercase leading-snug tracking-[0.14em] transition-colors duration-300 ${
                      on ? "text-brass" : "text-bone/55 group-hover:text-brass"
                    }`}
                  >
                    {t(r.engineer)}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
