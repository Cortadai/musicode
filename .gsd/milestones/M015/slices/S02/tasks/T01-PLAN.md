---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: LRC parser utility + lyrics API hook

Create parseLrc utility that parses [mm:ss.xx] text lines into {time: number, text: string}[] array. Handle edge cases: empty lines, malformed timestamps, enhanced LRC format, BOM. Create useLyrics React hook that fetches from /api/lyrics/{trackId} on track change, exposes lyrics data + status + retry function.

## Inputs

- `LRC format specification`
- `Backend LyricsResponse shape`

## Expected Output

- `lrcParser.ts with parseLrc function`
- `useLyrics hook`
- `lyrics API client`

## Verification

TypeScript compiles. Parser correctly handles standard LRC samples, empty lines, and malformed input.
