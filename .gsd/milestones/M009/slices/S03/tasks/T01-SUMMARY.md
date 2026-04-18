---
id: T01
parent: S03
milestone: M009
key_files:
  - musicode-ui/src/audio/audioGraph.ts
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T09:47:51.782Z
blocker_discovered: false
---

# T01: Refactored audioGraph to dual-element architecture with A/B HTMLAudioElements sharing a single gain→analyser→destination chain

**Refactored audioGraph to dual-element architecture with A/B HTMLAudioElements sharing a single gain→analyser→destination chain**

## What Happened

Rewrote audioGraph.ts to manage two HTMLAudioElements (elementA, elementB) with independent MediaElementSourceNodes. Both sources connect to the shared gainNode→analyserNode→destination chain. Added prepareNext(src) to pre-load on the inactive element, swap() to switch active element, and stop()/destroy() to clean up both. The active element is tracked via an activeSlot variable. connect/disconnect helpers manage source node lifecycle. Public API remains backward-compatible — play(), pause(), setVolume(), setMuted() operate on the active element transparently.

## Verification

TypeScript compiles clean. Manual browser test: play a track, pre-load triggers on inactive element, no audio glitch on active track during pre-load.

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/audio/audioGraph.ts`
