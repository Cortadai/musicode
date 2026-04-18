---
id: T02
parent: S01
milestone: M009
key_files:
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/hooks/useAudioAnalyser.ts
key_decisions:
  - Kept useAudioAnalyser.ts as thin wrapper instead of deleting — avoids changing import sites in PlayerBar/Visualizer (deferred to M010)
  - Owner tracking pattern (ownerSymbol) preserved to prevent duplicate event wiring from multiple usePlayer() consumers
duration: 
verification_result: passed
completed_at: 2026-04-18T08:39:47.410Z
blocker_discovered: false
---

# T02: Migrated usePlayer.ts to audioGraph and replaced useAudioAnalyser.ts with thin wrapper

**Migrated usePlayer.ts to audioGraph and replaced useAudioAnalyser.ts with thin wrapper**

## What Happened

Refactored `usePlayer.ts` to delegate all audio operations to `audioGraph` instead of the old `globalAudio` singleton. Replaced direct `globalAudio.src/load/play/pause/currentTime/volume` calls with `audioGraph.setSource/play/pause/seek/setVolume`. Event handlers (timeupdate, ended, loadedmetadata) wired via `audioGraph.setOnTimeUpdate/setOnEnded/setOnLoadedMetadata` callbacks instead of `addEventListener`. Media Session seekto uses `audioGraph.seek()`. Volume sync uses `audioGraph.setVolume()`. `globalAudio` export eliminated. `useAudioAnalyser.ts` gutted to a thin 35-line wrapper that delegates to `audioGraph.getAnalyser()` and re-exports `initAudioContext()` for backward compat. Marked with TODO(M010) for full removal.

## Verification

Build succeeds with zero TypeScript errors. No imports of old `globalAudio` remain in codebase (grep confirmed). `useAudioAnalyser.ts` reduced to thin delegation layer.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 8000ms |
| 2 | `grep -r 'globalAudio' musicode-ui/src/ --include='*.ts' --include='*.tsx' (no results outside comments)` | 0 | pass | 500ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/usePlayer.ts`
- `musicode-ui/src/hooks/useAudioAnalyser.ts`
