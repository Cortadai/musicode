---
id: S03
parent: M005
milestone: M005
provides:
  - (none)
requires:
  - slice: S01
    provides: globalAudio export for AudioContext connection
affects:
  []
key_files:
  - musicode-ui/src/hooks/useAudioAnalyser.ts
  - musicode-ui/src/components/player/Visualizer.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/src/index.css
key_decisions:
  - Canvas 2D over WebGL for simplicity
  - Lazy AudioContext init on user gesture
  - Module-level guard for createMediaElementSource
  - CSS-only micro-animations (no Framer Motion dependency)
patterns_established:
  - Lazy AudioContext init on user gesture (autoplay policy)
  - Module-level guard for createMediaElementSource
  - CSS-only micro-animations without animation library
  - requestAnimationFrame with Page Visibility pause
observability_surfaces:
  - console.debug [visualizer] for AudioContext creation and source connection
drill_down_paths:
  - .gsd/milestones/M005/slices/S03/tasks/T01-SUMMARY.md
  - .gsd/milestones/M005/slices/S03/tasks/T02-SUMMARY.md
  - .gsd/milestones/M005/slices/S03/tasks/T03-SUMMARY.md
duration: ""
verification_result: passed
completed_at: 2026-03-31T11:02:19.545Z
blocker_discovered: false
---

# S03: Spectrum Visualizer & Micro-animations

**Spectrum visualizer with indigo frequency bars + disc spin, slide-up, and cover fade animations.**

## What Happened

Built the audio spectrum visualizer and micro-animations. useAudioAnalyser hook manages AudioContext lifecycle with lazy initialization (deferred to user gesture for autoplay policy compliance) and a guarded createMediaElementSource call (once per Audio element, module-level flag). Visualizer component renders indigo frequency bars on Canvas 2D using requestAnimationFrame, pauses when not visible/playing/tab hidden, and scales for HiDPI displays. Integrated into PlayerBar with a BarChart3 toggle button. Three CSS micro-animations: PlayerBar slides up on first appearance, cover art in PlayerBar spins like a vinyl disc while playing (8s rotation, pauses when paused), AlbumCard covers fade in on load. All animations are CSS-only — no external animation library needed.

## Verification

npm run build + npm run test:coverage \u2014 both pass, no regressions.

## Requirements Advanced

- R010 — Real-time Canvas 2D frequency bars from Web Audio API AnalyserNode, toggleable from PlayerBar

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Deviations

None.

## Known Limitations

None.

## Follow-ups

Consider adding visualizer style options (waveform, circular) in a future milestone.

## Files Created/Modified

- `musicode-ui/src/hooks/useAudioAnalyser.ts` — AudioContext + AnalyserNode hook with lazy init
- `musicode-ui/src/components/player/Visualizer.tsx` — Canvas 2D frequency bar visualizer
- `musicode-ui/src/components/player/PlayerBar.tsx` — Visualizer toggle, disc spin, slide-up, AudioContext init on gesture
- `musicode-ui/src/components/library/AlbumCard.tsx` — Cover art fade-in on load
- `musicode-ui/src/index.css` — Slide-up and cover-fade CSS animations
