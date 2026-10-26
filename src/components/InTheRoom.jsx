import { ROOM } from "../content.js"
import { responsive } from "../lib/img.js"
import { useVoice } from "../voice.jsx"

// "Creators who trust us": the founders Iconic has built rooms for, straight
// under the hero and paired with "Brands who trust us" below. A low banner
// that runs sideways without end: each founder is one compact strip, a small
// portrait beside their name, event and figures, split from the next by a
// hairline. The set is drawn twice so the loop has no seam; the copy is
// hidden from assistive tech and the keyboard. Hover pauses it; reduced
// motion gets a still row that scrolls by hand.
//
// Figures are audience where a tracker has a number (sourced beside each
// entry in content.js) and the event's own results otherwise.
function Strip({ p, copy }) {
  const stats = p.stats ?? []
  const body = (
    <>
      <div className="relative h-28 w-[5.5rem] shrink-0 overflow-hidden sm:h-32 sm:w-[6.5rem]">
        <img
          {...responsive(p.img, "104px")}
          alt={copy ? "" : p.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition duration-700 group-hover:grayscale-0"
        />
      </div>
      <div className="min-w-0">
        <h3 className="whitespace-nowrap font-serif text-xl font-semibold leading-tight text-bone sm:text-2xl">{p.name}</h3>
        <p className="mt-0.5 whitespace-nowrap font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brass/80">
          {p.event ?? "Live events"}
        </p>
        <dl className="mt-3 flex gap-5">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="mt-1 max-w-[7.5rem] font-sans text-[9px] uppercase leading-snug tracking-[0.12em] text-bone/50">{s.label}</dt>
              <dd className="order-first whitespace-nowrap font-serif text-2xl font-semibold leading-none text-bone transition-colors duration-500 group-hover:text-brass">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
  const cls = "group flex items-center gap-4 border-r border-bone/10 px-6 py-4 sm:gap-5 sm:px-8"
  return p.slug ? (
    <a href={`/case-studies/${p.slug}`} className={cls} tabIndex={copy ? -1 : undefined}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

export default function InTheRoom() {
  const { t } = useVoice()
  return (
    <section id="clients" className="relative pb-4 pt-2 sm:pb-6">
      <h2 className="px-5 text-center font-serif text-3xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
      <div className="creator-rail mt-6 overflow-hidden border-y border-bone/10 sm:mt-8">
        <div className="creator-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0">
              {ROOM.people.map((p) => (
                <li key={p.id} className="flex">
                  <Strip p={p} copy={copy === 1} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
