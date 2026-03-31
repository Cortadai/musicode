# Project

## What This Is

**Musicode** — a personal web-based music player for local audio files (FLAC, MP3, OGG, M4A). Spring Boot 3 backend scans configured folders, reads metadata with JAudioTagger, streams audio with HTTP Range support. React + Vite + TypeScript frontend provides a modern, dark-themed UI for browsing and playing a personal library. Runs in Docker Compose with embedded H2 database — zero external dependencies.

Think "my own VLC but prettier, in a browser, and personal."

## Core Value

**Play my local FLAC/MP3 files from a browser with proper seeking, metadata display, and cover art.** If scope shrinks, this survives: scan a folder, browse tracks/albums/artists, click play, hear audio with seek support.

## Current State

Fully functional music player with 7 milestones complete. Library of 877 tracks scanned. Multi-user auth, listening stats, scrobbling integrations, real-time activity feed, Swagger API docs, and 169 tests across 3 test suites.

## Architecture / Key Patterns

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS v4 | SPA, dark theme (zinc + indigo), TanStack Query |
| Backend | Spring Boot 3.4 + Java 21 + Maven | REST API, async scanning, SSE |
| Database | H2 (file mode, embedded) | Zero config, metadata + plays + users |
| Metadata | JAudioTagger 2.2.5 | ID3/Vorbis/MP4 tag reading (incl. ALBUM_ARTIST) |
| Audio | HTML5 `<audio>` element (singleton) | FLAC native in modern browsers |
| Auth | Spring Security + JWT in HttpOnly cookies | Access 15min, refresh 7 days, rotation |
| API Docs | SpringDoc OpenAPI 2.8.14 | Swagger UI at /swagger-ui.html |
| Charts | Recharts | Stats dashboard |
| E2E Testing | Playwright (Chromium) | 21 E2E tests |
| Icons | Lucide React | |
| Containers | Docker Compose + Caddy | HTTPS, reverse proxy |

**Monorepo layout:**
- `musicode-server/` — Spring Boot backend
- `musicode-ui/` — React frontend

**Key technical patterns:**
- HTTP 206 Partial Content for audio seeking (RandomAccessFile + Range headers)
- Async library scanning (`@Async` + `@EnableAsync`)
- ALBUM_ARTIST tag for album grouping (prevents compilation fragmentation)
- Cover art extracted during scan, cached as `{albumId}.jpg` on disk
- `PlayerContext` with `useReducer` + dual contexts (state/dispatch separation)
- Singleton Audio element at module level — survives component unmounts
- Playback tracking at 50% duration threshold → stats + scrobble + activity feed
- SSE (SseEmitter) for real-time activity feed
- Async scrobbling with exponential backoff (fire-and-forget from PlayController)
- Cookie auth with refresh queue (axios interceptor handles concurrent 401s)
- Media Session API for OS integration (media keys, now-playing, seek bar)
- PWA with hand-written service worker (network-first shell, cache-first covers)

**Entities:**
- `Track` → `Album` → `Artist` (library)
- `User` → `Role` (ADMIN/LISTENER)
- `RefreshToken` (auth)
- `PlaybackEvent` (stats/scrobbling)
- `LibraryFolder` (scan config)

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [x] M001: Core MVP — Scan, browse, stream, play audio in browser
- [x] M002: Polish + Quality Baseline — Multi-format, shuffle/repeat, keyboard shortcuts, test coverage
- [x] M003: Security & Multi-User — JWT cookies, ADMIN/LISTENER roles, Caddy HTTPS
- [x] M004: Code Quality & Modern Idioms — Records, @ControllerAdvice, MDC logging, ErrorBoundary
- [x] M005: Reproductor Experience — Media Session API, PWA, spectrum visualizer
- [x] M006: API Documentation & E2E Testing — Swagger UI, 21 Playwright tests
- [x] M007: Listening Intelligence — Playback tracking, stats dashboard, scrobbling, activity feed

## Planned Milestones

- [ ] M008: Audio Experience — Gapless playback, crossfade, parametric equalizer, enhanced visualizer
- [ ] M009: Smart Library — Metadata editing, filesystem watcher, smart playlists, radio mode
- [ ] M010: Visual Experience — Now Playing screensaver, dynamic theme, waveform preview, cassette mode
- [ ] M011: Integrations & Streaming — Synchronized lyrics (.lrc), transcoding, Subsonic API, Bandcamp import

## Pending Setup

- Last.fm API key + secret need to be configured via env vars (`LASTFM_API_KEY`, `LASTFM_API_SECRET`) for scrobbling to work. Create an app at https://www.last.fm/api/account/create.
