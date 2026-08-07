import { useState, useRef } from "react"
import { MONTAGE, GALLERY } from "../content.js"
import { useVoice } from "../voice.jsx"
import Icon from "./Icon.jsx"
import Brackets from "./Brackets.jsx"
import DriftParticles from "./DriftParticles.jsx"

// "The Room, In Motion" — gold-gradient type-masked headline over panning
// footage, a click-to-expand proof gallery (hover for accent, ←/→ to step),
// a cursor-revealed brand pattern, and heavy left→right particles.
export default function Motion() {
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
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 text-center">
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

        <div className="motion-gallery mx-12 flex h-[52vh] min-h-[360px] gap-2 sm:mx-16">
          {imgs.map((src, i) => {
            const on = active === i
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={`View ${i + 1}`}
                className={`motion-panel motion-stack-${(i - active + imgs.length) % imgs.length} ${(i - active + imgs.length) % imgs.length === imgs.length - 1 ? "motion-stack-prev" : ""} ${on ? "motion-panel-active" : ""} group relative min-w-0 basis-0 overflow-hidden border border-brass/15 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] ${on ? "grow-[3.4]" : "grow"}`}
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
