---
id: T04
parent: S01
milestone: M012
key_files:
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/hooks/useScrobble.ts
  - musicode-ui/src/hooks/useMediaSession.ts
  - musicode-ui/src/hooks/useGapless.ts
key_decisions:
  - Changed isOwner from useRef to useState — child hooks need a re-render when ownership is claimed, not just a ref mutation
duration: 
verification_result: passed
completed_at: 2026-04-18T18:27:54.669Z
blocker_discovered: false
---

# T04: Refactored usePlayer to 190 LOC orchestrator composing 3 extracted hooks

**Refactored usePlayer to 190 LOC orchestrator composing 3 extracted hooks**

## What Happened

Rewrote usePlayer as a thin orchestrator that composes useScrobble, useMediaSession, and useGapless. Changed ownership tracking from useRef to useState so child hooks re-render when ownership is claimed (fixing a timing bug where isOwner.current was read at render time before the effect set it). Public API unchanged — all 5 consumers (AppShell, PlayerBar, SearchPage, AlbumDetailPage, TracksPage) needed zero changes. 418 LOC → 190 LOC (55% reduction). Slightly over the 150 target because the public API callbacks (~50 LOC) are irreducible.

## Verification

vitest --run: 109/109 pass. tsc --noEmit: clean. wc -l usePlayer.ts: 190. No import changes in any consumer file.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest --run` | 0 | pass | 3000ms |
| 2 | `npx tsc --noEmit` | 0 | pass | 5000ms |

## Deviations

usePlayer.ts is 190 LOC instead of target 150. The ~40 LOC over target is the public API surface (playTrack, playAlbum, pause, resume, next, prev, seek, setVolume, toggleShuffle, toggleRepeat) which cannot be extracted without changing the hook's contract.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/usePlayer.ts`
- `musicode-ui/src/hooks/useScrobble.ts`
- `musicode-ui/src/hooks/useMediaSession.ts`
- `musicode-ui/src/hooks/useGapless.ts`
