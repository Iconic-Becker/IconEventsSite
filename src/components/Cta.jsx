import { useState } from "react"
import { CTA } from "../content.js"
import { useVoice } from "../voice.jsx"
import Icon from "./Icon.jsx"

function Eyebrow() {
  return (
    <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
      {CTA.eyebrow}
    </div>
  )
}

// Wrap the first occurrence of `phrase` in a brass accent span.
function accent(text, phrase) {
  const i = text.indexOf(phrase)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className="text-brass">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  )
}

// An inline dropdown: a gold-bordered field that opens a menu of options.
function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block max-w-full align-middle">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select an option"
        className="min-h-11 max-w-full border border-brass bg-bone px-3 py-2 font-sans text-base font-bold text-brass outline-none focus:border-onyx md:hidden"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {open && (
        <span className="fixed inset-0 z-10 hidden md:block" onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative z-20 hidden items-center gap-2 md:inline-flex border border-brass px-3 py-1 font-bold text-brass transition-colors hover:bg-brass hover:text-bone"
      >
        {value}
        <Icon name="arrow" className={`h-4 w-4 transition-transform ${open ? "-rotate-90" : "rotate-90"}`} />
      </button>
      {open && (
        <span className="absolute left-0 top-full z-20 mt-1 hidden min-w-full flex-col md:flex border border-brass bg-bone shadow-2xl">
          {options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => {
                onChange(o)
                setOpen(false)
              }}
              className={`whitespace-nowrap px-4 py-2.5 text-left font-sans text-sm transition-colors hover:bg-brass hover:text-bone ${o === value ? "text-brass" : "text-onyx"}`}
            >
              {o}
            </button>
          ))}
        </span>
      )}
    </span>
  )
}

// Success block shown after submit.
function Done({ t, f, email }) {
  const [before, after] = t(f.successBody).split("{email}")
  return (
    <div className="mt-10 border border-brass bg-bone p-8 text-onyx sm:p-12">
      <div className="mb-4 flex h-11 w-11 items-center justify-center border border-brass text-brass">
        <Icon name="seal" className="h-6 w-6" />
      </div>
      <h3 className="font-serif text-2xl font-semibold text-onyx">{t(f.successTitle)}</h3>
      <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-onyx/65">
        {before}
        <span className="font-semibold text-onyx">{email || "your inbox"}</span>
        {after}
      </p>
    </div>
  )
}

/* ── Start a Conversation · The Brief ─────────────────────────────────
   Full-height, patterned close. The qualifier is a bold statement in a
   gold-bordered paper card: stage/timing are dropdowns, the outcome an
   inline field, email joined to the submit button. */
export default function Cta() {
  const { t } = useVoice()
  const f = CTA.form
  const [stage, setStage] = useState(f.stages[0])
  const [timing, setTiming] = useState(f.timings[0])
  const [outcome, setOutcome] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle")

  async function submit(e) {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      // TODO: wire to your inbox / CRM, keeping the 48h promise.
      await new Promise((r) => setTimeout(r, 700))
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  const pattern = {
    backgroundImage: "url(/images/patterns/pattern-white.webp)",
    backgroundSize: "440px auto",
    backgroundRepeat: "repeat",
  }

  return (
    <div id="contact" className="relative flex min-h-screen items-center overflow-hidden bg-onyx py-16 sm:py-24">
      {/* brand pattern across the whole background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={pattern} aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 sm:px-6">
        <Eyebrow />
        <h2 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] text-bone sm:text-6xl lg:text-7xl">
          {accent(t(CTA.title), "about the room")}
        </h2>
        <p className="mt-5 max-w-xl font-sans text-lg text-bone/65">{t(CTA.formLead)}</p>
        {status === "done" ? (
          <Done t={t} f={f} email={email} />
        ) : (
          <>
            <form onSubmit={submit} className="mt-10 border border-brass bg-bone p-8 text-onyx sm:p-12">
              <p className="font-serif text-2xl font-bold leading-[1.8] text-onyx sm:text-3xl sm:leading-[1.75]">
                We&rsquo;re a founder-led business at{" "}
                <Dropdown value={stage} options={f.stages} onChange={setStage} />
                . The room is{" "}
                <Dropdown value={timing} options={f.timings} onChange={setTiming} />
                . The outcome we need is:
              </p>
              <label htmlFor="desired-outcome" className="mt-7 block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass md:hidden">
                Type the result the room has to produce
              </label>
              <input
                id="desired-outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                placeholder={t(f.outcomePlaceholder)}
                className="mt-2 block w-full border border-onyx/25 bg-onyx/[0.04] px-3 py-3 font-serif text-2xl font-bold text-onyx placeholder-onyx/45 outline-none transition focus:border-brass md:mt-6 md:border-x-0 md:border-t-0 md:border-b-2 md:bg-transparent md:px-0 md:pb-3 sm:text-3xl"
              />

              {/* Mobile: one connected process, split into two clear steps. */}
              <div className="mt-10 space-y-3 border border-onyx/20 bg-onyx/[0.06] p-3 md:hidden">
                <label className="block border border-onyx/15 bg-bone p-3">
                  <span className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-brass">Step 1 · Your work email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email"
                    autoComplete="email"
                    className="min-h-12 w-full border border-onyx/25 bg-transparent px-4 font-sans text-base text-onyx placeholder-onyx/45 outline-none transition focus:border-brass"
                  />
                </label>
                <div className="border border-brass/40 bg-bone p-3">
                  <span className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-brass">Step 2 · Send your brief</span>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group flex min-h-12 w-full items-center justify-center gap-3 border border-brass bg-brass px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx transition disabled:opacity-60"
                  >
                    {status === "loading" ? t(f.sending) : t(f.submit)}
                    {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Desktop: email joined to the submit button. */}
              <div className="mt-12 hidden md:flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Work email"
                  autoComplete="email"
                  className="min-w-0 flex-1 border border-r-0 border-onyx/30 bg-transparent px-5 py-4 font-sans text-sm text-onyx placeholder-onyx/45 outline-none transition focus:border-brass"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group inline-flex shrink-0 items-center gap-3 border border-brass bg-brass px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx transition hover:border-onyx hover:bg-onyx hover:text-bone disabled:opacity-60"
                >
                  {status === "loading" ? t(f.sending) : t(f.submit)}
                  {status !== "loading" && <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />}
                </button>
              </div>
            </form>
            <p className="mt-5 max-w-xl font-sans text-xs leading-relaxed text-bone/45">
              {t(f.reassurance)}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
