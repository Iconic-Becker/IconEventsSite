import React, { lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom"
import { DEMO } from "./shared/demo.js"
import "./index.css"
import { GalleryPage } from "./guest/GalleryPage.jsx"
import { ReelPage } from "./guest/ReelPage.jsx"
import { Landing } from "./guest/Landing.jsx"
import { Spinner } from "./shared/ui.jsx"

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"))

// The published demo has no server and no URL of its own, so it routes in
// memory and opens on the demo gallery.
const Router = DEMO ? ({ children }) => <MemoryRouter initialEntries={[`/${import.meta.env.VITE_DEMO_SLUG}`]}>{children}</MemoryRouter> : BrowserRouter

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="theme-light u-bg u-fg flex min-h-svh items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="/:slug/reel/:reelId" element={<ReelPage />} />
        <Route path="/:slug/:album?" element={<GalleryPage />} />
      </Routes>
    </Router>
  )
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
