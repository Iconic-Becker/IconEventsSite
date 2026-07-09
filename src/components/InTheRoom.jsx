import { useState } from "react"
import { ROOM } from "../content.js"
import { useVoice } from "../voice.jsx"
import Brackets from "./Brackets.jsx"
import Particles from "./Particles.jsx"

// "In the Room" — Roster Index. Hovering a name crossfades the featured
// portrait and expands a short project paragraph beneath that name.
export default function InTheRoom() {
  const { t } = useVoice()
  const [active, setActive] = useState(0)

  return (
    <section className="relative overflow-hidden py-20">
      <Particles />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-4xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
        <p className="mt-3 max-w-xl font-sans text-bone/60">{t(ROOM.sub)}</p>
        <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-brass">{ROOM.meta}</p>
      </div>

      <div className="relative z-10 mx-auto mt-12 grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_1.05fr]">
        {/* name list — each row expands to reveal its project paragraph */}
        <ul className="order-2 border-t border-bone/12 lg:order-1">
          {ROOM.people.map((p, i) => {
            const on = active === i
            return (
              <li
                key={p.id}
                onMouseEnter={() => setActive(i)}
                className="group cursor-default border-b border-bone/12 py-5"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="flex items-baseline gap-4">
                    <span
                      className={`font-serif text-sm tabular-nums transition-colors ${on ? "text-brass" : "text-bone/30"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-serif text-3xl transition-colors duration-300 sm:text-4xl ${
                        on ? "text-brass" : "text-bone/55 group-hover:text-bone"
                      }`}
                    >
                      {p.name}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 font-sans text-xs uppercase tracking-[0.12em] transition-opacity duration-300 ${
                      on ? "text-bone/70 opacity-100" : "opacity-0"
                    }`}
                  >
                    {t(p.result)}
                  </span>
                </div>

                {/* expanding project paragraph */}
                <div
                  className={`grid transition-all duration-500 ease-out ${
                    on ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-lg pl-8 font-sans text-sm leading-relaxed text-bone/60">
                      {t(p.about)}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* featured image — crossfades with the active client */}
        <div className="relative order-1 aspect-[4/5] max-h-[560px] overflow-hidden border border-brass/25 lg:order-2">
          {ROOM.people.map((p, i) => (
            <img
              key={p.id}
              src={p.img}
              alt={p.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover grayscale transition-opacity duration-500 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/55 to-transparent" />
          <span className="pointer-events-none absolute left-5 top-3 font-serif text-7xl font-semibold text-bone/85">
            {String(active + 1).padStart(2, "0")}
          </span>
          <Brackets />
        </div>
      </div>
    </section>
  )
}
