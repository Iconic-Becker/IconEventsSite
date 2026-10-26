import { NAV } from "../content.js"
import { CONTACT_PHONE } from "../lib/contact.js"

/* The site's primary navigation, the same on every page.

   Every link is a page of its own (NAV in content.js), so the bar never sends
   anyone back to the homepage. The sigil sits in the middle with two links
   either side of it, so the bar is level around it; the phone line sits at
   the far right. The brass Get a quote tab hangs from the sigil. */

function PhoneIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M5 3h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 6 6l1.5-2.3L20 14.5V18a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3z" />
    </svg>
  )
}

/* The phone line, always in the bar, the way Everlast carries theirs. On
   phones it shows in the top row beside the sigil and again as a call cell
   in the sticky menu, since the top row scrolls away. */
function PhoneLink({ className = "", iconClass = "h-4 w-4" }) {
  return (
    <a
      href={`tel:${CONTACT_PHONE.tel}`}
      aria-label={`Call Iconic Events on ${CONTACT_PHONE.display}`}
      className={`inline-flex items-center gap-2 whitespace-nowrap font-bold text-brass transition-colors duration-300 hover:text-bone ${className}`}
    >
      <PhoneIcon className={`${iconClass} shrink-0`} />
      {/* At md the right column holds two links and the phone, so the number
          gives way to the icon until lg; on phones it shows in full. */}
      <span className="md:hidden lg:inline">{CONTACT_PHONE.display}</span>
    </a>
  )
}

// Nav link, echoing the primary button: brass corner ticks snap in on hover.
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

function QuoteTab() {
  return (
    <a
      href="/get-a-quote"
      className="case-study-tab absolute left-1/2 top-full z-50 hidden h-9 min-w-[250px] -translate-x-1/2 items-center justify-center rounded-b-xl bg-brass px-10 font-display text-xs font-bold uppercase tracking-[0.18em] text-onyx shadow-[0_12px_28px_rgba(0,0,0,0.3)] transition hover:brightness-110 md:flex"
    >
      Get a quote
    </a>
  )
}

export default function SiteHeader({ home = false }) {
  // Two either side of the sigil.
  const wide = NAV.links.filter((n) => !n.smallOnly)
  const left = wide.slice(0, Math.ceil(wide.length / 2))
  const right = wide.slice(Math.ceil(wide.length / 2))

  return (
    <>
      {/* Its own solid-black section. Sticky from md up so it persists on
          scroll; on phones the menu row below is what sticks. */}
      <header className="relative z-40 border-b border-bone/10 bg-onyx md:sticky md:top-0">
        <div className="nav-beam" aria-hidden="true" />
        <nav aria-label="Primary navigation" className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-6 px-5 py-3 sm:px-6 sm:py-4 lg:gap-10">
          <div className="hidden items-center justify-end gap-8 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:flex lg:gap-10">
            {left.map((n) => (
              <NavLink key={n.href} href={n.href}>
                {n.label}
              </NavLink>
            ))}
          </div>
          <a href={home ? "#top" : "/"} aria-label="Iconic Events home" className="col-start-2 flex justify-center">
            <img src="/logos/IE_sigil_white.png" alt="" aria-hidden="true" className="h-9 w-auto md:h-10" />
          </a>
          <div className="col-start-3 flex items-center justify-end gap-8 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:justify-between lg:gap-10">
            <div className="hidden items-center gap-8 md:flex lg:gap-10">
              {right.map((n) => (
                <NavLink key={n.href} href={n.href}>
                  {n.label}
                </NavLink>
              ))}
            </div>
            <PhoneLink className="text-[11px] normal-case tracking-[0.04em] md:text-xs md:tracking-[0.08em]" iconClass="h-3.5 w-3.5 md:h-4 md:w-4" />
          </div>
        </nav>
        <QuoteTab />
      </header>
      {/* Phones: the links as even cells, Get a quote included (in brass)
          since the tab is hidden here, and a narrow call cell so the phone
          line stays in reach once the top row has scrolled away. */}
      <nav aria-label="Mobile navigation" className="mobile-nav sticky top-0 z-40 border-y border-bone/10 bg-onyx/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_2.5rem] items-stretch">
          {NAV.links.map((n) => (
            <a key={n.href} href={n.href} className={`flex min-h-11 items-center justify-center px-1 text-center font-sans text-[10px] font-bold uppercase tracking-[0.04em] ${n.smallOnly ? "text-brass" : "text-bone/70"}`}>
              {n.label}
            </a>
          ))}
          <a
            href={`tel:${CONTACT_PHONE.tel}`}
            aria-label={`Call Iconic Events on ${CONTACT_PHONE.display}`}
            className="flex min-h-11 items-center justify-center border-l border-bone/10 text-brass"
          >
            <PhoneIcon className="h-4 w-4" />
          </a>
        </div>
      </nav>
    </>
  )
}
