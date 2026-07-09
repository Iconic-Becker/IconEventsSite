// A heavy field of brass particles drifting left → right. Positions are
// deterministic (Math.sin hash), so they stay put across re-renders.
const DRIFT = Array.from({ length: 40 }, (_, i) => {
  const r = (n) => {
    const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453
    return x - Math.floor(x)
  }
  return {
    top: (r(1) * 100).toFixed(1),
    size: 1 + Math.round(r(2) * 1.4),
    dur: (6 + r(3) * 9).toFixed(1),
    delay: (r(4) * 12).toFixed(1),
    pop: (0.45 + r(5) * 0.45).toFixed(2),
  }
})

export default function DriftParticles() {
  return (
    <div className="drift-wrap pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {DRIFT.map((p, i) => (
        <span
          key={i}
          className="hero-particle"
          style={{
            top: `${p.top}%`,
            left: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            "--pop": p.pop,
            animation: `particle-drift ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
