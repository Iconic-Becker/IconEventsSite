// Foggy brass light ray — a glowing source + soft beam + outer fog, feathered
// by radial masks. Fills a `relative` parent. Emanates from top-centre by
// default, or from the bottom rising up with `up`.
export default function LightRay({ className = "", up = false }) {
  const edge = up ? "bottom-0" : "top-0"
  const dir = up ? "to top" : "to bottom"
  const hot = up ? "50% 100%" : "50% 0%"
  const beamMask = up
    ? "radial-gradient(52% 96% at 50% 106%, #000 44%, transparent 82%)"
    : "radial-gradient(52% 96% at 50% -6%, #000 44%, transparent 82%)"
  const fogMask = up
    ? "radial-gradient(58% 92% at 50% 108%, #000 30%, transparent 84%)"
    : "radial-gradient(58% 92% at 50% -8%, #000 30%, transparent 84%)"
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* source hotspot */}
      <div
        className={`absolute left-1/2 ${edge} -translate-x-1/2`}
        style={{
          width: "34%",
          height: "55%",
          background: `radial-gradient(ellipse 55% 60% at ${hot}, rgba(184,153,104,0.30), rgba(184,153,104,0.07) 45%, transparent 70%)`,
          filter: "blur(22px)",
        }}
      />
      {/* core beam */}
      <div
        className={`absolute left-1/2 ${edge} -translate-x-1/2`}
        style={{
          width: "40%",
          height: "100%",
          background: `linear-gradient(${dir}, rgba(184,153,104,0.17) 0%, rgba(184,153,104,0.06) 45%, transparent 80%)`,
          WebkitMaskImage: beamMask,
          maskImage: beamMask,
          filter: "blur(15px)",
        }}
      />
      {/* outer fog */}
      <div
        className={`absolute left-1/2 ${edge} -translate-x-1/2`}
        style={{
          width: "54%",
          height: "96%",
          background: `linear-gradient(${dir}, rgba(184,153,104,0.09), transparent 78%)`,
          WebkitMaskImage: fogMask,
          maskImage: fogMask,
          filter: "blur(44px)",
        }}
      />
    </div>
  )
}
