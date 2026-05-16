# M026: Electron Desktop Packaging

## Vision
Package Sonance as a native desktop application using Electron — single .exe that launches Spring Boot as a sidecar and renders the React UI in a native window with media keys, system tray, and proper window constraints.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | low | — | ✅ | npm start opens a BrowserWindow loading localhost:5173 (dev mode) |
| S02 | S02 | high | — | ✅ | Electron app starts, waits for Spring Boot health check, then loads UI. Closing window kills Java process. |
| S03 | S03 | medium | — | ✅ | electron-builder produces a working .exe installer that bundles JRE + JAR + frontend |
| S04 | S04 | low | — | ✅ | Media keys control playback, tray icon shows with context menu, README documents setup |
