# M015: Synchronized Lyrics

## Vision
Display synchronized lyrics from LRCLIB.net alongside now-playing, with auto-scroll highlighting and DB caching. Plain lyrics fallback for tracks without timing data.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | low | — | ✅ | GET /api/lyrics/{trackId} returns cached synced/plain lyrics from LRCLIB |
| S02 | S02 | medium | — | ✅ | Playing a track shows synced lyrics with auto-scroll highlighting in NowPlayingOverlay |
