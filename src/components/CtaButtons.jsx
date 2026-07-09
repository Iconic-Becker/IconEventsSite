import Icon from "./Icon.jsx"

/* Primary CTA — "Brass Brackets": outlined, with corner ticks that snap outward
   to frame the label on hover, plus a faint sheen sweep. Editorial, heritage.
   One signature move, sharp corners, brass/onyx/bone. */
export function CtaBrackets({ href = "#contact", children = "Start a Conversation" }) {
  const bracket =
    "pointer-events-none absolute h-2.5 w-2.5 border-brass transition-all duration-300 ease-out"
  return (
    <a
      href={href}
      className="group relative inline-flex items-center gap-3 overflow-hidden border border-bone/25 px-9 py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:border-brass/50 hover:text-brass"
    >
      {/* sheen */}
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brass/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      {/* corner ticks (inset → snap to corners on hover) */}
      <span className={`${bracket} left-1.5 top-1.5 border-l border-t group-hover:left-0 group-hover:top-0`} />
      <span className={`${bracket} right-1.5 top-1.5 border-r border-t group-hover:right-0 group-hover:top-0`} />
      <span className={`${bracket} bottom-1.5 left-1.5 border-b border-l group-hover:bottom-0 group-hover:left-0`} />
      <span className={`${bracket} bottom-1.5 right-1.5 border-b border-r group-hover:bottom-0 group-hover:right-0`} />
      <span className="relative z-10 flex items-center gap-3">
        {children}
        <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </a>
  )
}
