// Applies server/db/schema.sql. The file is split on "-- migration:" lines;
// each block runs once and is recorded by name. Safe to run on every boot.
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { pool } from "./pool.js"

const here = dirname(fileURLToPath(import.meta.url))

export async function migrate() {
  const sql = readFileSync(join(here, "schema.sql"), "utf8")
  const blocks = sql
    .split(/^-- migration: /m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf("\n")
      return { name: chunk.slice(0, nl).trim(), sql: chunk.slice(nl + 1) }
    })
  const client = await pool.connect()
  try {
    await client.query(`create table if not exists schema_migrations (
      name text primary key, applied_at timestamptz not null default now())`)
    // Only one process should migrate at a time.
    await client.query("select pg_advisory_lock(727001)")
    const { rows } = await client.query("select name from schema_migrations")
    const done = new Set(rows.map((r) => r.name))
    for (const block of blocks) {
      if (done.has(block.name)) continue
      await client.query("BEGIN")
      try {
        await client.query(block.sql)
        await client.query("insert into schema_migrations(name) values ($1)", [block.name])
        await client.query("COMMIT")
        console.log(`[migrate] applied ${block.name}`)
      } catch (err) {
        await client.query("ROLLBACK")
        throw err
      }
    }
    await client.query("select pg_advisory_unlock(727001)")
  } finally {
    client.release()
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  migrate()
    .then(() => pool.end())
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
