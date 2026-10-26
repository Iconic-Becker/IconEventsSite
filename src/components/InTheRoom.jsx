import { ROOM } from "../content.js"
import { responsive } from "../lib/img.js"
import { useVoice } from "../voice.jsx"

// "Creators who trust us": the founders Iconic has built rooms for, straight
// under the hero and paired with "Brands who trust us" below. Laid out as a
// roster sheet: six tall portraits side by side, split by hairlines, each
// person's figures set beneath in rows that line up across the sheet. No
// cards, no motion beyond a hover that brings a column into colour.
//
// Figures are audience where a tracker has a number (sourced beside each
// entry in content.js) and the event's own results otherwise. A person with
// fewer figures leaves the lower rows empty rather than padding them.
const ROWS = 3

function Column({ p }) {
  const stats = p.stats ?? []
  const body = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          {...responsive(p.img, "(min-width: 1024px) 190px, 60vw")}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />
      </div>
      <div className="px-4 pb-2 pt-4 sm:px-5">
        <h3 className="truncate font-serif text-xl font-semibold leading-tight text-bone xl:text-2xl">{p.name}</h3>
        <p className="mt-1 line-clamp-2 h-[2.75em] font-sans text-[10px] font-bold uppercase leading-snug tracking-[0.14em] text-brass/80">
          {p.event ?? "Live events"}
        </p>
      </div>
      <dl>
        {Array.from({ length: ROWS }, (_, r) => {
          const s = stats[r]
          return (
            <div key={r} className="flex h-[5.5rem] flex-col justify-center border-t border-bone/10 px-4 py-3 sm:px-5">
              {s && (
                <>
                  <dt className="mt-1 line-clamp-2 font-sans text-[10px] uppercase leading-snug tracking-[0.12em] text-bone/50">{s.label}</dt>
                  <dd className="order-first font-serif text-3xl font-semibold leading-none text-bone transition-colors duration-500 group-hover:text-brass">
                    {s.value}
                  </dd>
                </>
              )}
            </div>
          )
        })}
      </dl>
    </>
  )
  const cls = "group block h-full w-[64vw] max-w-[260px] shrink-0 snap-start border-l border-bone/10 lg:w-full lg:min-w-0 lg:max-w-none"
  return p.slug ? (
    <a href={`/case-studies/${p.slug}`} className={cls}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

export default function InTheRoom() {
  const { t } = useVoice()
  return (
    <section id="clients" className="relative pb-6 pt-2 sm:pb-10">
      <h2 className="px-5 text-center font-serif text-3xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
      <div className="mx-auto mt-8 max-w-6xl sm:mt-12 lg:px-6">
        <ul className="mobile-card-scroll flex snap-x snap-mandatory overflow-x-auto border-y border-bone/10 lg:grid lg:grid-cols-6 lg:overflow-visible">
          {ROOM.people.map((p) => (
            <li key={p.id} className="flex min-w-0 shrink-0 [&:first-child>*]:border-l-0">
              <Column p={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
