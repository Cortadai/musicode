---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: Frontend AbortController on unmount

Add AbortController to the axios client.ts interceptor. Each request gets a signal. Create a useAbortOnUnmount hook or integrate with React Query's signal. Verify components that use manual fetch (non-React-Query) cancel on unmount. Key targets: PlayerContext play reporting, any manual API calls outside React Query.

## Inputs

- `Current client.ts`
- `Current PlayerContext.tsx`

## Expected Output

- `AbortController integration in manual API calls`
- `useEffect cleanup cancels in-flight requests`
- `Build passes clean`

## Verification

React Query already handles abort. Manual fetch calls use AbortController. No console warnings about state updates on unmounted components. npm run build succeeds.
