# Company email signature

One signature for everyone, made at **https://www.iconic.events/signature/**
(not indexed, not linked from the site). Each person fills in name, title,
mobile and email, presses Copy signature, and pastes it into Gmail. The page
has the Gmail steps on it.

To send someone a prefilled link, put their details in the URL:

    https://www.iconic.events/signature/?name=Chrissy%20Belgin&title=Chief%20Experience%20Officer&phone=(727)%20420-0359&email=christina@iconic.events

## What is in it

One block. The sigil in Tide Pool beside a Tide Pool rule; name in serif caps,
title, mobile and email, then www.iconic.events with the LinkedIn, YouTube
and Facebook squares on the same line. Company accounts by default;
LinkedIn can be a personal profile per person. Instagram and TikTok are
left off, and there is no banner, both at Iconic's request (31 Oct 2026).

The four images have to live at a URL: Gmail strips embedded image data
from signatures, and the old signature's images sat on Google's image
host where nobody at Iconic controls them. They are served from the site,
from `public/signature/`, which is the least hosting that works.

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
- Sigil and wordmark together, or a banner under the block, were tried and
  taken out. The block stands on its own.

## Open points

- The Facebook tile links to facebook.com/iconicbecker, the account listed
  on the site. The old signature linked facebook.com/klevrevents. Confirm
  which is current; it is one line in `index.html`.
- Gmail cannot push a signature to every mailbox from the admin console.
  Each person pastes once. If that becomes a chore, the Gmail API
  (sendAs settings) can set them all from one script.
