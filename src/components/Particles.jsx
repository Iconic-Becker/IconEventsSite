// A sparse field of drifting brass light particles (same look as the hero),
// reusable in any `relative` container. Positions are static so they don't
// jump on re-render. Uses the shared .hero-particle style + particle-fall.
const FIELD = [
  { left: "6%", top: "8%", size: "2px", fall: "220px", dur: 9, delay: 0 },
  { left: "14%", top: "30%", size: "1px", fall: "200px", dur: 11, delay: 2.4 },
  { left: "22%", top: "2%", size: "1px", fall: "240px", dur: 10, delay: 1.1 },
  { left: "31%", top: "44%", size: "2px", fall: "180px", dur: 8.5, delay: 3.2 },
  { left: "40%", top: "16%", size: "1px", fall: "230px", dur: 12, delay: 0.8 },
  { left: "47%", top: "52%", size: "1px", fall: "170px", dur: 9.5, delay: 4 },
  { left: "58%", top: "6%", size: "1px", fall: "250px", dur: 11.5, delay: 2 },
  { left: "66%", top: "38%", size: "2px", fall: "190px", dur: 10, delay: 3.6 },
  { left: "74%", top: "20%", size: "1px", fall: "210px", dur: 8, delay: 1.6 },
  { left: "83%", top: "50%", size: "1px", fall: "175px", dur: 9.2, delay: 4.6 },
  { left: "90%", top: "12%", size: "2px", fall: "235px", dur: 12.5, delay: 0.4 },
  { left: "95%", top: "34%", size: "1px", fall: "205px", dur: 10.5, delay: 2.9 },
]

export default function Particles({ className = "", dir = "down" }) {
  const up = dir === "up"
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {FIELD.map((p, i) => (
        <span
          key={i}
          className="hero-particle"
          style={{
            left: p.left,
            // rise from the lower half when going up
            top: up ? `${100 - parseFloat(p.top)}%` : p.top,
            width: p.size,
            height: p.size,
            "--fall": p.fall,
            animation: `${up ? "particle-rise" : "particle-fall"} ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
