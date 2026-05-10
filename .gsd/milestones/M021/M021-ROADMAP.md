# M021: Shell × Palette — Orthogonal Theme System

## Vision
Separate the current monolithic theme system into two independent axes: Shells (layout/structure) and Palettes (colors). Users pick a shell (evolved, nova, minimal) and a color palette (6 dark + 3 light) independently. This transforms 3 themes into 27 combinations, with each palette bringing a full look & feel change (backgrounds, accents, borders, status colors) without touching layout.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | S01 | medium | — | ✅ | Toggle between Indigo and Cobalt palettes on evolved shell — backgrounds and accents change, layout stays fixed. |
| S02 | S02 | low | — | ✅ | Cycle through all 6 dark palettes on any shell — each has a distinct, cohesive look. |
| S03 | S03 | high | — | ✅ | Switch from Indigo dark to Daylight light on evolved shell — full light-mode experience. |
| S04 | S04 | low | — | ✅ | Open Settings, pick a shell, pick a palette — both persist independently after page reload. |
