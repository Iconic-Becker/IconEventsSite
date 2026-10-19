// Featured reels and trailers: a large player under the cover, a share
// page per video, native share on phones.
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Play, Share2, Download, Link as LinkIcon, Film } from "lucide-react"
import { useGallery } from "./state.jsx"
import { formatDuration } from "../shared/format.js"

export function useReelShare(reel) {
  const { slug, track, notify } = useGallery()
  const url = `${location.origin}/${slug}/reel/${reel.id}`
  const canShareFile = typeof navigator !== "undefined" && navigator.canShare && reel.webSize && reel.webSize < 60 * 1024 * 1024 && navigator.canShare({ files: [new File([""], "x.mp4", { type: "video/mp4" })] })
  const shareLink = async () => {
    track("reel_share", { reelId: reel.id })
    try {
      if (navigator.share) await navigator.share({ title: reel.title || document.title, text: reel.description || undefined, url })
      else {
        await navigator.clipboard.writeText(url)
        notify("Link copied")
      }
    } catch {
      /* dismissed */
    }
  }
  const [sharingFile, setSharingFile] = useState(false)
  const shareFile = async () => {
    setSharingFile(true)
    try {
      const res = await fetch(reel.media.web)
      const blob = await res.blob()
      const file = new File([blob], `${(reel.title || "video").replace(/[^\w-]+/g, "_")}.mp4`, { type: "video/mp4" })
      track("reel_share", { reelId: reel.id })
      await navigator.share({ files: [file], title: reel.title || document.title })
    } catch {
      /* dismissed or unsupported */
    } finally {
      setSharingFile(false)
    }
  }
  return { url, shareLink, shareFile, canShareFile, sharingFile, hasNativeShare: typeof navigator !== "undefined" && Boolean(navigator.share) }
}

export function ReelPlayer({ reel, autoPlay, className = "", maxHeight = "78svh" }) {
  const { track } = useGallery()
  const m = reel.media
  const [started, setStarted] = useState(Boolean(autoPlay))
  const completed = useRef(false)
  const ref = useRef()
  const portrait = m.width && m.height && m.height > m.width
  useEffect(() => {
    if (started && ref.current) ref.current.play().catch(() => {})
  }, [started])
  const onPlay = () => {
    if (!onPlay.counted) {
      onPlay.counted = true
      track("reel_play", { reelId: reel.id })
    }
  }
  const onTime = (e) => {
    const v = e.currentTarget
    if (!completed.current && v.duration && v.currentTime / v.duration >= 0.9) {
      completed.current = true
      track("reel_complete", { reelId: reel.id })
    }
  }
  return (
    <div className={`relative mx-auto overflow-hidden bg-black ${className}`} style={{ aspectRatio: `${m.width || 16} / ${m.height || 9}`, maxHeight, width: portrait ? "auto" : "100%", maxWidth: "100%" }}>
      {started ? (
        <video ref={ref} src={m.web} poster={m.poster} controls playsInline preload="metadata" className="absolute inset-0 h-full w-full" onPlay={onPlay} onTimeUpdate={onTime} />
      ) : (
        <button type="button" onClick={() => setStarted(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play ${reel.title || "video"}`}>
          {m.poster && <img src={m.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
          <span className="absolute top-1/2 left-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/70 bg-black/40 text-white backdrop-blur-sm transition-transform group-hover:scale-105">
            <Play size={30} fill="currentColor" className="ml-1" />
          </span>
          {m.duration && <span className="absolute right-3 bottom-3 bg-black/60 px-2 py-1 text-xs text-white">{formatDuration(m.duration)}</span>}
        </button>
      )}
    </div>
  )
}

export function ReelActions({ reel, compact }) {
  const { setDownloadFor } = useGallery()
  const { url, shareLink, shareFile, canShareFile, sharingFile, hasNativeShare } = useReelShare(reel)
  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "" : "mt-4"}`}>
      <button className="btn btn-sm" onClick={shareLink}>
        {hasNativeShare ? <Share2 size={14} /> : <LinkIcon size={14} />}
        {hasNativeShare ? "Share" : "Copy link"}
      </button>
      {canShareFile && (
        <button className="btn btn-sm" onClick={shareFile} disabled={sharingFile}>
          <Film size={14} />
          {sharingFile ? "Preparing" : "Share video file"}
        </button>
      )}
      <button className="btn btn-sm" onClick={() => setDownloadFor({ mode: "one", items: [reel.media], label: "Download video" })}>
        <Download size={14} />
        Download
      </button>
      {!compact && (
        <Link to={new URL(url).pathname} className="btn btn-sm">
          Open share page
        </Link>
      )}
    </div>
  )
}

export function ReelsSection({ gallery }) {
  const reels = gallery.reels || []
  if (!reels.length) return null
  const [first, ...rest] = reels
  return (
    <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14" id="reels">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">{reels.length > 1 ? "Featured videos" : "Featured video"}</div>
          <h2 className="font-title-serif text-3xl sm:text-4xl">{first.title || "Watch"}</h2>
        </div>
      </div>
      <ReelPlayer reel={first} />
      {first.description && <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed u-fg2">{first.description}</p>}
      <div className="flex justify-center">
        <ReelActions reel={first} />
      </div>
      {rest.length > 0 && (
        <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2">
          {rest.map((r) => (
            <div key={r.id} className="w-[78vw] shrink-0 sm:w-[360px]">
              <ReelPlayer reel={r} maxHeight="60svh" />
              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.title}</div>
                  {r.description && <div className="line-clamp-2 text-xs u-muted">{r.description}</div>}
                </div>
              </div>
              <ReelActions reel={r} compact />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
