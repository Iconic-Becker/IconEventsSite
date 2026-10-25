import { ABOUT } from "../content.js"
import { caseStudyCards } from "../case-studies.js"
import { useVoice } from "../voice.jsx"

// About Us: the first thing after the logo row: who Iconic is, before what
// it builds. Facts beside the copy are ones a prospect can check on this
// site: the founding year, the event index, the countries in it.
export default function About() {
  const { t } = useVoice()
  const facts = [
    ["2017", "Founded"],
    [String(caseStudyCards().length), "Events produced"],
    ["4", "Countries: US, UK, Spain, UAE"],
  ]

  return (
    <section id="about" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mb-8 border-b border-brass/40 pb-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-brass">{ABOUT.eyebrow}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <h2 className="max-w-[16ch] font-serif text-4xl font-semibold leading-[1.02] text-bone sm:text-6xl">
            {t(ABOUT.title)}
          </h2>

          <div>
            {ABOUT.body.map((para, i) => (
              <p key={i} className="mb-5 font-sans text-lg leading-relaxed text-bone/70">
                {t(para)}
              </p>
            ))}
            <a
              href="/case-studies"
              className="mt-2 inline-block font-sans text-xs font-bold uppercase tracking-[0.18em] text-brass transition hover:text-bone"
            >
              {t(ABOUT.link)}
            </a>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-bone/10 pt-8 sm:mt-16">
          {facts.map(([value, label]) => (
            <div key={label} className="flex flex-col">
              <dt className="mt-1 font-sans text-[11px] uppercase leading-snug tracking-[0.12em] text-bone/50">{label}</dt>
              <dd className="order-first font-serif text-3xl font-semibold text-brass sm:text-5xl">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
