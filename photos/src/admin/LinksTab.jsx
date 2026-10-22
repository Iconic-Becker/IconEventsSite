// Share links: the main link shows everything; extra links show chosen
// albums, each with its own optional password. A public link for the
// public albums and a private one for the client, from one upload.
import { useState } from "react"
import { Copy, ExternalLink, Lock, Globe, Plus, Trash2, Pencil, EyeOff } from "lucide-react"
import { post, patch, del } from "../shared/api.js"
import { Field, Sheet, Notice } from "../shared/ui.jsx"
import { plural } from "../shared/format.js"
import { useEditor } from "./GalleryEditor.jsx"
import { useCanDelete } from "./AdminApp.jsx"

export function LinksTab() {
  const { gallery, setGallery } = useEditor()
  const canDelete = useCanDelete()
  const [editing, setEditing] = useState(null) // null | "new" | link
  const [copied, setCopied] = useState(null)
  const albums = gallery.albumRows
  const counts = {}
  for (const m of gallery.media) if (m.albumId) counts[m.albumId] = (counts[m.albumId] || 0) + 1
  const copy = async (key, url) => {
    await navigator.clipboard.writeText(url)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }
  const setLinks = (links) => setGallery({ ...gallery, links })
  const albumNames = (ids) => (ids ? albums.filter((a) => ids.includes(a.id)).map((a) => a.name).join(", ") : albums.some((a) => a.isPrivate) ? "All public albums" : "All albums")

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-title-serif text-2xl">Share links</h2>
          <p className="mt-1 max-w-xl text-sm u-muted">The main link shows every public album. Mark an album private on the Photos tab (the lock icon) to keep it off the main link; it then appears only on links that pick it, like a client or crew link. Each link can have its own password.</p>
        </div>
        <button className="btn btn-solid" onClick={() => setEditing("new")}>
          <Plus size={14} /> New link
        </button>
      </div>

      <div className="divide-y u-line border u-line">
        <Row
          name="Main link"
          detail={`${albumNames(null)}${gallery.reels.length ? " and reels" : ""}`}
          url={gallery.url}
          locked={gallery.hasPassword}
          copied={copied === "main"}
          onCopy={() => copy("main", gallery.url)}
          note={gallery.hasPassword ? "Uses the gallery password from Settings." : "No password. Set one in Settings."}
        />
        {gallery.links.map((l) => (
          <Row
            key={l.id}
            name={l.name || "Untitled link"}
            detail={`${albumNames(l.albumIds)}${l.includeReels && gallery.reels.length ? " and reels" : ""}`}
            url={l.url}
            locked={l.hasPassword}
            hidden={!l.visible}
            copied={copied === l.id}
            onCopy={() => copy(l.id, l.url)}
            onEdit={() => setEditing(l)}
            onDelete={!canDelete ? null : async () => {
              if (!confirm(`Delete the link "${l.name || l.slug}"? Anyone holding it loses access.`)) return
              const d = await del(`/api/admin/links/${l.id}`)
              setLinks(d.links)
            }}
            note={l.hasPassword ? "Has its own password." : "No password. Anyone with the link can view these albums."}
          />
        ))}
      </div>

      {editing && <LinkSheet link={editing === "new" ? null : editing} albums={albums} counts={counts} gallery={gallery} onClose={() => setEditing(null)} onSaved={(links) => { setLinks(links); setEditing(null) }} />}
    </div>
  )
}

function Row({ name, detail, url, locked, hidden, copied, onCopy, onEdit, onDelete, note }) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 font-medium">
          {name}
          {locked ? <Lock size={12} className="u-muted" title="Password" /> : <Globe size={12} className="u-muted" title="Open" />}
          {hidden && <EyeOff size={12} className="u-muted" title="Hidden" />}
        </div>
        <div className="truncate text-xs u-muted">{detail}</div>
        <div className="truncate text-[11px] u-muted">{note}</div>
      </div>
      <code className="hidden max-w-[260px] truncate text-xs u-muted md:block">{url.replace(/^https?:\/\//, "")}</code>
      <button className="btn btn-sm" onClick={onCopy}>
        <Copy size={12} /> {copied ? "Copied" : "Copy"}
      </button>
      <a className="icon-btn !h-8 !w-8" href={url} target="_blank" rel="noreferrer" aria-label="Open link">
        <ExternalLink size={14} />
      </a>
      {onEdit && (
        <button className="icon-btn !h-8 !w-8" onClick={onEdit} aria-label="Edit link">
          <Pencil size={14} />
        </button>
      )}
      {onDelete && (
        <button className="icon-btn !h-8 !w-8 hover:!text-red-700" onClick={onDelete} aria-label="Delete link">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}

function LinkSheet({ link, albums, counts, gallery, onClose, onSaved }) {
  const [name, setName] = useState(link?.name || "")
  const [all, setAll] = useState(!link || link.albumIds === null)
  const [ids, setIds] = useState(() => new Set(link?.albumIds || albums.map((a) => a.id)))
  const [includeReels, setIncludeReels] = useState(link ? link.includeReels : true)
  const [password, setPassword] = useState("")
  const [clearPassword, setClearPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const toggle = (id) =>
    setIds((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      const body = { name, albumIds: all ? null : [...ids], includeReels }
      if (password) body.password = password
      else if (clearPassword) body.password = null
      const d = link ? await patch(`/api/admin/links/${link.id}`, body) : await post(`/api/admin/galleries/${gallery.id}/links`, body)
      onSaved(d.links)
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Sheet open onClose={onClose} title={link ? "Edit link" : "New link"}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name" hint="For your own reference, for example Public, Client or Sponsor. Guests do not see it.">
          <input className="field" autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Public" />
        </Field>
        <div>
          <div className="label">Albums</div>
          <label className="mb-2 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /> All public albums, including ones added later
          </label>
          {!all && (
            <div className="max-h-56 space-y-1 overflow-y-auto border u-line p-2">
              {albums.map((a) => (
                <label key={a.id} className="flex items-center justify-between gap-2 px-1 py-1 text-sm">
                  <span className="flex items-center gap-2">
                    <input type="checkbox" checked={ids.has(a.id)} onChange={() => toggle(a.id)} /> {a.name}
                    {a.isPrivate && <span className="text-[10px] tracking-[0.14em] uppercase u-muted">private</span>}
                  </span>
                  <span className="text-xs u-muted">{plural(counts[a.id] || 0, "photo")}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        {gallery.reels.length > 0 && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={includeReels} onChange={(e) => setIncludeReels(e.target.checked)} /> Show the featured reels on this link
          </label>
        )}
        <Field label={link?.hasPassword ? "Change password" : "Password (optional)"} hint="Guests enter it once per device. Leave empty for no password.">
          <input className="field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={link?.hasPassword ? "Keep the current password" : "None"} />
        </Field>
        {link?.hasPassword && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={clearPassword} onChange={(e) => setClearPassword(e.target.checked)} /> Remove the password from this link
          </label>
        )}
        {err && <Notice kind="error">{err}</Notice>}
        <button className="btn btn-solid w-full" disabled={busy || (!all && ids.size === 0)}>
          {link ? "Save link" : "Create link"}
        </button>
      </form>
    </Sheet>
  )
}
