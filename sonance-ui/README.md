# Sonance UI

React frontend for Sonance. Browse your music library, play tracks with gapless playback and crossfade, visualize audio in real-time with a multi-scope analyzer deck, manage scrobbling, and track your listening stats — all in a dark-themed responsive SPA with 3 layout shells and 9 color palettes.

## Tech Stack

| Component | Technology |
|---|---|
| Framework | React 19 + TypeScript 5.9 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Server State | TanStack Query v5 |
| HTTP Client | Axios (with auth interceptor) |
| Charts | Recharts |
| Icons | Lucide React |
| Animations | GSAP, tsParticles |
| Unit Tests | Vitest + v8 coverage |
| E2E Tests | Playwright |

## Running

```bash
npm install
npm run dev            # Dev server on http://localhost:17381
npm run build          # Production build to dist/
npm run preview        # Preview production build
npm test               # Run unit tests
npm run test:coverage  # Tests with coverage thresholds
npm run test:e2e       # Playwright E2E (requires backend on :17380)
npm run test:e2e:ui    # Playwright with interactive UI
```

The dev server proxies `/api` requests to `http://localhost:17380` (Spring Boot).

---

## Architecture

### Component Hierarchy

```mermaid
graph TD
    App["App<br/>ErrorBoundary + Router"]
    App --> Theme["ThemeProvider<br/>Shell + Palette state"]
    Theme --> Auth["AuthProvider<br/>User session state"]
    Auth --> Player["PlayerProvider<br/>useReducer + 3 contexts"]
    Player --> Shell["AppShell<br/>Layout container (3 shells)"]

    Shell --> Sidebar["Sidebar<br/>Navigation + Activity Feed"]
    Shell --> Main["Main Content<br/>Route outlet"]
    Shell --> PB["PlayerBar<br/>Container-query responsive"]
    Shell --> Analyzer["AnalyzerDeck<br/>Multi-scope canvas"]

    Sidebar --> Nav["Navigation Links<br/>Library · Search · Stats<br/>Playlists"]
    Sidebar --> AdminNav["Admin Nav<br/>Settings · Health<br/>(if isAdmin)"]
    Sidebar --> Feed["ActivityFeed<br/>SSE real-time stream"]
    Sidebar --> UserInfo["User Info<br/>+ Logout"]

    Main --> Pages["Route Pages<br/>Home · Library · Search<br/>Stats · Playlists · Settings"]

    PB --> TrackInfo["TrackInfo<br/>Cover + title + artist"]
    PB --> Transport["TransportControls<br/>Play/Pause · Prev/Next<br/>Shuffle · Repeat"]
    PB --> Progress["ProgressBar<br/>or WaveformBar"]
    PB --> Controls["Volume · EQ · Crossfade<br/>Visualizer · RetroMode"]

    PB --> NP["NowPlayingOverlay<br/>(click album art)"]
    NP --> Vis["Visualizer<br/>Bars · Waveform · Circular"]
    NP --> Vinyl["VinylVisualizer<br/>CSS spinning disc"]
    NP --> Lyrics["LyricsPanel<br/>Synced auto-scroll"]
    NP --> DynColor["Dynamic Colors<br/>Cover art extraction"]

    PB --> Cassette["RetroMode → CassetteCanvas<br/>Reels · VU · Odometer · LEDs"]
```

### Player State Architecture

```mermaid
graph TD
    subgraph Contexts ["Three React Contexts"]
        StateCtx["PlayerStateContext<br/>(read-only)<br/>currentTrack, queue,<br/>queueIndex, isPlaying,<br/>currentTime, duration,<br/>volume, shuffle, repeat"]
        TrackCtx["CurrentTrackContext<br/>(narrow subscription)<br/>trackId + isPlaying only<br/>→ prevents re-renders<br/>on every time tick"]
        DispatchCtx["PlayerDispatchContext<br/>dispatch(action)"]
    end

    subgraph Reducer ["playerReducer"]
        Actions["Actions:<br/>PLAY_TRACK · PAUSE · RESUME<br/>NEXT · PREV · STOP<br/>SET_TIME · SET_DURATION<br/>SET_VOLUME · TOGGLE_SHUFFLE<br/>TOGGLE_REPEAT"]
    end

    subgraph Hooks ["Singleton Hooks"]
        UsePlayer["usePlayer<br/>(owner pattern)<br/>Syncs state → audioGraph"]
        UseGapless["useGapless<br/>Pre-load trigger<br/>Crossfade trigger"]
    end

    DispatchCtx --> Reducer
    Reducer --> StateCtx
    Reducer --> TrackCtx
    StateCtx --> UsePlayer
    UsePlayer --> AudioGraph["audioGraph module"]
    AudioGraph --> UseGapless
    UseGapless --> DispatchCtx
```

**Why three contexts?** Components that only care about "which track is playing" (like the sidebar highlight) subscribe to `CurrentTrackContext` and don't re-render on every `currentTime` tick. Components that need full state (like `PlayerBar`) subscribe to `PlayerStateContext`. Dispatch is separate so state-reading components don't re-render when the dispatch function reference changes.

### Audio Pipeline

```mermaid
graph LR
    subgraph DualSource ["Dual-Element Engine"]
        EA["HTMLAudioElement A<br/>→ MediaElementSource A<br/>→ GainNode A"]
        EB["HTMLAudioElement B<br/>→ MediaElementSource B<br/>→ GainNode B"]
    end

    subgraph Chain ["Processing Chain"]
        MG["Master Gain<br/>(volume control)"]
        EQ1["BiquadFilter<br/>60 Hz"]
        EQ2["BiquadFilter<br/>230 Hz"]
        EQ3["BiquadFilter<br/>910 Hz"]
        EQ4["BiquadFilter<br/>3.6 kHz"]
        EQ5["BiquadFilter<br/>14 kHz"]
        AN["AnalyserNode<br/>FFT size: 256–4096"]
    end

    Dest["AudioContext<br/>.destination"]

    EA --> MG
    EB --> MG
    MG --> EQ1 --> EQ2 --> EQ3 --> EQ4 --> EQ5 --> AN --> Dest

    AN -.->|"getByteFrequencyData()"| Vis["Visualizers +<br/>Analyzer Deck"]
    AN -.->|"getByteTimeDomainData()"| Vis
```

**Gapless mechanism:** While element A plays, element B pre-loads the next track in the queue. At transition time:
- **Instant swap:** GainA → 0, GainB → 1 (flip in one frame)
- **Crossfade:** `linearRampToValueAtTime()` over configurable 0-12s duration

Both elements are permanently wired — no connect/disconnect race conditions.

### Auth Flow

```mermaid
sequenceDiagram
    participant App as React App
    participant Ctx as AuthContext
    participant Ax as Axios Client
    participant API as Backend

    Note over App,API: App Load
    App->>Ctx: Mount AuthProvider
    Ctx->>Ax: GET /api/auth/me
    Ax->>API: (cookies auto-sent)
    alt Valid session
        API-->>Ax: 200 { username, role }
        Ax-->>Ctx: Set user
        Ctx->>API: POST /api/auth/refresh
        API-->>Ctx: { user, accessTokenExpiresIn }
        Ctx->>Ctx: Schedule proactive refresh (expiresIn − 60s)
    else No session
        API-->>Ax: 401
        Ax-->>Ctx: Redirect to /login
    end

    Note over App,API: Proactive Token Refresh (~1 min before expiry)
    Ctx->>Ctx: Timer fires
    Ctx->>API: POST /api/auth/refresh
    API-->>Ctx: 200 { user, accessTokenExpiresIn } (new cookies set)
    Ctx->>Ctx: Schedule next refresh

    Note over App,API: Reactive Fallback (unexpected 401)
    App->>Ax: GET /api/albums
    Ax->>API: (expired access token)
    API-->>Ax: 401
    Ax->>Ax: isRefreshing = true, queue request
    Ax->>API: POST /api/auth/refresh
    API-->>Ax: 200 (new cookies set)
    Ax->>Ax: processQueue() → retry
    Ax-->>App: Albums rendered
```

**Proactive refresh** keeps the access token cookie valid continuously — `<audio>` streaming and SSE connections (which bypass axios) never hit a 401. The reactive interceptor remains as a safety net for edge cases.

---

## Pages

| Route | Component | Auth | Description |
|---|---|---|---|
| `/login` | LoginPage | public | Username + password form with animated transitions |
| `/` | HomePage | any | Dashboard with recent plays, top artists, quick stats |
| `/library` | LibraryPage | any | Unified library view with tabs (Albums, Artists, Tracks) |
| `/albums/:id` | AlbumDetailPage | any | Album with track list |
| `/artists/:id` | ArtistDetailPage | any | Artist with discography |
| `/search` | SearchPage | any | Combined search (tracks, albums, artists) |
| `/stats` | StatsPage | any | Listening statistics dashboard |
| `/playlists` | PlaylistsPage | any | User playlists with create/delete |
| `/playlists/:id` | PlaylistDetailPage | any | Playlist with drag-and-drop reorder |
| `/settings` | SettingsPage | any | Scrobble config, themes, preferences, about |
| `/settings/health` | LibraryHealthPage | ADMIN | Library health issues dashboard |

Legacy routes (`/albums`, `/artists`, `/tracks`) redirect to `/library?tab=*`.

---

## Features

### Player Controls

| Control | Behavior |
|---|---|
| **Play / Pause** | Toggle playback, Media Session integration |
| **Previous** | Restart if >3s in, else previous track |
| **Next** | Next in queue, respects repeat mode |
| **Shuffle** | Fisher-Yates shuffle, preserves original queue order for un-shuffle |
| **Repeat** | Cycles: off → all → one |
| **Volume** | 0-100% slider, persisted in localStorage |
| **Seek** | Click/drag on progress bar or waveform bar |
| **Crossfade** | 0-12s configurable overlap between tracks |
| **5-Band EQ** | 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz with presets (flat, pop, rock, jazz, classical) |
| **Keyboard** | Space (play/pause), Arrow Right/Left (next/prev), M (mute) |
| **Media Session** | OS media keys, now-playing notification with cover art |

### Visualizer Modes

| Mode | Rendering | Data Source |
|---|---|---|
| **Frequency Bars** | Vertical bars, HSL color by amplitude | `getByteFrequencyData()` |
| **Waveform** | Smoothed line with glow effect (0.25 smoothing) | `getByteTimeDomainData()` + lerp |
| **Circular** | 64 radial bars with inner gradient | `getByteFrequencyData()` grouped |
| **Vinyl** | CSS spinning disc with cover art | CSS animation + transition |

Canvas modes run at 60fps via `requestAnimationFrame`. They pause on `document.hidden` and fade out when playback stops.

### Analyzer Deck

Multi-scope real-time audio analyzer with 9 visualization types:

| Scope | Description |
|---|---|
| **Classic Bars** | Traditional frequency spectrum bars |
| **Oscilloscope** | Time-domain waveform display |
| **Spectrogram** | Scrolling frequency/time heatmap |
| **Spectrum Analyzer** | Detailed frequency plot with peak hold |
| **Vectorscope** | Stereo phase correlation display |
| **VU Meter** | Analog-style volume unit meter |
| **Waveform** | Real-time audio waveform |
| **LUFS Meter** | Loudness metering (EBU R128 style) |
| **Heat Scale** | Frequency energy visualization |

Features:
- **Resizable panes** — Multiple scopes visible simultaneously with adjustable proportions
- **Configurable FFT** — 256 to 4096 samples per scope
- **Per-scope settings** — Individual color, gain, and display options
- **Collapsible panel** — Integrated into each shell layout, toggleable from the player bar

### Cassette Deck (Retro Mode)

Full-screen animated cassette tape experience rendered on a virtual 1000×635 canvas:

- **Spinning reels** — Angular velocity = linearSpeed / radius (realistic)
- **VU meters** — Needle deflection driven by frequency data
- **Odometer** — Mechanical digit roller showing elapsed time
- **LED indicators** — Play/pause/record state
- **3 visual themes** — Switchable deck aesthetics
- **Cover art label** — Album cover embedded in cassette label with text overlay

### Dynamic Colors

Album artwork is sampled to a 64×64 canvas, pixels are quantized into 512 color buckets, and scored by `sqrt(count) * (1 + saturation * 2)`. The top-scoring colors become the UI accent — progress bar, visualizer, overlay, and cassette deck all adapt.

### Synced Lyrics

- Fetched from `/api/lyrics/{trackId}`
- LRC format parsed with millisecond timing
- Active line highlighted and auto-scrolled
- Manual scroll pauses auto-scroll for 4 seconds
- States: Loading → Not Found / Instrumental / Synced / Plain Text
- Available in full-screen overlay and sidebar mode

### Waveform Progress Bar

Server-generated waveform peaks rendered as the seek bar. Falls back to a standard progress bar if waveform data is unavailable.

### Activity Feed

Real-time SSE (`EventSource`) in the sidebar showing recent plays across all users. Falls back to polling `/api/activity/recent` on reconnect.

### Listening Stats

| Component | Data |
|---|---|
| **Summary cards** | Total plays, listening time, unique artists, unique albums |
| **Daily chart** | Plays-per-day bar chart (Recharts) |
| **Top artists** | Ranked by play count |
| **Top albums** | Ranked by play count |
| **Top tracks** | Ranked by play count |
| **Period filter** | Week, Month, Year, All Time |

### Favorites

- Heart icon on any track to toggle favorite (per-user, persisted server-side)
- `useFavorites` hook manages state with TanStack Query optimistic updates
- Context menu integration for quick toggling

### Playlists

- Create, rename, delete playlists
- Add tracks from context menu or album/track views
- Drag-and-drop reorder within playlist
- Sidebar integration for quick access

### Queue Panel

- Slide-out panel showing the current playback queue
- Reorder tracks, remove individual items, clear queue
- Visible from the player bar

### Scrobbling

- **Last.fm** — Authenticated via API key + session
- **ListenBrainz** — Authenticated via user token
- Auto-report at 50% play threshold
- Status indicator in the player bar

---

## UI System

### Layout Shells

Three distinct layout shells, selectable from the top bar:

| Shell | Sidebar | Notes |
|---|---|---|
| **Evolved** | 224px (expanded) | Full navigation labels, activity feed visible |
| **Nova** | 64px (icon-only) | Compact navigation, feed hidden |
| **Minimal** | None (horizontal nav) | Maximum content area, nav in top bar |

### Color Palettes

9 dark-themed color palettes: **Indigo**, **Zinc**, **Crimson**, **Emerald**, **Amber**, **Cyan**, **Daylight**, **Sunrise**, **Frost**.

Each palette defines backgrounds, borders, text, accents, status colors, sidebar, player, analyzer deck, and badge colors via CSS custom properties.

### Responsive Player Bar

The player bar uses **CSS container queries** (not viewport media queries) to adapt its layout based on available space — correctly handling the different effective widths across shells:

| Container width | Behavior |
|---|---|
| **< 750px** | Cover art and tech badges hidden |
| **750–849px** | Cover art visible, controls in overflow popover |
| **≥ 850px** | All controls inline |

### Additional UI Features

- **Particle background** — Animated tsParticles backdrop (toggleable in settings)
- **Glassmorphism** — Backdrop blur + transparency on overlays and panels
- **Login transitions** — Multiple animated entry effects (configurable)
- **Track context menu** — Right-click for playlist add, queue, favorite
- **Offline banner** — Network status detection with visual indicator
- **Marquee text** — Scrolling track title when text overflows (toggleable)
- **Tech badges** — Audio format, bitrate, and codec badges in the player bar

---

## Project Structure

```
src/
├── api/              API functions + Axios client with auth interceptor
│                     (withCredentials: true, 401 refresh queue)
├── assets/           Static assets
├── audio/
│   ├── audioGraph.ts             Dual-element Web Audio graph (singleton)
│   ├── audioPreferences.ts       localStorage persistence for player settings
│   ├── eqProcessor.ts            5-band parametric EQ (BiquadFilterNodes)
│   ├── eqSpectrumSource.ts       Real-time FFT data for analyzer scopes
│   ├── analyzerDeckDataSource.ts Multi-scope FFT data routing
│   └── colorExtraction.ts        Cover art → color palette (canvas quantization)
├── components/
│   ├── activity/     ActivityFeed (SSE EventSource)
│   ├── analyzer/     Analyzer Deck (9 scopes, resizable panes)
│   │   ├── scopes/   Scope renderers (ClassicBars, Oscilloscope, etc.)
│   │   └── useDeckStore.ts  Zustand-style scope state
│   ├── auth/         ProtectedRoute, LoginTransition
│   ├── common/       Spinner, ErrorMessage, ErrorBoundary, OfflineBanner,
│   │                 HeartButton, TrackContextMenu, Skeletons
│   ├── home/         Home dashboard widgets (Carousel)
│   ├── icons/        Custom SVG icon components
│   ├── layout/
│   │   ├── AppShell.tsx       Layout container + keyboard shortcuts
│   │   ├── Sidebar.tsx        Navigation + Activity Feed + User info
│   │   ├── TopBar.tsx         Search + ThemeSelector + PaletteSelector
│   │   ├── ParticlesBackground.tsx
│   │   └── shells/            EvolvedShell, NovaShell, MinimalShell
│   ├── library/      AlbumCard, ArtistCard, TrackList, AlbumInfoCard
│   └── player/
│       ├── PlayerBar.tsx           Persistent bottom controls (container queries)
│       ├── TransportControls.tsx   Play/Pause/Prev/Next/Shuffle/Repeat
│       ├── ProgressBar.tsx         Standard seek bar
│       ├── WaveformBar.tsx         Waveform-rendered seek bar
│       ├── VolumeControl.tsx       Volume slider
│       ├── QueuePanel.tsx          Slide-out playback queue
│       ├── EqPopover.tsx           5-band EQ with presets + frequency response
│       ├── CrossfadePopover.tsx    Crossfade duration config
│       ├── MoreControlsPopover.tsx Overflow controls for narrow layouts
│       ├── Visualizer.tsx          Bars/Waveform/Circular (Canvas 2D)
│       ├── VinylVisualizer.tsx     CSS spinning disc
│       ├── NowPlayingOverlay.tsx   Full-screen immersive view (5 modes)
│       ├── LyricsPanel.tsx         Synced lyrics with auto-scroll
│       ├── LyricsSidebar.tsx       Lyrics in sidebar mode
│       ├── TrackInfo.tsx           Album art + marquee track details
│       ├── ScrobbleIndicator.tsx   Sync status badge
│       ├── TechBadges.tsx          Audio format/bitrate badges
│       ├── RetroMode.tsx           Cassette deck entry point
│       └── cassette/
│           ├── CassetteCanvas.tsx  Main canvas renderer
│           ├── VUMeter.tsx         Frequency-driven VU needles
│           ├── Odometer.tsx        Mechanical digit roller
│           ├── DeckLEDs.tsx        Play/pause/record indicators
│           ├── DeckTransport.tsx   Tape transport controls
│           └── DeckThemeToggle.tsx Theme switcher
├── context/
│   ├── AuthContext.tsx         Login/logout/restore + useAuth() hook
│   ├── PlayerContext.tsx       useReducer + 3 contexts + usePlayer/useGapless
│   ├── QueuePanelContext.tsx   Queue panel visibility state
│   └── LyricsSidebarContext.tsx  Lyrics sidebar visibility state
├── hooks/
│   ├── usePlayer.ts            Owner-pattern singleton, state→audioGraph sync
│   ├── useGapless.ts           Pre-load + crossfade trigger logic
│   ├── useDynamicTheme.ts      Album cover → CSS custom properties
│   ├── useElectronMediaKeys.ts Media key support in Electron
│   ├── useFavorites.ts         Favorite tracks (optimistic TanStack Query)
│   ├── useFrameScheduler.ts    rAF scheduling for canvas renderers
│   ├── useMarqueePref.ts       Marquee text scroll preference
│   ├── useMediaSession.ts      Media Session API integration
│   ├── useOnlineStatus.ts      Online/offline detection
│   ├── useParticles.ts         Particle background effects
│   ├── usePlaylists.ts         Playlist CRUD with TanStack Query
│   ├── useScrobble.ts          Scrobble status tracking (50% threshold)
│   └── useWaveform.ts          Waveform data fetching
├── pages/            Route components (10 pages + lazy loading)
├── themes/
│   ├── palettes/     9 color palette definitions
│   ├── tokens/       Shell-specific structural tokens
│   └── ThemeProvider.tsx  Shell + palette state + CSS variable injection
├── types/            TypeScript interfaces
└── utils/
    ├── errors.ts     Error extraction (backend ErrorResponse → string)
    └── format.ts     Duration formatting (seconds → mm:ss)
```

---

## Key Patterns

### Owner-Based Singleton (usePlayer)

Multiple components call `usePlayer()`, but only one "owns" the `audioGraph` lifecycle. The first caller claims ownership via a module-level `Symbol` ref. The owner wires callbacks (timeupdate, ended, loadedmetadata) and syncs React state to the audio graph. Other callers get read-only access through context.

### Dual Contexts for Performance

`PlayerStateContext` (full state) and `CurrentTrackContext` (trackId + isPlaying) are separate. The sidebar's "now playing" indicator subscribes only to `CurrentTrackContext`, so it doesn't re-render 4 times per second on `currentTime` updates.

### Callback Routing in audioGraph

Both HTMLAudioElements fire `timeupdate` and `ended`. The graph module checks which element is active before dispatching callbacks — no need to add/remove listeners on swap.

### Preload-Triggered Transitions

`useGapless` registers a `setOnTimeUpdate` callback. When remaining time drops below the preload threshold, it calls `prepareNext()`. When remaining time drops below the crossfade duration, it initiates the crossfade or instant swap. Single event source driving multiple state machines.

### Container Queries for Responsive Layout

The PlayerBar uses `@container` queries rather than viewport breakpoints. This ensures correct behavior regardless of which shell is active — Evolved's 676px effective width, Nova's 844px, and Minimal's full 900px all trigger the right breakpoints based on actual available space.

---

## Error Handling

| Layer | Strategy |
|---|---|
| **ErrorBoundary** | Wraps entire app — catches React runtime crashes, shows reload UI |
| **ErrorMessage** | Reusable component with optional retry button |
| **getErrorMessage()** | Extracts backend `ErrorResponse.error` field or provides fallback text |
| **Axios interceptor** | 401 → transparent refresh with request queue; refresh failure → redirect to login |
| **OfflineBanner** | Detects network loss and shows persistent indicator |

---

## Tests

```bash
npm run test:coverage    # 230 unit tests with coverage thresholds
npm run test:e2e         # Playwright E2E tests (requires backend on :17380)
npm run test:e2e:ui      # Playwright E2E with interactive UI
```

### Unit Tests (Vitest)

230 tests covering components, contexts, hooks, pages, and utilities. Coverage thresholds enforced on `context/` and `utils/` (lines ≥80%, branches ≥80%, functions ≥50%).

### E2E Tests (Playwright)

21 tests in 10 files covering: authentication, album/artist/track browsing, playback controls, admin settings, search, navigation, stats dashboard, error states.

Config: single worker, sequential execution, HTML reporter, screenshots + traces on failure. Backend must be running on `:17380`.
