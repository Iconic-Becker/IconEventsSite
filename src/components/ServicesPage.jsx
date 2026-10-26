import { useEffect } from "react"
import SiteHeader from "./SiteHeader.jsx"
import SiteFooter from "./SiteFooter.jsx"
import CtaBand from "./CtaBand.jsx"
import Disciplines from "./Disciplines.jsx"

/* /services: what Iconic does, on a page of its own so the nav never sends
   anyone back to the homepage for it.

   The intro line is the copy guide's own example of a category term in a
   frame, used as written. The closing line on weddings is the guide's
   approved qualification copy. Run any change past Icon first. */

const TITLE = "Event Production Services | Iconic Events"
const DESCRIPTION =
  "Strategy, creative, production, content, operations and revenue for live events, under one team and a single line of authority. Iconic Events, event production since 2017."

export default function ServicesPage() {
  useEffect(() => {
    document.title = TITLE
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", DESCRIPTION)
  }, [])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Services</p>
          <h1 className="mx-auto mt-5 max-w-[18ch] font-serif text-4xl font-semibold leading-[0.98] sm:text-7xl">
            Six disciplines. One line of authority.
          </h1>
          <p className="mx-auto mt-7 max-w-[54ch] font-sans text-lg leading-relaxed text-bone/70">
            Most event planners oversee logistics. We engineer the room your audience decides in. Strategy,
            creative, production, content, operations and revenue sit with one team, so nothing falls between
            vendors.
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <Disciplines />
          <p className="mt-10 max-w-[64ch] font-sans text-sm leading-relaxed text-bone/50">
            We do not produce weddings or personal celebrations. When that work comes to us, we place it with
            people who do it properly.
          </p>
        </div>
      </section>

      <CtaBand
        headline="Tell us about the room you want to build."
        href="/contact"
        secondary={{ href: "/case-studies", label: "See the case studies →" }}
      />
      <SiteFooter />
    </main>
  )
}
