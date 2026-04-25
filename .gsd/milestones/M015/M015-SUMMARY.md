---
id: M015
title: "Synchronized Lyrics"
status: complete
completed_at: 2026-04-25T15:47:06.243Z
key_decisions:
  - Lazy fetch over scan-time: avoids slowing library scan for 877 tracks
  - Cache NOT_FOUND to avoid repeated API hits, with manual retry option
  - CSS Grid slide-in animation (1fr 0fr → 1fr 1fr) for smooth panel reveal
  - Fixed-frame layout (py-12) so lyrics panel has consistent margins regardless of scroll
key_files:
  - musicode-server/src/main/java/com/musicode/service/LyricsService.java
  - musicode-server/src/main/java/com/musicode/controller/LyricsController.java
  - musicode-ui/src/components/player/LyricsPanel.tsx
  - musicode-ui/src/components/player/NowPlayingOverlay.tsx
  - musicode-ui/src/utils/lrcParser.ts
lessons_learned:
  - LRCLIB.net /api/get requires exact match — search fallback could improve hit rate for mismatched metadata
  - CSS Grid grid-template-columns transitions are smoother than width/transform for panel reveals
  - User scroll detection (wheel/touch events + timeout) is essential for auto-scroll UX — without it, manual browsing fights the auto-scroll
---

# M015: Synchronized Lyrics

**LRCLIB.net lyrics integration with synced highlighting, slide-in panel, and DB caching**

## What Happened

Built end-to-end synchronized lyrics feature. Backend lazily fetches from LRCLIB.net on first access and caches results (synced, plain, instrumental, not-found) in the Track entity via new Flyway V2 migration. Frontend LyricsPanel highlights the active line and auto-scrolls, with fallbacks for plain lyrics, instrumental tracks, and not-found with retry. Integrated into NowPlayingOverlay with a mic toggle button that triggers a smooth CSS Grid slide-in animation (300ms). The lyrics panel uses a fixed-frame layout so top/bottom margins stay visible during scroll. Tested with Queen (synced lyrics work perfectly) and niche artists (correct not-found behavior).

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

None.

## Follow-ups

None.
