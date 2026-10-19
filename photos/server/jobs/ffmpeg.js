import { execFile } from "node:child_process"

export function run(cmd, args, { timeoutMs = 60 * 60 * 1000 } = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { maxBuffer: 64 * 1024 * 1024, timeout: timeoutMs }, (err, stdout, stderr) => {
      if (err) {
        err.message = `${cmd} failed: ${err.message}\n${String(stderr).slice(-2000)}`
        return reject(err)
      }
      resolve({ stdout, stderr })
    })
  })
}

export async function probe(path) {
  const { stdout } = await run("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", path])
  const info = JSON.parse(stdout)
  const video = (info.streams || []).find((s) => s.codec_type === "video")
  if (!video) throw Object.assign(new Error("No video stream"), { permanent: true })
  let rotation = 0
  const tagRot = Number(video.tags?.rotate)
  if (Number.isFinite(tagRot)) rotation = tagRot
  for (const sd of video.side_data_list || []) if (sd.rotation != null) rotation = Number(sd.rotation)
  const swap = Math.abs(rotation % 180) === 90
  const width = swap ? video.height : video.width
  const height = swap ? video.width : video.height
  const duration = Number(info.format?.duration || video.duration || 0)
  return { width, height, duration, codec: video.codec_name, hasAudio: (info.streams || []).some((s) => s.codec_type === "audio") }
}

// Scale so the long edge is at most `max`, keep aspect, even dimensions.
export function scaleFilter(max) {
  return `scale='if(gt(iw,ih),min(${max},iw),-2)':'if(gt(iw,ih),-2,min(${max},ih))'`
}
