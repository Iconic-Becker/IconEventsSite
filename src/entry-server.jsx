import React from 'react'
import { renderToString } from 'react-dom/server'
import { routeFor } from './routes.jsx'
import { VoiceProvider } from './voice.jsx'

export function render(url) {
  return renderToString(
    <React.StrictMode>
      <VoiceProvider>{routeFor(url)}</VoiceProvider>
    </React.StrictMode>,
  )
}
