import { useRef } from "react"
import { NICHE, GALLERY, HERO } from "../content.js"
import { useVoice } from "../voice.jsx"
import LightRay from "./LightRay.jsx"
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

// Same look as the hero, anchored to the bottom and rising up — a denser field.
const RISING = [
  { left: "50%", size: "2px", fall: "260px", dur: 7.5, delay: 0 },
  { left: "43%", size: "1px", fall: "280px", dur: 9, delay: 1.2 },
  { left: "57%", size: "1px", fall: "250px", dur: 8, delay: 2.1 },
  { left: "48%", size: "2px", fall: "270px", dur: 10, delay: 0.6 },
  { left: "62%", size: "1px", fall: "240px", dur: 8.5, delay: 3 },
  { left: "37%", size: "1px", fall: "255px", dur: 9.5, delay: 1.8 },
  { left: "53%", size: "1px", fall: "285px", dur: 11, delay: 2.6 },
  { left: "46%", size: "1px", fall: "245px", dur: 7, delay: 4 },
  { left: "60%", size: "2px", fall: "265px", dur: 10.5, delay: 3.6 },
  { left: "40%", size: "2px", fall: "275px", dur: 9.2, delay: 5 },
  { left: "55%", size: "1px", fall: "250px", dur: 8.2, delay: 4.6 },
  { left: "50%", size: "1px", fall: "290px", dur: 12, delay: 5.8 },
  { left: "33%", size: "1px", fall: "240px", dur: 9.8, delay: 0.9 },
  { left: "67%", size: "1px", fall: "255px", dur: 8.8, delay: 2.4 },
  { left: "29%", size: "2px", fall: "270px", dur: 11.5, delay: 3.1 },
  { left: "71%", size: "1px", fall: "235px", dur: 7.8, delay: 4.3 },
  { left: "45%", size: "1px", fall: "300px", dur: 12.5, delay: 1.5 },
  { left: "58%", size: "2px", fall: "245px", dur: 9.4, delay: 5.4 },
  { left: "36%", size: "1px", fall: "260px", dur: 8.6, delay: 2.9 },
  { left: "64%", size: "1px", fall: "285px", dur: 10.8, delay: 0.3 },
  { left: "51%", size: "1px", fall: "230px", dur: 7.2, delay: 3.8 },
  { left: "42%", size: "2px", fall: "295px", dur: 11.2, delay: 4.9 },
  { left: "59%", size: "1px", fall: "265px", dur: 9.1, delay: 1.9 },
  { left: "26%", size: "1px", fall: "250px", dur: 8.4, delay: 5.1 },
  { left: "74%", size: "2px", fall: "275px", dur: 10.2, delay: 2.2 },
  { left: "49%", size: "1px", fall: "255px", dur: 8.9, delay: 6.2 },
]

// 08 · The Uncontested Room — a full-height black close. Crowd atmosphere under
// an onyx scrim, with the hero's foggy brass ray + light particles, mirrored to
// emanate from the bottom-centre.
export default function Niche() {
  const { t } = useVoice()
  const ref = useRef(null)
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${e.clientX - r.left}px`)
    el.style.setProperty("--my", `${e.clientY - r.top}px`)
  }
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden bg-onyx py-28"
    >
      {/* crowd atmosphere + onyx radial scrim */}
      <div className="pointer-events-none absolute inset-0">
        <img
          src={GALLERY.nicheBg}
          alt=""
          className="h-full w-full object-cover opacity-[0.55] grayscale"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 75% at center, rgba(14,19,18,0.9) 0%, rgba(14,19,18,0.72) 55%, rgba(14,19,18,0.48) 100%)",
          }}
        />
      </div>

      {/* brass brand pattern — hidden by default, revealed in a soft circle
          under the cursor. No fill, so it reads as the gilded damask itself. */}
      <div
        className="niche-reveal pointer-events-none absolute inset-0 opacity-50"
        aria-hidden="true"
        style={{
          backgroundImage: "url(/images/patterns/pattern-gold.webp)",
          backgroundSize: "300px auto",
          backgroundRepeat: "repeat",
        }}
      />

      {/* foggy brass ray rising from the bottom-centre — enlarged */}
      <LightRay up scale={1.7} className="z-[6]" />

      {/* light particles rising from the bottom-centre */}
      <div className="pointer-events-none absolute bottom-16 left-1/2 z-[7] h-[300px] w-[560px] -translate-x-1/2">
        {RISING.map((p, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              left: p.left,
              bottom: 0,
              width: p.size,
              height: p.size,
              "--fall": p.fall,
              animation: `particle-rise ${p.dur}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* brass frame */}
      <div className="pointer-events-none absolute inset-8 z-10 border border-brass/15" />

      {/* centred copy */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">
          {NICHE.eyebrow}
        </div>
        <h2 className="mx-auto mt-6 max-w-4xl font-serif text-6xl font-semibold leading-[1.0] text-bone sm:text-7xl lg:text-8xl">
          {accent(t(NICHE.title), "for founders")}
        </h2>
        <p className="mx-auto mt-8 max-w-2xl font-sans text-lg leading-relaxed text-bone/75">
          {t(NICHE.body)}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <CtaBrackets href="#contact">{t(HERO.ctaPrimary)}</CtaBrackets>
          <a
            href="#work"
            className="group inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-bone/60 transition hover:text-bone"
          >
            {t(HERO.ctaSecondary)}
            <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </div>
        <div className="mt-10 font-sans text-xs uppercase tracking-[0.35em] text-brass">
          {NICHE.seal}
        </div>
      </div>
    </div>
  )
}
