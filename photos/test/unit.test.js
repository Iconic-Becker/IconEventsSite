import { test } from "node:test"
import assert from "node:assert/strict"
import { slugify, gallerySlug, randomSuffix } from "../server/lib/slug.js"
import { splitParts, zipEntries } from "../server/lib/zip.js"
import { downloadKey, kindFromName, replaceExt } from "../server/lib/media.js"
import { scaleFilter } from "../server/jobs/ffmpeg.js"

test("gallery slugs are readable and unguessable", () => {
  assert.equal(slugify("Smith Gala: Autumn 2026!"), "smith-gala-autumn-2026")
  const s = gallerySlug("Smith Gala")
  assert.match(s, /^smith-gala-[a-z0-9]{6}$/)
  assert.equal(randomSuffix(8).length, 8)
  assert.notEqual(gallerySlug("x"), gallerySlug("x"))
})

test("file kinds and download keys", () => {
  assert.equal(kindFromName("IMG_1.JPG"), "photo")
  assert.equal(kindFromName("reel.MOV"), "video")
  assert.equal(kindFromName("notes.txt"), null)
  const photo = { kind: "photo", filename: "a.jpg", original_key: "o/a.jpg", derivatives: { social: { key: "d/social.jpg" } } }
  assert.deepEqual(downloadKey(photo, "social"), { key: "d/social.jpg", filename: "a.jpg" })
  assert.deepEqual(downloadKey(photo, "full"), { key: "o/a.jpg", filename: "a.jpg" })
  const video = { kind: "video", filename: "b.mov", original_key: "o/b.mov", derivatives: { web: { key: "d/web.mp4" } } }
  assert.deepEqual(downloadKey(video, "social"), { key: "d/web.mp4", filename: "b.mp4" })
  assert.equal(replaceExt("x.y.png", "jpg"), "x.y.jpg")
})

test("zip entries get album folders, size folders and unique names", () => {
  const m = (id, filename, album) => ({ media: { id, kind: "photo", filename, original_key: `o/${id}`, size_bytes: 10, derivatives: { social: { key: `s/${id}`, size: 2 } } }, albumName: album })
  const entries = zipEntries([m(1, "a.jpg", "Keynote"), m(2, "a.jpg", "Keynote"), m(3, "b.jpg", null)], "both")
  assert.deepEqual(
    entries.map((e) => e.name),
    ["Social/Keynote/a.jpg", "Full resolution/Keynote/a.jpg", "Social/Keynote/a (2).jpg", "Full resolution/Keynote/a (2).jpg", "Social/b.jpg", "Full resolution/b.jpg"],
  )
})

test("zips split into parts under the limit", () => {
  const entries = Array.from({ length: 10 }, (_, i) => ({ name: String(i), bytes: 3 }))
  const parts = splitParts(entries, 7)
  assert.equal(parts.length, 5)
  assert.ok(parts.every((p) => p.reduce((a, e) => a + e.bytes, 0) <= 7))
  assert.equal(splitParts([{ name: "huge", bytes: 100 }], 7).length, 1)
})

test("ffmpeg scale keeps portrait video portrait", () => {
  assert.match(scaleFilter(1920), /gt\(iw,ih\)/)
})
