# M002: 

## Vision
Clean up M001 rough edges, add missing playback features (shuffle, repeat, keyboard shortcuts), support all common audio formats, and add the navigation polish that makes the app feel complete. Cover art click navigates to album. Basic test coverage establishes quality baseline.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Fixes + Multi-format Scanner | medium | — | ✅ | Scanner processes a folder with mixed FLAC/MP3/OGG/M4A files. No duplicate tracks. Cover art paths consistent. |
| S02 | Player Polish — Shuffle, Repeat, Keyboard, Navigation | medium | S01 | ✅ | Click cover in player bar → navigates to album. Shuffle an album. Repeat a track. Use Space/arrows to control playback. |
| S03 | Test Suite Foundation | low | S01, S02 | ✅ | npm test and mvn test both pass with meaningful coverage of core features. |
| S04 | Coverage enforcement — JaCoCo + Vitest thresholds at 80% | low | S03 | ✅ | mvn verify and npm test --coverage both enforce 80% line coverage. Build fails if coverage drops below. |
