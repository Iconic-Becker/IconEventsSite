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

async function runOne(job) {
  const fn = handlers.get(job.type)
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
  }
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
  // Jobs left "running" by a crashed process go back to the queue.
  await query("update jobs set status = 'queued' where status = 'running' and locked_at < now() - interval '30 minutes'")
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
