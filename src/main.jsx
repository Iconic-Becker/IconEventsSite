import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CaseStudyPage, { CaseStudyNotFound } from './components/CaseStudyPage.jsx'
import { caseStudyFromPath, assertLanderSlugsResolve } from './case-studies.js'
import { WORK } from './content.js'
import { VoiceProvider } from './voice.jsx'
import './index.css'

if (import.meta.env.DEV) assertLanderSlugsResolve(WORK)

/* Routing: /case-studies/<slug> resolves to one event's dedicated page.
   An unknown slug renders the not-found state rather than defaulting to
   whichever case study happens to be first. */
function Root() {
  const { pathname } = window.location
  if (!pathname.startsWith('/case-studies')) return <App />
  const study = caseStudyFromPath(pathname)
  return study ? <CaseStudyPage study={study} /> : <CaseStudyNotFound />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VoiceProvider>
      <Root />
    </VoiceProvider>
  </React.StrictMode>,
)
