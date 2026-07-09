// Brass corner-tick accents — the motif from the primary button, reusable to
// frame images/tiles across the page. Drop inside a `relative` container.
//  - default: static frame that sits just inside the corners
//  - hover:   ticks fade in and snap to the corners on the parent `group` hover
export default function Brackets({ hover = false }) {
  if (hover) {
    const c =
      "pointer-events-none absolute h-2.5 w-2.5 border-brass opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"
    return (
      <>
        <span className={`${c} left-1.5 top-1.5 border-l border-t group-hover:left-0 group-hover:top-0`} />
        <span className={`${c} right-1.5 top-1.5 border-r border-t group-hover:right-0 group-hover:top-0`} />
        <span className={`${c} bottom-1.5 left-1.5 border-b border-l group-hover:bottom-0 group-hover:left-0`} />
        <span className={`${c} bottom-1.5 right-1.5 border-b border-r group-hover:bottom-0 group-hover:right-0`} />
      </>
    )
  }
  const c = "pointer-events-none absolute h-3 w-3 border-brass/70"
  return (
    <>
      <span className={`${c} left-2 top-2 border-l border-t`} />
      <span className={`${c} right-2 top-2 border-r border-t`} />
      <span className={`${c} bottom-2 left-2 border-b border-l`} />
      <span className={`${c} bottom-2 right-2 border-b border-r`} />
    </>
  )
}
