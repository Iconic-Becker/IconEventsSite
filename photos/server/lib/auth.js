// Admin accounts and sessions. Passwords are bcrypt hashed; the session
// token lives only in an httpOnly cookie and is stored hashed in Postgres.
import bcrypt from "bcryptjs"
import { createHash, randomBytes } from "node:crypto"
import { one, query } from "../db/pool.js"
import { setCookie, clearCookie } from "./cookies.js"
import { unauthorized, forbidden } from "./http.js"

const COOKIE = "ip_session"
const DAYS = 30

export const hashPassword = (pw) => bcrypt.hash(pw, 12)
export const checkPassword = (pw, hash) => bcrypt.compare(pw, hash)

const tokenId = (token) => createHash("sha256").update(token).digest("hex")

export async function startSession(res, userId) {
  const token = randomBytes(32).toString("base64url")
  await query("insert into sessions(id, user_id, expires_at) values ($1, $2, now() + ($3 || ' days')::interval)", [tokenId(token), userId, String(DAYS)])
  setCookie(res, COOKIE, token, { days: DAYS })
}

export async function endSession(req, res) {
  const token = req.cookies?.[COOKIE]
  if (token) await query("delete from sessions where id = $1", [tokenId(token)])
  clearCookie(res, COOKIE)
}

export async function currentUser(req) {
  const token = req.cookies?.[COOKIE]
  if (!token) return null
  return one(
    `select u.id, u.email, u.name, u.role from sessions s join users u on u.id = s.user_id
     where s.id = $1 and s.expires_at > now() and not u.disabled`,
    [tokenId(token)],
  )
}

export function requireUser(role) {
  return async (req, res, next) => {
    try {
      const user = await currentUser(req)
      if (!user) throw unauthorized()
      if (role === "owner" && user.role !== "owner") throw forbidden("Owner access required")
      req.user = user
      next()
    } catch (err) {
      next(err)
    }
  }
}

export function validPassword(pw) {
  return typeof pw === "string" && pw.length >= 10 && pw.length <= 200
}

export const normalizeEmail = (e) => String(e || "").trim().toLowerCase().slice(0, 254)
export const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
