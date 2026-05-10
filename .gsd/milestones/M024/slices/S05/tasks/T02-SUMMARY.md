---
id: T02
parent: S05
milestone: M024
key_files:
  - musicode-ui/src/hooks/useOnlineStatus.ts
  - musicode-ui/src/components/common/OfflineBanner.tsx
  - musicode-ui/src/App.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-10T08:36:27.107Z
blocker_discovered: false
---

# T02: Added useOnlineStatus hook (useSyncExternalStore) and OfflineBanner component with amber alert bar

**Added useOnlineStatus hook (useSyncExternalStore) and OfflineBanner component with amber alert bar**

## What Happened

Created `useOnlineStatus` hook using React 18's `useSyncExternalStore` for tear-free online/offline detection via navigator.onLine + window events. Added `OfflineBanner` component with fixed-top amber bar, WifiOff icon, and role=alert for screen reader announcement. Integrated into App.tsx inside BrowserRouter.

## Verification

TypeScript compiles clean, 232 tests pass, banner renders conditionally based on online status

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npx tsc --noEmit` | 0 | pass | 5000ms |
| 2 | `npx vitest run` | 0 | pass — 232 tests | 4900ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/hooks/useOnlineStatus.ts`
- `musicode-ui/src/components/common/OfflineBanner.tsx`
- `musicode-ui/src/App.tsx`
