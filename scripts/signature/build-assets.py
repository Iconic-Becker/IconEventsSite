#!/usr/bin/env python3
"""Builds the four images the company email signature points at.

Output goes to public/signature/ and is served from
https://www.iconic.events/signature/ by the normal deploy. A mail signature
cannot carry embedded image data (Gmail strips it), so these have to live at
a URL; the site is the smallest, steadiest place for them. Everything is
drawn from the brand assets in the repo, so a rerun reproduces the files:

    python3 scripts/signature/build-assets.py

Needs Pillow only (python3 -m pip install pillow).

  sigil.png             The brass sigil, shown beside the rule. 2x.
  li.png, yt.png, fb.png
                        Social tiles, Tide Pool fill with a white glyph,
                        drawn at 2x and shown at 20px. Solid fills so they
                        read the same in light and dark mode mail clients.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "signature"
FONTS = ROOT / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

TIDEPOOL = (17, 46, 46)
WHITE = (255, 255, 255)

# ----------------------------------------------------------------- sigil ----
# Shown at 30x100 beside the rule; exported at 2x. Transparent, so it sits on
# whatever the mail client paints behind it.
sigil = Image.open(ROOT / "public" / "logos" / "IE_sigil_gold.png").convert("RGBA")
sig_h = 200
sig_w = int(round(sigil.width * sig_h / sigil.height))
sigil.resize((sig_w, sig_h), Image.LANCZOS).save(OUT / "sigil.png", optimize=True)

# ---------------------------------------------------------- social tiles ----
TILE = 40       # output px, shown at 20
SS = 8          # supersample factor
T = TILE * SS


def tile():
    im = Image.new("RGBA", (T, T), TIDEPOOL + (255,))
    return im, ImageDraw.Draw(im)


def finish(im, name):
    im.resize((TILE, TILE), Image.LANCZOS).convert("RGB").save(OUT / name, optimize=True)


def u(v):
    # 24-unit design grid -> supersampled px
    return int(round(v * T / 24))


# LinkedIn: the "in" lettermark
im, d = tile()
f_in = ImageFont.truetype(str(FONTS / "Helvetica-Bold.ttf"), u(13))
d.text((T / 2, T / 2 + u(0.4)), "in", font=f_in, fill=WHITE, anchor="mm")
finish(im, "li.png")

# YouTube: rounded lozenge with a play triangle knocked out
im, d = tile()
d.rounded_rectangle([u(4), u(7), u(20), u(17.5)], radius=u(3.2), fill=WHITE)
d.polygon([(u(10.4), u(9.6)), (u(10.4), u(14.9)), (u(15.2), u(12.25))], fill=TIDEPOOL)
finish(im, "yt.png")

# Facebook: the "f"
im, d = tile()
f_f = ImageFont.truetype(str(FONTS / "Helvetica-Bold.ttf"), u(17))
d.text((T / 2 + u(0.6), T / 2 + u(1.2)), "f", font=f_f, fill=WHITE, anchor="mm")
finish(im, "fb.png")

for p in sorted(OUT.iterdir()):
    print(f"{p.name:12} {p.stat().st_size / 1024:7.1f} KB")
