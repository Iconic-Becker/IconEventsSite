// The size choice, for one file, a selection, favorites, an album or the
// whole gallery. Album and gallery zips are built once and cached.
import { useEffect, useRef, useState } from "react"
import { Download, Check } from "lucide-react"
import { Sheet, Spinner, Notice } from "../shared/ui.jsx"
import { useGallery } from "./state.jsx"
import { get, post } from "../shared/api.js"
import { formatBytes, isIOS, plural } from "../shared/format.js"

const OPTIONS = {
  social: { title: "Social", hint: "2048px, ready for Instagram, LinkedIn and messages. Smaller files." },
  full: { title: "Full resolution", hint: "The original file as delivered. Best for print and archives." },
  both: { title: "Both", hint: "Social and full resolution together." },
}

function Option({ k, onPick, busy, selected }) {
  const o = OPTIONS[k]
  return (
    <button type="button" onClick={() => onPick(k)} disabled={busy} className={`flex w-full items-center justify-between gap-4 border p-4 text-left transition-colors hover:border-[var(--accent)] ${selected ? "border-[var(--accent)]" : "u-line"}`}>
      <div>
        <div className="text-sm tracking-[0.12em] uppercase">{o.title}</div>
        <div className="mt-1 text-xs u-muted">{o.hint}</div>
      </div>
      {selected ? <Check className="u-accent shrink-0" size={18} /> : <Download className="u-muted shrink-0" size={18} />}
    </button>
  )
}

export function DownloadSheet() {
  const { downloadFor, setDownloadFor, downloadOne, downloadZip, downloadFavorites, slug, gallery } = useGallery()
  const [state, setState] = useState(null) // { size, status, parts, done, total }
  const timer = useRef()
  const close = () => {
    clearInterval(timer.current)
    setState(null)
    setDownloadFor(null)
  }
  useEffect(() => () => clearInterval(timer.current), [])

  if (!downloadFor) return null
  const { mode, items = [], label, albumId } = downloadFor

  const pick = async (size) => {
    if (mode === "one") {
      downloadOne(items[0], size)
      return close()
    }
    if (mode === "selection") {
      downloadZip(items.map((m) => m.id), size)
      return close()
    }
    if (mode === "favorites") {
      downloadFavorites(size)
      return close()
    }
    // album or gallery: lazy zip
    setState({ size, status: "building" })
    const poll = async () => {
      try {
        let d = await (state ? get(`/api/g/${slug}/zips?size=${size}${albumId ? `&albumId=${albumId}` : ""}`) : post(`/api/g/${slug}/zips`, { size, albumId: albumId || null }))
        // The gallery changed while the zip was building: ask again.
        if (d.status === "none") d = await post(`/api/g/${slug}/zips`, { size, albumId: albumId || null })
        setState((s) => ({ ...(s || {}), size, ...d }))
        if (d.status === "ready") {
          clearInterval(timer.current)
          if (d.parts?.length === 1) window.location.assign(d.parts[0].url)
        }
        if (d.status === "failed") clearInterval(timer.current)
      } catch (err) {
        clearInterval(timer.current)
        setState({ size, status: "failed", error: err.message })
      }
    }
    await poll()
    timer.current = setInterval(poll, 3000)
  }

  const ios = isIOS()
  const keys = mode === "one" || mode === "selection" || mode === "favorites" ? ["social", "full", "both"] : ["social", "full"]
  const count = mode === "one" ? 1 : items.length

  return (
    <Sheet open onClose={close} title={label || "Download"}>
      {mode === "selection" && <p className="mb-4 text-sm u-fg2">{plural(count, "item")} as one zip.</p>}
      {(mode === "album" || mode === "gallery") && <p className="mb-4 text-sm u-fg2">{gallery.counts.photos > 300 ? "Large galleries arrive as a few zip files of about 2 GB each." : "Everything arrives as one zip."}</p>}
      {ios && mode === "one" && <p className="mb-4 text-xs u-muted">On iPhone and iPad, "Both" arrives as one zip.</p>}
      <div className="space-y-2">
        {keys.map((k) => (
          <Option key={k} k={k} onPick={pick} busy={state?.status === "building"} selected={state?.size === k} />
        ))}
      </div>
      {state?.status === "building" && (
        <div className="mt-5 flex items-center gap-3 border u-line p-4 text-sm">
          <Spinner />
          <div>
            <div>Preparing your download</div>
            <div className="text-xs u-muted">{state.total ? `${state.done} of ${state.total} parts ready. ` : ""}This can take a few minutes the first time. Keep this page open.</div>
          </div>
        </div>
      )}
      {state?.status === "ready" && (
        <div className="mt-5 space-y-2">
          {state.parts.length > 1 && <p className="text-xs u-muted">Your download is split into {state.parts.length} parts.</p>}
          {state.parts.map((p) => (
            <a key={p.part} href={p.url} className="btn w-full justify-between">
              <span>{state.parts.length > 1 ? `Part ${p.part} of ${state.parts.length}` : "Download zip"}</span>
              <span className="u-muted normal-case tracking-normal">{formatBytes(p.bytes)}</span>
            </a>
          ))}
        </div>
      )}
      {state?.status === "failed" && (
        <div className="mt-5">
          <Notice kind="error">The download could not be prepared. Try again in a minute.</Notice>
        </div>
      )}
    </Sheet>
  )
}

export function Toast() {
  const { toast } = useGallery()
  if (!toast) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[1100] flex justify-center px-4" role="status">
      <div className="border px-4 py-2 text-sm shadow-xl" style={{ background: "var(--fg)", color: "var(--bg)", borderColor: "var(--accent)" }}>
        {toast}
      </div>
    </div>
  )
}
