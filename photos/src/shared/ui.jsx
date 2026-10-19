import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

export function Logo({ className = "h-5", light }) {
  return <img src={light === undefined ? undefined : light ? "/brand/logo-white.png" : "/brand/logo-black.png"} alt="Iconic Events" className={className} style={light === undefined ? { content: "var(--logo)" } : undefined} />
}

export function Spinner({ className = "h-5 w-5" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  )
}

// A modal on desktop, a bottom sheet on phones. Rendered into its own
// portal on body: the lightbox marks the rest of the page inert while it
// is open, and the email gate and download chooser must work on top of it.
export function Sheet({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === "Escape" && onClose?.()
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`u-bg2 u-fg relative w-full ${wide ? "sm:max-w-3xl" : "sm:max-w-md"} max-h-[92svh] overflow-y-auto border u-line shadow-2xl`} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-center justify-between border-b u-line px-5 py-3">
          <div className="eyebrow">{title}</div>
          <button className="icon-btn -mr-3" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      {label && <span className="label">{label}</span>}
      {children}
      {hint && <span className="mt-1 block text-xs u-muted">{hint}</span>}
    </label>
  )
}

export function Notice({ kind = "info", children }) {
  const color = kind === "error" ? "border-red-400/60 text-red-200" : kind === "ok" ? "border-emerald-400/50" : "u-line"
  return <div className={`border ${color} px-4 py-3 text-sm`}>{children}</div>
}
