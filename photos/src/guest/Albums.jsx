import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, LayoutGrid, Heart, Download, Search, ArrowRight, Images } from "lucide-react"
import { Sheet } from "../shared/ui.jsx"
import { plural } from "../shared/format.js"

// Below the cover: one tile per album. The main way in when there are many.
export function AlbumOverview({ gallery, albums }) {
  if (albums.length < 2) return null
  const many = albums.length > 6
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14" id="albums">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">Albums</div>
          <h2 className="font-title-serif text-3xl sm:text-4xl">{plural(albums.length, "album")}</h2>
        </div>
        <div className="text-sm u-muted">{plural(gallery.counts.photos, "photo")}{gallery.counts.videos ? ` · ${plural(gallery.counts.videos, "video")}` : ""}</div>
      </div>
      <div className={`grid gap-3 sm:gap-4 ${many ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-2 lg:grid-cols-3"}`}>
        {albums.map((a) => (
          <Link key={a.slug} to={`/${gallery.slug}/${a.slug}`} className="group relative block overflow-hidden" style={{ aspectRatio: many ? "1 / 1" : "4 / 3", background: "var(--bg-3)" }}>
            {a.cover ? (
              <img
                src={a.cover}
                srcSet={a.coverLarge ? `${a.cover} 600w, ${a.coverLarge} 2048w` : undefined}
                sizes={many ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" : "(max-width: 1024px) 50vw, 33vw"}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center u-muted"><Images /></div>
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(14,19,18,.85) 0%, rgba(14,19,18,.1) 55%)" }} />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4" style={{ color: "#F4F0E8" }}>
              <div className={`font-title-serif ${many ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"} leading-tight`}>{a.name}</div>
              <div className="mt-1 text-[11px] tracking-[0.18em] uppercase opacity-80">{plural(a.count, a.isHighlights ? "pick" : "photo")}</div>
            </div>
            {a.isHighlights && <div className="absolute top-3 left-3 bg-[#B89968] px-2 py-1 text-[10px] tracking-[0.2em] uppercase text-[#0E1312]">Highlights</div>}
          </Link>
        ))}
      </div>
    </section>
  )
}

// Pinned while browsing: scrollable chips, arrows on desktop, "All albums".
export function AlbumBar({ gallery, albums, current, favoritesCount, favoritesOn, onToggleFavorites, onDownloadAll, onAllAlbums }) {
  const scroller = useRef()
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const update = () => {
    const el = scroller.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }
  useEffect(() => {
    update()
    const el = scroller.current
    el?.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      el?.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [albums])

  // Keep the current album chip in view. Horizontal only: scrollIntoView
  // would also pull the page down to the bar.
  useEffect(() => {
    const sc = scroller.current
    const el = sc?.querySelector('[aria-current="page"]')
    if (!sc || !el) return
    const left = el.offsetLeft - sc.clientWidth / 2 + el.offsetWidth / 2
    sc.scrollTo({ left: Math.max(0, left), behavior: "smooth" })
  }, [current])

  const scrollBy = (dx) => scroller.current?.scrollBy({ left: dx, behavior: "smooth" })

  return (
    <div className="sticky top-0 z-40 border-b u-line backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 88%, transparent)", paddingTop: "env(safe-area-inset-top)" }}>
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-1 px-2 sm:px-4">
        {/* On phones the header above already carries the title, so the
            chips get the full width. */}
        <Link to={`/${gallery.slug}`} className="hidden shrink-0 items-center pr-3 pl-1 sm:flex" aria-label="Gallery overview">
          <span className="font-title-serif max-w-[220px] truncate text-lg">{gallery.title}</span>
        </Link>
        {canLeft && (
          <button className="icon-btn hidden shrink-0 sm:inline-flex" onClick={() => scrollBy(-320)} aria-label="Scroll albums left">
            <ChevronLeft size={18} />
          </button>
        )}
        <div ref={scroller} className="no-scrollbar relative flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scroll-smooth" style={{ scrollSnapType: "x proximity" }}>
          {albums.map((a) => {
            const active = current?.slug === a.slug && !favoritesOn
            return (
              <Link
                key={a.slug}
                to={`/${gallery.slug}/${a.slug}`}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 whitespace-nowrap border px-3 py-2 text-[11px] tracking-[0.14em] uppercase transition-colors ${active ? "border-[var(--accent)] bg-[var(--accent)] text-[#0E1312]" : "border-transparent hover:border-[var(--line)]"}`}
                style={{ scrollSnapAlign: "center" }}
              >
                {a.name}
                <span className={`ml-1.5 ${active ? "opacity-70" : "u-muted"}`}>{a.count}</span>
              </Link>
            )
          })}
        </div>
        {canRight && (
          <button className="icon-btn hidden shrink-0 sm:inline-flex" onClick={() => scrollBy(320)} aria-label="Scroll albums right">
            <ChevronRight size={18} />
          </button>
        )}
        {albums.length > 1 && (
          <button className="icon-btn shrink-0" onClick={onAllAlbums} aria-label="All albums" title="All albums">
            <LayoutGrid size={18} />
          </button>
        )}
        <button className={`icon-btn relative shrink-0 ${favoritesOn ? "u-accent" : ""}`} onClick={onToggleFavorites} aria-label="My favorites" aria-pressed={favoritesOn} title="My favorites">
          <Heart size={18} fill={favoritesOn ? "currentColor" : "none"} />
          {favoritesCount > 0 && <span className="absolute top-1.5 right-1 min-w-[16px] px-1 text-center text-[10px] leading-4 text-[#0E1312]" style={{ background: "var(--accent)" }}>{favoritesCount}</span>}
        </button>
        <button className="icon-btn shrink-0" onClick={onDownloadAll} aria-label="Download" title="Download">
          <Download size={18} />
        </button>
      </div>
    </div>
  )
}

export function AllAlbumsSheet({ open, onClose, gallery, albums, current }) {
  const [q, setQ] = useState("")
  useEffect(() => {
    if (!open) setQ("")
  }, [open])
  const list = useMemo(() => albums.filter((a) => a.name.toLowerCase().includes(q.trim().toLowerCase())), [albums, q])
  return (
    <Sheet open={open} onClose={onClose} title={plural(albums.length, "album")}>
      {albums.length > 8 && (
        <div className="relative mb-4">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 u-muted" />
          <input autoFocus className="field pl-9" placeholder="Find an album" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find an album" />
        </div>
      )}
      <ul className="-mx-2 max-h-[60svh] overflow-y-auto">
        {list.map((a) => (
          <li key={a.slug}>
            <Link to={`/${gallery.slug}/${a.slug}`} onClick={onClose} className={`flex items-center gap-3 px-2 py-2 hover:bg-[var(--bg-3)] ${current?.slug === a.slug ? "bg-[var(--bg-3)]" : ""}`}>
              <div className="h-12 w-16 shrink-0 overflow-hidden" style={{ background: "var(--bg-3)" }}>
                {a.cover && <img src={a.cover} alt="" className="h-full w-full object-cover" loading="lazy" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate">{a.name}</div>
                <div className="text-xs u-muted">{plural(a.count, "photo")}</div>
              </div>
              {current?.slug === a.slug && <span className="eyebrow">Viewing</span>}
            </Link>
          </li>
        ))}
        {!list.length && <li className="px-2 py-6 text-center text-sm u-muted">No album matches.</li>}
      </ul>
    </Sheet>
  )
}

export function NextAlbumCard({ gallery, next }) {
  if (!next) {
    return (
      <Link to={`/${gallery.slug}`} className="group mx-auto my-12 flex max-w-xl items-center justify-between gap-6 border u-line p-5 hover:border-[var(--accent)]">
        <div>
          <div className="eyebrow mb-1">End of the gallery</div>
          <div className="font-title-serif text-2xl">Back to the start</div>
        </div>
        <ArrowRight className="u-accent transition-transform group-hover:translate-x-1" />
      </Link>
    )
  }
  return (
    <Link to={`/${gallery.slug}/${next.slug}`} className="group relative mx-auto my-12 block max-w-3xl overflow-hidden" style={{ aspectRatio: "21 / 9", background: "var(--bg-3)" }}>
      {next.cover && <img src={next.cover} srcSet={next.coverLarge ? `${next.cover} 600w, ${next.coverLarge} 2048w` : undefined} sizes="(max-width: 800px) 100vw, 768px" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(14,19,18,.9) 20%, rgba(14,19,18,.3) 100%)" }} />
      <div className="absolute inset-0 flex items-center justify-between p-6 sm:p-10" style={{ color: "#F4F0E8" }}>
        <div>
          <div className="eyebrow mb-2">Next album</div>
          <div className="font-title-serif text-3xl sm:text-5xl">{next.name}</div>
          <div className="mt-2 text-xs tracking-[0.18em] uppercase opacity-80">{plural(next.count, "photo")}</div>
        </div>
        <ArrowRight size={32} className="shrink-0 text-[#B89968] transition-transform group-hover:translate-x-2" />
      </div>
    </Link>
  )
}
