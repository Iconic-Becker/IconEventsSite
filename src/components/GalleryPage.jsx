import { useEffect, useMemo, useState } from "react"
import SiteHeader from "./SiteHeader.jsx"
import InteractiveImageBentoGallery from "@/components/ui/bento-gallery"
import { galleryFrames } from "../case-studies.js"
import SiteFooter from "./SiteFooter.jsx"

/* /gallery: every event photograph on the site, on one page.

   The homepage keeps its own gallery section; this is the standalone page the
   nav points at. Each frame remembers the event it came from, so the enlarged
   view offers a way on to that event's case study. Over five hundred frames,
   so it opens on the first PAGE of them and shows more on request.

   The photos are arranged for spread, not grouped by event: a visitor should
   see one or two frames from an event surrounded by others, never a clump of
   one night. See arrange() below. */

const TITLE = "Gallery | Iconic Events"
const DESCRIPTION =
  "Take a peek behind the scenes at some of our events. Photographs from the rooms Iconic Events has produced, each linked to its case study."

/* The bento layout.

   A repeating rhythm of large, tall and wide frames, laid out so the grid
   finishes flush, with no hole beside a big frame on the last row. The
   column count changes with the screen (2 on a phone, up to 6), so the layout is
   worked out once per column count, by running the same dense placement the
   browser will and flattening frames nearest the end until nothing is left
   open. Deterministic, so the prerender and the browser agree. */
const RHYTHM = ["big", "one", "one", "tall", "one", "wide", "one"]
const SIZE = { one: [1, 1], wide: [2, 1], tall: [1, 2], big: [2, 2] }
const COLUMNS = [2, 3, 4, 5, 6]
/* One photo order has to serve all three column counts, and the 3 column
   layout is the hardest to spread, so it counts double when arranging. */
const SPREAD_WEIGHT = { 2: 1, 3: 2, 4: 1, 5: 1, 6: 1 }

// Literal class names, so Tailwind finds them in the source.
const SPAN = {
  2: { one: "col-span-1 row-span-1", wide: "col-span-2 row-span-1", tall: "col-span-1 row-span-2", big: "col-span-2 row-span-2" },
  3: { one: "sm:col-span-1 sm:row-span-1", wide: "sm:col-span-2 sm:row-span-1", tall: "sm:col-span-1 sm:row-span-2", big: "sm:col-span-2 sm:row-span-2" },
  4: { one: "lg:col-span-1 lg:row-span-1", wide: "lg:col-span-2 lg:row-span-1", tall: "lg:col-span-1 lg:row-span-2", big: "lg:col-span-2 lg:row-span-2" },
  5: { one: "xl:col-span-1 xl:row-span-1", wide: "xl:col-span-2 xl:row-span-1", tall: "xl:col-span-1 xl:row-span-2", big: "xl:col-span-2 xl:row-span-2" },
  6: { one: "2xl:col-span-1 2xl:row-span-1", wide: "2xl:col-span-2 2xl:row-span-1", tall: "2xl:col-span-1 2xl:row-span-2", big: "2xl:col-span-2 2xl:row-span-2" },
}

/* CSS grid's dense auto-placement: each frame takes the first slot it fits.
   Returns the grid as rows of frame indexes (undefined for an empty cell). */
function place(kinds, cols) {
  const grid = []
  const taken = (r, c) => grid[r]?.[c] !== undefined
  // Dense placement starts every search at the top, but rows above the
  // first one with a free cell can never take anything, so skip them.
  let top = 0
  kinds.forEach((kind, index) => {
    const [w, h] = SIZE[kind]
    for (let r = top; ; r++) {
      for (let c = 0; c + w <= cols; c++) {
        let fits = true
        for (let dr = 0; dr < h && fits; dr++) for (let dc = 0; dc < w && fits; dc++) if (taken(r + dr, c + dc)) fits = false
        if (!fits) continue
        for (let dr = 0; dr < h; dr++) for (let dc = 0; dc < w; dc++) (grid[r + dr] ??= [])[c + dc] = index
        while (grid[top] && grid[top].length === cols && !grid[top].includes(undefined)) top++
        return
      }
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
  const N = 1 << 16 // pair key: smaller index * N + larger index
  const weight = new Map()
  for (const [cols, kinds] of layouts) {
    const seen = new Map()
    const grid = place(kinds, cols)
    grid.forEach((row, r) => {
      for (let c = 0; c < cols; c++) {
        const here = row[c]
        for (const [dr, dc, w] of [[0, 1, 1], [1, 0, 1], [1, 1, 0.4], [1, -1, 0.4]]) {
          const there = grid[r + dr]?.[c + dc]
          if (here === undefined || there === undefined || there === here) continue
          // A long shared edge is still one neighbour, not several.
          const key = here < there ? here * N + there : there * N + here
          seen.set(key, Math.max(seen.get(key) ?? 0, w))
        }
      }
    })
    for (const [key, w] of seen) weight.set(key, (weight.get(key) ?? 0) + w * SPREAD_WEIGHT[cols])
  }
  return [...weight].map(([key, w]) => [Math.floor(key / N), key % N, w])
}

/* Put the photos in an order that spreads every event across the page.

   Fill the slots in page order. For each slot, pick the event that has no
   photo already touching that slot (at any column count), and among those
   the one furthest behind its fair share so far, so an event with fifty
   frames recurs steadily and one with eight is spaced through the whole
   set. Each event's own photos go in Iconic's order, so their favourites
   come first. One pass, so it stays quick at hundreds of frames, and
   deterministic, so the prerender and the browser agree. */
function arrange(frames, pairs) {
  const byEvent = new Map()
  for (const f of frames) {
    if (!byEvent.has(f.slug)) byEvent.set(f.slug, [])
    byEvent.get(f.slug).push(f)
  }
  const events = [...byEvent.keys()]
  const share = Object.fromEntries(events.map((e) => [e, byEvent.get(e).length / frames.length]))
  const used = Object.fromEntries(events.map((e) => [e, 0]))

  const touching = frames.map(() => [])
  for (const [a, b, w] of pairs) {
    touching[a].push([b, w])
    touching[b].push([a, w])
  }

  const order = []
  for (let slot = 0; slot < frames.length; slot++) {
    let pick = null
    for (const e of events) {
      if (used[e] === byEvent.get(e).length) continue
      let clash = 0
      for (const [other, w] of touching[slot]) if (other < slot && order[other].slug === e) clash += w
      const behind = (slot + 1) * share[e] - used[e]
      if (!pick || clash < pick.clash - 1e-9 || (Math.abs(clash - pick.clash) < 1e-9 && behind > pick.behind + 1e-9)) {
        pick = { e, clash, behind }
      }
    }
    order.push(byEvent.get(pick.e)[used[pick.e]++])
  }
  return order
}

const POOL = galleryFrames()
const LAYOUTS = COLUMNS.map((cols) => [cols, layoutFor(POOL.length, cols)])
const ORDER = arrange(POOL, neighbours(LAYOUTS))

// How many frames the page opens on, and how many each "show more" adds.
const PAGE = 120

// Where each column count starts, matching the grid's breakpoints.
const MIN_WIDTH = { 2: 0, 3: 640, 4: 1024, 5: 1280, 6: 1536 }

/* How wide a tile renders at each column count, as an <img sizes> value, so
   the browser fetches the 480w thumbnail for a small tile and the 960w only
   where it is needed. Slightly under a straight share of the screen, to
   allow for the margins and gaps. `spans` is [[cols, columns spanned]]. */
function sizesFor(spans) {
  return [...spans]
    .reverse()
    .map(([cols, w]) => {
      const vw = Math.round((96 / cols) * w)
      return MIN_WIDTH[cols] ? `(min-width: ${MIN_WIDTH[cols]}px) ${vw}vw` : `${vw}vw`
    })
    .join(", ")
}

/* The span classes for the first `count` frames. Worked out for that count,
   so the grid finishes flush however many are showing. */
function itemsFor(count) {
  const layouts = COLUMNS.map((cols) => [cols, layoutFor(count, cols)])
  return ORDER.slice(0, count).map((frame, index) => ({
    id: frame.src,
    title: frame.event,
    desc: frame.alt,
    url: frame.src,
    thumbs: frame.thumbs,
    sizes: sizesFor(layouts.map(([cols, kinds]) => [cols, SIZE[kinds[index]][0]])),
    href: frame.href,
    span: layouts.map(([cols, kinds]) => SPAN[cols][kinds[index]]).join(" "),
  }))
}

export default function GalleryPage() {
  const [showing, setShowing] = useState(Math.min(PAGE, POOL.length))
  const items = useMemo(() => itemsFor(showing), [showing])

  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  const more = showing < POOL.length && (
    <div className="mt-10 flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setShowing((n) => Math.min(n + PAGE, POOL.length))}
        className="border border-brass/60 px-8 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brass transition hover:bg-brass hover:text-onyx"
      >
        Show more photos
      </button>
      <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-bone/40">
        Showing {showing} of {POOL.length}
      </p>
    </div>
  )

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <InteractiveImageBentoGallery
        imageItems={items}
        title="Gallery"
        description="Take a peek behind the scenes at some of our events."
        footer={more}
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
      <SiteFooter />
    </main>
  )
}
