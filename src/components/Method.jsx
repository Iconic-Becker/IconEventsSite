import { useEffect, useRef, useState } from "react"
import { METHOD } from "../content.js"
import { useVoice } from "../voice.jsx"
import DriftParticles from "./DriftParticles.jsx"

// Foggy brass ray fanning in from the left edge to the end of the container.
function LightRayLeft() {
  const beamMask = "radial-gradient(96% 66% at -6% 50%, #000 44%, transparent 82%)"
  const fogMask = "radial-gradient(96% 74% at -10% 50%, #000 28%, transparent 86%)"
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* source hotspot — left, centred vertically, broad and soft */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          width: "66%",
          height: "96%",
          background:
            "radial-gradient(ellipse 62% 60% at 0% 50%, rgba(184,153,104,0.30), rgba(184,153,104,0.08) 46%, transparent 72%)",
          filter: "blur(30px)",
        }}
      />
      {/* core beam — left → right */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          width: "100%",
          height: "60%",
          background:
            "linear-gradient(to right, rgba(184,153,104,0.17) 0%, rgba(184,153,104,0.06) 45%, transparent 82%)",
          WebkitMaskImage: beamMask,
          maskImage: beamMask,
          filter: "blur(18px)",
        }}
      />
      {/* outer fog — wider on the left */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2"
        style={{
          width: "100%",
          height: "118%",
          background: "linear-gradient(to right, rgba(184,153,104,0.10), transparent 80%)",
          WebkitMaskImage: fogMask,
          maskImage: fogMask,
          filter: "blur(52px)",
        }}
      />
    </div>
  )
}

function Head({ t }) {
  const words = t(METHOD.title).split(" ")
  return (
    <>
      <div className="mb-8 border-b border-brass/40 pb-3">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {METHOD.eyebrow}
        </span>
      </div>
      <h2 className="flex flex-wrap items-center gap-x-4 gap-y-1 font-serif text-5xl font-semibold leading-[1.02] text-bone sm:text-6xl lg:text-7xl">
        <img
          src="/logos/IE_sigil_gold.png"
          alt=""
          aria-hidden="true"
          className="inline-block h-[0.85em] w-auto"
        />
        <span>{words[0]}</span>
        <span className="text-brass">{words[1]}</span>
        {words.length > 2 && <span>{words.slice(2).join(" ")}</span>}
      </h2>
      <p className="mt-5 max-w-2xl font-sans text-bone/65">{t(METHOD.sub)}</p>
    </>
  )
}

/* ── Methodology · Phase Selector ─────────────────────────────────────
   Tabs I–V drive a large detail panel: per-phase image (softly blurred,
   feathered to onyx toward the copy), brand pattern, foggy left ray,
   drifting particles, and the sigil. The section background reveals more
   pattern under the cursor. */
export default function Method() {
  const { t } = useVoice()
  const [active, setActive] = useState(0)
  const cur = METHOD.phases[active]
  const secRef = useRef(null)
  const tabsAnchorRef = useRef(null)
  const [tabsPinned, setTabsPinned] = useState(false)

  useEffect(() => {
    const updatePin = () => {
      if (!window.matchMedia("(max-width: 767px)").matches) {
        setTabsPinned(false)
        return
      }
      const anchor = tabsAnchorRef.current
      const receipts = document.getElementById("receipts")
      if (!anchor || !receipts) return
      const reachedTop = anchor.getBoundingClientRect().top <= 44
      const nextSectionAtMidpoint = receipts.getBoundingClientRect().top <= window.innerHeight * 0.5
      setTabsPinned(reachedTop && !nextSectionAtMidpoint)
    }
    updatePin()
    window.addEventListener("scroll", updatePin, { passive: true })
    window.addEventListener("resize", updatePin)
    return () => {
      window.removeEventListener("scroll", updatePin)
      window.removeEventListener("resize", updatePin)
    }
  }, [])
  const patternBg = {
    backgroundImage: "url(/images/patterns/pattern-white.webp)",
    backgroundSize: "440px auto",
    backgroundRepeat: "repeat",
  }
  const onMove = (e) => {
    const el = secRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return (
    <div
      id="method"
      ref={secRef}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-onyx py-16 sm:py-24"
    >
      {/* brand pattern — a soft circle under the cursor reveals more of it */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={patternBg} aria-hidden="true" />
      <div className="pattern-reveal pointer-events-none absolute inset-0 opacity-[0.16]" style={patternBg} aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <Head t={t} />
        <div className="mt-14">
          <div ref={tabsAnchorRef} className={tabsPinned ? "h-12" : ""}>
            <div
              className={`${tabsPinned ? "fixed inset-x-0 top-11 z-40 border-y border-bone/12 bg-onyx/95 px-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur" : ""}`}
            >
              <div className="mx-auto grid max-w-6xl grid-cols-5 border-b border-bone/12">
            {METHOD.phases.map((p, i) => {
              const on = active === i
              return (
                <button
                  key={p.id}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`-mb-px flex min-h-12 items-center justify-center gap-2 border-b-2 px-2 py-3 transition-colors sm:gap-3 sm:px-5 sm:py-4 ${on ? "border-brass text-bone" : "border-transparent text-bone/50 hover:text-bone"}`}
                >
                  <span className="font-serif text-lg italic text-brass">{p.num}</span>
                  <span className="hidden font-sans text-xs uppercase tracking-[0.14em] sm:inline">
                    {t(p.name)}
                  </span>
                </button>
              )
            })}
              </div>
            </div>
          </div>
          <div
            key={active}
            className="fade-rise relative mt-12 min-h-[520px] overflow-hidden border border-brass/15"
          >
            {/* per-phase image — softly blurred so it reads as atmosphere */}
            <img
              src={cur.img}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-[3px]"
            />
            {/* radial gradient — image reads at the bottom-right, feathered softly
                to onyx toward the top-left where the copy sits */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 120% at 100% 100%, rgba(14,19,18,0) 0%, rgba(14,19,18,0.2) 26%, rgba(14,19,18,0.6) 50%, var(--color-onyx) 82%)",
              }}
            />
            {/* brand pattern — barely there */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "url(/images/patterns/pattern-white.webp)",
                backgroundSize: "440px auto",
                backgroundRepeat: "repeat",
              }}
            />
            {/* foggy brass ray sweeping from the left */}
            <LightRayLeft />
            {/* particles drifting left → right */}
            <DriftParticles />
            <div className="relative z-10 grid gap-8 p-8 sm:p-10 md:grid-cols-[auto_1fr] md:items-start">
              <div className="font-serif text-[7rem] font-bold leading-none text-brass/30">{cur.num}</div>
              <div>
                <span className="font-sans text-xs uppercase tracking-[0.18em] text-brass">
                  Phase {cur.num} of V
                </span>
                <h3 className="mt-3 font-serif text-3xl font-semibold text-bone sm:text-4xl">{t(cur.name)}</h3>
                <p className="mt-4 max-w-xl font-serif text-xl leading-snug text-bone/85">{t(cur.body)}</p>
                <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-bone/75">{t(cur.detail)}</p>
              </div>
            </div>
            {/* brand sigil, bottom-left */}
            <img
              src="/logos/IE_sigil_gold.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-6 left-8 z-10 h-12 w-auto opacity-70 sm:left-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
