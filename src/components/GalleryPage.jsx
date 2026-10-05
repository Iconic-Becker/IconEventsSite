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

// The bento rhythm: a large frame, a tall one and a wide one in every seven,
// fixed by position rather than chance so the prerender and the browser agree.
function spanFor(index) {
  switch (index % 7) {
    case 0: return "col-span-2 row-span-2"
    case 3: return "row-span-2"
    case 5: return "col-span-2"
    default: return ""
  }
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

  const items = useMemo(
    () =>
      POOL.filter((frame) => filter === "all" || frame.slug === filter).map((frame, index) => ({
        id: frame.src,
        title: frame.study,
        desc: frame.alt,
        url: frame.src,
        href: frame.href,
        span: spanFor(index),
      })),
    [filter]
  )

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
