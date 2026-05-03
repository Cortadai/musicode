---
id: M018
title: "Cassette Deck — Retro Mode"
status: complete
completed_at: 2026-04-27T20:00:00.000Z
key_decisions:
  - Canvas 2D for all rendering (no WebGL dependency)
  - Physical tape physics with angular velocity simulation
  - Dual VU meters driven by existing AnalyserNode
  - Synthwave neon glow with album-derived colors
  - 5th mode in NowPlayingOverlay (cassette alongside existing visualizers)
key_files:
  - musicode-ui/src/components/player/CassetteDeck.tsx
  - musicode-ui/src/components/player/NowPlayingOverlay.tsx
lessons_learned:
  - Canvas requestAnimationFrame cleanup is critical to avoid memory leaks on unmount
  - Album color extraction provides effective dynamic theming for visualizers
---

# M018: Cassette Deck — Retro Mode

**Full-screen cassette deck visualizer with tape physics, VU meters, and synthwave atmosphere**

## What Happened

M018 delivered a standalone cassette deck experience as the 5th visualization mode in the NowPlayingOverlay. Features include physically accurate reel rotation (angular velocity based on tape position), a moving tape path between reels, dual VU meters driven by the audio AnalyserNode, mechanical odometer, transport LED indicators, and full synthwave atmosphere with neon underglow tinted by album colors and CRT scanline overlay.

## Outcome

The cassette deck is the crown jewel visualizer — a fully interactive retro mode that responds to playback state and audio levels in real time. All four planned slices (canvas + physics, deck housing, atmosphere, tape audio filter) were delivered.
