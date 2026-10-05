import React, { Suspense, lazy, useCallback, useEffect, useState } from "react"

/* Interactive bento gallery, adapted from the 21st.dev / shadcn component.

   What changed from the original, and why:
   - It scrolls with the page, top to bottom, rather than as one long strip
     dragged sideways (Iconic's call). The bento rhythm stays: large, tall
     and wide frames packed densely into a column grid.
   - Every item carries the event it came from (`title`), and the enlarged
     view links to that event's case study (`href`), or to the list of case
     studies for an event not yet written up (`href` null).
   - The grid loads thumbnails (`thumbs`), each tile picking the size it
     needs from `sizes`; the full file loads only when a photo is enlarged.
     The first few tiles load straight away, since they are on screen.
   - The enlarged view lives in bento-lightbox.tsx and loads on its own, so
     its animation code does not hold up the page.
   - shadcn's theme tokens (bg-background, bg-card, ring) do not exist here,
     so it is drawn in the house palette: onyx, bone, brass, sharp corners.
   - Frames rise into place with a CSS scroll-driven animation instead of a
     framer-motion stagger. The stagger started every frame at opacity 0,
     which is what the prerendered HTML would have shipped; this starts
     visible, and browsers without the feature just show the grid. */

export type ImageItem = {
  id: number | string
  title: string // the event's name, shown on the frame
  desc: string // the photo's alt text
  url: string // the full size file, for the enlarged view
  thumbs: [string, number][] // smaller files for the grid, as [url, width]
  sizes: string // how wide the tile renders, for picking a thumbnail
  href: string | null // the event's case study page, or null if not written up
  span: string // Tailwind grid span classes, e.g. "col-span-2 row-span-2"
}

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  eyebrow?: string
  title: string
  description: string
  // Rendered between the header and the grid.
  children?: React.ReactNode
  // Rendered under the grid, e.g. a button to show more.
  footer?: React.ReactNode
}

// Tiles on screen at load on most devices: fetched at once, not lazily.
const EAGER = 6

const loadLightbox = () => import("./bento-lightbox")
const Lightbox = lazy(loadLightbox)

const InteractiveImageBentoGallery: React.FC<InteractiveImageBentoGalleryProps> = ({
  imageItems,
  eyebrow,
  title,
  description,
  children,
  footer,
}) => {
  const [selected, setSelected] = useState<number | null>(null)
  // Mounted on first use and kept, so it can animate closed.
  const [opened, setOpened] = useState(false)

  // A new set of photos closes whatever was open from the old one.
  useEffect(() => setSelected(null), [imageItems])

  // Fetch the enlarged view's code once the page has settled, so the first
  // tap finds it ready.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 1500))
    idle(() => { loadLightbox() })
  }, [])

  const open = (index: number) => {
    setOpened(true)
    setSelected(index)
  }
  const step = useCallback(
    (direction: number) =>
      setSelected((current) =>
        current === null ? current : (current + direction + imageItems.length) % imageItems.length,
      ),
    [imageItems.length],
  )
  const close = useCallback(() => setSelected(null), [])

  return (
    <section className="relative w-full bg-onyx pb-16 pt-12 text-bone sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow && (
            <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">{eyebrow}</p>
          )}
          <h1 className={`font-serif text-5xl font-semibold leading-none sm:text-7xl ${eyebrow ? "mt-5" : ""}`}>{title}</h1>
          <p className="mt-5 font-sans text-lg leading-relaxed text-bone/70">{description}</p>
        </div>
        {children}
      </div>

      {/* The grid runs wider than the text column, nearly edge to edge,
          and gains columns as the screen widens (2 up to 6). Capped at
          1920px so frames do not balloon on very large monitors. The
          column counts must match COLUMNS in GalleryPage.jsx. */}
      <div className="mx-auto max-w-[1920px] px-5 sm:px-6 lg:px-8">
        <div className="mt-10 grid grid-flow-row-dense auto-rows-[10rem] grid-cols-2 gap-2 sm:mt-14 sm:auto-rows-[12rem] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[14rem] lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {imageItems.map((item, index) => (
            <div
              key={item.id}
              className={`bento-tile group relative flex cursor-pointer items-end overflow-hidden border border-brass/20 bg-tidepool p-4 outline-none transition-colors duration-300 hover:border-brass/70 focus-visible:border-brass focus-visible:ring-2 focus-visible:ring-brass ${item.span}`}
              onClick={() => open(index)}
              onPointerDown={() => { loadLightbox() }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  open(index)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Enlarge photo from ${item.title}`}
            >
              <img
                src={item.thumbs[item.thumbs.length - 1][0]}
                srcSet={item.thumbs.map(([url, w]) => `${url} ${w}w`).join(", ")}
                sizes={item.sizes}
                alt={item.desc}
                loading={index < EAGER ? "eager" : "lazy"}
                decoding="async"
                // React 18 has no camelCase prop for this; the lowercase
                // attribute passes straight through to the element.
                {...(index === 0 ? { fetchpriority: "high" } : {})}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 [filter:saturate(1.08)_contrast(1.06)] group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
              <div className="relative z-10 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brass">{item.href ? "Case study" : "Event"}</p>
                <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-bone">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <p className="mt-6 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-bone/40">
          Select a photo to enlarge it and see the event
        </p>
        {footer}
      </div>

      {opened && (
        <Suspense fallback={null}>
          <Lightbox items={imageItems} index={selected} onStep={step} onClose={close} />
        </Suspense>
      )}
    </section>
  )
}

export default InteractiveImageBentoGallery
