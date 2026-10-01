import { responsive } from "../lib/img.js"

// Consistent premium treatment for atmosphere photography: brass hairline,
// sharp corners, cohesive punchy grade, light scrim only where text needs it,
// hover push-in. The source shots are already dark/cinematic, so the grade
// LIFTS them (contrast + saturation) rather than darkening.
//
// `sizes` tells the browser how wide this renders, so it can pick a variant
// rather than always taking the full-width file. Callers that fill a column
// should say so, e.g. sizes="(min-width: 768px) 33vw, 100vw".
export default function Photo({
  src,
  alt = "",
  className = "",
  sizes = "100vw",
  overlay = "from-onyx/45 via-transparent to-transparent",
  frame = true,
}) {
  return (
    <div
      className={`group relative overflow-hidden ${frame ? "border border-brass/25" : ""} ${className}`}
    >
      <img
        {...responsive(src, sizes)}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out will-change-transform group-hover:scale-105 [filter:saturate(1.08)_contrast(1.06)_brightness(1.05)]"
      />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${overlay}`} />
    </div>
  )
}
