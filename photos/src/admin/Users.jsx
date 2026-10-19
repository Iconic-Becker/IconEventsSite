import { useEffect, useState } from "react"
import { Plus, KeyRound, Trash2 } from "lucide-react"
import { get, post, patch, del } from "../shared/api.js"
import { Field, Notice, Spinner } from "../shared/ui.jsx"
import { useMe } from "./AdminApp.jsx"

export function Users() {
  const { me } = useMe()
  const [users, setUsers] = useState(null)
  const [form, setForm] = useState({ email: "", name: "", role: "editor", password: "" })
  const [err, setErr] = useState(null)
  const load = () => get("/api/admin/users").then((d) => setUsers(d.users))
  useEffect(() => {
    load()
  }, [])
  const add = async (e) => {
    e.preventDefault()
    setErr(null)
    try {
      await post("/api/admin/users", form)
      setForm({ email: "", name: "", role: "editor", password: "" })
      load()
    } catch (ex) {
      setErr(ex.message)
    }
  }
  const reset = async (u) => {
    const pw = prompt(`New password for ${u.email} (at least 10 characters). Tell them in person or by phone.`)
    if (!pw) return
    try {
      await patch(`/api/admin/users/${u.id}`, { password: pw })
      alert("Password changed. Their other sessions were signed out.")
    } catch (ex) {
      alert(ex.message)
    }
  }
  if (!users) return <div className="flex justify-center p-20"><Spinner /></div>
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="eyebrow mb-1">Team</div>
        <h1 className="font-title-serif text-4xl">Users</h1>
        <p className="mt-2 text-sm u-muted">Owners manage users and galleries. Editors manage galleries, including deleting. Contributors upload and arrange photos, reels and links but cannot delete anything. There is no email sending: you set each password and pass it on yourself.</p>
      </div>
      <table className="w-full border u-line text-sm">
        <thead><tr className="text-left text-[11px] uppercase u-muted" style={{ background: "var(--bg-2)" }}><th className="px-3 py-2">Name</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Status</th><th className="px-3 py-2"></th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t u-line">
              <td className="px-3 py-2">{u.name || <span className="u-muted">—</span>}</td>
              <td className="px-3 py-2">{u.email}{u.id === me.id && <span className="u-muted"> (you)</span>}</td>
              <td className="px-3 py-2">
                <select className="field !w-auto !py-1" value={u.role} disabled={u.id === me.id} onChange={(e) => patch(`/api/admin/users/${u.id}`, { role: e.target.value }).then(load)}>
                  <option value="owner">owner</option>
                  <option value="editor">editor</option>
                  <option value="contributor">contributor</option>
                </select>
              </td>
              <td className="px-3 py-2">
                <button className={`btn btn-sm ${u.disabled ? "!border-red-300 !text-red-700" : ""}`} disabled={u.id === me.id} onClick={() => patch(`/api/admin/users/${u.id}`, { disabled: !u.disabled }).then(load)}>{u.disabled ? "Disabled" : "Active"}</button>
              </td>
              <td className="px-3 py-2 text-right">
                <button className="icon-btn !h-8 !w-8" title="Reset password" onClick={() => reset(u)}><KeyRound size={14} /></button>
                <button className="icon-btn !h-8 !w-8 hover:!text-red-700" title="Delete" disabled={u.id === me.id} onClick={() => confirm(`Delete ${u.email}?`) && del(`/api/admin/users/${u.id}`).then(load)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={add} className="mt-8 grid gap-3 border u-line p-5 sm:grid-cols-2">
        <div className="eyebrow sm:col-span-2">Add a user</div>
        <Field label="Email"><input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Name"><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Role"><select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="editor">Editor</option><option value="contributor">Contributor</option><option value="owner">Owner</option></select></Field>
        <Field label="Password" hint="At least 10 characters."><input className="field" type="text" required minLength={10} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
        {err && <div className="sm:col-span-2"><Notice kind="error">{err}</Notice></div>}
        <div className="sm:col-span-2"><button className="btn btn-solid"><Plus size={14} /> Add user</button></div>
      </form>
    </main>
  )
}
