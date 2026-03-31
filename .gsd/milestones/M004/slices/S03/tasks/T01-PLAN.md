---
estimated_steps: 1
estimated_files: 10
skills_used: []
---

# T01: ErrorBoundary + ErrorMessage + error utility

Create utils/errors.ts with getErrorMessage(error): extracts error.response.data.error (backend ErrorResponse format), falls back to error.message, then generic string. Create components/common/ErrorMessage.tsx: displays error icon, message text, optional detail, optional retry button. Accepts message (string), detail (string optional), onRetry (function optional). Create components/common/ErrorBoundary.tsx: React class component with componentDidCatch, renders fallback UI with reload button when a child component crashes. Update App.tsx to wrap with ErrorBoundary. Update all pages (AlbumsPage, ArtistsPage, TracksPage, SearchPage, SettingsPage, UsersPage) to use ErrorMessage instead of inline error strings.

## Inputs

- `Current page components`
- `Backend ErrorResponse format`

## Expected Output

- `utils/errors.ts`
- `components/common/ErrorMessage.tsx`
- `components/common/ErrorBoundary.tsx`
- `Updated App.tsx and pages`

## Verification

npm run build compiles cleanly
