import { useEffect, useMemo, useRef, useState } from "react"
import { Star, Trash2, FolderInput, Image as ImageIcon, RefreshCw, ArrowUp, ArrowDown, Pencil, Check, X, Plus, Clock, AlertTriangle, Loader2, Play, GripVertical, Lock, Unlock, Globe, ExternalLink } from "lucide-react"
import { get, patch, post, del } from "../shared/api.js"
import { Field, Sheet, Notice } from "../shared/ui.jsx"
import { formatBytes, formatDuration, plural } from "../shared/format.js"
import { UploadZone } from "./Uploader.jsx"
import { useEditor } from "./GalleryEditor.jsx"
import { useCanDelete } from "./AdminApp.jsx"

// A view, not an album: every photo sent to the website, newest first. Only
// the admin sees it, so attendees' albums stay exactly as arranged.
const WEBSITE = "website"

export function PhotosTab() {
  const { gallery, setGallery, reload, setUploading } = useEditor()
  const canDelete = useCanDelete()
  const albums = gallery.albumRows
  const [albumId, setAlbumId] = useState(albums[0]?.id)
  const sentMedia = useMemo(
    () => gallery.media.filter((m) => m.websiteSentAt).sort((a, b) => (a.websiteSentAt < b.websiteSentAt ? 1 : a.websiteSentAt > b.websiteSentAt ? -1 : String(a.websitePath).localeCompare(String(b.websitePath)))),
    [gallery.media],
  )
  const onWebsite = albumId === WEBSITE
  useEffect(() => {
    if (albumId === WEBSITE ? !sentMedia.length : !albums.find((a) => a.id === albumId)) setAlbumId(albums[0]?.id)
  }, [albums, albumId, sentMedia.length])
  const [selected, setSelected] = useState(() => new Set())
  const [moveOpen, setMoveOpen] = useState(false)
  const [moveNew, setMoveNew] = useState("")
  const [siteOpen, setSiteOpen] = useState(false)
  const [newAlbum, setNewAlbum] = useState("")
  const media = useMemo(() => (albumId === WEBSITE ? sentMedia : gallery.media.filter((m) => m.albumId === albumId)), [gallery.media, albumId, sentMedia])
  const album = albumId === WEBSITE ? { id: WEBSITE, name: "On the website" } : albums.find((a) => a.id === albumId)
  const counts = useMemo(() => {
    const c = {}
    for (const m of gallery.media) if (m.albumId) c[m.albumId] = (c[m.albumId] || 0) + 1
    return c
  }, [gallery.media])
  const waitingUpload = gallery.media.filter((m) => m.status === "uploading").length
  const processingCount = gallery.media.filter((m) => ["uploaded", "processing"].includes(m.status)).length
  const pendingCount = waitingUpload + processingCount
  const [recovering, setRecovering] = useState(false)
  const recover = async () => {
    setRecovering(true)
    try {
      await post("/api/admin/jobs/recover")
      await reload()
    } finally {
      setRecovering(false)
    }
  }

  const [discarding, setDiscarding] = useState(false)
  const discardUnfinished = async () => {
    if (!confirm(`Discard ${waitingUpload} unfinished ${waitingUpload === 1 ? "upload" : "uploads"}? Finished photos are not touched. You can drop the files again later.`)) return
    setDiscarding(true)
    try {
      const d = await post(`/api/admin/galleries/${gallery.id}/uploads/discard`)
      if (d.gallery) setGallery(d.gallery)
      else await reload()
    } finally {
      setDiscarding(false)
    }
  }

  // Click toggles one photo. Shift-click selects everything between the
  // last photo clicked and this one. Escape clears.
  const lastClicked = useRef(null)
  const toggle = (id, e) => {
    const ids = (order || media).map((m) => m.id)
    if (e?.shiftKey && lastClicked.current != null && ids.includes(lastClicked.current)) {
      const a = ids.indexOf(lastClicked.current)
      const b = ids.indexOf(id)
      const range = ids.slice(Math.min(a, b), Math.max(a, b) + 1)
      setSelected((s) => new Set([...s, ...range]))
      return
    }
    lastClicked.current = id
    setSelected((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  const clear = () => setSelected(new Set())
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") clear()
      if ((e.metaKey || e.ctrlKey) && e.key === "a" && !/input|textarea/i.test(e.target.tagName)) {
        e.preventDefault()
        setSelected(new Set((order || media).map((m) => m.id)))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })
  const bulk = async (action, extra = {}) => {
    const { gallery: g } = await post("/api/admin/media/bulk", { ids: [...selected], action, ...extra })
    setGallery(g)
    clear()
  }
  const setCover = async (id) => {
    const { gallery: g } = await patch(`/api/admin/galleries/${gallery.id}`, { coverMediaId: id })
    setGallery(g)
    clear()
  }
  const setAlbumCover = async (id) => {
    const { gallery: g } = await patch(`/api/admin/albums/${albumId}`, { coverMediaId: id })
    setGallery(g)
    clear()
  }

  // Drag to reorder within the album. Dragging a selected photo moves the
  // whole selection together, keeping its own order; the group lands before
  // or after the tile under the pointer depending on which half it is over.
  const [dragIds, setDragIds] = useState(null)
  const [order, setOrder] = useState(null)
  const list = order || media
  useEffect(() => setOrder(null), [media])
  const onDragStart = (m) => {
    const ids = selected.has(m.id) ? list.filter((x) => selected.has(x.id)).map((x) => x.id) : [m.id]
    setDragIds(ids)
  }
  const onDragOver = (e, overId) => {
    e.preventDefault()
    if (!dragIds || dragIds.includes(overId)) return
    const rect = e.currentTarget.getBoundingClientRect()
    const after = e.clientX > rect.left + rect.width / 2
    const moving = list.filter((m) => dragIds.includes(m.id))
    const rest = list.filter((m) => !dragIds.includes(m.id))
    const at = rest.findIndex((m) => m.id === overId) + (after ? 1 : 0)
    const next = [...rest.slice(0, at), ...moving, ...rest.slice(at)]
    if (next.every((m, i) => m.id === list[i].id)) return
    setOrder(next)
  }
  const onDrop = async () => {
    const ids = order?.map((m) => m.id)
    setDragIds(null)
    if (!ids || onWebsite) return
    await post(`/api/admin/albums/${albumId}/reorder`, { ids })
    reload()
  }

  const addAlbum = async (e) => {
    e.preventDefault()
    const { gallery: g } = await post(`/api/admin/galleries/${gallery.id}/albums`, { name: newAlbum })
    setGallery(g)
    setNewAlbum("")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-5">
        <UploadZone galleryId={gallery.id} compact onProgress={(s) => { setUploading(s.running); if (!s.running) reload() }} />
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="eyebrow">Albums</div>
            <span className="text-xs u-muted">{plural(gallery.media.filter((m) => m.albumId).length, "item")}</span>
          </div>
          <ul className="border u-line">
            {albums.map((a, i) => (
              <AlbumRow key={a.id} album={a} count={counts[a.id] || 0} active={a.id === albumId} onSelect={() => { setAlbumId(a.id); clear() }} first={i === 0} last={i === albums.length - 1} albums={albums} />
            ))}
          </ul>
          {sentMedia.length > 0 && (
            <ul className="mt-2 border u-line">
              <li className={`flex items-center ${onWebsite ? "bg-[var(--bg-3)]" : ""}`}>
                <button className="flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm" onClick={() => { setAlbumId(WEBSITE); clear() }} title="Every photo sent to iconic.events. Only you see this list.">
                  <Globe size={14} className="shrink-0" /> On the website <span className="ml-auto text-xs u-muted">{sentMedia.length}</span>
                </button>
              </li>
            </ul>
          )}
          <form onSubmit={addAlbum} className="mt-2 flex gap-2">
            <input className="field !py-2 text-sm" placeholder="New album" value={newAlbum} onChange={(e) => setNewAlbum(e.target.value)} />
            <button className="btn btn-sm" disabled={!newAlbum.trim()} aria-label="Add album">
              <Plus size={14} />
            </button>
          </form>
          <p className="mt-2 text-xs u-muted">Highlights is filled by starring photos. Star a few of the best and guests see them first. Hover an album for rename, order, private and delete; a private album stays off the main link and appears only on links that pick it.</p>
        </div>
      </aside>

      <section>
        {pendingCount > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 border u-line px-4 py-2 text-sm">
            <Loader2 size={14} className="animate-spin" />
            <span>
              {processingCount > 0 && `${processingCount} ${processingCount === 1 ? "file is" : "files are"} being processed. `}
              {waitingUpload > 0 && `${waitingUpload} ${waitingUpload === 1 ? "file never finished" : "files never finished"} uploading: drop the same folder again to resume. `}
              {processingCount > 0 && "Thumbnails appear as they finish."}
            </span>
            <span className="ml-auto flex items-center gap-2">
              {processingCount > 0 && (
                <button className="btn btn-sm" onClick={recover} disabled={recovering} title="Re-queue anything that stopped moving">
                  <RefreshCw size={12} /> {recovering ? "Checking" : "Nothing moving? Retry"}
                </button>
              )}
              {waitingUpload > 0 && (
                <button className="btn btn-sm" onClick={discardUnfinished} disabled={discarding} title="Forget the unfinished uploads so this notice goes away">
                  <X size={12} /> {discarding ? "Discarding" : "Discard unfinished"}
                </button>
              )}
            </span>
          </div>
        )}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-title-serif text-2xl">{album?.name}</h2>
            <div className="text-xs u-muted">
              {onWebsite
                ? `${plural(media.length, "photo")} sent to iconic.events, newest first. Only you see this list; each photo stays in its own album.`
                : `${plural(media.length, "item")} · click to select, shift-click for a range, drag to reorder${dragIds?.length > 1 ? ` · moving ${dragIds.length}` : ""}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!onWebsite && (
              <button className="btn btn-sm" onClick={() => post(`/api/admin/albums/${albumId}/sort-by-capture`).then((d) => setGallery(d.gallery))} title="Order by capture time, then filename">
                <Clock size={14} /> Sort by time
              </button>
            )}
            {selected.size > 0 ? (
              <button className="btn btn-sm" onClick={clear}>Clear ({selected.size})</button>
            ) : (
              <button className="btn btn-sm" onClick={() => setSelected(new Set(media.map((m) => m.id)))} disabled={!media.length}>Select all</button>
            )}
          </div>
        </div>

        {selected.size > 0 && (
          <div className="sticky top-0 z-20 mb-3 flex flex-wrap items-center gap-2 border u-line px-3 py-2 text-sm" style={{ background: "var(--bg-2)" }}>
            <span className="mr-2 u-muted">{selected.size} selected</span>
            <button className="btn btn-sm" onClick={() => bulk("star")}><Star size={14} /> Star</button>
            <button className="btn btn-sm" onClick={() => bulk("unstar")}>Unstar</button>
            <button className="btn btn-sm" onClick={() => setMoveOpen(true)}><FolderInput size={14} /> Move</button>
            <button className="btn btn-sm" onClick={() => setSiteOpen(true)} title="Open a pull request on iconic.events with these photos"><Globe size={14} /> Send to website</button>
            {selected.size === 1 && <button className="btn btn-sm" onClick={() => setCover([...selected][0])}><ImageIcon size={14} /> Gallery cover</button>}
            {selected.size === 1 && <button className="btn btn-sm" onClick={() => setAlbumCover([...selected][0])}>Album cover</button>}
            <button className="btn btn-sm" onClick={() => bulk("reprocess")}><RefreshCw size={14} /> Reprocess</button>
            {canDelete && <button className="btn btn-sm !border-red-300 !text-red-700" onClick={() => bulk("trash")}><Trash2 size={14} /> Delete</button>}
          </div>
        )}

        {!media.length && !onWebsite && <div className="border u-line p-16 text-center u-muted">This album is empty. Drop photos on the left, or move some here.</div>}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
          {list.map((m) => (
            <MediaTile
              key={m.id}
              m={m}
              selected={selected.has(m.id)}
              onToggle={(e) => toggle(m.id, e)}
              isCover={gallery.cover?.id === m.id}
              isAlbumCover={album?.coverMediaId === m.id}
              draggable={!onWebsite}
              onDragStart={() => onDragStart(m)}
              onDragOver={(e) => onDragOver(e, m.id)}
              onDrop={onDrop}
              onDragEnd={() => setDragIds(null)}
              dragging={dragIds?.includes(m.id)}
              dragCount={dragIds?.length > 1 && dragIds[0] === m.id ? dragIds.length : 0}
            />
          ))}
        </div>

        {gallery.trash.length > 0 && (
          <details className="mt-10 text-sm">
            <summary className="cursor-pointer u-muted">Trash ({gallery.trash.length}). Files are removed from storage 30 days after deletion.</summary>
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
              {gallery.trash.map((m) => (
                <button key={m.id} className="relative aspect-square overflow-hidden opacity-70 hover:opacity-100" style={{ background: "var(--bg-3)" }} onClick={() => post("/api/admin/media/bulk", { ids: [m.id], action: "restore" }).then((d) => setGallery(d.gallery))} title="Restore">
                  {m.thumb && <img src={m.thumb} alt="" className="h-full w-full object-cover" />}
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[10px] uppercase text-white">Restore</span>
                </button>
              ))}
            </div>
          </details>
        )}
      </section>

      <SendToWebsite open={siteOpen} onClose={() => setSiteOpen(false)} gallery={gallery} ids={(order || media).filter((m) => selected.has(m.id)).map((m) => m.id)} onSent={clear} />

      <Sheet open={moveOpen} onClose={() => setMoveOpen(false)} title={`Move ${plural(selected.size, "photo")} to`}>
        <ul className="space-y-1">
          {albums.filter((a) => a.id !== albumId).map((a) => (
            <li key={a.id}>
              <button className="btn w-full justify-between" onClick={() => { setMoveOpen(false); bulk("move", { albumId: a.id }) }}>
                {a.name} <span className="u-muted normal-case tracking-normal">{counts[a.id] || 0}</span>
              </button>
            </li>
          ))}
          {albums.length <= 1 && <li className="py-2 text-sm u-muted">No other album yet.</li>}
        </ul>
        <form
          className="mt-4 flex gap-2 border-t u-line pt-4"
          onSubmit={async (e) => {
            e.preventDefault()
            const name = moveNew.trim()
            if (!name) return
            const { gallery: g } = await post(`/api/admin/galleries/${gallery.id}/albums`, { name })
            const created = g.albumRows.find((a) => a.name.toLowerCase() === name.toLowerCase())
            setGallery(g)
            setMoveNew("")
            setMoveOpen(false)
            if (created) bulk("move", { albumId: created.id })
          }}
        >
          <input className="field" placeholder="New album name" value={moveNew} onChange={(e) => setMoveNew(e.target.value)} />
          <button className="btn btn-solid btn-sm whitespace-nowrap" disabled={!moveNew.trim()}>
            <Plus size={12} /> Create and move
          </button>
        </form>
      </Sheet>
    </div>
  )
}

// Selected photos become a pull request on the marketing site: converted
// to the site's WebP sizes, numbered into one folder per event, with the
// photo library index updated. Nothing is live until the pull request is
// merged, so there is no way to break the site from here.
function SendToWebsite({ open, onClose, gallery, ids, onSent }) {
  const [cfg, setCfg] = useState(null)
  const [folder, setFolder] = useState("")
  const [job, setJob] = useState(null)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const photoIds = useMemo(() => ids.filter((id) => gallery.media.find((m) => m.id === id && m.kind === "photo" && m.status === "ready")), [ids, gallery.media])
  useEffect(() => {
    if (!open) return
    setJob(null)
    setError(null)
    setFolder(gallery.settings?.websiteFolder || gallery.slug.replace(/-[a-z0-9]{6}$/, ""))
    get("/api/admin/website/config").then(setCfg).catch((e) => setError(e.message))
  }, [open, gallery.slug, gallery.settings?.websiteFolder])
  // Poll until the pull request exists or the job gives up.
  useEffect(() => {
    if (!job || !["queued", "running"].includes(job.status)) return
    const t = setTimeout(async () => {
      try {
        const { export: e } = await get(`/api/admin/website-exports/${job.id}`)
        setJob(e)
      } catch (e) {
        setError(e.message)
      }
    }, 2000)
    return () => clearTimeout(t)
  }, [job])
  const send = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const { export: ex } = await post(`/api/admin/galleries/${gallery.id}/website-exports`, { ids: photoIds, folder: folder.trim() })
      setJob(ex)
      onSent?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  const valid = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(folder.trim())
  return (
    <Sheet open={open} onClose={onClose} title="Send to website">
      {cfg && !cfg.configured && (
        <Notice>
          Sending to the website is not set up yet. Add a <code>GITHUB_TOKEN</code> with access to {cfg.repo} to the Railway variables (see docs/OWNER-SETUP.md), then redeploy.
        </Notice>
      )}
      {cfg?.configured && !job && (
        <form onSubmit={send} className="space-y-4">
          <p className="text-sm">
            {plural(photoIds.length, "photo")} will be converted to the site's sizes and opened as a pull request on <strong>{cfg.repo}</strong>. Nothing is live until that pull request is merged.
            {photoIds.length !== ids.length && <span className="u-muted"> {ids.length - photoIds.length} selected {ids.length - photoIds.length === 1 ? "item is" : "items are"} not finished photos and will be left out.</span>}
          </p>
          <Field label="Folder on the site" hint={`${cfg.imageDir}/<folder>/. One folder per event; photos are numbered after whatever is already there.`}>
            <input className="field" value={folder} onChange={(e) => setFolder(e.target.value)} spellCheck={false} />
          </Field>
          {error && <Notice kind="error">{error}</Notice>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-solid btn-sm" disabled={busy || !valid || !photoIds.length || photoIds.length > cfg.maxPhotos}>
              {busy ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />} Send {plural(photoIds.length, "photo")}
            </button>
          </div>
          {photoIds.length > cfg.maxPhotos && <p className="text-xs text-red-700">Send up to {cfg.maxPhotos} photos at a time.</p>}
        </form>
      )}
      {job && (
        <div className="space-y-4 text-sm">
          {["queued", "running"].includes(job.status) && (
            <p className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Converting {plural(job.count, "photo")} and opening the pull request. This takes a few seconds per photo.</p>
          )}
          {job.status === "done" && (
            <>
              <Notice kind="ok">Pull request opened with {plural(job.files.length, "photo")} in {cfg?.imageDir}/{job.folder}/ ({job.files[0]?.number} to {job.files[job.files.length - 1]?.number}).</Notice>
              <a className="btn btn-solid btn-sm" href={job.prUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Open the pull request</a>
              <p className="u-muted text-xs">Merge it on GitHub to put the photos on the site, and merge before sending more to the same folder so the numbering carries on. To use one on a case study page, reference it from the study's media.</p>
            </>
          )}
          {job.status === "failed" && <Notice kind="error">Could not send: {job.error}</Notice>}
          {error && <Notice kind="error">{error}</Notice>}
          <div className="flex justify-end"><button type="button" className="btn btn-sm" onClick={onClose}>Close</button></div>
        </div>
      )}
      {!cfg && !error && <p className="flex items-center gap-2 text-sm"><Loader2 size={14} className="animate-spin" /> Checking</p>}
      {!cfg && error && <Notice kind="error">{error}</Notice>}
    </Sheet>
  )
}

function AlbumRow({ album, count, active, onSelect, first, last, albums }) {
  const { gallery, setGallery } = useEditor()
  const canDelete = useCanDelete()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(album.name)
  const save = async () => {
    const { gallery: g } = await patch(`/api/admin/albums/${album.id}`, { name })
    setGallery(g)
    setEditing(false)
  }
  const move = async (dir) => {
    const ids = albums.map((a) => a.id)
    const i = ids.indexOf(album.id)
    const j = i + dir
    if (j < 0 || j >= ids.length) return
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
    const { gallery: g } = await post(`/api/admin/galleries/${gallery.id}/albums/reorder`, { ids })
    setGallery(g)
  }
  const remove = async () => {
    if (!confirm(`Delete the album "${album.name}" and move its ${count} photos to the trash?`)) return
    const { gallery: g } = await del(`/api/admin/albums/${album.id}`)
    setGallery(g)
  }
  return (
    <li className={`group flex items-center gap-1 border-b u-line last:border-b-0 ${active ? "bg-[var(--bg-3)]" : ""}`}>
      {editing ? (
        <form className="flex flex-1 items-center gap-1 p-1" onSubmit={(e) => { e.preventDefault(); save() }}>
          <input className="field !py-1 text-sm" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          <button className="icon-btn !h-8 !w-8" aria-label="Save"><Check size={14} /></button>
          <button type="button" className="icon-btn !h-8 !w-8" aria-label="Cancel" onClick={() => setEditing(false)}><X size={14} /></button>
        </form>
      ) : (
        <>
          <button className="flex flex-1 items-center justify-between px-3 py-2 text-left text-sm" onClick={onSelect}>
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate">{album.name}</span>
              {album.isPrivate && <Lock size={11} className="shrink-0 u-muted" title="Private: shown only on links that pick it" />}
            </span>
            <span className="ml-2 text-xs u-muted">{count}</span>
          </button>
          <div className="flex opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <button className="icon-btn !h-8 !w-7" onClick={() => patch(`/api/admin/albums/${album.id}`, { isPrivate: !album.isPrivate }).then((d) => setGallery(d.gallery))} aria-label={album.isPrivate ? "Make public" : "Make private"} title={album.isPrivate ? "Private. Click to show it on the main link again." : "Public. Click to hide it from the main link; it then shows only on links that pick it."}>{album.isPrivate ? <Unlock size={12} /> : <Lock size={12} />}</button>
            <button className="icon-btn !h-8 !w-7" onClick={() => setEditing(true)} aria-label="Rename"><Pencil size={12} /></button>
            <button className="icon-btn !h-8 !w-7" onClick={() => move(-1)} disabled={first} aria-label="Move up"><ArrowUp size={12} /></button>
            <button className="icon-btn !h-8 !w-7" onClick={() => move(1)} disabled={last} aria-label="Move down"><ArrowDown size={12} /></button>
            {canDelete && <button className="icon-btn !h-8 !w-7 hover:!text-red-700" onClick={remove} disabled={albums.length <= 1} aria-label="Delete album"><Trash2 size={12} /></button>}
          </div>
        </>
      )}
    </li>
  )
}

export function MediaTile({ m, selected, onToggle, isCover, isAlbumCover, dragging, dragCount = 0, ...drag }) {
  const busy = ["uploading", "uploaded", "processing"].includes(m.status)
  return (
    <div {...drag} className={`relative aspect-square cursor-pointer overflow-hidden select-none ${selected ? "ring-2 ring-[var(--accent)]" : ""} ${dragging ? "opacity-40" : ""}`} style={{ background: "var(--bg-3)" }} onClick={(e) => onToggle(e)} title={`${m.filename}${m.sizeBytes ? ` · ${formatBytes(m.sizeBytes)}` : ""}${m.websitePath ? `\nOn the website: ${m.websitePath}` : ""}${m.error ? `\n${m.error}` : ""}`}>
      {dragCount > 0 && <span className="absolute top-1 left-1 z-10 bg-[#B89968] px-1.5 text-xs text-[#0E1312]">{dragCount}</span>}
      {m.thumb ? <img src={m.thumb} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} /> : <div className="flex h-full flex-col items-center justify-center gap-1 px-1 text-center text-[10px] u-muted">{m.status === "uploading" ? <><Clock size={16} /> waiting for upload</> : busy ? <><Loader2 className="animate-spin" size={16} /> processing</> : m.filename}</div>}
      {m.kind === "video" && <span className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 text-[10px] text-white"><Play size={10} fill="currentColor" /> {formatDuration(m.duration)}</span>}
      {m.highlighted && <Star size={14} className="absolute top-1 left-1 text-[#B89968] drop-shadow" fill="#B89968" />}
      {m.websiteSentAt && m.kind !== "video" && <span className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 text-[10px] text-white" title="On the website"><Globe size={10} /> Site</span>}
      {isCover && <span className="absolute top-1 right-1 bg-[#B89968] px-1 text-[9px] uppercase text-[#0E1312]">Cover</span>}
      {isAlbumCover && !isCover && <span className="absolute top-1 right-1 bg-white/90 px-1 text-[9px] uppercase text-[#0E1312]">Album cover</span>}
      {(m.status === "failed" || m.status === "attention") && <span className={`absolute right-1 bottom-1 flex items-center gap-1 px-1 text-[9px] uppercase text-white ${m.status === "failed" ? "bg-red-700" : "bg-amber-600"}`}><AlertTriangle size={10} /> {m.status === "failed" ? "Failed" : "Check"}</span>}
      <span className={`absolute bottom-1 right-1 h-4 w-4 border ${selected ? "border-[var(--accent)] bg-[var(--accent)]" : "border-white/80 bg-black/30"}`} />
      {m.thumb && <GripVertical size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 drop-shadow transition-opacity hover:opacity-70" />}
    </div>
  )
}
