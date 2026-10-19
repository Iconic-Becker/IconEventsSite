// Generates a test event folder: subfolders of JPEGs with EXIF (capture
// time, GPS, copyright), one 16:9 video and one 9:16 reel. Usage:
//   node scripts/fixtures.mjs <outDir> [--albums N] [--per N]
import sharp from "sharp"
import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { execFile } from "node:child_process"
import { promisify } from "node:util"

const run = promisify(execFile)
const out = process.argv[2] || "data/fixtures/event"
const args = process.argv.slice(3)
const albums = Number(args[args.indexOf("--albums") + 1]) || 2
const per = Number(args[args.indexOf("--per") + 1]) || 16
const names = ["Keynote", "Reception", "Headshots", "Dinner", "Panels", "Arrivals", "Awards", "Cocktails", "Workshops", "Breakouts", "Lunch", "Terrace", "Sponsors", "Lobby", "Stage", "Backstage", "Networking", "Closing", "Registration", "Exhibits", "Lounge", "Press", "Portraits", "Afterparty", "Morning Run", "Team", "Venue", "Details", "Speakers", "Guests"]
const palettes = [["#0E1312", "#B89968"], ["#112E2E", "#DDE5E4"], ["#2b1d12", "#e0b07a"], ["#1b2838", "#c7d3e3"], ["#3a1f2b", "#e8c9d3"], ["#1f2b1d", "#cfe3c7"]]

function svg(w, h, i, label) {
  const [a, b] = palettes[i % palettes.length]
  const cx = 20 + ((i * 37) % 60)
  const cy = 20 + ((i * 53) % 60)
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><radialGradient id="g" cx="${cx}%" cy="${cy}%" r="80%"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></radialGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${(cx / 100) * w}" cy="${(cy / 100) * h}" r="${Math.min(w, h) / 6}" fill="${a}" opacity="0.5"/>
    <text x="50%" y="55%" font-family="Georgia, serif" font-size="${Math.min(w, h) / 5}" fill="${b}" text-anchor="middle" opacity="0.9">${label}</text>
  </svg>`)
}

await mkdir(out, { recursive: true })
let n = 0
for (let a = 0; a < albums; a++) {
  const album = names[a % names.length] + (a >= names.length ? ` ${a}` : "")
  const dir = join(out, album)
  await mkdir(dir, { recursive: true })
  for (let i = 0; i < per; i++) {
    n++
    const portrait = i % 3 === 2
    const w = portrait ? 2000 : 3000
    const h = portrait ? 3000 : 2000
    const t = new Date(Date.UTC(2026, 8, 12, 17, 0, 0) + (a * per + i) * 90_000)
    const exifDate = t.toISOString().replace(/-/g, ":").replace("T", " ").slice(0, 19)
    await sharp(svg(w, h, n, `${album.slice(0, 1)}${i + 1}`))
      .jpeg({ quality: 88 })
      .withExif({
        IFD0: { Copyright: "Iconic Events", Artist: "Iconic Events", Make: "Canon", Model: "EOS R5", DateTime: exifDate },
        IFD2: { DateTimeOriginal: exifDate },
        IFD3: { GPSLatitudeRef: "N", GPSLatitude: "40/1 44/1 5466/100", GPSLongitudeRef: "W", GPSLongitude: "73/1 59/1 2850/100" },
      })
      .toFile(join(dir, `IMG_${String(1000 + n).padStart(4, "0")}.jpg`))
  }
}
// Loose file at the root goes to the default album.
await sharp(svg(2400, 1600, 99, "Loose")).jpeg({ quality: 85 }).toFile(join(out, "IMG_0001.jpg"))

// Videos: a 16:9 trailer in the first album and a 9:16 reel at the root.
const vdir = join(out, names[0])
await run("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", "testsrc2=size=1280x720:rate=30", "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000", "-t", "8", "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", join(vdir, "trailer-16x9.mp4")])
await run("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", "testsrc2=size=720x1280:rate=30", "-f", "lavfi", "-i", "sine=frequency=330:sample_rate=48000", "-t", "10", "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", join(out, "reel-9x16.mp4")])
await writeFile(join(out, "notes.txt"), "not a photo; the uploader must skip this\n")
console.log(`fixtures in ${out}: ${albums} albums x ${per} photos + 1 loose photo + 2 videos`)
