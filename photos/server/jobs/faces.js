// Faces: every finished photo is scanned once for faces, and each face is
// compared with the people the admin has described with reference photos.
// Matches live in person_matches; the Photos tab shows them per person.
// Scanning a 3,000 photo event takes about eight minutes of background
// CPU and nothing leaves the server.
import { mkdtemp, rm } from "node:fs/promises"
import { join } from "node:path"
import { register, enqueue, poke } from "./queue.js"
import { query, one, many } from "../db/pool.js"
import { storage } from "../storage/index.js"
import { config } from "../config.js"
import { detectFaces, cosine, quality, POSSIBLE } from "../lib/faces.js"

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
        if (sim >= POSSIBLE) await query("insert into person_matches(person_id, face_id, media_id, similarity, quality) values ($1, $2, $3, $4, $5)", [p.id, row.id, m.id, sim, quality(f)])
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
  const rejected = new Set((await many("select face_id from person_matches where person_id = $1 and state = 'rejected'", [p.id])).map((r) => Number(r.face_id)))
  await query("delete from person_matches where person_id = $1 and state <> 'rejected'", [p.id])
  let lastId = 0
  for (;;) {
    const faces = await many("select id, media_id, size, sharpness, embedding from faces where id > $1 order by id limit 2000", [lastId])
    if (!faces.length) break
    for (const f of faces) {
      lastId = Number(f.id)
      if (rejected.has(lastId)) continue
      const sim = cosine(p.embedding, f.embedding)
      if (sim >= POSSIBLE) await query("insert into person_matches(person_id, face_id, media_id, similarity, quality) values ($1, $2, $3, $4, $5) on conflict do nothing", [p.id, f.id, f.media_id, sim, quality(f)])
    }
  }
})

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
