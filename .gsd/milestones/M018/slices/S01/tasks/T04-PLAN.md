---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T04: Cassette label and player integration

Render the cassette label inside the body using canvas text (or DOM overlay for better typography). Label shows: 'MUSICODE' brand top-left, 'C-90' duration badge, track title in typewriter font, artist and album below. Wire CassetteCanvas into RetroMode shell with full player state: currentTime/duration drives progress, isPlaying drives animation, track change updates label with crossfade. Add basic transport controls below the cassette (reuse TransportControls component).

## Inputs

- `currentTrack from usePlayer`
- `TransportControls component`
- `Google Fonts or system monospace for typewriter feel`

## Expected Output

- `CassetteCanvas.tsx — label rendering with track metadata`
- `RetroMode.tsx — full integration with player state and transport controls`

## Verification

Label shows current track info, transport controls work, track changes update label, tsc clean
