import { useVoice } from "../voice.jsx"
import { VOICES } from "../content.js"

// Floating brand-voice switch. Fixed top-right, compact. The active voice is
// filled and named so it's always obvious which register the page speaks in.
export default function VoiceToggle() {
  const { voice, setVoice } = useVoice()

  return (
    <div className="fixed bottom-3 right-3 z-50 flex items-stretch border border-brass/60 bg-onyx/95 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur">
      <span className="flex items-center px-2 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-brass">
        Voice
      </span>
      {Object.entries(VOICES).map(([key, v]) => {
        const active = voice === key
        return (
          <button
            key={key}
            onClick={() => setVoice(key)}
            aria-pressed={active}
            title={`Switch to ${v.name} voice`}
            className={`flex items-center gap-1.5 px-3 py-2.5 font-serif text-sm font-semibold transition ${
              active ? "bg-brass text-onyx" : "text-bone/45 hover:text-bone/80"
            }`}
          >
            <span className={`h-1.5 w-1.5 shrink-0 ${active ? "bg-onyx" : "bg-transparent"}`} />
            {v.name}
          </button>
        )
      })}
    </div>
  )
}
