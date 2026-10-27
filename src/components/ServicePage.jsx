import { useEffect } from "react"
import SiteHeader from "./SiteHeader.jsx"
import SiteFooter from "./SiteFooter.jsx"
import CtaBand from "./CtaBand.jsx"
import Icon from "./Icon.jsx"
import {
  FORMATS,
  PHASES,
  SERVICE_PAGE_BY_SLUG,
  pagePath,
  proofItem,
  zoneFor,
  zoneNumber,
} from "../services.js"
import { responsive } from "../lib/img.js"

/* One service page, or one city page, from src/services.js. This is the
   layout; the content is in the data.

   The same document family as /services: a plate that dissolves into the
   page, headings in Cormorant, the schedule numbered, and a column of
   contents that stays put. The order follows the LinkGraph review of
   26 October: the buyer line and the direct answer first, the brand voice
   after; proof with what changed; decision points and boundaries; one
   call to action phrased for the service, with the click tracked. */

const SITE = "https://www.iconic.events"

function sectionsFor(page) {
  return [
    ["covers", "What it covers"],
    ["included", "What you receive"],
    ["phases", "How it works"],
    page.compare && ["compare", "Compared"],
    ["proof", "Proof"],
    page.venues && ["venues", "Venues"],
    ["formats", "Who it is for"],
    page.terms?.length && ["terms", "Terms"],
    ["questions", "Questions"],
  ].filter(Boolean)
}

function StructuredData({ page, zone }) {
  const url = `${SITE}${pagePath(page)}`
  const provider = {
    "@type": "Organization",
    name: "Iconic Events",
    url: `${SITE}/`,
    telephone: "+1-305-791-5290",
    foundingDate: "2017",
    address: { "@type": "PostalAddress", addressLocality: "Miami", addressRegion: "FL", addressCountry: "US" },
    sameAs: [
      "https://www.instagram.com/iconicbecker",
      "https://www.linkedin.com/company/iconiceventsusa",
      "https://www.youtube.com/@iconiceventsUSA",
    ],
  }
  const main =
    page.kind === "city"
      ? {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: `Iconic Events, ${page.city}`,
          description: page.lead,
          url,
          telephone: "+1-305-791-5290",
          address: { "@type": "PostalAddress", addressLocality: page.city, addressRegion: page.region, addressCountry: "US" },
          areaServed: page.areaServed,
          parentOrganization: provider,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Service",
          name: page.title,
          serviceType: page.title,
          description: page.lead,
          url,
          provider,
          areaServed: ["Miami, FL", "Las Vegas, NV", "United States"],
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: page.included.heading,
            itemListElement: page.included.items.map((it) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: it.name, description: it.line },
            })),
          },
        }
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  }
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      ...(page.kind === "city"
        ? [{ "@type": "ListItem", position: 2, name: page.title, item: url }]
        : [
            { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
            { "@type": "ListItem", position: 3, name: page.title, item: url },
          ]),
    ],
  }
  return [main, faq, crumbs].map((block, i) => (
    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
  ))
}

function H2({ id, children }) {
  return (
    <h2 id={id} className="scroll-mt-28 font-serif text-3xl font-semibold leading-tight text-bone sm:text-5xl">
      {children}
    </h2>
  )
}

function Section({ id, title, children }) {
  return (
    <div className="border-t border-bone/10 py-10 sm:py-14">
      <H2 id={id}>{title}</H2>
      {children}
    </div>
  )
}

function Prose({ paragraphs }) {
  return (
    <div className="mt-6 max-w-[62ch] space-y-5 font-sans text-base leading-relaxed text-bone/75">
      {paragraphs.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </div>
  )
}

function Num({ children, brass = false }) {
  return <span className={`font-sans text-[10px] font-bold tracking-[0.18em] ${brass ? "text-brass" : "text-bone/35"}`}>{children}</span>
}

export default function ServicePage({ page }) {
  const zone = zoneFor(page)
  const n = zoneNumber(page)
  const sections = sectionsFor(page)
  const related = (page.related ?? []).map((slug) => SERVICE_PAGE_BY_SLUG[slug]).filter(Boolean)

  useEffect(() => {
    document.title = page.seoTitle
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute("content", page.description)
  }, [page])

  return (
    <main className="min-h-screen bg-onyx text-bone">
      <SiteHeader />
      <StructuredData page={page} zone={zone} />
      {page.draft && <meta name="robots" content="noindex, nofollow" />}

      {/* Hero: the photograph fills the background and fades toward the
          text; over it the breadcrumb, the title, the zone's line and the
          direct answer. No buyer line and no facts table on the page
          (Icon, 27 Oct 2026): the facts are in the questions, and the
          structured data still carries them. */}
      <section className="relative overflow-hidden border-b border-bone/10">
        <figure className="svc-hero-plate absolute inset-y-0 right-0 w-full lg:w-[72%]" aria-hidden="true">
          <img
            {...responsive(page.plate, "(min-width: 1024px) 72vw, 100vw")}
            alt=""
            fetchpriority="high"
            decoding="async"
            className="h-full w-full object-cover [filter:saturate(1.08)_contrast(1.06)]"
          />
        </figure>
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
          <div className="max-w-[56ch] lg:max-w-[48%]">
            <nav aria-label="Breadcrumb" className="fade-rise font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/50">
              {page.kind === "city" ? (
                <>
                  <a href="/" className="transition-colors hover:text-brass">Home</a>
                  <span className="mx-3 text-bone/25">/</span>
                  <span className="text-brass">{page.city}</span>
                </>
              ) : (
                <>
                  <a href="/services" className="transition-colors hover:text-brass">Services</a>
                  <span className="mx-3 text-bone/25">/</span>
                  <span className="text-brass">{n} {zone?.group}</span>
                </>
              )}
            </nav>
            <h1 className="fade-rise mt-6 max-w-[16ch] font-serif text-5xl font-semibold leading-[0.96] sm:text-7xl" style={{ animationDelay: "80ms" }}>
              {page.title}
            </h1>
            {zone && (
              <p className="fade-rise mt-6 max-w-[40ch] font-serif text-2xl italic leading-snug text-bone/85 sm:text-3xl" style={{ animationDelay: "160ms" }}>
                {zone.line}
              </p>
            )}
            <p className="fade-rise mt-8 max-w-[58ch] font-sans text-lg leading-relaxed text-bone/80" style={{ animationDelay: "240ms" }}>
              {page.lead}
            </p>
            {page.kind === "city" && (
              <a
                href="/get-a-quote"
                onClick={() => {
                  window.dataLayer = window.dataLayer || []
                  window.dataLayer.push({ event: "cta_click", cta_label: page.cta.label, cta_position: "hero", page_path: pagePath(page) })
                }}
                className="fade-rise group mt-8 inline-flex items-center gap-3 border border-bone/25 px-7 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.2em] text-bone transition hover:border-brass/50 hover:text-brass"
                style={{ animationDelay: "320ms" }}
              >
                {page.cta.label}
                <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Body: contents on the left, the document on the right. */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-12 lg:gap-16">
          <aside className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40">On this page</p>
              <ol className="mobile-nav mt-4 flex gap-x-6 overflow-x-auto pb-2 font-sans text-xs font-bold uppercase tracking-[0.16em] lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
                {sections.map(([id, label]) => (
                  <li key={id} className="shrink-0">
                    <a href={`#${id}`} className="inline-block py-1.5 text-bone/50 transition-colors hover:text-bone">{label}</a>
                  </li>
                ))}
              </ol>

              {related.length > 0 && (
                <>
                  <p className="mt-10 font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40">Related services</p>
                  <ul className="mt-4 space-y-1 font-sans text-xs font-bold uppercase tracking-[0.16em]">
                    {related.map((r) => (
                      <li key={r.slug}>
                        <a href={pagePath(r)} className="inline-block py-1.5 text-bone/50 transition-colors hover:text-bone">{r.title}</a>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <a href="/services" className="mt-8 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-bone/50 transition-colors hover:text-brass">
                <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" />
                All services
              </a>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <Section id="covers" title={page.covers.heading}>
              <Prose paragraphs={page.covers.paragraphs} />
            </Section>

            <Section id="included" title={page.included.heading}>
              <ol className="mt-8">
                {page.included.items.map((it, j) => (
                  <li key={it.name} className="grid gap-x-8 gap-y-2 border-b border-bone/10 py-5 sm:grid-cols-12 sm:items-baseline">
                    <Num>{j + 1}</Num>
                    <h3 className="font-serif text-2xl font-semibold leading-tight text-bone sm:col-span-4">{it.name}</h3>
                    <p className="max-w-[48ch] font-sans text-sm leading-relaxed text-bone/65 sm:col-span-7">{it.line}</p>
                  </li>
                ))}
              </ol>
              {(page.included.decide || page.included.boundaries) && (
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  {page.included.decide && (
                    <div>
                      <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brass">Who decides what</h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-bone/65">{page.included.decide}</p>
                    </div>
                  )}
                  {page.included.boundaries && (
                    <div>
                      <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brass">What is not included</h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-bone/65">{page.included.boundaries}</p>
                    </div>
                  )}
                </div>
              )}
            </Section>

            <Section id="phases" title="How it works: the nine-phase event lifecycle">
              <p className="mt-6 max-w-[62ch] font-sans text-base leading-relaxed text-bone/75">{page.phases.intro}</p>
              <ol className="mt-8">
                {PHASES.map((ph) => {
                  const focus = page.phases.focus.includes(ph.n)
                  const note = page.phases.notes?.[ph.n]
                  return (
                    <li key={ph.n} className={`grid gap-x-8 gap-y-2 border-b border-bone/10 py-5 sm:grid-cols-12 ${focus ? "" : "opacity-70"}`}>
                      <Num brass={focus}>{String(ph.n).padStart(2, "0")}</Num>
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-bone sm:col-span-4">{ph.name}</h3>
                      <div className="sm:col-span-7">
                        <p className="max-w-[52ch] font-sans text-sm leading-relaxed text-bone/65">{ph.line}</p>
                        {note && <p className="mt-3 max-w-[52ch] border-l border-brass/50 pl-4 font-sans text-sm leading-relaxed text-bone/80">{note}</p>}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </Section>

            {page.compare && (
              <Section id="compare" title={page.compare.heading}>
                <Prose paragraphs={page.compare.paragraphs} />
              </Section>
            )}

            <Section id="proof" title={page.kind === "city" ? `Rooms produced in ${page.city}` : `Proof: ${page.title.toLowerCase()} in the room`}>
              {page.proof.intro && <p className="mt-6 max-w-[62ch] font-sans text-base leading-relaxed text-bone/75">{page.proof.intro}</p>}
              <ol className="mt-8">
                {page.proof.items.map(proofItem).map((p, j) => (
                  <li key={p.name} className="grid gap-x-8 gap-y-2 border-b border-bone/10 py-6 sm:grid-cols-12 sm:items-baseline">
                    <Num brass>{String(j + 1).padStart(2, "0")}</Num>
                    <div className="sm:col-span-4">
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-bone">
                        {p.href ? <a href={p.href} className="transition-colors hover:text-brass">{p.name}</a> : p.name}
                      </h3>
                      <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.14em] text-bone/45">
                        {[p.where, p.attendance ? `${p.attendance} in the room` : null].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <div className="sm:col-span-7">
                      <p className="max-w-[52ch] font-sans text-sm leading-relaxed text-bone/65">{p.changed}</p>
                      {p.href && (
                        <a href={p.href} className="group mt-3 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brass transition-colors hover:text-bone">
                          Read the case study
                          <Icon name="arrow" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            {page.venues && (
              <Section id="venues" title={page.venues.heading}>
                {page.venues.intro && <p className="mt-6 max-w-[62ch] font-sans text-base leading-relaxed text-bone/75">{page.venues.intro}</p>}
                <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
                  {page.venues.list.map((v) => (
                    <li key={v.name} className="flex items-baseline gap-4 border-b border-bone/10 py-3">
                      <span className="h-1 w-1 shrink-0 translate-y-[-3px] bg-brass" aria-hidden="true" />
                      <span className="font-sans text-sm text-bone/75">
                        {v.name}
                        {v.where && <span className="text-bone/45">, {v.where}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section id="formats" title={`Who ${page.kind === "city" ? "we produce for" : `${page.title.toLowerCase()} is for`}`}>
              <ol className="mt-8 grid gap-x-10 sm:grid-cols-2">
                {FORMATS.map((f, i) => (
                  <li key={f.name} className="border-b border-bone/10 py-4">
                    <div className="flex items-baseline gap-4">
                      <Num brass>{String(i + 1).padStart(2, "0")}</Num>
                      <span className="font-serif text-xl font-semibold text-bone">{f.name}</span>
                    </div>
                    <p className="mt-1.5 pl-9 font-sans text-sm leading-relaxed text-bone/60">{f.line}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-6 max-w-[60ch] font-sans text-sm leading-relaxed text-bone/50">
                We do not produce weddings or personal celebrations. When that work comes to us, we place it with
                people who do it properly.
              </p>
            </Section>

            {page.terms?.length > 0 && (
              <Section id="terms" title="Terms used on this page">
                <dl className="mt-6">
                  {page.terms.map(([term, def]) => (
                    <div key={term} className="grid gap-x-8 gap-y-1 border-b border-bone/10 py-4 sm:grid-cols-12 sm:items-baseline">
                      <dt className="font-serif text-xl font-semibold text-bone sm:col-span-4">{term}</dt>
                      <dd className="max-w-[52ch] font-sans text-sm leading-relaxed text-bone/65 sm:col-span-8">{def}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            )}

            <Section id="questions" title={`Questions about ${page.kind === "city" ? `event production in ${page.city}` : page.title.toLowerCase()}`}>
              <div className="mt-6">
                {page.faqs.map(([q, a], i) => (
                  <details key={q} className="group border-b border-bone/10 py-5" open={i === 0}>
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 font-serif text-2xl font-semibold leading-tight text-bone marker:hidden [&::-webkit-details-marker]:hidden">
                      {q}
                      <Icon name="plus" className="h-4 w-4 shrink-0 translate-y-0.5 text-brass transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="mt-4 max-w-[62ch] font-sans text-base leading-relaxed text-bone/70">{a}</p>
                  </details>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </section>

      <CtaBand
        headline={page.cta.headline}
        lead={page.cta.lead}
        label={page.cta.label}
        href="/get-a-quote"
        track={{ page_path: pagePath(page) }}
        secondary={{ href: "/services", label: "All services →" }}
      />
      <SiteFooter />
    </main>
  )
}
