export class HttpError extends Error {
  constructor(status, message, extra) {
    super(message)
    this.status = status
    this.extra = extra
  }
}

export const bad = (msg, extra) => new HttpError(400, msg, extra)
export const unauthorized = (msg = "Sign in required") => new HttpError(401, msg)
export const forbidden = (msg = "Not allowed") => new HttpError(403, msg)
export const notFound = (msg = "Not found") => new HttpError(404, msg)

// Express 5 forwards rejected promises to the error handler itself, but a
// named wrapper keeps the intent visible where routes are defined.
export const route = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

export function errorHandler(err, req, res, _next) {
  const status = err.status || (err.type === "entity.too.large" ? 413 : 500)
  if (status >= 500) console.error(err)
  res.status(status).json({ error: status >= 500 ? "Something went wrong" : err.message, ...(err.extra || {}) })
}

export function str(v, max = 500) {
  if (v === undefined || v === null) return ""
  return String(v).trim().slice(0, max)
}

export function int(v, fallback = null) {
  const n = Number.parseInt(v, 10)
  return Number.isFinite(n) ? n : fallback
}
