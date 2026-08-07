import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CaseStudyPage from './components/CaseStudyPage.jsx'
import { VoiceProvider } from './voice.jsx'
import './index.css'

const Page = window.location.pathname.startsWith('/case-studies/') ? CaseStudyPage : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VoiceProvider>
      <Page />
    </VoiceProvider>
  </React.StrictMode>,
)
