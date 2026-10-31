#!/usr/bin/env python3
"""Builds the images the company email signature points at.

Output goes to public/signature/ and is served from
https://www.iconic.events/signature/ by the normal deploy. Everything is drawn
from the brand assets in the repo, so a rerun reproduces the files exactly:

    python3 scripts/signature/build-assets.py

Needs Pillow only (python3 -m pip install pillow).

  sigil.png    The brass sigil, shown large beside the rule in the text block.
  banner.gif   Black wordmark on white, a brass hairline that redraws while
               the tagline alternates between the two lines in use. Frame one
               is the complete composition, so clients that do not animate
               (Outlook desktop) show a finished banner.
  li.png, yt.png, fb.png
               Social tiles, Tide Pool fill with a white glyph. Drawn at 2x
               and shown at 24px. Solid fills so they read the same in light
               and dark mode mail clients.

Sigil and wordmark together is Iconic's own call for the signature (31 Oct
2026), against the guideline's default. Sharp corners; brass only as the
sigil and the hairline.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "signature"
FONTS = ROOT / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

TIDEPOOL = (17, 46, 46)
ONYX = (14, 19, 18)
BRASS = (184, 153, 104)
WHITE = (255, 255, 255)

# ---------------------------------------------------------------- banner ----
# Laid out in 1x pixels, rendered at SCALE for retina mail clients.
SCALE = 2
W, H = 400, 190
FPS = 12
HOLD_MS = 3000
TAGLINES = ["A STANDARD OF ICONIC.", "ENGRAVED, NOT PRINTED."]


def s(v):
    return int(round(v * SCALE))


def ease(t):
    # ease in out, t in 0..1
    return t * t * (3 - 2 * t)


wordmark = Image.open(ROOT / "public" / "logos" / "IE_logo_black.png").convert("RGBA")
wm_w = s(340)
wm_h = int(round(wordmark.height * wm_w / wordmark.width))
wordmark = wordmark.resize((wm_w, wm_h), Image.LANCZOS)
WM_POS = ((s(W) - wm_w) // 2, s(6))

tag_font = ImageFont.truetype(str(FONTS / "Helvetica.ttf"), s(8.5))
TRACK = s(2.6)
RULE_Y = s(156)
RULE_MAX = s(150)
TAG_Y = s(166)


def tracked_width(draw, text):
    return sum(draw.textlength(ch, font=tag_font) for ch in text) + TRACK * (len(text) - 1)


def draw_tracked(draw, text, y, fill):
    x = (s(W) - tracked_width(draw, text)) / 2
    for ch in text:
        draw.text((x, y), ch, font=tag_font, fill=fill)
        x += draw.textlength(ch, font=tag_font) + TRACK


def frame(rule_frac, tag_index, tag_alpha):
    """rule_frac: 0..1 of the hairline's length. tag_alpha: 0..1 opacity."""
    im = Image.new("RGBA", (s(W), s(H)), WHITE + (255,))
    im.alpha_composite(wordmark, WM_POS)
    layer = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if rule_frac > 0:
        half = RULE_MAX * rule_frac / 2
        cx = s(W) / 2
        d.rectangle([cx - half, RULE_Y, cx + half, RULE_Y + s(1) - 1], fill=BRASS + (255,))
    if tag_alpha > 0:
        draw_tracked(d, TAGLINES[tag_index], TAG_Y, BRASS + (int(255 * tag_alpha),))
    im.alpha_composite(layer)
    return im.convert("RGB")


frames, durations = [], []
step = int(1000 / FPS)
OUT_N, IN_N = 7, 9


def hold(i):
    frames.append(frame(1, i, 1))
    durations.append(HOLD_MS)


def swap(frm, to):
    # hairline retracts to the centre as the old line fades
    for k in range(1, OUT_N + 1):
        t = ease(k / OUT_N)
        frames.append(frame(1 - t, frm, 1 - t))
        durations.append(step)
    # then draws out again under the new line
    for k in range(1, IN_N):
        t = ease(k / IN_N)
        frames.append(frame(t, to, t))
        durations.append(step)


hold(0)
swap(0, 1)
hold(1)
swap(1, 0)

# Quantise every frame against one palette so the loop has no colour flicker.
sheet = Image.new("RGB", (frames[0].width, frames[0].height * 3))
sheet.paste(frames[0], (0, 0))
sheet.paste(frames[len(frames) // 2], (0, frames[0].height))
sheet.paste(frames[3], (0, frames[0].height * 2))
palette = sheet.quantize(colors=96, method=Image.MEDIANCUT)
# Median cut averages the big flat areas a shade off. Pin the ground and the
# wordmark to their exact values so the banner sits flush on a white email.
q = [f.quantize(palette=palette, dither=Image.NONE) for f in frames]
pal = palette.getpalette()[: 96 * 3]
for target, tol in ((WHITE, 8), (ONYX, 8)):
    for i in range(96):
        if all(abs(pal[i * 3 + c] - target[c]) <= tol for c in range(3)):
            pal[i * 3 : i * 3 + 3] = list(target)
for f in q:
    f.putpalette(pal)
q[0].save(
    OUT / "banner.gif",
    save_all=True,
    append_images=q[1:],
    duration=durations,
    loop=0,
    optimize=True,
    disposal=1,
)
# A still of the finished composition, for anywhere a GIF is unwelcome.
frames[0].save(OUT / "banner.png", optimize=True)

# ----------------------------------------------------------------- sigil ----
# Shown at 34x112 beside the rule; exported at 2x. Transparent, so it sits on
# whatever the mail client paints behind it.
sigil = Image.open(ROOT / "public" / "logos" / "IE_sigil_gold.png").convert("RGBA")
sig_h = s(112)
sig_w = int(round(sigil.width * sig_h / sigil.height))
sigil.resize((sig_w, sig_h), Image.LANCZOS).save(OUT / "sigil.png", optimize=True)

# ---------------------------------------------------------- social tiles ----
TILE = 48       # output px, shown at 24
SS = 8          # supersample factor
T = TILE * SS


def tile():
    im = Image.new("RGBA", (T, T), TIDEPOOL + (255,))
    return im, ImageDraw.Draw(im)


def finish(im, name):
    im.resize((TILE, TILE), Image.LANCZOS).convert("RGB").save(OUT / name, optimize=True)


def u(v):
    # 24px design units -> supersampled px
    return int(round(v * 2 * SS))


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
