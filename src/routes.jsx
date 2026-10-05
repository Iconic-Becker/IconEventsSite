import App from "./App.jsx"
import CaseStudyPage, { CaseStudyNotFound } from "./components/CaseStudyPage.jsx"
import CaseStudiesIndex from "./components/CaseStudiesIndex.jsx"
import NextSteps from "./components/NextSteps.jsx"
import Vendors from "./components/Vendors.jsx"
import Contact from "./components/Contact.jsx"
import GalleryPage from "./components/GalleryPage.jsx"
import { caseStudyFromPath } from "./case-studies.js"

/* The one place a URL becomes a page.

   Both entries use it: prerender renders through it on the server, and the
   browser hydrates through it. If the two ever disagreed about what a path
   renders, React would throw away the prerendered markup and the SEO work
   would be wasted, so neither entry is allowed its own copy of this logic. */
export function routeFor(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/"

  if (clean === "/nextsteps") return <NextSteps />

  // One page for everyone selling to us. /partners was the earlier URL and
  // is redirected to this one by the server, so links already shared still
  // land somewhere.
  if (clean === "/vendors" || clean === "/partners") return <Vendors />

  if (clean === "/contact") return <Contact />

  if (clean === "/gallery") return <GalleryPage />

  if (clean === "/case-studies") return <CaseStudiesIndex />

  if (clean.startsWith("/case-studies")) {
    const study = caseStudyFromPath(pathname)
    return study ? <CaseStudyPage study={study} /> : <CaseStudyNotFound />
  }

  return <App />
}
