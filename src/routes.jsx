import App from "./App.jsx"
import CaseStudyPage, { CaseStudyNotFound } from "./components/CaseStudyPage.jsx"
import NextSteps from "./components/NextSteps.jsx"
import { caseStudyFromPath } from "./case-studies.js"

/* The one place a URL becomes a page.

   Both entries use it: prerender renders through it on the server, and the
   browser hydrates through it. If the two ever disagreed about what a path
   renders, React would throw away the prerendered markup and the SEO work
   would be wasted, so neither entry is allowed its own copy of this logic. */
export function routeFor(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/"

  if (clean === "/nextsteps") return <NextSteps />

  if (clean.startsWith("/case-studies")) {
    const study = caseStudyFromPath(pathname)
    return study ? <CaseStudyPage study={study} /> : <CaseStudyNotFound />
  }

  return <App />
}
