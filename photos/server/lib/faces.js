// Face detection and recognition on the server, with no outside service.
// YuNet finds faces and five landmarks; SFace turns an aligned 112x112 crop
// into a 128-number embedding. Both come from the OpenCV model zoo
// (server/models, Apache 2.0 and MIT). Everything runs on the CPU through
// onnxruntime; a 2000px photo takes about 150 ms.
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import sharp from "sharp"

const MODELS = join(dirname(fileURLToPath(import.meta.url)), "..", "models")
const DET = 640 // detection runs on a 640x640 letterboxed copy
// Where the eyes, nose and mouth corners sit in a 112x112 aligned crop.
const REF = [[38.2946, 51.6963], [73.5318, 51.5014], [56.0252, 71.7366], [41.5493, 92.3655], [70.7299, 92.2041]]

let ort, det, rec, loading
async function load() {
  if (det && rec) return
  if (!loading) {
    loading = (async () => {
      ort = (await import("onnxruntime-node")).default
      ort.env.logLevel = "error"
      const opts = { intraOpNumThreads: 2, logSeverityLevel: 3 }
      det = await ort.InferenceSession.create(join(MODELS, "face_detection_yunet_2023mar.onnx"), opts)
      rec = await ort.InferenceSession.create(join(MODELS, "face_recognition_sface_2021dec.onnx"), opts)
    })()
  }
  await loading
}

// Similarity transform (scale, rotation, translation) mapping src points
// onto dst points by least squares.
function similarity(src, dst) {
  const n = src.length
  const mean = (pts) => pts.reduce((a, p) => [a[0] + p[0] / n, a[1] + p[1] / n], [0, 0])
  const ms = mean(src), md = mean(dst)
  let sxx = 0, sxy = 0, syx = 0, syy = 0, varS = 0
  for (let i = 0; i < n; i++) {
    const sx = src[i][0] - ms[0], sy = src[i][1] - ms[1], dx = dst[i][0] - md[0], dy = dst[i][1] - md[1]
    sxx += dx * sx
    sxy += dx * sy
    syx += dy * sx
    syy += dy * sy
    varS += sx * sx + sy * sy
  }
  const a = sxx + syy, b = syx - sxy
  const theta = Math.atan2(b, a)
  const cos = Math.cos(theta), sin = Math.sin(theta)
  const scale = (a * cos + b * sin) / varS
  const A = scale * cos, B = -scale * sin, C = scale * sin, D = scale * cos
  return { A, B, C, D, tx: md[0] - (A * ms[0] + B * ms[1]), ty: md[1] - (C * ms[0] + D * ms[1]) }
}

// The aligned crop as BGR planes 0..255 (what SFace expects), sampled from
// the raw RGB pixels through the inverse transform, plus a sharpness score.
function alignCrop(raw, w, h, kps) {
  const M = similarity(kps, REF)
  const detM = M.A * M.D - M.B * M.C
  const iA = M.D / detM, iB = -M.B / detM, iC = -M.C / detM, iD = M.A / detM
  const out = new Float32Array(3 * 112 * 112)
  const gray = new Float32Array(112 * 112)
  const px = (xx, yy, c) => (xx < 0 || yy < 0 || xx >= w || yy >= h ? 0 : raw[(yy * w + xx) * 3 + c])
  for (let y = 0; y < 112; y++) {
    for (let x = 0; x < 112; x++) {
      const ux = x - M.tx, uy = y - M.ty
      const sx = iA * ux + iB * uy, sy = iC * ux + iD * uy
      const x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0
      let lum = 0
      for (let c = 0; c < 3; c++) {
        const v = px(x0, y0, c) * (1 - fx) * (1 - fy) + px(x0 + 1, y0, c) * fx * (1 - fy) + px(x0, y0 + 1, c) * (1 - fx) * fy + px(x0 + 1, y0 + 1, c) * fx * fy
        out[(2 - c) * 112 * 112 + y * 112 + x] = v
        lum += v
      }
      gray[y * 112 + x] = lum / 3
    }
  }
  // Variance of the Laplacian: low on blurred or tiny faces.
  let sum = 0, sum2 = 0, n = 0
  for (let y = 1; y < 111; y++) {
    for (let x = 1; x < 111; x++) {
      const l = 4 * gray[y * 112 + x] - gray[y * 112 + x - 1] - gray[y * 112 + x + 1] - gray[(y - 1) * 112 + x] - gray[(y + 1) * 112 + x]
      sum += l
      sum2 += l * l
      n++
    }
  }
  const sharpness = sum2 / n - (sum / n) ** 2
  return { crop: out, sharpness }
}

function nms(boxes, thr) {
  boxes.sort((a, b) => b.score - a.score)
  const keep = []
  for (const b of boxes) {
    let ok = true
    for (const k of keep) {
      const ix = Math.max(0, Math.min(b.x2, k.x2) - Math.max(b.x1, k.x1)), iy = Math.max(0, Math.min(b.y2, k.y2) - Math.max(b.y1, k.y1))
      const inter = ix * iy
      if (inter / ((b.x2 - b.x1) * (b.y2 - b.y1) + (k.x2 - k.x1) * (k.y2 - k.y1) - inter) > thr) {
        ok = false
        break
      }
    }
    if (ok) keep.push(b)
  }
  return keep
}

export const cosine = (a, b) => {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}
export function normalize(e) {
  const n = Math.hypot(...e) || 1
  return Array.from(e, (v) => v / n)
}

// Faces in an image file or buffer. Each: box and landmarks in the image's
// own pixel space (after EXIF rotation), size as a fraction of the long
// edge, detection score, sharpness, and a unit embedding.
export async function detectFaces(input, { scoreThr = 0.7, minSize = 0.03 } = {}) {
  await load()
  const img = sharp(input, { failOn: "none", limitInputPixels: 300e6 }).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
  const { data: raw, info } = await img.raw().removeAlpha().toBuffer({ resolveWithObject: true })
  const w = info.width, h = info.height
  const scale = DET / Math.max(w, h)
  const dw = Math.max(1, Math.round(w * scale)), dh = Math.max(1, Math.round(h * scale))
  const { data: dr } = await sharp(raw, { raw: { width: w, height: h, channels: 3 } })
    .resize(dw, dh)
    .extend({ right: DET - dw, bottom: DET - dh, background: { r: 0, g: 0, b: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const inp = new Float32Array(3 * DET * DET)
  for (let i = 0; i < DET * DET; i++) {
    inp[i] = dr[i * 3 + 2]
    inp[DET * DET + i] = dr[i * 3 + 1]
    inp[2 * DET * DET + i] = dr[i * 3]
  }
  const res = await det.run({ [det.inputNames[0]]: new ort.Tensor("float32", inp, [1, 3, DET, DET]) })
  const boxes = []
  for (const stride of [8, 16, 32]) {
    const cls = res[`cls_${stride}`].data, obj = res[`obj_${stride}`].data, bb = res[`bbox_${stride}`].data, kp = res[`kps_${stride}`].data
    const side = DET / stride
    for (let i = 0; i < cls.length; i++) {
      const score = Math.sqrt(Math.max(0, cls[i]) * Math.max(0, obj[i]))
      if (score < scoreThr) continue
      const col = i % side, row = Math.floor(i / side)
      const cx = (col + bb[i * 4]) * stride, cy = (row + bb[i * 4 + 1]) * stride, bw = Math.exp(bb[i * 4 + 2]) * stride, bh = Math.exp(bb[i * 4 + 3]) * stride
      const b = { score, x1: (cx - bw / 2) / scale, y1: (cy - bh / 2) / scale, x2: (cx + bw / 2) / scale, y2: (cy + bh / 2) / scale, kps: [] }
      for (let k = 0; k < 5; k++) b.kps.push([((col + kp[i * 10 + k * 2]) * stride) / scale, ((row + kp[i * 10 + k * 2 + 1]) * stride) / scale])
      boxes.push(b)
    }
  }
  const faces = []
  for (const f of nms(boxes, 0.3)) {
    f.size = Math.max(f.x2 - f.x1, f.y2 - f.y1) / Math.max(w, h)
    if (f.size < minSize) continue // too small to recognise or to be "a photo of" someone
    const { crop, sharpness } = alignCrop(raw, w, h, f.kps)
    const out = await rec.run({ [rec.inputNames[0]]: new ort.Tensor("float32", crop, [1, 3, 112, 112]) })
    f.embedding = normalize(out[rec.outputNames[0]].data)
    f.sharpness = sharpness
    // Box as fractions of the frame, so it is independent of which
    // derivative was scanned.
    f.box = { x: f.x1 / w, y: f.y1 / h, w: (f.x2 - f.x1) / w, h: (f.y2 - f.y1) / h }
    delete f.kps
    faces.push(f)
  }
  return { faces, width: w, height: h }
}

// A JPEG crop around a face box (fractions of the frame), for reference
// thumbnails. Square, padded, 256px.
export async function faceCrop(input, box, px = 256) {
  const img = sharp(input, { failOn: "none", limitInputPixels: 300e6 }).rotate()
  const meta = await img.metadata()
  const W = meta.width, H = meta.height
  const side = Math.max(box.w * W, box.h * H) * 1.6
  const cx = (box.x + box.w / 2) * W, cy = (box.y + box.h / 2) * H
  const left = Math.max(0, Math.round(cx - side / 2)), top = Math.max(0, Math.round(cy - side / 2))
  const width = Math.min(W - left, Math.round(side)), height = Math.min(H - top, Math.round(side))
  return img.extract({ left, top, width, height }).resize(px, px, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer()
}

// How confident a match is, and how good the photo is as a photo of that
// person: a big, sharp face beats a small blurred one.
export const CONFIDENT = 0.5
export const POSSIBLE = 0.42
export function quality(face) {
  const sharp = Math.min(1, (face.sharpness || 0) / 400)
  return Math.round(1000 * Math.min(1, face.size / 0.25) * (0.4 + 0.6 * sharp)) / 1000
}
