// Fixed-window limiter in memory. By default only failed responses count,
// so a team signing in from one office does not lock itself out while a
// password guesser still does. One server process serves this product; if
// that changes, move the counters to Postgres.
import { HttpError } from "./http.js"

export function rateLimit({ name, limit, windowMs, countAll = false }) {
  const hits = new Map()
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
  }, windowMs).unref()
  return (req, res, next) => {
    const key = `${name}:${req.ip}`
    const now = Date.now()
    let h = hits.get(key)
    if (!h || h.reset < now) {
      h = { count: 0, reset: now + windowMs }
      hits.set(key, h)
    }
    if (h.count >= limit) {
      res.set("Retry-After", String(Math.ceil((h.reset - now) / 1000)))
      return next(new HttpError(429, "Too many attempts. Try again in a few minutes."))
    }
    res.on("finish", () => {
      if (countAll || res.statusCode >= 400) h.count++
    })
    next()
  }
}
