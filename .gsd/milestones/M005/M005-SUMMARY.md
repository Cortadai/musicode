---
id: M005
title: "Reproductor Experience"
status: complete
completed_at: 2026-03-31T11:02:45.319Z
key_decisions:
  - Media Session with absolute URLs for artwork
  - Hand-written service worker over vite-plugin-pwa
  - Three caching strategies: network-first shell, cache-first covers, network-only API
  - Lazy AudioContext init on user gesture
  - Canvas 2D over WebGL for visualizer
  - CSS-only micro-animations (no Framer Motion)
  - globalAudio exported for AudioContext connection
key_files:
  - musicode-ui/src/hooks/usePlayer.ts
  - musicode-ui/src/hooks/useAudioAnalyser.ts
  - musicode-ui/src/components/player/Visualizer.tsx
  - musicode-ui/src/components/player/PlayerBar.tsx
  - musicode-ui/public/manifest.json
  - musicode-ui/public/sw.js
  - musicode-ui/src/index.css
lessons_learned:
  - Media Session API is trivial to integrate — 4 useEffects in existing hook, massive UX impact
  - createMediaElementSource is one-shot per element — module-level guard is essential
  - CSS-only animations (keyframes + inline style) cover 90% of animation needs without libs
  - Hand-written service worker is more educational and debuggable than plugin abstractions
---

# M005: Reproductor Experience

**Musicode elevated \u2014 media keys, PWA install, spectrum visualizer, and micro-animations, zero new dependencies.**

## What Happened

Transformed Musicode into a polished music player experience. S01 integrated Media Session API into usePlayer.ts \u2014 keyboard media keys control playback, OS shows now-playing overlay with track title, artist, and cover art, and the OS seek bar tracks playback position. S02 made the app installable as a PWA with manifest.json, placeholder icons, and a hand-written service worker caching app shell (network-first) and cover art (cache-first) while passing API calls through uncached. S03 added the spectrum visualizer: AudioContext with lazy init (autoplay policy safe), AnalyserNode connected to the singleton Audio element, Canvas 2D rendering indigo frequency bars at 60fps with Page Visibility awareness. Three CSS micro-animations bring visual polish: PlayerBar slides up on first track, cover art fades in on load, and album cover spins like vinyl while playing. No new dependencies added \u2014 all browser APIs and CSS.

## Success Criteria Results

- \u2705 Media keys control playback (play/pause/next/prev)\n- \u2705 OS shows now-playing with title, artist, cover art\n- \u2705 App installable as PWA with standalone window\n- \u2705 App shell cached for instant load\n- \u2705 Frequency spectrum bars render in real-time\n- \u2705 Visualizer toggleable from PlayerBar\n- \u2705 CSS micro-animations: slide-up, cover fade-in, disc spin\n- \u2705 No regressions on auth, playback, browse, streaming\n- \u2705 Build compiles and test thresholds maintained

## Definition of Done Results

- \u2705 All 3 slices complete with summaries\n- \u2705 npm run build compiles cleanly\n- \u2705 npm run test:coverage passes (40 tests, thresholds met)\n- \u2705 Media keys control playback\n- \u2705 App installable as PWA from browser\n- \u2705 Visualizer renders frequency bars during playback\n- \u2705 No regressions \u2014 all existing features work

## Requirement Outcomes

R010 (Spectrum Visualizer) \u2192 validated: Canvas 2D frequency bars from Web Audio API\nR011 (Media Session API) \u2192 validated: OS media keys, now-playing, seek bar\nR012 (PWA) \u2192 validated: manifest, service worker, standalone window

## Deviations

None.

## Follow-ups

None.
