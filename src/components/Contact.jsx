import { useEffect, useRef, useState } from "react"
import SiteFooter from "./SiteFooter.jsx"
import SiteHeader from "./SiteHeader.jsx"
import Icon from "./Icon.jsx"
import { TextField, MIN_FILL_MS } from "./Cta.jsx"
import { sendMessage } from "../lib/enquiry.js"
import { CONTACT_EMAIL, CONTACT_PHONE } from "../lib/contact.js"

/* /contact: the short way in, the way Everlast lays theirs out. How to reach
   us on the left, a three field message form on the right. Planning an event
   is a quote, not a message, so the page points there first; the full brief
   lives on /get-a-quote. */

const TITLE = "Contact | Iconic Events"
const DESCRIPTION =
  "Contact Iconic Events. Call, email or send a message, and a director will write back within 48 hours. Offices in Miami and Las Vegas."

const WAYS = [
  { head: "General enquiries", lines: [{ label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }, { label: CONTACT_PHONE.display, href: `tel:${CONTACT_PHONE.tel}` }] },
  { head: "Offices", lines: [{ label: "Miami, Florida" }, { label: "Las Vegas, Nevada" }] },
  { head: "Supplying rather than booking?", lines: [{ label: "Join the vendor list", href: "/vendors" }] },
]

function MessageForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [botcheck, setBotcheck] = useState("")
  const [tried, setTried] = useState(false)
  const [status, setStatus] = useState("idle")
  const shownAt = useRef(0)
  useEffect(() => {
    shownAt.current = Date.now()
  }, [])

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function submit(e) {
    e.preventDefault()
    setTried(true)
    if (!name.trim() || !emailOk || !message.trim()) return
    // Bots get the same thank you a person does, and nothing is sent.
    if (botcheck || Date.now() - shownAt.current < MIN_FILL_MS) {
      setStatus("done")
      return
    }
    setStatus("loading")
    try {
      await sendMessage({ name, email, message })
      setStatus("done")
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: "contact_message_sent" })
    } catch (error) {
      console.error("Message failed to send:", error)
      setStatus("error")
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="border-t-4 border-brass pt-6">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">Message sent</p>
        <p className="mt-4 font-serif text-3xl leading-snug text-onyx">Thank you. A director will write back within 48 hours.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="text-onyx">
      {status === "error" && (
        <div role="alert" className="mb-8 border border-brass/60 bg-onyx p-5">
          <p className="font-sans text-sm leading-relaxed text-bone/80">
            That didn&rsquo;t send. Please email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brass underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>{" "}
            or try again.
          </p>
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="First and last" autoComplete="name" />
        <TextField label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
      </div>
      <label className="mt-5 block">
        <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brass">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          maxLength={4000}
          required
          className="mt-2 w-full resize-y border border-onyx/25 bg-transparent px-4 py-3 font-sans text-base text-onyx placeholder-onyx/40 outline-none transition focus:border-brass"
        />
      </label>
      {tried && (!name.trim() || !emailOk || !message.trim()) && (
        <p role="alert" className="mt-3 font-sans text-sm text-[#a3271f]">Name, email and a message, and we will take it from there.</p>
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
      <button
        type="submit"
        disabled={status === "loading"}
        className="group mt-8 flex min-h-12 w-full items-center justify-center gap-3 border border-onyx bg-onyx px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-bone transition hover:border-brass hover:bg-brass hover:text-onyx disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : "Send message"}
        {status !== "loading" && <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />}
      </button>
      <p className="mt-4 max-w-md font-sans text-xs leading-relaxed text-onyx/55">
        By sending this, you agree to our{" "}
        <a href="/privacy" className="underline underline-offset-2 transition hover:text-onyx">Privacy Policy</a> and{" "}
        <a href="/terms" className="underline underline-offset-2 transition hover:text-onyx">Terms and Conditions</a>.
      </p>
    </form>
  )
}

export default function Contact() {
  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <section className="lg:grid lg:min-h-[calc(100svh-4.5rem)] lg:grid-cols-2">
        <div className="px-5 py-16 sm:px-6 lg:py-24 lg:pl-[max(1.5rem,calc(50vw-34.5rem))] lg:pr-16">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">Contact</p>
          <h1 className="mt-6 font-serif text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
            Talk to a <span className="text-brass">director.</span>
          </h1>
          <p className="mt-5 max-w-xl font-sans text-lg text-bone/65">
            Questions, ideas, press or anything else. A director reads every message and writes back within 48 hours.
          </p>

          {/* Planning an event belongs on the quote form, so say so first. */}
          <a
            href="/get-a-quote"
            className="group mt-10 flex max-w-md items-center justify-between gap-4 border border-brass bg-brass px-6 py-5 text-onyx transition hover:brightness-110"
          >
            <span>
              <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.18em]">Planning an event?</span>
              <span className="mt-1 block font-serif text-2xl font-semibold">Get a quote</span>
            </span>
            <Icon name="arrow" className="h-5 w-5 shrink-0 transition group-hover:translate-x-1" />
          </a>

          <dl className="mt-10 max-w-md border-t border-bone/15">
            {WAYS.map((w) => (
              <div key={w.head} className="border-b border-bone/15 py-5">
                <dt className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-brass">{w.head}</dt>
                {w.lines.map((l) => (
                  <dd key={l.label} className="mt-2 font-sans text-base text-bone/80">
                    {l.href ? (
                      <a href={l.href} className="underline decoration-bone/25 underline-offset-4 transition hover:text-brass hover:decoration-brass">
                        {l.label}
                      </a>
                    ) : (
                      l.label
                    )}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </div>
        <div className="bg-bone px-5 py-12 text-onyx sm:px-10 lg:py-24 lg:pl-16 lg:pr-[max(1.5rem,calc(50vw-34.5rem))]">
          <p className="mb-8 font-sans text-xs font-bold uppercase tracking-[0.18em] text-onyx/55">Send us a message</p>
          <MessageForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
