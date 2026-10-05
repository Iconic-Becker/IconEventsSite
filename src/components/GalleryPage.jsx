import { useEffect, useMemo, useState } from "react"
import SiteHeader from "./SiteHeader.jsx"
import InteractiveImageBentoGallery from "@/components/ui/bento-gallery"
import { galleryPool } from "../case-studies.js"

/* /gallery: every photograph used across the case studies, on one page.

   The homepage keeps its own gallery section; this is the standalone page the
   nav points at. Each frame remembers the case study it came from, so the
   enlarged view always offers a way on to that event's page, and the filter
   narrows the strip to one event. */

const TITLE = "Gallery | Iconic Events"
const DESCRIPTION =
  "Photographs from the rooms Iconic Events has produced. Stage, light, detail and audience, each linked to its case study."

/* The bento layout.

   A repeating rhythm of large, tall and wide frames, laid out so the grid
   finishes flush: no hole beside a big frame on the last row, whichever
   filter is picked. The column count changes with the screen (2, 3, then
   4), so the layout is worked out once per column count, by running the
   same dense placement the browser will, and adjusting the frames nearest
   the end until nothing is left open. Deterministic, so the prerender and
   the browser agree. */
const RHYTHM = ["big", "one", "one", "tall", "one", "wide", "one"]
const SIZE = { one: [1, 1], wide: [2, 1], tall: [1, 2], big: [2, 2] }

// Literal class names, so Tailwind finds them in the source.
const SPAN = {
  base: { one: "col-span-1 row-span-1", wide: "col-span-2 row-span-1", tall: "col-span-1 row-span-2", big: "col-span-2 row-span-2" },
  sm: { one: "sm:col-span-1 sm:row-span-1", wide: "sm:col-span-2 sm:row-span-1", tall: "sm:col-span-1 sm:row-span-2", big: "sm:col-span-2 sm:row-span-2" },
  lg: { one: "lg:col-span-1 lg:row-span-1", wide: "lg:col-span-2 lg:row-span-1", tall: "lg:col-span-1 lg:row-span-2", big: "lg:col-span-2 lg:row-span-2" },
}

// CSS grid's dense auto-placement: each frame takes the first slot it fits.
// Returns how many cells are left empty inside the rows the frames use.
function holes(kinds, cols) {
  const filled = []
  const free = (r, c) => !filled[r]?.[c]
  let rows = 0
  for (const kind of kinds) {
    const [w, h] = SIZE[kind]
    if (w > cols) return Infinity
    for (let r = 0; ; r++) {
      const c = [...Array(cols - w + 1).keys()].find((c0) => {
        for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) if (!free(r + dr, c0 + dc)) return false
        return true
      })
      if (c === undefined) continue
      for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) (filled[r + dr] ??= [])[c + dc] = true
      rows = Math.max(rows, r + h)
      break
    }
  }
  let empty = 0
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (free(r, c)) empty++
  return empty
}

function bestSmall(rhythm, cols) {
  const options = Object.keys(SIZE)
  let best = null
  const total = options.length ** rhythm.length
  for (let n = 0; n < total; n++) {
    const kinds = rhythm.map((_, i) => options[Math.floor(n / options.length ** i) % options.length])
    const score = [holes(kinds, cols), -kinds.filter((k, i) => k === rhythm[i]).length]
    if (!best || score[0] < best.score[0] || (score[0] === best.score[0] && score[1] < best.score[1])) {
      best = { kinds, score }
    }
  }
  return best.kinds
}

function layoutFor(count, cols) {
  const kinds = Array.from({ length: count }, (_, i) => RHYTHM[i % RHYTHM.length])
  // A handful of frames (one event's): few enough to try every layout and
  // keep the one that closes flush and stays nearest the rhythm.
  if (count <= 7) return bestSmall(kinds, cols)
  // Flatten frames from the end until the grid closes, then, if it still
  // does not, try growing one plain frame near the end to fill the gap.
  for (let i = count - 1; i >= 0 && holes(kinds, cols) > 0; i--) {
    if (kinds[i] !== "one") kinds[i] = "one"
  }
  if (holes(kinds, cols) > 0) {
    for (let i = count - 1; i >= Math.max(0, count - 12); i--) {
      if (kinds[i] !== "one") continue
      for (const grow of ["wide", "tall"]) {
        kinds[i] = grow
        if (holes(kinds, cols) === 0) return kinds
      }
      kinds[i] = "one"
    }
  }
  return kinds
}

function spansFor(count) {
  const base = layoutFor(count, 2)
  const sm = layoutFor(count, 3)
  const lg = layoutFor(count, 4)
  return base.map((_, i) => `${SPAN.base[base[i]]} ${SPAN.sm[sm[i]]} ${SPAN.lg[lg[i]]}`)
}

const POOL = galleryPool()

// Events in the order they first appear in the pool, with how many frames each.
const EVENTS = POOL.reduce((list, frame) => {
  const found = list.find((event) => event.slug === frame.slug)
  if (found) found.count += 1
  else list.push({ slug: frame.slug, name: frame.study, count: 1 })
  return list
}, [])

export default function GalleryPage() {
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  const items = useMemo(() => {
    const frames = POOL.filter((frame) => filter === "all" || frame.slug === filter)
    const spans = spansFor(frames.length)
    return frames.map((frame, index) => ({
      id: frame.src,
      title: frame.study,
      desc: frame.alt,
      url: frame.src,
      href: frame.href,
      span: spans[index],
    }))
  }, [filter])

  const chip = (active) =>
    `shrink-0 border px-3.5 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] transition ${
      active ? "border-brass bg-brass text-onyx" : "border-bone/20 text-bone/65 hover:border-brass hover:text-brass"
    }`

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <InteractiveImageBentoGallery
        imageItems={items}
        eyebrow="Gallery"
        title="Inside the room."
        description={`${POOL.length} photographs from ${EVENTS.length} events we have written up in full. Stage, light, detail and audience. Every frame leads back to its case study.`}
      >
        {/* One swipeable line on a phone, where six stacked rows of chips pushed
            the photos below the fold; wrapped from sm up, where they fit. */}
        <div className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-9 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0" role="group" aria-label="Filter photos by event">
          <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={chip(filter === "all")}>
            All events · {POOL.length}
          </button>
          {EVENTS.map((event) => (
            <button
              key={event.slug}
              type="button"
              aria-pressed={filter === event.slug}
              onClick={() => setFilter(event.slug)}
              className={chip(filter === event.slug)}
            >
              {event.name} · {event.count}
            </button>
          ))}
        </div>
      </InteractiveImageBentoGallery>

      <section className="border-t border-bone/10 py-16 sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 sm:px-6">
          <h2 className="max-w-[24ch] font-serif text-3xl font-semibold leading-tight sm:text-5xl">
            Tell us about the room you want to build.
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href="/case-studies" className="border border-bone/25 px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-bone transition hover:border-brass hover:text-brass">
              All case studies
            </a>
            <a href="/contact" className="bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx">
              Start a conversation
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
