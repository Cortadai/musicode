---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T02: Add useOnlineStatus hook and offline banner

Create a hook that detects online/offline status via navigator.onLine + event listeners. Add a non-intrusive offline banner that appears when the server is unreachable.

## Inputs

- `App.tsx layout structure`

## Expected Output

- `useOnlineStatus hook`
- `OfflineBanner component`
- `App.tsx integration`

## Verification

Banner appears when network is toggled offline in DevTools, disappears when back online
