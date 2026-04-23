---
id: T01
parent: S01
milestone: M013
key_files:
  - musicode-ui/src/audio/colorExtraction.ts
  - musicode-ui/src/audio/colorExtraction.test.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T19:28:23.731Z
blocker_discovered: false
---

# T01: Canvas-based color extraction utility with caching and brightness normalization

**Canvas-based color extraction utility with caching and brightness normalization**

## What Happened

Created colorExtraction.ts: loads album artwork into 64x64 offscreen canvas, quantizes pixels into buckets (32-step per channel), sorts by frequency, picks top 2 colors. Brightness adjusted to 105-185 range for contrast. Background derived by darkening primary at 20%. Results cached in module-level Map by albumId. Fallback palette uses existing indigo-400/zinc-900 theme colors when extraction fails.

## Verification

5 unit tests pass: uniform image extraction, cache hit, image load failure fallback, all-black image fallback, getCachedPalette for unknown ID

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest --run src/audio/colorExtraction.test.ts` | 0 | 5 tests pass | 1470ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/audio/colorExtraction.ts`
- `musicode-ui/src/audio/colorExtraction.test.ts`
