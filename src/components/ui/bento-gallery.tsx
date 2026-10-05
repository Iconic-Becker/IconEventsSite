import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  motion,
  animate,
  useMotionValue,
  AnimatePresence,
  MotionConfig,
} from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { responsive } from "@/lib/img.js"

/* Interactive bento gallery, adapted from the 21st.dev / shadcn component.

   What changed from the original, and why:
   - Every item carries the case study it came from (`href`, `study`), and the
     enlarged view links straight to it. That is the point of the page.
   - shadcn's theme tokens (bg-background, bg-card, ring) do not exist here,
     so it is drawn in the house palette: onyx, bone, brass, sharp corners.
   - The header no longer fades in on scroll. Its starting opacity was 0, and
     that is what the prerendered HTML would have shipped for the page's h1.
   - A drag no longer counts as a click, so dragging the strip does not open
     whatever photo the pointer happened to be over when it let go.
   - Trackpads scroll it sideways, keyboard focus pulls the focused frame into
     view, and the enlarged view steps with the arrow keys. */

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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
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
  const [dragConstraint, setDragConstraint] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const dragging = useRef(false)

  const clamp = useCallback(
    (value: number) => Math.max(dragConstraint, Math.min(0, value)),
    [dragConstraint],
  )

  // How far the strip can travel: its full width less what fits on screen.
  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const gridWidth = gridRef.current.scrollWidth
        setDragConstraint(Math.min(0, containerWidth - gridWidth))
      }
    }
    calculateConstraints()
    window.addEventListener("resize", calculateConstraints)
    return () => window.removeEventListener("resize", calculateConstraints)
  }, [imageItems])

  // A new set of photos starts from the left edge.
  useEffect(() => {
    x.set(0)
    setSelected(null)
  }, [imageItems, x])

  // Sideways trackpad gestures move the strip; vertical scrolling is left to
  // the page, so nobody gets stuck on it.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
      event.preventDefault()
      x.set(clamp(x.get() - event.deltaX))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [clamp, x])

  const nudge = (direction: number) => {
    const width = containerRef.current?.offsetWidth ?? 0
    animate(x, clamp(x.get() - direction * width * 0.8), { type: "spring", stiffness: 200, damping: 30 })
  }

  // Tabbing to a frame off screen brings it into view.
  const reveal = (event: React.FocusEvent<HTMLDivElement>) => {
    const container = containerRef.current
    if (!container) return
    const left = event.currentTarget.offsetLeft
    const right = left + event.currentTarget.offsetWidth
    const visibleLeft = -x.get()
    const visibleRight = visibleLeft + container.offsetWidth
    if (left < visibleLeft + 16) animate(x, clamp(-(left - 32)))
    else if (right > visibleRight - 16) animate(x, clamp(-(right - container.offsetWidth + 32)))
  }

  const step = useCallback(
    (direction: number) =>
      setSelected((current) =>
        current === null ? current : (current + direction + imageItems.length) % imageItems.length,
      ),
    [imageItems.length],
  )
  const close = useCallback(() => setSelected(null), [])

  const arrow =
    "grid h-11 w-11 place-items-center border border-brass/50 text-brass transition-colors hover:bg-brass hover:text-onyx"

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative w-full overflow-hidden bg-onyx pb-16 pt-12 text-bone sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          {eyebrow && (
            <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">{eyebrow}</p>
          )}
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="max-w-[18ch] font-serif text-4xl font-semibold leading-[0.98] sm:text-7xl">{title}</h1>
              <p className="mt-6 max-w-[58ch] font-sans text-lg leading-relaxed text-bone/70">{description}</p>
            </div>
            <div className="hidden gap-2 md:flex">
              <button type="button" onClick={() => nudge(-1)} className={arrow} aria-label="Scroll gallery left">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={() => nudge(1)} className={arrow} aria-label="Scroll gallery right">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          {children}
        </div>

        <div ref={containerRef} className="relative mt-8 w-full cursor-grab sm:mt-10 touch-pan-y active:cursor-grabbing">
          <motion.div
            className="w-max"
            style={{ x }}
            drag="x"
            dragConstraints={{ left: dragConstraint, right: 0 }}
            dragElastic={0.05}
            onDragStart={() => { dragging.current = true }}
            onDragEnd={() => { window.setTimeout(() => { dragging.current = false }, 0) }}
          >
            <motion.div
              ref={gridRef}
              className="grid grid-flow-col-dense auto-cols-[9.5rem] grid-rows-[repeat(2,9.5rem)] gap-2 px-5 sm:auto-cols-[13rem] sm:grid-rows-[repeat(3,13rem)] sm:gap-3 sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] lg:auto-cols-[15rem] lg:grid-rows-[repeat(3,14rem)]"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: "some" }}
            >
              {imageItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={cn(
                    "group relative flex cursor-pointer items-end overflow-hidden border border-brass/20 bg-tidepool p-4 outline-none transition-colors duration-300 hover:border-brass/70 focus-visible:border-brass focus-visible:ring-2 focus-visible:ring-brass",
                    item.span,
                  )}
                  onClick={() => { if (!dragging.current) setSelected(index) }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setSelected(index)
                    }
                  }}
                  onFocus={reveal}
                  tabIndex={0}
                  role="button"
                  aria-label={`Enlarge photo from ${item.title}`}
                >
                  <img
                    {...responsive(item.url, "(min-width: 1024px) 30rem, 20rem")}
                    alt={item.desc}
                    loading="lazy"
                    draggable={false}
                    className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover transition-transform duration-700 [filter:saturate(1.08)_contrast(1.06)] group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/85 via-onyx/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <div className="relative z-10 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brass">Case study</p>
                    <h3 className="mt-1 font-serif text-xl font-semibold leading-tight text-bone">{item.title}</h3>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        <p className="mx-auto mt-5 max-w-6xl px-5 font-sans text-[10px] uppercase tracking-[0.2em] text-bone/40 sm:px-6">
          Drag to look around · Select a photo to enlarge it and open its case study
        </p>

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
