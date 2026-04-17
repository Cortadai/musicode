---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: React.lazy route splitting + Vite manual chunks

Add React.lazy + Suspense for all route-level pages. Configure Vite manualChunks to split vendor libraries (recharts, react-dom, etc.) into separate bundles. Add loading fallback component.

## Inputs

- `existing route definitions in App.tsx`

## Expected Output

- `musicode-ui/src/App.tsx`
- `musicode-ui/vite.config.ts`

## Verification

npm run build shows split chunks. Route navigation shows brief loading on first visit.
