@echo off
setlocal EnableDelayedExpansion
title Sonance - Stopping...
set "ROOT=%~dp0"

echo.
echo   SONANCE - Stopping...
echo.

set /a stopped=0

:: --- Kill Java processes (Spring Boot) ---
for /f "tokens=2" %%p in ('tasklist /FI "IMAGENAME eq java.exe" /NH 2^>nul ^| findstr /i "java"') do (
    echo   Stopping java.exe PID %%p
    taskkill /PID %%p /F >nul 2>&1
    set /a stopped+=1
)

:: --- Kill process on port 17381 (Vite) ---
for /f "tokens=5" %%p in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":17381 "') do (
    if "%%p" neq "0" (
        echo   Stopping Vite PID %%p
        taskkill /PID %%p /F >nul 2>&1
        set /a stopped+=1
    )
)

:: --- Clean up logs (may fail if still locked — harmless) ---
ping -n 2 127.0.0.1 >nul
if exist "%ROOT%sonance-server.log" del /q "%ROOT%sonance-server.log" 2>nul
if exist "%ROOT%sonance-ui.log" del /q "%ROOT%sonance-ui.log" 2>nul

echo.
if !stopped! gtr 0 (
    echo   Stopped !stopped! process^(es^).
) else (
    echo   No Sonance processes found.
)
echo.
