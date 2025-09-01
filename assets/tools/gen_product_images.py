#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

# Output directory
out_dir = Path(__file__).resolve().parents[1] / 'img'
out_dir.mkdir(parents=True, exist_ok=True)

# Define products mapped to filenames and display labels
products = [
    ("laptop.png", "Laptop", (36, 174, 255), (8, 28, 44)),
    ("phone.png", "Phone", (255, 140, 66), (32, 20, 6)),
    ("headphones.png", "Headphones", (127, 93, 255), (15, 10, 38)),
    ("camera.png", "Camera", (255, 92, 109), (38, 8, 14)),
    ("watch.png", "Smartwatch", (52, 199, 89), (6, 26, 12)),
    ("speaker.png", "Speaker", (255, 214, 20), (34, 28, 0)),
    ("drone.png", "Drone", (0, 199, 190), (2, 24, 24)),
    ("monitor.png", "Monitor", (255, 159, 64), (34, 18, 4)),
    ("keyboard.png", "Keyboard", (10, 132, 255), (4, 18, 32)),
    ("mouse.png", "Mouse", (255, 55, 95), (36, 6, 14)),
    ("tablet.png", "Tablet", (175, 82, 222), (24, 8, 34)),
    ("console.png", "Console", (100, 210, 255), (6, 22, 30)),
    ("router.png", "Router", (255, 69, 58), (38, 8, 10)),
    ("ssd.png", "NVMe SSD", (255, 206, 46), (38, 30, 4)),
    ("powerbank.png", "Power Bank", (48, 209, 88), (6, 26, 12)),
]

# Image size with 4:3 aspect
W, H = 1200, 900

def radial_gradient(draw: ImageDraw.ImageDraw, w: int, h: int, inner, outer):
    cx, cy = int(w*0.7), int(h*0.3)
    max_r = math.hypot(max(cx, w-cx), max(cy, h-cy))
    steps = 80
    for i in range(steps, 0, -1):
        t = i/steps
        r = int(t*max_r)
        c = (
            int(inner[0]*t + outer[0]*(1-t)),
            int(inner[1]*t + outer[1]*(1-t)),
            int(inner[2]*t + outer[2]*(1-t))
        )
        bbox = [cx-r, cy-r, cx+r, cy+r]
        draw.ellipse(bbox, fill=c)

def soft_shadow(draw: ImageDraw.ImageDraw, w: int, y: int, alpha=80):
    # subtle spotlight at bottom to suggest product shadow
    for i in range(24, 0, -1):
        a = int(alpha * (i/24)**2)
        draw.ellipse([w*0.25-i*8, y-i*4, w*0.75+i*8, y+i*4], fill=(0,0,0,a))

def load_font(size):
    # Try a few common fonts; fallback to default
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf",
    ]
    for p in candidates:
        fp = Path(p)
        if fp.exists():
            return ImageFont.truetype(str(fp), size)
    return ImageFont.load_default()

title_font = load_font(96)
pill_font = load_font(40)

for filename, label, accent, base in products:
    img = Image.new('RGBA', (W, H), base + (255,))
    d = ImageDraw.Draw(img, 'RGBA')

    # Background gradient
    inner = tuple(min(255, int(c*1.2)) for c in accent)
    radial_gradient(d, W, H, inner, base)

    # Decorative arcs to mimic product contours
    arc_color = accent + (60,)
    for k in range(7):
        t = k/6
        r = int(180 + t*520)
        bbox = [W*0.2 - r, H*0.15 - r, W*0.2 + r, H*0.15 + r]
        d.arc(bbox, start=12, end=80, width=6, fill=arc_color)

    # Soft shadow
    soft_shadow(d, W, int(H*0.78), 90)

    # Product tile
    tile_w, tile_h = int(W*0.64), int(H*0.5)
    tile_x, tile_y = int(W*0.18), int(H*0.2)
    tile = Image.new('RGBA', (tile_w, tile_h), (255,255,255,18))
    td = ImageDraw.Draw(tile)
    # Rounded rectangle
    radius = 36
    shape = [(0, radius), (0, tile_h-radius), (radius, tile_h), (tile_w-radius, tile_h),
             (tile_w, tile_h-radius), (tile_w, radius), (tile_w-radius, 0), (radius, 0)]
    td.rounded_rectangle([0,0,tile_w,tile_h], radius=radius, fill=(255,255,255,18), outline=(255,255,255,28), width=2)
    img.alpha_composite(tile, (tile_x, tile_y))

    # Accent pill badge
    pill = f"{label}"
    text_w, text_h = d.textbbox((0,0), pill, font=pill_font)[2:]
    pad_x, pad_y = 22, 10
    pill_w, pill_h = text_w + pad_x*2, text_h + pad_y*2
    pill_x = tile_x + 24
    pill_y = tile_y + 24
    d.rounded_rectangle([pill_x, pill_y, pill_x+pill_w, pill_y+pill_h], radius=20, fill=accent + (230,))
    d.text((pill_x+pad_x, pill_y+pad_y-4), pill, font=pill_font, fill=(15,15,20,255))

    # Big product name watermark
    name = label.upper()
    big_font = load_font(140)
    nb = d.textbbox((0,0), name, font=big_font)
    nx = tile_x + (tile_w - (nb[2]-nb[0]))//2
    ny = tile_y + tile_h//2 - (nb[3]-nb[1])//2
    d.text((nx+4, ny+4), name, font=big_font, fill=(0,0,0,120))
    d.text((nx, ny), name, font=big_font, fill=(240,240,245,235))

    # Export PNG
    out_path = out_dir / filename
    img.convert('RGB').save(out_path, format='PNG', optimize=True, quality=92)
    print(f"Wrote {out_path.relative_to(Path.cwd())}")

print("Done.")

