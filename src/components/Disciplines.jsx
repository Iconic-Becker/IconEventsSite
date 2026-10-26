import { SCOPE } from "../content.js"

/* The six disciplines, as cards: name, one line, and the client's own list of
   what sits under it. The homepage renders it compact (no lists, with a link
   through); /services lays the same groups out as rows of its own.

   Built with Everlast in mind. A production company's pillars cover what we
   call Creative, Production and Operations. Strategy and Revenue are where
   we are not one, so those two cards carry a brass rule and say so, without
   naming anyone. */
export default function Disciplines({ compact = false }) {
  return (
    <ol className="grid gap-px border border-bone/10 bg-bone/10 sm:grid-cols-2 lg:grid-cols-3">
      {SCOPE.doGroups.map((g, i) => (
        <li
          key={g.id}
          className={`relative flex flex-col bg-onyx p-6 sm:p-7 ${g.beyond ? "before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-brass" : ""}`}
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-bone/35">{String(i + 1).padStart(2, "0")}</span>
            {g.beyond && (
              <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-brass">Beyond production</span>
            )}
          </div>
          <h3 className="mt-4 font-serif text-3xl font-semibold text-bone">{g.group}</h3>
          <p className="mt-2 font-sans text-sm leading-relaxed text-bone/65">{g.line}</p>
          {!compact && (
            <ul className="mt-5 space-y-1.5 border-t border-bone/10 pt-4">
              {g.items.map((item) => (
                <li key={item} className="font-sans text-[13px] text-bone/55">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}
