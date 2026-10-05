import { useEffect } from "react"
import SiteHeader from "./SiteHeader.jsx"
import InteractiveImageBentoGallery from "@/components/ui/bento-gallery"
import { galleryPool } from "../case-studies.js"

/* /gallery: every photograph used across the case studies, on one page.

   The homepage keeps its own gallery section; this is the standalone page the
   nav points at. Each frame remembers the case study it came from, so the
   enlarged view always offers a way on to that event's page.

   The photos are arranged for spread, not grouped by event: a visitor should
   see one or two frames from an event surrounded by others, never a clump of
   one night. See arrange() below. */

const TITLE = "Gallery | Iconic Events"
const DESCRIPTION =
  "Take a peek behind the scenes at some of our events. Photographs from the rooms Iconic Events has produced, each linked to its case study."

/* The bento layout.

   A repeating rhythm of large, tall and wide frames, laid out so the grid
   finishes flush, with no hole beside a big frame on the last row. The
   column count changes with the screen (2, 3, then 4), so the layout is
   worked out once per column count, by running the same dense placement the
   browser will and flattening frames nearest the end until nothing is left
   open. Deterministic, so the prerender and the browser agree. */
const RHYTHM = ["big", "one", "one", "tall", "one", "wide", "one"]
const SIZE = { one: [1, 1], wide: [2, 1], tall: [1, 2], big: [2, 2] }
const COLUMNS = [2, 3, 4]
/* One photo order has to serve all three column counts, and the 3 column
   layout is the hardest to spread, so it counts double when arranging.
   Measured: with equal weights it kept a clump of 3 from one event; at
   double, no width has more than 2 frames from one event touching. */
const SPREAD_WEIGHT = { 2: 1, 3: 2, 4: 1 }

// Literal class names, so Tailwind finds them in the source.
const SPAN = {
  2: { one: "col-span-1 row-span-1", wide: "col-span-2 row-span-1", tall: "col-span-1 row-span-2", big: "col-span-2 row-span-2" },
  3: { one: "sm:col-span-1 sm:row-span-1", wide: "sm:col-span-2 sm:row-span-1", tall: "sm:col-span-1 sm:row-span-2", big: "sm:col-span-2 sm:row-span-2" },
  4: { one: "lg:col-span-1 lg:row-span-1", wide: "lg:col-span-2 lg:row-span-1", tall: "lg:col-span-1 lg:row-span-2", big: "lg:col-span-2 lg:row-span-2" },
}

/* CSS grid's dense auto-placement: each frame takes the first slot it fits.
   Returns the grid as rows of frame indexes (undefined for an empty cell). */
function place(kinds, cols) {
  const grid = []
  kinds.forEach((kind, index) => {
    const [w, h] = SIZE[kind]
    for (let r = 0; ; r++) {
      const c = [...Array(cols - w + 1).keys()].find((c0) => {
        for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) if (grid[r + dr]?.[c0 + dc] !== undefined) return false
        return true
      })
      if (c === undefined) continue
      for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) (grid[r + dr] ??= [])[c + dc] = index
      return
    }
  })
  return grid
}

function holes(kinds, cols) {
  const grid = place(kinds, cols)
  let empty = 0
  for (const row of grid) for (let c = 0; c < cols; c++) if (row[c] === undefined) empty++
  return empty
}

function layoutFor(count, cols) {
  if (count < cols * 2) return Array(count).fill("one")
  const kinds = Array.from({ length: count }, (_, i) => RHYTHM[i % RHYTHM.length])
  for (let i = count - 1; i >= 0 && holes(kinds, cols) > 0; i--) kinds[i] = "one"
  return kinds
}

/* Which slots touch which, at every column count. Sharing an edge counts in
   full; touching at a corner counts for less, since it reads as nearby but
   not side by side. */
function neighbours(layouts) {
  const weight = new Map()
  const add = (a, b, w) => {
    if (a === undefined || b === undefined || a === b) return
    const key = a < b ? `${a},${b}` : `${b},${a}`
    weight.set(key, (weight.get(key) ?? 0) + w)
  }
  for (const [cols, kinds] of layouts) {
    const seen = new Map()
    const grid = place(kinds, cols)
    grid.forEach((row, r) => {
      for (let c = 0; c < cols; c++) {
        const here = row[c]
        for (const [dr, dc, w] of [[0, 1, 1], [1, 0, 1], [1, 1, 0.4], [1, -1, 0.4]]) {
          const there = grid[r + dr]?.[c + dc]
          if (there === undefined || there === here) continue
          // A long shared edge is still one neighbour, not several.
          const key = here < there ? `${here},${there}` : `${there},${here}`
          seen.set(key, Math.max(seen.get(key) ?? 0, w))
        }
      }
    })
    for (const [key, w] of seen) {
      const [a, b] = key.split(",").map(Number)
      add(a, b, w * SPREAD_WEIGHT[cols])
    }
  }
  return [...weight].map(([key, w]) => [...key.split(",").map(Number), w])
}

/* Put the photos in an order that spreads every event across the page.

   Start by spacing each event's frames evenly through the whole set, in
   proportion to how many it has, so an event with 14 frames recurs about
   every two or three and one with 2 appears once in each half. Then swap
   frames between slots, keeping any swap that leaves fewer frames from the
   same event touching, at every column count, until no swap helps. The
   slots and their shapes never move, only which photo sits in them. */
function arrange(frames, pairs) {
  const counts = {}
  const seen = {}
  frames.forEach((f) => (counts[f.slug] = (counts[f.slug] ?? 0) + 1))
  const spaced = frames
    .map((f, i) => {
      const j = (seen[f.slug] = (seen[f.slug] ?? -1) + 1)
      return { f, key: (j + 0.5) / counts[f.slug], i }
    })
    .sort((a, b) => a.key - b.key || a.i - b.i)
    .map(({ f }) => f)

  const cost = (order) => pairs.reduce((sum, [a, b, w]) => sum + (order[a].slug === order[b].slug ? w : 0), 0)

  function settle(order) {
    let best = cost(order)
    for (let improved = true; improved; ) {
      improved = false
      for (let i = 0; i < order.length; i++) {
        for (let j = i + 1; j < order.length; j++) {
          if (order[i].slug === order[j].slug) continue
          ;[order[i], order[j]] = [order[j], order[i]]
          const next = cost(order)
          if (next < best - 1e-9) {
            best = next
            improved = true
          } else {
            ;[order[i], order[j]] = [order[j], order[i]]
          }
        }
      }
    }
    return { order, best }
  }

  // Swapping one pair at a time can settle short of the best spread, so try
  // a few starting points (the even spacing, rotated) and keep the winner.
  // Still deterministic: the same photos always give the same page.
  let winner = null
  for (let start = 0; start < 12; start++) {
    const shift = Math.round((start * spaced.length) / 12)
    const result = settle([...spaced.slice(shift), ...spaced.slice(0, shift)])
    if (!winner || result.best < winner.best - 1e-9) winner = result
  }
  return winner.order
}

const POOL = galleryPool()
const LAYOUTS = COLUMNS.map((cols) => [cols, layoutFor(POOL.length, cols)])

const ITEMS = arrange(POOL, neighbours(LAYOUTS)).map((frame, index) => ({
  id: frame.src,
  title: frame.study,
  desc: frame.alt,
  url: frame.src,
  href: frame.href,
  span: LAYOUTS.map(([cols, kinds]) => SPAN[cols][kinds[index]]).join(" "),
}))

export default function GalleryPage() {
  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <InteractiveImageBentoGallery
        imageItems={ITEMS}
        title="Gallery"
        description="Take a peek behind the scenes at some of our events."
      />

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
