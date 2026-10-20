import React from 'react'
import { renderToString } from 'react-dom/server'
import { routeFor, preloadRoute } from './routes.jsx'

export { preloadRoute }
import { VoiceProvider } from './voice.jsx'

export function render(url) {
  return renderToString(
    <React.StrictMode>
      <VoiceProvider>{routeFor(url)}</VoiceProvider>
    </React.StrictMode>,
  )
}
