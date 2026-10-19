import { useState } from "react"
import { Copy, Trash2, ArrowUp, ArrowDown, Globe, Lock, AlertTriangle } from "lucide-react"
import { patch, del } from "../shared/api.js"
import { Field } from "../shared/ui.jsx"
import { formatDuration, formatBytes } from "../shared/format.js"
import { UploadZone } from "./Uploader.jsx"
import { useEditor } from "./GalleryEditor.jsx"
import { useCanDelete } from "./AdminApp.jsx"

export function ReelsTab() {
  const { gallery, setGallery, reload, setUploading } = useEditor()
  const pending = gallery.media.filter((m) => !m.albumId && ["uploaded", "processing", "uploading"].includes(m.status))
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-4">
        <UploadZone galleryId={gallery.id} target="reel" compact onProgress={(s) => { setUploading(s.running); if (!s.running) reload() }} />
        <p className="text-xs u-muted">Featured reels sit under the cover with a large player, get their own share page with a video preview, and can be downloaded. They are separate from videos inside albums.</p>
        {pending.length > 0 && <p className="text-xs u-muted">{pending.length} video{pending.length === 1 ? "" : "s"} processing. Transcoding takes about as long as the video itself.</p>}
      </aside>
      <section className="space-y-4">
        {!gallery.reels.length && !pending.length && <div className="border u-line p-16 text-center u-muted">No featured videos yet.</div>}
        {gallery.reels.map((r, i) => <ReelRow key={r.id} reel={r} first={i === 0} last={i === gallery.reels.length - 1} />)}
      </section>
    </div>
  )
}

function ReelRow({ reel, first, last }) {
  const { gallery, setGallery } = useEditor()
  const canDelete = useCanDelete()
  const [title, setTitle] = useState(reel.title)
  const [description, setDescription] = useState(reel.description)
  const [clipStart, setClipStart] = useState(reel.clipStart || 0)
  const [copied, setCopied] = useState(false)
  const m = reel.media
  const save = async (body) => {
    const { gallery: g } = await patch(`/api/admin/reels/${reel.id}`, body)
    setGallery(g)
  }
  const url = `${location.origin}/${gallery.slug}/reel/${reel.id}`
  const copy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const move = (dir) => save({ sort: reel.sort + dir * 1.5 }).then(() => {})
  return (
    <div className="grid gap-4 border u-line p-4 md:grid-cols-[200px_1fr]">
      <div>
        <div className="relative overflow-hidden bg-black" style={{ aspectRatio: `${m.width || 16} / ${m.height || 9}`, maxHeight: 280 }}>
          {m.poster && <img src={m.poster} alt="" className="h-full w-full object-contain" />}
          <span className="absolute right-1 bottom-1 bg-black/60 px-1.5 py-0.5 text-[10px] text-white">{formatDuration(m.duration)}</span>
        </div>
        <div className="mt-2 text-[11px] u-muted">{m.width}×{m.height} · {formatBytes(m.sizeBytes)}{reel.webSize ? ` · web ${formatBytes(reel.webSize)}` : ""}</div>
        {m.status === "attention" && <div className="mt-2 flex gap-2 text-xs text-amber-700"><AlertTriangle size={14} className="shrink-0" /> {m.error}</div>}
        {reel.clip && (
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer u-muted">Cover clip preview</summary>
            <video src={reel.clip} muted loop autoPlay playsInline className="mt-1 w-full" />
          </details>
        )}
      </div>
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title"><input className="field" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== reel.title && save({ title })} /></Field>
          <Field label="Cover clip starts at (seconds)" hint="An 8 second muted loop is cut from here for the Video cover layout.">
            <input className="field" type="number" min={0} max={Math.max(0, Math.floor((m.duration || 0) - 2))} step={1} value={clipStart} onChange={(e) => setClipStart(e.target.value)} onBlur={() => Number(clipStart) !== reel.clipStart && save({ clipStart: Number(clipStart) })} />
          </Field>
        </div>
        <Field label="Description" hint="Shown under the player and in link previews."><textarea className="field" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} onBlur={() => description !== reel.description && save({ description })} /></Field>
        <div className="flex flex-wrap items-center gap-2 border-t u-line pt-3">
          <button className={`btn btn-sm ${reel.isPublic ? "btn-solid" : ""}`} onClick={() => save({ isPublic: !reel.isPublic })}>
            {reel.isPublic ? <Globe size={14} /> : <Lock size={14} />} {reel.isPublic ? "Public" : "Private"}
          </button>
          <span className="text-xs u-muted">
            {gallery.hasPassword ? (reel.isPublic ? "This gallery has a password. Anyone with this reel's link can watch it without the password; the photos stay locked." : "This gallery has a password. The reel's share page asks for it too. Make it public to share the video widely.") : reel.isPublic ? "Public. Anyone with the link can watch." : "Private has no effect while the gallery has no password."}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <code className="truncate text-xs u-muted">{url}</code>
          <button className="btn btn-sm" onClick={copy}><Copy size={12} /> {copied ? "Copied" : "Copy share link"}</button>
          <a className="btn btn-sm" href={url} target="_blank" rel="noreferrer">Open</a>
          <span className="flex-1" />
          <button className="icon-btn !h-8 !w-8" disabled={first} onClick={() => move(-1)} aria-label="Move up"><ArrowUp size={14} /></button>
          <button className="icon-btn !h-8 !w-8" disabled={last} onClick={() => move(1)} aria-label="Move down"><ArrowDown size={14} /></button>
          {canDelete && <button className="icon-btn !h-8 !w-8 hover:!text-red-700" onClick={() => confirm("Remove this reel? The video moves to the trash.") && del(`/api/admin/reels/${reel.id}`).then((d) => setGallery(d.gallery))} aria-label="Delete"><Trash2 size={14} /></button>}
        </div>
      </div>
    </div>
  )
}
