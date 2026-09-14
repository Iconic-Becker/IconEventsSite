import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CaseStudyPage from './components/CaseStudyPage.jsx'
import { VoiceProvider } from './voice.jsx'
import './index.css'

const Page = window.location.pathname.startsWith('/case-studies/') ? CaseStudyPage : App

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <VoiceProvider>
      <Page />
    </VoiceProvider>
  </React.StrictMode>
)

// Production HTML is prerendered (see prerender.js); dev serves an empty root.
if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
