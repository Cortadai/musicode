---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: Tests de componentes player con lógica

Tests para ProgressBar (seek, drag, display), VolumeControl, y TransportControls edge cases. Componentes con lógica de interacción testeable.

## Inputs

- `musicode-ui/src/components/player/ProgressBar.tsx`
- `musicode-ui/src/components/player/VolumeControl.tsx`

## Expected Output

- `Tests de ProgressBar y VolumeControl`
- `Cobertura player >35%`

## Verification

vitest --run src/components/player/ — todos pasan, cobertura player >35%
