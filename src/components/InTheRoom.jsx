import { ROOM } from "../content.js"
import { responsive } from "../lib/img.js"
import { useVoice } from "../voice.jsx"

// "Creators we work with": the founders Iconic has built rooms for, by face
// and name, straight under the hero. A rail of portrait cards drifting left,
// after GenFlow's, which puts who they work with front and centre. The set is
// drawn twice so the loop never shows a seam; the copy is hidden from
// assistive tech and the keyboard. Hover pauses it. Reduced motion gets a
// plain row that scrolls by hand.
//
// GenFlow carries follower counts under each name. Iconic has none on file,
// so each card carries the event and its result instead.
function Card({ p, copy }) {
  const { t } = useVoice()
  const body = (
    <>
      <img
        {...responsive(p.img, "300px")}
        alt={copy ? "" : p.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-center">
        <h3 className="font-sans text-lg font-bold uppercase tracking-[0.06em] text-bone">{p.name}</h3>
        {p.event && (
          <p className="mt-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">{p.event}</p>
        )}
        <p className="mt-1 font-sans text-[13px] text-bone/65">{t(p.result)}</p>
      </div>
    </>
  )
  const cls = "group relative block aspect-[4/5] w-[240px] shrink-0 overflow-hidden border border-brass/25 bg-onyx sm:w-[290px]"
  return p.slug ? (
    <a href={`/case-studies/${p.slug}`} className={`${cls} transition-colors hover:border-brass`} tabIndex={copy ? -1 : undefined}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  )
}

export default function InTheRoom() {
  const { t } = useVoice()
  return (
    <section id="clients" className="relative pb-6 pt-4 sm:pb-10 sm:pt-6">
      <h2 className="px-5 text-center font-serif text-3xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
      <div className="creator-rail mt-8 overflow-hidden sm:mt-10">
        <div className="creator-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5">
              {ROOM.people.map((p) => (
                <li key={p.id}>
                  <Card p={p} copy={copy === 1} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
