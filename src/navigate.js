/* Client side navigation for the handful of real routes this site has.

   Used so the form can move a visitor to /nextsteps without a server round
   trip. That matters: a full page load of /nextsteps depends on the host
   rewriting unknown paths to index.html, which is not yet configured. This
   way the flow that follows a submission works either way. */
export function navigate(to) {
  if (window.location.pathname === to) return
  window.history.pushState({}, "", to)
  window.dispatchEvent(new Event("app:navigate"))
  window.scrollTo({ top: 0 })
}
