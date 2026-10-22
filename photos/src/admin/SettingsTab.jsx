import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, Trash2, RefreshCw } from "lucide-react"
import { patch, del, get, post } from "../shared/api.js"
import { Field, Notice } from "../shared/ui.jsx"
import { useEditor } from "./GalleryEditor.jsx"
import { useCanDelete } from "./AdminApp.jsx"

export function SettingsTab() {
  const { gallery, setGallery } = useEditor()
  const [pw, setPw] = useState("")
  const [title, setTitle] = useState(gallery.title)
  const [slug, setSlug] = useState(gallery.slug)
  const [slugErr, setSlugErr] = useState(null)
  const host = (gallery.url || "").replace(/^https?:\/\//, "").replace(/\/[^/]*$/, "")
  const [eventDate, setEventDate] = useState(gallery.eventDate || "")
  const [msg, setMsg] = useState(null)
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()
  const canDelete = useCanDelete()
  useEffect(() => {
    get("/api/admin/jobs").then((d) => setJobs(d.jobs.filter((j) => j.status === "failed")))
  }, [])
  const save = async (body, note) => {
    const { gallery: g } = await patch(`/api/admin/galleries/${gallery.id}`, body)
    setGallery(g)
    setMsg(note)
    setTimeout(() => setMsg(null), 2000)
  }
  const flagged = gallery.media.filter((m) => m.status === "failed" || m.status === "attention")
  return (
    <div className="max-w-2xl space-y-8">
      <section className="space-y-3">
        <h2 className="font-title-serif text-2xl">Name and date</h2>
        <form
          className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault()
            if (!title.trim()) return
            save({ title: title.trim(), eventDate: eventDate || null }, "Renamed")
          }}
        >
          <Field label="Gallery title"><input className="field" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Event date"><input className="field" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></Field>
          <button className="btn btn-solid" disabled={!title.trim() || (title.trim() === gallery.title && (eventDate || "") === (gallery.eventDate || ""))}>Rename</button>
        </form>
        <p className="text-xs u-muted">The link stays the same when you rename, so anything already shared keeps working.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-title-serif text-2xl">Link address</h2>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            setSlugErr(null)
            try {
              await save({ slug: slug.trim().toLowerCase() }, "Address changed")
            } catch (ex) {
              setSlugErr(ex.message)
            }
          }}
        >
          <label className="block min-w-0 flex-1">
            <span className="label">Address</span>
            <span className="flex items-center border u-line" style={{ background: "var(--bg-2)" }}>
              <span className="shrink-0 pl-3 text-sm u-muted">{host}/</span>
              <input className="field !border-0 !bg-transparent" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} spellCheck={false} />
            </span>
          </label>
          <button className="btn btn-solid" disabled={slug.trim() === gallery.slug || slug.trim().length < 3}>Change address</button>
        </form>
        {slugErr && <Notice kind="error">{slugErr}</Notice>}
        <p className="text-xs u-muted">Lowercase letters, numbers and hyphens. The old address keeps working as well, so links already sent are safe. Short memorable addresses are guessable; use a password if the gallery is private.</p>
      </section>
      <section className="space-y-3">
        <h2 className="font-title-serif text-2xl">Visibility</h2>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={gallery.visible} onChange={(e) => save({ visible: e.target.checked }, e.target.checked ? "Gallery is visible" : "Gallery is hidden")} />
          Visible. Hidden galleries show "not available" to guests, while you can still preview them when signed in.
        </label>
      </section>
      <section className="space-y-3">
        <h2 className="font-title-serif flex items-center gap-2 text-2xl"><Lock size={18} /> Password</h2>
        <p className="text-sm u-muted">{gallery.hasPassword ? "This gallery has a password. Guests enter it once per device. Media links cannot be fetched before unlocking." : "Off. Anyone with the link can view."}</p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); save({ password: pw }, "Password set"); setPw("") }}>
          <input className="field" placeholder={gallery.hasPassword ? "New password" : "Set a password"} value={pw} onChange={(e) => setPw(e.target.value)} minLength={4} />
          <button className="btn" disabled={pw.length < 4}>{gallery.hasPassword ? "Change" : "Set"}</button>
          {gallery.hasPassword && <button type="button" className="btn" onClick={() => save({ password: null }, "Password removed")}>Remove</button>}
        </form>
      </section>
      {msg && <Notice kind="ok">{msg}</Notice>}
      {(flagged.length > 0 || jobs.length > 0) && (
        <section className="space-y-3">
          <h2 className="font-title-serif text-2xl">Needs attention</h2>
          <ul className="divide-y u-line border u-line text-sm">
            {flagged.map((m) => (
              <li key={m.id} className="flex items-start justify-between gap-3 px-3 py-2">
                <div className="min-w-0"><div className="truncate">{m.filename}</div><div className="text-xs text-amber-700">{m.error}</div></div>
                <button className="btn btn-sm shrink-0" onClick={() => post("/api/admin/media/bulk", { ids: [m.id], action: "reprocess" }).then((d) => setGallery(d.gallery))}><RefreshCw size={12} /> Retry</button>
              </li>
            ))}
            {jobs.map((j) => (
              <li key={j.id} className="flex items-start justify-between gap-3 px-3 py-2">
                <div className="min-w-0"><div>{j.type} #{j.id}</div><div className="truncate text-xs text-red-700">{j.error?.split("\n")[0]}</div></div>
                <button className="btn btn-sm shrink-0" onClick={() => post(`/api/admin/jobs/${j.id}/retry`).then(() => setJobs((js) => js.filter((x) => x.id !== j.id)))}>Retry</button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {canDelete && (
      <section className="space-y-3 border-t u-line pt-6">
        <h2 className="font-title-serif text-2xl">Delete</h2>
        <p className="text-sm u-muted">Moves the gallery to the trash. The link stops working at once. Files are removed from storage after 30 days; until then it can be restored from the gallery list.</p>
        <button className="btn !border-red-300 !text-red-700" onClick={async () => { if (confirm(`Delete "${gallery.title}"?`)) { await del(`/api/admin/galleries/${gallery.id}`); navigate("/admin") } }}><Trash2 size={14} /> Delete gallery</button>
      </section>
      )}
    </div>
  )
}
