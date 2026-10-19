import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Link, NavLink, Route, Routes, useParams } from "react-router-dom"
import { ExternalLink, Copy, Lock, EyeOff } from "lucide-react"
import { get } from "../shared/api.js"
import { Spinner } from "../shared/ui.jsx"
import { formatDate } from "../shared/format.js"
import { PhotosTab } from "./Photos.jsx"
import { DesignTab } from "./Design.jsx"
import { ReelsTab } from "./ReelsAdmin.jsx"
import { FavoritesTab } from "./FavoritesAdmin.jsx"
import { AnalyticsTab } from "./AnalyticsAdmin.jsx"
import { SettingsTab } from "./SettingsTab.jsx"

const Ctx = createContext(null)
export const useEditor = () => useContext(Ctx)

export function GalleryEditor() {
  const { id } = useParams()
  const [gallery, setGallery] = useState(null)
  const [err, setErr] = useState(null)
  const reload = useCallback(() => get(`/api/admin/galleries/${id}`).then((d) => setGallery(d.gallery)).catch(setErr), [id])
  useEffect(() => {
    reload()
  }, [reload])

  // While anything is processing, refresh every few seconds.
  const pending = gallery?.media.some((m) => ["uploaded", "processing"].includes(m.status))
  const uploading = useRef(false)
  useEffect(() => {
    if (!pending && !uploading.current) return
    const t = setInterval(reload, 4000)
    return () => clearInterval(t)
  }, [pending, reload])

  const [copied, setCopied] = useState(false)
  if (err) return <div className="p-10 text-center">{err.message}</div>
  if (!gallery) return <div className="flex justify-center p-20"><Spinner /></div>

  const copy = async () => {
    await navigator.clipboard.writeText(gallery.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const tab = ({ isActive }) => `px-3 py-3 text-[11px] tracking-[0.16em] uppercase border-b-2 whitespace-nowrap ${isActive ? "border-[var(--accent)]" : "border-transparent u-muted hover:u-fg"}`

  return (
    <Ctx.Provider value={{ gallery, setGallery, reload, setUploading: (v) => (uploading.current = v) }}>
      <div className="border-b u-line" style={{ background: "var(--bg-2)" }}>
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Link to="/admin" className="eyebrow hover:u-fg">← Galleries</Link>
              <h1 className="font-title-serif mt-1 flex items-center gap-3 truncate text-3xl sm:text-4xl">
                {gallery.title}
                {gallery.hasPassword && <Lock size={16} className="u-muted" />}
                {!gallery.visible && <EyeOff size={16} className="u-muted" />}
              </h1>
              <div className="text-xs u-muted">{[formatDate(gallery.eventDate), gallery.location].filter(Boolean).join(" · ")}</div>
            </div>
            <div className="flex items-center gap-2">
              <code className="hidden max-w-[320px] truncate text-xs u-muted md:block">{gallery.url}</code>
              <button className="btn btn-sm" onClick={copy}>
                <Copy size={14} /> {copied ? "Copied" : "Copy link"}
              </button>
              <a className="btn btn-sm" href={gallery.url} target="_blank" rel="noreferrer">
                <ExternalLink size={14} /> Open
              </a>
            </div>
          </div>
          <nav className="no-scrollbar mt-3 flex gap-1 overflow-x-auto">
            <NavLink to="" end className={tab}>Photos</NavLink>
            <NavLink to="design" className={tab}>Design</NavLink>
            <NavLink to="reels" className={tab}>Reels</NavLink>
            <NavLink to="favorites" className={tab}>Favorites</NavLink>
            <NavLink to="analytics" className={tab}>Analytics</NavLink>
            <NavLink to="settings" className={tab}>Settings</NavLink>
          </nav>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Routes>
          <Route index element={<PhotosTab />} />
          <Route path="design" element={<DesignTab />} />
          <Route path="reels" element={<ReelsTab />} />
          <Route path="favorites" element={<FavoritesTab />} />
          <Route path="analytics" element={<AnalyticsTab />} />
          <Route path="settings" element={<SettingsTab />} />
        </Routes>
      </main>
    </Ctx.Provider>
  )
}
