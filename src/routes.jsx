import { Suspense } from "react"
import App from "./App.jsx"
import CaseStudyPage, { CaseStudyNotFound } from "./components/CaseStudyPage.jsx"
import CaseStudiesIndex from "./components/CaseStudiesIndex.jsx"
import NextSteps from "./components/NextSteps.jsx"
import Vendors from "./components/Vendors.jsx"
import Contact from "./components/Contact.jsx"
import LegalPage from "./components/LegalPage.jsx"
import { PRIVACY, TERMS } from "./legal.js"
import { caseStudyFromPath } from "./case-studies.js"
import { splitPage } from "./lib/split-page.jsx"

// Its own chunk: the gallery carries an animation library no other page
// needs, and it was adding 62 kB gzipped to every page, the homepage too.
const GalleryPage = splitPage(() => import("./components/GalleryPage.jsx"))

const clean = (pathname) => pathname.replace(/\/+$/, "") || "/"

/* Fetch the code for a split page before rendering it. Both entries await
   this, so a split page is never rendered as a placeholder. Resolves at
   once for every other route. */
export function preloadRoute(pathname) {
  if (clean(pathname) === "/gallery") return GalleryPage.preload()
  return Promise.resolve()
}

/* The one place a URL becomes a page.

   Both entries use it: prerender renders through it on the server, and the
   browser hydrates through it. If the two ever disagreed about what a path
   renders, React would throw away the prerendered markup and the SEO work
   would be wasted, so neither entry is allowed its own copy of this logic. */
export function routeFor(pathname) {
  const path = clean(pathname)

  if (path === "/nextsteps") return <NextSteps />

  // One page for everyone selling to us. /partners was the earlier URL and
  // is redirected to this one by the server, so links already shared still
  // land somewhere.
  if (path === "/vendors" || path === "/partners") return <Vendors />

  if (path === "/contact") return <Contact />

  if (path === "/privacy") return <LegalPage doc={PRIVACY} />
  if (path === "/terms") return <LegalPage doc={TERMS} />

  if (path === "/gallery") {
    return (
      <Suspense fallback={<main className="min-h-screen bg-onyx" />}>
        <GalleryPage />
      </Suspense>
    )
  }

  if (path === "/case-studies") return <CaseStudiesIndex />

  if (path.startsWith("/case-studies")) {
    const study = caseStudyFromPath(pathname)
    return study ? <CaseStudyPage study={study} /> : <CaseStudyNotFound />
  }

  return <App />
}
