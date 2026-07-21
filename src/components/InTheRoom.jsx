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
    <section className="relative overflow-hidden py-16 sm:py-20">
      <Particles />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
        <h2 className="font-serif text-4xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
        <p className="mt-3 max-w-xl font-sans text-bone/60">{t(ROOM.sub)}</p>
        <p className="mt-2 font-sans text-xs uppercase tracking-[0.18em] text-brass">{ROOM.meta}</p>
      </div>

      {/* Mobile: static section copy with a right-scrolling client story rail. */}
      <div className="relative z-10 mt-10 md:hidden">
        <div className="mb-4 flex items-center justify-between px-5">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-bone/45">
            Swipe through the room
          </span>
          <span aria-hidden="true" className="font-sans text-lg text-brass">→</span>
        </div>
        <div className="mobile-card-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {ROOM.people.map((p, i) => (
            <article
              key={p.id}
              className="relative w-[78vw] max-w-[310px] shrink-0 snap-start overflow-hidden border border-brass/25 bg-onyx first:ml-4"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/10 to-transparent" />
                <span className="absolute left-4 top-3 font-serif text-5xl font-semibold text-bone/85">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Brackets />
              </div>
              <div className="relative -mt-16 p-5 pt-0">
                <h3 className="font-serif text-3xl font-semibold text-bone">{p.name}</h3>
                <p className="mt-1 font-sans text-xs font-bold uppercase tracking-[0.12em] text-brass">
                  {t(p.result)}
                </p>
                <p className="mt-4 border-t border-bone/12 pt-4 font-sans text-sm leading-relaxed text-bone/65">
                  {t(p.about)}
                </p>
              </div>
            </article>
          ))}
          <div className="w-px shrink-0" aria-hidden="true" />
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-12 hidden max-w-6xl gap-10 px-5 sm:px-6 md:grid lg:grid-cols-[1fr_1.05fr]">
        {/* name list — each row expands to reveal its project paragraph */}
        <ul className="order-2 border-t border-bone/12 lg:order-1">
          {ROOM.people.map((p, i) => {
            const on = active === i
            return (
              <li
                key={p.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group cursor-pointer border-b border-bone/12 py-5"
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
