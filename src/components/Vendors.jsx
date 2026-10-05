import { useEffect, useState } from "react"
import SiteHeader from "./SiteHeader.jsx"
import Icon from "./Icon.jsx"
import { sendVendorApplication, ENQUIRY_EMAIL } from "../lib/enquiry.js"

/* What Iconic buys in. Edit this list rather than the markup: the form, the
   submitted email and the count below all read from it. Keep "Something else"
   last, it is the escape hatch and the layout gives it the full row. */
const DISCIPLINES = [
  "Audio visual and staging",
  "Lighting design",
  "Sound and audio",
  "Video, content and live stream",
  "Photography",
  "Set build and scenic",
  "Furniture, decor and rentals",
  "Florals and styling",
  "Catering and bar",
  "Talent and entertainment",
  "Venue",
  "Staffing and crew",
  "Security",
  "Transport and logistics",
  "Print and signage",
  "Something else",
]

const TITLE = "Vendor sign-up · Iconic Events"
const DESCRIPTION =
  "Join the vendor list at Iconic Events. We work with audio visual, lighting, staging, catering, photography and production partners across South Florida and beyond."

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-brass">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1.5 block font-sans text-[11px] text-onyx/50">{hint}</span>}
    </label>
  )
}

const inputClass =
  "min-h-12 w-full border border-onyx/25 bg-transparent px-4 font-sans text-base text-onyx placeholder-onyx/45 outline-none transition focus:border-brass"

export default function Vendors() {
  const [company, setCompany] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [coverage, setCoverage] = useState("")
  const [disciplines, setDisciplines] = useState([])
  const [insured, setInsured] = useState(false)
  const [notes, setNotes] = useState("")
  const [status, setStatus] = useState("idle")

  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  const toggle = (option) =>
    setDisciplines((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option]
    )

  async function submit(event) {
    event.preventDefault()
    if (!company || !name || !email) return
    setStatus("loading")
    try {
      await sendVendorApplication({ company, name, email, phone, website, coverage, disciplines, insured, notes })
      /* Only past a resolved send. A sign-up that did not reach us must never
         show a confirmation. */
      setStatus("done")
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: "vendor_signup" })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error) {
      console.error("Vendor sign-up failed to send:", error)
      setStatus("error")
    }
  }

  const pattern = {
    backgroundImage: "url(/images/patterns/pattern-white.webp)",
    backgroundSize: "440px auto",
    backgroundRepeat: "repeat",
  }

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-brass/25 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={pattern} aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="border-b-4 border-brass/40 pb-3">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">Vendors</span>
          </div>
          <h1 className="mt-8 max-w-4xl font-serif text-4xl font-semibold leading-[1.0] sm:text-7xl">
            Work the rooms we build.
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-bone/70">
            We produce masterminds, summits, conferences and brand activations, and we buy in the
            crews and kit that make them run. Tell us what you do and where you do it, and we will
            keep you on the list we work from.
          </p>
        </div>
      </section>

      <section className="relative py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6">
          {status === "done" ? (
            <div className="border border-brass bg-bone p-8 text-onyx sm:p-12">
              <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                You&rsquo;re on the list.
              </h2>
              <p className="mt-5 font-sans text-base leading-relaxed text-onyx/70">
                We have your details. When a room needs what you do, a producer will reach out
                directly. Nothing further is needed from you.
              </p>
              <a
                href="/"
                className="mt-8 inline-flex min-h-12 items-center gap-3 border border-brass bg-brass px-6 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx"
              >
                Back to Iconic Events
                <Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="border border-brass bg-bone p-6 text-onyx sm:p-10">
              {status === "error" && (
                <div className="mb-8 border-l-[3px] border-brass bg-onyx/[0.06] p-4">
                  <p className="font-sans text-sm leading-relaxed text-onyx/80">
                    That did not send. Nothing has reached us, so please try again, or email{" "}
                    <a href={`mailto:${ENQUIRY_EMAIL}`} className="underline underline-offset-4">
                      {ENQUIRY_EMAIL}
                    </a>{" "}
                    and we will add you by hand.
                  </p>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Company">
                  <input required value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" autoComplete="organization" className={inputClass} />
                </Field>
                <Field label="Your name">
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last name" autoComplete="name" className={inputClass} />
                </Field>
                <Field label="Email">
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" autoComplete="email" className={inputClass} />
                </Field>
                <Field label="Phone" hint="Optional, but it is how a producer reaches you on a show day.">
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" autoComplete="tel" className={inputClass} />
                </Field>
                <Field label="Website or portfolio">
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" autoComplete="url" className={inputClass} />
                </Field>
                <Field label="Where you work" hint="Cities or regions you cover, and whether you travel.">
                  <input value={coverage} onChange={(e) => setCoverage(e.target.value)} placeholder="South Florida, nationwide, …" className={inputClass} />
                </Field>
              </div>

              <fieldset className="mt-9">
                <legend className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">
                  What you do. Select everything that applies.
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {DISCIPLINES.map((option) => {
                    const selected = disciplines.includes(option)
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => toggle(option)}
                        className={`flex min-h-12 items-center justify-between gap-3 border px-3 py-2.5 text-left font-sans text-xs leading-snug transition last:sm:col-span-2 sm:min-h-14 sm:px-4 sm:text-sm ${selected ? "border-brass bg-brass text-onyx" : "border-onyx/25 bg-onyx/[0.04] text-onyx/70 hover:border-brass"}`}
                      >
                        <span>{option}</span>
                        <span className="text-lg" aria-hidden="true">{selected ? "×" : "+"}</span>
                      </button>
                    )
                  })}
                </div>
              </fieldset>

              <label className="mt-7 flex cursor-pointer items-start gap-3 border border-onyx/20 bg-onyx/[0.04] p-4">
                <input type="checkbox" checked={insured} onChange={(e) => setInsured(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#b89968]" />
                <span className="font-sans text-sm leading-snug text-onyx/75">
                  We carry our own liability insurance and can provide a certificate on request.
                </span>
              </label>

              <div className="mt-7">
                <Field label="Anything else" hint="Kit list, crew size, events you have worked, rates. Whatever helps.">
                  <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-full border border-onyx/25 bg-transparent p-4 font-sans text-base leading-relaxed text-onyx placeholder-onyx/45 outline-none transition focus:border-brass" />
                </Field>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="group mt-9 flex min-h-12 w-full items-center justify-center gap-3 border border-brass bg-brass px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx transition disabled:opacity-60 sm:min-h-14"
              >
                {status === "loading" ? "Sending" : "Join the vendor list"}
                {status !== "loading" && <Icon name="arrow" className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-bone/10 py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <a href="/" className="inline-block bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx">
            Back to Iconic Events
          </a>
        </div>
      </footer>
    </main>
  )
}
