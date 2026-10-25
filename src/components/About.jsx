import { ABOUT } from "../content.js"
import { useVoice } from "../voice.jsx"

// About Us: the first thing after the logo row: who Iconic is, before what
// it builds. Two facts beside the copy. No event count, at Iconic's call: a
// number reads as a ceiling. Countries are Iconic's own list, which runs wider
// than the case studies written so far. Set on bone, like the Gallery, so the
// page is not dark end to end.
const COUNTRIES = ["US", "UK", "Spain", "UAE", "Mexico", "Costa Rica"]

export default function About() {
  const { t } = useVoice()
  const facts = [
    ["2017", "Founded"],
    [String(COUNTRIES.length), `Countries: ${COUNTRIES.join(", ")}`],
  ]

  return (
    <section id="about" className="relative bg-bone py-16 text-onyx sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-8 border-b-4 border-tidepool pb-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">{ABOUT.eyebrow}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <h2 className="max-w-[16ch] font-serif text-4xl font-semibold leading-[1.02] text-onyx sm:text-6xl">
            {t(ABOUT.title)}
          </h2>

          <div>
            {ABOUT.body.map((para, i) => (
              <p key={i} className="mb-5 font-sans text-lg leading-relaxed text-onyx/70">
                {t(para)}
              </p>
            ))}
            <a
              href="/case-studies"
              className="mt-2 inline-block font-sans text-xs font-bold uppercase tracking-[0.18em] text-tidepool underline decoration-brass underline-offset-4 transition hover:text-brass"
            >
              {t(ABOUT.link)}
            </a>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-onyx/15 pt-8 sm:mt-16">
          {facts.map(([value, label]) => (
            <div key={label} className="flex flex-col">
              <dt className="mt-1 font-sans text-[11px] uppercase leading-snug tracking-[0.12em] text-onyx/55">{label}</dt>
              <dd className="order-first font-serif text-3xl font-semibold text-tidepool sm:text-5xl">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
