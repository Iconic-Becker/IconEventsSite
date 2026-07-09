import { createContext, useContext, useState } from "react"
import { DEFAULT_VOICE } from "./content.js"

// Holds the active brand voice and resolves V() pairs to the live string.
const VoiceContext = createContext(null)

export function VoiceProvider({ children }) {
  const [voice, setVoice] = useState(DEFAULT_VOICE)
  const toggle = () => setVoice((v) => (v === "iconic" ? "genflow" : "iconic"))

  // t(pair) → the string for the active voice. Passes plain strings through,
  // so constant copy (event name, legal text) needs no V() wrapper.
  const t = (pair) =>
    pair && typeof pair === "object" && "iconic" in pair ? pair[voice] : pair

  return (
    <VoiceContext.Provider value={{ voice, setVoice, toggle, t }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const ctx = useContext(VoiceContext)
  if (!ctx) throw new Error("useVoice must be used within a VoiceProvider")
  return ctx
}
