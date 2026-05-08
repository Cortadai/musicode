---
id: M020
title: "Prism Analyzer Deck"
status: complete
completed_at: 2026-05-07T21:01:39.101Z
key_decisions:
  - Canvas 2D only — no WebGL or native dependencies
  - Dedicated AnalyserNode with FFT 4096 (separate from existing 256-size node)
  - Oscilloscope uses autocorrelation pitch-locked trigger inspired by Astra reference
  - Classic Bars added as 8th scope by user request, ported from NowPlaying visualizer
  - Default scopes: Classic Bars + Spectrum + Vectorscope
  - Deck height 170px for visual presence
  - Config version bumps force localStorage reset for safe migration
key_files:
  - musicode-ui/src/audio/analyzerDeckDataSource.ts
  - musicode-ui/src/hooks/useFrameScheduler.ts
  - musicode-ui/src/components/analyzer/AnalyzerDeck.tsx
  - musicode-ui/src/components/analyzer/DeckSettings.tsx
  - musicode-ui/src/stores/useDeckStore.ts
  - musicode-ui/src/components/analyzer/scopes/ClassicBars.ts
  - musicode-ui/src/components/analyzer/scopes/SpectrumAnalyzer.ts
  - musicode-ui/src/components/analyzer/scopes/Oscilloscope.ts
  - musicode-ui/src/components/analyzer/scopes/Vectorscope.ts
  - musicode-ui/src/components/analyzer/scopes/Spectrogram.ts
  - musicode-ui/src/components/analyzer/scopes/VUMeter.ts
  - musicode-ui/src/components/analyzer/scopes/LUFSMeter.ts
  - musicode-ui/src/components/analyzer/scopes/Waveform.ts
lessons_learned:
  - OffscreenCanvas with zero dimension throws DOMException that silently kills rAF loop — guard with minimum size check
  - DPR-aware rendering: create OffscreenCanvas at w*dpr × h*dpr, apply ctx.scale(dpr, dpr), draw at CSS coordinates
  - Autocorrelation pitch detection stabilizes oscilloscope display significantly vs raw zero-crossing trigger
  - Classic Bars: 32 log-spaced bars with low opacity integrates better than many thin linear bars at full opacity
---

# M020: Prism Analyzer Deck

**Collapsible analyzer deck with 8 real-time Canvas 2D audio visualizer scopes, settings UI, and 3-theme integration**

## What Happened

Built a full audio analyzer deck from scratch: shared AnalyzerDeckDataSource (FFT 4096), useFrameScheduler rAF hook, collapsible AnalyzerDeck container, and 8 Canvas 2D scopes — Classic Bars, Spectrum Analyzer (log scale, heatmap, dB grid), Oscilloscope (pitch-locked trigger, speed control), Vectorscope (Lissajous stereo), Spectrogram (scrolling heatmap), VU Meter (peak hold), LUFS Meter (integrated loudness), and Waveform (scrolling amplitude, speed control). DeckSettings UI with per-scope options. All scopes use OffscreenCanvas grid caching, theme-aware colors via CSS custom properties, and DPR-aware rendering. Configuration persists to localStorage with version migration. Integrated into TopBar and PlayerBar across all 3 themes (Novatouch, Evolved, Minimal). Originally planned for 7 scopes; Classic Bars added by user request as 8th scope ported from the NowPlaying overlay.

## Success Criteria Results



## Definition of Done Results



## Requirement Outcomes



## Deviations

Delivered 8 scopes instead of planned 7 — Classic Bars added by user request. Deck height changed from 100px to 170px during polish. Default scopes changed from Spectrum+Oscilloscope+VU to Classic Bars+Spectrum+Vectorscope.

## Follow-ups

None.
