import pg from "pg"
import { config } from "../config.js"

const { Pool } = pg

// Railway's Postgres needs TLS when reached over the public proxy and not
// over the private network. Honour sslmode in the URL, otherwise leave it.
const needsSsl = /sslmode=require/.test(config.databaseUrl) || /\.railway\.app/.test(config.databaseUrl)

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 10,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
})

// Timestamps come back as JS Dates. Bigints (count(*), bigserial) come back
// as strings by default; parse them as numbers, which is safe at our scale.
pg.types.setTypeParser(20, (v) => Number(v))

export async function query(text, params) {
  return pool.query(text, params)
}

export async function one(text, params) {
  const { rows } = await pool.query(text, params)
  return rows[0] || null
}

export async function many(text, params) {
  const { rows } = await pool.query(text, params)
  return rows
}

export async function withTransaction(fn) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await fn(client)
    await client.query("COMMIT")
    return result
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {})
    throw err
  } finally {
    client.release()
  }
}
