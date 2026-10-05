/* Generates a 960w thumbnail for every photo in the event photo library
 * (PHOTO_LIBRARY in src/case-studies.js), for the /gallery grid.
 *
 * make-image-variants.mjs leaves gallery photos out on purpose: one or two
 * lazily loaded frames cost little. /gallery shows hundreds, and at up to
 * 2000px each, scrolling it would pull tens of megabytes. The grid loads the
 * thumbnail; the enlarged view still loads the full file.
 *
 * Writes <folder>/NN-960.webp beside each NN.webp. No manifest: the gallery
 * derives the thumbnail name from the photo's. Skips any thumbnail that is
 * already newer than its source, so re-running after adding a folder only
 * does the new photos.
 *
 * Run by hand; the output is committed, so a deploy needs no image tooling.
 *
 *   pip install Pillow
 *   node scripts/make-gallery-thumbs.mjs
 */
import { execFileSync } from "node:child_process"
import { PHOTO_LIBRARY, libraryPhotos } from "../src/case-studies.js"

const WIDTH = 960
const files = Object.values(PHOTO_LIBRARY).flatMap((entry) => libraryPhotos(entry).map((src) => `public${src}`))

const py = `
import json, os, sys
from PIL import Image
made = skipped = before = after = 0
for src in json.load(sys.stdin):
    if not os.path.exists(src):
        print('  missing, skipped:', src); continue
    out = src[:-5] + '-${WIDTH}.webp'
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
        skipped += 1; continue
    im = Image.open(src).convert('RGB')
    if im.width > ${WIDTH}:
        im = im.resize((${WIDTH}, round(im.height * ${WIDTH} / im.width)), Image.LANCZOS)
    im.save(out, 'WEBP', quality=78, method=6)
    made += 1; before += os.path.getsize(src); after += os.path.getsize(out)
print(json.dumps({'made': made, 'skipped': skipped, 'before': before, 'after': after}))
`
const res = execFileSync("python3", ["-c", py], { input: JSON.stringify(files), encoding: "utf8" })
const lines = res.trim().split("\n")
const out = JSON.parse(lines.pop())
lines.forEach((l) => console.log(l))
const mb = (n) => `${(n / 1048576).toFixed(1)} MB`
console.log(`  ${out.made} thumbnails made, ${out.skipped} already current`)
if (out.made) console.log(`  ${mb(out.before)} of photos → ${mb(out.after)} of thumbnails`)
