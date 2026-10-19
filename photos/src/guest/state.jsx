// Everything a gallery page shares: the gallery itself, who the guest is,
// their favorites, analytics pings, and downloads.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { get, post, put, del } from "../shared/api.js"
import { isIOS } from "../shared/format.js"

const Ctx = createContext(null)
export const useGallery = () => useContext(Ctx)

export function GalleryProvider({ gallery, slug, children }) {
  const [guest, setGuest] = useState(null)
  const [favorites, setFavorites] = useState(() => new Set())
  const [gate, setGate] = useState(null) // { pendingMediaId } while the email modal is open
  const [downloadFor, setDownloadFor] = useState(null) // { items: [media], label }
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  useEffect(() => {
    if (gallery.locked) return
    get(`/api/g/${slug}/me`)
      .then((d) => {
        setGuest(d.guest)
        setFavorites(new Set(d.favorites))
      })
      .catch(() => {})
  }, [slug, gallery.locked])

  const track = useCallback(
    (type, extra = {}) => {
      post(`/api/g/${slug}/events`, { type, ...extra }).catch(() => {})
    },
    [slug],
  )

  const notify = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const toggleFavorite = useCallback(
    async (mediaId) => {
      if (!guest) {
        setGate({ pendingMediaId: mediaId })
        return
      }
      const has = favorites.has(mediaId)
      // Optimistic.
      setFavorites((prev) => {
        const next = new Set(prev)
        has ? next.delete(mediaId) : next.add(mediaId)
        return next
      })
      try {
        const d = has ? await del(`/api/g/${slug}/favorites/${mediaId}`) : await put(`/api/g/${slug}/favorites/${mediaId}`)
        setFavorites(new Set(d.favorites))
      } catch (err) {
        if (err.body?.needEmail) {
          setGuest(null)
          setGate({ pendingMediaId: mediaId })
        }
        setFavorites((prev) => {
          const next = new Set(prev)
          has ? next.add(mediaId) : next.delete(mediaId)
          return next
        })
      }
    },
    [guest, favorites, slug],
  )

  const submitGate = useCallback(
    async ({ email, name }) => {
      const d = await post(`/api/g/${slug}/guest`, { email, name })
      setGuest(d.guest)
      const favs = new Set(d.favorites)
      const pending = gate?.pendingMediaId
      setGate(null)
      if (pending && !favs.has(pending)) {
        const r = await put(`/api/g/${slug}/favorites/${pending}`)
        setFavorites(new Set(r.favorites))
      } else setFavorites(favs)
      notify(favs.size && pending && favs.has(pending) ? "Welcome back. Your favorites are restored." : "Saved to your favorites")
    },
    [slug, gate, notify],
  )

  // One file: redirect through the API so the download is counted.
  const downloadOne = useCallback(
    (media, size) => {
      const go = (s) => {
        const a = document.createElement("a")
        a.href = `/api/g/${slug}/dl/${media.id}?size=${s}`
        a.rel = "noopener"
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
      if (size === "both") {
        if (isIOS()) return downloadZip([media.id], "both")
        go("social")
        setTimeout(() => go("full"), 900)
        return
      }
      go(size)
    },
    [slug],
  )

  const downloadZip = useCallback(
    (ids, size) => {
      window.location.assign(`/api/g/${slug}/zip?size=${size}&ids=${ids.join(",")}`)
    },
    [slug],
  )

  const downloadFavorites = useCallback(
    (size) => {
      window.location.assign(`/api/g/${slug}/favorites.zip?size=${size}`)
    },
    [slug],
  )

  const value = useMemo(
    () => ({ gallery, slug, guest, favorites, toggleFavorite, gate, setGate, submitGate, track, downloadOne, downloadZip, downloadFavorites, downloadFor, setDownloadFor, toast, notify }),
    [gallery, slug, guest, favorites, toggleFavorite, gate, submitGate, track, downloadOne, downloadZip, downloadFavorites, downloadFor, toast, notify],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
