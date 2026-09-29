# Upscaling the band art

These are the 12 live images extracted from `index.html`'s inlined blob. The
unused `bike` record is deliberately absent — the renderer skips it.

## Why

Each band is baked to a fixed tile width, so the ratio of baked pixels to
source pixels says whether the renderer is preserving detail or inventing it:

| stage | band | source w | tile | RS=1 | RS=2 | RS=3 |
|---|---|---|---|---|---|---|
| 1 | sky | 403 | 572 | 1.42x | **2.84x** | 4.26x |
| 1 | land | 620 | 572 | 0.92x | 1.85x | 2.77x |
| 2 | sky | 620 | 500 | 0.81x | 1.61x | 2.42x |
| 2 | land | 587 | 500 | 0.85x | 1.70x | 2.56x |
| 3 | land | 613 | 500 | 0.82x | 1.63x | 2.45x |

Native (1.00x) arrives at RS 0.7–1.24. Real RS is **2** on an ordinary display
and **3** on high-DPI, so every band is being upscaled 1.6–2.8x. The backbuffer
has 4x the pixels; the photographs do not have 4x the information.

Raising RS further adds nothing. Only larger source art does.

## Targets

| file | current | target | why |
|---|---|---|---|
| **s0_sky** | 403x152 | **4x → 1612x608** | the only band the renderer *magnifies* (403px stretched to a 572px tile), so 2x still leaves it upscaling at RS=2 |
| s0_mid | 620x101 | 2x → 1240x202 | native at RS 2.17 |
| s0_near | 620x75 | 2x → 1240x150 | |
| s1_sky | 620x134 | 2x → 1240x268 | native at RS 2.48 |
| s1_mid | 587x120 | 2x → 1174x240 | native at RS 2.35 |
| s1_near | 587x89 | 2x → 1174x178 | |
| s2_sky | 620x134 | 2x → 1240x268 | |
| s2_mid | 613x120 | 2x → 1226x240 | native at RS 2.45 |
| s2_near | 613x89 | 2x → 1226x178 | |
| poster0-2 | 680x150 | 2x, optional | title/end cards only, not in gameplay frames |

The nine band images are in **every frame** and cover ~73% of it. The three
posters appear only on cards. Do those last, or not at all.

## Tool

**Real-ESRGAN (ncnn/Vulkan build)** — a standalone Windows executable. No
Python, no Node, which matters here because neither is installed.

<https://github.com/xinntao/Real-ESRGAN/releases> → `realesrgan-ncnn-vulkan-*-windows.zip`

Use the **anime/illustration** model, not the photo one. This art is
illustration with hard edges and flat colour areas; the photo model softens
exactly the edges that make it read as pixel art.

```powershell
# 2x for most bands (the model is x4; -s sets the actual scale)
.\realesrgan-ncnn-vulkan.exe -i s1_mid.jpg -o s1_mid.png -n realesrgan-x4plus-anime -s 2

# s0_sky wants 4x - it is the one band that gets magnified
.\realesrgan-ncnn-vulkan.exe -i s0_sky.jpg -o s0_sky.png -n realesrgan-x4plus-anime -s 4
```

Output is PNG. That is fine — the re-inliner converts.

## Putting it back

```powershell
.\tools\reinline.ps1 -Jpeg 85 -WhatIf     # report sizes, write nothing
.\tools\reinline.ps1 -Jpeg 85             # backs up, then rewrites index.html
.\tools\test.cmd
```

`-Jpeg` re-encodes to JPEG at that quality. It is **required** after an
upscale, because inlining PNG costs roughly 8–10x an equivalent JPEG.

Only ever use `-Jpeg` on *new* art. Re-encoding the existing images makes them
**larger** (measured: +63.6 KB at q85), because they are already compressed and
every re-encode only adds.

Try 82, 85 and 88 with `-WhatIf` and pick by the reported blob size. Upscaled
art tolerates lower quality than the original did — the detail it gains is
smooth, so it compresses well.

Assets present in the blob but missing from this folder are left untouched, so
partial updates are safe and you can do one stage at a time.

## Payload — read this before committing

| | |
|---|---|
| live assets now | 282 KB decoded |
| blob now | 468 KB base64 |
| index.html now | 614 KB |

2x is 4x the pixels. JPEG scales sublinearly, so expect roughly **2.5–3x the
bytes**: about 700–850 KB decoded, pushing `index.html` toward **1.1–1.3 MB**.

The project targets under 400 KB first-load, which the file already exceeds.
There is 162 KB of reclaimable waste sitting in it — a dead `bike` asset (68 KB,
19.5% of the blob, decodes to nothing) and the base64 inlining tax on the live
assets (94 KB). That reclaim is roughly what the upscale costs.

Measure with `-WhatIf` before deciding, and drop quality before dropping
resolution — resolution is what you are buying.

## Do not change

Aspect ratios. Every source-pixel constant in the background modules is now a
**fraction** of the image it indexes — seam overlaps, crop offsets, the stage 3
patch rectangles — so a uniform scale is drop-in. A *non-uniform* one is not:
it would move the stage 3 patches off the figures they cover and shift the
stage 1 sky window off the moon.

`tools\smoke.js` asserts each fraction resolves to its originally measured
pixel value at 1x and to exactly double at 2x. If an upscale is non-uniform,
that is where it will show up.
