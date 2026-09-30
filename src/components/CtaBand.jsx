import { CtaBrackets } from "./CtaButtons.jsx"

/* A mid-page call to action.

   The homepage previously offered no way to act between the hero and the form
   at the very bottom, which is roughly eighty percent of the scroll. These
   bands sit after the argument is made and after the proof is shown, so a
   prospect can act where they are convinced rather than scrolling back.

   Uses the same CtaBrackets as the hero, on Tide Pool, so it reads as part of
   the page rather than an insert. */
export default function CtaBand({ headline, secondary }) {
  return (
    <section className="relative overflow-hidden bg-tidepool py-14 sm:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: "url(/images/patterns/pattern-white.webp)", backgroundSize: "440px auto" }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-5 sm:px-6">
        <h2 className="max-w-[24ch] font-serif text-3xl font-semibold leading-tight text-bone sm:text-5xl">
          {headline}
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <CtaBrackets href="#contact">Start a conversation</CtaBrackets>
          {secondary && (
            <a
              href={secondary.href}
              className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-bone/60 transition hover:text-brass"
            >
              {secondary.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
