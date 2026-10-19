# Security notes

## What is public

- Gallery pages at `/<slug>`: anyone with the link, unless the gallery has a
  password. Slugs are the title plus a random 6 character suffix from a 31
  character alphabet (about 887 million combinations per title) and are not
  listed anywhere. Every response carries `X-Robots-Tag: noindex, nofollow`
  and `robots.txt` disallows all.
- Reel share pages at `/<slug>/reel/<id>`: same rule as the gallery, except
  reels the owner marked **Public**, which play without the password.
- Media URLs are presigned R2 URLs valid for at most two hours. They are
  only issued to viewers who may see the gallery.

## What is not

- The R2 bucket is private. No bucket URL or custom domain is attached.
- Admin pages and `/api/admin/*` need a session cookie. There are no
  public admin endpoints. Editors cannot manage users.
- Guests never see another guest's email or favorites. A guest's own
  identity is a random token in an httpOnly cookie.
- Analytics store a daily salted hash of IP and user agent, never the IP.

## Controls

- Passwords (admin and gallery) are bcrypt hashed, cost 12.
- Sessions: 32 random bytes, stored as a SHA-256 hash in Postgres, 30 day
  expiry, httpOnly, Secure, SameSite=Lax.
- CSRF: SameSite=Lax cookies plus an Origin check on every write.
- Rate limits: login 10 failures, gallery unlock 20 failures, email capture
  60 requests, each per 15 minutes per IP.
- Uploads are validated by extension at planning time and by content
  (magic bytes) when processed; mismatches are marked failed and never
  served. File size is capped at `MAX_FILE_GB` (20).
- Security headers: `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.

## Secrets

All secrets live in Railway variables: `DATABASE_URL`, `SESSION_SECRET`,
`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`. Nothing secret ships to the
browser. `.env` is gitignored.

## Rotating keys

- **R2 token.** In Cloudflare, R2, Manage API tokens, create a new token
  scoped to the `iconic-photos` bucket with Object Read and Write, update
  `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` on the Railway service,
  redeploy, then delete the old token. Uploads in flight during the swap
  fail and resume on the next drop.
- **SESSION_SECRET.** Set a new 64 character hex value and redeploy.
  Everyone is signed out, every guest must re-enter gallery passwords, and
  guest favorite cookies stay valid (they are database tokens, not signed).
- **Database password.** Rotate in Railway's Postgres service; the
  reference variable updates the app.
- **An admin password.** Owners reset it under Users; this also ends that
  user's sessions.

## Reporting

Email icon@iconic.events.
