// Restrained line marks. Sharp, thin, heritage. Zero image dependencies.
export default function Icon({ name, className = "w-6 h-6" }) {
  const paths = {
    // A simple engraved check.
    check: <path d="M20 6L9 17l-5-5" strokeLinecap="square" strokeLinejoin="miter" />,
    // Directional flourish.
    arrow: <path d="M4 12h16m-6-6l6 6-6 6" strokeLinecap="square" strokeLinejoin="miter" />,
    // Add / accordion.
    plus: <path d="M12 5v14m-7-7h14" strokeLinecap="square" />,
    // A well-set place setting (fork | knife) — the brand's table motif.
    setting: (
      <>
        <path d="M7 3v7a2 2 0 002 2v9M7 3v5M9 3v5M11 3v5" strokeLinecap="square" />
        <path d="M17 3c-1.5 0-2 2-2 5s.5 4 2 4v9" strokeLinecap="square" />
      </>
    ),
    // An open book — the reading-room / library reference.
    book: (
      <path
        d="M12 6c-2-1.3-4-1.5-6-1v12c2-.5 4-.3 6 1 2-1.3 4-1.5 6-1V5c-2-.5-4-.3-6 1zm0 0v13"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    ),
    // A wax seal / brass sigil ring.
    seal: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
      </>
    ),
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden="true"
    >
      {paths[name] || null}
    </svg>
  )
}
