# M020: Prism Analyzer Deck

## Vision
A collapsible horizontal analyzer deck between TopBar and main content, hosting 7 audiophile-grade Canvas 2D visualizers (Spectrum Analyzer, Oscilloscope, Vectorscope, Spectrogram, Waveform, VU Meter, LUFS Meter) powered by Web Audio API. Each scope renders real-time audio data during playback, with an editor panel for activating/deactivating scopes, reordering, and resizing. Configuration auto-saves to localStorage. All three themes (Novatouch, Evolved, Minimal) get native-feeling styling via theme tokens.

## Slice Overview
| ID | Slice | Risk | Depends | Done | After this |
|----|-------|------|---------|------|------------|
| S01 | Audio Pipeline + Deck Shell + Spectrum Analyzer | high | — | ⬜ | User plays a track, toggles the analyzer deck visible via a button, and sees a Spectrum Analyzer rendering real-time FFT data with heatmap coloring. Deck collapses and expands. Flat lines when paused. |
| S02 | Oscilloscope + Vectorscope | medium | S01 | ⬜ | Three scopes visible in the deck simultaneously — Spectrum, Oscilloscope with stable triggered waveform, and Vectorscope in Lissajous mode. User can see stereo correlation in the vectorscope. |
| S03 | Spectrogram + Waveform | low | S01 | ⬜ | Five scopes available. Spectrogram shows scrolling frequency-time heatmap with mel/log scale. Waveform shows scrolling amplitude over time. |
| S04 | VU Meter + LUFS Meter | medium | S01 | ⬜ | All 7 scopes available in the deck. VU shows needle/bar with peak hold. LUFS shows integrated loudness value updating in real time. |
| S05 | Deck Editor + Theme Integration | medium | S01 | ⬜ | User opens edit mode, activates/deactivates scopes via checkboxes, reorders with arrow buttons, resizes scope proportions with drag handles. Changes persist after page reload. Deck looks styled correctly in all 3 themes. |
| S06 | Integration Polish + Defaults | low | S02, S03, S04, S05 | ⬜ | Fresh user sees 3 default scopes (Spectrum, Oscilloscope, VU Meter). All 7 work together smoothly. Deck is idle when not playing. Smooth experience across all themes. |
