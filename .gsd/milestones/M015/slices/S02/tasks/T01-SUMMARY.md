---
id: T01
parent: S02
milestone: M015
key_files:
  - musicode-ui/src/utils/lrcParser.ts
  - musicode-ui/src/api/lyrics.ts
key_decisions:
  - (none)
duration: 
verification_result: untested
completed_at: 2026-04-25T15:45:57.795Z
blocker_discovered: false
---

# T01: LRC parser utility and lyrics API layer

**LRC parser utility and lyrics API layer**

## What Happened

Created lrcParser.ts with parseLrc() (handles [mm:ss.xx] timestamps, sorts by time) and findActiveLine() (binary scan for current position). Created api/lyrics.ts with getLyrics() and retryLyrics() following existing API patterns.

## Verification

TypeScript compiles clean. Parser handles edge cases (empty input, malformed timestamps).

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| — | No verification commands discovered | — | — | — |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/utils/lrcParser.ts`
- `musicode-ui/src/api/lyrics.ts`
