# Musicode

Personal web-based music player for local audio files. Scan your FLAC, MP3, OGG, and M4A collection, browse by album/artist, and play from any browser with full seeking support.

Think "my own VLC but prettier, in a browser."

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Backend | Spring Boot 3 + Java 21 + Maven |
| Database | H2 (embedded, zero config) |
| Audio Pipeline | Web Audio API (dual HTMLAudioElement + AudioContext graph) |
| Metadata | JAudioTagger 2.2.5 |
| Auth | Spring Security + JWT in HttpOnly cookies |
| Proxy | Caddy (automatic HTTPS) |
| Containers | Docker Compose |

```
Browser ──HTTPS──▶ Caddy (:443)
                    ├── Static files (React build)
                    └── /api/* ──▶ Spring Boot (:8080, internal)
                                    └── H2 database
```

## Quick Start

### Docker Compose (production)

```bash
cp .env.example .env
# Edit .env — set MUSIC_DIR to your music folder

docker compose up --build
```

Open `https://localhost`. Login with `admin` / `changeme` (change the password in `.env`).

### Development

**Backend:**
```bash
cd musicode-server
mvn spring-boot:run
# Runs on http://localhost:8080
```

**Frontend:**
```bash
cd musicode-ui
npm install
npm run dev
# Runs on http://localhost:5173, proxies /api to :8080
```

## Features

- **Library scanning** — Recursive folder scan, reads ID3/Vorbis/MP4 tags (incl. ALBUM_ARTIST), extracts cover art
- **Audio streaming** — HTTP Range support (206 Partial Content) for instant seeking on large files
- **Player** — Play/pause, seek, next/prev, volume, shuffle, repeat (off/all/one), keyboard shortcuts
- **Gapless Playback** — Dual HTMLAudioElement with pre-load and seamless swap, near-gapless transitions (~0-50ms)
- **Audio Preferences** — Volume, shuffle, repeat mode persisted in localStorage across sessions
- **Cover art** — Extracted during scan, cached on disk, served with 7-day cache headers
- **Search** — Combined search across tracks, albums, and artists
- **Authentication** — JWT in secure HttpOnly cookies, access token (15min) + refresh token (7 days) with rotation
- **Multi-user** — Admin-managed users with ADMIN/LISTENER roles, no public registration
- **Media Session** — OS media keys (play/pause/next/prev), now-playing notification with cover art, OS seek bar
- **PWA** — Installable as a standalone app, service worker caches app shell and cover art for offline-ready loading
- **Crossfade** — Configurable 0-12s crossfade between tracks (default off), dual-source gain nodes with linear ramps
- **5-Band EQ** — Parametric equalizer (60Hz–14kHz), 5 presets, opt-in with flat default
- **Visualizer** — 3 modes (frequency bars, waveform, circular), expandable panel, mode persisted in localStorage
- **Now Playing Overlay** — Fullscreen immersive view with artwork, controls, dynamic color extraction from cover art, inline visualizer selector
- **Listening Stats** — Play tracking at 50% duration, top artists/albums/tracks, plays-per-day chart, period selector
- **Scrobbling** — Last.fm and ListenBrainz integration, per-user config, async with retry
- **Activity Feed** — Real-time SSE stream showing what users are listening to
- **API Documentation** — Swagger UI at `/swagger-ui.html`, auto-generated OpenAPI 3.0 spec
- **E2E Tests** — 21 Playwright tests covering auth, browse, playback, admin, search, stats
- **HTTPS** — Caddy reverse proxy with automatic TLS, HTTP→HTTPS redirect

## Project Structure

```
musicode/
├── musicode-server/     Spring Boot backend (see musicode-server/README.md)
├── musicode-ui/         React frontend (see musicode-ui/README.md)
│   └── src/audio/       Audio pipeline (audioGraph.ts, audioPreferences.ts)
├── caddy/               Caddy Dockerfile
├── Caddyfile            Caddy configuration
├── docker-compose.yml   Full stack orchestration
├── .env.example         Environment variable template
├── PLAN.md              Original architecture plan
└── .gsd/                Project management artifacts
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `MUSIC_DIR` | `C:/Users/david/Music` | Host path to music library (mounted read-only) |
| `MUSICODE_ADMIN_PASSWORD` | `changeme` | Initial admin password |
| `MUSICODE_JWT_SECRET` | dev default | JWT signing key (≥32 chars, change in prod) |
| `LASTFM_API_KEY` | _(empty)_ | Last.fm API key for scrobbling (optional) |
| `LASTFM_API_SECRET` | _(empty)_ | Last.fm API secret for scrobbling (optional) |

See `.env.example` for full documentation.

## Tests

```bash
# Backend — 236 tests, JaCoCo ≥80% coverage
cd musicode-server && mvn clean verify

# Frontend — 109 unit tests, Vitest v8 coverage thresholds
cd musicode-ui && npm run test:coverage

# E2E — 21 Playwright tests (requires backend running on :8080)
cd musicode-server && mvn spring-boot:run &
cd musicode-ui && npm run test:e2e
```

## License

Personal project. Not licensed for redistribution.
