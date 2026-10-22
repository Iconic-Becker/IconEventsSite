import express from "express"
import cookieParser from "cookie-parser"
import compression from "compression"
import { existsSync } from "node:fs"
import { resolve, join } from "node:path"
import { config } from "./config.js"
import { migrate } from "./db/migrate.js"
import { one, query } from "./db/pool.js"
import { storage } from "./storage/index.js"
import { csrf } from "./lib/csrf.js"
import { errorHandler, notFound } from "./lib/http.js"
import { hashPassword } from "./lib/auth.js"
import { admin } from "./routes/admin.js"
import { guest } from "./routes/guest.js"
import { localStorageRoutes } from "./routes/local-storage.js"
import { galleryHtml, reelHtml, plainHtml, loadTemplate } from "./html.js"
import { startWorker, releaseInFlight } from "./jobs/queue.js"
import "./jobs/process-media.js"
import "./jobs/zips.js"
import "./jobs/website-export.js"

const app = express()
app.disable("x-powered-by")
app.set("trust proxy", 1)

// Nothing on this host is for search engines.
app.use((req, res, next) => {
  res.set("X-Robots-Tag", "noindex, nofollow")
  res.set("X-Content-Type-Options", "nosniff")
  res.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.set("X-Frame-Options", "SAMEORIGIN")
  next()
})

// JSON and HTML compress well; images and zips never pass through here.
app.use(compression({ threshold: 1024 }))

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /\n")
})

app.get("/healthz", async (req, res) => {
  await query("select 1")
  res.json({ ok: true, storage: storage.name })
})

if (storage.name === "local") app.use("/_local", localStorageRoutes)

app.use(cookieParser())
app.use("/api", csrf)
app.use("/api", express.json({ limit: "5mb" }))
app.use("/api/admin/galleries/:id/logo", express.raw({ type: ["image/*"], limit: "2mb" }))
app.use("/api/admin", admin)
app.use("/api/g", guest)
app.use("/api", (req, res, next) => next(notFound("No such endpoint")))

// ---- Static files and HTML --------------------------------------------------

const DIST = resolve("dist")
if (existsSync(DIST)) {
  app.use("/assets", express.static(join(DIST, "assets"), { immutable: true, maxAge: "1y", index: false }))
  app.use(express.static(DIST, { index: false, maxAge: "1h", setHeaders: (res, path) => path.endsWith(".woff2") && res.set("Cache-Control", "public, max-age=31536000") }))
}

const send = (res, html, status = 200) => {
  if (!html) return res.status(503).type("text/plain").send("The site has not been built. Run npm run build.")
  res.status(status).set("Cache-Control", "no-store").type("html").send(html)
}

const RESERVED = new Set(["admin", "api", "assets", "fonts", "_local", "healthz", "robots.txt", "favicon.ico"])

app.get("/", (req, res) => send(res, plainHtml("Iconic Photos", "Event photography by Iconic Events.")))
app.get(/^\/admin(\/.*)?$/, (req, res) => send(res, plainHtml("Iconic Photos admin", "Sign in to manage galleries.")))
app.get("/:slug", async (req, res, next) => {
  if (RESERVED.has(req.params.slug)) return next()
  send(res, await galleryHtml(req, req.params.slug))
})
app.get("/:slug/reel/:reelId", async (req, res) => send(res, await reelHtml(req, req.params.slug, req.params.reelId)))
app.get("/:slug/:album", async (req, res, next) => {
  if (RESERVED.has(req.params.slug)) return next()
  send(res, await galleryHtml(req, req.params.slug, req.params.album))
})
app.use((req, res) => send(res, plainHtml("Not found | Iconic Photos", "There is nothing at this address."), 404))

app.use(errorHandler)

// ---- Boot ------------------------------------------------------------------

async function bootstrapOwner() {
  const any = await one("select 1 from users limit 1")
  if (any || !config.ownerEmail || !config.ownerPassword) return
  await query("insert into users(email, name, role, password_hash) values ($1, 'Owner', 'owner', $2)", [config.ownerEmail.toLowerCase(), await hashPassword(config.ownerPassword)])
  console.log(`[boot] created first owner account ${config.ownerEmail}. Remove OWNER_EMAIL and OWNER_PASSWORD from the environment now.`)
}

async function main() {
  console.log(`[boot] node ${process.version}, port ${config.port}, storage ${config.storageDriver}, database ${config.databaseUrl ? "set" : "MISSING"}`)
  await migrate()
  await bootstrapOwner()
  loadTemplate()
  if (storage.name === "r2") {
    try {
      const origins = [config.publicUrl, ...config.extraOrigins]
      if (!config.prod) origins.push("http://localhost:5173", `http://localhost:${config.port}`)
      const changed = await storage.ensureCors(origins)
      console.log(`[boot] R2 bucket ${config.r2.bucket}: CORS ${changed ? "updated" : "already correct"}`)
    } catch (err) {
      console.warn(`[boot] could not set R2 CORS (the token may lack bucket config rights): ${err.message}. See README for the rule to apply by hand.`)
    }
  }
  if (config.worker) await startWorker()
  app.listen(config.port, () => console.log(`[boot] Iconic Photos on ${config.publicUrl} (port ${config.port}, storage ${storage.name})`))
}

main().catch((err) => {
  console.error("[boot] failed to start:", err.message)
  console.error(err)
  process.exit(1)
})

process.on("unhandledRejection", (err) => {
  console.error("[unhandled rejection]", err)
})

// Railway sends SIGTERM on every deploy. Give running jobs back and exit.
for (const sig of ["SIGTERM", "SIGINT"]) {
  process.on(sig, async () => {
    console.log(`[boot] ${sig}: shutting down`)
    await releaseInFlight()
    process.exit(0)
  })
}
