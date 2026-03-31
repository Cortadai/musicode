# Musicode

Personal web-based music player for local audio files. Scan your FLAC, MP3, OGG, and M4A collection, browse by album/artist, and play from any browser with full seeking support.

Think "my own VLC but prettier, in a browser."

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS |
| Backend | Spring Boot 3 + Java 21 + Maven |
| Database | H2 (embedded, zero config) |
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

- **Library scanning** — Recursive folder scan, reads ID3/Vorbis/MP4 tags, extracts cover art
- **Audio streaming** — HTTP Range support (206 Partial Content) for instant seeking on large files
- **Player** — Play/pause, seek, next/prev, volume, shuffle, repeat (off/all/one), keyboard shortcuts
- **Cover art** — Extracted during scan, cached on disk, served with 7-day cache headers
- **Search** — Combined search across tracks, albums, and artists
- **Authentication** — JWT in secure HttpOnly cookies, access token (15min) + refresh token (7 days) with rotation
- **Multi-user** — Admin-managed users with ADMIN/LISTENER roles, no public registration
- **Media Session** — OS media keys (play/pause/next/prev), now-playing notification with cover art, OS seek bar
- **PWA** — Installable as a standalone app, service worker caches app shell and cover art for offline-ready loading
- **Spectrum Visualizer** — Real-time frequency bars via Web Audio API, toggleable from the player bar
- **HTTPS** — Caddy reverse proxy with automatic TLS, HTTP→HTTPS redirect

## Project Structure

```
musicode/
├── musicode-server/     Spring Boot backend (see musicode-server/README.md)
├── musicode-ui/         React frontend (see musicode-ui/README.md)
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

See `.env.example` for full documentation.

## Tests

```bash
# Backend — 97 tests, JaCoCo ≥80% coverage
cd musicode-server && mvn clean verify

# Frontend — 40 tests, Vitest v8 coverage thresholds
cd musicode-ui && npm run test:coverage
```

## License

Personal project. Not licensed for redistribution.
