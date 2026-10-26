import { ROOM } from "../content.js"
import { responsive } from "../lib/img.js"
import { useVoice } from "../voice.jsx"

// "Creators who trust us": the founders Iconic has built rooms for, straight
// under the hero, each as an all-access pass hanging from a lanyard. A pass
// is the one thing everybody at a live event recognises, which a creator
// agency cannot borrow. Paired with "Brands who trust us", the logo row below.
//
// From md up the passes hang in a row (three across at md, six at lg), tilted
// a little and straightened on hover. On phones they sit in a row that
// scrolls sideways. Each pass links to its case study where one exists.

// Alternating, uneven tilts, so the row reads as hung by hand.
const TILTS = ["-2.5deg", "1.5deg", "-1deg", "2deg", "-1.75deg", "1deg"]

function Pass({ p, i }) {
  const { t } = useVoice()
  const inner = (
    <>
      {/* lanyard */}
      <span aria-hidden="true" className="absolute -top-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-brass/60" />
      <div className="flex justify-center pt-3">
        <span aria-hidden="true" className="pass-slot" />
      </div>
      <p className="mt-3 text-center font-sans text-[9px] font-bold uppercase tracking-[0.34em] text-brass">All Access</p>
      <div className="relative mx-3 mt-3 aspect-[4/5] overflow-hidden border border-brass/30">
        <img
          {...responsive(p.img, "(min-width: 1024px) 180px, 240px")}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
        />
      </div>
      <div className="px-3 pb-4 pt-3 text-center">
        <h3 className="font-serif text-xl font-semibold leading-tight text-bone">{p.name}</h3>
        {p.event && (
          <p className="mt-1 font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-brass">{p.event}</p>
        )}
        <p className="mt-2 border-t border-bone/10 pt-2 font-sans text-[12px] leading-snug text-bone/60">{t(p.result)}</p>
      </div>
    </>
  )
  const cls =
    "pass group relative block h-full w-[200px] shrink-0 snap-center border border-brass/40 bg-[#121918] shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:w-auto"
  const style = { "--tilt": TILTS[i % TILTS.length] }
  return p.slug ? (
    <a href={`/case-studies/${p.slug}`} className={`${cls} hover:border-brass`} style={style}>
      {inner}
    </a>
  ) : (
    <div className={cls} style={style}>
      {inner}
    </div>
  )
}

export default function InTheRoom() {
  const { t } = useVoice()
  return (
    <section id="clients" className="relative pb-4 pt-2 sm:pb-8">
      <h2 className="px-5 text-center font-serif text-3xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
      <ul className="mobile-card-scroll mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-8 pb-8 pt-14 md:mx-auto md:mt-4 md:grid md:max-w-6xl md:grid-cols-3 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-6 lg:grid-cols-6 lg:gap-x-5">
        {ROOM.people.map((p, i) => (
          <li key={p.id} className="shrink-0 md:h-full">
            <Pass p={p} i={i} />
          </li>
        ))}
      </ul>
    </section>
  )
}
