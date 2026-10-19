// "Download all" zips are built once per gallery or album, size and content
// version, written to storage and reused until the gallery changes.
import { one, many, query } from "../db/pool.js"
import { config } from "../config.js"
import { storage, keys } from "../storage/index.js"
import { register } from "./queue.js"
import { zipEntries, zipStream, splitParts } from "../lib/zip.js"

export async function mediaForZip(galleryId, albumId) {
  const rows = await many(
    `select m.*, a.name as album_name from media m left join albums a on a.id = m.album_id
     where m.gallery_id = $1 and m.trashed_at is null and m.status in ('ready', 'attention') and m.album_id is not null
       and ($2::bigint is null or m.album_id = $2)
     order by a.sort, a.id, m.sort, m.captured_at nulls last, m.filename, m.id`,
    [galleryId, albumId],
  )
  return rows.map((r) => ({ media: r, albumName: albumId ? null : r.album_name }))
}

register("build_zip", async ({ galleryId, albumId, size, version }) => {
  const items = await mediaForZip(galleryId, albumId)
  const parts = splitParts(zipEntries(items, size), config.zipPartBytes)
  // Rows for every part up front so the client can show "part 2 of 3".
  for (let i = 0; i < parts.length; i++) {
    await query(
      `insert into zips(gallery_id, album_id, size, content_version, part, parts)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (gallery_id, coalesce(album_id, 0), size, content_version, part) do update set parts = excluded.parts`,
      [galleryId, albumId, size, version, i + 1, parts.length],
    )
  }
  for (let i = 0; i < parts.length; i++) {
    const row = await one(
      "select * from zips where gallery_id = $1 and coalesce(album_id, 0) = coalesce($2::bigint, 0) and size = $3 and content_version = $4 and part = $5",
      [galleryId, albumId, size, version, i + 1],
    )
    if (row.status === "ready") continue
    const key = keys.zip(galleryId, albumId, size, version, i + 1)
    try {
      await storage.putObject(key, zipStream(parts[i]), "application/zip")
      const head = await storage.head(key)
      await query("update zips set status = 'ready', key = $2, bytes = $3 where id = $1", [row.id, key, head?.size || null])
    } catch (err) {
      await query("update zips set status = 'failed', error = $2 where id = $1", [row.id, String(err.message).slice(0, 1000)])
      throw err
    }
  }
})

// Trash older than the retention, stale zips, dead sessions and uploads
// that never finished.
register("housekeeping", async () => {
  const days = String(config.trashDays)
  const media = await many("select * from media where trashed_at < now() - ($1 || ' days')::interval", [days])
  for (const m of media) {
    const objs = await storage.list(`g/${m.gallery_id}/o/${m.id}/`)
    const ders = await storage.list(`g/${m.gallery_id}/d/${m.id}/`)
    await storage.deleteMany([...objs, ...ders].map((o) => o.key))
    await query("delete from media where id = $1", [m.id])
  }
  const galleries = await many("select id from galleries where trashed_at < now() - ($1 || ' days')::interval", [days])
  for (const g of galleries) {
    const objs = await storage.list(keys.galleryPrefix(g.id))
    await storage.deleteMany(objs.map((o) => o.key))
    await query("delete from galleries where id = $1", [g.id])
  }
  const stale = await many("select z.* from zips z join galleries g on g.id = z.gallery_id where z.content_version < g.content_version or z.status = 'failed'")
  await storage.deleteMany(stale.filter((z) => z.key).map((z) => z.key))
  if (stale.length) await query("delete from zips where id = any($1::bigint[])", [stale.map((z) => z.id)])
  const dead = await many("select * from media where status = 'uploading' and created_at < now() - interval '7 days'")
  for (const m of dead) {
    if (m.upload_id) await storage.abortMultipart(m.original_key, m.upload_id)
    await query("delete from media where id = $1", [m.id])
  }
  await query("delete from sessions where expires_at < now()")
  await query("delete from jobs where status in ('done', 'failed') and created_at < now() - interval '14 days'")
})
