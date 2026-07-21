import { useEffect, useRef, useState } from "react"
import { SCOPE } from "../content.js"

// Toggle a class once the element scrolls into view (one-shot).
function useInView(threshold = 0.3) {
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

// Join an array into a grammatical list of rendered nodes ("a, b, and c").
function joiner(arr, node) {
  return arr.map((item, i) => (
    <span key={i}>
      {node(item, i)}
      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? ", and " : ""}
    </span>
  ))
}

export default function Scope() {
  const [ref, seen] = useInView(0.3)
  const dos = SCOPE.doGroups.map((g) => g.group)
  return (
    <div id="scope" className="bg-onyx py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* eyebrow */}
        <div className="mb-8 border-b border-brass/40 pb-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
            {SCOPE.eyebrow}
          </span>
        </div>

        {/* ── Manifesto headline — disciplines gilded, refusals struck ──────── */}
        <p
          ref={ref}
          className={`scope-manifesto max-w-4xl font-serif text-3xl leading-[1.35] text-bone/80 sm:text-4xl sm:leading-[1.4] ${seen ? "in" : ""}`}
        >
          We build{" "}
          {joiner(dos, (d) => (
            <span className="text-brass">{d}</span>
          ))}
          . We do not build{" "}
          {joiner(SCOPE.headlineDont, (d, i) => (
            <span className="scope-strike scope-strike-anim text-bone/45" style={{ "--i": i }}>
              {d}
            </span>
          ))}
          .
        </p>

        {/* ── Included / Excluded diptych ───────────────────────────────────── */}
        <div className="mt-14 grid overflow-hidden border border-brass/20 lg:grid-cols-[1.35fr_1fr]">
          {/* Included */}
          <div className="relative bg-brass/[0.04] p-8 sm:p-10">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-brass/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-baseline gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-brass text-brass">+</span>
                <div>
                  <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">
                    {SCOPE.doHead}
                  </div>
                  <div className="mt-1 font-sans text-xs text-bone/45">{SCOPE.doMeta}</div>
                </div>
              </div>
              <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {SCOPE.doGroups.map((g) => (
                  <div
                    key={g.id}
                    className="group border-l border-brass/30 pl-5 transition-colors duration-300 hover:border-brass"
                  >
                    <h3 className="font-serif text-xl text-bone transition-colors group-hover:text-brass">
                      {g.group}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {g.items.map((it) => (
                        <li key={it} className="font-sans text-sm leading-snug text-bone/60">
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Excluded */}
          <div className="relative border-t border-brass/20 bg-black/40 p-8 sm:p-10 lg:border-l lg:border-t-0">
            <div className="flex items-baseline gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-bone/25 text-bone/45">×</span>
              <div>
                <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-bone/45">
                  {SCOPE.dontHead}
                </div>
                <div className="mt-1 font-sans text-xs text-bone/45">{SCOPE.dontLine}</div>
              </div>
            </div>
            <ul className="mt-8 space-y-4">
              {SCOPE.dont.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <span className="mt-1 font-sans text-xs text-bone/30">×</span>
                  <span className="scope-linethrough font-serif text-lg leading-snug text-bone/45">
                    {d}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-10 border-t border-bone/12 pt-6">
              <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.16em] text-brass">
                {SCOPE.referralHead}
              </span>
              <span className="font-sans text-xs leading-relaxed text-bone/45">{SCOPE.referral}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
