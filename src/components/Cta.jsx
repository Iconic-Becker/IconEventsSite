import { useEffect, useRef, useState } from "react"
import { sendEnquiry, ENQUIRY_EMAIL } from "../lib/enquiry.js"
import { navigate } from "../navigate.js"
import { CTA } from "../content.js"
import { useVoice } from "../voice.jsx"
import Icon from "./Icon.jsx"

function Eyebrow({ text }) {
  return (
    <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
      {text ?? CTA.eyebrow}
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

/* A required single choice, shown as a row of chips. Nothing is pre-selected,
   so every answer that reaches the inbox is one the visitor picked. */
export function ChoiceGroup({ label, options, value, onChange, missing }) {
  return (
    <fieldset>
      <legend className="flex flex-wrap items-baseline gap-x-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">
        {label}
        {missing && (
          <span role="alert" className="normal-case tracking-normal text-[#a3271f]">Pick one</span>
        )}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={`min-h-11 border px-3.5 py-2 text-left font-sans text-sm leading-snug transition ${selected ? "border-brass bg-brass text-onyx" : missing ? "border-[#a3271f]/50 bg-onyx/[0.04] text-onyx/75 hover:border-brass" : "border-onyx/25 bg-onyx/[0.04] text-onyx/75 hover:border-brass"}`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function TextField({ label, ...props }) {
  return (
    <label className="block">
      <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">{label}</span>
      <input
        {...props}
        className="mt-2 min-h-12 w-full border border-onyx/25 bg-transparent px-4 font-sans text-base text-onyx placeholder-onyx/40 outline-none transition focus:border-brass"
      />
    </label>
  )
}

/* Anything sent sooner than this after the form appeared is a script: nobody
   reads and answers seven questions in three seconds. */
export const MIN_FILL_MS = 3000

/* ── Start a Conversation · The Brief ─────────────────────────────────
   Full-height, patterned close. A gold-bordered paper card: who you are,
   four required single choices, one optional note, then send. */
/* eyebrow and title override the homepage copy, so a case study can close
   on its own line above the same form. */
export default function Cta({ modal = false, split = false, eyebrow, title, aside }) {
  const { t } = useVoice()
  const f = CTA.form
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [event, setEvent] = useState("")
  const [guests, setGuests] = useState("")
  const [budget, setBudget] = useState("")
  const [timing, setTiming] = useState("")
  const [notes, setNotes] = useState("")
  const [botcheck, setBotcheck] = useState("")
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState("idle")
  const shownAt = useRef(0)
  useEffect(() => {
    shownAt.current = Date.now()
  }, [])

  const choicesMade = event && guests && budget && timing
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function submit(e) {
    e.preventDefault()
    setTried(true)
    if (!name.trim() || !emailOk || !company.trim() || !choicesMade) return
    /* Bots: the hidden field is filled, or the form went back too fast.
       Show them the same receipt a person gets, send nothing, count nothing. */
    if (botcheck || Date.now() - shownAt.current < MIN_FILL_MS) {
      navigate("/nextsteps")
      return
    }
    setStatus("loading")
    try {
      await sendEnquiry({ name, email, company, event, guests, budget, timing, notes })
      /* Only past a resolved send: the confirmation page is the receipt, so
         it must never appear for an enquiry that did not reach us. */
      setStatus("done")
      /* The conversion. Fires only after the endpoint confirms delivery, so it
         counts enquiries that actually reached us. Trigger on this event name
         in GTM. */
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: "enquiry_submitted" })
      navigate("/nextsteps")
    } catch (error) {
      console.error("Enquiry failed to send:", error)
      setStatus("error")
    }
  }

  const pattern = {
    backgroundImage: "url(/images/patterns/pattern-white.webp)",
    backgroundSize: "440px auto",
    backgroundRepeat: "repeat",
  }

  return (
    <div id="contact" className={`relative flex items-center overflow-hidden bg-onyx ${modal ? "py-6 sm:py-8" : "min-h-screen py-16 sm:py-24"}`}>
      {/* brand pattern across the whole background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={pattern} aria-hidden="true" />
      {/* `split` puts the pitch on the left and the form on the right, for the
          page that is nothing but this. Below lg it stacks, which is the same
          order the single column already uses. */}
      <div className={`relative z-10 mx-auto w-full px-5 sm:px-6 ${split ? "max-w-6xl lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16" : "max-w-4xl"}`}>
        <div className={split ? "lg:sticky lg:top-28" : ""}>
        <Eyebrow text={eyebrow} />
        <h2 className={`mt-6 max-w-4xl font-serif font-semibold leading-[1.02] text-bone ${modal ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl lg:text-7xl"}`}>
          {title ?? accent(t(CTA.title), "about the room")}
        </h2>
        <p className="mt-5 max-w-xl font-sans text-lg text-bone/65">{t(CTA.formLead)}</p>
        {/* Only the split page passes this: the left column is tall enough to
            need more than a heading next to a long form. */}
        {aside}
        </div>
        <div className={split ? "lg:mt-0" : ""}>
        {status !== "done" && (
          <>
            {status === "error" && (
              <div role="alert" className="mt-8 border border-brass/60 bg-onyx/60 p-5 sm:p-6">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">
                  That didn&rsquo;t send
                </p>
                <p className="mt-3 max-w-xl font-sans text-base leading-relaxed text-bone/75">
                  Something went wrong on our end and your details did not reach us. Please email{" "}
                  <a href={`mailto:${ENQUIRY_EMAIL}`} className="text-brass underline underline-offset-4">
                    {ENQUIRY_EMAIL}
                  </a>{" "}
                  and a director will pick it up, or try the form again.
                </p>
              </div>
            )}
            <form onSubmit={submit} noValidate className={`border border-brass bg-bone text-onyx ${modal ? "mt-6 p-5 sm:p-7" : "mt-10 p-6 sm:p-12"}`}>
              {/* Signpost for vendors, so a pitch never has to come through
                  the client brief. */}
              <p className="mb-8 border-b border-onyx/15 pb-5 font-sans text-sm leading-relaxed text-onyx/65">
                Planning an event with us? You&rsquo;re in the right place. Venue, vendor or agency
                offering a service?{" "}
                <a href="/vendors" className="font-bold text-brass underline underline-offset-4 hover:text-onyx">
                  Use the partner form
                </a>
                .
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="Your name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last" autoComplete="name" />
                <TextField label="Work email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
                <div className="sm:col-span-2">
                  <TextField label="Company or website" required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="company.com" autoComplete="organization" />
                </div>
              </div>
              {tried && (!name.trim() || !emailOk || !company.trim()) && (
                <p role="alert" className="mt-3 font-sans text-sm text-[#a3271f]">Name, email and company help us come back to you properly.</p>
              )}

              {/* Honeypot. Hidden from people and screen readers; bots fill it. */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                checked={Boolean(botcheck)}
                onChange={(e) => setBotcheck(e.target.checked ? "on" : "")}
                className="hidden"
              />

              <div className="mt-9 space-y-8">
                <ChoiceGroup label={f.eventLabel} options={f.events} value={event} onChange={setEvent} missing={tried && !event} />
                <ChoiceGroup label={f.guestsLabel} options={f.guests} value={guests} onChange={setGuests} missing={tried && !guests} />
                <ChoiceGroup label={f.budgetLabel} options={f.budgets} value={budget} onChange={setBudget} missing={tried && !budget} />
                <ChoiceGroup label={f.timingLabel} options={f.timings} value={timing} onChange={setTiming} missing={tried && !timing} />
                <label className="block">
                  <span className="flex flex-wrap items-baseline gap-x-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">
                    {f.notesLabel}
                    <span className="normal-case tracking-normal text-onyx/45">Optional</span>
                  </span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder={t(f.notesPlaceholder)}
                    className="mt-3 w-full resize-y border border-onyx/25 bg-transparent px-4 py-3 font-sans text-base text-onyx placeholder-onyx/40 outline-none transition focus:border-brass"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group mt-9 flex min-h-12 w-full items-center justify-center gap-3 border border-brass bg-brass px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx transition hover:border-onyx hover:bg-onyx hover:text-bone disabled:opacity-60 sm:w-auto"
              >
                {status === "loading" ? t(f.sending) : t(f.submit)}
                {status !== "loading" && <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />}
              </button>
              <p className="mt-4 max-w-md font-sans text-xs leading-relaxed text-onyx/55">
                By sending this, you agree to our{" "}
                <a href="/privacy" className="underline underline-offset-2 transition hover:text-onyx">Privacy Policy</a> and{" "}
                <a href="/terms" className="underline underline-offset-2 transition hover:text-onyx">Terms and Conditions</a>.
              </p>
            </form>
            <p className="mt-5 max-w-xl font-sans text-xs leading-relaxed text-bone/45">
              {t(f.reassurance)}
            </p>
            {/* Vendors land on this section too, and the form above is written
                for clients. Send them somewhere that fits. */}
            {!modal && (
              <p className="mt-6 font-sans text-xs text-bone/45">
                Supplying rather than booking?{" "}
                <a
                  href="/vendors"
                  className="font-bold uppercase tracking-[0.14em] text-brass underline underline-offset-4 transition hover:text-bone"
                >
                  Join the vendor list
                </a>
              </p>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  )
}
