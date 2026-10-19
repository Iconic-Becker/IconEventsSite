// The five cover layouts. Responsive by container width, not viewport, so
// the admin's live preview shows exactly what a phone or desktop will.
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { formatDate, reducedMotion, plural } from "../shared/format.js"

const titleClass = (font) => (font === "display" ? "font-title-display" : "font-title-serif")

function focalStyle(focal) {
  const x = Math.round((focal?.x ?? 0.5) * 100)
  const y = Math.round((focal?.y ?? 0.5) * 100)
  return { objectPosition: `${x}% ${y}%` }
}

export function CoverLogos({ gallery, center, className = "" }) {
  const light = gallery.settings.theme !== "light"
  return (
    <div className={`flex items-center gap-5 ${center ? "justify-center" : "justify-between"} ${className}`}>
      <img src={light ? "/brand/logo-white.png" : "/brand/logo-black.png"} alt="Iconic Events" className="h-8 @3xl:h-11 w-auto opacity-95" />
      {gallery.clientLogo && (
        <>
          {center && <span className="h-6 w-px" style={{ background: "var(--line)" }} />}
          <img src={gallery.clientLogo} alt="" className="h-8 @3xl:h-11 w-auto max-w-[40%] object-contain opacity-90" />
        </>
      )}
    </div>
  )
}

function Meta({ gallery, className = "" }) {
  const bits = [formatDate(gallery.eventDate), gallery.location].filter(Boolean)
  if (!bits.length) return null
  return <div className={`eyebrow ${className}`}>{bits.join("  ·  ")}</div>
}

function Counts({ gallery }) {
  const c = gallery.counts || {}
  const bits = []
  if (c.photos) bits.push(plural(c.photos, "photo"))
  if (c.videos) bits.push(plural(c.videos, "video"))
  if (!bits.length) return null
  return <span>{bits.join(" · ")}</span>
}

function Text({ gallery, onEnter, align = "left", big }) {
  const { settings } = gallery
  const sizes = big ? "text-[2.6rem] leading-[1] @md:text-6xl @3xl:text-7xl @5xl:text-8xl" : "text-[2.4rem] leading-[1] @md:text-5xl @3xl:text-6xl @5xl:text-7xl"
  return (
    <div className={`cover-text max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Meta gallery={gallery} className="mb-4" />
      <h1 className={`${titleClass(settings.font)} ${sizes} text-balance`}>{gallery.title}</h1>
      {gallery.subtitle && <p className={`serif mt-3 text-xl italic @3xl:text-2xl`} style={{ color: "var(--fg-2)" }}>{gallery.subtitle}</p>}
      {gallery.intro && <p className={`mt-5 max-w-xl text-sm leading-relaxed @3xl:text-base ${align === "center" ? "mx-auto" : ""}`} style={{ color: "var(--fg-2)" }}>{gallery.intro}</p>}
      {onEnter && (
        <div className={`mt-7 flex flex-col gap-2 ${align === "center" ? "items-center" : "items-start"}`}>
          <button onClick={onEnter} className="inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase" style={{ color: "var(--fg)" }}>
            <span className="border-b pb-1" style={{ borderColor: "var(--accent)" }}>
              View the photos
            </span>
            <ChevronDown size={14} className="motion-safe:animate-bounce" />
          </button>
          <span className="text-xs u-muted"><Counts gallery={gallery} /></span>
        </div>
      )}
    </div>
  )
}

function Scrim({ strong }) {
  return <div className="pointer-events-none absolute inset-0" style={{ background: strong ? "linear-gradient(to top, rgba(14,19,18,.92) 0%, rgba(14,19,18,.55) 45%, rgba(14,19,18,.15) 100%)" : "linear-gradient(to top, rgba(14,19,18,.88) 0%, rgba(14,19,18,.35) 50%, rgba(14,19,18,.25) 100%)" }} />
}

function CoverImage({ media, focal, className = "", sizesHint }) {
  if (!media) return <div className={`cover-media absolute inset-0 ${className}`} style={{ background: "linear-gradient(135deg, var(--color-tidepool), var(--color-onyx))" }} />
  const src = media.display || media.poster || media.thumb
  return <img src={src} alt="" className={`cover-media absolute inset-0 h-full w-full object-cover ${className}`} style={focalStyle(focal)} fetchPriority="high" decoding="async" />
}

// Light text over imagery regardless of theme: the scrim is always dark.
const overImage = { "--fg": "#F4F0E8", "--fg-2": "#d9d2c2", "--fg-muted": "#b7b2a6", "--accent": "#B89968", "--line": "rgba(244,240,232,.25)" }

const alignOf = (gallery) => (gallery.settings.align === "left" ? "left" : "center")

function FullBleed({ gallery, onEnter }) {
  const align = alignOf(gallery)
  return (
    <div className="relative h-full w-full overflow-hidden" style={overImage}>
      <CoverImage media={gallery.cover} focal={gallery.settings.focal} />
      <Scrim />
      <div className="absolute inset-x-0 top-0 p-5 @3xl:p-8">
        <CoverLogos gallery={{ ...gallery, settings: { ...gallery.settings, theme: "dark" } }} center={align === "center"} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 pb-8 @3xl:p-12 @3xl:pb-14">
        <Text gallery={gallery} onEnter={onEnter} big align={align} />
      </div>
    </div>
  )
}

function Video({ gallery, onEnter }) {
  const reel = gallery.coverVideo
  const ref = useRef()
  const [playing, setPlaying] = useState(false)
  const clip = reel?.clip
  const poster = reel?.media?.poster || gallery.cover?.display
  useEffect(() => {
    if (!clip || reducedMotion()) return
    const v = ref.current
    if (!v) return
    const onPlay = () => setPlaying(true)
    v.addEventListener("playing", onPlay)
    v.play().catch(() => {})
    return () => v.removeEventListener("playing", onPlay)
  }, [clip])
  return (
    <div className="relative h-full w-full overflow-hidden" style={overImage}>
      {poster && <img src={poster} alt="" className="cover-media absolute inset-0 h-full w-full object-cover" style={focalStyle(gallery.settings.focal)} />}
      {clip && !reducedMotion() && (
        <video ref={ref} src={clip} muted loop playsInline autoPlay preload="auto" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`} style={focalStyle(gallery.settings.focal)} aria-hidden="true" />
      )}
      <Scrim />
      <div className="absolute inset-x-0 top-0 p-5 @3xl:p-8">
        <CoverLogos gallery={{ ...gallery, settings: { ...gallery.settings, theme: "dark" } }} center={alignOf(gallery) === "center"} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 pb-8 @3xl:p-12 @3xl:pb-14">
        <Text gallery={gallery} onEnter={onEnter} big align={alignOf(gallery)} />
      </div>
    </div>
  )
}

function Split({ gallery, onEnter }) {
  return (
    <div className="grid h-full w-full grid-rows-[52%_48%] @3xl:grid-cols-2 @3xl:grid-rows-1">
      <div className="relative overflow-hidden @3xl:order-1">
        <CoverImage media={gallery.cover} focal={gallery.settings.focal} />
      </div>
      <div className="u-bg2 relative flex flex-col justify-between p-5 @3xl:p-12">
        <CoverLogos gallery={gallery} center={alignOf(gallery) === "center"} />
        <div className="py-6 @3xl:py-10">
          <Text gallery={gallery} onEnter={onEnter} align={alignOf(gallery)} />
        </div>
        <div className="rule" />
      </div>
    </div>
  )
}

function Mosaic({ gallery, onEnter }) {
  const pics = (gallery.mosaic?.length ? gallery.mosaic : [gallery.cover].filter(Boolean)).slice(0, 5)
  while (pics.length && pics.length < 3) pics.push(pics[pics.length - 1])
  const areas = {
    3: ["a", "b", "c"],
    4: ["a", "b", "c", "d"],
    5: ["a", "b", "c", "d", "e"],
  }[pics.length] || ["a"]
  const template =
    pics.length >= 5
      ? '"a a b c" "a a d e"'
      : pics.length === 4
        ? '"a a b b" "a a c d"'
        : pics.length === 3
          ? '"a a b b" "a a c c"'
          : '"a"'
  const mobile = pics.length >= 4 ? '"a a" "b c" "d e"' : pics.length === 3 ? '"a a" "b c"' : '"a"'
  return (
    <div className="relative h-full w-full overflow-hidden" style={overImage}>
      <div className="mosaic absolute inset-0 grid gap-1 p-1" style={{ gridTemplateAreas: mobile, gridTemplateColumns: "repeat(2, 1fr)", gridAutoRows: "1fr" }}>
        {pics.map((m, i) => (
          <div key={i} className="relative overflow-hidden" style={{ gridArea: areas[i] || "auto" }}>
            <img src={m.display || m.thumb} alt="" className="cover-media absolute inset-0 h-full w-full object-cover" style={i === 0 ? focalStyle(gallery.settings.focal) : undefined} decoding="async" />
          </div>
        ))}
      </div>
      <style>{`@container (min-width: 48rem) { .mosaic { grid-template-areas: ${template} !important; grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
      <Scrim strong />
      <div className="absolute inset-x-0 top-0 p-5 @3xl:p-8">
        <CoverLogos gallery={{ ...gallery, settings: { ...gallery.settings, theme: "dark" } }} center={alignOf(gallery) === "center"} />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 pb-8 @3xl:p-12 @3xl:pb-14">
        <Text gallery={gallery} onEnter={onEnter} align={alignOf(gallery)} />
      </div>
    </div>
  )
}

function TitleCard({ gallery, onEnter }) {
  const dark = gallery.settings.theme !== "light"
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden p-6 text-center @3xl:p-12" style={{ background: dark ? "radial-gradient(ellipse at 50% 120%, #1a3a3a 0%, var(--color-onyx) 60%)" : "radial-gradient(ellipse at 50% -20%, #fff 0%, var(--color-bone) 60%)" }}>
      <div className="absolute inset-x-0 top-0 p-5 @3xl:p-8">
        <CoverLogos gallery={gallery} center />
      </div>
      <div className="cover-media mb-8 h-px w-24" style={{ background: "var(--accent)" }} />
      <Text gallery={gallery} onEnter={onEnter} align="center" big />
      <div className="cover-media mt-10 h-px w-24" style={{ background: "var(--accent)" }} />
    </div>
  )
}

const LAYOUTS = { "full-bleed": FullBleed, split: Split, video: Video, mosaic: Mosaic, "title-card": TitleCard }

export function Cover({ gallery, onEnter, style, className = "" }) {
  const s = gallery.settings
  let layout = s.layout
  // Fall back gracefully when a layout's inputs are missing.
  if (layout === "video" && !gallery.coverVideo) layout = gallery.cover ? "full-bleed" : "title-card"
  if (layout === "mosaic" && !gallery.mosaic?.length && !gallery.cover) layout = "title-card"
  if ((layout === "full-bleed" || layout === "split") && !gallery.cover) layout = "title-card"
  const Layout = LAYOUTS[layout] || FullBleed
  return (
    <section className={`cover theme-${s.theme} u-bg u-fg anim-${s.animation} relative w-full @container ${className}`} style={{ containerType: "inline-size", ...style }} data-layout={layout}>
      <Layout gallery={gallery} onEnter={onEnter} />
    </section>
  )
}
