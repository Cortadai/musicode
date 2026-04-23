---
id: T03
parent: S04
milestone: M011
key_files:
  - musicode-ui/src/components/player/EqPopover.test.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-04-18T17:36:14.281Z
blocker_discovered: false
---

# T03: Tests for EqPopover — 13 tests with vi.mock for eqProcessor and audioPreferences

**Tests for EqPopover — 13 tests with vi.mock for eqProcessor and audioPreferences**

## What Happened

Mocked eqProcessor (singleton with Web Audio BiquadFilterNodes) and audioPreferences (localStorage). Tests cover: trigger label, dialog open/close, aria-expanded, toggle switch + eqProcessor.setEnabled call, 5 band sliders render, frequency labels, band gain change propagation, preset selector, preset change calling applyPreset, Escape dismiss, click-outside dismiss, aria-haspopup.

## Verification

npx vitest run --reporter=verbose — 13/13 pass

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx vitest run --reporter=verbose src/components/player/EqPopover.test.tsx` | 0 | 13/13 pass | 1490ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/player/EqPopover.test.tsx`
