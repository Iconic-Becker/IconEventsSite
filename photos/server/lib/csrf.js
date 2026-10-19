// Writes must come from our own origin. Cookies are SameSite=Lax, which
// already blocks cross-site POSTs in modern browsers; this check covers the
// rest and is cheap.
import { config } from "../config.js"
import { forbidden } from "./http.js"

export function csrf(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next()
  const origin = req.get("origin") || (req.get("referer") ? new URL(req.get("referer")).origin : null)
  if (!origin) return next(forbidden("Missing origin"))
  const allowed = new Set([config.publicUrl, ...config.extraOrigins])
  if (!config.prod) {
    allowed.add("http://localhost:5173")
    allowed.add(`http://localhost:${config.port}`)
    allowed.add(`http://127.0.0.1:${config.port}`)
  }
  if (!allowed.has(origin)) return next(forbidden("Cross-origin request refused"))
  next()
}
