import { useRef } from "react"

// Cursor-follow spotlight that reveals a logo through a circular mask (same
// technique as the hero easter egg). Place absolutely over a `relative` block;
// keep the text above it `pointer-events-none` so hover reaches this layer.
export default function SpotlightReveal({ src = "/logos/IE_logo_white.png", className = "" }) {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  const leave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty("--mx", "-9999px")
    el.style.setProperty("--my", "-9999px")
  }
  return (
    <img
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      src={src}
      alt=""
      className={`spotlight-img ${className}`}
    />
  )
}
