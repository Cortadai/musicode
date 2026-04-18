---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Migrate usePlayer.ts and eliminate useAudioAnalyser.ts

Refactor usePlayer.ts to delegate all audio operations to audioGraph instead of accessing globalAudio directly. Remove the globalAudio export. Replace globalAudio.src/load/play/pause/currentTime/volume with audioGraph equivalents. Wire event handlers (timeupdate, ended, loadedmetadata) through audioGraph callbacks instead of addEventListener on globalAudio. Media Session seekto uses audioGraph.seek(). Volume sync effect uses audioGraph.setVolume(). Delete useAudioAnalyser.ts entirely — its functionality is absorbed by audioGraph. Create a thin useAudioAnalyser replacement hook or direct import that returns audioGraph.getAnalyser().

## Inputs

- `T01 audioGraph.ts API`
- `Current usePlayer.ts (285 lines, 11 action types)`
- `Current useAudioAnalyser.ts (83 lines)`

## Expected Output

- `usePlayer.ts uses audioGraph for all audio operations`
- `useAudioAnalyser.ts deleted`
- `No globalAudio export anywhere`
- `Build clean`

## Verification

Build succeeds with no TypeScript errors. No imports of globalAudio or old useAudioAnalyser remain in the codebase. grep confirms elimination.
