// Justified, masonry or square grids with known dimensions, so nothing
// shifts as images load. Lazy loading is the browser's.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Heart, Play } from "lucide-react"
import { formatDuration } from "../shared/format.js"

function useWidth(ref) {
  const [w, setW] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)))
    ro.observe(el)
    setW(Math.floor(el.getBoundingClientRect().width))
    return () => ro.disconnect()
  }, [ref])
  return w
}

const ratio = (m) => (m.width && m.height ? m.width / m.height : 1.5)

function justify(items, width, targetH, gap) {
  const rows = []
  let row = []
  let sum = 0
  for (const m of items) {
    row.push(m)
    sum += ratio(m)
    const h = (width - gap * (row.length - 1)) / sum
    if (h <= targetH) {
      rows.push({ items: row, height: h })
      row = []
      sum = 0
    }
  }
  if (row.length) {
    const h = Math.min(targetH, (width - gap * (row.length - 1)) / sum)
    rows.push({ items: row, height: h, last: true })
  }
  return rows
}

export function Tile({ media, width, height, onOpen, favorite, onFavorite, style }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef()
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])
  return (
    <div className="tile group relative overflow-hidden" style={{ width, height, background: "var(--bg-3)", ...style }}>
      <button type="button" onClick={() => onOpen(media)} className="block h-full w-full" aria-label={media.kind === "video" ? "Play video" : "Open photo"}>
        <img ref={imgRef} src={media.thumb} alt="" width={media.width || undefined} height={media.height || undefined} loading="lazy" decoding="async" data-loaded={loaded} onLoad={() => setLoaded(true)} className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" draggable={false} />
      </button>
      {media.kind === "video" && (
        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-1 text-[11px] text-white">
          <Play size={12} fill="currentColor" />
          {formatDuration(media.duration)}
        </div>
      )}
      {onFavorite && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onFavorite(media.id)
          }}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={favorite}
          className={`absolute top-1 right-1 flex h-10 w-10 items-center justify-center text-white transition-opacity ${favorite ? "opacity-100" : "opacity-70 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"}`}
        >
          <Heart size={20} fill={favorite ? "#B89968" : "rgba(0,0,0,.25)"} color={favorite ? "#B89968" : "white"} strokeWidth={1.75} />
        </button>
      )}
    </div>
  )
}

export function Grid({ media, layout = "justified", density = "comfortable", onOpen, favorites, onFavorite }) {
  const ref = useRef()
  const width = useWidth(ref)
  const gap = density === "compact" ? 4 : 8
  const phone = width > 0 && width < 640

  const content = useMemo(() => {
    if (!width || !media.length) return null
    if (layout === "justified") {
      const target = density === "compact" ? (phone ? 150 : 230) : phone ? 210 : 320
      const rows = justify(media, width, target, gap)
      return rows.map((row, i) => (
        <div key={i} className="flex" style={{ gap, marginBottom: gap, contentVisibility: "auto", containIntrinsicSize: `auto ${Math.round(row.height)}px` }}>
          {row.items.map((m) => (
            <Tile key={m.id} media={m} width={Math.floor(row.height * ratio(m))} height={Math.round(row.height)} onOpen={onOpen} favorite={favorites?.has(m.id)} onFavorite={onFavorite} />
          ))}
        </div>
      ))
    }
    if (layout === "masonry") {
      const colMin = density === "compact" ? (phone ? 150 : 220) : phone ? 180 : 300
      const cols = Math.max(2, Math.floor((width + gap) / (colMin + gap)))
      const colW = (width - gap * (cols - 1)) / cols
      const heights = new Array(cols).fill(0)
      const columns = Array.from({ length: cols }, () => [])
      for (const m of media) {
        const c = heights.indexOf(Math.min(...heights))
        columns[c].push(m)
        heights[c] += colW / ratio(m) + gap
      }
      return (
        <div className="flex items-start" style={{ gap }}>
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col" style={{ gap, width: colW }}>
              {col.map((m) => (
                <Tile key={m.id} media={m} width={Math.floor(colW)} height={Math.round(colW / ratio(m))} onOpen={onOpen} favorite={favorites?.has(m.id)} onFavorite={onFavorite} />
              ))}
            </div>
          ))}
        </div>
      )
    }
    const colMin = density === "compact" ? (phone ? 110 : 180) : phone ? 170 : 260
    const cols = Math.max(2, Math.floor((width + gap) / (colMin + gap)))
    const size = Math.floor((width - gap * (cols - 1)) / cols)
    return (
      <div className="grid" style={{ gap, gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {media.map((m) => (
          <Tile key={m.id} media={m} width="100%" height={size} onOpen={onOpen} favorite={favorites?.has(m.id)} onFavorite={onFavorite} />
        ))}
      </div>
    )
  }, [media, layout, density, width, gap, phone, onOpen, favorites, onFavorite])

  return (
    <div ref={ref} className="w-full">
      {content}
    </div>
  )
}
