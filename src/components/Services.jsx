import { useState } from "react"
import { SERVICES, GALLERY } from "../content.js"
import { useVoice } from "../voice.jsx"

// Wrap the first occurrence of `phrase` in a brass accent span.
function accent(text, phrase) {
  const i = text.indexOf(phrase)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className="text-brass">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  )
}

// Break the title after the first sentence and gild "authored room"
// (falling back to "room" in voices that phrase it differently).
function Headline({ title }) {
  const at = title.indexOf(". ")
  const line1 = at === -1 ? title : title.slice(0, at + 1)
  const line2 = at === -1 ? "" : title.slice(at + 2)
  const phrase = line2.includes("authored room") ? "authored room" : "room"
  return (
    <h2 className="max-w-4xl font-serif text-5xl font-semibold leading-[1.02] text-bone sm:text-6xl lg:text-7xl">
      {line1}
      <br />
      {accent(line2, phrase)}
    </h2>
  )
}

/* ── Capability · Kinetic Ledger ──────────────────────────────────────
   Each discipline is an oversized marquee that scrolls across the band;
   alternating rows drift opposite directions. Hovering a row freezes every
   row, dims the rest, grows the hovered one open with its full explanation,
   and floods the section background with that discipline's image. */
function LedgerRow({ s, i, t, active, dimmed, onEnter }) {
  const half = (
    <div className="flex items-center gap-8 pr-8">
      {Array.from({ length: 4 }).map((_, j) => (
        <span key={j} className="flex items-center gap-8">
          <span className={`font-serif leading-none transition-colors duration-300 sm:text-6xl text-4xl ${active ? "text-brass" : "text-bone/70"}`}>
            {t(s.title)}
          </span>
          <img
            src="/logos/IE_sigil_gold.png"
            alt=""
            aria-hidden="true"
            className="h-11 w-auto shrink-0 opacity-80 sm:h-14"
          />
        </span>
      ))}
    </div>
  )
  return (
    <div
      onMouseEnter={onEnter}
      className={`border-b border-brass/12 transition-opacity duration-300 last:border-0 ${dimmed ? "opacity-20" : "opacity-100"}`}
    >
      <div className="overflow-hidden py-5">
        <div className={`motion-row ${i % 2 ? "motion-right" : "motion-left"}`}>
          {half}
          {half}
        </div>
      </div>
      <div className={`grid transition-all duration-500 ease-out ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0 overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 pt-4 md:grid-cols-[16rem_1fr] md:items-start">
            <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">
              {s.num} · {t(s.replaces)}
            </div>
            <div>
              <p className="font-serif text-2xl leading-snug text-bone sm:text-3xl">{t(s.body)}</p>
              <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-bone/70">
                {t(s.process)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const { t } = useVoice()
  const [active, setActive] = useState(null)
  const imgs = GALLERY.capability
  return (
    <div id="services" className="relative overflow-hidden bg-onyx py-24">
      {/* flooding background — the hovered discipline's image bleeds through */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {SERVICES.items.map((it, i) => (
          <img
            key={it.id}
            src={imgs[i % imgs.length]}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-[900ms] ease-out ${active === i ? "opacity-[0.22]" : "opacity-0"}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-onyx via-onyx/70 to-onyx" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-8 border-b border-brass/40 pb-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
            {SERVICES.eyebrow}
          </span>
        </div>
        <Headline title={t(SERVICES.title)} />
        <p className="mt-6 max-w-2xl font-sans text-bone/70">{t(SERVICES.intro)}</p>
      </div>
      <div
        onMouseLeave={() => setActive(null)}
        className={`ledger relative z-10 mt-14 border-t border-brass/15 ${active !== null ? "ledger-paused" : ""}`}
      >
        {SERVICES.items.map((s, i) => (
          <LedgerRow
            key={s.id}
            s={s}
            i={i}
            t={t}
            active={active === i}
            dimmed={active !== null && active !== i}
            onEnter={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  )
}
