<p align="center">
  <img src="docs/assets/sonance-logo.png" alt="Sonance" width="120" />
</p>

<h1 align="center">Sonance</h1>

<p align="center">
  <strong>A self-hosted web music player for your personal audio library.</strong><br/>
  Scan your FLAC, MP3, OGG, and M4A collection. Browse by album and artist. Play from any browser with gapless playback, crossfade, EQ, visualizers, scrobbling, and more.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?logo=openjdk" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.4-brightgreen?logo=spring-boot" alt="Spring Boot 3.4" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/Tests-410+-green" alt="Tests 410+" />
  <img src="https://img.shields.io/badge/License-Private-lightgrey" alt="Private" />
</p>

---

<p align="center">
  <img src="docs/assets/sonance-hero.jpg" alt="Sonance — Album grid with player bar and activity feed" width="800" />
</p>
<p align="center"><em>Browse your library by album, artist, or track — with real-time activity feed and persistent player bar.</em></p>

## Highlights

| | Feature | Description |
|---|---|---|
| :headphones: | **Gapless & Crossfade** | Dual HTMLAudioElement engine with pre-loading and configurable 0-12s crossfade |
| :musical_score: | **5-Band EQ** | Parametric equalizer (60 Hz - 14 kHz) with 5 presets |
| :bar_chart: | **4 Visualizers** | Frequency bars, waveform, circular, and vinyl — all driven by Web Audio API |
| :vhs: | **Cassette Deck** | Full retro mode with animated reels, VU meters, odometer, and 3 visual themes |
| :microphone: | **Synced Lyrics** | Auto-scrolling lyrics panel with LRC timing support |
| :cd: | **Scrobbling** | Last.fm + ListenBrainz integration with async retry |
| :chart_with_upwards_trend: | **Listening Stats** | Top artists/albums/tracks, plays-per-day chart, period filtering |
| :performing_arts: | **Dynamic Colors** | UI theme extracted from album artwork with saturation-weighted scoring |
| :ocean: | **Waveform Seek Bar** | Server-generated audio waveform as the progress bar |
| :busts_in_silhouette: | **Multi-User** | JWT auth with ADMIN/LISTENER roles, per-user scrobble config |
| :satellite: | **Activity Feed** | Real-time SSE stream showing what users are listening to |
| :iphone: | **Responsive** | Collapsible sidebar, adaptive player bar, desktop to tablet |

---

## Architecture

```mermaid
graph LR
    subgraph Client ["Browser"]
        React["React 19 SPA<br/>Tailwind CSS v4<br/>TanStack Query"]
        WebAudio["Web Audio API<br/>Dual-element engine<br/>EQ + Visualizer"]
    end

    subgraph Proxy ["Caddy :443"]
        TLS["Automatic HTTPS"]
    end

    subgraph Server ["Spring Boot :8080"]
        Security["JWT Auth<br/>HttpOnly Cookies"]
        API["REST API<br/>16 Controllers"]
        Services["Services<br/>Scan · Stream · Stats<br/>Scrobble · Lyrics · SSE"]
        DB["H2 Embedded<br/>Flyway Migrations"]
    end

    subgraph External ["External Services"]
        LastFM["Last.fm API"]
        LB["ListenBrainz API"]
        Lyrics["Lyrics Providers"]
    end

    React -->|HTTPS| TLS
    TLS -->|/api/*| Security
    TLS -->|Static files| React
    Security --> API --> Services
    Services --> DB
    Services -->|Async| LastFM
    Services -->|Async| LB
    Services --> Lyrics
    WebAudio -.->|SSE| Services
```

### Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19 + Vite 8 + TypeScript + Tailwind CSS v4 |
| **Backend** | Spring Boot 3.4 + Java 21 + Maven |
| **Database** | H2 (embedded, zero config) + Flyway migrations |
| **Audio Engine** | Web Audio API (dual HTMLAudioElement + AudioContext graph) |
| **Metadata** | JAudioTagger 2.2.5 (FLAC, MP3, OGG, M4A) |
| **Auth** | Spring Security + JWT in HttpOnly cookies |
| **Proxy** | Caddy (automatic HTTPS + static file serving) |
| **Containers** | Docker Compose (multi-stage builds) |
| **Tests** | JUnit 5 + WireMock + Vitest + Playwright |

---

## Quick Start

### Docker Compose (production)

```bash
cp .env.example .env
# Edit .env — set MUSIC_DIR to your music folder

docker compose up --build
```

Open `https://localhost`. Default credentials: `admin` / `changeme`.

### Development

```bash
# Backend
cd sonance-server
mvn spring-boot:run
# http://localhost:8080 | Swagger UI: http://localhost:8080/swagger-ui.html

# Frontend
cd sonance-ui
npm install && npm run dev
# http://localhost:5173 (proxies /api to :8080)
```

---

## Features in Depth

### Audio Engine

The player runs on a **dual-element Web Audio graph** — two persistent HTMLAudioElements wired through independent gain nodes into a shared processing chain.

```mermaid
graph LR
    subgraph Sources ["Dual Source (Gapless)"]
        A["Element A<br/>GainNode A"]
        B["Element B<br/>GainNode B"]
    end

    subgraph Processing ["Audio Processing"]
        Master["Master Gain<br/>(Volume)"]
        EQ["5-Band EQ<br/>60Hz · 230Hz · 910Hz<br/>3.6kHz · 14kHz"]
        Analyser["AnalyserNode<br/>(FFT 256)"]
    end

    Dest["Speakers"]

    A --> Master
    B --> Master
    Master --> EQ --> Analyser --> Dest
```

**How gapless works:** While track A plays, the inactive element B pre-loads the next track. At transition time, gain A ramps to 0 and gain B ramps to 1 — either instantly (gapless) or over a configurable duration (crossfade). No disconnect/reconnect race conditions.

### Visualizer Modes

<p align="center">
  <img src="docs/assets/sonance-now-playing.jpg" alt="Now Playing — Vinyl visualizer with dynamic colors" width="700" />
</p>
<p align="center"><em>Vinyl visualizer with album-extracted dynamic colors.</em></p>

| Mode | How it works |
|---|---|
| **Frequency Bars** | FFT frequency data → vertical bars with HSL coloring by amplitude |
| **Waveform** | Time-domain data with temporal smoothing (lerp 0.25) and glow effect |
| **Circular** | Radial frequency bars (64 bins) with inner glow gradient |
| **Vinyl** | CSS-animated spinning disc with cover art, slides out on play |

All canvas-based modes run at 60fps via `requestAnimationFrame`, pause on page visibility change, and fade out gracefully when playback stops.

### Cassette Deck (Retro Mode)

<p align="center">
  <img src="docs/assets/sonance-cassette.png" alt="Cassette Deck — Classic theme with VU meters and animated reels" width="700" />
</p>

Full-screen retro cassette experience:

- **Animated reels** — Angular velocity inversely proportional to tape radius (realistic winding)
- **VU meters** — Frequency data drives needle deflection
- **Mechanical odometer** — Digit-by-digit rolling counter
- **LED indicators** — Play/pause/record state
- **3 visual themes** — Switch deck aesthetics on the fly
- **Cover art on cassette label** — With text overlay and shadow effects

### Dynamic Color Extraction

```mermaid
graph LR
    Cover["Album Cover"] --> Sample["64x64 Canvas<br/>Sample"]
    Sample --> Filter["Filter pixels<br/>brightness 30-240<br/>alpha > 128"]
    Filter --> Bucket["Quantize<br/>8 bins per channel<br/>(512 buckets)"]
    Bucket --> Score["Score<br/>sqrt(count) x<br/>(1 + saturation x 2)"]
    Score --> Palette["Primary<br/>Secondary<br/>Background"]
    Palette --> UI["Apply to<br/>Player UI"]
```

Colors extracted from album artwork adapt the entire player UI — progress bar, visualizer, overlay background, and cassette deck. Saturation-weighted scoring prevents washed-out grays from dominating.

### Synced Lyrics

<p align="center">
  <img src="docs/assets/sonance-lyrics.jpg" alt="Now Playing with synced lyrics, waveform seekbar, and vinyl visualizer" width="700" />
</p>
<p align="center"><em>Synced lyrics with waveform seek bar and vinyl visualizer.</em></p>

- LRC format parsing with millisecond timing
- Auto-scroll to the active line during playback
- Manual scroll temporarily disables auto-scroll (4s cooldown)
- States: Loading, Not Found, Instrumental, Synced, Plain Text
- Retry button for failed fetches

### Listening Stats & Scrobbling

<!-- Stats screenshot pending — waiting for more listening data -->

**Play tracking** fires at 50% of track duration — no accidental skips counted.

| Feature | Detail |
|---|---|
| **Summary cards** | Total plays, listening time, unique artists, unique albums |
| **Daily chart** | Plays-per-day bar chart (Recharts) |
| **Top lists** | Top artists, albums, and tracks with play counts |
| **Period filter** | Week, Month, Year, All Time |
| **Last.fm scrobble** | Async with exponential backoff (1s → 2s → 4s, max 3 retries) |
| **ListenBrainz** | Same async retry strategy, per-user token config |

### Library Scan

```mermaid
graph TD
    Start["POST /api/library/scan<br/>(ADMIN)"] --> Check{"Scan already<br/>running?"}
    Check -->|Yes| Skip["Return: scan in progress"]
    Check -->|No| Count["Phase 1: Count<br/>Walk all folders<br/>Count audio files"]
    Count --> Process["Phase 2: Process<br/>For each .flac/.mp3/.ogg/.m4a/.wav"]
    Process --> Meta["Read metadata<br/>(JAudioTagger)"]
    Meta --> Artist["Find or create Artist<br/>(ALBUM_ARTIST for grouping)"]
    Artist --> Album["Find or create Album<br/>(title + albumArtist)"]
    Album --> Cover{"Cover art<br/>exists?"}
    Cover -->|No| Extract["Extract & cache<br/>as {albumId}.jpg"]
    Cover -->|Yes| SaveTrack
    Extract --> SaveTrack["Save Track<br/>(create or update)"]
    SaveTrack --> Next{"More files?"}
    Next -->|Yes| Process
    Next -->|No| Cleanup["Phase 3: Cleanup<br/>Remove orphan albums/artists"]
    Cleanup --> Done["COMPLETED<br/>Client polls status"]
```

Albums are grouped by `ALBUM_ARTIST` tag — compilations with different track artists stay as one album instead of fragmenting.

### Authentication

```mermaid
sequenceDiagram
    participant B as Browser
    participant R as React + Axios
    participant S as Spring Security
    participant J as JWT Service

    B->>R: Login form submit
    R->>S: POST /api/auth/login
    S->>J: Generate access (15min) + refresh (7d) tokens
    J-->>S: Tokens
    S-->>R: Set-Cookie: ACCESS_TOKEN (HttpOnly, Secure, SameSite=Strict)
    S-->>R: Set-Cookie: REFRESH_TOKEN (HttpOnly, Secure, SameSite=Strict)
    S-->>R: Body: { user, accessTokenExpiresIn }
    R->>R: Schedule proactive refresh (expiresIn − 60s)
    R-->>B: Redirect to /

    Note over B,J: Subsequent requests
    B->>R: Click album
    R->>S: GET /api/albums/42 (cookies auto-sent)
    S->>J: Validate ACCESS_TOKEN
    J-->>S: Valid + username + role
    S-->>R: 200 + album data

    Note over B,J: Proactive token refresh (~1 min before expiry)
    R->>R: Timer fires
    R->>S: POST /api/auth/refresh (refresh cookie)
    S->>J: Validate refresh, generate new pair
    J-->>S: New tokens
    S-->>R: Set-Cookie (new tokens) + { user, accessTokenExpiresIn }
    R->>R: Schedule next refresh
```

- **HttpOnly cookies** — JavaScript never touches tokens (XSS protection)
- **SameSite=Strict** — Cookies not sent on cross-origin requests (CSRF protection)
- **Proactive refresh** — Timer refreshes tokens ~1 min before expiry, so `<audio>` and SSE streams (which bypass axios interceptors) never hit a 401
- **Reactive fallback** — Axios interceptor still queues and retries on unexpected 401s

### Activity Feed (Real-Time SSE)

```mermaid
sequenceDiagram
    participant U1 as User 1 (Playing)
    participant S as Server (ActivityService)
    participant U2 as User 2 (Listening)
    participant U3 as User 3 (Listening)

    U2->>S: GET /api/activity/stream (SSE subscribe)
    U3->>S: GET /api/activity/stream (SSE subscribe)
    S-->>U2: Connection open (text/event-stream)
    S-->>U3: Connection open (text/event-stream)

    U1->>S: POST /api/plays/42 (play event)
    S->>S: Store in recent buffer (max 20)
    S-->>U2: event: play { username, track, album, artist }
    S-->>U3: event: play { username, track, album, artist }

    Note over S: Dead connection cleanup during broadcast
```

---

## Project Structure

```
sonance/
├── sonance-server/          Spring Boot backend (see server README)
│   ├── src/main/java/        16 controllers, 17 services, 9 entities
│   ├── src/test/java/        272 tests (unit + integration + WireMock)
│   └── pom.xml               Maven build with JaCoCo ≥80%
├── sonance-ui/              React frontend (see UI README)
│   ├── src/                  Components, hooks, audio pipeline, pages
│   ├── e2e/                  21 Playwright E2E tests
│   └── package.json          Vite 8, Vitest, Tailwind v4
├── caddy/                    Caddy Dockerfile
├── Caddyfile                 Reverse proxy + static serving config
├── docker-compose.yml        Full stack orchestration
├── .env.example              Environment variable template
├── SCROBBLING.md             Scrobbling credentials guide
├── .github/workflows/ci.yml  CI pipeline
└── .gsd/                     Project management artifacts
```

---

## Configuration

| Variable | Default | Description |
|---|---|---|
| `MUSIC_DIR` | _(required)_ | Host path to music library (mounted read-only) |
| `SONANCE_ADMIN_PASSWORD` | `changeme` | Initial admin password |
| `SONANCE_JWT_SECRET` | _(required)_ | JWT signing key (≥32 chars) |
| `SONANCE_TOKEN_ENCRYPTION_KEY` | _(required)_ | AES-256-GCM key for encrypting scrobble tokens at rest |
| `LASTFM_API_KEY` | _(optional)_ | Last.fm API key for scrobbling |
| `LASTFM_API_SECRET` | _(optional)_ | Last.fm API secret for scrobbling |

See `.env.example` for full documentation. See `SCROBBLING.md` for Last.fm/ListenBrainz setup guide.

---

## Tests

```bash
# Backend — 272 tests (unit + integration + WireMock contract)
cd sonance-server && mvn clean verify     # JaCoCo ≥80% enforced

# Frontend — 117 unit tests
cd sonance-ui && npm run test:coverage    # Vitest v8 coverage thresholds

# E2E — 21 Playwright tests (requires backend on :8080)
cd sonance-ui && npm run test:e2e
```

| Suite | Count | What it covers |
|---|---|---|
| **Backend unit** | ~120 | Service logic, DTO mapping, utilities |
| **Backend integration** | ~110 | Controller endpoints, auth flows, DB queries |
| **Backend contract** | ~40 | WireMock stubs for Last.fm + ListenBrainz wire format |
| **Frontend unit** | 117 | Components, contexts, hooks, error handling |
| **E2E (Playwright)** | 21 | Auth, browse, playback, admin, search, stats, settings |

---

## More Screenshots

<p align="center">
  <img src="docs/assets/sonance-health.png" alt="Library Health dashboard" width="700" />
</p>
<p align="center"><em>Library Health dashboard — detect metadata issues, missing covers, and orphan files.</em></p>

### Responsive Layout

<p align="center">
  <img src="docs/assets/sonance-mobile-library.jpg" alt="Mobile — Album grid with compact sidebar" width="300" />
  &nbsp;&nbsp;&nbsp;
  <img src="docs/assets/sonance-mobile-player.png" alt="Mobile — Now Playing with vinyl visualizer" width="300" />
</p>
<p align="center"><em>Fully responsive — collapsible icon sidebar, adaptive player bar, and full Now Playing on mobile.</em></p>

---

## License

Personal project. Not licensed for redistribution.
