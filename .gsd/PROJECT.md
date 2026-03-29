# Project

## What This Is

**Musicode** — a personal web-based music player for local audio files (FLAC, MP3, OGG, M4A). Spring Boot 3 backend scans configured folders, reads metadata with JAudioTagger, streams audio with HTTP Range support. React + Vite + TypeScript frontend provides a modern, minimal UI for browsing and playing a personal library. Runs in Docker Compose with embedded H2 database — zero external dependencies.

Think "my own VLC but prettier, in a browser, and personal."

## Core Value

**Play my local FLAC/MP3 files from a browser with proper seeking, metadata display, and cover art.** If scope shrinks, this survives: scan a folder, browse tracks/albums/artists, click play, hear audio with seek support.

## Current State

Greenfield. Two planning documents exist (`PLAN.md` with architecture, `personal-media-player-proyecto.md` with vision and research). No code yet. Single initial git commit.

## Architecture / Key Patterns

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite + TypeScript + Tailwind CSS | SPA, custom theme, TanStack Query for server state |
| Backend | Spring Boot 3 + Java 21 + Maven | REST API, async library scanning |
| Database | H2 (file mode, embedded) | Zero config, metadata cache |
| Metadata | JAudioTagger 3.x | ID3/Vorbis/MP4 tag reading |
| Audio | HTML5 `<audio>` element | FLAC natively supported in modern browsers |
| Icons | Lucide React | |
| Containers | Docker Compose | Mounts music folder read-only |

**Monorepo layout:**
- `musicode-server/` — Spring Boot backend
- `musicode-ui/` — React frontend

**Key technical patterns:**
- HTTP 206 Partial Content for audio seeking (Spring `ResourceRegion`)
- Async library scanning (`@Async` + `@EnableAsync`)
- Cover art extracted during scan, cached as JPG on disk
- `PlayerContext` with `useReducer` for global player state
- Entities: `Track` → `Album` → `Artist`, `LibraryFolder`

## Capability Contract

See `.gsd/REQUIREMENTS.md` for the explicit capability contract, requirement status, and coverage mapping.

## Milestone Sequence

- [ ] M001: Core MVP — Scan local music, browse library, stream and play audio in browser
