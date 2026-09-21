import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import CaseStudyPage from './components/CaseStudyPage.jsx'
import { VoiceProvider } from './voice.jsx'

export function render(url) {
  const Page = url.startsWith('/case-studies/') ? CaseStudyPage : App
  return renderToString(
    <React.StrictMode>
      <VoiceProvider>
        <Page />
      </VoiceProvider>
    </React.StrictMode>,
  )
}
