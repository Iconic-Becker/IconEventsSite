import { useEffect } from "react"
import SiteHeader from "./SiteHeader.jsx"

/* /privacy and /terms. The text lives in src/legal.js; this only lays it
   out: a short header, a contents list, then the sections in one readable
   column. */

// A paragraph or list item: plain text, or an array mixing text and links.
function Rich({ parts }) {
  const list = Array.isArray(parts) ? parts : [parts]
  return list.map((part, i) =>
    typeof part === "string" ? (
      <span key={i}>{part}</span>
    ) : (
      <a
        key={i}
        href={part.href}
        {...(part.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-brass underline underline-offset-4 transition hover:text-bone"
      >
        {part.a}
      </a>
    )
  )
}

function Body({ items }) {
  return items.map((item, i) =>
    item && item.list ? (
      <ul key={i} className="mt-4 list-disc space-y-2 pl-5 marker:text-brass/70">
        {item.list.map((li, j) => (
          <li key={j}>
            <Rich parts={li} />
          </li>
        ))}
      </ul>
    ) : (
      <p key={i} className="mt-4">
        <Rich parts={item} />
      </p>
    )
  )
}

export default function LegalPage({ doc }) {
  useEffect(() => {
    document.title = `${doc.title} | Iconic Events`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", doc.description)
  }, [doc])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-5 pb-20 pt-14 sm:px-6 sm:pt-20">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">{doc.eyebrow}</p>
        <h1 className="mt-5 font-serif text-4xl font-semibold leading-none sm:text-6xl">{doc.title}</h1>
        <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.16em] text-bone/45">Last updated {doc.updated}</p>
        <div className="mt-8 font-sans text-base leading-relaxed text-bone/70">
          <Body items={doc.intro} />
        </div>

        <nav aria-label="Contents" className="mt-10 border-y border-bone/10 py-6">
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-bone/50">Contents</p>
          <ol className="mt-3 grid gap-x-8 gap-y-1.5 font-sans text-sm sm:grid-cols-2">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-bone/70 transition hover:text-brass">
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24 border-b border-bone/10 py-9">
            <h2 className="font-serif text-2xl font-semibold leading-tight sm:text-3xl">{section.heading}</h2>
            <div className="font-sans text-base leading-relaxed text-bone/70">
              <Body items={section.body} />
            </div>
          </section>
        ))}

        <a
          href="/"
          className="mt-12 inline-block bg-brass px-6 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-onyx"
        >
          Back to Iconic Events
        </a>
      </article>
    </main>
  )
}
