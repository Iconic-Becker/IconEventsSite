// Uploads a folder to a gallery through the same API the browser uses.
// Handy for tests and as a fallback for very large migrations.
//   node scripts/api-upload.mjs <base> <email> <password> <galleryId> <folder> [--reel file]
import { readdir, stat, open } from "node:fs/promises"
import { join, relative, basename } from "node:path"

const [base, email, password, galleryId, folder] = process.argv.slice(2)
const reelFile = process.argv.includes("--reel") ? process.argv[process.argv.indexOf("--reel") + 1] : null
// Files already in the gallery are skipped unless --replace is given.
const onConflict = process.argv.includes("--replace") ? "replace" : "skip"
if (!folder) {
  console.error("Usage: node scripts/api-upload.mjs <base> <email> <password> <galleryId> <folder>")
  process.exit(1)
}

let cookie = ""
async function api(path, opts = {}) {
  const res = await fetch(base + path, {
    ...opts,
    headers: { "Content-Type": "application/json", Origin: base, Cookie: cookie, ...(opts.headers || {}) },
  })
  const set = res.headers.get("set-cookie")
  if (set) cookie = set.split(";")[0]
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${path}: ${res.status} ${body.error || ""}`)
  return body
}

async function walk(dir, root) {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p, root)))
    else out.push({ path: `${basename(root)}/${relative(root, p)}`, abs: p, size: (await stat(p)).size })
  }
  return out
}

async function putRange(url, abs, start, end) {
  const fh = await open(abs, "r")
  try {
    const buf = Buffer.alloc(end - start)
    await fh.read(buf, 0, end - start, start)
    const res = await fetch(url, { method: "PUT", body: buf })
    if (!res.ok) throw new Error(`PUT ${res.status}`)
    return res.headers.get("etag")
  } finally {
    await fh.close()
  }
}

async function uploadSet(files, target) {
  const { files: plan } = await api(`/api/admin/galleries/${galleryId}/uploads`, { method: "POST", body: JSON.stringify({ target, onConflict, files: files.map((f) => ({ path: f.path, size: f.size })) }) })
  for (const entry of plan) {
    const f = files.find((x) => x.path === entry.path)
    if (entry.skipped) {
      console.log(`skip ${entry.path}: ${entry.reason}`)
      continue
    }
    if (!entry.multipart) {
      await putRange(entry.putUrl, f.abs, 0, f.size)
      await api(`/api/admin/uploads/${entry.mediaId}/complete`, { method: "POST", body: JSON.stringify({}) })
    } else {
      const parts = new Map(entry.parts.map((p) => [p.partNumber, p.etag]))
      const total = Math.ceil(f.size / entry.partSize)
      for (let n = 1; n <= total; n++) {
        if (parts.has(n)) continue
        const { url } = await api(`/api/admin/uploads/${entry.mediaId}/part-url`, { method: "POST", body: JSON.stringify({ partNumber: n }) })
        const etag = await putRange(url, f.abs, (n - 1) * entry.partSize, Math.min(f.size, n * entry.partSize))
        parts.set(n, etag)
      }
      await api(`/api/admin/uploads/${entry.mediaId}/complete`, { method: "POST", body: JSON.stringify({ parts: [...parts].map(([partNumber, etag]) => ({ partNumber, etag })) }) })
    }
    console.log(`uploaded ${entry.path}`)
  }
}

await api("/api/admin/login", { method: "POST", body: JSON.stringify({ email, password }) })
const files = await walk(folder, folder)
await uploadSet(files.filter((f) => !reelFile || f.abs !== reelFile), "album")
if (reelFile) await uploadSet([{ path: basename(reelFile), abs: reelFile, size: (await stat(reelFile)).size }], "reel")
console.log("done")
