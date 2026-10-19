export function Landing() {
  return (
    <main className="theme-dark u-bg u-fg flex min-h-svh flex-col items-center justify-center p-6 text-center" style={{ background: "radial-gradient(ellipse at 50% 120%, #1a3a3a 0%, var(--color-onyx) 60%)" }}>
      <img src="/brand/logo-white.png" alt="Iconic Events" className="mb-10 h-7 w-auto" />
      <div className="eyebrow mb-4">Photos</div>
      <h1 className="font-title-serif text-4xl sm:text-6xl">Galleries are shared by invitation.</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed u-fg2">If you were sent a link, open it to see the photos from your event.</p>
      <a href="https://iconic.events" className="btn mt-10">
        iconic.events
      </a>
    </main>
  )
}
