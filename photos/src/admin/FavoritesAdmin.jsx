import { useEffect, useState } from "react"
import { Copy, Download } from "lucide-react"
import { get } from "../shared/api.js"
import { Spinner } from "../shared/ui.jsx"
import { plural } from "../shared/format.js"
import { useEditor } from "./GalleryEditor.jsx"

export function FavoritesTab() {
  const { gallery } = useEditor()
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(null)
  useEffect(() => {
    get(`/api/admin/galleries/${gallery.id}/favorites`).then(setData)
  }, [gallery.id])
  if (!data) return <div className="flex justify-center p-20"><Spinner /></div>
  const copy = async (key, picks) => {
    // Comma separated filenames paste straight into Lightroom's filter.
    await navigator.clipboard.writeText(picks.map((p) => p.filename).join(", "))
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }
  const all = [...new Map(data.guests.flatMap((g) => g.picks).map((p) => [p.id, p])).values()]
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-title-serif text-2xl">{plural(data.guests.length, "guest")}</h2>
          <div className="text-xs u-muted">{plural(all.length, "photo")} favorited in total</div>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-sm" onClick={() => copy("all", all)} disabled={!all.length}><Copy size={14} /> {copied === "all" ? "Copied" : "Copy all filenames"}</button>
          <a className="btn btn-sm" href={`/api/admin/galleries/${gallery.id}/favorites.csv`}><Download size={14} /> CSV</a>
        </div>
      </div>
      {!data.guests.length && <div className="border u-line p-16 text-center u-muted">No guest has saved a favorite yet.</div>}
      <div className="space-y-4">
        {data.guests.map((g) => (
          <div key={g.id} className="border u-line p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{g.name || <span className="u-muted">No name</span>} <span className="u-muted">· {g.email}</span></div>
                <div className="text-xs u-muted">{plural(g.picks.length, "pick")} · first seen {new Date(g.firstSeen).toLocaleString()}</div>
              </div>
              <button className="btn btn-sm" onClick={() => copy(g.id, g.picks)} disabled={!g.picks.length}><Copy size={14} /> {copied === g.id ? "Copied" : "Copy filenames"}</button>
            </div>
            {g.picks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {g.picks.map((p) => (
                  <div key={p.id} className="relative h-20 w-20 overflow-hidden" style={{ background: "var(--bg-3)" }} title={p.filename}>
                    {p.thumb && <img src={p.thumb} alt="" className="h-full w-full object-cover" loading="lazy" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
