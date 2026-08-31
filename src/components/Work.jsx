import { WORK } from "../content.js"
import { useVoice } from "../voice.jsx"
import Brackets from "./Brackets.jsx"
import SpreadParticles from "./SpreadParticles.jsx"

// "Selected Work" — Poster Grid. The featured case as a large poster; the
// archive as image-backed cards that colourise on hover with the bracket motif.
export default function Work() {
  const { t } = useVoice()
  const f = WORK.featured
  const pattern = {
    backgroundImage: "url(/images/patterns/pattern-white.webp)",
    backgroundSize: "440px auto",
    backgroundRepeat: "repeat",
  }
  return (
    <section id="work" className="relative overflow-hidden py-16 sm:py-20">
      {/* background — event image + colour overlay + brand pattern */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src="/images/gallery/position-room.webp"
          alt=""
          className="h-full w-full object-cover opacity-[0.12] grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx via-tidepool/35 to-onyx" />
        <div className="absolute inset-0 opacity-[0.05]" style={pattern} />
      </div>
      {/* particles fountaining out from the centre */}
      <SpreadParticles />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6">
      <div className="mb-8 border-b border-brass/40 pb-3">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {WORK.eyebrow}
        </span>
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="font-serif text-4xl font-semibold text-bone sm:text-5xl">{t(WORK.title)}</h2>
        <a href="#gallery" className="font-sans text-xs uppercase tracking-[0.15em] text-brass hover:text-bone">
          {t(WORK.index)}
        </a>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* featured poster */}
        <div className="group relative min-h-[78svh] overflow-hidden border border-brass/25 md:min-h-0 md:col-span-2 lg:row-span-2">
          <img
            src={f.img}
            alt=""
            className="absolute inset-0 h-full min-h-[340px] w-full object-cover grayscale md:relative transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:grayscale-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent md:from-onyx md:via-onyx/40" />
          <Brackets />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="hidden font-sans text-xs uppercase tracking-[0.18em] text-brass md:block">
              {f.label} · {f.meta}
            </div>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-bone sm:text-4xl">
              {t(f.headline)}
            </h3>
            <div className="mt-4 flex gap-8">
              {f.stats.map((s, i) => (
                <div key={i}>
                  <div className="font-serif text-2xl font-semibold text-brass">{s.value}</div>
                  <div className="font-sans text-[11px] uppercase tracking-[0.1em] text-bone/60">
                    {t(s.label)}
                  </div>
                </div>
              ))}
            </div>
            <a href={`/case-studies/${f.slug}`} className="mt-5 inline-block font-sans text-xs uppercase tracking-[0.15em] text-brass hover:text-bone">
              {t(f.cta)}
            </a>
          </div>
        </div>

        {/* archive poster cards */}
        {WORK.archive.map((a) => (
          <a
            key={a.id}
            href={`/case-studies/${a.slug}`}
            className="group relative flex min-h-[72svh] flex-col justify-end overflow-hidden border border-bone/15 md:min-h-[210px] transition-colors duration-300 hover:border-brass/40"
          >
            <img
              src={a.img}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent md:from-onyx md:via-onyx/55" />
            <img
              src="/logos/IE_sigil_white.png"
              alt=""
              className="pointer-events-none absolute left-6 top-6 h-8 w-auto opacity-80"
            />
            <div className="relative p-5 sm:p-6">
              <span className="block font-serif text-2xl text-bone">{a.name}</span>
              <span className="mt-1 block font-sans text-xs uppercase tracking-[0.12em] text-brass">
                {t(a.result)}
              </span>
            </div>
            <Brackets hover />
          </a>
        ))}
      </div>
      </div>
    </section>
  )
}
