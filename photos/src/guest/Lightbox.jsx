import { useMemo } from "react"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Video from "yet-another-react-lightbox/plugins/video"
import "yet-another-react-lightbox/styles.css"
import { Heart, Download, Share2 } from "lucide-react"
import { useGallery } from "./state.jsx"

export function PhotoLightbox({ media, index, onClose, onIndexChange }) {
  const { favorites, toggleFavorite, setDownloadFor, track, notify, slug } = useGallery()
  const slides = useMemo(
    () =>
      media.map((m) =>
        m.kind === "video"
          ? { type: "video", width: m.width || 1920, height: m.height || 1080, poster: m.poster, sources: [{ src: m.web, type: "video/mp4" }], playsInline: true, controls: true, preload: "metadata", id: m.id }
          : { src: m.display, width: m.width || 2048, height: m.height || 1365, alt: "", id: m.id },
      ),
    [media],
  )
  const current = media[index]
  const fav = current && favorites.has(current.id)


  const share = async () => {
    const url = `${location.origin}/${slug}${location.pathname.split("/").slice(2, 3).map((a) => "/" + a).join("")}?p=${current.id}`
    try {
      if (navigator.share) await navigator.share({ title: document.title, url })
      else {
        await navigator.clipboard.writeText(url)
        notify("Link copied")
      }
    } catch {
      /* dismissed */
    }
  }

  return (
    <Lightbox
      open={index >= 0}
      close={onClose}
      index={Math.max(0, index)}
      slides={slides}
      plugins={[Zoom, Video]}
      zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true, doubleTapDelay: 300 }}
      video={{ autoPlay: false, controls: true, playsInline: true }}
      carousel={{ finite: false, preload: 2, padding: 0, spacing: 0 }}
      controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
      noScroll={{ disabled: true }}
      animation={{ swipe: 250 }}
      on={{
        view: ({ index: i }) => {
          onIndexChange?.(i)
          const m = media[i]
          if (m) track("lightbox", { mediaId: m.id })
        },
      }}
      toolbar={{
        buttons: [
          <button key="fav" type="button" className="yarl__button" aria-label={fav ? "Remove from favorites" : "Add to favorites"} aria-pressed={fav} onClick={() => current && toggleFavorite(current.id)}>
            <Heart size={24} fill={fav ? "#B89968" : "none"} color={fav ? "#B89968" : "currentColor"} />
          </button>,
          <button key="dl" type="button" className="yarl__button" aria-label="Download" onClick={() => current && setDownloadFor({ mode: "one", items: [current], label: current.kind === "video" ? "Download video" : "Download photo" })}>
            <Download size={24} />
          </button>,
          <button key="share" type="button" className="yarl__button" aria-label="Share" onClick={share}>
            <Share2 size={24} />
          </button>,
          "close",
        ],
      }}
      styles={{ container: { backgroundColor: "#0E1312" } }}
    />
  )
}
