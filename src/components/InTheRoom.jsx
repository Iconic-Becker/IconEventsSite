import { ROOM } from "../content.js"
import { responsive } from "../lib/img.js"
import { useVoice } from "../voice.jsx"

// "Creators who trust us": the founders Iconic has built rooms for, straight
// under the hero and paired with "Brands who trust us" below. The faces are
// the hook, so each founder is a tall portrait card in full colour, with
// name, event and figures set over the foot of the photo. The cards run
// sideways without end: the set is drawn twice so the loop has no seam, and
// the copy is hidden from assistive tech and the keyboard. Hover pauses it;
// reduced motion gets a still row that scrolls by hand.
//
// Figures are audience where a tracker has a number (sourced beside each
// entry in content.js) and the event's own results otherwise.
function Card({ p, copy }) {
  const stats = p.stats ?? []
  const body = (
    <>
      {p.img ? (
        <img
          {...responsive(p.img, "(min-width: 640px) 270px, 230px")}
          alt={copy ? "" : p.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        // No headshot on file yet: Tide Pool, the brand pattern and the
        // person's initials, so the card holds its place in the rail.
        <div aria-hidden="true" className="absolute inset-0 bg-tidepool">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "300px auto" }}
          />
          <span className="absolute inset-x-0 top-[22%] text-center font-serif text-7xl font-semibold text-brass/80 sm:text-8xl">
            {p.name.split(" ").map((w) => w[0]).join("")}
          </span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/45 via-35% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-center">
        <h3 className="font-sans text-base font-bold uppercase tracking-[0.08em] text-bone sm:text-lg">{p.name}</h3>
        <p className="mt-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brass">
          {p.event ?? "Live events"}
        </p>
        {/* Fixed height whether a card has one figure or three, so every
            name sits at the same height across the row. */}
        {stats.length > 0 && (
          <dl className="mt-3 flex h-[3.4rem] justify-center divide-x divide-bone/20 border-t border-bone/15 pt-3">
            {stats.map((s) => (
              <div key={s.label} className="flex min-w-0 flex-1 flex-col px-1.5">
                <dt className="mt-1 break-words font-sans text-[8px] uppercase leading-tight tracking-[0.1em] text-bone/60">{s.label}</dt>
                <dd className="order-first font-serif text-xl font-semibold leading-none text-bone sm:text-2xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </>
  )
  const cls =
    "group relative block aspect-[4/5] w-[230px] shrink-0 overflow-hidden border border-brass/25 bg-onyx transition-colors hover:border-brass sm:w-[270px]"
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
    <section id="clients" className="relative pb-4 pt-2 sm:pb-8">
      <h2 className="px-5 text-center font-serif text-3xl font-semibold text-bone sm:text-5xl">{t(ROOM.title)}</h2>
      <div className="creator-rail mt-6 overflow-hidden sm:mt-8">
        <div className="creator-track flex w-max">
          {/* Each copy carries its trailing gap as padding, so the -50% loop
              lands exactly one copy along. */}
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
