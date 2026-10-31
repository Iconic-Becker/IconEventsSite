# Company email signature

One signature for everyone, made at **https://www.iconic.events/signature/**
(not indexed, not linked from the site). Each person fills in name, title,
mobile and email, presses Copy signature, and pastes it into Gmail. The page
has the Gmail steps on it.

To send someone a prefilled link, put their details in the URL:

    https://www.iconic.events/signature/?name=Chrissy%20Belgin&title=Chief%20Experience%20Officer&phone=(727)%20420-0359&email=christina@iconic.events

## What is in it

- The brass sigil, large, beside a Tide Pool rule. Then name in serif
  caps, title in Tide Pool, the company line, mobile and email,
  iconic.events.
- Three social tiles: LinkedIn, YouTube, Facebook. Company accounts by
  default; LinkedIn can be a personal profile per person. Instagram and
  TikTok are left off at Iconic's request.
- The animated banner: black wordmark on white, a brass hairline that
  redraws while the line beneath it alternates between "A standard of
  Iconic." and "Engraved, not printed." The first frame is the finished
  composition, so Outlook desktop (which does not animate) shows a complete
  banner, not a blank one.
- Sigil and wordmark in one composition is against the brand guideline's
  default. Iconic chose it for the signature on 31 Oct 2026.

The old signature's images sat on Google's image host, where nobody at
Iconic controls them. These are served from the site itself, from
`public/signature/`, so the links are stable for as long as the site is.

## Changing it

- Images: edit `scripts/signature/build-assets.py` and run
  `python3 scripts/signature/build-assets.py`. It needs Pillow only and
  rebuilds every file in `public/signature/` from the brand assets.
- Layout, copy, links, Gmail steps: `public/signature/index.html`. The
  signature markup is the `build()` function. Keep it tables and inline
  styles; mail clients strip everything else.
- Keep the filenames. Signatures already pasted into Gmail point at them by
  name, and images are cached for a month, so a replacement under the same
  name reaches everyone within a month without anyone re-pasting.

## Open points

- The Facebook tile links to facebook.com/iconicbecker, the account listed
  on the site. The old signature linked facebook.com/klevrevents. Confirm
  which is current; it is one line in `index.html`.
- Gmail cannot push a signature to every mailbox from the admin console.
  Each person pastes once. If that becomes a chore, the Gmail API
  (sendAs settings) can set them all from one script.
