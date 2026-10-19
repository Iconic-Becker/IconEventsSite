// Fetch wrapper for the JSON API. Same-origin cookies carry sessions.
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `Request failed (${status})`)
    this.status = status
    this.body = body || {}
  }
}

import { DEMO, demoApi } from "./demo.js"

export async function api(path, { method = "GET", body, raw, headers } = {}) {
  if (DEMO) return demoApi(path, { method, body })
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: { ...(body !== undefined && !raw ? { "Content-Type": "application/json" } : {}), ...(headers || {}) },
    body: body === undefined ? undefined : raw ? body : JSON.stringify(body),
  })
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { error: text.slice(0, 200) }
  }
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

export const get = (path) => api(path)
export const post = (path, body) => api(path, { method: "POST", body: body ?? {} })
export const patch = (path, body) => api(path, { method: "PATCH", body })
export const put = (path, body) => api(path, { method: "PUT", body: body ?? {} })
export const del = (path) => api(path, { method: "DELETE" })
