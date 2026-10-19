import { useState } from "react"
import { Lock } from "lucide-react"
import { post } from "../shared/api.js"
import { formatDate } from "../shared/format.js"
import { Notice } from "../shared/ui.jsx"

export function Locked({ gallery, onUnlocked }) {
  const [pw, setPw] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const theme = gallery.settings?.theme || "dark"
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await post(`/api/g/${gallery.slug}/unlock`, { password: pw })
      onUnlocked()
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }
  const bits = [formatDate(gallery.eventDate), gallery.location].filter(Boolean)
  return (
    <main className={`theme-${theme} u-bg u-fg flex min-h-svh flex-col items-center justify-center p-6 text-center`} style={{ background: theme === "light" ? "radial-gradient(ellipse at 50% -20%, #fff 0%, var(--color-bone) 60%)" : "radial-gradient(ellipse at 50% 120%, #1a3a3a 0%, var(--color-onyx) 60%)" }}>
      <img alt="Iconic Events" className="mb-10 h-6 w-auto" style={{ content: "var(--logo)" }} />
      {bits.length > 0 && <div className="eyebrow mb-4">{bits.join("  ·  ")}</div>}
      <h1 className={`${gallery.settings?.font === "display" ? "font-title-display" : "font-title-serif"} max-w-3xl text-4xl text-balance sm:text-6xl`}>{gallery.title}</h1>
      {gallery.subtitle && <p className="serif mt-3 text-xl italic u-fg2">{gallery.subtitle}</p>}
      <form onSubmit={submit} className="mt-10 w-full max-w-sm space-y-3">
        <div className="flex items-center gap-2 text-xs u-muted">
          <Lock size={14} /> This gallery is private. Enter the password from your host.
        </div>
        <input className="field text-center" type="password" autoFocus required value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" aria-label="Gallery password" />
        {err && <Notice kind="error">{err}</Notice>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Checking" : "Enter"}
        </button>
      </form>
    </main>
  )
}
