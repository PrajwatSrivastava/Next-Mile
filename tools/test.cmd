@echo off
REM No Node on this machine, so these run on the Windows JScript engine (cscript).
REM They polyfill ES5, stub the DOM/audio/canvas, then execute the REAL game code.
cd /d "%~dp0\.."
echo ===== PARSE =====
cscript //nologo tools\parse.js "%CD%\index.html"
echo.
echo ===== SMOKE + FAIRNESS ARITHMETIC =====
cscript //nologo tools\smoke.js "%CD%\index.html"
echo.
echo ===== GAMEPLAY INVARIANTS (autopilot) =====
cscript //nologo tools\play.js "%CD%\index.html"
