import { useEffect, useRef, useState } from "react"
import { sendPartner, ENQUIRY_EMAIL } from "../lib/enquiry.js"
import { ChoiceGroup, TextField, MIN_FILL_MS } from "./Cta.jsx"
import Icon from "./Icon.jsx"

const CATEGORIES = [
  "Venue",
  "AV and production",
  "Catering and hospitality",
  "Speakers and talent",
  "Software or platform",
  "Marketing or agency services",
  "Something else",
]

/* Where vendors, venues and agencies go, so a pitch has a proper home and
   the client brief on the homepage stays for people planning an event.
   Kept out of search: it is signposted from the brief, not a landing page. */
export default function Partners() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [category, setCategory] = useState("")
  const [notes, setNotes] = useState("")
  const [botcheck, setBotcheck] = useState("")
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState("idle")
  const shownAt = useRef(0)

  useEffect(() => {
    shownAt.current = Date.now()
    document.title = "Partners and vendors · Iconic Events"
    let robots = document.querySelector('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement("meta")
      robots.setAttribute("name", "robots")
      document.head.appendChild(robots)
    }
    robots.setAttribute("content", "noindex, nofollow")
    return () => robots.setAttribute("content", "index, follow")
  }, [])

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function submit(e) {
    e.preventDefault()
    setTried(true)
    if (!name.trim() || !emailOk || !company.trim() || !category) return
    if (botcheck || Date.now() - shownAt.current < MIN_FILL_MS) {
      setStatus("done")
      return
    }
    setStatus("loading")
    try {
      await sendPartner({ name, email, company, category, notes })
      setStatus("done")
    } catch (error) {
      console.error("Partner form failed to send:", error)
      setStatus("error")
    }
  }

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <header className="border-b border-bone/10 bg-onyx">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <a href="/" aria-label="Iconic Events home">
            <img src="/logos/IE_logo_white.png" alt="Iconic Events" className="h-8 w-auto" />
          </a>
          <a href="/" className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-bone/60 hover:text-brass">
            Back to site
          </a>
        </nav>
      </header>

      <section className="relative overflow-hidden py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "440px auto" }}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-6">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">Partners and vendors</p>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.02] sm:text-6xl">
            Work <span className="text-brass">with</span> us, not for a client.
          </h1>
          <p className="mt-5 max-w-xl font-sans text-lg text-bone/65">
            Venues, suppliers and agencies: this is the door for you. Our production team reads every one and
            replies when there is a fit for an upcoming room.
          </p>
          <p className="mt-3 max-w-xl font-sans text-sm text-bone/50">
            Planning an event of your own?{" "}
            <a href="/#contact" className="text-brass underline underline-offset-4">Start a conversation here</a>.
          </p>

          {status === "done" ? (
            <div className="mt-10 border border-brass bg-bone p-6 text-onyx sm:p-10">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">Received</p>
              <p className="mt-3 font-serif text-3xl font-semibold">Thank you. It&rsquo;s with our production team.</p>
              <p className="mt-3 font-sans text-base text-onyx/70">If there is a fit for an upcoming event, we will be in touch.</p>
            </div>
          ) : (
            <>
              {status === "error" && (
                <div role="alert" className="mt-8 border border-brass/60 bg-onyx/60 p-5">
                  <p className="font-sans text-base text-bone/75">
                    That didn&rsquo;t send. Please try again, or email{" "}
                    <a href={`mailto:${ENQUIRY_EMAIL}`} className="text-brass underline underline-offset-4">{ENQUIRY_EMAIL}</a>.
                  </p>
                </div>
              )}
              <form onSubmit={submit} noValidate className="mt-10 border border-brass bg-bone p-6 text-onyx sm:p-10">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="Your name" value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last" autoComplete="name" />
                  <TextField label="Work email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
                  <div className="sm:col-span-2">
                    <TextField label="Company or website" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="company.com" autoComplete="organization" />
                  </div>
                </div>
                {tried && (!name.trim() || !emailOk || !company.trim()) && (
                  <p role="alert" className="mt-3 font-sans text-sm text-[#a3271f]">Name, email and company, please.</p>
                )}
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
                  <ChoiceGroup label="What do you offer?" options={CATEGORIES} value={category} onChange={setCategory} missing={tried && !category} />
                  <label className="block">
                    <span className="flex flex-wrap items-baseline gap-x-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">
                      In a few lines
                      <span className="normal-case tracking-normal text-onyx/45">Optional</span>
                    </span>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      maxLength={2000}
                      placeholder="What you do, where you work, and a link to past events."
                      className="mt-3 w-full resize-y border border-onyx/25 bg-transparent px-4 py-3 font-sans text-base text-onyx placeholder-onyx/40 outline-none transition focus:border-brass"
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group mt-9 flex min-h-12 w-full items-center justify-center gap-3 border border-brass bg-brass px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx transition hover:border-onyx hover:bg-onyx hover:text-bone disabled:opacity-60 sm:w-auto"
                >
                  {status === "loading" ? "Sending…" : "Send to production"}
                  {status !== "loading" && <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
