import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CaseStudyPage, { CaseStudyNotFound } from './components/CaseStudyPage.jsx'
import NextSteps from './components/NextSteps.jsx'
import { caseStudyFromPath, assertLanderSlugsResolve } from './case-studies.js'
import { WORK } from './content.js'
import { VoiceProvider } from './voice.jsx'
import './index.css'

if (import.meta.env.DEV) assertLanderSlugsResolve(WORK)

/* Routing. Held in state rather than read once at module load, so the form
   can move a visitor to /nextsteps without a server round trip, and the
   back button still works. */
function Root() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    window.addEventListener('popstate', sync)
    window.addEventListener('app:navigate', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('app:navigate', sync)
    }
  }, [])

  const clean = path.replace(/\/+$/, '') || '/'

  if (clean === '/nextsteps') return <NextSteps />

  if (path.startsWith('/case-studies')) {
    const study = caseStudyFromPath(path)
    return study ? <CaseStudyPage study={study} /> : <CaseStudyNotFound />
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VoiceProvider>
      <Root />
    </VoiceProvider>
  </React.StrictMode>,
)
