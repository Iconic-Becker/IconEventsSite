import React, { useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { responsive } from "@/lib/img.js"
import type { ImageItem } from "./bento-gallery"

/* The enlarged view for the bento gallery, in its own file so its code
   (framer-motion and the icons, most of what the gallery ships) loads only
   when it is about to be used, not before the page can respond. The grid
   fetches it once the page is idle, or the moment a photo is touched.

   Shows the full size photo, the event, and a way on: the event's case
   study, or the list of case studies for an event not yet written up.
   Arrow keys step, Escape closes. */

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
              {item.href ? "From the case study" : "From the event"} · {pad(index + 1)} / {pad(items.length)}
            </p>
            <h3 className="mt-1.5 font-serif text-2xl font-semibold leading-tight text-bone sm:text-3xl">
              {item.title}
            </h3>
            <p className="mt-1.5 max-w-[60ch] font-sans text-sm leading-relaxed text-bone/55">
              {item.desc}
            </p>
          </div>
          {item.href ? (
            <a
              href={item.href}
              className="group inline-flex shrink-0 items-center justify-center gap-3 bg-brass px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-onyx transition hover:brightness-110"
            >
              View the case study
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            // Not written up yet, so there is no page to send them to; the
            // list of case studies is the nearest thing.
            <a
              href="/case-studies"
              className="group inline-flex shrink-0 items-center justify-center gap-3 border border-brass/60 px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brass transition hover:bg-brass hover:text-onyx"
            >
              See our case studies
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          )}
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
        className={`${navButton} left-3 sm:left-6`}
        aria-label="Previous photo"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onStep(1) }}
        className={`${navButton} right-3 sm:right-6`}
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

export default function Lightbox({
  items,
  index,
  onStep,
  onClose,
}: {
  items: ImageItem[]
  index: number | null
  onStep: (direction: number) => void
  onClose: () => void
}) {
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {index !== null && items[index] && (
          <ImageModal items={items} index={index} onStep={onStep} onClose={onClose} />
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
