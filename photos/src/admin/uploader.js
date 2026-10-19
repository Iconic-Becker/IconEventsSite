// Browser upload engine. Files go straight to storage with presigned URLs:
// small files in one PUT, large files in parts. Several files run at
// once, every part retries with backoff, and when the network drops the
// engine waits for it to come back and asks the server which parts
// landed, so nothing already stored is sent twice. Re-dropping a folder
// after a page reload resumes the same way, because the server matches
// files by path and size.
import { post, get } from "../shared/api.js"

const FILE_CONCURRENCY = 4
const PART_CONCURRENCY = 3
const INIT_BATCH = 150

export async function collectFiles(dataTransferOrFiles) {
  const out = []
  if (dataTransferOrFiles instanceof FileList || Array.isArray(dataTransferOrFiles)) {
    for (const f of dataTransferOrFiles) out.push({ file: f, path: f.webkitRelativePath || f.name })
    return out
  }
  const items = [...(dataTransferOrFiles.items || [])]
  const entries = items.map((i) => i.webkitGetAsEntry?.()).filter(Boolean)
  if (!entries.length) {
    for (const f of dataTransferOrFiles.files) out.push({ file: f, path: f.name })
    return out
  }
  const walk = (entry, prefix) =>
    new Promise((resolve, reject) => {
      if (entry.isFile) {
        entry.file((file) => {
          if (!file.name.startsWith(".")) out.push({ file, path: prefix + file.name })
          resolve()
        }, reject)
      } else if (entry.isDirectory) {
        const reader = entry.createReader()
        const all = []
        const read = () =>
          reader.readEntries(async (batch) => {
            if (!batch.length) {
              for (const e of all) await walk(e, prefix + entry.name + "/")
              return resolve()
            }
            all.push(...batch)
            read()
          }, reject)
        read()
      } else resolve()
    })
  for (const e of entries) await walk(e, "")
  return out
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Resolves when the browser says it is online again. Listens for the
// event, polls in case the event never fires, and gives up waiting after
// ten seconds so the next attempt simply tries (and backs off on failure).
function waitOnline() {
  if (navigator.onLine) return Promise.resolve()
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearInterval(poll)
      clearTimeout(cap)
      window.removeEventListener("online", finish)
      resolve()
    }
    window.addEventListener("online", finish)
    const poll = setInterval(() => navigator.onLine && finish(), 1000)
    const cap = setTimeout(finish, 10000)
  })
}

// PUT with progress, via XHR because fetch has no upload progress.
function putWithProgress(url, blob, onProgress, signal) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", url)
    xhr.upload.onprogress = (e) => onProgress(e.loaded)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.getResponseHeader("ETag") || "")
      else reject(new Error(`Storage answered ${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error("Network error"))
    xhr.onabort = () => reject(Object.assign(new Error("Cancelled"), { cancelled: true }))
    xhr.ontimeout = () => reject(new Error("Timed out"))
    xhr.timeout = 10 * 60 * 1000
    signal?.addEventListener("abort", () => xhr.abort(), { once: true })
    xhr.send(blob)
  })
}

// Failures while offline do not count as attempts: a long outage during
// a migration should pause the upload, not fail it.
async function retry(fn, { attempts = 8, signal } = {}) {
  let delay = 1000
  let failures = 0
  for (;;) {
    try {
      await waitOnline()
      return await fn()
    } catch (err) {
      if (err.cancelled || signal?.aborted) throw err
      if (err.status === 400 || err.status === 404) throw err
      if (navigator.onLine) failures++
      if (failures > attempts) throw err
      await sleep(delay)
      delay = Math.min(delay * 2, 30000)
    }
  }
}

export class Uploader {
  constructor({ galleryId, target = "album", onChange }) {
    this.galleryId = galleryId
    this.target = target
    this.onChange = onChange
    this.files = [] // { id, path, size, file, status, sent, error, mediaId }
    this.abort = new AbortController()
    this.running = false
  }

  add(items) {
    for (const it of items) {
      this.files.push({ id: Math.random().toString(36).slice(2), path: it.path, size: it.file.size, file: it.file, status: "queued", sent: 0 })
    }
    this.emit()
    if (!this.running) this.start()
  }

  cancel() {
    this.abort.abort()
  }

  emit() {
    const total = this.files.reduce((a, f) => a + f.size, 0)
    const sent = this.files.reduce((a, f) => a + (f.status === "done" || f.status === "skipped" ? f.size : f.sent), 0)
    const done = this.files.filter((f) => f.status === "done" || f.status === "skipped").length
    const failed = this.files.filter((f) => f.status === "failed").length
    this.onChange?.({ files: this.files, total, sent, done, failed, running: this.running })
  }

  async start() {
    this.running = true
    this.emit()
    try {
      while (true) {
        const queued = this.files.filter((f) => f.status === "queued")
        if (!queued.length) break
        const batch = queued.slice(0, INIT_BATCH)
        for (const f of batch) f.status = "planning"
        let plan
        try {
          plan = await retry(() => post(`/api/admin/galleries/${this.galleryId}/uploads`, { target: this.target, files: batch.map((f) => ({ path: f.path, size: f.size, type: f.file.type, lastModified: f.file.lastModified })) }), { signal: this.abort.signal })
        } catch (err) {
          for (const f of batch) {
            f.status = "failed"
            f.error = err.message
          }
          this.emit()
          continue
        }
        const byPath = new Map(plan.files.map((p) => [p.path, p]))
        const work = []
        for (const f of batch) {
          const p = byPath.get(f.path)
          if (!p) {
            f.status = "failed"
            f.error = "Not in the server's plan"
            continue
          }
          if (p.skipped) {
            f.status = "skipped"
            f.error = p.reason
            f.mediaId = p.mediaId
            continue
          }
          f.plan = p
          f.mediaId = p.mediaId
          f.status = "ready"
          work.push(f)
        }
        this.emit()
        await this.runPool(work)
      }
    } finally {
      this.running = false
      this.emit()
    }
  }

  async runPool(work) {
    let i = 0
    const next = async () => {
      while (i < work.length) {
        const f = work[i++]
        if (this.abort.signal.aborted) return
        try {
          await this.uploadOne(f)
          f.status = "done"
          f.sent = f.size
        } catch (err) {
          f.status = this.abort.signal.aborted ? "cancelled" : "failed"
          f.error = err.message
        }
        this.emit()
      }
    }
    await Promise.all(Array.from({ length: Math.min(FILE_CONCURRENCY, work.length) }, next))
  }

  async uploadOne(f) {
    f.status = "uploading"
    this.emit()
    const { plan } = f
    const signal = this.abort.signal
    if (!plan.multipart) {
      await retry(() => putWithProgress(plan.putUrl, f.file, (n) => { f.sent = n; this.emit() }, signal), { signal })
      await retry(() => post(`/api/admin/uploads/${f.mediaId}/complete`, {}), { signal })
      return
    }
    const partSize = plan.partSize
    const total = Math.ceil(f.size / partSize)
    const done = new Map((plan.parts || []).map((p) => [p.partNumber, p.etag]))
    const progress = new Map()
    const update = () => {
      let sent = 0
      for (const [n] of done) sent += Math.min(partSize, f.size - (n - 1) * partSize)
      for (const [n, v] of progress) if (!done.has(n)) sent += v
      f.sent = sent
      this.emit()
    }
    update()
    let n = 0
    const worker = async () => {
      while (true) {
        n++
        const part = n
        if (part > total) return
        if (done.has(part)) continue
        const start = (part - 1) * partSize
        const blob = f.file.slice(start, Math.min(f.size, start + partSize))
        await retry(
          async () => {
            try {
              const { url } = await post(`/api/admin/uploads/${f.mediaId}/part-url`, { partNumber: part })
              const etag = await putWithProgress(url, blob, (v) => { progress.set(part, v); update() }, signal)
              done.set(part, etag)
              progress.delete(part)
              update()
            } catch (err) {
              // After a network drop, ask what actually landed before retrying.
              if (!err.cancelled) {
                try {
                  const { parts } = await get(`/api/admin/uploads/${f.mediaId}/parts`)
                  for (const p of parts) done.set(p.partNumber, p.etag)
                  if (done.has(part)) {
                    progress.delete(part)
                    update()
                    return
                  }
                } catch {
                  /* still offline */
                }
              }
              throw err
            }
          },
          { attempts: 12, signal },
        )
      }
    }
    await Promise.all(Array.from({ length: Math.min(PART_CONCURRENCY, total) }, worker))
    await retry(() => post(`/api/admin/uploads/${f.mediaId}/complete`, { parts: [...done].map(([partNumber, etag]) => ({ partNumber, etag })) }), { signal })
  }
}
