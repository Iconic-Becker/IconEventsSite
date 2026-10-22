// The slice of the GitHub REST API that "Send to website" needs: read a
// folder, write blobs, make one commit on a new branch, open a pull request.
// Plain fetch, no SDK. Every call carries the token from config; the token
// never reaches a browser or a log.
import { config } from "../config.js"

export function websiteConfigured() {
  return Boolean(config.website.token && config.website.repo)
}

async function gh(path, { method = "GET", body, allow404 = false } = {}) {
  const res = await fetch(`${config.website.apiUrl}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${config.website.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "iconic-photos",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 404 && allow404) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(`GitHub ${method} ${path} -> ${res.status} ${data.message || ""}`.trim())
    // Auth and permission problems do not fix themselves on retry.
    err.permanent = res.status === 401 || res.status === 403 || res.status === 404 || res.status === 422
    throw err
  }
  return data
}

const repo = () => `/repos/${config.website.repo}`

export async function defaultBranch() {
  if (config.website.baseBranch) return config.website.baseBranch
  const r = await gh(repo())
  return r.default_branch
}

export async function branchHead(branch) {
  const ref = await gh(`${repo()}/git/ref/heads/${encodeURIComponent(branch)}`)
  const commit = await gh(`${repo()}/git/commits/${ref.object.sha}`)
  return { sha: ref.object.sha, treeSha: commit.tree.sha }
}

// Names of the files directly inside a folder on a branch, [] if the
// folder does not exist yet.
export async function listFolder(path, ref) {
  const r = await gh(`${repo()}/contents/${path}?ref=${encodeURIComponent(ref)}`, { allow404: true })
  if (!r) return []
  return (Array.isArray(r) ? r : [r]).filter((e) => e.type === "file").map((e) => e.name)
}

export async function readFile(path, ref) {
  const r = await gh(`${repo()}/contents/${path}?ref=${encodeURIComponent(ref)}`, { allow404: true })
  if (!r || r.type !== "file") return null
  return Buffer.from(r.content, "base64").toString("utf8")
}

export async function createBlob(buffer) {
  const r = await gh(`${repo()}/git/blobs`, { method: "POST", body: { content: buffer.toString("base64"), encoding: "base64" } })
  return r.sha
}

// One commit holding every file, on a new branch off the base.
export async function commitFiles({ base, branch, message, files }) {
  const head = await branchHead(base)
  const tree = await gh(`${repo()}/git/trees`, {
    method: "POST",
    body: {
      base_tree: head.treeSha,
      tree: files.map((f) => ({ path: f.path, mode: "100644", type: "blob", sha: f.sha })),
    },
  })
  const commit = await gh(`${repo()}/git/commits`, { method: "POST", body: { message, tree: tree.sha, parents: [head.sha] } })
  await gh(`${repo()}/git/refs`, { method: "POST", body: { ref: `refs/heads/${branch}`, sha: commit.sha } })
  return commit.sha
}

export async function openPull({ base, branch, title, body }) {
  const r = await gh(`${repo()}/pulls`, { method: "POST", body: { base, head: branch, title, body } })
  return { url: r.html_url, number: r.number }
}
