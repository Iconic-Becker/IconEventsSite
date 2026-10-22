import { useEffect, useState } from "react"
import { get } from "../shared/api.js"
import { Spinner } from "../shared/ui.jsx"
import { useEditor } from "./GalleryEditor.jsx"

function Tile({ label, value, sub }) {
  return (
    <div className="border u-line p-4">
      <div className="label">{label}</div>
      <div className="font-title-serif text-3xl">{value ?? 0}</div>
      {sub && <div className="text-xs u-muted">{sub}</div>}
    </div>
  )
}

export function AnalyticsTab() {
  const { gallery } = useEditor()
  const [data, setData] = useState(null)
  useEffect(() => {
    get(`/api/admin/galleries/${gallery.id}/analytics`).then(setData)
  }, [gallery.id])
  if (!data) return <div className="flex justify-center p-20"><Spinner /></div>
  const t = data.totals
  const max = Math.max(1, ...data.perDay.map((d) => d.visitors))
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile label="Unique visitors" value={t.visitors} sub="daily salted hash, no IPs stored" />
        <Tile label="Lightbox opens" value={t.lightbox} />
        <Tile label="Downloads" value={Number(t.social) + Number(t.full) + Number(t.zips)} sub={`${t.social} social · ${t.full} full · ${t.zips} zip`} />
        <Tile label="Reel plays" value={t.reel_plays} sub={`${t.reel_completes} watched to 90% · ${t.reel_shares} shares · ${t.reel_downloads} downloads`} />
        {gallery.settings?.banner?.text && <Tile label="Sponsor banner clicks" value={t.banner_clicks} sub={gallery.settings.banner.cta} />}
      </div>
      {data.perDay.length > 0 && (
        <div>
          <div className="label">Visitors per day, last 90 days</div>
          <div className="flex h-24 items-end gap-px border-b u-line">
            {data.perDay.map((d) => (
              <div key={d.day} title={`${d.day}: ${d.visitors} visitors, ${d.downloads} downloads`} className="flex-1" style={{ height: `${(d.visitors / max) * 100}%`, background: "var(--accent)", minWidth: 2 }} />
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="label">Most downloaded photos</div>
          {!data.media.length && <p className="text-sm u-muted">No photo activity yet.</p>}
          <ul className="divide-y u-line border u-line">
            {data.media.slice(0, 30).map((m) => (
              <li key={m.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <div className="h-10 w-14 shrink-0 overflow-hidden" style={{ background: "var(--bg-3)" }}>{m.thumb && <img src={m.thumb} alt="" className="h-full w-full object-cover" />}</div>
                <span className="min-w-0 flex-1 truncate">{m.filename}</span>
                <span className="text-xs u-muted">{m.lightbox} views · {m.social} social · {m.full} full · {m.favorites} ♥</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="label">Reels</div>
          {!data.reels.length && <p className="text-sm u-muted">No reels.</p>}
          <table className="w-full border u-line text-sm">
            <thead><tr className="text-left text-[11px] uppercase u-muted" style={{ background: "var(--bg-2)" }}><th className="px-3 py-2">Reel</th><th className="px-3 py-2 text-right">Plays</th><th className="px-3 py-2 text-right">90%</th><th className="px-3 py-2 text-right">Shares</th><th className="px-3 py-2 text-right">Downloads</th></tr></thead>
            <tbody>{data.reels.map((r) => <tr key={r.id} className="border-t u-line"><td className="px-3 py-2">{r.title || `Reel ${r.id}`} {r.isPublic && <span className="text-xs u-muted">public</span>}</td><td className="px-3 py-2 text-right">{r.plays}</td><td className="px-3 py-2 text-right">{r.completes}</td><td className="px-3 py-2 text-right">{r.shares}</td><td className="px-3 py-2 text-right">{r.downloads}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
