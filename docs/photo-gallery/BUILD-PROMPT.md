# Build prompt: Iconic Photos (CloudSpot replacement)

Hand this whole file to the building agent. Everything below was decided
with the owner in interviews on 2026-10-18 and 2026-10-19 and confirmed
by them. Build it as written. If something proves impractical, say so and
propose the nearest alternative rather than quietly diverging.

---

## 1. The job

Iconic Events pays about $500 a year for CloudSpot, a client photo gallery
service. They make 1 to 2 galleries a month and hold about 100 GB of
photos and short videos. Build a replacement they own, running on
infrastructure they already use, for roughly $20 to $80 a year all in.

Live at **`https://photos.iconic.events`**. Ship a working, verified
product, then help migrate the archive so CloudSpot can be cancelled.

**What the owner disliked about CloudSpot,** and what this build must fix:

- Galleries were not very exciting to look at.
- There were few customization options.

**What to keep:** photos are easy to see and easy to find.

**The three things to do better:**

1. Cover pages with real options.
2. Albums that are easy to move between, even when a gallery has many.
3. A featured reel or trailer that attendees can watch and share.

Making it easy to find photos still comes first. The design work exists to
make that feel premium, never to get in its way.

## 2. Who uses it

Galleries serve everyone at once: corporate event guests looking for
photos of themselves, the client who hired Iconic, sponsors and speakers,
and the public when a gallery is used for marketing. Design for a guest on
a phone who arrived from a shared link and has never seen the site.

## 3. Decisions already made

| Area | Decision |
|---|---|
| Address | `photos.iconic.events`, a separate service from the marketing site |
| Look | Iconic Events branding (section 7), with per-gallery customization (section 5A) |
| Cover pages | Several cover layouts to pick from per gallery, including a video cover (section 5A) |
| Albums | Each gallery splits into albums from upload subfolders, e.g. `Keynote/`, `Reception/`, `Headshots/`. Navigation must stay easy with 20+ albums (section 5B) |
| Reels and trailers | Owner can feature a reel or trailer per gallery. Attendees can play it, share it with a link that previews well, and download it (section 5C) |
| Favorites | **Per person.** Each guest email has its own list |
| Email gate | Asked **only on first favorite**. Browsing and downloading need no email |
| Downloads | Per photo, guest picks **Social**, **Full resolution**, or **Both** |
| Download all | Available to **everyone**, per album or whole gallery, with the same size choice |
| Password | **Optional per gallery**, off by default |
| Creating galleries | **Web admin page**: log in, drag a folder into the browser, get the link |
| Admin users | **Owner plus a few team members**, each with their own login |
| File types | **Edited JPEGs** and **videos / reels**. No RAW |
| Analytics | **View and download counts** |
| GoHighLevel | **Later.** Store emails in our own database now; build an export so GHL can be connected afterwards |
| Migration | **Move the full CloudSpot archive over**, then cancel |
| Not wanted now | Watermarks, expiry dates, new-favorite email notifications, print store, face recognition search |

## 4. Architecture

Existing ecosystem: the marketing site is `Iconic-Becker/IconEventsSite`
(Vite + React, Node `server.js`), deployed by Railway from `main`. Do not
put this product inside that app and do not touch its routes, sitemap or
deploy. Read it only for brand assets (section 7).

New repo `Iconic-Becker/iconic-photos`, deployed as a new
service in the same Railway project.

- **App:** Node 20+, React + Vite front end, one server process for the
  API and the built pages. Match the marketing site's idiom (plain JS,
  Tailwind) unless there is a reason not to.
- **Database:** Railway Postgres. Turn on Railway's backups.
- **Media storage:** Cloudflare R2, one private bucket. No photo or video
  bytes in git, and none passing through Railway on upload.
- **Uploads:** browser uploads go **directly to R2** with presigned
  multipart URLs. They must be resumable, run several files in parallel,
  show per-file and total progress, and survive a dropped connection. A
  100 GB migration goes through this uploader, so it has to hold up for
  hours.
- **Processing:** after an upload lands, a background job (a Postgres
  backed queue in the same service is fine) reads the original from R2 and
  writes the derivatives back to R2. Use `sharp` for images and `ffmpeg`
  for video poster frames.
- **Serving media:** the owner has a Cloudflare account, but it is
  empty and `iconic.events` DNS is **not** on Cloudflare (checked
  2026-10-19).
  - **Do not move the DNS.** The domain carries email and the move is the
    owner's call.
  - Serve media through presigned GET URLs, with expiry rounded to a
    fixed window so URLs stay stable enough to cache.
  - Media for password protected galleries must never be reachable
    before unlock.
  - The bucket needs a CORS rule allowing PUT and GET from
    `https://photos.iconic.events` (and localhost in development) so
    browser uploads work. Set it up and document it.
- **DNS:** `photos.iconic.events` is a CNAME to the Railway service, added
  at whichever DNS provider holds the zone. Change nothing else in that
  zone.

### Derivatives per photo

| Name | Spec | Use |
|---|---|---|
| `thumb` | about 600px long edge, WebP (AVIF optional) | grid |
| `display` | about 1600 to 2048px long edge, WebP | lightbox |
| `social` | 2048px long edge, JPEG quality about 82, sRGB, GPS stripped, copyright kept | "Social" download |
| original | untouched | "Full resolution" download |

Store pixel dimensions so the grid lays out without shifting.

### Video

Store the original. For every video, generate:

- a poster frame
- the duration
- a **web version**: H.264 MP4, 1080p max, `faststart`, sized to play
  smoothly on a phone

The background job does this with `ffmpeg`. At 1 to 2 galleries a month
the CPU cost is small, but cap transcoding at about 15 minutes of video
per file and flag anything longer.

Playback always uses the web version, never the multi-GB original.
Downloads offer **Social** (the web version) and **Full resolution** (the
original), matching photos. Vertical 9:16 reels must display and play
correctly, not letterboxed into a 16:9 box.

The cover's looping background clip (section 5A) is a further muted,
short (6 to 12 seconds), small file cut from a start point the owner
picks.

### Download all

Build zips lazily on first request: one per gallery or album and per
size, written to R2 and cached until that gallery changes. Show a
"Preparing your download" state while a zip builds. Split very large sets
into parts of about 2 GB so phones cope. Favorites zips are small and can
be streamed on demand.

R2 has no egress fees. Railway does charge for egress, which is why media
should not stream through the server except for small favorites zips.

## 5. Guest experience (gallery page)

URL: `photos.iconic.events/<slug>`, where the slug is the event name plus
a random suffix of at least 6 characters, e.g. `smith-gala-x7k2qd`. Links
must not be guessable or listed anywhere public.

1. **Password page**, only if the gallery has a password. The unlock is
   remembered in a cookie.
2. **Cover:** the layout chosen for this gallery (section 5A).
3. **Featured reel,** if one is set (section 5C).
4. **Albums:** the album navigation (section 5B).
5. **Grid:** layout and density as set for this gallery, lazy loaded,
   fast on mobile data. Videos in the grid show a play icon and duration.
   No horizontal overflow at 390px.
6. **Lightbox:** swipe and keyboard navigation, pinch zoom on phones, and
   on each item a heart, a download button and a share button.
7. **Favorites:**
   - The first heart opens a short modal: email (required), name
     (optional), and one line explaining the email is used to save their
     picks and that Iconic Events may contact them about this event.
   - After that, a cookie remembers the guest and hearts save instantly.
   - Entering the same email on another device restores their list. This
     is by design, with no email verification step. Note it in the README
     as an accepted trade-off.
   - A "My favorites" filter and "Download my favorites" are available.
8. **Download choice:** Social / Full resolution / Both. On iOS, where
   several separate downloads get blocked, "Both" and multi-file
   downloads arrive as one zip.
9. **Download all:** by album or whole gallery, same size choice.
10. Every gallery response carries `X-Robots-Tag: noindex, nofollow`, and
   `robots.txt` disallows everything.

## 5A. Cover pages and customization

Each gallery gets its own look, set in the admin with a **live preview**
that switches between phone and desktop. Ship these cover layouts:

| Layout | What it is |
|---|---|
| **Full bleed** | One photo edge to edge, title over it |
| **Split** | Photo on one side, title, date and details on a solid panel; stacks on phones |
| **Video** | The looping muted trailer clip plays behind the title, with the poster frame shown until it loads and for reduced motion |
| **Mosaic** | 3 to 5 chosen photos in an editorial collage |
| **Title card** | Typography only on a brand colour, for galleries without a strong hero shot |

Per-gallery settings:

- **Cover media:** pick any photo or video from the gallery. Set a
  **focal point** by clicking the image, so the crop works on both phone
  and desktop.
- **Text:**
  - Title and optional subtitle.
  - Event date, location, and a short intro line.
  - A **client logo**, for co-branding next to the Iconic Events logo.
- **Theme:** dark (onyx) or light (bone), with brass accents. Title type
  in Cormorant Garamond or Causten.
- **Grid:** justified, masonry or square, with comfortable or compact
  density.
- **Cover animation:** a subtle entrance (fade, slow zoom) or none. It
  respects `prefers-reduced-motion`.

Keep it to these brand-safe choices; do not add free colour pickers or
arbitrary fonts. Each gallery should look distinct and every one should
still read as Iconic. **Good defaults matter more than options:** a
gallery created with no customization at all must already look finished.

## 5B. Album navigation

Albums must stay easy to move between whether a gallery has 2 or 40.

- **Album overview:** below the cover, a grid of album tiles. Each tile
  shows a cover image (owner-picked, else the first photo), the name and
  the photo count. This is the main way in when there are many albums.
- **Sticky album bar:** while browsing, a horizontally scrollable bar of
  album chips stays pinned at the top.
  - The current album is highlighted and auto-scrolled into view.
  - On desktop it has arrow buttons; on phones it swipes.
- **"All albums" button** in that bar: opens a sheet listing every album
  with a thumbnail and count, filterable by typing when there are more
  than about 8.
- **Next album:** the end of each album shows a large "Next: Reception"
  card, so guests can keep going without scrolling back up.
- **Deep links:** each album has its own URL (`/<slug>/<album>`), which
  can be shared directly. Back and forward buttons behave.
- **Highlights:** an optional album the owner fills by starring photos
  in the admin. It shows first and is the default view when set.
- **Return to place:** coming back from the lightbox restores the scroll
  position.

## 5C. Featured reels and trailers

The owner can attach one or more featured videos to a gallery, such as an
event trailer, a recap reel, or a sponsor cut. These are separate from
videos that sit inside albums.

- **On the gallery page:** a featured reel section sits directly under
  the cover with a large player and a clear play button. If there are
  several, they show as a row with the first one large.
- **Share page:** each featured video has its own page at
  `/<slug>/reel/<id>`.
  - The page plays the video on a branded backdrop, with a link into the
    full gallery.
  - It carries Open Graph and Twitter card tags (title, description,
    poster image, `og:video`), so a pasted link shows a proper preview in
    iMessage, WhatsApp, LinkedIn, Slack and email.
  - Test the preview with real link-unfurling tools.
- **Share button:** on phones, uses the native share sheet (Web Share
  API) with the share page link. When the browser supports sharing files
  and the web version is small enough, also offer "Share video file", so
  attendees can post straight to Instagram or TikTok. On desktop, offer
  copy link.
- **Download:** Social (web version) or Full resolution (original).
- **Password galleries:** reel share pages respect the password. The
  owner can mark an individual reel **public**, so a trailer can be
  shared widely while the photos stay private. When the gallery is
  password protected, the toggle says so plainly.
- **Analytics:** plays, completions (watched to 90%), shares and
  downloads per reel.

## 6. Admin

Path: `photos.iconic.events/admin`.

- **Users:** email and password login (argon2 or bcrypt), httpOnly secure
  session cookies. Two roles:
  - **Owner:** manages users and does everything below.
  - **Editor:** manages galleries.
  - The owner creates accounts and resets passwords from the admin. No
    email sending is needed. The first owner account is created with a
    one-time setup command or env var, documented in the README.
- **Gallery list:** title, date, photo count, size, views, downloads,
  favorites count, link with a copy button.
- **Create or edit a gallery:**
  - Title, event date, auto-generated slug, cover photo picker, optional
    password, and visible / hidden.
  - Drag in a folder: subfolders become albums, loose files go to a
    default album.
  - Add more files later.
  - Rename and reorder albums, and pick album cover images.
  - Star photos for Highlights.
  - Reorder photos (default order: capture time, then filename).
  - Delete photos.
- **Trash:** deleting a photo or gallery moves it to trash for 30 days
  before R2 objects are removed.
- **Favorites view:** per gallery, each guest's name, email, time and
  picks with thumbnails. Buttons: "Copy filenames" (a comma separated
  list that pastes into Lightroom's filter) and CSV export.
- **Analytics:** per gallery and per photo, views, lightbox opens and
  downloads split by Social / Full / zip. Store it in Postgres with no
  third-party trackers. Count unique visitors with a daily salted hash,
  never raw IPs.
- **Guests export:** CSV of every guest email with gallery, name and first
  seen date. This is the bridge to GoHighLevel later; design the guest
  table so a webhook can be added without a migration.

## 7. Brand

Pull from `Iconic-Becker/IconEventsSite`:

- `Iconic-Events_Brand-Reference.md` and `Iconic-Events_Brand-Voice.md`
  for tone. Short, declarative, no hype.
- Colours, from `src/index.css`: onyx `#0E1312`, tidepool `#112E2E`,
  tidepool tint `#DDE5E4`, brass `#B89968`, bone `#F4F0E8`, bone dim
  `#E7E1D4`. Square corners everywhere (all radii 0).
- Fonts in `fonts/`: Cormorant Garamond (serif headings), Causten
  (display), Helvetica (body).
- Logos in `docs/logos/`: `IE_logo_WHITE.png` / `IE_logo_BLACK.png` and
  the sigil.
- Photos are the hero. Use a dark onyx canvas in the grid and lightbox so
  images read true.
- House style: **no em dashes** in any copy.

## 8. Security

- R2 credentials live only in Railway env vars. Use an API token scoped
  to the one bucket. Nothing secret ships to the browser.
- Rate limit login, password unlock, and the email capture endpoint.
- CSRF protection on all writes (SameSite cookies plus an Origin check).
- Validate uploads by content as well as extension. Cap file size
  generously (videos can be several GB).
- Never expose another guest's email or favorites to a guest.
- Admin pages and APIs require a session; there are no public admin
  endpoints.
- Write a short `SECURITY.md` covering what is public, what is not, and
  how to rotate keys.

## 9. Migration from CloudSpot

1. The owner exports galleries from CloudSpot. Check CloudSpot's bulk
   download options and document the steps found. If the export loses
   album structure, the owner recreates folders before upload.
2. Upload through the admin, keeping the original titles and dates.
3. Existing CloudSpot links die when the subscription ends. Produce a
   mapping sheet (old gallery name to new link) so the owner can resend
   links to clients who still use them.
4. Spot check: photo counts match CloudSpot for each gallery.

## 10. Owner setup (the agent writes these steps out exactly)

The agent cannot create accounts. Give the owner a numbered checklist:

1. **Cloudflare.** Done: R2 is enabled and the private bucket
   `iconic-photos` exists (2026-10-19). The account login is
   icon@klevr.events. The owner holds the R2 S3 credentials (Access Key ID,
   Secret Access Key, endpoint) for a token scoped to that bucket. Tell
   them exactly which Railway variables to paste them into. Never ask for
   the credentials in chat. Remind them to set a billing notification if
   they have not.
2. **GitHub.** Create the new repo or approve the agent creating it.
3. **Railway.** Add the new service and a Postgres database, and set the
   env vars.
4. **DNS.** Add one CNAME for `photos.iconic.events`.
5. Run the first-owner setup, log in, and invite team members.

## 11. Cost target

Verify current prices; these are approximate.

- R2 storage is about $0.015/GB-month with the first 10 GB free and no
  egress fees.
- At 100 GB plus cached zips, storage runs about $2 to $4 a month.
- Railway service plus Postgres runs a few dollars a month at this
  traffic.

Put the measured monthly estimate in the README. If anything in the
design pushes past about $10 a month, stop and flag it.

## 12. Done means

Verify in a real browser (Playwright with Chromium is available) and say
exactly what was measured. Be plain about anything that could not be
checked.

- [ ] Admin: create a gallery by dropping a folder with 2 subfolders, 30+
      JPEGs and 1 video. Albums appear and derivatives generate.
- [ ] Upload resumes after the network is cut mid-file.
- [ ] Guest at 390px: cover, tabs, grid, lightbox, swipe all work. No
      horizontal overflow and no console errors.
- [ ] First heart asks for email; later hearts don't. The same email on a
      fresh browser restores the list.
- [ ] Social, Full and Both downloads produce the right files (check the
      dimensions and that GPS is stripped from Social).
- [ ] Download all works per album and for the whole gallery, at each
      size.
- [ ] Password gallery: media URLs cannot be fetched before unlock.
- [ ] Each of the 5 cover layouts renders correctly at 390px and 1440px,
      and the focal point holds on both.
- [ ] A gallery with no customization looks finished.
- [ ] Album navigation with a 25-album test gallery:
      - the overview tiles, sticky bar, "All albums" sheet with filter,
        and next-album card all work
      - deep links to an album load directly
      - back and forward behave
- [ ] A featured 9:16 reel and a 16:9 trailer both play on a phone
      without letterboxing.
- [ ] The reel share page link unfurls with poster and title.
- [ ] Native share opens on mobile.
- [ ] A public reel in a password gallery plays without the password,
      while the gallery photos still require it.
- [ ] Admin favorites view shows picks, and "Copy filenames" output
      pastes cleanly.
- [ ] Counts increment for views and downloads.
- [ ] Editor role cannot manage users.
- [ ] `noindex` header present; `robots.txt` disallows.
- [ ] README covers setup, env vars, costs, backups, the no-verification
      trade-off and how to add the GHL webhook later.

Work in small commits. Ask the owner only about things they must decide
or do; make every other call yourself and note it in the README.
