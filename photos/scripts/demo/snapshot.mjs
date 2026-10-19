// Exports one gallery as static JSON plus its media files, for the demo
// build (VITE_DEMO=1). Reads the running local server and local storage.
//   node scripts/demo/snapshot.mjs <slug> [outDir]
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const [slug, outDir = "demo-src"] = process.argv.slice(2)
const base = "http://localhost:3000"
mkdirSync(join(outDir, "media"), { recursive: true })
const copied = new Map()

function localize(url) {
  if (!url || typeof url !== "string" || !url.includes("/_local/")) return url
  const key = decodeURIComponent(new URL(url).pathname.replace(/^\/_local\//, ""))
  if (!copied.has(key)) {
    const name = key.replace(/^g\/\d+\//, "").replace(/\//g, "-")
    copyFileSync(join("data/storage", key), join(outDir, "media", name))
    copied.set(key, `media/${name}`)
  }
  return copied.get(key)
}

function walk(v) {
  if (Array.isArray(v)) return v.map(walk)
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]))
  return localize(v)
}

const gallery = await (await fetch(`${base}/api/g/${slug}`)).json()
if (gallery.locked) throw new Error("gallery is locked")
const albums = {}
for (const a of gallery.albums) albums[a.slug] = await (await fetch(`${base}/api/g/${slug}/albums/${a.slug}`)).json()
const data = walk({ gallery, albums })
writeFileSync(join(outDir, "data.json"), JSON.stringify(data))
console.log(`snapshot: ${gallery.albums.length} albums, ${copied.size} media files -> ${outDir}`)
