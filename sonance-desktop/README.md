# Sonance Desktop

Electron wrapper that bundles the Sonance frontend + backend into a standalone Windows application. Launches a Spring Boot sidecar server on port 17380 and renders the UI in a frameless Chromium window.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Electron (main.js)                                 │
│  ├── BrowserWindow → loads localhost:17380          │
│  ├── Sidecar (sidecar.js) → spawns java -jar       │
│  ├── Tray icon + context menu                       │
│  ├── Global media key shortcuts                     │
│  └── IPC bridge (preload.js)                        │
└─────────────────────────────────────────────────────┘
         │                          │
         ▼                          ▼
┌─────────────────┐    ┌──────────────────────────┐
│  Bundled JRE 21 │    │  sonance-server.jar      │
│  (Adoptium)     │    │  (Spring Boot + static)  │
└─────────────────┘    └──────────────────────────┘
```

## Features

| Feature | Implementation |
|---------|----------------|
| Sidecar management | Spawns/kills Java process, health polling via `/actuator/health` |
| Zombie cleanup | Detects stale processes on port 17380, kills them before starting |
| Server adoption | If a healthy server already runs on the port, reuses it |
| Loading screen | Minimal splash shown while Spring Boot starts (~8-15s) |
| Media keys | Global shortcuts: Play/Pause, Next, Previous, Stop |
| System tray | Background playback controls, show/quit actions |
| Titlebar theming | IPC bridge syncs window chrome color with active UI palette |
| Encryption key | Auto-generated per-machine key for token encryption at rest |
| Data isolation | User data stored in `~/.sonance/data/` (DB, covers, waveforms) |

## Prerequisites

- **Node.js** 18+
- **Java 21** (for dev mode — uses system `java`; packaged build bundles its own JRE)
- **Maven** (to build the server JAR)
- The server JAR must exist at `../sonance-server/target/sonance-server*.jar`

## Development

```bash
# Start Vite dev server + Electron (hot reload)
npm run dev

# Or start Electron alone (requires Vite already running on :17381)
npm start
```

In dev mode:
- Loads UI from `http://localhost:17381` (Vite)
- Does NOT start the sidecar (expects server running separately)
- Opens DevTools detached

### Desktop profile simulation

```bash
# Force sidecar startup even outside packaged mode
npm run start:desktop
```

## Building the Package

### 1. Download JRE

```powershell
npm run download-jre
```

Downloads Adoptium JRE 21 (Windows x64) into `./jre/`. This gets bundled as an extraResource.

### 2. Build the full app

```bash
npm run build:app
```

Runs the build pipeline:
1. Builds React frontend (`sonance-ui`)
2. Copies dist to Spring Boot `static/` resources
3. Runs `mvn package -DskipTests`
4. Copies final JAR to `target/sonance-server.jar`

### 3. Package with electron-builder

```bash
npm run dist
```

Produces:
- `dist/win-unpacked/Sonance.exe` — portable executable (~180 MB)
- `dist/Sonance Setup *.exe` — NSIS installer

### All-in-one

```bash
npm run download-jre && npm run dist
```

## Packaged Layout

```
Sonance.exe
├── resources/
│   ├── server/sonance-server.jar    (Spring Boot + embedded frontend)
│   └── jre/                         (Adoptium JRE 21)
├── main.js, preload.js, sidecar.js
└── loading.html
```

## Window Configuration

| Property | Value |
|----------|-------|
| Default size | 1400 × 900 |
| Minimum size | 900 × 600 |
| Title bar | Hidden (Windows overlay with themed colors) |
| Background | `#0a0a0f` |

## IPC Bridge (preload.js)

Exposed to renderer as `window.electronAPI`:

```typescript
interface ElectronAPI {
  platform: string;
  onMediaKey: (callback: (key: string) => void) => void;
  setTitleBarColors: (bgColor: string, symbolColor: string) => void;
}
```

## Data Paths

| Path | Contents |
|------|----------|
| `~/.sonance/data/` | H2 database, cover art cache, waveform cache |
| `%APPDATA%/Sonance/encryption.key` | Token encryption key (auto-generated) |

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| App shows loading screen forever | Server JAR missing or Java not found | Run `npm run build:app` first, ensure JRE is downloaded |
| "Port 17380 still in use" | Zombie Java process from previous crash | Will auto-kill; if persistent, manually kill via Task Manager |
| White/blank window after load | Vite not running (dev mode) | Start Vite first: `cd ../sonance-ui && npm run dev` |
| Media keys not working | Another app captured global shortcuts | Close conflicting media key apps |
