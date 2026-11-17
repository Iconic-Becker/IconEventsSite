// Faces: every finished photo is scanned once for faces, and each face is
// compared with the people the admin has described with reference photos.
// Matches live in person_matches; the Photos tab shows them per person.
// Scanning a 3,000 photo event takes about eight minutes of background
// CPU and nothing leaves the server.
import { mkdtemp, rm } from "node:fs/promises"
import { join } from "node:path"
import { register, enqueue, poke } from "./queue.js"
import { query, one, many, withTransaction } from "../db/pool.js"
import { storage } from "../storage/index.js"
import { config } from "../config.js"
import { detectFaces, faceCrop, cosine, normalize, quality, POSSIBLE } from "../lib/faces.js"

register("detect_faces", async ({ mediaId }) => {
  const m = await one("select * from media where id = $1 and kind = 'photo' and trashed_at is null and status in ('ready', 'attention')", [mediaId])
  if (!m) return
  const dir = await mkdtemp(join(config.tmpDir, "ip-face-"))
  try {
    const src = join(dir, "photo")
    await storage.downloadToFile(m.derivatives?.social?.key || m.derivatives?.display?.key || m.original_key, src)
    const { faces } = await detectFaces(src)
    const people = await many("select id, embedding from people where cardinality(embedding) > 0")
    await query("delete from faces where media_id = $1", [m.id])
    for (const f of faces) {
      const row = await one(
        "insert into faces(media_id, box, size, score, sharpness, embedding) values ($1, $2, $3, $4, $5, $6) returning id",
        [m.id, JSON.stringify(f.box), f.size, f.score, f.sharpness, f.embedding],
      )
      for (const p of people) {
        const sim = cosine(p.embedding, f.embedding)
        if (sim >= POSSIBLE) await query("insert into person_matches(person_id, face_id, media_id, similarity, quality) values ($1, $2, $3, $4, $5) on conflict (person_id, face_id) where face_id is not null do nothing", [p.id, row.id, m.id, sim, quality(f)])
      }
    }
    await query("update media set faces_at = now() where id = $1", [m.id])
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

// A person was added or their reference photos changed: compare them with
// every face already scanned. Rejections the admin made are kept.
register("match_person", async ({ personId }) => {
  const p = await one("select id, embedding from people where id = $1", [personId])
  if (!p || !p.embedding?.length) return
  // Rejections and confirmations the admin made are kept; the rest is
  // worked out first and swapped in at once, so the list never goes blank
  // while a re-match runs.
  const keep = new Set((await many("select face_id from person_matches where person_id = $1 and state <> 'auto' and face_id is not null", [p.id])).map((r) => Number(r.face_id)))
  const found = []
  let lastId = 0
  for (;;) {
    const faces = await many("select id, media_id, size, sharpness, embedding from faces where id > $1 order by id limit 2000", [lastId])
    if (!faces.length) break
    for (const f of faces) {
      lastId = Number(f.id)
      if (keep.has(lastId)) continue
      const sim = cosine(p.embedding, f.embedding)
      if (sim >= POSSIBLE) found.push([p.id, f.id, f.media_id, sim, quality(f)])
    }
  }
  await withTransaction(async (c) => {
    await c.query("delete from person_matches where person_id = $1 and state = 'auto'", [p.id])
    for (const row of found) await c.query("insert into person_matches(person_id, face_id, media_id, similarity, quality) values ($1, $2, $3, $4, $5) on conflict (person_id, face_id) where face_id is not null do nothing", row)
  })
})

// A confirmed photo teaches the person's face: the face crop becomes a
// reference like an uploaded one, and the average embedding is refreshed
// so later matches lean on real event photos, not only the headshots.
register("learn_face", async ({ personId, faceId }) => {
  const f = await one("select f.*, m.derivatives, m.original_key from faces f join media m on m.id = f.media_id where f.id = $1 and m.trashed_at is null", [faceId])
  const p = await one("select id from people where id = $1", [personId])
  if (!f || !p) return
  if (await one("select id from person_refs where person_id = $1 and face_id = $2", [personId, faceId])) return
  const dir = await mkdtemp(join(config.tmpDir, "ip-learn-"))
  try {
    const src = join(dir, "photo")
    await storage.downloadToFile(f.derivatives?.social?.key || f.derivatives?.display?.key || f.original_key, src)
    const crop = await faceCrop(src, f.box)
    const key = `people/${personId}/learned-${faceId}.jpg`
    await storage.putObject(key, crop, "image/jpeg")
    await query("insert into person_refs(person_id, key, embedding, source, face_id, media_id) values ($1, $2, $3, 'confirmed', $4, $5)", [personId, key, f.embedding, faceId, f.media_id])
    await refreshPersonEmbedding(personId)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

// The person's embedding is the normalised mean of every reference,
// uploaded and learned. Changing it re-runs the match over all faces.
export async function refreshPersonEmbedding(personId) {
  const refs = await many("select embedding from person_refs where person_id = $1", [personId])
  let emb = []
  if (refs.length) {
    const sum = new Array(refs[0].embedding.length).fill(0)
    for (const r of refs) r.embedding.forEach((v, i) => (sum[i] += v))
    emb = normalize(sum)
  }
  await query("update people set embedding = $2, updated_at = now() where id = $1", [personId, emb])
  if (emb.length) {
    await enqueue("match_person", { personId: Number(personId) }, { dedupe: true })
    poke()
  } else {
    await query("delete from person_matches where person_id = $1 and state = 'auto'", [personId])
  }
}

// Photos finished before face scanning existed, or whose scan was lost,
// get queued a batch at a time. Called at boot and by the recovery timer.
export async function scheduleFaceBackfill(limit = 500) {
  let total = 0
  for (;;) {
    const n = await backfillBatch(limit)
    total += n
    if (n < limit) break
  }
  return total
}

async function backfillBatch(limit) {
  const rows = await many(
    `select m.id from media m where m.kind = 'photo' and m.trashed_at is null and m.status in ('ready', 'attention') and m.faces_at is null
       and not exists (select 1 from jobs j where j.type = 'detect_faces' and j.payload->>'mediaId' = m.id::text and j.status in ('queued', 'running'))
     order by m.id desc limit $1`,
    [limit],
  )
  for (const r of rows) await enqueue("detect_faces", { mediaId: Number(r.id) })
  if (rows.length) poke()
  return rows.length
}
