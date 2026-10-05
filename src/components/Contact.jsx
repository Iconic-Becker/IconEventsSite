import { useEffect } from "react"
import SiteHeader from "./SiteHeader.jsx"
import Cta from "./Cta.jsx"
import { CONTACT_EMAIL } from "../lib/contact.js"

/* The contact form as a page in its own right, split down the middle: the
   pitch on the left, the form on the right.

   It renders the same Cta component the homepage closes on, in its split
   layout, so there is one form, one validation path and one submit. A second
   copy of the form would drift from the first within a month. */

const TITLE = "Contact | Iconic Events"
const DESCRIPTION =
  "Tell Iconic Events about the room you want to build. Event production, stage design and experience architecture for live in person events."

/* What happens after the send. The form is long, so the left column answers
   the question a visitor asks before filling one in: who reads this, and
   when do I hear back. */
const STEPS = [
  { n: "01", title: "You send the brief", note: "Seven questions. Two minutes." },
  { n: "02", title: "A director reads it", note: "Not a form inbox. A person who builds these rooms." },
  { n: "03", title: "We write back inside 48 hours", note: "If we are not the right fit, we say so on the first call." },
]

function Aside() {
  return (
    <div className="mt-12 max-w-md">
      <ol className="border-t border-bone/15">
        {STEPS.map((step) => (
          <li key={step.n} className="flex gap-5 border-b border-bone/15 py-5">
            <span className="font-sans text-[11px] font-bold tracking-[0.18em] text-brass">{step.n}</span>
            <span>
              <span className="block font-sans text-sm font-bold uppercase tracking-[0.12em] text-bone/85">
                {step.title}
              </span>
              <span className="mt-1.5 block font-sans text-sm leading-relaxed text-bone/50">{step.note}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-8 font-sans text-sm leading-relaxed text-bone/50">
        Rather write to us directly?{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-bold text-brass underline underline-offset-4 transition hover:text-bone"
        >
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
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
      <Cta
        split
        eyebrow="Contact"
        title={
          <>
            Tell us about the room{" "}
            <span className="text-brass">you want to build.</span>
          </>
        }
        aside={<Aside />}
      />
      <footer className="border-t border-bone/10 py-12">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <a
            href="/"
            className="inline-block bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx"
          >
            Back to Iconic Events
          </a>
        </div>
      </footer>
    </main>
  )
}
