# M010: Audio Experience: Crossfade, EQ & Visualizer

## Vision
Extender el pipeline de audio con funcionalidades audiophile opcionales — crossfade entre pistas, ecualizador de 5 bandas, y modos de visualización expandibles. Todo opt-in, desactivado por defecto.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | high | — | ✅ | User enables crossfade slider (e.g. 5s), plays an album — tracks transition with audible overlap. With slider at 0, gapless swap from M009 works unchanged. |
| S02 | S02 | medium | — | ✅ | User enables EQ, adjusts bass slider up — audio sounds bassier. Disables EQ — audio returns to flat. Preferences survive F5. |
| S03 | S03 | medium | — | ✅ | User clicks visualizer toggle — panel expands with CSS animation. User switches between bars, waveform, and spectrogram modes. Panel collapses with reverse animation. |
