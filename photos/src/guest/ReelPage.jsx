import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { get } from "../shared/api.js"
import { Spinner } from "../shared/ui.jsx"
import { GalleryProvider } from "./state.jsx"
import { ReelPlayer, ReelActions } from "./Reels.jsx"
import { DownloadSheet, Toast } from "./Downloads.jsx"
import { Locked } from "./Locked.jsx"
import { formatDate } from "../shared/format.js"

export function ReelPage() {
  const { slug, reelId } = useParams()
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)
  const load = () => {
    setErr(null)
    get(`/api/g/${slug}/reel/${reelId}`)
      .then(setData)
      .catch((e) => setErr(e))
  }
  useEffect(load, [slug, reelId])
  useEffect(() => {
    if (data) document.title = `${data.reel.title || "Video"} | ${data.gallery.title}`
  }, [data])

  if (err?.status === 403) return <Locked gallery={{ slug, title: "This video is in a private gallery", settings: { theme: "dark", font: "serif" }, hasPassword: true }} onUnlocked={load} />
  if (err) return <div className="theme-dark u-bg u-fg flex min-h-svh items-center justify-center p-6 text-center">{err.message}</div>
  if (!data) return <div className="theme-dark u-bg u-fg flex min-h-svh items-center justify-center"><Spinner /></div>

  const { reel, gallery } = data
  const theme = gallery.settings?.theme || "dark"
  return (
    <GalleryProvider slug={slug} gallery={{ ...gallery, locked: gallery.locked }}>
      <main className={`theme-${theme} u-bg u-fg flex min-h-svh flex-col`} style={{ background: theme === "light" ? "radial-gradient(ellipse at 50% -20%, #fff 0%, var(--color-bone) 60%)" : "radial-gradient(ellipse at 50% 120%, #1a3a3a 0%, var(--color-onyx) 60%)" }}>
        <header className="flex items-center justify-between p-5 sm:p-8">
          <img alt="Iconic Events" className="h-5 w-auto" style={{ content: "var(--logo)" }} />
          <div className="eyebrow">{[formatDate(gallery.eventDate), gallery.title].filter(Boolean).join("  ·  ")}</div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10">
          <ReelPlayer reel={reel} className="w-full max-w-5xl shadow-2xl" maxHeight="72svh" />
          <div className="mt-6 w-full max-w-2xl text-center">
            <h1 className="font-title-serif text-3xl sm:text-4xl">{reel.title || "Video"}</h1>
            {reel.description && <p className="mt-3 text-sm leading-relaxed u-fg2">{reel.description}</p>}
            <div className="mt-5 flex justify-center">
              <ReelActions reel={reel} compact />
            </div>
          </div>
          {!gallery.locked && (
            <Link to={`/${slug}`} className="group mt-12 flex items-center gap-3 border u-line px-5 py-3 text-[11px] tracking-[0.2em] uppercase hover:border-[var(--accent)]">
              See the full gallery <ArrowRight size={14} className="u-accent transition-transform group-hover:translate-x-1" />
            </Link>
          )}
          {gallery.locked && <p className="mt-10 text-xs u-muted">The photo gallery is private. Ask the host for the password.</p>}
        </div>
        <DownloadSheet />
        <Toast />
      </main>
    </GalleryProvider>
  )
}
