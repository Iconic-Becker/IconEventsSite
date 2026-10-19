// Every setting the server reads from the environment, in one place.
// README.md documents each variable. Nothing here is secret in itself; the
// values arrive through Railway variables.
import { randomBytes } from "node:crypto"
import { resolve } from "node:path"

const env = process.env
const prod = env.NODE_ENV === "production"

function required(name) {
  if (!env[name]) {
    if (prod) throw new Error(`Missing required environment variable ${name}`)
    return undefined
  }
  return env[name]
}

const sessionSecret =
  env.SESSION_SECRET ||
  (prod
    ? required("SESSION_SECRET")
    : // A fresh dev secret per boot logs everyone out on restart, which is
      // fine for development and avoids a hard-coded secret in the repo.
      randomBytes(32).toString("hex"))

export const config = {
  prod,
  port: Number(env.PORT || 3000),
  publicUrl: (env.PUBLIC_URL || `http://localhost:${env.PORT || 3000}`).replace(/\/$/, ""),
  databaseUrl: env.DATABASE_URL || "postgres://postgres@localhost:5433/iconic_photos",
  sessionSecret,
  // "r2" in production. "local" keeps everything on disk under DATA_DIR and
  // signs its own URLs, so development and tests need no bucket.
  storageDriver: env.STORAGE_DRIVER || (prod ? "r2" : "local"),
  dataDir: resolve(env.DATA_DIR || "data"),
  tmpDir: env.TMP_DIR || "/tmp",
  r2: {
    accountId: env.R2_ACCOUNT_ID,
    endpoint: env.R2_ENDPOINT || (env.R2_ACCOUNT_ID ? `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined),
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    bucket: env.R2_BUCKET || "iconic-photos",
  },
  // Media URLs are signed with a time rounded to this window so repeated
  // requests get identical URLs and browsers can cache them.
  urlWindowSeconds: Number(env.URL_WINDOW_SECONDS || 3600),
  // Run the background worker inside this process. Set to "false" to run
  // the API and the worker as separate Railway services later.
  worker: env.WORKER !== "false",
  workerConcurrency: Number(env.WORKER_CONCURRENCY || 2),
  // Upload parts. 16 MB keeps request counts low on a 100 GB migration
  // while staying well under R2's 5 GB part ceiling.
  partSizeBytes: Number(env.PART_SIZE_MB || 16) * 1024 * 1024,
  maxFileBytes: Number(env.MAX_FILE_GB || 20) * 1024 * 1024 * 1024,
  // Videos longer than this are stored but not transcoded, and flagged.
  maxTranscodeSeconds: Number(env.MAX_TRANSCODE_MINUTES || 15) * 60,
  zipPartBytes: Number(env.ZIP_PART_GB || 2) * 1024 * 1024 * 1024,
  trashDays: Number(env.TRASH_DAYS || 30),
  // First owner bootstrap. Either set these once, or run `npm run setup-owner`.
  ownerEmail: env.OWNER_EMAIL,
  ownerPassword: env.OWNER_PASSWORD,
  // Where the marketing site lives, for the footer link and the root page.
  marketingUrl: env.MARKETING_URL || "https://iconic.events",
  // Set to the exact origins allowed to call the API from a browser. The
  // public URL is always allowed.
  extraOrigins: (env.EXTRA_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
}
