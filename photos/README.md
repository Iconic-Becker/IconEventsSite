# Iconic Photos

Client photo galleries for Iconic Events, built to replace CloudSpot.
Live at `https://photos.iconic.events` once deployed (section "Deploy").

- Guests open a link, browse albums, see photos large, heart favorites,
  download in Social or Full resolution, and watch and share featured reels.
- The team signs in at `/admin`, drops a folder, picks a cover layout with a
  live preview, and copies the link.
- Media lives in a private Cloudflare R2 bucket. The app runs on Railway
  with Postgres. No photo bytes pass through the server on upload.

The specification this was built from is `docs/BUILD-PROMPT.md`. The owner's
setup checklist is `docs/OWNER-SETUP.md`. The CloudSpot migration plan is
`docs/MIGRATION.md`. Security notes are `SECURITY.md`.

## Contents

1. [How it works](#how-it-works)
2. [Repository layout](#repository-layout)
3. [Local development](#local-development)
4. [Deploy](#deploy)
5. [Environment variables](#environment-variables)
6. [R2 bucket and CORS](#r2-bucket-and-cors)
7. [Using the admin](#using-the-admin)
8. [Decisions made during the build](#decisions-made-during-the-build)
9. [Accepted trade-offs](#accepted-trade-offs)
10. [Costs](#costs)
11. [Backups](#backups)
12. [Connecting GoHighLevel later](#connecting-gohighlevel-later)
13. [Verification](#verification)

## How it works

One Node process (`server/index.js`) serves the API, the built single page
app, and runs the background worker.

**Uploads.** The browser asks the API for an upload plan, then PUTs the
bytes straight to R2 with presigned URLs: one PUT for files up to 16 MB,
multipart parts above that. Four files upload at once, three parts at once
per file, every part retries with backoff, and when the network drops the
uploader waits for `online`, asks the server which parts already landed,
and continues. Re-dropping the same folder after a page reload resumes the
same way: the server matches files by path and size, skips finished ones
and resumes partial ones.

**Processing.** Completing an upload enqueues a job in the `jobs` table
(Postgres, claimed with `SKIP LOCKED`). The worker downloads the original to
a temp file, checks the real content type, and writes derivatives back to
R2:

| Photo | Spec |
|---|---|
| `thumb.webp` | 600 px long edge, grid |
| `display.webp` | 2048 px long edge, lightbox and cover |
| `social.jpg` | 2048 px, JPEG q82, sRGB with embedded profile, EXIF stripped except Copyright, Artist and DateTimeOriginal |
| original | untouched, the Full resolution download |

| Video | Spec |
|---|---|
| `poster.jpg` + `thumb.webp` | frame at 1 s |
| `web.mp4` | H.264 high profile, CRF 23, 1080p long edge, AAC 160k, faststart. Portrait stays portrait |
| `clip-N.mp4` | featured reels only: 8 s, muted, 720p, from the chosen start, for the Video cover |

Videos over `MAX_TRANSCODE_MINUTES` (15) are stored but not transcoded,
flagged in the admin, and play from the original.

**Serving.** Gallery JSON carries presigned GET URLs for every derivative.
The signing time is rounded to a one hour window and URLs last two windows,
so repeated page loads get identical URLs and browsers cache them. The API
hands out no URL for a password protected gallery until the unlock cookie
is present, except for reels the owner marked public.

**Downloads.** Single files redirect through `/api/g/:slug/dl/:id` so they
are counted, then to a presigned URL with `Content-Disposition: attachment`.
"Both" on iOS, favorites, and small selections stream as a zip from the
server (stored, not deflated). "Download all" per album or gallery is built
once by the worker per content version and size, written to R2 in parts of
at most 2 GB, and reused until the gallery changes.

**Share links.** A gallery's own slug shows every album. The Links tab adds
more links to the same upload, each with a chosen set of albums, its own
optional password, and a switch for the featured reels. A public link can
carry the public albums while the client link carries everything. Every
guest route resolves the slug to either the gallery or a link and filters
albums, downloads and zips accordingly; album pages and photos outside the
link answer 404.

**Large albums.** Album media is paged: the first 150 items return at once
and the page streams the rest in behind them, so a 3,000 photo album starts
painting in well under a second on a phone. API and HTML responses are
gzip compressed. Measured locally with a 2,502 photo album: first tiles at
315 ms, all tiles by 1.2 s, 14 KB for the first page.

**Routing.** `/:slug` and `/:slug/:album` serve the app with gallery meta
tags filled in server side. `/:slug/reel/:id` adds Open Graph video tags so
pasted links unfurl with the poster. `/admin` is the team app. Everything
carries `X-Robots-Tag: noindex, nofollow` and `robots.txt` disallows all.

## Repository layout

```
server/            Express API, worker, storage drivers
  db/              schema.sql and the migration runner (runs on boot)
  routes/          admin.js (team API), guest.js (gallery API), local-storage.js (dev only)
  jobs/            queue.js, process-media.js (sharp + ffmpeg), zips.js (zips + housekeeping)
  storage/         r2.js (S3 API), local.js (disk, dev and tests), index.js (key layout)
  lib/             auth, cookies, csrf, rate limit, analytics, gallery access rules
  html.js          meta tag injection for gallery and reel pages
src/
  guest/           the gallery: Cover (5 layouts), Grid, Albums, Lightbox, Reels, Downloads, Favorites
  admin/           the team app: uploader engine, Photos, Design (live preview), Reels, Favorites, Analytics, Users
  shared/          api wrapper, ui primitives, formatting
scripts/
  fixtures.mjs     generates a test event folder (JPEGs with EXIF + GPS, a 16:9 video, a 9:16 reel)
  api-upload.mjs   uploads a folder through the API (tests; also a fallback for very large migrations)
  verify/run.mjs   the end-to-end browser verification (Playwright)
docs/              BUILD-PROMPT, OWNER-SETUP, MIGRATION
Dockerfile         production image (Node 22 + ffmpeg)
railway.json       Railway build and deploy settings
```

## Local development

Requirements: Node 20+, ffmpeg and ffprobe on the PATH, a Postgres
database.

```bash
npm install
cp .env.example .env            # edit DATABASE_URL
npm run setup-owner -- you@example.com 'a long password'
npm run build                   # or: npm run dev (Vite on 5173 proxying to 3000)
npm start                       # http://localhost:3000, admin at /admin
```

With `STORAGE_DRIVER=local` (the default outside production) media is
stored under `data/storage` and served from `/_local/...` with signed URLs,
so no bucket is needed. `node scripts/fixtures.mjs data/fixtures/event`
makes a test folder to drop into a gallery.

`npm test` runs unit tests. `npm run verify` runs the browser suite against
a running local server (see "Verification").

## Deploy

The service deploys from this repository as its own Railway service in the
same project as the marketing site. The marketing site is not touched.

1. **Postgres.** In the Railway project, add a Postgres database. Open its
   settings and turn on backups (Railway's volume backups; daily is fine).
2. **Service.** Add a new service from the GitHub repo. Railway reads
   `railway.json` and builds the Dockerfile (Node 22 plus ffmpeg).
   - If the code lives in a subdirectory of a larger repo, set the service's
     **Root Directory** to that folder (`photos`).
3. **Variables.** On the service, set the variables in the table below.
   Reference the database as `DATABASE_URL = ${{Postgres.DATABASE_URL}}`
   (use the private network URL).
4. **Domain.** Service settings, Networking, add custom domain
   `photos.iconic.events`. Railway shows the CNAME target.
5. **DNS.** At the provider that holds the `iconic.events` zone, add one
   CNAME: `photos` pointing at the Railway target. Change nothing else.
   Railway issues the TLS certificate once the record resolves.
6. **First owner.** Either set `OWNER_EMAIL` and `OWNER_PASSWORD` for the
   first deploy and remove them after signing in, or run
   `npm run setup-owner -- email password` in the service's shell.
7. Sign in at `https://photos.iconic.events/admin`, add team members under
   Users, create a gallery.

The container listens on `PORT` (Railway sets it), answers `/healthz`, runs
migrations on boot, and sets the R2 CORS rule on boot if the token allows.

## Environment variables

| Variable | Required | Meaning |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string |
| `SESSION_SECRET` | yes | 64+ random hex chars. Signs admin sessions, unlock cookies and local URLs. Rotating it signs everyone out and relocks galleries |
| `PUBLIC_URL` | yes | `https://photos.iconic.events`. Used for links, CORS origin and share URLs |
| `STORAGE_DRIVER` | yes | `r2` in production |
| `R2_ACCOUNT_ID` | yes (r2) | Cloudflare account id; the endpoint is derived from it |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` | yes (r2) | The R2 API token scoped to the one bucket |
| `R2_BUCKET` | no | default `iconic-photos` |
| `R2_ENDPOINT` | no | override the derived endpoint |
| `OWNER_EMAIL`, `OWNER_PASSWORD` | once | creates the first owner if no account exists; remove afterwards |
| `WORKER` | no | `false` to run this instance without the background worker |
| `WORKER_CONCURRENCY` | no | parallel jobs, default 2 |
| `PART_SIZE_MB` | no | upload part size, default 16 |
| `MAX_FILE_GB` | no | default 20 |
| `MAX_TRANSCODE_MINUTES` | no | default 15 |
| `ZIP_PART_GB` | no | default 2 |
| `TRASH_DAYS` | no | default 30 |
| `URL_WINDOW_SECONDS` | no | media URL signing window, default 3600 |
| `EXTRA_ORIGINS` | no | comma separated extra browser origins allowed to call the API |
| `MARKETING_URL` | no | default `https://iconic.events` |
| `NODE_ENV` | yes | `production` (the Dockerfile sets it) |

## R2 bucket and CORS

The bucket `iconic-photos` exists (created 2026-10-19). It must stay
private: no public bucket URL, no custom domain. The app reaches it with an
API token scoped to that one bucket with Object Read and Write.

Browsers upload to and read from the bucket directly, so it needs a CORS
rule. The server applies this on boot when the token has bucket settings
rights; otherwise paste it in the Cloudflare dashboard (R2, bucket,
Settings, CORS policy):

```json
[
  {
    "AllowedOrigins": ["https://photos.iconic.events"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

For local development against the real bucket add
`http://localhost:5173` and `http://localhost:3000` to `AllowedOrigins`.
`ETag` must be exposed or multipart uploads cannot complete.

Object layout: `g/<galleryId>/o/<mediaId>/<filename>` originals,
`g/<galleryId>/d/<mediaId>/<derivative>` derivatives,
`g/<galleryId>/z/...` cached zips, `g/<galleryId>/logo-*.png` the client
logo. Deleting a gallery after its 30 trash days deletes the prefix.

## Using the admin

**Create a gallery.** Galleries, New gallery, title and date. The link is
the title plus a random six character suffix (`smith-gala-x7k2qd`), shown
with a copy button. It is not guessable and nothing lists it.

**Add photos.** On the Photos tab drop one or more folders. The folder a
photo sits in becomes its album, so three folders dropped together make
three albums, and an event folder with sub-folders makes one album per
sub-folder. Files dropped without a folder go to the Photos album. `.txt`
and RAW files are skipped. Keep
the tab open until "Uploaded N files" appears; processing then continues on
the server and thumbnails fill in. Drop the same folder again at any time
to add files or finish an interrupted upload.

**Albums.** Rename (the link slug stays so shared album links keep
working), reorder with the arrows, delete (photos go to the trash), set an
album cover from a selected photo. Star photos to fill **Highlights**, which
guests see first. Drag photos to reorder, or "Sort by time" for capture
time then filename. Select photos for bulk star, move, delete, reprocess.

**Design.** Pick one of five cover layouts (Full bleed, Split, Video,
Mosaic, Title card), the cover photo and its focal point (click the image),
mosaic photos, dark or light theme, Cormorant Garamond or Causten titles,
grid style and density, and the cover animation. The live preview switches
between phone and desktop and is the real cover component. Changes save as
you go. A gallery with none of this set still opens on its first photo.

**Private albums.** Hover an album on the Photos tab and click the lock.
A private album is left out of the main link and of links set to "all
albums"; it shows only on links that pick it by name, which is how a crew
or client album stays off the public gallery.

**Addresses.** Every gallery and link gets a random unguessable address.
Settings (for the gallery) and the link's edit sheet let you pick your own,
such as `/pmuworldatsea`. The old address keeps working as an alias.

**Links.** The main link and any extra links, each with a copy button.
"New link" picks albums (or all, including albums added later), whether
reels show, and an optional password. Edit or delete a link at any time;
deleting one stops that link working while the main link and others stay.

**Reels.** Drop a video on the Reels tab to feature it. Give it a title and
description (they become the link preview), choose where the 8 second
cover clip starts, and copy the share link. In a password protected gallery
a reel is private until you mark it **Public**; the toggle explains the
effect.

**Favorites.** Each guest's picks with thumbnails, "Copy filenames" (comma
separated, pastes into Lightroom's filter), and CSV.

**Analytics.** Unique visitors (daily salted hash, no IPs stored), lightbox
opens, downloads by Social, Full and zip, reel plays, 90% completions,
shares and downloads.

**Settings.** Visible or hidden, password on or off, items needing
attention (failed processing, over-long videos) with retry, and delete
(30 days in the trash, restorable from the gallery list).

**Users** (owners only). Add owners, editors and contributors, reset
passwords, disable or delete. Editors manage galleries including deleting.
Contributors upload and arrange (albums, order, stars, design, reels,
links) but cannot delete photos, albums, reels, links or galleries; the
delete controls are hidden for them and the API refuses the calls. **Guests CSV** in the top bar exports every guest email with
gallery, name and first seen date.

## Decisions made during the build

The prompt left these to the builder; here is what was chosen and why.

- **Location of the code.** The prompt asked for a new repository
  `Iconic-Becker/iconic-photos`. The build session's GitHub access covered
  only `Iconic-Becker/IconEventsSite`, and its attempt to create the new
  repository was refused (`403 Resource not accessible by integration`), so
  the app was built as the self-contained `photos/` directory of that
  repository, with its own `package.json`, Dockerfile and `railway.json`,
  and the marketing site untouched. Two ways to deploy it:
  1. As is: a second Railway service on the same repository with **Root
     Directory** set to `photos`.
  2. In its own repository, which keeps the prompt's layout: create the
     empty repository on GitHub, then from a checkout of this branch run
     ```bash
     git subtree split --prefix=photos -b iconic-photos
     git push git@github.com:Iconic-Becker/iconic-photos.git iconic-photos:main
     ```
     and point the Railway service at it with no root directory.
- **Albums from folders.** The folder a photo sits in is its album name,
  whatever the depth. Files dropped with no folder land in "Photos". Empty
  albums are hidden from guests.
- **Default order.** Capture time then filename. New uploads append after
  anything you reordered by hand.
- **Highlights** is virtual: starred photos stay in their albums and also
  appear first under "Highlights". It is the default view when any photo is
  starred.
- **Favorites across albums.** "My favorites" is a view over the whole
  gallery, with its own URL (`/<slug>/favorites`).
- **Lightbox URL.** Opening a photo adds `?p=<id>`, so Back closes the
  lightbox and a shared link opens on that photo.
- **Media URL caching.** Signed URLs are stable for an hour and valid for
  two. After a password is set or changed, URLs already handed out keep
  working until they expire (at most two hours).
- **Content version.** Any change to a gallery's items invalidates cached
  zips; the next "Download all" rebuilds them. Zips for old versions are
  deleted by hourly housekeeping.
- **Trash.** Deleted photos and galleries keep their objects 30 days, then
  housekeeping removes them from R2.
- **Rate limits** count failed attempts only (login 10, unlock 20 per 15
  minutes per IP) so a team behind one office IP does not lock itself out;
  the email capture is limited to 60 per 15 minutes per IP.
- **CSRF.** Cookies are `SameSite=Lax`; every write checks the `Origin`
  header against `PUBLIC_URL`.
- **No RAW, HEIC accepted.** HEIC uploads work if the sharp build on the
  server has HEIF support; the Docker image's sharp does, for decoding.
- **Reel share file size.** "Share video file" appears on phones only when
  the web version is under 60 MB and the browser can share files.

## Accepted trade-offs

- **Favorites use email without verification.** Entering an email on a new
  device restores that email's favorites. Anyone who knows a guest's email
  could see and change that guest's picks for that gallery. This was the
  owner's call: it keeps the first heart to one field. Nothing else (name,
  other galleries, downloads) is exposed by it.
- **Password unlock is a cookie, not a session.** The unlock is an HMAC of
  the gallery id and its password version, remembered 30 days. Changing the
  password relocks every device.
- **Single process.** Rate limit counters are in memory. Running more than
  one instance would need them in Postgres; the job queue already copes.
- **Video playback was not exercised in the headless browser used for
  verification** because it has no H.264 decoder. The MP4s were checked
  with ffprobe (H.264 high, yuv420p, faststart) and the player geometry was
  verified; a real phone check is listed in the owner setup.
- **Link unfurling** was verified by reading the tags and fetching the
  poster and video they point to. Real unfurlers (iMessage, WhatsApp,
  LinkedIn, Slack) need the live domain; test with one shared link after
  deploy.

## Costs

Prices checked 2026-10-19 against Cloudflare's R2 pricing page and
Railway's published rates.

**R2.** $0.015 per GB-month after 10 GB free, Class A writes $4.50 per
million, Class B reads $0.36 per million, no egress fees. Derivatives add
about 15 to 20 percent to the originals. For 100 GB of originals plus
derivatives and a cache of zips, about 130 to 150 GB: **$1.80 to $2.10 a
month**. Operations at 1 to 2 galleries a month are cents.

**Railway.** Hobby plan $5 a month including $5 of usage. Usage is about
$10 per GB-month of memory and $20 per vCPU-month, billed by the second.
Measured in this build: the Node process sat at about 300 MB RSS idle
after processing a gallery (libvips keeps its caches) and about 320 MB
while transcoding; Postgres needs 200 to 300 MB. Expect roughly 0.5 to 0.6 GB-month of memory and a small CPU bill
(the worker is idle between uploads): **about $6 to $8 a month**, of which
$5 is the plan.

**Total: about $8 to $10 a month, $95 to $120 a year.** That is above the
$20 to $80 target in the prompt and at the $10 a month line the prompt
asked to flag, so it is flagged here. CloudSpot is about $500 a year. Ways
to bring it down if it matters: enable Railway's app sleeping for the
service (it wakes on the first request, adding a few seconds for the first
guest), or move Postgres to a free tier elsewhere.

## Backups

- **Database.** Turn on Railway's Postgres backups (step 1 of Deploy). A
  manual dump is `pg_dump "$DATABASE_URL" > backup.sql`.
- **Media.** Originals in R2 are the master copies. R2 is durable, but it
  is one account; for a second copy, Cloudflare's dashboard or `rclone`
  can sync the bucket to another bucket or a local drive. The owner should
  also keep the photographer's own archive.
- **Code.** Git.

## Connecting GoHighLevel later

Guest emails are stored in the `guests` table, one row per guest per
gallery, with `synced_at` and `sync_meta` columns already present so a
webhook can be added without a migration. Today the bridge is the **Guests
CSV** export in the admin.

To add the webhook: in GoHighLevel create an inbound webhook (Automation,
Workflows, trigger "Inbound Webhook") and copy its URL into a new Railway
variable `GHL_WEBHOOK_URL`. Then add a job type to `server/jobs/` that
selects `guests where synced_at is null`, POSTs `{ email, name, gallery,
galleryUrl, firstSeen }` to the URL, and sets `synced_at` and `sync_meta`
on success; register it from housekeeping. Nothing else changes.

## Verification

`scripts/verify/run.mjs` runs the "Done means" checklist against a local
server with Playwright. The run on 2026-10-19 passed 19 of 19 checks
(see the final report for the exact measurements). Each check prints what
it measured. Screenshots land in the chosen output folder. Two items are
limited by the environment and are listed under "Accepted trade-offs":
real H.264 playback and real link unfurling.
