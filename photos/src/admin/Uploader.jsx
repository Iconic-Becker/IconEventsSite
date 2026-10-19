import { useEffect, useRef, useState } from "react"
import { UploadCloud, FolderOpen, AlertTriangle, CheckCircle2, X } from "lucide-react"
import { Uploader, collectFiles } from "./uploader.js"
import { formatBytes } from "../shared/format.js"

export function UploadZone({ galleryId, target = "album", onProgress, compact, hint }) {
  const [state, setState] = useState(null)
  const [over, setOver] = useState(false)
  const uploader = useRef()
  const folderInput = useRef()
  const fileInput = useRef()

  useEffect(() => {
    const warn = (e) => {
      if (state?.running) {
        e.preventDefault()
        e.returnValue = ""
      }
    }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [state?.running])

  const ensure = () => {
    if (!uploader.current) {
      uploader.current = new Uploader({
        galleryId,
        target,
        onChange: (s) => {
          setState({ ...s })
          onProgress?.(s)
        },
      })
    }
    return uploader.current
  }

  const addItems = async (items) => {
    if (!items.length) return
    ensure().add(items)
  }

  const onDrop = async (e) => {
    e.preventDefault()
    setOver(false)
    addItems(await collectFiles(e.dataTransfer))
  }

  const pct = state?.total ? Math.round((state.sent / state.total) * 100) : 0
  const problems = (state?.files || []).filter((f) => f.status === "failed")
  const skipped = (state?.files || []).filter((f) => f.status === "skipped")

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center border-2 border-dashed text-center transition-colors ${over ? "border-[var(--accent)] bg-[var(--bg-3)]" : "u-line"} ${compact ? "p-5" : "p-10"}`}
      >
        <UploadCloud className="u-accent mb-3" size={compact ? 24 : 32} />
        <div className={compact ? "text-sm" : "text-base"}>{target === "reel" ? "Drop a video to feature it" : "Drop a folder of photos here"}</div>
        <div className="mt-1 max-w-md text-xs u-muted">{hint || (target === "reel" ? "MP4 or MOV. It becomes a featured reel with its own share page." : "Subfolders become albums. Loose files go to the Photos album. JPEG and video only, no RAW. Re-drop the same folder any time to resume or add files.")}</div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {target !== "reel" && (
            <button className="btn btn-sm" onClick={() => folderInput.current.click()}>
              <FolderOpen size={14} /> Choose folder
            </button>
          )}
          <button className="btn btn-sm" onClick={() => fileInput.current.click()}>
            Choose files
          </button>
        </div>
        <input ref={folderInput} type="file" multiple webkitdirectory="" directory="" className="hidden" onChange={async (e) => { addItems(await collectFiles(e.target.files)); e.target.value = "" }} />
        <input ref={fileInput} type="file" multiple accept={target === "reel" ? "video/*" : "image/*,video/*"} className="hidden" onChange={async (e) => { addItems(await collectFiles(e.target.files)); e.target.value = "" }} />
      </div>

      {state && state.files.length > 0 && (
        <div className="mt-4 border u-line p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              {state.running ? <span>Uploading {state.done} of {state.files.length} files</span> : state.failed ? <span className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-600" /> {state.failed} file{state.failed === 1 ? "" : "s"} did not upload</span> : <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Uploaded {state.done} files. Processing continues in the background.</span>}
              <div className="text-xs u-muted">{formatBytes(state.sent)} of {formatBytes(state.total)} · {pct}%</div>
            </div>
            {state.running && (
              <button className="btn btn-sm" onClick={() => uploader.current?.cancel()}>
                <X size={14} /> Stop
              </button>
            )}
          </div>
          <div className="mt-3 h-1.5 w-full" style={{ background: "var(--bg-3)" }}>
            <div className="h-full transition-[width]" style={{ width: `${pct}%`, background: "var(--accent)" }} />
          </div>
          <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-xs">
            {state.files
              .filter((f) => f.status === "uploading")
              .slice(0, 6)
              .map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-3">
                  <span className="truncate">{f.path}</span>
                  <span className="u-muted">{Math.round((f.sent / f.size) * 100)}%</span>
                </li>
              ))}
            {problems.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 text-red-700">
                <span className="truncate">{f.path}</span>
                <span className="truncate">{f.error}</span>
              </li>
            ))}
          </ul>
          {skipped.length > 0 && (
            <details className="mt-2 text-xs u-muted">
              <summary className="cursor-pointer">{skipped.length} skipped</summary>
              <ul className="mt-1 space-y-0.5">
                {skipped.slice(0, 50).map((f) => (
                  <li key={f.id} className="truncate">{f.path}: {f.error}</li>
                ))}
              </ul>
            </details>
          )}
          {!state.running && state.failed > 0 && <p className="mt-3 text-xs u-muted">Drop the same folder again to retry only the files that failed.</p>}
        </div>
      )}
    </div>
  )
}
