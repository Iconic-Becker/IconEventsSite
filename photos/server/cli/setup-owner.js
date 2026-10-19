// One-time: creates the first owner account.
//   npm run setup-owner -- owner@example.com 'a long password'
// Refuses to run if any account exists; use the admin to add more.
import { pool, one, query } from "../db/pool.js"
import { migrate } from "../db/migrate.js"
import { hashPassword, validPassword, normalizeEmail, validEmail } from "../lib/auth.js"

const [email, password] = process.argv.slice(2)
if (!validEmail(normalizeEmail(email)) || !validPassword(password)) {
  console.error("Usage: npm run setup-owner -- <email> <password of at least 10 characters>")
  process.exit(1)
}
await migrate()
if (await one("select 1 from users limit 1")) {
  console.error("An account already exists. Add more users from the admin.")
  process.exit(1)
}
await query("insert into users(email, name, role, password_hash) values ($1, 'Owner', 'owner', $2)", [normalizeEmail(email), await hashPassword(password)])
console.log(`Owner account created for ${normalizeEmail(email)}. Sign in at /admin.`)
await pool.end()
