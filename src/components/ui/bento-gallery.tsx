import React, { useCallback, useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { responsive } from "@/lib/img.js"

/* Interactive bento gallery, adapted from the 21st.dev / shadcn component.

   What changed from the original, and why:
   - It scrolls with the page, top to bottom, rather than as one long strip
     dragged sideways (Iconic's call). The bento rhythm stays: large, tall
     and wide frames packed densely into a column grid.
   - Every item carries the case study it came from (`href`, `title`), and
     the enlarged view links straight to it. That is the point of the page.
   - shadcn's theme tokens (bg-background, bg-card, ring) do not exist here,
     so it is drawn in the house palette: onyx, bone, brass, sharp corners.
   - Frames rise into place with a CSS scroll-driven animation instead of a
     framer-motion stagger. The stagger started every frame at opacity 0,
     which is what the prerendered HTML would have shipped; this starts
     visible, and browsers without the feature just show the grid.
   - The enlarged view steps with the arrow keys and closes on Escape. */

export type ImageItem = {
  id: number | string
  title: string // the case study's name, shown on the frame
  desc: string // the photo's alt text, written for its case study
  url: string
  href: string // the case study page the photo belongs to
  span: string // Tailwind grid span classes, e.g. "col-span-2 row-span-2"
}

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  eyebrow?: string
  title: string
  description: string
  // Rendered between the header and the strip, e.g. filters.
  children?: React.ReactNode
}

const pad = (n: number) => String(n).padStart(2, "0")

const ImageModal = ({
  items,
  index,
  onStep,
  onClose,
}: {
  items: ImageItem[]
  index: number
  onStep: (direction: number) => void
  onClose: () => void
}) => {
  const item = items[index]
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowLeft") onStep(-1)
      if (event.key === "ArrowRight") onStep(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onStep])

  const navButton =
    "absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-brass/60 bg-onyx/80 text-brass transition-colors hover:bg-brass hover:text-onyx sm:grid"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-onyx/95 p-3 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, photo ${index + 1} of ${items.length}`}
      onClick={onClose}
    >
      <motion.div
        key={item.id}
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 12, opacity: 0 }}
        className="relative flex w-full max-w-5xl flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          {...responsive(item.url, "(min-width: 1024px) 1024px, 100vw")}
          alt={item.desc}
          className="h-auto max-h-[68svh] w-full border border-brass/25 object-contain sm:max-h-[74svh]"
        />
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-brass">
              From the case study · {pad(index + 1)} / {pad(items.length)}
            </p>
            <h3 className="mt-1.5 font-serif text-2xl font-semibold leading-tight text-bone sm:text-3xl">
              {item.title}
            </h3>
            <p className="mt-1.5 max-w-[60ch] font-sans text-sm leading-relaxed text-bone/55">
              {item.desc}
            </p>
          </div>
          <a
            href={item.href}
            className="group inline-flex shrink-0 items-center justify-center gap-3 bg-brass px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-onyx transition hover:brightness-110"
          >
            View the case study
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
        <div className="mt-4 flex gap-3 sm:hidden">
          <button type="button" onClick={() => onStep(-1)} className="grid h-11 flex-1 place-items-center border border-brass/60 text-brass" aria-label="Previous photo">
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => onStep(1)} className="grid h-11 flex-1 place-items-center border border-brass/60 text-brass" aria-label="Next photo">
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onStep(-1) }}
        className={cn(navButton, "left-3 sm:left-6")}
        aria-label="Previous photo"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onStep(1) }}
        className={cn(navButton, "right-3 sm:right-6")}
        aria-label="Next photo"
      >
        <ChevronRight size={22} />
      </button>
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center border border-bone/25 text-bone transition-colors hover:border-brass hover:text-brass sm:right-6 sm:top-6"
        aria-label="Close photo"
      >
        <X size={20} />
      </button>
    </motion.div>
  )
}

const InteractiveImageBentoGallery: React.FC<InteractiveImageBentoGalleryProps> = ({
  imageItems,
  eyebrow,
  title,
  description,
  children,
}) => {
  const [selected, setSelected] = useState<number | null>(null)

  // A new set of photos closes whatever was open from the old one.
  useEffect(() => setSelected(null), [imageItems])

  const step = useCallback(
    (direction: number) =>
      setSelected((current) =>
        current === null ? current : (current + direction + imageItems.length) % imageItems.length,
      ),
    [imageItems.length],
  )
  const close = useCallback(() => setSelected(null), [])

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full bg-onyx pb-16 pt-12 text-bone sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            {eyebrow && (
              <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">{eyebrow}</p>
            )}
            <h1 className={cn("font-serif text-5xl font-semibold leading-none sm:text-7xl", eyebrow && "mt-5")}>{title}</h1>
            <p className="mt-5 font-sans text-lg leading-relaxed text-bone/70">{description}</p>
          </div>
          {children}

          <div className="mt-10 grid grid-flow-row-dense auto-rows-[10rem] grid-cols-2 gap-2 sm:mt-14 sm:auto-rows-[12rem] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[14rem] lg:grid-cols-4">
            {imageItems.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "bento-tile group relative flex cursor-pointer items-end overflow-hidden border border-brass/20 bg-tidepool p-4 outline-none transition-colors duration-300 hover:border-brass/70 focus-visible:border-brass focus-visible:ring-2 focus-visible:ring-brass",
                  item.span,
                )}
                onClick={() => setSelected(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setSelected(index)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Enlarge photo from ${item.title}`}
              >
                <img
                  {...responsive(item.url, "(min-width: 1024px) 36rem, (min-width: 640px) 50vw, 100vw")}
                  alt={item.desc}
                  loading="lazy"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-700 [filter:saturate(1.08)_contrast(1.06)] group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <div className="relative z-10 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brass">Case study</p>
                  <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-bone">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-sans text-[10px] uppercase tracking-[0.2em] text-bone/40">
            Select a photo to enlarge it and open its case study
          </p>
        </div>

        <AnimatePresence>
          {selected !== null && imageItems[selected] && (
            <ImageModal items={imageItems} index={selected} onStep={step} onClose={close} />
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  )
}

export default InteractiveImageBentoGallery
