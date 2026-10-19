import { createHmac, timingSafeEqual } from "node:crypto"
import { config } from "../config.js"

const base = { httpOnly: true, sameSite: "lax", secure: config.prod, path: "/" }

export function setCookie(res, name, value, { days = 30 } = {}) {
  res.cookie(name, value, { ...base, maxAge: days * 86400 * 1000 })
}

export function clearCookie(res, name) {
  res.clearCookie(name, base)
}

export function hmac(...parts) {
  return createHmac("sha256", config.sessionSecret).update(parts.join("\n")).digest("base64url")
}

export function safeEqual(a, b) {
  const x = Buffer.from(String(a || ""))
  const y = Buffer.from(String(b || ""))
  return x.length === y.length && x.length > 0 && timingSafeEqual(x, y)
}
