import { useState } from "react"
import { post } from "../shared/api.js"
import { Field, Notice } from "../shared/ui.jsx"

export function Login({ onLogin, needsSetup }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    try {
      await post("/api/admin/login", { email, password })
      await onLogin()
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="theme-light u-bg u-fg flex min-h-svh items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 border u-line p-8" style={{ background: "var(--bg-2)" }}>
        <img src="/brand/logo-black.png" alt="Iconic Events" className="h-8 w-auto" />
        <div>
          <div className="eyebrow mb-1">Photos</div>
          <h1 className="font-title-serif text-3xl">Sign in</h1>
        </div>
        {needsSetup && <Notice>No accounts exist yet. Create the first owner with <code>npm run setup-owner</code> or the OWNER_EMAIL and OWNER_PASSWORD variables. See the README.</Notice>}
        <Field label="Email">
          <input className="field" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Password">
          <input className="field" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {err && <Notice kind="error">{err}</Notice>}
        <button className="btn btn-solid w-full" disabled={busy}>
          {busy ? "Signing in" : "Sign in"}
        </button>
      </form>
    </main>
  )
}
