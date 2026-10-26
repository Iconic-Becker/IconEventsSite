import { useEffect, useRef, useState } from "react"
import { NAV } from "../content.js"
import { CONTACT_PHONE } from "../lib/contact.js"

/* The site's primary navigation, shared by the homepage and the pages off it.

   On the homepage every link is an in-page anchor. Elsewhere the same links
   point back at the homepage sections, except #contact on a page that carries
   its own contact form (case studies), which stays on the page. */

function PhoneIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <path d="M5 3h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 6 6l1.5-2.3L20 14.5V18a2 2 0 0 1-2.2 2A16 16 0 0 1 3 5.2 2 2 0 0 1 5 3z" />
    </svg>
  )
}

/* The phone line, always in the bar, the way Everlast carries theirs. From
   lg the number is spelled out; at md there is only room for the icon, and
   the link still dials. */
function PhoneLink({ className = "" }) {
  return (
    <a
      href={`tel:${CONTACT_PHONE.tel}`}
      aria-label={`Call Iconic Events on ${CONTACT_PHONE.display}`}
      className={`inline-flex items-center gap-2 whitespace-nowrap text-brass transition-colors duration-300 hover:text-bone ${className}`}
    >
      <PhoneIcon className="h-4 w-4 shrink-0" />
      <span className="hidden tracking-[0.08em] lg:inline">{CONTACT_PHONE.display}</span>
    </a>
  )
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


/* A nav item that is a link and also reveals a menu.

   The trigger stays an anchor, so clicking Contact goes to the contact form
   exactly as it always did. The menu appears on hover and on keyboard focus
   anywhere inside, which is what makes it reachable without a pointer: tab to
   Contact and the menu is open, tab again and you are in it.

   An earlier version made the trigger a button that toggled on click. That
   fought itself: the pointer had already opened the menu, so the click closed
   it and Contact appeared to do nothing. Escape still closes and hands focus
   back, for anyone who opens it and changes their mind. */
function NavMenu({ item }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const trigger = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false)
        trigger.current?.blur()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!wrap.current?.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <a
        ref={trigger}
        href={item.href}
        aria-expanded={open}
        aria-haspopup="true"
        className="group relative flex items-center gap-1.5 px-2 py-1.5 uppercase tracking-[0.16em] transition-colors duration-300 hover:text-brass"
      >
        {item.label}
        <span aria-hidden="true" className={`text-[8px] leading-none transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▼</span>
      </a>
      {/* No gap between the link and the panel: a dead strip between them
          would fire pointerleave and shut the menu on the way to it. */}
      <div
        className={`absolute right-0 top-full z-50 w-[270px] border border-brass/40 bg-onyx shadow-[0_18px_60px_rgba(0,0,0,0.5)] transition duration-200 ${open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
      >
        {item.children.map((child) => (
          <a
            key={child.href + child.label}
            href={child.href}
            onClick={() => setOpen(false)}
            className="block border-b border-bone/10 px-4 py-3.5 text-left transition last:border-b-0 hover:bg-brass hover:text-onyx"
          >
            <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.16em]">{child.label}</span>
            {child.note && (
              <span className="mt-1 block font-sans text-[11px] normal-case tracking-normal text-bone/50">
                {child.note}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
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
    // An absolute path is a page in its own right, so it is the same link
    // wherever the header is rendered. Without this it would become
    // "//case-studies" off the homepage.
    if (href.startsWith("/")) return href
    if (home) return href
    if (href === "#contact" && contactHere) return href
    return `/${href}`
  }
  const left = NAV.left.map((n) => ({ ...n, href: resolve(n.href) }))
  const right = NAV.right.map((n) => ({ ...n, href: resolve(n.href) }))
  // The wide bar leaves out anything the brass tab already covers.
  const wide = (items) => items.filter((n) => !n.smallOnly)
  const [openSmall, setOpenSmall] = useState(null)
  const openPanel = [...left, ...right].find((n) => n.children && n.label === openSmall)

  return (
    <>
      {/* Its own solid-black section. The sigil centred, menus split L/R, the
          phone line at the far right. Sticky so it persists on scroll. */}
      <header className="relative z-40 border-b border-bone/10 bg-onyx md:sticky md:top-0">
        <div className="nav-beam" aria-hidden="true" />
        <nav aria-label="Primary navigation" className="mx-auto grid max-w-6xl grid-cols-3 items-center px-5 py-3 sm:px-6 sm:py-4">
          <div className="hidden items-center gap-6 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:flex">
            {wide(left).map((n) =>
              n.children ? <NavMenu key={n.label} item={n} /> : <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
            )}
          </div>
          <a href={home ? "#top" : "/"} aria-label="Iconic Events home" className="col-start-2 flex justify-center">
            <img src="/logos/IE_sigil_white.png" alt="" aria-hidden="true" className="h-9 w-auto md:h-10" />
          </a>
          <div className="hidden items-center justify-end gap-6 font-sans text-xs font-medium uppercase tracking-[0.16em] text-bone/70 md:flex">
            {wide(right).map((n) =>
              n.children ? <NavMenu key={n.label} item={n} /> : <NavLink key={n.href} href={n.href}>{n.label}</NavLink>
            )}
            <PhoneLink className="font-bold" />
          </div>
          {/* Small screens: the number spelled out beside the sigil, on load. */}
          <div className="flex justify-end md:hidden">
            <a
              href={`tel:${CONTACT_PHONE.tel}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap font-sans text-[11px] font-bold tracking-[0.04em] text-brass"
            >
              <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
              {CONTACT_PHONE.display}
            </a>
          </div>
        </nav>
        <CaseStudyTab />
      </header>
      {/* Six even columns rather than a scrolling row: at 390px the row pushed
          Contact past the right edge, where nobody swipes to find it. */}
      <nav aria-label="Mobile navigation" className="mobile-nav sticky top-0 z-40 border-y border-bone/10 bg-onyx/95 backdrop-blur md:hidden">
        {/* A seventh, narrow cell dials: the top row with the number scrolls
            away, and the phone line should stay in reach. */}
        <div className="grid grid-cols-[repeat(6,minmax(0,1fr))_2.5rem] items-stretch">
          {[...left, ...right].map((n) =>
            n.children ? (
              <button
                key={n.label}
                type="button"
                aria-expanded={openSmall === n.label}
                aria-haspopup="true"
                onClick={() => setOpenSmall((v) => (v === n.label ? null : n.label))}
                className={`flex min-h-11 items-center justify-center gap-1 px-1 text-center font-sans text-[10px] font-bold uppercase tracking-[0.04em] transition ${openSmall === n.label ? "bg-brass text-onyx" : "text-bone/70"}`}
              >
                {/* No ▼ here: with the call cell beside it there is no room
                    for one, and the button still opens its menu below. */}
                {n.label}
              </button>
            ) : (
              <a key={n.href} href={n.href} className="flex min-h-11 items-center justify-center px-1 text-center font-sans text-[10px] font-bold uppercase tracking-[0.04em] text-bone/70">
                {n.label}
              </a>
            )
          )}
          <a
            href={`tel:${CONTACT_PHONE.tel}`}
            aria-label={`Call Iconic Events on ${CONTACT_PHONE.display}`}
            className="flex min-h-11 items-center justify-center border-l border-bone/10 text-brass"
          >
            <PhoneIcon className="h-4 w-4" />
          </a>
        </div>
        {/* A flat strip has nowhere to hang a dropdown, so the panel drops
            below the whole row rather than under one cell. */}
        {openPanel && (
          <div className="border-t border-brass/30 bg-onyx">
            {openPanel.children.map((child) => (
              <a
                key={child.href + child.label}
                href={child.href}
                onClick={() => setOpenSmall(null)}
                className="block border-b border-bone/10 px-5 py-3.5 last:border-b-0"
              >
                <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-bone/85">{child.label}</span>
                {child.note && <span className="mt-1 block font-sans text-[11px] leading-snug text-bone/45">{child.note}</span>}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  )
}
