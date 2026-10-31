#!/usr/bin/env python3
"""Builds the images the company email signature points at.

Output goes to public/signature/ and is served from
https://www.iconic.events/signature/ by the normal deploy. A mail signature
cannot carry embedded image data (Gmail strips it), so these have to live at
a URL; the site is the smallest, steadiest place for them. Everything is
drawn from the brand assets in the repo, so a rerun reproduces the files:

    python3 scripts/signature/build-assets.py

Needs Pillow only (python3 -m pip install pillow).

  sigil.gif, sigil.png  The sigil in Tide Pool, animated, and its still. 2x.
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
ONYX = (14, 19, 18)
WHITE = (255, 255, 255)

# ----------------------------------------------------------------- sigil ----
# Shown at 30x100 beside the rule; built at 2x. Tide Pool to match the rule,
# at Iconic's choice over brass (31 Oct 2026); set SIGIL_COLOUR to ONYX for
# black.
#
# Animated, as the old signature's logo was. Frame one is the finished sigil
# and holds, so clients that do not animate (Outlook desktop) show it whole.
# Then it drops out, fades back in on a short rise, a brass glint passes down
# it, and it holds again. Opaque white ground: a GIF has no soft
# transparency, and the fades need one.
SIGIL_COLOUR = TIDEPOOL
BRASS = (184, 153, 104)
SIG_W, SIG_H = 60, 200          # canvas at 2x
GLYPH_H = 184                   # sigil height inside it
FPS = 20
HOLD_MS = 3200

src = Image.open(ROOT / "public" / "logos" / "IE_sigil_black.png").convert("RGBA")
glyph_w = int(round(src.width * GLYPH_H / src.height))
mask = src.getchannel("A").resize((glyph_w, GLYPH_H), Image.LANCZOS)
GLYPH_X = (SIG_W - glyph_w) // 2
GLYPH_Y = (SIG_H - GLYPH_H) // 2


def ease_out(t):
    return 1 - (1 - t) ** 3


def sigil_frame(alpha=1.0, rise=0.0, glint=None):
    """alpha 0..1, rise in px (positive = lower), glint = y of a brass band or None."""
    im = Image.new("RGBA", (SIG_W, SIG_H), WHITE + (255,))
    fill = Image.new("RGBA", mask.size, SIGIL_COLOUR + (255,))
    if glint is not None:
        # a soft brass band, brightest at its centre line
        band = Image.new("L", mask.size, 0)
        bd = ImageDraw.Draw(band)
        for dy in range(-18, 19):
            v = int(255 * max(0.0, 1 - abs(dy) / 18) ** 2)
            bd.line([(0, glint + dy), (mask.width, glint + dy)], fill=v)
        brass = Image.new("RGBA", mask.size, BRASS + (255,))
        fill = Image.composite(brass, fill, band)
    a = mask.point(lambda v: int(v * alpha))
    fill.putalpha(a)
    im.alpha_composite(fill, (GLYPH_X, GLYPH_Y + int(round(rise))))
    return im.convert("RGB")


sframes, sdur = [], []
step = int(1000 / FPS)
# 1. finished, holding
sframes.append(sigil_frame()); sdur.append(HOLD_MS)
# 2. out: a quick fade
for k in range(1, 5):
    sframes.append(sigil_frame(alpha=1 - k / 5)); sdur.append(step)
sframes.append(sigil_frame(alpha=0)); sdur.append(260)
# 3. in: fade up while rising 14px into place
N_IN = 14
for k in range(1, N_IN + 1):
    t = ease_out(k / N_IN)
    sframes.append(sigil_frame(alpha=t, rise=14 * (1 - t))); sdur.append(step)
# 4. the glint runs top to bottom
N_G = 16
for k in range(N_G + 1):
    y = -20 + (GLYPH_H + 40) * k / N_G
    sframes.append(sigil_frame(glint=y)); sdur.append(step)

sheet = Image.new("RGB", (SIG_W, SIG_H * 3))
sheet.paste(sframes[0], (0, 0))
sheet.paste(sframes[8], (0, SIG_H))
sheet.paste(sframes[-8], (0, SIG_H * 2))
spal = sheet.quantize(colors=128, method=Image.MEDIANCUT)
sq = [f.quantize(palette=spal, dither=Image.NONE) for f in sframes]
pal = spal.getpalette()[: 128 * 3]
for i in range(128):
    if all(abs(pal[i * 3 + c] - WHITE[c]) <= 8 for c in range(3)):
        pal[i * 3 : i * 3 + 3] = list(WHITE)
    if all(abs(pal[i * 3 + c] - SIGIL_COLOUR[c]) <= 6 for c in range(3)):
        pal[i * 3 : i * 3 + 3] = list(SIGIL_COLOUR)
for f in sq:
    f.putpalette(pal)
sq[0].save(OUT / "sigil.gif", save_all=True, append_images=sq[1:], duration=sdur, loop=0, optimize=True, disposal=1)
# the still, for anywhere a GIF is unwelcome
sframes[0].save(OUT / "sigil.png", optimize=True)

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
