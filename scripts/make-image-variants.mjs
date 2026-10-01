/* Generates 480w and 960w variants for the images the browser fetches before
 * the first paint, and writes a manifest the site reads to build srcset.
 *
 * Scoped deliberately. Largest Contentful Paint is decided by what loads
 * above the fold, so variants for lazily loaded gallery photos would add tens
 * of megabytes to the repo and move the metric by nothing. Everything below
 * the fold is handled by lazy loading instead.
 *
 * Run by hand; the output is committed, so a deploy needs no image tooling.
 *
 *   pip install Pillow
 *   node scripts/make-image-variants.mjs
 *
 * To bring another image in, add its path to EAGER below and re-run.
 */
import { execFileSync } from "node:child_process"
import { writeFileSync, readFileSync } from "node:fs"

const WIDTHS = [480, 960]
const EAGER = JSON.parse(readFileSync("scripts/eager-images.json", "utf8"))

const py = `
import json, os, sys
from PIL import Image
widths = ${JSON.stringify(WIDTHS)}
manifest = {}
before = after = 0
for rel in json.load(sys.stdin):
    src = 'public' + rel
    if not os.path.exists(src):
        print('  missing, skipped:', rel); continue
    im = Image.open(src)
    # Preserve transparency wherever the source has it. Flattening a
    # transparent logo to RGB puts an opaque box behind it.
    has_alpha = im.mode in ('RGBA', 'LA') or 'transparency' in im.info
    im = im.convert('RGBA' if has_alpha else 'RGB')
    stem, _ = os.path.splitext(rel)
    entries = []
    for w in widths:
        if w >= im.width:            # never upscale
            continue
        h = round(im.height * w / im.width)
        out = 'public' + stem + f'-{w}.webp'
        im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6, exact=True)
        entries.append([stem + f'-{w}.webp', w, os.path.getsize(out)])
    if entries:
        manifest[rel] = {'w': im.width, 'h': im.height,
                         'set': [[e[0], e[1]] for e in entries]}
        before += os.path.getsize(src)
        after += entries[0][2]
print(json.dumps({'manifest': manifest, 'before': before, 'after': after}))
`
const res = execFileSync("python3", ["-c", py], { input: JSON.stringify(EAGER), encoding: "utf8" })
const lines = res.trim().split("\n")
const out = JSON.parse(lines.pop())
lines.forEach((l) => console.log(l))

writeFileSync("src/image-variants.json", JSON.stringify(out.manifest, null, 1) + "\n")
const kb = (n) => `${Math.round(n / 1024)} KB`
console.log(`  ${Object.keys(out.manifest).length} images given 480w and 960w variants`)
console.log(`  smallest-variant weight vs original: ${kb(out.after)} against ${kb(out.before)}`)
