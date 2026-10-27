#!/usr/bin/env python3
"""
Generate retro icons for Browser of Dreams PWA.
Produces icon.svg, icon-512.png, icon-192.png, icon-maskable-512.png,
icon-maskable-192.png, apple-touch-icon.png, and favicon-32.png.
"""
import os
import math
from PIL import Image, ImageDraw

ICONS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "icons")
os.makedirs(ICONS_DIR, exist_ok=True)

# 1. Generate crisp SVG vector icon
SVG_CONTENT = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <radialGradient id="spaceGrad" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1c3b7a" />
      <stop offset="60%" stop-color="#0e1e42" />
      <stop offset="100%" stop-color="#050a18" />
    </radialGradient>
    <radialGradient id="globeGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#5cedfc" />
      <stop offset="45%" stop-color="#1e88e5" />
      <stop offset="85%" stop-color="#0d47a1" />
      <stop offset="100%" stop-color="#072352" />
    </radialGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffea79" />
      <stop offset="50%" stop-color="#ff9800" />
      <stop offset="100%" stop-color="#e91e63" />
    </linearGradient>
    <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ece9d8" />
      <stop offset="10%" stop-color="#d4d0c8" />
      <stop offset="90%" stop-color="#9e9a90" />
      <stop offset="100%" stop-color="#605c54" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Outer Rounded Desktop Frame -->
  <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#spaceGrad)" stroke="url(#bezelGrad)" stroke-width="12" />

  <!-- CRT Scanlines Background Effect -->
  <g opacity="0.08" stroke="#ffffff" stroke-width="2">
    <line x1="32" y1="80" x2="480" y2="80" />
    <line x1="32" y1="120" x2="480" y2="120" />
    <line x1="32" y1="160" x2="480" y2="160" />
    <line x1="32" y1="200" x2="480" y2="200" />
    <line x1="32" y1="240" x2="480" y2="240" />
    <line x1="32" y1="280" x2="480" y2="280" />
    <line x1="32" y1="320" x2="480" y2="320" />
    <line x1="32" y1="360" x2="480" y2="360" />
    <line x1="32" y1="400" x2="480" y2="400" />
    <line x1="32" y1="440" x2="480" y2="440" />
  </g>

  <!-- Stars / Dream Particles -->
  <g fill="#ffe082" opacity="0.85">
    <polygon points="110,95 114,107 126,111 114,115 110,127 106,115 94,111 106,107" />
    <polygon points="390,130 393,138 401,141 393,144 390,152 387,144 379,141 387,138" />
    <polygon points="120,380 123,388 131,391 123,394 120,402 117,394 109,391 117,388" />
    <polygon points="410,360 415,375 430,380 415,385 410,400 405,385 390,380 405,375" />
    <circle cx="210" cy="90" r="3" fill="#ffffff" />
    <circle cx="340" cy="85" r="4" fill="#64ffda" />
    <circle cx="430" cy="240" r="3" fill="#ffffff" />
    <circle cx="85" cy="260" r="3.5" fill="#ffd54f" />
  </g>

  <!-- Back Orbit Ring Arc -->
  <g transform="rotate(-25 256 256)">
    <ellipse cx="256" cy="256" rx="190" ry="58" fill="none" stroke="url(#ringGrad)" stroke-width="14" stroke-dasharray="320 280" stroke-dashoffset="140" opacity="0.6" />
  </g>

  <!-- Main Globe Sphere -->
  <circle cx="256" cy="256" r="128" fill="url(#globeGrad)" filter="url(#glow)" />

  <!-- Globe Grid Lines (Latitudes & Longitudes) -->
  <g fill="none" stroke="#e0f7fa" stroke-width="4.5" opacity="0.55">
    <!-- Outer rim highlight -->
    <circle cx="256" cy="256" r="126" stroke-width="3" />
    <!-- Equator and parallels -->
    <ellipse cx="256" cy="256" rx="128" ry="42" />
    <ellipse cx="256" cy="214" rx="114" ry="28" stroke-dasharray="6 4" />
    <ellipse cx="256" cy="298" rx="114" ry="28" stroke-dasharray="6 4" />
    <!-- Prime meridian & meridians -->
    <ellipse cx="256" cy="256" rx="60" ry="128" />
    <line x1="256" y1="128" x2="256" y2="384" stroke-width="5" />
    <line x1="128" y1="256" x2="384" y2="256" stroke-width="5" />
  </g>

  <!-- Front Orbit Ring Arc -->
  <g transform="rotate(-25 256 256)">
    <ellipse cx="256" cy="256" rx="190" ry="58" fill="none" stroke="url(#ringGrad)" stroke-width="16" stroke-dasharray="320 280" stroke-dashoffset="420" />
    <!-- Orbiting Satellite Sparkle -->
    <circle cx="446" cy="256" r="12" fill="#fff" filter="url(#glow)" />
    <circle cx="446" cy="256" r="7" fill="#ffeb3b" />
  </g>

  <!-- Retro Browser Window Mini-badge in bottom right -->
  <g transform="translate(310, 310)">
    <rect x="0" y="0" width="130" height="96" rx="8" fill="#d4d0c8" stroke="#333" stroke-width="4" />
    <rect x="3" y="3" width="124" height="20" fill="#000080" />
    <circle cx="12" cy="13" r="3" fill="#ff5f56" />
    <circle cx="22" cy="13" r="3" fill="#ffbd2e" />
    <circle cx="32" cy="13" r="3" fill="#27c93f" />
    <rect x="44" y="8" width="76" height="10" rx="3" fill="#ffffff" opacity="0.8" />
    <rect x="6" y="28" width="118" height="62" fill="#ffffff" />
    <!-- Mini layout inside badge -->
    <rect x="12" y="34" width="40" height="8" fill="#1565c0" />
    <rect x="12" y="46" width="106" height="4" fill="#b0bec5" />
    <rect x="12" y="54" width="90" height="4" fill="#cfd8dc" />
    <rect x="12" y="62" width="70" height="4" fill="#cfd8dc" />
    <rect x="12" y="74" width="24" height="10" rx="2" fill="#e91e63" />
  </g>

  <!-- Signature Dream Sparkle on Globe -->
  <g fill="#ffffff" transform="translate(290, 180)">
    <polygon points="0,-18 5,-5 18,0 5,5 0,18 -5,5 -18,0 -5,-5" opacity="0.9" />
  </g>
</svg>'''

svg_path = os.path.join(ICONS_DIR, "icon.svg")
with open(svg_path, "w", encoding="utf-8") as f:
    f.write(SVG_CONTENT)
print("Wrote", svg_path)


def render_icon_bitmap(size, is_maskable=False):
    """Render raster icon using PIL matching the retro celestial globe design."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 512.0
    center = size / 2.0

    # If maskable, safe zone is inner 80% (scale down slightly and draw full background)
    pad_scale = 0.82 if is_maskable else 0.94
    eff_scale = scale * pad_scale

    # Background frame
    bg_radius = int(96 * eff_scale) if not is_maskable else 0
    bg_box = (
        0, 0, size, size
    ) if is_maskable else (
        int(16 * scale), int(16 * scale), int(496 * scale), int(496 * scale)
    )

    # Base gradient fill (simulated via radial concentric circles)
    for r in range(int(size * 0.75), 0, -2):
        factor = r / (size * 0.75)
        # Gradient from #1c3b7a to #060a17
        red = int(28 * factor + 6 * (1 - factor))
        green = int(59 * factor + 10 * (1 - factor))
        blue = int(122 * factor + 23 * (1 - factor))
        draw.ellipse([center - r, center - r, center + r, center + r], fill=(red, green, blue, 255))

    if not is_maskable:
        # Bezel stroke
        bezel_w = max(2, int(8 * scale))
        draw.rounded_rectangle(bg_box, radius=bg_radius, outline=(212, 208, 200, 255), width=bezel_w)

    # Stars / Dream Sparkles
    star_positions = [
        (110, 110, 12), (390, 140, 9), (120, 390, 8), (410, 380, 14)
    ]
    for sx, sy, srad in star_positions:
        rx = center + (sx - 256) * eff_scale
        ry = center + (sy - 256) * eff_scale
        rsize = max(2, int(srad * eff_scale))
        # 4-point star polygon
        poly = [
            (rx, ry - rsize), (rx + rsize * 0.3, ry - rsize * 0.3),
            (rx + rsize, ry), (rx + rsize * 0.3, ry + rsize * 0.3),
            (rx, ry + rsize), (rx - rsize * 0.3, ry + rsize * 0.3),
            (rx - rsize, ry), (rx - rsize * 0.3, ry - rsize * 0.3)
        ]
        draw.polygon(poly, fill=(255, 235, 120, 230))

    # Back half of orbit ring
    ring_rx = 180 * eff_scale
    ring_ry = 54 * eff_scale
    # Drawn as tilted ellipse points
    angle_rad = math.radians(-25)
    cos_a = math.cos(angle_rad)
    sin_a = math.sin(angle_rad)

    # Globe Sphere
    globe_radius = int(122 * eff_scale)
    for r in range(globe_radius, 0, -1):
        frac = r / globe_radius
        # Cyan-blue gradient from #5cedfc to #0a2558
        red = int(92 * frac + 10 * (1 - frac))
        green = int(237 * frac + 37 * (1 - frac))
        blue = int(252 * frac + 88 * (1 - frac))
        # Highlight offset
        offset_x = int(-18 * eff_scale * (1 - frac))
        offset_y = int(-18 * eff_scale * (1 - frac))
        draw.ellipse([
            center - r + offset_x, center - r + offset_y,
            center + r + offset_x, center + r + offset_y
        ], fill=(red, green, blue, 255))

    # Grid Lines on globe
    grid_color = (224, 247, 250, 160)
    grid_w = max(1, int(3 * eff_scale))
    # Equator & parallels
    draw.ellipse([
        center - globe_radius, center - int(38 * eff_scale),
        center + globe_radius, center + int(38 * eff_scale)
    ], outline=grid_color, width=grid_w)
    draw.ellipse([
        center - int(globe_radius * 0.9), center - int(70 * eff_scale),
        center + int(globe_radius * 0.9), center - int(10 * eff_scale)
    ], outline=grid_color, width=grid_w)
    draw.ellipse([
        center - int(globe_radius * 0.9), center + int(10 * eff_scale),
        center + int(globe_radius * 0.9), center + int(70 * eff_scale)
    ], outline=grid_color, width=grid_w)
    # Prime Meridian
    draw.ellipse([
        center - int(56 * eff_scale), center - globe_radius,
        center + int(56 * eff_scale), center + globe_radius
    ], outline=grid_color, width=grid_w)
    draw.line([
        (center, center - globe_radius),
        (center, center + globe_radius)
    ], fill=grid_color, width=grid_w)
    draw.line([
        (center - globe_radius, center),
        (center + globe_radius, center)
    ], fill=grid_color, width=grid_w)

    # Front Orbit Ring
    orbit_pts = []
    # Front half goes from ~0 deg to ~180 deg
    for deg in range(0, 185, 3):
        th = math.radians(deg)
        x_local = ring_rx * math.cos(th)
        y_local = ring_ry * math.sin(th)
        # Rotate by -25 deg
        xr = center + (x_local * cos_a - y_local * sin_a)
        yr = center + (x_local * sin_a + y_local * cos_a)
        orbit_pts.append((xr, yr))

    ring_stroke = max(2, int(9 * eff_scale))
    for i in range(len(orbit_pts) - 1):
        prog = i / len(orbit_pts)
        r_c = int(255 * (1 - prog) + 233 * prog)
        g_c = int(220 * (1 - prog) + 30 * prog)
        b_c = int(80 * (1 - prog) + 99 * prog)
        draw.line([orbit_pts[i], orbit_pts[i+1]], fill=(r_c, g_c, b_c, 255), width=ring_stroke)

    # Orbiting satellite spark
    sat_deg = math.radians(35)
    sat_xl = ring_rx * math.cos(sat_deg)
    sat_yl = ring_ry * math.sin(sat_deg)
    sat_x = center + (sat_xl * cos_a - sat_yl * sin_a)
    sat_y = center + (sat_xl * sin_a + sat_yl * cos_a)
    sat_r = max(3, int(8 * eff_scale))
    draw.ellipse([sat_x - sat_r, sat_y - sat_r, sat_x + sat_r, sat_y + sat_r], fill=(255, 255, 255, 255))
    draw.ellipse([sat_x - sat_r * 0.5, sat_y - sat_r * 0.5, sat_x + sat_r * 0.5, sat_y + sat_r * 0.5], fill=(255, 235, 59, 255))

    # Retro Window badge in bottom right (for non-tiny sizes)
    if size >= 128:
        bw = max(20, int(120 * eff_scale))
        bh = max(16, int(88 * eff_scale))
        bx = int(center + 60 * eff_scale)
        by = int(center + 60 * eff_scale)
        draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=max(2, int(6 * eff_scale)), fill=(212, 208, 200, 255), outline=(50, 50, 50, 255), width=max(1, int(3 * eff_scale)))
        # Blue title bar
        tb_h = max(4, int(18 * eff_scale))
        draw.rectangle([bx + 2, by + 2, bx + bw - 2, by + tb_h], fill=(0, 0, 128, 255))
        # Content area
        c_top = by + tb_h + 2
        c_bottom = by + bh - 3
        if c_bottom >= c_top:
            draw.rectangle([bx + 3, c_top, bx + bw - 3, c_bottom], fill=(255, 255, 255, 255))
            strip_h = max(2, int(7 * eff_scale))
            strip_w = max(6, int(bw * 0.5))
            draw.rectangle([bx + 6, c_top + 2, min(bx + bw - 6, bx + 6 + strip_w), min(c_bottom - 2, c_top + 2 + strip_h)], fill=(21, 101, 192, 255))

    return img


# Generate all required PNG sizes
sizes_to_generate = [
    ("icon-512.png", 512, False),
    ("icon-192.png", 192, False),
    ("icon-maskable-512.png", 512, True),
    ("icon-maskable-192.png", 192, True),
    ("apple-touch-icon.png", 180, False),
    ("favicon-32.png", 32, False),
]

for filename, size, maskable in sizes_to_generate:
    out_path = os.path.join(ICONS_DIR, filename)
    img = render_icon_bitmap(size, is_maskable=maskable)
    img.save(out_path, "PNG")
    print(f"Generated {filename} ({size}x{size}, maskable={maskable})")

print("All PWA icons generated successfully!")
