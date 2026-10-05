/* A page whose code ships in its own chunk, fetched only when that page is
   the one being shown.

   React.lazy alone would break the prerender: renderToString cannot wait
   for a chunk, and the browser would hydrate a placeholder over real
   markup. So both entries call preloadRoute() first. Once the chunk has
   arrived the page renders synchronously, exactly like a normal import,
   and the server HTML and the first browser render agree.

   If the page is reached without a preload (a client side navigation), it
   suspends instead, and routes.jsx wraps it in a Suspense boundary. */
export function splitPage(load) {
  let Page = null
  let pending = null
  const preload = () => {
    pending ??= load().then((mod) => {
      Page = mod.default
    })
    return pending
  }
  function SplitPage(props) {
    if (!Page) throw preload()
    return <Page {...props} />
  }
  SplitPage.preload = preload
  return SplitPage
}
