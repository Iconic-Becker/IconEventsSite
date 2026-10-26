import { NUMBERS } from "../content.js"

// The numbers bar, straight after About Us: four figures and nothing else.
// Dark against About's bone, so the two read as a pair.
export default function Numbers() {
  return (
    <section aria-label="Iconic Events in numbers" className="border-b border-bone/10 bg-onyx py-10 sm:py-14">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 sm:px-6 lg:grid-cols-4 lg:gap-0">
        {NUMBERS.map(({ value, label }, i) => (
          <div key={label} className={`flex flex-col ${i > 0 ? "lg:border-l lg:border-brass/25 lg:pl-8" : ""}`}>
            <dt className="mt-2 font-sans text-[11px] uppercase leading-snug tracking-[0.14em] text-bone/55">{label}</dt>
            <dd className="order-first font-serif text-4xl font-semibold leading-none text-brass sm:text-6xl">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
