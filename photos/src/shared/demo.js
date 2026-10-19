// Demo mode (VITE_DEMO=1): the gallery runs from a static snapshot with no
// server. Favorites live in this browser only; downloads and sharing are
// explained rather than performed. Used to publish a clickable preview.
export const DEMO = import.meta.env.VITE_DEMO === "1"

let dataPromise
const load = () => (dataPromise ||= fetch("./data.json").then((r) => r.json()))

const LS = "iconic-photos-demo"
function state() {
  try {
    return JSON.parse(localStorage.getItem(LS) || "{}")
  } catch {
    return {}
  }
}
function save(s) {
  try {
    localStorage.setItem(LS, JSON.stringify(s))
  } catch {
    /* private window */
  }
}

export async function demoApi(path, { method = "GET", body } = {}) {
  const { gallery, albums } = await load()
  const url = new URL(path, "http://demo.local")
  const parts = url.pathname.split("/").filter(Boolean) // api, g, slug, ...
  const rest = parts.slice(3)
  const s = state()
  const fail = (status, error) => {
    const err = new Error(error)
    err.status = status
    err.body = { error }
    throw err
  }
  if (parts[1] !== "g") fail(404, "Not available in the demo")
  if (rest.length === 0) return gallery
  if (rest[0] === "albums") return albums[rest[1]] || fail(404, "Album not found")
  if (rest[0] === "me") return { guest: s.guest || null, favorites: s.favorites || [] }
  if (rest[0] === "guest" && method === "POST") {
    s.guest = { email: body.email, name: body.name || "" }
    s.favorites ||= []
    save(s)
    return { guest: s.guest, favorites: s.favorites }
  }
  if (rest[0] === "favorites") {
    if (!s.guest) return Promise.reject(Object.assign(new Error("Enter your email to save favorites"), { status: 401, body: { needEmail: true } }))
    const id = Number(rest[1])
    s.favorites = (s.favorites || []).filter((x) => x !== id)
    if (method === "PUT") s.favorites.push(id)
    save(s)
    return { favorites: s.favorites }
  }
  if (rest[0] === "events") return { ok: true }
  if (rest[0] === "zips") return { status: "demo" }
  fail(404, "Not available in the demo")
}
