import { useEffect, useRef, useState } from "react"
import { Plus, Trash2, UserRound, Loader2, ImagePlus, Pencil, Check, X } from "lucide-react"
import { get, post, patch, del, api } from "../shared/api.js"
import { Field, Notice, Spinner } from "../shared/ui.jsx"
import { useCanDelete } from "./AdminApp.jsx"

// People the galleries should look for. Each needs a handful of reference
// photos; the Photos tab of every gallery then lists their matches.
export function People() {
  const canEdit = useCanDelete()
  const [people, setPeople] = useState(null)
  const [name, setName] = useState("")
  const [err, setErr] = useState(null)
  const load = () => get("/api/admin/people").then((d) => setPeople(d.people))
  useEffect(() => {
    load()
  }, [])
  const add = async (e) => {
    e.preventDefault()
    setErr(null)
    try {
      await post("/api/admin/people", { name: name.trim() })
      setName("")
      load()
    } catch (e) {
      setErr(e.message)
    }
  }
  if (!people) return <Spinner className="mx-auto mt-20 h-6 w-6" />
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-title-serif text-3xl">People</h1>
        <p className="mt-1 max-w-2xl text-sm u-muted">
          Add someone and give them five to ten clear photos of their face, from different angles and lighting. Every gallery then finds their photos on its own, under People on the Photos tab. Faces are matched on this server and nothing is sent anywhere else.
        </p>
      </div>
      {canEdit && (
        <form onSubmit={add} className="mb-8 flex flex-wrap items-end gap-2">
          <Field label="New person"><input className="field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <button className="btn btn-solid" disabled={!name.trim()}><Plus size={14} /> Add</button>
        </form>
      )}
      {err && <div className="mb-4"><Notice kind="error">{err}</Notice></div>}
      {!people.length && <div className="border u-line p-12 text-center u-muted">Nobody yet.</div>}
      <div className="space-y-6">
        {people.map((p) => (
          <PersonCard key={p.id} person={p} canEdit={canEdit} onChange={load} />
        ))}
      </div>
    </div>
  )
}

function PersonCard({ person, canEdit, onChange }) {
  const [busy, setBusy] = useState(0)
  const [err, setErr] = useState(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(person.name)
  const input = useRef()
  const upload = async (files) => {
    setErr(null)
    const problems = []
    for (const f of files) {
      setBusy((n) => n + 1)
      try {
        await api(`/api/admin/people/${person.id}/refs`, { method: "PUT", body: f, raw: true, headers: { "Content-Type": f.type || "image/jpeg" } })
      } catch (e) {
        problems.push(`${f.name}: ${e.message}`)
      } finally {
        setBusy((n) => n - 1)
      }
    }
    if (problems.length) setErr(problems.join(" · "))
    onChange()
  }
  const removeRef = async (id) => {
    await del(`/api/admin/people/${person.id}/refs/${id}`)
    onChange()
  }
  const remove = async () => {
    if (!confirm(`Remove ${person.name}? Their matches disappear from every gallery. Photos are not touched.`)) return
    await del(`/api/admin/people/${person.id}`)
    onChange()
  }
  const rename = async () => {
    await patch(`/api/admin/people/${person.id}`, { name })
    setEditing(false)
    onChange()
  }
  return (
    <div className="border u-line p-5">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <UserRound size={18} className="u-accent" />
        {editing ? (
          <form className="flex items-center gap-1" onSubmit={(e) => { e.preventDefault(); rename() }}>
            <input className="field !py-1" autoFocus value={name} onChange={(e) => setName(e.target.value)} />
            <button className="icon-btn !h-8 !w-8" aria-label="Save"><Check size={14} /></button>
            <button type="button" className="icon-btn !h-8 !w-8" aria-label="Cancel" onClick={() => setEditing(false)}><X size={14} /></button>
          </form>
        ) : (
          <h2 className="font-title-serif text-2xl">{person.name}</h2>
        )}
        <span className="text-xs u-muted">{person.refs.length} reference {person.refs.length === 1 ? "photo" : "photos"}{person.refs.length > 0 && person.refs.length < 3 ? " · add a few more for better matches" : ""}</span>
        {canEdit && (
          <span className="ml-auto flex items-center gap-1">
            <button className="btn btn-sm" onClick={() => input.current.click()} disabled={busy > 0}>
              {busy > 0 ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Add photos
            </button>
            {!editing && <button className="icon-btn" onClick={() => setEditing(true)} aria-label="Rename" title="Rename"><Pencil size={14} /></button>}
            <button className="icon-btn !text-red-700" onClick={remove} aria-label="Remove person" title="Remove person"><Trash2 size={14} /></button>
            <input ref={input} type="file" multiple accept="image/*" className="hidden" onChange={(e) => { upload([...e.target.files]); e.target.value = "" }} />
          </span>
        )}
      </div>
      {err && <div className="mb-3"><Notice kind="error">{err}</Notice></div>}
      {!person.refs.length ? (
        <p className="text-sm u-muted">No reference photos yet, so nothing is matched. Add some clear photos of {person.name}'s face.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {person.refs.map((r) => (
            <div key={r.id} className="group relative h-24 w-24 overflow-hidden" style={{ background: "var(--bg-3)" }}>
              <img src={r.url} alt="" className="h-full w-full object-cover" />
              {canEdit && (
                <button className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100" onClick={() => removeRef(r.id)} aria-label="Remove reference photo">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
