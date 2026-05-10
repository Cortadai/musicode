@echo off
setlocal EnableDelayedExpansion
title Sonance - Starting...

for %%I in ("%~dp0.") do set "ROOT=%%~fI"

echo.
echo   SONANCE - Starting local dev environment
echo.

:: --- Resolve Node/npm via fnm (scoop) ---
for /d %%d in ("%USERPROFILE%\scoop\persist\fnm\node-versions\*") do (
    if exist "%%d\installation\node.exe" set "PATH=%%d\installation;!PATH!"
)

where npm >nul 2>&1
if !errorlevel! neq 0 (
    echo   [X] npm not found. Install Node.js or fnm first.
    exit /b 1
)

:: --- Kill zombie Java processes ---
for /f "tokens=2" %%p in ('tasklist /FI "IMAGENAME eq java.exe" /NH 2^>nul ^| findstr /i "java"') do (
    echo   [!] Killing zombie java.exe PID %%p
    taskkill /PID %%p /F >nul 2>&1
)

:: --- Start Spring Boot backend ---
echo   [1/2] Starting Spring Boot (port 8080)...

:: Write temp launcher to avoid nested-quote issues
set "TMPBAT=%TEMP%\sonance-start-server.bat"
> "!TMPBAT!" echo @cd /d "!ROOT!\sonance-server" ^&^& mvn spring-boot:run ^> "!ROOT!\sonance-server.log" 2^>^&1
start "" /B cmd /c "!TMPBAT!"

echo   Waiting for backend (up to 120s)...

set /a tries=0
:wait_backend
if !tries! geq 40 goto backend_timeout
ping -n 4 127.0.0.1 >nul
set /a tries+=1

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if !errorlevel! equ 0 goto backend_ready

<nul set /p=.
goto wait_backend

:backend_timeout
echo.
echo   [X] Backend did not start in 120s. Check sonance-server.log
exit /b 1

:backend_ready
echo  OK

:: --- Start Vite frontend ---
echo   [2/2] Starting Vite dev server (port 5173)...

set "TMPBAT=%TEMP%\sonance-start-ui.bat"
> "!TMPBAT!" echo @cd /d "!ROOT!\sonance-ui" ^&^& npm run dev ^> "!ROOT!\sonance-ui.log" 2^>^&1
start "" /B cmd /c "!TMPBAT!"

:: --- Wait for Vite to bind port ---
echo   Waiting for frontend (up to 30s)...
set /a tries=0
:wait_frontend
if !tries! geq 10 goto frontend_timeout
ping -n 4 127.0.0.1 >nul
set /a tries+=1

powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2; exit 0 } catch { exit 1 }" >nul 2>&1
if !errorlevel! equ 0 goto frontend_ready

<nul set /p=.
goto wait_frontend

:frontend_timeout
echo.
echo   [X] Frontend did not start in 30s. Check sonance-ui.log
exit /b 1

:frontend_ready
echo  OK

:: --- Open browser ---
start "" http://localhost:5173

echo.
echo   Sonance is running!
echo.
echo     Frontend:  http://localhost:5173
echo     Backend:   http://localhost:8080
echo     Swagger:   http://localhost:8080/swagger-ui.html
echo.
echo   Logs: sonance-server.log / sonance-ui.log
echo   To stop: stop-sonance.bat
echo.
