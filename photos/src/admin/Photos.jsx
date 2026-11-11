import { useEffect, useMemo, useRef, useState } from "react"
import { Star, Trash2, FolderInput, Image as ImageIcon, RefreshCw, ArrowUp, ArrowDown, Pencil, Check, X, Plus, Clock, AlertTriangle, Loader2, Play, GripVertical, Lock, Unlock, Globe, ExternalLink, UserRound, UserRoundX, Undo2, ChevronLeft, ChevronRight, Square, CheckSquare } from "lucide-react"
import { createPortal } from "react-dom"
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
  // People views: "person:<id>" lists that person's matches in this gallery.
  const personId = typeof albumId === "string" && albumId.startsWith("person:") ? Number(albumId.slice(7)) : null
  const [people, setPeople] = useState(null)
  const [showPossible, setShowPossible] = useState(false)
  const [showHidden, setShowHidden] = useState(false)
  const loadPeople = () => get(`/api/admin/galleries/${gallery.id}/people`).then(setPeople).catch(() => {})
  useEffect(() => {
    loadPeople()
  }, [gallery.id, gallery.media.length])
  // While a fresh upload is still being scanned, keep the counts moving.
  useEffect(() => {
    if (!people || !people.scan.pending) return
    const t = setTimeout(loadPeople, 5000)
    return () => clearTimeout(t)
  }, [people])
  const person = personId ? people?.people.find((p) => p.id === personId) : null
  const personMedia = useMemo(() => {
    if (!person) return []
    const byId = new Map(gallery.media.map((m) => [m.id, m]))
    return person.matches
      .filter((x) => (showHidden ? x.rejected : !x.rejected && (x.confident || showPossible)))
      .map((x) => ({ ...byId.get(x.mediaId), match: x }))
      .filter((m) => m.id)
  }, [person, gallery.media, showPossible, showHidden])
  useEffect(() => {
    const gone = albumId === WEBSITE ? !sentMedia.length : personId ? people && !person : !albums.find((a) => a.id === albumId)
    if (gone) setAlbumId(albums[0]?.id)
  }, [albums, albumId, sentMedia.length, people, person, personId])
  const [selected, setSelected] = useState(() => new Set())
  // Full-screen preview of one photo; arrows move through the current list.
  const [previewId, setPreviewId] = useState(null)
  const [moveOpen, setMoveOpen] = useState(false)
  const [moveNew, setMoveNew] = useState("")
  const [siteOpen, setSiteOpen] = useState(false)
  const [newAlbum, setNewAlbum] = useState("")
  const media = useMemo(() => (albumId === WEBSITE ? sentMedia : personId ? personMedia : gallery.media.filter((m) => m.albumId === albumId)), [gallery.media, albumId, sentMedia, personId, personMedia])
  const album = albumId === WEBSITE ? { id: WEBSITE, name: "On the website" } : personId ? { id: albumId, name: person?.name || "" } : albums.find((a) => a.id === albumId)
  const isView = onWebsite || Boolean(personId)
  const notThem = async (undo = false) => {
    await post(`/api/admin/galleries/${gallery.id}/people/${personId}/reject`, { mediaIds: [...selected], undo })
    await loadPeople()
    clear()
  }
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
      if (previewId != null) {
        const ids = (order || media).map((m) => m.id)
        const i = ids.indexOf(previewId)
        if (e.key === "Escape") setPreviewId(null)
        if (e.key === "ArrowRight" && i >= 0 && i < ids.length - 1) setPreviewId(ids[i + 1])
        if (e.key === "ArrowLeft" && i > 0) setPreviewId(ids[i - 1])
        if (e.key === " " && i >= 0 && !/input|textarea|button/i.test(e.target.tagName)) {
          e.preventDefault()
          toggle(previewId)
        }
        return
      }
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
    if (!ids || isView) return
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
        <UploadZone galleryId={gallery.id} compact wholePage onProgress={(s) => { setUploading(s.running); if (!s.running) reload() }} />
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
          {people && people.people.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="eyebrow">People</div>
                {people.scan.pending > 0 && <span className="flex items-center gap-1 text-xs u-muted"><Loader2 size={12} className="animate-spin" /> {people.scan.pending} to scan</span>}
              </div>
              <ul className="border u-line">
                {people.people.map((p) => {
                  const confident = p.matches.filter((x) => x.confident && !x.rejected).length
                  const possible = p.matches.filter((x) => !x.confident && !x.rejected).length
                  return (
                    <li key={p.id} className={`flex items-center border-b u-line last:border-b-0 ${personId === p.id ? "bg-[var(--bg-3)]" : ""}`}>
                      <button className="flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm" onClick={() => { setAlbumId(`person:${p.id}`); setShowHidden(false); clear() }} title={p.ready ? `Photos that look like ${p.name}` : `${p.name} has no reference photos yet`}>
                        <UserRound size={14} className="shrink-0" /> {p.name}
                        <span className="ml-auto text-xs u-muted">{p.ready ? <>{confident}{possible ? <span className="opacity-70"> +{possible}?</span> : null}</> : "no photos yet"}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-1 text-xs u-muted">Add people and their reference photos under People in the top bar.</p>
            </div>
          )}
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
                : person
                  ? <PersonSummary person={person} scan={people.scan} showPossible={showPossible} setShowPossible={setShowPossible} showHidden={showHidden} setShowHidden={setShowHidden} />
                  : `${plural(media.length, "item")} · click a photo to preview, tick the box to select, shift-click boxes for a range, drag to reorder${dragIds?.length > 1 ? ` · moving ${dragIds.length}` : ""}`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isView && (
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
            {person && !showHidden && <button className="btn btn-sm" onClick={() => notThem(false)} title={`Hide these from ${person.name}'s list`}><UserRoundX size={14} /> Not {person.name}</button>}
            {person && showHidden && <button className="btn btn-sm" onClick={() => notThem(true)}><Undo2 size={14} /> Put back</button>}
            {selected.size === 1 && <button className="btn btn-sm" onClick={() => setCover([...selected][0])}><ImageIcon size={14} /> Gallery cover</button>}
            {selected.size === 1 && <button className="btn btn-sm" onClick={() => setAlbumCover([...selected][0])}>Album cover</button>}
            <button className="btn btn-sm" onClick={() => bulk("reprocess")}><RefreshCw size={14} /> Reprocess</button>
            {canDelete && <button className="btn btn-sm !border-red-300 !text-red-700" onClick={() => bulk("trash")}><Trash2 size={14} /> Delete</button>}
          </div>
        )}

        {!media.length && !isView && <div className="border u-line p-16 text-center u-muted">This album is empty. Drop photos on the left, or move some here.</div>}
        {!media.length && person && (
          <div className="border u-line p-16 text-center u-muted">
            {!person.ready ? `${person.name} has no reference photos yet. Add some under People.` : people.scan.pending ? `Still scanning. ${person.name}'s photos appear here as they are found.` : showHidden ? "Nothing hidden." : `No ${showPossible ? "" : "confident "}matches for ${person.name} in this gallery${!showPossible && person.matches.some((x) => !x.confident && !x.rejected) ? ", but there are possible ones: show them above" : ""}.`}
          </div>
        )}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6">
          {list.map((m) => (
            <MediaTile
              key={m.id}
              m={m}
              selected={selected.has(m.id)}
              onToggle={(e) => toggle(m.id, e)}
              onOpen={() => setPreviewId(m.id)}
              isCover={gallery.cover?.id === m.id}
              isAlbumCover={album?.coverMediaId === m.id}
              draggable={!isView}
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

      {previewId != null && (
        <Preview
          list={list}
          id={previewId}
          selected={selected.has(previewId)}
          onToggle={() => toggle(previewId)}
          onMove={(id) => setPreviewId(id)}
          onClose={() => setPreviewId(null)}
        />
      )}

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

function PersonSummary({ person, scan, showPossible, setShowPossible, showHidden, setShowHidden }) {
  const confident = person.matches.filter((x) => x.confident && !x.rejected).length
  const possible = person.matches.filter((x) => !x.confident && !x.rejected).length
  const hidden = person.matches.filter((x) => x.rejected).length
  const toggle = (on, set, label) => (
    <button className={`underline-offset-2 hover:underline ${on ? "u-fg" : ""}`} onClick={() => set(!on)}>{on ? "hide" : "show"} {label}</button>
  )
  return (
    <span className="flex flex-wrap items-center gap-x-2">
      <span>{plural(confident, "confident match", "confident matches")}, best first.</span>
      {possible > 0 && <span>{possible} possible ({toggle(showPossible, setShowPossible, "them")}).</span>}
      {hidden > 0 && <span>{hidden} hidden as not {person.name} ({toggle(showHidden, setShowHidden, "them")}).</span>}
      {scan.pending > 0 && <span className="flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> {scan.pending} photos still to scan.</span>}
      <span>Select wrong ones and click Not {person.name}.</span>
    </span>
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

export function MediaTile({ m, selected, onToggle, onOpen, isCover, isAlbumCover, dragging, dragCount = 0, ...drag }) {
  const busy = ["uploading", "uploaded", "processing"].includes(m.status)
  const canOpen = Boolean(m.thumb && onOpen)
  return (
    <div
      {...drag}
      className={`group relative aspect-square cursor-pointer overflow-hidden select-none ${selected ? "ring-2 ring-[var(--accent)]" : ""} ${dragging ? "opacity-40" : ""}`}
      style={{ background: "var(--bg-3)" }}
      onClick={(e) => (canOpen ? onOpen(e) : onToggle(e))}
      title={`${m.filename}${m.sizeBytes ? ` · ${formatBytes(m.sizeBytes)}` : ""}${m.websitePath ? `\nOn the website: ${m.websitePath}` : ""}${m.error ? `\n${m.error}` : ""}${canOpen ? "\nClick to preview, tick the box to select" : ""}`}
    >
      {dragCount > 0 && <span className="absolute top-1 left-1 z-10 bg-[#B89968] px-1.5 text-xs text-[#0E1312]">{dragCount}</span>}
      {m.thumb ? <img src={m.thumb} alt="" className="h-full w-full object-cover" loading="lazy" draggable={false} /> : <div className="flex h-full flex-col items-center justify-center gap-1 px-1 text-center text-[10px] u-muted">{m.status === "uploading" ? <><Clock size={16} /> waiting for upload</> : busy ? <><Loader2 className="animate-spin" size={16} /> processing</> : m.filename}</div>}
      {m.kind === "video" && <span className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 text-[10px] text-white"><Play size={10} fill="currentColor" /> {formatDuration(m.duration)}</span>}
      {m.highlighted && <Star size={14} className="absolute top-1 left-1 text-[#B89968] drop-shadow" fill="#B89968" />}
      {isCover && <span className="absolute right-1 bottom-1 bg-[#B89968] px-1 text-[9px] uppercase text-[#0E1312]">Cover</span>}
      {isAlbumCover && !isCover && <span className="absolute right-1 bottom-1 bg-white/90 px-1 text-[9px] uppercase text-[#0E1312]">Album cover</span>}
      {(m.status === "failed" || m.status === "attention") && <span className={`absolute top-1 left-1 flex items-center gap-1 px-1 text-[9px] uppercase text-white ${m.status === "failed" ? "bg-red-700" : "bg-amber-600"}`}><AlertTriangle size={10} /> {m.status === "failed" ? "Failed" : "Check"}</span>}
      {m.websiteSentAt && m.kind !== "video" && <span className="absolute bottom-1 left-1 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 text-[10px] text-white" title="On the website"><Globe size={10} /> Site</span>}
      {m.match && !m.match.confident && !m.match.rejected && <span className="absolute top-1 left-1 bg-amber-500 px-1.5 py-0.5 text-[10px] uppercase text-[#0E1312]" title={`Possible match (${Math.round(m.match.similarity * 100)})`}>Maybe</span>}
      {/* The tick box is the only thing that selects. A generous hit area
          so it is easy on a trackpad; shift-click picks a range. */}
      <button
        type="button"
        role="checkbox"
        aria-checked={selected}
        aria-label="Select"
        className="absolute top-0 right-0 z-10 flex h-8 w-8 items-center justify-center"
        onClick={(e) => {
          e.stopPropagation()
          onToggle(e)
        }}
      >
        <span className={`flex h-5 w-5 items-center justify-center border-2 ${selected ? "border-[var(--accent)] bg-[var(--accent)] text-[#0E1312]" : "border-white bg-black/40 text-transparent group-hover:bg-black/60"}`}>
          <Check size={14} strokeWidth={3} />
        </span>
      </button>
      {canOpen && <GripVertical size={14} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-60" />}
    </div>
  )
}

// Full-screen look at one photo, with the same tick box as the grid so a
// pass through an album can be done here: arrows move, space selects.
function Preview({ list, id, selected, onToggle, onMove, onClose }) {
  const i = list.findIndex((m) => m.id === id)
  const m = list[i]
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [])
  if (!m) return null
  const src = m.kind === "video" ? m.web : m.display || m.thumb
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex flex-col bg-black/95 text-white" role="dialog" aria-modal="true" aria-label="Preview">
      <div className="flex items-center gap-3 px-4 py-2 text-sm">
        <button className={`flex items-center gap-2 border px-3 py-1.5 ${selected ? "border-[#B89968] bg-[#B89968] text-[#0E1312]" : "border-white/40"}`} onClick={onToggle} role="checkbox" aria-checked={selected} aria-label="Select this photo">
          {selected ? <CheckSquare size={16} /> : <Square size={16} />} {selected ? "Selected" : "Select"}
        </button>
        <span className="truncate">{m.filename}</span>
        <span className="hidden text-white/60 sm:inline">{m.width && m.height ? `${m.width}×${m.height}` : ""}{m.sizeBytes ? ` · ${formatBytes(m.sizeBytes)}` : ""}{m.match ? ` · ${m.match.confident ? "confident" : "possible"} match` : ""}</span>
        <span className="ml-auto text-white/60">{i + 1} of {list.length}</span>
        <button className="icon-btn !text-white" onClick={onClose} aria-label="Close preview"><X size={20} /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden" onClick={onClose}>
        {m.kind === "video" ? (
          <video src={src} poster={m.poster} controls autoPlay className="max-h-full max-w-full" onClick={(e) => e.stopPropagation()} />
        ) : (
          <img src={src} alt="" className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
        )}
        {i > 0 && (
          <button className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 p-2 hover:bg-black/80" onClick={(e) => { e.stopPropagation(); onMove(list[i - 1].id) }} aria-label="Previous"><ChevronLeft size={24} /></button>
        )}
        {i < list.length - 1 && (
          <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 p-2 hover:bg-black/80" onClick={(e) => { e.stopPropagation(); onMove(list[i + 1].id) }} aria-label="Next"><ChevronRight size={24} /></button>
        )}
      </div>
      <div className="px-4 py-2 text-center text-xs text-white/50">Arrows move · space selects · Esc closes</div>
    </div>,
    document.body,
  )
}
