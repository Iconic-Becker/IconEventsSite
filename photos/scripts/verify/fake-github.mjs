// A stand-in for the slice of api.github.com that "Send to website" uses,
// for tests. Keeps blobs, trees, commits, refs and pull requests in memory
// and seeds a repository with a photo folder and a case-studies.js.
//   node scripts/verify/fake-github.mjs [port]
import { createServer } from "node:http"
import { createHash } from "node:crypto"

const port = Number(process.argv[2] || 3999)
const sha = (s) => createHash("sha1").update(s).digest("hex")
const blobs = new Map()
const trees = new Map()
const commits = new Map()
const refs = new Map()
const pulls = []

// Seed: main with one existing folder (two photos) and the library index.
const seedFiles = {
  "public/images/gallery/scaling-with-systems-live-2021/01.webp": Buffer.from("x"),
  "public/images/gallery/scaling-with-systems-live-2021/01-480.webp": Buffer.from("x"),
  "public/images/gallery/scaling-with-systems-live-2021/02.webp": Buffer.from("x"),
  "src/case-studies.js": Buffer.from(`export const PHOTO_LIBRARY = {\n  "scaling-with-systems-live": { folder: "scaling-with-systems-live-2021", count: 2 },\n}\n`),
}
function putBlob(buf) {
  const id = sha("blob" + buf.length + buf.toString("base64"))
  blobs.set(id, buf)
  return id
}
const seedTree = {}
for (const [p, b] of Object.entries(seedFiles)) seedTree[p] = putBlob(b)
const seedTreeSha = sha(JSON.stringify(seedTree))
trees.set(seedTreeSha, seedTree)
const seedCommitSha = sha("commit0")
commits.set(seedCommitSha, { sha: seedCommitSha, tree: { sha: seedTreeSha }, message: "seed", parents: [] })
refs.set("heads/main", seedCommitSha)

const body = (req) => new Promise((r) => { let d = ""; req.on("data", (c) => (d += c)); req.on("end", () => r(d ? JSON.parse(d) : {})) })
const send = (res, code, data) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)) }

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x")
  const p = url.pathname
  const auth = req.headers.authorization || ""
  if (!auth.startsWith("Bearer ")) return send(res, 401, { message: "Bad credentials" })
  if (auth !== "Bearer test-token") return send(res, 401, { message: "Bad credentials" })
  if (p === "/__state") return send(res, 200, { pulls, refs: Object.fromEntries(refs), trees: Object.fromEntries([...trees].map(([k, v]) => [k, Object.keys(v)])), blobSizes: Object.fromEntries([...blobs].map(([k, v]) => [k, v.length])), commits: [...commits.values()] })
  let m
  if (req.method === "GET" && p === "/repos/Acme/site") return send(res, 200, { default_branch: "main" })
  if (req.method === "GET" && (m = p.match(/^\/repos\/Acme\/site\/git\/ref\/heads\/(.+)$/))) {
    const s = refs.get("heads/" + decodeURIComponent(m[1]))
    return s ? send(res, 200, { object: { sha: s } }) : send(res, 404, { message: "Not Found" })
  }
  if (req.method === "GET" && (m = p.match(/^\/repos\/Acme\/site\/git\/commits\/(.+)$/))) {
    const c = commits.get(m[1])
    return c ? send(res, 200, c) : send(res, 404, { message: "Not Found" })
  }
  if (req.method === "GET" && (m = p.match(/^\/repos\/Acme\/site\/contents\/(.+)$/))) {
    const ref = url.searchParams.get("ref") || "main"
    const tree = trees.get(commits.get(refs.get("heads/" + ref)).tree.sha)
    const path = decodeURIComponent(m[1])
    if (tree[path]) return send(res, 200, { type: "file", name: path.split("/").pop(), content: blobs.get(tree[path]).toString("base64"), encoding: "base64" })
    const names = Object.keys(tree).filter((k) => k.startsWith(path + "/")).map((k) => k.slice(path.length + 1)).filter((k) => !k.includes("/"))
    return names.length ? send(res, 200, names.map((name) => ({ type: "file", name }))) : send(res, 404, { message: "Not Found" })
  }
  if (req.method === "POST" && p === "/repos/Acme/site/git/blobs") {
    const b = await body(req)
    return send(res, 201, { sha: putBlob(Buffer.from(b.content, b.encoding)) })
  }
  if (req.method === "POST" && p === "/repos/Acme/site/git/trees") {
    const b = await body(req)
    const base = b.base_tree ? { ...trees.get(b.base_tree) } : {}
    for (const e of b.tree) base[e.path] = e.sha
    const id = sha(JSON.stringify(base))
    trees.set(id, base)
    return send(res, 201, { sha: id })
  }
  if (req.method === "POST" && p === "/repos/Acme/site/git/commits") {
    const b = await body(req)
    const id = sha("commit" + commits.size + b.tree)
    commits.set(id, { sha: id, tree: { sha: b.tree }, message: b.message, parents: b.parents })
    return send(res, 201, { sha: id })
  }
  if (req.method === "POST" && p === "/repos/Acme/site/git/refs") {
    const b = await body(req)
    const name = b.ref.replace(/^refs\//, "")
    if (refs.has(name)) return send(res, 422, { message: "Reference already exists" })
    refs.set(name, b.sha)
    return send(res, 201, { ref: b.ref, object: { sha: b.sha } })
  }
  if (req.method === "POST" && p === "/repos/Acme/site/pulls") {
    const b = await body(req)
    if (!refs.has("heads/" + b.head)) return send(res, 422, { message: "head branch missing" })
    const number = pulls.length + 1
    pulls.push({ number, ...b })
    return send(res, 201, { number, html_url: `https://github.com/Acme/site/pull/${number}` })
  }
  send(res, 404, { message: `no route ${req.method} ${p}` })
}).listen(port, () => console.log(`fake github on ${port}`))
