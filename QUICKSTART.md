# Working on this

Contributor and agent notes. For what the game *is*, how to play it and how to run the tests, see
[README.md](README.md).

## Environment

| | |
|---|---|
| Shell | **PowerShell 5.1.** No `&&` / `\|\|` chaining — use `;` and `if ($?) { }` |
| Git | Installed (2.55). `git` may need a new shell to appear on `PATH` |
| Node / npm / bun / deno | **Absent.** Nothing in the npm ecosystem runs here |
| Python | Resolves to a non-functional Microsoft Store stub |
| Tests | `.\tools\test.cmd` — runs on `cscript`, needs nothing installed |

Because Node is absent, any recommendation involving Vite, Vitest, Playwright, sharp or ESLint is
gated behind installing Node LTS first (`winget install OpenJS.NodeJS.LTS`). Say so explicitly
rather than writing steps that cannot run.

## Two things that will waste your time

1. **Never `Read index.html` without `offset` and `limit`.** Line 69 is 478,981 characters — the
   inlined asset blob — and reading it blows the token limit. Use `offset:1, limit:68` for the head
   and DOM, `offset:70` for the game code. You never need line 69 itself.
2. **Never filter a search to `*.js`.** All game code is inline in `index.html`, so a `.js`-only
   grep reports no render loop, no audio and no input — all of which exist. Always include `*.html`.

## Extracting the inlined art

`src/assets/` already holds the originals, so you rarely need this — but if the folder is ever lost,
the blob is recoverable with no toolchain at all:

```powershell
$line = (Get-Content index.html -TotalCount 69)[68]
New-Item -ItemType Directory -Force src\assets | Out-Null
[regex]::Matches($line, '"([A-Za-z0-9_]+)":\s*\{\s*"d":\s*"([^"]*)"\s*,\s*"t":\s*"([a-z]+)"') | ForEach-Object {
  $n = $_.Groups[1].Value
  $e = $_.Groups[3].Value; if ($e -eq 'jpeg') { $e = 'jpg' }
  [IO.File]::WriteAllBytes("$PWD\src\assets\$n.$e", [Convert]::FromBase64String($_.Groups[2].Value))
}
Get-ChildItem src\assets | Select-Object Name, Length
```

Two traps: `bike` is a **PNG**, not a JPEG, and the record field order is `d,t,w,h` with a space
after every colon — a regex that assumes otherwise matches nothing and silently writes zero files.
The `bike` record is a leftover the renderer no longer reads; extracting it from the blob is the
single largest remaining payload win (~68 KB).

Going the other way is [`tools/reinline.ps1`](tools/reinline.ps1). Always `.\tools\test.cmd`
afterwards.

## House rules for changes

- One coherent change per commit, with a message stating what and why.
- Geometry constants live in exactly one place. Never duplicate a constant between collision and
  draw — `coinY(h)` is the pattern to follow.
- Constants that index into the **artwork** are fractions of the source image, never pixel counts,
  so a 2× re-export is drop-in. `tools/smoke.js` reads those fractions out of `index.html` and
  checks them at 1× and 2×; if you add one, add its assertion too.
- Every forgiveness window is expressed in **seconds**, not frames.
- Zero allocation in the hot loop, and no `console.log` in it either.
- Decisions that are genuinely the author's — art direction, scope, gameplay intent, brand — get
  surfaced as questions, not decided silently.
