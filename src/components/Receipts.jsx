import { useEffect, useRef, useState } from "react"
import { RECEIPTS } from "../content.js"
import { useVoice } from "../voice.jsx"

// Toggle a class once the element scrolls into view (one-shot).
function useInView(threshold = 0.25) {
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
      { threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen, threshold])
  return [ref, seen]
}

// Animate a stat value (e.g. "$1.8M", "146K", "40+", "100%") from 0 → target
// once `run` is true, preserving its prefix and suffix.
function CountUp({ value, run, className }) {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const m = String(value).match(/^([^\d]*)([\d.,]+)(.*)$/)
  const numStr = m ? m[2].replace(/,/g, "") : "0"
  const target = parseFloat(numStr)
  const decimals = (numStr.split(".")[1] || "").length
  const [n, setN] = useState(reduce ? target : 0)
  useEffect(() => {
    if (!run || reduce || !m) return
    let raf
    let start = null
    const dur = 1400
    const tick = (ts) => {
      if (start == null) start = ts
      const p = Math.min(1, (ts - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run])
  if (!m) return <span className={className}>{value}</span>
  return (
    <span className={className}>
      {m[1]}
      {n.toFixed(decimals)}
      {m[3]}
    </span>
  )
}

function Head({ t }) {
  const title = t(RECEIPTS.title)
  const i = title.indexOf("numbers")
  return (
    <>
      <div className="mb-8 border-b border-brass/40 pb-3">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {RECEIPTS.eyebrow}
        </span>
      </div>
      <h2 className="font-serif text-5xl font-semibold leading-[1.02] text-bone sm:text-6xl lg:text-7xl">
        {i === -1 ? (
          title
        ) : (
          <>
            {title.slice(0, i)}
            <span className="text-brass">numbers</span>
            {title.slice(i + "numbers".length)}
          </>
        )}
      </h2>
    </>
  )
}

/* One stat row — a giant figure and label, with an event image on the right
   revealed only through a soft circle that follows the cursor. */
function StatRow({ s, idx, run, t }) {
  const imgRef = useRef(null)
  const onMove = (e) => {
    const el = imgRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  const hide = () => {
    const el = imgRef.current
    if (!el) return
    el.style.setProperty("--mx", "-9999px")
    el.style.setProperty("--my", "-9999px")
  }
  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={hide}
      className="group relative grid grid-cols-1 items-center gap-x-10 gap-y-2 border-b border-bone/12 py-9 sm:grid-cols-[1.5rem_auto_1fr] sm:py-10"
    >
      {/* cursor-revealed image on the right */}
      <img
        ref={imgRef}
        src={s.img}
        alt=""
        aria-hidden="true"
        style={{ objectPosition: s.imgPos || "center" }}
        className="receipts-reveal pointer-events-none absolute right-0 top-0 h-full w-[55%] object-cover grayscale"
      />
      <span className="relative z-10 font-sans text-sm tabular-nums text-brass/60">
        {String(idx + 1).padStart(2, "0")}
      </span>
      <CountUp
        value={s.value}
        run={run}
        className="relative z-10 font-serif text-6xl font-semibold leading-none text-brass transition-transform duration-500 group-hover:translate-x-1 sm:text-8xl"
      />
      <div className="relative z-10 font-sans text-sm uppercase tracking-[0.16em] text-bone/70 sm:text-base">
        {t(s.label)}
      </div>
    </div>
  )
}

/* ── Receipts · Oversized Rows ────────────────────────────────────────
   Each stat a full-width row: a giant figure (counting up on scroll) and
   its label, over a faint brand pattern; the paired event image reveals
   under the cursor. */
export default function Receipts() {
  const { t } = useVoice()
  const [ref, seen] = useInView(0.25)
  const pattern = {
    backgroundImage: "url(/images/patterns/pattern-white.webp)",
    backgroundSize: "440px auto",
    backgroundRepeat: "repeat",
  }
  return (
    <div id="receipts" className="relative overflow-hidden bg-onyx py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={pattern} aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <Head t={t} />
        <div ref={ref} className="mt-12 border-t border-bone/12">
          {RECEIPTS.stats.map((s, idx) => (
            <StatRow key={s.id} s={s} idx={idx} run={seen} t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
