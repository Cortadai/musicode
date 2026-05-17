# M028: Video Backgrounds

## Vision
User-provided video loops as a cinematic background mode in NowPlaying. Videos are served from a configured folder, streamed via backend, and displayed behind a minimal floating UI (Layout A — cinematic bottom). Users can cycle videos independently of track playback.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Video Backend — Folder Config & Streaming | high | — | ⬜ | curl GET /api/videos returns file list; curl with Range header streams video fragment correctly |
| S02 | Settings UI — Video Folder & Toggle | medium | S01 | ⬜ | User selects folder in Settings, toggle appears, video list populates |
| S03 | NowPlaying Video Mode — Layout A | medium | S01, S02 | ⬜ | User cycles to video mode, video plays fullscreen behind floating bottom bar with track info and controls |
| S04 | Video Navigation — Prev/Next & Persistence | low | S03 | ⬜ | Click next-video arrow, video changes while same song plays; change track, video continues uninterrupted |
