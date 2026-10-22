# Owner setup checklist

Everything the owner has to do themselves, in order. Each step takes a few
minutes. Never paste the R2 credentials into a chat; they go into Railway
variables only.

## 1. Cloudflare (mostly done)

Done on 2026-10-19: R2 is enabled on the account (login icon@klevr.events)
and the private bucket `iconic-photos` exists.

1. In Cloudflare, R2, **Manage R2 API tokens**: you already hold a token
   scoped to `iconic-photos`. You need three values from it: **Access Key
   ID**, **Secret Access Key**, and the **Account ID** (shown on the R2
   overview page and in the S3 endpoint
   `https://<account id>.r2.cloudflarestorage.com`).
2. Paste them into these Railway variables in step 3:
   - `R2_ACCESS_KEY_ID` = Access Key ID
   - `R2_SECRET_ACCESS_KEY` = Secret Access Key
   - `R2_ACCOUNT_ID` = Account ID
   - `R2_BUCKET` = `iconic-photos`
3. If the token has no permission to change bucket settings, add the CORS
   rule by hand: R2, `iconic-photos`, Settings, CORS policy, paste the JSON
   from `README.md` section "R2 bucket and CORS".
4. Billing, Notifications: set a billing alert (for example $10 a month) if
   you have not.

## 2. GitHub

The code is in `Iconic-Becker/IconEventsSite` under `photos/` on the
branch `claude/gracious-hopper-i0xg1p`. The build could not create
`Iconic-Becker/iconic-photos` itself (the GitHub integration may not create
repositories). Pick one:

- **Same repository.** Merge the branch. In step 3 set the Railway
  service's Root Directory to `photos`.
- **Own repository** (as the build prompt intended). Create an empty
  private repository `iconic-photos` on GitHub, then on your computer:

  ```bash
  git clone git@github.com:Iconic-Becker/IconEventsSite.git
  cd IconEventsSite && git checkout claude/gracious-hopper-i0xg1p
  git subtree split --prefix=photos -b iconic-photos
  git push git@github.com:Iconic-Becker/iconic-photos.git iconic-photos:main
  ```

  Railway then deploys that repository with no root directory.

## 3. Railway

1. Open the Railway project that runs iconic.events.
2. **New**, **Database**, **Postgres**. Open it, Settings, turn on backups.
3. **New**, **GitHub Repo**, pick the repository. If using
   `IconEventsSite`, open the new service's Settings and set **Root
   Directory** to `photos`.
4. Service, **Variables**, add:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PUBLIC_URL` | `https://photos.iconic.events` |
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (use the reference button) |
   | `SESSION_SECRET` | 64 random hex characters (Railway can generate; or run `openssl rand -hex 32`) |
   | `STORAGE_DRIVER` | `r2` |
   | `R2_ACCOUNT_ID` | from step 1 |
   | `R2_ACCESS_KEY_ID` | from step 1 |
   | `R2_SECRET_ACCESS_KEY` | from step 1 |
   | `R2_BUCKET` | `iconic-photos` |
   | `OWNER_EMAIL` | your admin login email |
   | `OWNER_PASSWORD` | a password of at least 10 characters |

5. Deploy. Watch the logs for `[boot] Iconic Photos on https://photos.iconic.events`
   and `R2 bucket iconic-photos: CORS updated` (or the warning telling you
   to add CORS by hand; see step 1.3).

### If a build fails with no error in the logs

Railway occasionally loses its builder a few seconds into a build. The
deploy shows "Failed to build an image" with nothing useful in Build
Logs, and the failed entry has no Redeploy option. The live site keeps
running the previous version. Push any commit to `main` to start a fresh
build, or in the project press Cmd+K (Ctrl+K on Windows) and choose
Redeploy for the photos service. A build that fails twice with a real
error in the logs is something to fix in the code.

## 4. DNS

1. Railway service, Settings, **Networking**, **Custom Domain**, enter
   `photos.iconic.events`. Railway shows a CNAME target like
   `xxxx.up.railway.app`.
2. At the provider that holds the `iconic.events` DNS zone (not
   Cloudflare), add one record: type **CNAME**, name **photos**, value the
   Railway target. Change nothing else in the zone; email records stay as
   they are.
3. Wait for Railway to show the certificate as issued (minutes to an hour).

## 5. First sign in

1. Open `https://photos.iconic.events/admin` and sign in with
   `OWNER_EMAIL` and `OWNER_PASSWORD`.
2. Remove `OWNER_EMAIL` and `OWNER_PASSWORD` from the Railway variables.
3. Users: add each team member with their own email and a password you tell
   them directly. Editors manage galleries; owners also manage users.
4. Create a test gallery, drop a small folder, open the link on your phone,
   and play a reel there. That phone check covers the one thing the build
   environment could not: real video playback.
5. Paste a reel share link into iMessage or WhatsApp and confirm the poster
   and title appear.

Then follow `docs/MIGRATION.md`.

## 6. Send to website (optional)

The Photos tab can send selected photos to iconic.events as a pull
request on `Iconic-Becker/IconEventsSite`. It needs a GitHub token that
can write to that one repository.

1. GitHub, Settings, Developer settings, Personal access tokens,
   Fine-grained tokens, Generate new token.
2. Resource owner: Iconic-Becker. Repository access: Only select
   repositories, pick IconEventsSite.
3. Repository permissions: Contents, Read and write. Pull requests, Read
   and write. Nothing else.
4. Expiration: a year is fine; put a reminder in the calendar.
5. Copy the token into Railway, the iconic-photos service, Variables, as
   `GITHUB_TOKEN`. Never paste it anywhere else, including chat. Redeploy.

Then in the admin: select photos, Send to website, confirm the folder
name (one folder per event, defaults to the gallery's address), Send. A
link to the pull request appears when it is ready. Merge it on GitHub and
Railway deploys the site with the new photos on /gallery.
