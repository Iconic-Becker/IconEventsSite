// Per-gallery look, with a live preview that switches between phone and
// desktop. Changes save as you make them.
import { useEffect, useMemo, useRef, useState } from "react"
import { Smartphone, Monitor, Check, Upload, X } from "lucide-react"
import { api, patch, del } from "../shared/api.js"
import { Field, Sheet } from "../shared/ui.jsx"
import { Cover } from "../guest/Cover.jsx"
import { useEditor } from "./GalleryEditor.jsx"

const LAYOUTS = [
  ["full-bleed", "Full bleed", "One photo edge to edge, title over it."],
  ["split", "Split", "Photo beside a solid panel with the details. Stacks on phones."],
  ["video", "Video", "The trailer loops muted behind the title."],
  ["mosaic", "Mosaic", "Three to five photos in a collage."],
  ["title-card", "Title card", "Type only, on the brand colour."],
]
const CHOICES = {
  theme: [["dark", "Dark (onyx)"], ["light", "Light (bone)"]],
  font: [["serif", "Cormorant Garamond"], ["display", "Causten"]],
  grid: [["justified", "Justified"], ["masonry", "Masonry"], ["square", "Square"]],
  density: [["comfortable", "Comfortable"], ["compact", "Compact"]],
  animation: [["fade", "Fade"], ["zoom", "Slow zoom"], ["none", "None"]],
  align: [["center", "Centered"], ["left", "Left"]],
}

function Choice({ label, value, options, onChange }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map(([v, text]) => (
          <button key={v} type="button" onClick={() => onChange(v)} className={`border px-3 py-1.5 text-xs ${value === v ? "choice-on" : "u-line hover:border-[var(--fg)]"}`}>
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}

export function DesignTab() {
  const { gallery, setGallery } = useEditor()
  const [draft, setDraft] = useState(() => ({ title: gallery.title, subtitle: gallery.subtitle, eventDate: gallery.eventDate || "", location: gallery.location, intro: gallery.intro, coverMediaId: gallery.cover?.id || null, settings: gallery.settings }))
  const [device, setDevice] = useState("phone")
  const [picker, setPicker] = useState(null) // 'cover' | 'mosaic'
  const [saved, setSaved] = useState("saved")
  const timer = useRef()
  const first = useRef(true)

  // Saves on demand from the button, and on its own a moment after each
  // change so nothing is lost if the tab is closed.
  const persist = async (d) => {
    clearTimeout(timer.current)
    setSaved("saving")
    try {
      const { gallery: g } = await patch(`/api/admin/galleries/${gallery.id}`, { ...d, eventDate: d.eventDate || null })
      setGallery(g)
      setSaved("saved")
    } catch (err) {
      setSaved(err.message)
    }
  }
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setSaved("dirty")
    clearTimeout(timer.current)
    timer.current = setTimeout(() => persist(draft), 1500)
    return () => clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const set = (k, v) => setDraft((d) => ({ ...d, [k]: v }))
  const setS = (k, v) => setDraft((d) => ({ ...d, settings: { ...d.settings, [k]: v } }))
  const photos = gallery.media.filter((m) => m.status === "ready" && m.kind === "photo" && m.albumId)
  const byId = (id) => gallery.media.find((m) => m.id === id)

  const preview = useMemo(
    () => ({
      ...gallery,
      ...draft,
      eventDate: draft.eventDate || null,
      settings: draft.settings,
      cover: byId(draft.coverMediaId) || null,
      mosaic: (draft.settings.mosaicIds || []).map(byId).filter(Boolean),
      coverVideo: gallery.reels.find((r) => r.id === draft.settings.coverVideoId) || gallery.reels[0] || null,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gallery, draft],
  )

  const uploadLogo = async (file) => {
    if (!file) return
    const { gallery: g } = await api(`/api/admin/galleries/${gallery.id}/logo`, { method: "PUT", body: file, raw: true, headers: { "Content-Type": file.type } })
    setGallery(g)
  }

  const focalRef = useRef()
  const setFocal = (e) => {
    const r = focalRef.current.getBoundingClientRect()
    setS("focal", { x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)) })
  }
  const cover = byId(draft.coverMediaId)

  return (
    <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
      <div className="space-y-6">
        <div className="sticky top-0 z-20 -mx-1 flex items-center justify-between gap-3 px-1 py-2" style={{ background: "var(--bg)" }}>
          <h2 className="font-title-serif text-2xl">Design</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs u-muted">
              {saved === "saving" ? "Saving" : saved === "saved" ? <span className="flex items-center gap-1"><Check size={12} /> Saved</span> : saved === "dirty" ? "Unsaved changes" : <span className="text-red-700">{saved}</span>}
            </span>
            <button type="button" className="btn btn-solid btn-sm" onClick={() => persist(draft)} disabled={saved === "saving" || saved === "saved"}>
              {saved === "saved" ? "Saved" : "Save changes"}
            </button>
          </div>
        </div>

        <div>
          <div className="label">Cover layout</div>
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {LAYOUTS.map(([v, name, hint]) => (
              <button key={v} type="button" onClick={() => setS("layout", v)} className={`border p-3 text-left ${draft.settings.layout === v ? "border-[var(--fg)]" : "u-line hover:border-[var(--fg)]"}`}>
                <div className="text-sm">{name}</div>
                <div className="text-xs u-muted">{hint}</div>
              </button>
            ))}
          </div>
          {draft.settings.layout === "video" && !gallery.reels.length && <p className="mt-2 text-xs text-amber-700">Add a reel in the Reels tab first. Until then the cover falls back to Full bleed.</p>}
          {draft.settings.layout === "video" && gallery.reels.length > 1 && (
            <Field label="Cover video">
              <select className="field" value={draft.settings.coverVideoId || gallery.reels[0].id} onChange={(e) => setS("coverVideoId", Number(e.target.value))}>
                {gallery.reels.map((r) => <option key={r.id} value={r.id}>{r.title || `Reel ${r.id}`}</option>)}
              </select>
            </Field>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="label">Cover photo</div>
            <button type="button" onClick={() => setPicker("cover")} className="relative block aspect-[3/2] w-full overflow-hidden border u-line hover:border-[var(--fg)]" style={{ background: "var(--bg-3)" }}>
              {cover ? <img src={cover.thumb} alt="" className="h-full w-full object-cover" /> : <span className="absolute inset-0 flex items-center justify-center text-xs u-muted">Choose</span>}
            </button>
            {cover && <p className="mt-1 text-[11px] u-muted">Click the focal point on the right to set the crop.</p>}
          </div>
          <div>
            <div className="label">Mosaic photos (3 to 5)</div>
            <button type="button" onClick={() => setPicker("mosaic")} className="grid aspect-[3/2] w-full grid-cols-3 gap-0.5 border u-line hover:border-[var(--fg)]" style={{ background: "var(--bg-3)" }}>
              {(draft.settings.mosaicIds || []).map(byId).filter(Boolean).map((m) => <img key={m.id} src={m.thumb} alt="" className="h-full w-full object-cover" />)}
              {!(draft.settings.mosaicIds || []).length && <span className="col-span-3 flex items-center justify-center text-xs u-muted">Choose</span>}
            </button>
          </div>
        </div>

        {cover && (
          <div>
            <div className="label">Focal point</div>
            <div ref={focalRef} onClick={setFocal} className="relative aspect-[3/2] w-full cursor-crosshair overflow-hidden" style={{ background: "var(--bg-3)" }}>
              <img src={cover.display || cover.thumb} alt="" className="h-full w-full object-contain" draggable={false} />
              <span className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 border-2 border-[#B89968]" style={{ left: `${(draft.settings.focal?.x ?? 0.5) * 100}%`, top: `${(draft.settings.focal?.y ?? 0.5) * 100}%`, boxShadow: "0 0 0 2px rgba(0,0,0,.5)" }} />
            </div>
          </div>
        )}

        <Choice label="Text alignment" value={draft.settings.align || "center"} options={CHOICES.align} onChange={(v) => setS("align", v)} />
        <Choice label="Theme" value={draft.settings.theme} options={CHOICES.theme} onChange={(v) => setS("theme", v)} />
        <Choice label="Title type" value={draft.settings.font} options={CHOICES.font} onChange={(v) => setS("font", v)} />
        <Choice label="Grid" value={draft.settings.grid} options={CHOICES.grid} onChange={(v) => setS("grid", v)} />
        <Choice label="Density" value={draft.settings.density} options={CHOICES.density} onChange={(v) => setS("density", v)} />
        <Choice label="Cover animation" value={draft.settings.animation} options={CHOICES.animation} onChange={(v) => setS("animation", v)} />

        <div className="space-y-3 border-t u-line pt-5">
          <Field label="Title"><input className="field" value={draft.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <Field label="Subtitle"><input className="field" value={draft.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Event date"><input className="field" type="date" value={draft.eventDate} onChange={(e) => set("eventDate", e.target.value)} /></Field>
            <Field label="Location"><input className="field" value={draft.location} onChange={(e) => set("location", e.target.value)} /></Field>
          </div>
          <Field label="Intro line"><textarea className="field" rows={2} value={draft.intro} onChange={(e) => set("intro", e.target.value)} /></Field>
          <div className="space-y-2 border-t u-line pt-4">
            <div className="label">Sponsor banner</div>
            <p className="text-xs u-muted">A one-line strip under the cover and on every album page, linking out. Leave the text empty for no banner. Clicks are counted in Analytics.</p>
            <input className="field" placeholder="From our main sponsor Highstoke: claim your free Growth Plan call" value={draft.settings.banner?.text || ""} onChange={(e) => setS("banner", { ...(draft.settings.banner || {}), text: e.target.value })} />
            <div className="grid grid-cols-[1fr_2fr] gap-2">
              <input className="field" placeholder="Link text (Learn more)" value={draft.settings.banner?.cta || ""} onChange={(e) => setS("banner", { ...(draft.settings.banner || {}), cta: e.target.value })} />
              <input className="field" placeholder="https://..." value={draft.settings.banner?.url || ""} onChange={(e) => setS("banner", { ...(draft.settings.banner || {}), url: e.target.value })} />
            </div>
          </div>
          <div>
            <div className="label">Client logo</div>
            <div className="flex items-center gap-3">
              {gallery.clientLogo ? (
                <>
                  <img src={gallery.clientLogo} alt="" className="h-10 max-w-[160px] border u-line object-contain p-1" />
                  <button className="btn btn-sm" onClick={() => del(`/api/admin/galleries/${gallery.id}/logo`).then((d) => setGallery(d.gallery))}><X size={12} /> Remove</button>
                </>
              ) : (
                <label className="btn btn-sm cursor-pointer">
                  <Upload size={12} /> Upload PNG or SVG
                  <input type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" className="hidden" onChange={(e) => uploadLogo(e.target.files[0])} />
                </label>
              )}
              <span className="text-xs u-muted">Shown beside the Iconic Events logo. White or light logos suit the dark theme.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="xl:sticky xl:top-4 xl:self-start">
        <div className="mb-3 flex items-center justify-between">
          <div className="eyebrow">Live preview</div>
          <div className="flex border u-line">
            <button className={`flex items-center gap-2 px-3 py-1.5 text-xs ${device === "phone" ? "choice-on" : ""}`} onClick={() => setDevice("phone")}><Smartphone size={14} /> Phone</button>
            <button className={`flex items-center gap-2 px-3 py-1.5 text-xs ${device === "desktop" ? "choice-on" : ""}`} onClick={() => setDevice("desktop")}><Monitor size={14} /> Desktop</button>
          </div>
        </div>
        <PreviewFrame device={device}>
          <Cover key={`${device}-${draft.settings.layout}-${draft.settings.animation}`} gallery={preview} onEnter={() => {}} style={{ height: "100%" }} />
        </PreviewFrame>
      </div>

      <Sheet open={picker === "cover"} onClose={() => setPicker(null)} title="Cover photo" wide>
        <PhotoPicker photos={photos} selected={draft.coverMediaId ? [draft.coverMediaId] : []} onPick={(id) => { set("coverMediaId", id); setPicker(null) }} />
      </Sheet>
      <Sheet open={picker === "mosaic"} onClose={() => setPicker(null)} title="Mosaic photos" wide>
        <p className="mb-3 text-xs u-muted">Pick 3 to 5 in order. The first is the largest.</p>
        <PhotoPicker photos={photos} selected={draft.settings.mosaicIds || []} multi onPick={(id) => {
          const cur = draft.settings.mosaicIds || []
          setS("mosaicIds", cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 5 ? [...cur, id] : cur)
        }} />
        <button className="btn btn-solid mt-4 w-full" onClick={() => setPicker(null)}>Done</button>
      </Sheet>
    </div>
  )
}

function PreviewFrame({ device, children }) {
  const ref = useRef()
  const [scale, setScale] = useState(1)
  const target = device === "phone" ? { w: 390, h: 760 } : { w: 1280, h: 800 }
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / target.w)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [target.w])
  return (
    <div ref={ref} className="w-full" style={{ height: target.h * scale }}>
      <div className="origin-top-left border u-line shadow-xl" style={{ width: target.w, height: target.h, transform: `scale(${scale})`, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  )
}

export function PhotoPicker({ photos, selected, onPick, multi }) {
  if (!photos.length) return <p className="u-muted">Upload photos first.</p>
  return (
    <div className="grid max-h-[60svh] grid-cols-4 gap-1 overflow-y-auto sm:grid-cols-6">
      {photos.map((m) => {
        const i = selected.indexOf(m.id)
        return (
          <button key={m.id} type="button" onClick={() => onPick(m.id)} className={`relative aspect-square overflow-hidden ${i >= 0 ? "ring-2 ring-[var(--accent)]" : ""}`} style={{ background: "var(--bg-3)" }}>
            <img src={m.thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
            {i >= 0 && multi && <span className="absolute top-1 left-1 bg-[#B89968] px-1.5 text-xs text-[#0E1312]">{i + 1}</span>}
          </button>
        )
      })}
    </div>
  )
}
