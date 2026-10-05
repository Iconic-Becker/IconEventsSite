/* Generates 480w and 960w thumbnails for every photo on /gallery (the whole
 * photo library plus the case study frames; see galleryFrames() in
 * src/case-studies.js), for the grid.
 *
 * make-image-variants.mjs leaves gallery photos out on purpose: one or two
 * lazily loaded frames cost little. /gallery shows hundreds, and at up to
 * 2000px each, scrolling it would pull tens of megabytes. Each tile picks
 * the size it needs (a single tile on a phone takes the 480w, a large one on
 * desktop the 960w); the enlarged view still loads the full file.
 *
 * Writes NAME-480.webp and NAME-960.webp beside each NAME.webp. No
 * manifest: the gallery derives the names from the photo's. Never enlarges:
 * a photo narrower than a width is saved at its own size. Skips any file
 * already newer than its source, so re-running after adding a folder only
 * does the new photos.
 *
 * Run by hand; the output is committed, so a deploy needs no image tooling.
 *
 *   pip install Pillow
 *   node scripts/make-gallery-thumbs.mjs
 */
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { galleryFrames } from "../src/case-studies.js"

const WIDTHS = [480, 960]
// Photos make-image-variants.mjs already gives 480w and 960w files are left
// to it, so the two scripts never overwrite each other's output.
const VARIANTS = JSON.parse(readFileSync("src/image-variants.json", "utf8"))
const files = galleryFrames()
  .filter((frame) => !VARIANTS[frame.src])
  .map((frame) => `public${frame.src}`)

const py = `
import json, os, sys
from PIL import Image
made = skipped = before = after = 0
for src in json.load(sys.stdin):
    if not os.path.exists(src):
        print('  missing, skipped:', src); continue
    im = None
    for w in ${JSON.stringify(WIDTHS)}:
        out = src[:-5] + f'-{w}.webp'
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
            skipped += 1; continue
        im = im or Image.open(src).convert('RGB')
        small = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS) if im.width > w else im
        small.save(out, 'WEBP', quality=78, method=6)
        made += 1; before += os.path.getsize(src); after += os.path.getsize(out)
print(json.dumps({'made': made, 'skipped': skipped, 'before': before, 'after': after}))
`
const res = execFileSync("python3", ["-c", py], { input: JSON.stringify(files), encoding: "utf8" })
const lines = res.trim().split("\n")
const out = JSON.parse(lines.pop())
lines.forEach((l) => console.log(l))
const mb = (n) => `${(n / 1048576).toFixed(1)} MB`
console.log(`  ${out.made} thumbnails made, ${out.skipped} already current`)
