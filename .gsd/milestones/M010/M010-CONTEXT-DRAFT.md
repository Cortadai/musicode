# M010 — Audio Experience: Crossfade, EQ & Visualizer

## Objetivo
Extender el pipeline de audio de M009 con funcionalidades audiophile opcionales: crossfade entre pistas, ecualizador de 5 bandas, y modos de visualización expandibles. Todo opt-in, desactivado por defecto — "tu audio suena exactamente como antes hasta que tú decidas cambiarlo".

## Dependencias
- M009 completado (AudioGraph centralizado, dual HTMLAudioElement, gapless, localStorage preferences)

## Alcance confirmado

### Crossfade
- Opt-in, slider 0-12s, default off (D029)
- Mutuamente excluyente con gapless: crossfade > 0 usa fade overlap, crossfade === 0 usa gapless swap (D033)
- Graph: sourceA → gainA, sourceB → gainB → masterGain → analyser → destination (D031)
- Rampas con `linearRampToValueAtTime`

### EQ (Ecualizador)
- 5 bandas, opt-in, default flat (D029, D030)
- BiquadFilterNodes en serie entre masterGain y analyser (D032)
- Bypass cuando desactivado (disconnect/reconnect directo)

### Visualizer
- 3 modos: bars (actual), waveform, spectrogram (R023)
- Panel expandible con animación CSS grid-template-rows 0fr→1fr + opacity (D034)
- Sin modo full-screen en M010 (D035)

## Decisiones clave
- D029: Features audiophile opt-in, default off
- D030: EQ 5 bandas standard
- D031: Per-source gain nodes para crossfade
- D032: EQ en serie entre masterGain y analyser
- D033: Crossfade/gapless mutuamente excluyentes en runtime
- D034: Animación CSS puro, sin Framer Motion
- D035: Panel expandible sin full-screen

## Persistencia
- localStorage (resuelto en M009, D028)
- Nuevas keys: crossfadeDuration, eqEnabled, eqBands[], visualizerMode

## Slices previstas
1. S01 — Crossfade (alto riesgo — toca core del graph y lógica de swap)
2. S02 — EQ (medio — inserción limpia, UI self-contained)
3. S03 — Visualizer expandible (medio — analyser ya existe, mayormente UI/canvas)
