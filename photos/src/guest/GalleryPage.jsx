import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useNavigate, useNavigationType, useParams, useSearchParams } from "react-router-dom"
import { Heart, Download } from "lucide-react"
import { get } from "../shared/api.js"
import { Spinner, Sheet } from "../shared/ui.jsx"
import { formatDate, plural } from "../shared/format.js"
import { GalleryProvider, useGallery } from "./state.jsx"
import { Cover } from "./Cover.jsx"
import { Grid } from "./Grid.jsx"
import { AlbumOverview, AlbumBar, AllAlbumsSheet, NextAlbumCard } from "./Albums.jsx"
import { PhotoLightbox } from "./Lightbox.jsx"
import { ReelsSection } from "./Reels.jsx"
import { DownloadSheet, Toast } from "./Downloads.jsx"
import { EmailGate } from "./Favorites.jsx"
import { Locked } from "./Locked.jsx"

export function GalleryPage() {
  const { slug, album } = useParams()
  const [gallery, setGallery] = useState(null)
  const [err, setErr] = useState(null)
  const load = useCallback(() => {
    setErr(null)
    get(`/api/g/${slug}`)
      .then(setGallery)
      .catch(setErr)
  }, [slug])
  useEffect(load, [load])
  useEffect(() => {
    if (gallery) document.title = `${gallery.title} | Iconic Events`
  }, [gallery])

  if (err) {
    return (
      <main className="theme-dark u-bg u-fg flex min-h-svh flex-col items-center justify-center p-6 text-center">
        <img src="/brand/logo-white.png" alt="Iconic Events" className="mb-8 h-6 w-auto" />
        <h1 className="font-title-serif text-3xl">{err.status === 404 ? "This gallery is not available." : "Something went wrong."}</h1>
        <p className="mt-3 max-w-sm text-sm u-fg2">{err.status === 404 ? "Check the link you were sent, or ask your host for a new one." : err.message}</p>
      </main>
    )
  }
  if (!gallery) {
    return (
      <main className="theme-dark u-bg u-fg flex min-h-svh items-center justify-center">
        <Spinner />
      </main>
    )
  }
  if (gallery.locked) return <Locked gallery={gallery} onUnlocked={load} />
  return (
    <GalleryProvider gallery={gallery} slug={slug}>
      <GalleryView albumSlug={album} />
    </GalleryProvider>
  )
}

// Scroll positions by history entry, so Back lands where the guest was.
const positions = new Map()

function GalleryView({ albumSlug }) {
  const { gallery, slug, favorites, toggleFavorite, track, setDownloadFor, guest } = useGallery()
  const navigate = useNavigate()
  const location = useLocation()
  const navType = useNavigationType()
  const [params, setParams] = useSearchParams()
  const albums = gallery.albums
  const overview = !albumSlug
  const favoritesView = albumSlug === "favorites"
  const [cache, setCache] = useState({})
  const [sheet, setSheet] = useState(null) // 'albums' | 'download'
  const theme = gallery.settings.theme

  const current = favoritesView ? { id: "favorites", slug: "favorites", name: "My favorites" } : albums.find((a) => a.slug === albumSlug) || (overview ? albums[0] : null)

  useEffect(() => {
    if (!overview && !favoritesView && !current) navigate(`/${slug}`, { replace: true })
  }, [overview, favoritesView, current, navigate, slug])

  useEffect(() => {
    track("view")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load album media on demand; favorites needs every album.
  const need = favoritesView ? albums.map((a) => a.slug).filter((s) => s !== "highlights") : current ? [current.slug] : []
  useEffect(() => {
    for (const s of need) {
      if (cache[s]) continue
      setCache((c) => ({ ...c, [s]: { loading: true } }))
      get(`/api/g/${slug}/albums/${s}`)
        .then((d) => setCache((c) => ({ ...c, [s]: { media: d.media } })))
        .catch(() => setCache((c) => ({ ...c, [s]: { media: [] } })))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [need.join("|"), slug])

  const media = useMemo(() => {
    if (favoritesView) {
      const all = []
      const seen = new Set()
      for (const s of need) for (const m of cache[s]?.media || []) if (!seen.has(m.id) && favorites.has(m.id)) {
        seen.add(m.id)
        all.push(m)
      }
      return all
    }
    return current ? cache[current.slug]?.media || [] : []
  }, [favoritesView, current, cache, favorites, need])
  const loading = favoritesView ? need.some((s) => !cache[s] || cache[s].loading) : current && (!cache[current.slug] || cache[current.slug].loading)

  // Lightbox state lives in the URL (?p=id) so Back closes it.
  const openId = Number(params.get("p")) || null
  const openIndex = openId ? media.findIndex((m) => m.id === openId) : -1
  // The scroll position is captured at the tap, before the lightbox mounts
  // and the browser moves the page, so closing lands exactly where the
  // guest was.
  const lockY = useRef(0)
  const openMedia = useCallback(
    (m) => {
      lockY.current = window.scrollY
      const next = new URLSearchParams(params)
      next.set("p", String(m.id))
      setParams(next)
    },
    [params, setParams],
  )
  const closeLightbox = useCallback(() => {
    if (params.has("p")) navigate(-1)
  }, [params, navigate])
  const changeIndex = useCallback(
    (i) => {
      const m = media[i]
      if (!m || m.id === openId) return
      const next = new URLSearchParams(params)
      next.set("p", String(m.id))
      setParams(next, { replace: true })
    },
    [media, openId, params, setParams],
  )

  const lightboxOpen = openIndex >= 0
  useEffect(() => {
    if (!lightboxOpen) return
    const y = lockY.current
    const body = document.body
    const prev = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow }
    body.style.position = "fixed"
    body.style.top = `-${y}px`
    body.style.width = "100%"
    body.style.overflow = "hidden"
    return () => {
      Object.assign(body.style, prev)
      window.scrollTo(0, y)
    }
  }, [lightboxOpen])

  // Scroll: new album pages start at the top; Back restores.
  const contentRef = useRef()
  useEffect(() => {
    const save = () => positions.set(location.key, window.scrollY)
    window.addEventListener("scroll", save, { passive: true })
    return () => window.removeEventListener("scroll", save)
  }, [location.key])
  const restored = useRef(null)
  useEffect(() => {
    if (restored.current === location.key) return
    if (openId) return
    if (navType === "POP" && positions.has(location.key)) {
      if (loading) return
      window.scrollTo(0, positions.get(location.key))
    } else if (!overview) window.scrollTo(0, 0)
    restored.current = location.key
  }, [location.key, navType, loading, overview, openId])

  const enter = () => contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  const idx = current ? albums.findIndex((a) => a.slug === current.slug) : -1
  const next = idx >= 0 && idx < albums.length - 1 ? albums[idx + 1] : null

  const bar = (
    <AlbumBar
      gallery={gallery}
      albums={albums}
      current={current}
      favoritesCount={favorites.size}
      favoritesOn={favoritesView}
      onToggleFavorites={() => navigate(favoritesView ? `/${slug}` : `/${slug}/favorites`)}
      onDownloadAll={() => setSheet("download")}
      onAllAlbums={() => setSheet("albums")}
    />
  )

  const gridSection = (
    <section className="mx-auto max-w-[1600px] px-2 pt-4 pb-6 sm:px-4" aria-label={current?.name}>
      {!overview && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3 px-2">
          <div>
            <div className="eyebrow mb-1">{favoritesView ? (guest?.name ? guest.name : "Your picks") : current?.isHighlights ? "Starred by the host" : "Album"}</div>
            <h2 className="font-title-serif text-3xl sm:text-4xl">{current?.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            {favoritesView && media.length > 0 && (
              <button className="btn btn-sm" onClick={() => setDownloadFor({ mode: "favorites", items: media, label: "Download my favorites" })}>
                <Download size={14} /> Download favorites
              </button>
            )}
            {!favoritesView && current && current.slug !== "highlights" && (
              <button className="btn btn-sm" onClick={() => setDownloadFor({ mode: "album", albumId: current.id, items: media, label: `Download ${current.name}` })}>
                <Download size={14} /> Download album
              </button>
            )}
            <span className="text-xs u-muted">{plural(media.length, "item")}</span>
          </div>
        </div>
      )}
      {overview && current && albums.length > 1 && (
        <div className="mb-4 flex items-end justify-between gap-3 px-2">
          <h2 className="font-title-serif text-3xl sm:text-4xl">{current.name}</h2>
          <span className="text-xs u-muted">{plural(media.length, "item")}</span>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : media.length ? (
        <Grid media={media} layout={gallery.settings.grid} density={gallery.settings.density} onOpen={openMedia} favorites={favorites} onFavorite={toggleFavorite} />
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <Heart className="u-muted mb-4" />
          <p className="u-fg2">{favoritesView ? "No favorites yet. Tap the heart on any photo to keep it here." : "Nothing here yet."}</p>
          {favoritesView && (
            <Link to={`/${slug}`} className="btn mt-6">
              Browse the gallery
            </Link>
          )}
        </div>
      )}
    </section>
  )

  return (
    <main className={`theme-${theme} u-bg u-fg min-h-svh`}>
      {overview ? (
        <>
          <Cover gallery={gallery} onEnter={enter} style={{ height: "min(100svh, 1100px)", minHeight: 560 }} />
          <ReelsSection gallery={gallery} />
          <AlbumOverview gallery={gallery} albums={albums} />
          <div ref={contentRef} style={{ scrollMarginTop: 0 }}>
            {bar}
            {gridSection}
            {!loading && media.length > 0 && <NextAlbumCard gallery={gallery} next={next} />}
          </div>
        </>
      ) : (
        <>
          <header className="mx-auto flex max-w-[1600px] items-end justify-between gap-4 px-4 pt-6 pb-4 sm:px-6">
            <Link to={`/${slug}`} className="min-w-0">
              <div className="eyebrow mb-1">{[formatDate(gallery.eventDate), gallery.location].filter(Boolean).join("  ·  ") || "Gallery"}</div>
              <div className="font-title-serif truncate text-2xl sm:text-3xl">{gallery.title}</div>
            </Link>
            {gallery.clientLogo ? <img src={gallery.clientLogo} alt="" className="h-7 w-auto max-w-[120px] object-contain" /> : <img alt="Iconic Events" className="h-6 w-auto opacity-90" style={{ content: "var(--logo)" }} />}
          </header>
          <div ref={contentRef}>
            {bar}
            {gridSection}
            {!loading && !favoritesView && media.length > 0 && <NextAlbumCard gallery={gallery} next={next} />}
          </div>
        </>
      )}

      <footer className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 border-t u-line px-4 py-8 text-xs u-muted sm:px-6">
        <div className="flex items-center gap-3">
          <img alt="" className="h-5 w-auto opacity-80" style={{ content: "var(--logo)" }} />
          <span>Photography by Iconic Events</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://iconic.events" className="hover:u-accent">iconic.events</a>
          <a href="https://iconic.events/privacy" className="hover:u-accent">Privacy</a>
        </div>
      </footer>

      {openIndex >= 0 && <PhotoLightbox media={media} index={openIndex} onClose={closeLightbox} onIndexChange={changeIndex} />}
      <AllAlbumsSheet open={sheet === "albums"} onClose={() => setSheet(null)} gallery={gallery} albums={albums} current={current} />
      <Sheet open={sheet === "download"} onClose={() => setSheet(null)} title="Download">
        <div className="space-y-2">
          {current && !favoritesView && current.slug !== "highlights" && (
            <button className="btn w-full justify-between" onClick={() => { setSheet(null); setDownloadFor({ mode: "album", albumId: current.id, items: media, label: `Download ${current.name}` }) }}>
              <span>This album</span>
              <span className="u-muted normal-case tracking-normal">{current.name}</span>
            </button>
          )}
          <button className="btn w-full justify-between" onClick={() => { setSheet(null); setDownloadFor({ mode: "gallery", items: [], label: "Download the whole gallery" }) }}>
            <span>Whole gallery</span>
            <span className="u-muted normal-case tracking-normal">{plural(gallery.counts.photos, "photo")}</span>
          </button>
          <button className="btn w-full justify-between" disabled={!favorites.size} onClick={() => { setSheet(null); setDownloadFor({ mode: "favorites", items: [], label: "Download my favorites" }) }}>
            <span>My favorites</span>
            <span className="u-muted normal-case tracking-normal">{favorites.size ? plural(favorites.size, "item") : "none yet"}</span>
          </button>
        </div>
      </Sheet>
      <DownloadSheet />
      <EmailGate />
      <Toast />
    </main>
  )
}
