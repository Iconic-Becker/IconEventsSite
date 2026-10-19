// A small job queue on Postgres. Workers claim rows with SKIP LOCKED, so
// several worker processes can run against the same table later without
// changes.
import { query, one } from "../db/pool.js"
import { config } from "../config.js"

const handlers = new Map()
export function register(type, fn) {
  handlers.set(type, fn)
}

export async function enqueue(type, payload = {}, { delaySeconds = 0, dedupe = false } = {}) {
  if (dedupe) {
    const existing = await one(
      "select id from jobs where type = $1 and payload = $2::jsonb and status in ('queued', 'running') limit 1",
      [type, JSON.stringify(payload)],
    )
    if (existing) return existing.id
  }
  const row = await one(
    "insert into jobs(type, payload, run_after) values ($1, $2, now() + ($3 || ' seconds')::interval) returning id",
    [type, JSON.stringify(payload), String(delaySeconds)],
  )
  return row.id
}

async function claim() {
  return one(`
    update jobs set status = 'running', locked_at = now(), attempts = attempts + 1
    where id = (
      select id from jobs
      where status = 'queued' and run_after <= now()
      order by id
      for update skip locked
      limit 1
    )
    returning *`)
}

// Jobs currently running in this process, so a shutdown can hand them back.
const inFlight = new Set()

async function runOne(job) {
  const fn = handlers.get(job.type)
  inFlight.add(job.id)
  // Heartbeat: a job that stops updating locked_at is one whose process
  // died, and gets requeued by recoverStale below.
  const beat = setInterval(() => query("update jobs set locked_at = now() where id = $1 and status = 'running'", [job.id]).catch(() => {}), 30000)
  try {
    if (!fn) throw new Error(`No handler for job type ${job.type}`)
    await fn(job.payload, job)
    await query("update jobs set status = 'done', finished_at = now() where id = $1", [job.id])
  } catch (err) {
    const retry = job.attempts < 3 && !err.permanent
    console.error(`[jobs] ${job.type} #${job.id} failed (attempt ${job.attempts}):`, err.message)
    await query(
      `update jobs set status = $2, error = $3, run_after = now() + ($4 || ' seconds')::interval, finished_at = case when $2 = 'failed' then now() end where id = $1`,
      [job.id, retry ? "queued" : "failed", String(err.stack || err.message).slice(0, 4000), String(30 * job.attempts)],
    )
  } finally {
    clearInterval(beat)
    inFlight.delete(job.id)
  }
}

// Puts back jobs whose worker vanished (no heartbeat for 3 minutes) and
// re-queues media that was uploaded but has no job to process it.
export async function recoverStale({ all = false } = {}) {
  const stale = await query(
    all
      ? "update jobs set status = 'queued', locked_at = null where status = 'running' returning id"
      : "update jobs set status = 'queued', locked_at = null where status = 'running' and locked_at < now() - interval '3 minutes' returning id",
  )
  const orphaned = await query(`
    update media m set status = 'uploaded'
    where m.status in ('uploaded', 'processing') and m.trashed_at is null and m.created_at < now() - interval '2 minutes'
      and not exists (select 1 from jobs j where j.type = 'process_media' and j.status in ('queued', 'running') and (j.payload->>'mediaId')::bigint = m.id)
    returning m.id`)
  for (const row of orphaned.rows) await enqueue("process_media", { mediaId: row.id })
  // Failed jobs for media that still waits: give them one more go.
  const failed = await query(`
    update jobs j set status = 'queued', attempts = 0, run_after = now(), error = null
    where j.type = 'process_media' and j.status = 'failed'
      and exists (select 1 from media m where m.id = (j.payload->>'mediaId')::bigint and m.status in ('uploaded', 'processing') and m.trashed_at is null)
    returning j.id`)
  const n = stale.rowCount + orphaned.rowCount + failed.rowCount
  if (n) console.log(`[jobs] recovered ${stale.rowCount} stale job(s), ${orphaned.rowCount} orphaned upload(s), ${failed.rowCount} failed job(s)`)
  if (n) poke()
  return { stale: stale.rowCount, orphaned: orphaned.rowCount, failed: failed.rowCount }
}

let running = false
let wake = null

// Called after enqueue so the worker picks the job up without waiting for
// the next poll.
export function poke() {
  if (wake) wake()
}

export async function startWorker() {
  if (running) return
  running = true
  // One worker process runs at a time, so anything still marked running at
  // boot belonged to the process that just stopped.
  await recoverStale({ all: true })
  setInterval(() => recoverStale().catch((err) => console.error("[jobs] recovery failed:", err.message)), 60000).unref()
  const loop = async (slot) => {
    while (running) {
      let job = null
      try {
        job = await claim()
      } catch (err) {
        console.error("[jobs] claim failed:", err.message)
      }
      if (job) {
        await runOne(job)
        continue
      }
      await new Promise((res) => {
        const t = setTimeout(res, 3000)
        wake = () => {
          clearTimeout(t)
          res()
        }
      })
    }
  }
  for (let i = 0; i < config.workerConcurrency; i++) loop(i)
  // Housekeeping once an hour.
  setInterval(() => enqueue("housekeeping", {}, { dedupe: true }).then(poke), 3600 * 1000).unref()
  await enqueue("housekeeping", {}, { dedupe: true })
  console.log(`[jobs] worker started with concurrency ${config.workerConcurrency}`)
}

export function stopWorker() {
  running = false
}

// On a deploy or restart, hand running jobs back to the queue so the next
// process picks them up at once instead of waiting for recovery.
export async function releaseInFlight() {
  running = false
  if (!inFlight.size) return
  await query("update jobs set status = 'queued', locked_at = null where id = any($1::bigint[])", [[...inFlight]]).catch(() => {})
  console.log(`[jobs] released ${inFlight.size} running job(s) for the next process`)
}
