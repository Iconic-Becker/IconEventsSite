import { useState } from "react"
import { Heart } from "lucide-react"
import { Sheet, Field, Notice } from "../shared/ui.jsx"
import { useGallery } from "./state.jsx"

// Asked once, on the first heart. Browsing and downloads never ask.
export function EmailGate() {
  const { gate, setGate, submitGate } = useGallery()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  if (!gate) return null
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await submitGate({ email, name })
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <Sheet open onClose={() => setGate(null)} title="Save your favorites">
      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-start gap-3">
          <Heart className="u-accent mt-0.5 shrink-0" size={20} />
          <p className="text-sm leading-relaxed u-fg2">Your email saves your picks so you can find them again on any device. Iconic Events may contact you about this event.</p>
        </div>
        <Field label="Email">
          <input className="field" type="email" required autoFocus autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Name (optional)">
          <input className="field" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        {err && <Notice kind="error">{err}</Notice>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Saving" : "Save favorite"}
        </button>
      </form>
    </Sheet>
  )
}
