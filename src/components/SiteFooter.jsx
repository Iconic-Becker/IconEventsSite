import { FOOTER } from "../content.js"
import { useVoice } from "../voice.jsx"
import { responsive } from "../lib/img.js"

/* The site footer, on every page, so the privacy policy and terms are one
   click away wherever a visitor is.

   On the homepage, section links are in-page anchors. Elsewhere they point
   back at the homepage sections, and "Start a conversation" goes to the
   contact page rather than an anchor that is not there. */

function resolve(href, home) {
  if (home || !href.startsWith("#")) return href
  if (href === "#contact") return "/contact"
  return `/${href}`
}

export default function SiteFooter({ home = false }) {
  const { t } = useVoice()
  return (
    <footer className="rule-tidepool relative border-t border-bone/10 bg-onyx text-bone">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-b border-bone/10 pb-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
          {/* Logo and line stacked as one centred unit, which sits at the
              start of its column from md up. */}
          <div className="col-span-2 flex justify-center md:col-span-1 md:justify-start">
            <a href={home ? "#top" : "/"} aria-label="Iconic Events home" className="flex flex-col items-center text-center">
              <img {...responsive("/logos/IE_logo_white.png", "180px")} alt="Iconic Events, Est. 2017" className="h-14 w-auto md:h-12" />
              <span className="mt-4 max-w-[16rem] font-sans text-sm text-bone/55">{t(FOOTER.line)}</span>
            </a>
          </div>
          {FOOTER.columns.map((c) => (
            <div key={c.id} className="min-w-0">
              <div className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass">{c.head}</div>
              <ul className="mt-4 space-y-2 break-words font-sans text-sm leading-relaxed text-bone/60">
                {c.items.map((it) => {
                  const label = typeof it === "string" ? it : it.label
                  return (
                    <li key={label}>
                      {typeof it === "string" ? (
                        label
                      ) : (
                        <a
                          href={resolve(it.href, home)}
                          {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="transition hover:text-brass"
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="font-sans text-[10px] uppercase leading-relaxed tracking-[0.14em] text-bone/50 md:text-xs md:tracking-[0.2em]">
            {FOOTER.legal} · {FOOTER.tagStrip}
          </p>
          <p className="font-sans text-[11px] uppercase leading-relaxed tracking-[0.14em] text-bone/70">
            <a href="/privacy" className="underline-offset-4 transition hover:text-brass hover:underline">Privacy Policy</a>
            <span className="text-bone/35">{" · "}</span>
            <a href="/terms" className="underline-offset-4 transition hover:text-brass hover:underline">Terms and Conditions</a>
          </p>
        </div>
        <p className="mt-6 max-w-3xl font-sans text-[11px] leading-relaxed text-footer-grey">{FOOTER.ip}</p>
      </div>
    </footer>
  )
}
