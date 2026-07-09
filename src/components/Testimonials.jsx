import { useRef } from "react"
import { TESTIMONIALS, HERO } from "../content.js"
import { useVoice } from "../voice.jsx"
import { CtaBrackets } from "./CtaButtons.jsx"
import Icon from "./Icon.jsx"

// Wrap the first occurrence of `phrase` in a brass accent span.
function accent(text, phrase) {
  const i = text.indexOf(phrase)
  if (i === -1) return text
  return (
    <>
      {text.slice(0, i)}
      <span className="text-brass">{phrase}</span>
      {text.slice(i + phrase.length)}
    </>
  )
}

function Head({ t }) {
  return (
    <>
      <div className="mb-8 border-b border-brass/40 pb-3">
        <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {TESTIMONIALS.eyebrow}
        </span>
      </div>
      <h2 className="max-w-4xl font-serif text-5xl font-semibold leading-[1.03] text-bone sm:text-6xl lg:text-7xl">
        {accent(t(TESTIMONIALS.title), "from our rooms")}
      </h2>
    </>
  )
}

function Play({ size = "h-14 w-14" }) {
  return (
    <span className={`flex ${size} items-center justify-center border border-brass text-brass transition group-hover:bg-brass group-hover:text-onyx`}>
      ▶
    </span>
  )
}

// Left-aligned primary + secondary CTAs, matching the hero. On the right, the
// wordmark hides until the cursor's soft circle sweeps over it, over a faint
// brand pattern that fades outward.
function CtaRow({ t }) {
  const logoRef = useRef(null)
  const onMove = (e) => {
    const el = logoRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  const hide = () => {
    const el = logoRef.current
    if (!el) return
    el.style.setProperty("--mx", "-9999px")
    el.style.setProperty("--my", "-9999px")
  }
  return (
    <div className="mt-12 flex flex-wrap items-center justify-between gap-8">
      <div className="flex flex-wrap items-center gap-6">
        <CtaBrackets href="#contact">{t(HERO.ctaPrimary)}</CtaBrackets>
        <a
          href="#work"
          className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-bone/60 transition hover:text-bone"
        >
          {t(HERO.ctaSecondary)}
          <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>
      </div>
      {/* cursor-revealed wordmark, over a faint pattern that fades outward */}
      <div onMouseMove={onMove} onMouseLeave={hide} className="relative hidden md:block">
        <div
          className="pointer-events-none absolute -inset-32 opacity-[0.08]"
          aria-hidden="true"
          style={{
            backgroundImage: "url(/images/patterns/pattern-white.webp)",
            backgroundSize: "360px auto",
            backgroundRepeat: "repeat",
            WebkitMaskImage: "radial-gradient(ellipse closest-side at 50% 50%, #000 5%, transparent 100%)",
            maskImage: "radial-gradient(ellipse closest-side at 50% 50%, #000 5%, transparent 100%)",
          }}
        />
        <img
          ref={logoRef}
          src="/logos/IE_logo_white.png"
          alt=""
          aria-hidden="true"
          className="logo-reveal relative z-10 h-32 w-auto opacity-90"
        />
      </div>
    </div>
  )
}

/* ── From the Host · Cinematic Quote Cards ────────────────────────────
   Tall portrait cards; the quote is overlaid, colour blooms on hover.
   Followed by the primary/secondary CTAs and the cursor-revealed wordmark. */
export default function Testimonials() {
  const { t } = useVoice()
  return (
    <div id="testimonials" className="bg-onyx py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Head t={t} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.items.map((v) => (
            <div key={v.id} className="group relative aspect-[3/4] overflow-hidden border border-bone/15">
              <img
                src={v.img}
                alt={v.name}
                loading="lazy"
                className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx via-onyx/40 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <Play size="h-11 w-11" />
                <span className="bg-onyx/80 px-2 py-1 font-sans text-[10px] tracking-wide text-bone">
                  {v.duration}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="font-serif text-xl italic leading-snug text-bone">{t(v.quote)}</p>
                <div className="mt-4 font-serif text-base text-bone">{v.name}</div>
                <div className="font-sans text-xs uppercase tracking-[0.12em] text-brass">{t(v.role)}</div>
              </div>
            </div>
          ))}
        </div>
        <CtaRow t={t} />
      </div>
    </div>
  )
}
