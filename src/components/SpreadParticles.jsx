// A field of brass particles fountaining out from the centre — half drift
// left, half right. Deterministic positions (Math.sin hash) so they stay put
// across re-renders. Reuses the shared .hero-particle style.
const FIELD = Array.from({ length: 46 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return {
    left: (48 + r(1) * 4).toFixed(1),
    top: (r(2) * 100).toFixed(1),
    size: 1 + Math.round(r(3) * 1.4),
    dur: (5 + r(4) * 8).toFixed(1),
    delay: (r(5) * 10).toFixed(1),
    pop: (0.45 + r(6) * 0.45).toFixed(2),
    dir: i % 2 === 0 ? "left" : "right",
  }
})

export default function SpreadParticles() {
  return (
    <div className="spread-wrap pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {FIELD.map((p, i) => (
        <span
          key={i}
          className="hero-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            "--pop": p.pop,
            animation: `particle-spread-${p.dir} ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
