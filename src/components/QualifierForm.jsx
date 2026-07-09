import { useState } from "react"
import Icon from "./Icon.jsx"
import { useVoice } from "../voice.jsx"
import { CTA } from "../content.js"

// On-page qualifier: business stage · timing · outcome. Filters for fit.
// Copy switches with the active brand voice.
// Swap the fake submit for your real endpoint (see the TODO).
export default function QualifierForm() {
  const { t } = useVoice()
  const f = CTA.form
  const [form, setForm] = useState({ email: "", stage: "", timing: "", outcome: "" })
  const [status, setStatus] = useState("idle") // idle | loading | done | error

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email) return
    setStatus("loading")
    try {
      // TODO: wire to your inbox / CRM, keeping the 48h promise, e.g.
      // await fetch("/api/conversations", { method: "POST", body: JSON.stringify(form) })
      await new Promise((r) => setTimeout(r, 700))
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  const field =
    "w-full border border-bone/20 bg-onyx px-4 py-3 font-sans text-sm text-bone placeholder-bone/35 outline-none transition focus:border-brass"

  if (status === "done") {
    const [before, after] = t(f.successBody).split("{email}")
    return (
      <div className="border border-brass/50 bg-onyx p-8">
        <div className="mb-4 flex h-11 w-11 items-center justify-center border border-brass text-brass">
          <Icon name="seal" className="h-6 w-6" />
        </div>
        <h3 className="font-serif text-2xl font-semibold text-bone">{t(f.successTitle)}</h3>
        <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-bone/65">
          {before}
          <span className="font-semibold text-bone">{form.email || "your inbox"}</span>
          {after}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Business stage */}
      <fieldset>
        <legend className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-brass">
          {t(f.stageLabel)}
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {f.stages.map((s) => {
            const on = form.stage === s
            return (
              <button
                type="button"
                key={s}
                onClick={() => setForm({ ...form, stage: s })}
                className={`border px-3 py-2.5 font-sans text-xs transition ${
                  on ? "border-brass bg-brass text-onyx" : "border-bone/20 text-bone/70 hover:border-bone/50"
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Timing */}
      <fieldset>
        <legend className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-brass">
          {t(f.timingLabel)}
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {f.timings.map((tm) => {
            const on = form.timing === tm
            return (
              <button
                type="button"
                key={tm}
                onClick={() => setForm({ ...form, timing: tm })}
                className={`border px-3 py-2.5 font-sans text-xs transition ${
                  on ? "border-brass bg-brass text-onyx" : "border-bone/20 text-bone/70 hover:border-bone/50"
                }`}
              >
                {tm}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Outcome */}
      <fieldset>
        <legend className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-brass">
          {t(f.outcomeLabel)}
        </legend>
        <textarea
          name="outcome"
          value={form.outcome}
          onChange={update}
          rows={2}
          placeholder={t(f.outcomePlaceholder)}
          className={field}
        />
      </fieldset>

      {/* Email + submit */}
      <input
        name="email"
        type="email"
        required
        value={form.email}
        onChange={update}
        placeholder="Work email"
        autoComplete="email"
        className={field}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="group flex w-full items-center justify-center gap-3 border border-brass bg-brass px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx transition hover:bg-bone hover:border-bone disabled:opacity-60"
      >
        {status === "loading" ? t(f.sending) : t(f.submit)}
        {status !== "loading" && (
          <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
        )}
      </button>
      {status === "error" && (
        <p className="font-sans text-sm text-red-400">That didn't go through. Try again.</p>
      )}
      <p className="font-sans text-xs leading-relaxed text-bone/45">{t(f.reassurance)}</p>
    </form>
  )
}
