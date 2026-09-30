import { NAV } from "../content.js"

/* The site's primary navigation, shared by the homepage and the pages off it.

   On the homepage every link is an in-page anchor. Elsewhere the same links
   point back at the homepage sections, except #contact on a page that carries
   its own contact form (case studies), which stays on the page. */

function Logo({ className = "" }) {
  return <img src="/logos/IE_logo_white.png" alt="Iconic Events, Est. 2017" className={className} />
}

// Nav menu link, echoing the primary button: brass corner ticks snap in on hover.
function NavLink({ href, children }) {
  const tick =
    "pointer-events-none absolute h-1.5 w-1.5 border-brass opacity-0 transition-all duration-300 ease-out group-hover:opacity-100"
  return (
    <a href={href} className="group relative px-2 py-1.5 transition-colors duration-300 hover:text-brass">
      {children}
      <span className={`${tick} left-1 top-0 border-l border-t group-hover:left-0`} />
      <span className={`${tick} right-1 top-0 border-r border-t group-hover:right-0`} />
      <span className={`${tick} bottom-0 left-1 border-b border-l group-hover:left-0`} />
      <span className={`${tick} bottom-0 right-1 border-b border-r group-hover:right-0`} />
    </a>
  )
}

function CaseStudyTab() {
  return (
    <a
      href="/case-studies"
      className="case-study-tab absolute left-1/2 top-full z-50 hidden h-9 min-w-[250px] -translate-x-1/2 items-center justify-center rounded-b-xl bg-brass px-10 font-display text-xs font-bold uppercase tracking-[0.18em] text-onyx shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition hover:brightness-110 md:flex"
    >
      Our case studies
    </a>
  )
}

export default function SiteHeader({ home = false, contactHere = false }) {
  const resolve = (href) => {
    if (home) return href
    if (href === "#contact" && contactHere) return href
    return `/${href}`
  }
  const left = NAV.left.map((n) => ({ ...n, href: resolve(n.href) }))
  const right = NAV.right.map((n) => ({ ...n, href: resolve(n.href) }))

  return (
    <>
      {/* Its own solid-black section. Centered logo, menus split L/R, no CTA.
          Sticky so it persists on scroll. */}
      <header className="relative z-40 border-b border-bone/10 bg-onyx md:sticky md:top-0">
        <div className="nav-beam" aria-hidden="true" />
        <nav aria-label="Primary navigation" className="mx-auto grid max-w-6xl grid-cols-3 items-center px-5 py-3 sm:px-6 sm:py-4">
          <div className="hidden items-center gap-6 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:flex">
            {left.map((n) => (
              <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
            ))}
          </div>
          <a href={home ? "#top" : "/"} aria-label="Iconic Events home" className="col-start-2 flex justify-center">
            <Logo className="hidden h-8 w-auto md:block" />
            <img src="/logos/IE_sigil_white.png" alt="" aria-hidden="true" className="h-9 w-auto md:hidden" />
          </a>
          <div className="hidden items-center justify-end gap-6 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:flex">
            {right.map((n) => (
              <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
            ))}
          </div>
        </nav>
        <CaseStudyTab />
      </header>
      <nav aria-label="Mobile navigation" className="mobile-nav sticky top-0 z-40 max-w-full overflow-x-auto border-y border-bone/10 bg-onyx/95 px-3 backdrop-blur md:hidden">
        <div className="flex min-w-max items-center">
          {[...left, ...right].map((n) => (
            <a key={n.href} href={n.href} className="flex min-h-11 items-center px-3 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-bone/70">
              {n.label}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
