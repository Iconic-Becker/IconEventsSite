import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Copy, Lock, EyeOff, Plus, AlertTriangle, Loader2 } from "lucide-react"
import { get, post } from "../shared/api.js"
import { Field, Sheet, Spinner } from "../shared/ui.jsx"
import { formatBytes, formatDate } from "../shared/format.js"

export function GalleriesList() {
  const [data, setData] = useState(null)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(null)
  const load = () => get("/api/admin/galleries").then(setData)
  useEffect(() => {
    load()
  }, [])
  const copy = async (g) => {
    await navigator.clipboard.writeText(g.url)
    setCopied(g.id)
    setTimeout(() => setCopied(null), 1500)
  }
  if (!data) return <div className="flex justify-center p-20"><Spinner /></div>
  const live = data.galleries.filter((g) => !g.trashedAt)
  const trashed = data.galleries.filter((g) => g.trashedAt)
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-1">Galleries</div>
          <h1 className="font-title-serif text-4xl">{live.length} {live.length === 1 ? "gallery" : "galleries"}</h1>
        </div>
        <button className="btn btn-solid" onClick={() => setCreating(true)}>
          <Plus size={14} /> New gallery
        </button>
      </div>
      {!live.length && <p className="border u-line p-10 text-center u-muted">No galleries yet. Create one, then drop a folder of photos into it.</p>}
      <div className="overflow-x-auto border u-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-[0.14em] uppercase u-muted" style={{ background: "var(--bg-2)" }}>
              <th className="px-4 py-3">Gallery</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Photos</th>
              <th className="px-4 py-3 text-right">Size</th>
              <th className="px-4 py-3 text-right">Views</th>
              <th className="px-4 py-3 text-right">Downloads</th>
              <th className="px-4 py-3 text-right">Favorites</th>
              <th className="px-4 py-3">Link</th>
            </tr>
          </thead>
          <tbody>
            {live.map((g) => (
              <tr key={g.id} className="border-t u-line hover:bg-[var(--bg-2)]">
                <td className="px-4 py-3">
                  <Link to={`/admin/galleries/${g.id}`} className="flex items-center gap-2 font-medium hover:u-accent">
                    {g.title}
                    {g.hasPassword && <Lock size={12} className="u-muted" title="Password protected" />}
                    {!g.visible && <EyeOff size={12} className="u-muted" title="Hidden" />}
                    {g.pending > 0 && <span className="flex items-center gap-1 text-xs u-muted"><Loader2 size={12} className="animate-spin" /> {g.pending} processing</span>}
                    {g.flagged > 0 && <span className="flex items-center gap-1 text-xs text-amber-700"><AlertTriangle size={12} /> {g.flagged}</span>}
                  </Link>
                </td>
                <td className="px-4 py-3 u-muted">{formatDate(g.eventDate, { month: "short" })}</td>
                <td className="px-4 py-3 text-right">{g.photos}{g.videos ? <span className="u-muted"> +{g.videos} video</span> : ""}</td>
                <td className="px-4 py-3 text-right u-muted">{formatBytes(g.bytes)}</td>
                <td className="px-4 py-3 text-right">{g.views}</td>
                <td className="px-4 py-3 text-right">{g.downloads}</td>
                <td className="px-4 py-3 text-right">{g.favorites}<span className="u-muted"> / {g.guests}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <a href={g.url} target="_blank" rel="noreferrer" className="max-w-[220px] truncate text-xs u-muted hover:u-accent">{g.url.replace(/^https?:\/\//, "")}</a>
                    <button className="icon-btn !h-8 !w-8" onClick={() => copy(g)} aria-label="Copy link" title="Copy link">
                      {copied === g.id ? <span className="text-[10px] uppercase u-accent">Copied</span> : <Copy size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {trashed.length > 0 && (
        <details className="mt-8 text-sm">
          <summary className="cursor-pointer u-muted">Trash ({trashed.length}). Items are removed from storage 30 days after deletion.</summary>
          <ul className="mt-3 space-y-2">
            {trashed.map((g) => (
              <li key={g.id} className="flex items-center justify-between border u-line px-4 py-2">
                <span>{g.title} <span className="u-muted">deleted {formatDate(g.trashedAt?.slice(0, 10), { month: "short" })}</span></span>
                <button className="btn btn-sm" onClick={() => post(`/api/admin/galleries/${g.id}/restore`).then(load)}>Restore</button>
              </li>
            ))}
          </ul>
        </details>
      )}
      <CreateSheet open={creating} onClose={() => setCreating(false)} />
    </main>
  )
}

function CreateSheet({ open, onClose }) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const { gallery } = await post("/api/admin/galleries", { title, eventDate: date || null })
      navigate(`/admin/galleries/${gallery.id}`)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Sheet open={open} onClose={onClose} title="New gallery">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Title" hint="The link is made from the title plus a random suffix, so it cannot be guessed.">
          <input className="field" autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Smith Gala" />
        </Field>
        <Field label="Event date">
          <input className="field" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <button className="btn btn-solid w-full" disabled={busy || !title.trim()}>Create</button>
      </form>
    </Sheet>
  )
}
