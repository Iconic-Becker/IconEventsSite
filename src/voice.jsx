import { createContext, useContext } from "react"

// Resolves dual-voice content to the Iconic Events copy.
const VoiceContext = createContext(null)

export function VoiceProvider({ children }) {

  // t(pair) → the Iconic Events string. Passes plain strings through,
  // so constant copy (event name, legal text) needs no V() wrapper.
  const t = (pair) =>
    pair && typeof pair === "object" && "iconic" in pair ? pair.iconic : pair

  return (
    <VoiceContext.Provider value={{ t }}>
      {children}
    </VoiceContext.Provider>
  )
}

export function useVoice() {
  const ctx = useContext(VoiceContext)
  if (!ctx) throw new Error("useVoice must be used within a VoiceProvider")
  return ctx
}
