// Reusable in-page design-review control. Floats bottom-left (clear of the
// bottom-right voice toggle) and flips a section between labelled variations.
export default function VariantSwitcher({ label, options, value, onChange }) {
  return (
    <div className="fixed bottom-3 left-3 z-50 flex items-stretch border border-brass/60 bg-onyx/95 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur">
      <span className="flex max-w-[86px] items-center px-2 font-sans text-[9px] font-bold uppercase leading-tight tracking-[0.16em] text-brass">
        {label}
      </span>
      {options.map((o) => {
        const active = value === o
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={active}
            className={`px-3.5 py-2.5 font-serif text-sm font-semibold transition ${
              active ? "bg-brass text-onyx" : "text-bone/45 hover:text-bone/80"
            }`}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}
