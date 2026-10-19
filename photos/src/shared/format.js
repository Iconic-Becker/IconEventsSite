export function formatDate(iso, opts = {}) {
  if (!iso) return ""
  const d = new Date(String(iso).slice(0, 10) + "T00:00:00Z")
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC", ...opts })
}

export function formatBytes(n) {
  if (!n) return "0 B"
  const units = ["B", "KB", "MB", "GB", "TB"]
  let i = 0
  let v = Number(n)
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v < 10 && i > 0 ? v.toFixed(1) : Math.round(v)} ${units[i]}`
}

export function formatDuration(s) {
  if (!s && s !== 0) return ""
  const total = Math.round(s)
  const m = Math.floor(total / 60)
  const sec = total % 60
  return `${m}:${String(sec).padStart(2, "0")}`
}

export const isIOS = () => typeof navigator !== "undefined" && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))

export const isTouch = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function plural(n, one, many = one + "s") {
  return `${n} ${n === 1 ? one : many}`
}
