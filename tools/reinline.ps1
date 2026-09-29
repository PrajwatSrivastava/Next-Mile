# reinline.ps1 - rebuild index.html's inlined asset blob from src\assets\
#
# Reads every image in the asset folder, re-encodes it into the `var A={...}`
# blob, and rewrites index.html in place. Assets present in the blob but NOT
# in the folder are left exactly as they are, so partial updates are safe and
# the unused `bike` record survives untouched.
#
#   .\tools\reinline.ps1                  # rebuild from src\assets
#   .\tools\reinline.ps1 -Dir src\assets2 # rebuild from somewhere else
#   .\tools\reinline.ps1 -WhatIf          # report what would change, write nothing
#
# After running: .\tools\test.cmd

[CmdletBinding()]
param(
  [string]$Dir  = "src\assets",
  [string]$Html = "index.html",
  # Re-encode every input to JPEG at this quality (1-100) before inlining.
  # Upscalers emit PNG, which inlines at roughly 8-10x the bytes of an
  # equivalent JPEG, so this is effectively required after an upscale pass.
  # Upscaled art also tolerates lower quality than the original did: the
  # detail it gained is smooth, so it compresses well. 82-88 is a good band.
  [ValidateRange(0,100)][int]$Jpeg = 0,
  [switch]$WhatIf
)

Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = "Stop"

if (-not (Test-Path $Dir))  { throw "asset folder not found: $Dir" }
if (-not (Test-Path $Html)) { throw "html not found: $Html" }

# ---- locate the blob line -------------------------------------------------
# It is found by LENGTH, not by line number: the line has moved twice already
# as the file changed above it.
$lines = Get-Content $Html
$bi = -1
for ($i = 0; $i -lt $lines.Count; $i++) { if ($lines[$i].Length -gt 100000) { $bi = $i; break } }
if ($bi -lt 0) { throw "could not find the asset blob line in $Html" }

$rx = '"([A-Za-z0-9_]+)":\s*\{\s*"d":\s*"([^"]*)"\s*,\s*"t":\s*"([a-z]+)"\s*,\s*"w":\s*(\d+)\s*,\s*"h":\s*(\d+)\s*\}'
$existing = [ordered]@{}
foreach ($m in [regex]::Matches($lines[$bi], $rx)) {
  $existing[$m.Groups[1].Value] = @{
    d = $m.Groups[2].Value; t = $m.Groups[3].Value
    w = [int]$m.Groups[4].Value; h = [int]$m.Groups[5].Value
  }
}
if ($existing.Count -eq 0) { throw "blob line found but no asset records parsed - format changed?" }
Write-Host ("parsed {0} records from {1} line {2}" -f $existing.Count, $Html, ($bi + 1))

# ---- fold in whatever is on disk -----------------------------------------
$changed = 0
$report  = @()
foreach ($f in Get-ChildItem $Dir -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' }) {
  $name = [IO.Path]::GetFileNameWithoutExtension($f.Name)
  if (-not $existing.Contains($name)) {
    Write-Warning ("'{0}' is not an asset this game loads - skipped" -f $name); continue
  }
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $w = $img.Width; $h = $img.Height

  if ($Jpeg -gt 0) {
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
             Where-Object { $_.MimeType -eq 'image/jpeg' }
    $ps  = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                     [System.Drawing.Imaging.Encoder]::Quality, [int64]$Jpeg)
    $ms = New-Object System.IO.MemoryStream
    $img.Save($ms, $enc, $ps)
    $bytes = $ms.ToArray(); $ms.Dispose(); $ps.Dispose()
    $type = 'jpeg'
  } else {
    $bytes = [IO.File]::ReadAllBytes($f.FullName)
    $type  = if ($f.Extension -eq '.png') { 'png' } else { 'jpeg' }
  }
  $img.Dispose()
  $b64 = [Convert]::ToBase64String($bytes)

  $old = $existing[$name]
  if ($old.d -ne $b64) { $changed++ }
  $report += [pscustomobject]@{
    asset = $name
    from  = "$($old.w)x$($old.h)"
    to    = "${w}x${h}"
    scale = [math]::Round($w / $old.w, 2)
    kb    = [math]::Round($bytes.Length / 1KB, 1)
  }
  $existing[$name] = @{ d = $b64; t = $type; w = $w; h = $h }
}

if ($report.Count) { $report | Format-Table -AutoSize | Out-String | Write-Host }
Write-Host ("{0} record(s) would change" -f $changed)

# ---- re-emit in the exact original shape ---------------------------------
# Field order d,t,w,h with a space after every colon. A regex that assumes
# otherwise silently matches nothing.
$sb = New-Object System.Text.StringBuilder
[void]$sb.Append("var A={")
$first = $true
foreach ($k in $existing.Keys) {
  if (-not $first) { [void]$sb.Append(", ") }
  $first = $false
  $a = $existing[$k]
  [void]$sb.Append(('"{0}": {{"d": "{1}", "t": "{2}", "w": {3}, "h": {4}}}' -f $k, $a.d, $a.t, $a.w, $a.h))
}
[void]$sb.Append("};")
$newLine = $sb.ToString()

$oldKB = [math]::Round($lines[$bi].Length / 1KB, 1)
$newKB = [math]::Round($newLine.Length / 1KB, 1)
Write-Host ("blob: {0} KB -> {1} KB  ({2:+#.#;-#.#;0} KB)" -f $oldKB, $newKB, ($newKB - $oldKB))

if ($WhatIf) { Write-Host "-WhatIf: nothing written."; return }

# there is no version control in this repo, so the backup is not optional
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
Copy-Item $Html "index.prereinline-$stamp.html"
Write-Host "backed up to index.prereinline-$stamp.html"

$lines[$bi] = $newLine
[IO.File]::WriteAllLines((Resolve-Path $Html), $lines)
Write-Host ("wrote {0} ({1:N0} KB)" -f $Html, ((Get-Item $Html).Length / 1KB))
Write-Host "now run: .\tools\test.cmd"
