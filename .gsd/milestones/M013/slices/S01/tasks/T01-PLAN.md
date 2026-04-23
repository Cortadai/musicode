---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Color extraction utility

Create extractColors module: load album artwork into offscreen canvas (64x64), sample pixels, cluster to 2-3 dominant colors, adjust brightness for contrast. Cache results by albumId. Export async function extractColors(albumId) => Promise<ColorPalette>.

## Inputs

- `getCoverUrl from api/albums`

## Expected Output

- `colorExtraction.ts with extractColors + ColorPalette type`

## Verification

Unit tests: known color image produces expected palette, cache hit skips re-extraction, missing image returns fallback colors
