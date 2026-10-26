import { useEffect } from "react"
import SiteHeader from "./SiteHeader.jsx"
import SiteFooter from "./SiteFooter.jsx"
import CtaBand from "./CtaBand.jsx"
import Icon from "./Icon.jsx"
import { SCOPE } from "../content.js"
import { FORMATS, SERVICE_PAGE_BY_ZONE, zoneFor, zoneNumber } from "../services.js"
import { responsive } from "../lib/img.js"

/* One zone of service and support, on a page of its own at /services/<slug>.
   The content comes from src/services.js; this is the layout.

   The same document family as /services: a plate that dissolves into the
   page, headings in Cormorant, deliverables as a numbered schedule, and a
   column of contents that stays put. The lead paragraph under the title
   is the direct answer; everything below it is the evidence. */

const SITE = "https://www.iconic.events"

const SECTIONS = [
  ["covers", "What it covers"],
  ["included", "What is included"],
  ["sits", "Where it sits"],
  ["formats", "Who it is for"],
  ["questions", "Questions"],
]

function StructuredData({ page, zone }) {
  const url = `${SITE}/services/${page.slug}`
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    serviceType: page.title,
    description: page.lead,
    url,
    provider: {
      "@type": "Organization",
      name: "Iconic Events",
      url: `${SITE}/`,
      telephone: "+1-305-791-5290",
    },
    areaServed: ["Miami, FL", "Las Vegas, NV", "United States"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${zone.group}: what is included`,
      itemListElement: zone.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item, description: page.included[item] },
      })),
    },
  }
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  }
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: page.title, item: url },
    ],
  }
  return [service, faq, crumbs].map((block, i) => (
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

export default function ServicePage({ page }) {
  const zone = zoneFor(page)
  const n = zoneNumber(page)

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

      {/* Hero: the breadcrumb, the title and the direct answer on the
          left; the plate dissolving off the right edge. */}
      <section className="relative overflow-hidden border-b border-bone/10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="fade-rise font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40">
              <a href="/services" className="transition-colors hover:text-brass">
                Services
              </a>
              <span className="mx-3 text-bone/20">/</span>
              <span className="text-brass">
                {n} {zone.group}
              </span>
            </nav>
            <div className="fade-rise mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: "60ms" }}>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-brass">Zone {n}</p>
              {zone.beyond && (
                <span className="border border-brass/40 px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-brass">
                  Beyond production
                </span>
              )}
            </div>
            <h1
              className="fade-rise mt-4 max-w-[14ch] font-serif text-5xl font-semibold leading-[0.96] sm:text-7xl"
              style={{ animationDelay: "120ms" }}
            >
              {page.title}
            </h1>
            <p
              className="fade-rise mt-6 max-w-[40ch] font-serif text-2xl italic leading-snug text-bone/85 sm:text-3xl"
              style={{ animationDelay: "200ms" }}
            >
              {zone.line}
            </p>
            <p
              className="fade-rise mt-8 max-w-[60ch] font-sans text-lg leading-relaxed text-bone/70"
              style={{ animationDelay: "280ms" }}
            >
              {page.lead}
            </p>
          </div>
          <div className="lg:col-span-5">
            <figure className="svc-plate-r relative h-[min(44vh,420px)] lg:mr-[calc(-1*(max(0px,(100vw-72rem)/2)+1.5rem))] lg:h-full lg:min-h-[480px] lg:w-[calc(100%+max(0px,(100vw-72rem)/2)+1.5rem)]">
              <img
                {...responsive(page.plate, "(min-width: 1024px) 50vw, 100vw")}
                alt=""
                fetchpriority="high"
                decoding="async"
                className="h-full w-full object-cover [filter:saturate(1.08)_contrast(1.06)_brightness(1.05)]"
              />
            </figure>
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
                {SECTIONS.map(([id, label]) => (
                  <li key={id} className="shrink-0">
                    <a href={`#${id}`} className="inline-block py-1.5 text-bone/50 transition-colors hover:text-bone">
                      {label}
                    </a>
                  </li>
                ))}
              </ol>

              <p className="mt-10 font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-bone/40">The six zones</p>
              <ol className="mt-4 space-y-1 font-sans text-xs font-bold uppercase tracking-[0.16em]">
                {SCOPE.doGroups.map((g, i) => {
                  const linked = SERVICE_PAGE_BY_ZONE[g.id]
                  const here = g.id === zone.id
                  const inner = (
                    <>
                      <span className={`tracking-[0.2em] ${here ? "text-brass" : "text-bone/30"}`}>{String(i + 1).padStart(2, "0")}</span>
                      {g.group}
                    </>
                  )
                  return (
                    <li key={g.id}>
                      {linked && !here ? (
                        <a href={`/services/${linked.slug}`} className="inline-flex items-center gap-3 py-1.5 text-bone/50 transition-colors hover:text-bone">
                          {inner}
                        </a>
                      ) : (
                        <span className={`inline-flex items-center gap-3 py-1.5 ${here ? "text-bone" : "text-bone/40"}`}>{inner}</span>
                      )}
                    </li>
                  )
                })}
              </ol>
              <a
                href="/services"
                className="mt-6 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-bone/50 transition-colors hover:text-brass"
              >
                <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" />
                All services
              </a>
            </div>
          </aside>

          <div className="lg:col-span-8">
            {/* What it covers */}
            <div className="border-t border-bone/10 py-10 sm:py-14">
              <H2 id="covers">{page.covers.heading}</H2>
              <div className="mt-6 max-w-[62ch] space-y-5 font-sans text-base leading-relaxed text-bone/75">
                {page.covers.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            {/* The schedule of deliverables, each with its line. */}
            <div className="border-t border-bone/10 py-10 sm:py-14">
              <H2 id="included">What is included in {page.title.toLowerCase()}</H2>
              <ol className="mt-8">
                {zone.items.map((item, j) => (
                  <li key={item} className="grid gap-x-8 gap-y-2 border-b border-bone/10 py-5 sm:grid-cols-12 sm:items-baseline">
                    <span className="font-sans text-[10px] font-bold tracking-[0.18em] text-bone/35 sm:col-span-1">
                      {Number(n)}.{j + 1}
                    </span>
                    <h3 className="font-serif text-2xl font-semibold leading-tight text-bone sm:col-span-4">{item}</h3>
                    <p className="max-w-[48ch] font-sans text-sm leading-relaxed text-bone/65 sm:col-span-7">{page.included[item]}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Where it sits */}
            <div className="border-t border-bone/10 py-10 sm:py-14">
              <H2 id="sits">{page.sits.heading}</H2>
              <div className="mt-6 max-w-[62ch] space-y-5 font-sans text-base leading-relaxed text-bone/75">
                {page.sits.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>

            {/* Who it is for: the formats, compact. */}
            <div className="border-t border-bone/10 py-10 sm:py-14">
              <H2 id="formats">Who {page.title.toLowerCase()} is for</H2>
              <ol className="mt-8 grid gap-x-10 sm:grid-cols-2">
                {FORMATS.map((f, i) => (
                  <li key={f.name} className="flex items-baseline gap-4 border-b border-bone/10 py-3">
                    <span className="w-7 shrink-0 font-sans text-[10px] font-bold tracking-[0.18em] text-brass">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-sans text-sm text-bone/75">{f.name}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 max-w-[60ch] font-sans text-sm leading-relaxed text-bone/50">
                We do not produce weddings or personal celebrations. When that work comes to us, we place it with
                people who do it properly.
              </p>
            </div>

            {/* Questions */}
            <div className="border-t border-bone/10 py-10 sm:py-14">
              <H2 id="questions">Questions about {page.title.toLowerCase()}</H2>
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
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        headline="Tell us about the room you want to build."
        href="/contact"
        secondary={{ href: "/services", label: "All six zones →" }}
      />
      <SiteFooter />
    </main>
  )
}
