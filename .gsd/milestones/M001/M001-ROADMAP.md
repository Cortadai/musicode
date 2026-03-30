# M001: 

## Vision
A working personal music player: scan a folder of FLACs, browse the library by artist/album/track with cover art, and play music from the browser with seek, queue, and a polished dark UI. Runs via Docker Compose on Windows 11.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Backend Foundation — Scan FLACs and Stream Audio | high | — | ✅ | Point browser at a test HTML page served by Spring Boot. Select a FLAC from the scanned library. Audio plays with working seek. |
| S02 | Browse API + Cover Art | medium | S01 | ⬜ | API calls via browser/curl return paginated tracks, albums with cover art URLs, artists, and search results. |
| S03 | React UI Shell + Library Pages | medium | S02 | ⬜ | Browse the full music library in the browser: album grid with covers, track lists, artist pages, search, and settings with folder management. |
| S04 | Player + Queue — Full Playback Experience | medium | S03 | ⬜ | Click any track in the library → audio plays in the persistent player bar. Seek, volume, next/prev, shuffle, and repeat all work. Playing an album queues all its tracks. |
| S05 | Polish + Docker Compose | low | S04 | ⬜ | docker-compose up on a clean Windows 11 machine → open localhost → full app works. UI has loading states, error handling, and empty states. Keyboard shortcuts work. |
