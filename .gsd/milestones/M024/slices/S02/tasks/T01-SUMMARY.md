---
id: T01
parent: S02
milestone: M024
key_files:
  - musicode-ui/src/utils/lrcParser.test.ts
  - musicode-ui/src/utils/greetings.test.ts
  - musicode-ui/src/utils/artistAvatar.test.ts
  - musicode-ui/src/utils/format.test.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T08:17:03.675Z
blocker_discovered: false
---

# T01: Tests de utilidades puras: lrcParser, greetings, artistAvatar, format ampliado

**Tests de utilidades puras: lrcParser, greetings, artistAvatar, format ampliado**

## What Happened

Creados 3 archivos de test nuevos (lrcParser, greetings, artistAvatar) y ampliado format.test.ts con formatAlbumDuration. Total 37 tests nuevos cubriendo parsing LRC, findActiveLine, greeting selection con weighted pools, time-aware greetings, artist gradient determinism e initials extraction. Cobertura utils subió a >91%.

## Verification

vitest --run src/utils/ — 54 tests pass

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest --run src/utils/` | 0 | 54 tests pass across 5 test files | 1320ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/utils/lrcParser.test.ts`
- `musicode-ui/src/utils/greetings.test.ts`
- `musicode-ui/src/utils/artistAvatar.test.ts`
- `musicode-ui/src/utils/format.test.ts`
