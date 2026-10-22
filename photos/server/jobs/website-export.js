// "Send to website": selected photos become a pull request on the marketing
// site. Each photo is converted the way the site's own scripts would (WebP,
// at most 2000px on the long edge, with 480 and 960 wide thumbnails beside
// it), numbered after whatever the folder already holds, and the photo
// library index in src/case-studies.js is updated so the site picks them
// up. One commit, one branch, one pull request; nothing lands on the live
// site until someone merges it.
import { mkdtemp, rm, readFile } from "node:fs/promises"
import { join } from "node:path"
import sharp from "sharp"
import { register } from "./queue.js"
import { query, one, many } from "../db/pool.js"
import { storage } from "../storage/index.js"
import { config } from "../config.js"
import { websiteConfigured, defaultBranch, listFolder, readFile as readRepoFile, createBlob, commitFiles, openPull } from "../lib/github.js"

const THUMBS = [480, 960]

register("website_export", async ({ exportId }) => {
  const ex = await one("select * from website_exports where id = $1", [exportId])
  if (!ex || ex.status === "done") return
  if (!websiteConfigured()) {
    const err = new Error("GITHUB_TOKEN is not set on the server")
    err.permanent = true
    throw err
  }
  await query("update website_exports set status = 'running', error = null where id = $1", [ex.id])
  const dir = await mkdtemp(join(config.tmpDir, "ip-site-"))
  try {
    const result = await run(ex, dir)
    await query("update website_exports set status = 'done', files = $2, pr_url = $3, branch = $4, finished_at = now() where id = $1", [
      ex.id,
      JSON.stringify(result.files),
      result.pr.url,
      result.branch,
    ])
  } catch (err) {
    await query("update website_exports set status = $2, error = $3, finished_at = case when $2 = 'failed' then now() end where id = $1", [
      ex.id,
      err.permanent ? "failed" : "queued",
      String(err.message).slice(0, 2000),
    ])
    throw err
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

async function run(ex, dir) {
  const gallery = await one("select * from galleries where id = $1", [ex.gallery_id])
  const ids = (ex.media_ids || []).map(Number)
  const rows = ids.length
    ? await many("select * from media where id = any($1::bigint[]) and gallery_id = $2 and trashed_at is null and kind = 'photo' and status = 'ready'", [ids, ex.gallery_id])
    : []
  // Keep the admin's selection order (the grid order), not the id order.
  const byId = new Map(rows.map((m) => [Number(m.id), m]))
  const media = ids.map((id) => byId.get(id)).filter(Boolean)
  if (!media.length) {
    const err = new Error("None of the selected photos are ready to send")
    err.permanent = true
    throw err
  }

  const base = await defaultBranch()
  const folder = ex.folder
  const folderPath = `${config.website.imageDir}/${folder}`
  const existing = await listFolder(folderPath, base)
  let next = 0
  for (const name of existing) {
    const m = /^(\d{2,})\.webp$/.exec(name)
    if (m) next = Math.max(next, Number(m[1]))
  }

  const files = []
  const summary = []
  for (const m of media) {
    next += 1
    const num = String(next).padStart(2, "0")
    const src = join(dir, `src-${m.id}`)
    const key = m.derivatives?.social?.key || m.original_key
    await storage.downloadToFile(key, src)
    const image = sharp(src, { failOn: "none", limitInputPixels: 300e6 }).rotate()
    const full = await image
      .clone()
      .resize({ width: config.website.longEdge, height: config.website.longEdge, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 5 })
      .toBuffer({ resolveWithObject: true })
    files.push({ path: `${folderPath}/${num}.webp`, sha: await createBlob(full.data), bytes: full.data.length, width: full.info.width, height: full.info.height })
    for (const w of THUMBS) {
      // Never enlarge: a photo narrower than the thumbnail width is saved as is.
      const t = await image.clone().resize({ width: Math.min(w, full.info.width) }).webp({ quality: 82, effort: 5 }).toBuffer()
      files.push({ path: `${folderPath}/${num}-${w}.webp`, sha: await createBlob(t), bytes: t.length })
    }
    summary.push({ number: num, filename: m.filename, mediaId: Number(m.id), width: full.info.width, height: full.info.height, bytes: full.data.length })
  }

  // Register the folder in the site's photo library so /gallery and the
  // case study pick the photos up. An existing entry has its count bumped;
  // a new folder gets an entry keyed by its name.
  const indexPath = "src/case-studies.js"
  const indexSrc = await readRepoFile(indexPath, base)
  let indexNote = `\`${indexPath}\` was not found on \`${base}\`, so add the PHOTO_LIBRARY entry by hand.`
  if (indexSrc) {
    const updated = updateLibrary(indexSrc, folder, next, gallery.title)
    if (updated && updated !== indexSrc) {
      files.push({ path: indexPath, sha: await createBlob(Buffer.from(updated, "utf8")) })
      indexNote = existing.length ? `PHOTO_LIBRARY in \`${indexPath}\`: count for \`${folder}\` set to ${next}.` : `PHOTO_LIBRARY in \`${indexPath}\`: new entry \`"${folder}": { folder: "${folder}", count: ${next}, name: ${JSON.stringify(gallery.title)} }\`. Photos on /gallery are labelled with that name; once the event is in CASE_STUDIES or EVENT_INDEX, key the entry by its slug.`
    } else {
      indexNote = `PHOTO_LIBRARY in \`${indexPath}\` could not be updated automatically. Add or update: \`"${folder}": { folder: "${folder}", count: ${next} }\`.`
    }
  }

  // The export id keeps branch names unique even for repeat sends.
  const branch = `photos/${folder}-${ex.id}`
  const title = `Photos: ${media.length} from ${gallery.title}`
  const lines = summary.map((s) => `| ${s.number} | ${s.filename} | ${s.width}x${s.height} | ${Math.round(s.bytes / 1024)} KB |`)
  const body = [
    `${media.length} photo${media.length === 1 ? "" : "s"} from the gallery **${gallery.title}** (${config.publicUrl}/${gallery.slug}), sent from Iconic Photos.`,
    "",
    `Files in \`${folderPath}/\`, numbered ${summary[0].number} to ${summary[summary.length - 1].number}, each with 480 and 960 wide thumbnails beside it, as the site's own scripts would make them.`,
    "",
    "| File | Original | Size | Weight |",
    "|---|---|---|---|",
    ...lines,
    "",
    indexNote,
    "",
    "Merging puts the photos on /gallery. To use one on a case study page, reference it from the study's media in `src/case-studies.js`.",
  ].join("\n")
  await commitFiles({ base, branch, message: `${title}\n\n${media.length} photo(s) into ${folderPath}/ with thumbnails.`, files: files.map((f) => ({ path: f.path, sha: f.sha })) })
  const pr = await openPull({ base, branch, title, body })
  return { files: summary, pr, branch }
}

// Edits the PHOTO_LIBRARY object literal in the site's case-studies.js.
export function updateLibrary(src, folder, count, name) {
  const entry = new RegExp(`(folder:\\s*"${folder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}",\\s*count:\\s*)\\d+`)
  if (entry.test(src)) return src.replace(entry, `$1${count}`)
  const start = src.indexOf("export const PHOTO_LIBRARY = {")
  if (start < 0) return null
  const end = src.indexOf("\n}", start)
  if (end < 0) return null
  // A new entry carries the gallery title so /gallery can label the photos
  // before the event is written up in the site's index.
  const label = name ? `, name: ${JSON.stringify(String(name))}` : ""
  return `${src.slice(0, end)}\n  "${folder}": { folder: "${folder}", count: ${count}${label} },${src.slice(end)}`
}
