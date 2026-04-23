---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: Extract TrackInfo component

Extract cover sleeve, vinyl disc animation, track title and artist link into TrackInfo.tsx. Props: currentTrack, isPlaying, albumId, hasCover.

## Inputs

- `PlayerBar.tsx lines 190-264`

## Expected Output

- `TrackInfo.tsx ~80 LOC`
- `PlayerBar.tsx reduced by ~75 LOC`

## Verification

tsc --noEmit passes. TrackInfo renders cover art, vinyl animation, and track metadata.
