import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { routeFor } from './routes.jsx'
import { assertLanderSlugsResolve } from './case-studies.js'
import { WORK } from './content.js'
import { VoiceProvider } from './voice.jsx'
import './index.css'

if (import.meta.env.DEV) assertLanderSlugsResolve(WORK)

/* Routing is held in state rather than read once at module load, so the
   enquiry form can move a visitor to /nextsteps without a server round trip
   and the back button still works. The first render uses the path the page
   was prerendered at, so hydration matches. */
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

  return routeFor(path)
}

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <VoiceProvider>
      <Root />
    </VoiceProvider>
  </React.StrictMode>
)

// Production HTML is prerendered (see prerender.js); dev serves an empty root.
if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
