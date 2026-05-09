# M023: Pro Equalizer — Interactive Curve, Spectrum, Custom Presets

## Vision
Replace the minimal 5-band popover EQ with a full parametric equalizer: variable band count (5–10), filter types (peaking/shelf/pass), adjustable Q, preamp, interactive SVG frequency response curve with draggable handles, real-time post-EQ spectrum overlay, custom preset save/load, and AutoEQ import. The EQ becomes a dedicated panel accessible from the playbar, with a mini-preview curve in the compact popover.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | EQ Engine Upgrade | high | — | ✅ | Play a track, add/remove bands (up to 10), change filter types and Q via console or test harness — audio effect is audible and glitch-free. Preamp slider attenuates/boosts the signal. |
| S02 | Interactive SVG Frequency Response Curve | high | S01 | ✅ | Open EQ panel, see SVG curve reflecting current band settings. Drag band handles to adjust gain/frequency — curve updates in real time, audio changes correspondingly. |
| S03 | Real-time Spectrum Analyzer Overlay | medium | S02 | ✅ | Play a track with EQ panel open — see live spectrum overlay on the frequency response curve. Adjust EQ bands and observe the spectrum change in real time. |
| S04 | Custom Presets + Import/Export | low | S01 | ✅ | Save current EQ as custom preset, rename it, export to JSON. Import an AutoEQ .txt file — bands populate correctly. Delete a custom preset. |
| S05 | EQ Panel UI + Playbar Mini-Preview | medium | S02, S03, S04 | ✅ | Click EQ button in playbar — see mini SVG curve preview + 'Open Full EQ' button. Full panel shows curve with spectrum, band sliders with type/Q controls, preamp fader, preset management. |
