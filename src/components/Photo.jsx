// Consistent premium treatment for atmosphere photography: brass hairline,
// sharp corners, cohesive punchy grade, light scrim only where text needs it,
// hover push-in. The source shots are already dark/cinematic, so the grade
// LIFTS them (contrast + saturation) rather than darkening.
export default function Photo({
  src,
  alt = "",
  className = "",
  overlay = "from-onyx/45 via-transparent to-transparent",
  frame = true,
}) {
  return (
    <div
      className={`group relative overflow-hidden ${frame ? "border border-brass/25" : ""} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out will-change-transform group-hover:scale-105 [filter:saturate(1.08)_contrast(1.06)_brightness(1.05)]"
      />
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${overlay}`} />
    </div>
  )
}
