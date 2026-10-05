/* The production server.
 *
 * Railway had no deploy config in this repo, so how the site got served was
 * left to auto-detection. PageSpeed showed the cost: nothing was compressed
 * and nothing carried a cache lifetime, which is most of the gap between a
 * 1.6s Largest Contentful Paint and a 6.5s one.
 *
 * No dependencies. Node's own http and zlib do all of it.
 */
import { createServer } from "node:http"
import { readFileSync, existsSync, statSync } from "node:fs"
import { join, extname, normalize, resolve } from "node:path"
import { gzipSync, brotliCompressSync, constants } from "node:zlib"

const ROOT = resolve("dist")
const PORT = process.env.PORT || 3000

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".webmanifest": "application/manifest+json",
}

// Worth compressing. Images and woff2 are already compressed; running them
// through gzip costs CPU and gains nothing.
const COMPRESS = new Set([".html", ".js", ".css", ".json", ".xml", ".txt", ".svg", ".webmanifest"])

const YEAR = 31536000
const MONTH = 2592000

function cacheControl(path, ext, status) {
  // Never let an error response inherit a long life. The cache rules below
  // are keyed on what was asked for, and a 404 under /assets/ would otherwise
  // be pinned in browsers for a year.
  if (status !== 200) return "no-store"
  // Vite fingerprints these, so the name changes whenever the bytes do.
  if (path.startsWith("/assets/")) return `public, max-age=${YEAR}, immutable`
  // Fonts are stable and are replaced by name when they are not.
  if (ext === ".woff2" || ext === ".woff") return `public, max-age=${YEAR}`
  // Images keep their names across edits, so they get a month rather than a
  // year: long enough to matter, short enough that a replacement lands.
  if (TYPES[ext]?.startsWith("image/")) return `public, max-age=${MONTH}`
  // HTML must revalidate or a deploy would not reach anyone holding a copy.
  if (ext === ".html") return "public, max-age=0, must-revalidate"
  return "public, max-age=3600"
}

// Compressing the same file on every request is wasted work on a static site.
const cache = new Map()
function body(file, encoding) {
  const key = `${file}\u0000${encoding}`
  const hit = cache.get(key)
  if (hit) return hit
  const raw = readFileSync(file)
  const out =
    encoding === "br"
      ? brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 10 } })
      : encoding === "gzip"
        ? gzipSync(raw, { level: 8 })
        : raw
  cache.set(key, out)
  return out
}

// Map a URL to a file on disk, refusing anything that climbs out of dist.
function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "")
  const target = resolve(join(ROOT, clean))
  if (target !== ROOT && !target.startsWith(ROOT + "/")) return null
  const tries = [target]
  if (existsSync(target) && statSync(target).isDirectory()) tries.push(join(target, "index.html"))
  else if (!extname(target)) tries.push(`${target}.html`, join(target, "index.html"))
  for (const t of tries) if (existsSync(t) && statSync(t).isFile()) return t
  return null
}

createServer((req, res) => {
  const method = req.method || "GET"
  if (method !== "GET" && method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" })
    return res.end()
  }

  let file = resolveFile(req.url || "/")
  let status = 200
  const served = (req.url || "/").split("?")[0]
  if (!file) {
    file = join(ROOT, "404.html")
    status = 404
    if (!existsSync(file)) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" })
      return res.end("Not found")
    }
  }

  const ext = extname(file).toLowerCase()
  const accepted = req.headers["accept-encoding"] || ""
  let encoding = null
  if (COMPRESS.has(ext)) {
    if (/\bbr\b/.test(accepted)) encoding = "br"
    else if (/\bgzip\b/.test(accepted)) encoding = "gzip"
  }

  let payload
  try {
    payload = body(file, encoding)
  } catch {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" })
    return res.end("Server error")
  }

  const headers = {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Content-Length": payload.length,
    "Cache-Control": cacheControl(served, ext, status),
    "X-Content-Type-Options": "nosniff",
  }
  if (encoding) {
    headers["Content-Encoding"] = encoding
    headers.Vary = "Accept-Encoding"
  }

  res.writeHead(status, headers)
  res.end(method === "HEAD" ? undefined : payload)
}).listen(PORT, () => {
  console.log(`serving dist on :${PORT}`)
})
