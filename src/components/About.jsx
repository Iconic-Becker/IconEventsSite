import { ABOUT } from "../content.js"
import { useVoice } from "../voice.jsx"

// About Us: the first thing after the logo row: who Iconic is, before what
// it builds. Set on bone, like the Gallery, so the page is not dark end to
// end. Its figures moved to the numbers bar that follows it (Numbers.jsx).
export default function About() {
  const { t } = useVoice()

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
      </div>
    </section>
  )
}
