import { useRef, useState } from "react"
import { GALLERY } from "../content.js"

const IMAGES = [
  ...GALLERY.motionWall,
  "/images/gallery/g32.webp",
  "/images/gallery/g34.webp",
]

function rotate(items, offset) {
  const n = offset % items.length
  return [...items.slice(n), ...items.slice(0, n)]
}

function GalleryRow({ images, rowIndex, direction, spinning }) {
  const railRef = useRef(null)
  const drag = useRef({ active: false, x: 0, scroll: 0, timer: null })

  const startDrag = (event) => {
    const rail = railRef.current
    window.clearTimeout(drag.current.timer)
    drag.current = { active: true, x: event.clientX, scroll: rail.scrollLeft, timer: null }
    rail.setPointerCapture(event.pointerId)
    rail.classList.add("is-dragging")
    rail.classList.add("is-paused")
  }
  const dragRow = (event) => {
    if (!drag.current.active) return
    railRef.current.scrollLeft = drag.current.scroll - (event.clientX - drag.current.x)
  }
  const stopDrag = (event) => {
    const rail = railRef.current
    drag.current.active = false
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId)
    rail.classList.remove("is-dragging")
    drag.current.timer = window.setTimeout(() => rail.classList.remove("is-paused"), 1000)
  }

  return (
    <div
      ref={railRef}
      className={`gallery-row ${spinning ? "slot-spinning" : ""}`}
      onPointerDown={startDrag}
      onPointerMove={dragRow}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      aria-label={`Draggable gallery row ${rowIndex + 1}`}
    >
      <div className={`gallery-track flex w-max gap-3 px-3 ${direction < 0 ? "gallery-ltr" : "gallery-rtl"}`} style={{ animationDuration: `${110 + rowIndex * 18}s` }}>
        {[...images, ...images].map((src, i) => {
          const originalIndex = i % images.length
          return (
            <figure
              key={`${rowIndex}-${src}-${i}`}
              aria-hidden={i >= images.length}
                  className={`group relative h-[190px] shrink-0 overflow-hidden bg-onyx sm:h-[300px] ${originalIndex % 4 === 0 ? "w-[78vw] sm:w-[500px]" : "w-[64vw] sm:w-[340px]"}`}
            >
              <img src={src} alt={i < images.length ? `Iconic Events production detail ${rowIndex * images.length + originalIndex + 1}` : ""} loading="lazy" draggable="false" className="h-full w-full select-none object-cover grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
              <span className="absolute bottom-3 left-3 font-sans text-[10px] uppercase tracking-[0.22em] text-bone/70">{String(rowIndex * images.length + originalIndex + 1).padStart(2, "0")}</span>
            </figure>
          )
        })}
      </div>
    </div>
  )
}

export default function Gallery() {
  const [offsets, setOffsets] = useState([0, 4, 8])
  const [spinning, setSpinning] = useState(false)
  const rows = offsets.map((offset) => rotate(IMAGES, offset))

  const shuffle = () => {
    if (spinning) return
    setSpinning(true)
    window.setTimeout(() => {
      setOffsets((current) => current.map((value, index) => (value + 3 + index * 2) % IMAGES.length))
    }, 260)
    window.setTimeout(() => setSpinning(false), 760)
  }

  return (
    <section id="gallery" className="bg-bone py-16 text-onyx sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="border-b-4 border-tidepool pb-3"><span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">Gallery</span></div>
        <div className="mt-8 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <h2 className="font-serif text-4xl font-semibold leading-none sm:text-7xl">Inside the room.</h2>
          <p className="max-w-xl font-sans text-base leading-relaxed text-onyx/65 md:justify-self-end">Stage, light, detail, and audience. Drag any row to look around, or turn the room for a new edit.</p>
        </div>
      </div>
      <div className="pointer-events-none sticky top-[calc(100svh-4.5rem)] z-30 mx-auto h-0 max-w-6xl px-3 sm:top-[calc(100svh-6rem)] sm:px-6">
        <button type="button" onClick={shuffle} disabled={spinning} className="group pointer-events-auto ml-auto flex h-12 items-center gap-3 bg-brass px-3 text-onyx shadow-[0_12px_36px_rgba(14,19,18,0.28)] transition-transform duration-300 hover:-translate-y-1 disabled:cursor-wait sm:h-16 sm:px-4" aria-label="Shuffle gallery images">
          <img src="/logos/IE_sigil_black.png" alt="" className={`h-7 w-auto transition-transform duration-700 sm:h-9 ${spinning ? "rotate-[360deg] scale-75" : "group-hover:rotate-12"}`} />
          <span className="hidden font-sans text-[10px] font-bold uppercase tracking-[0.18em] sm:inline">Turn the room</span>
        </button>
      </div>
      <div className="gallery-rail mt-10 space-y-3 overflow-hidden" aria-label="Event production gallery">
        {rows.map((row, rowIndex) => <GalleryRow key={rowIndex} images={row} rowIndex={rowIndex} direction={rowIndex === 1 ? 1 : -1} spinning={spinning} />)}
      </div>
    </section>
  )
}
