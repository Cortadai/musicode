# S03: Frontend Error Handling, Logging & Comments

**Goal:** Add error resilience, diagnostic logging, and didactic comments to frontend
**Demo:** After this: After this: React app has ErrorBoundary catching runtime crashes. ErrorMessage component with retry. API errors extracted consistently. console.debug in auth and player flows. Didactic comments in key files.

## Tasks
- [x] **T01: ErrorBoundary + ErrorMessage + getErrorMessage utility — all 7 pages updated, build clean.** — Create utils/errors.ts with getErrorMessage(error): extracts error.response.data.error (backend ErrorResponse format), falls back to error.message, then generic string. Create components/common/ErrorMessage.tsx: displays error icon, message text, optional detail, optional retry button. Accepts message (string), detail (string optional), onRetry (function optional). Create components/common/ErrorBoundary.tsx: React class component with componentDidCatch, renders fallback UI with reload button when a child component crashes. Update App.tsx to wrap with ErrorBoundary. Update all pages (AlbumsPage, ArtistsPage, TracksPage, SearchPage, SettingsPage, UsersPage) to use ErrorMessage instead of inline error strings.
  - Estimate: 20min
  - Files: musicode-ui/src/utils/errors.ts, musicode-ui/src/components/common/ErrorMessage.tsx, musicode-ui/src/components/common/ErrorBoundary.tsx, musicode-ui/src/App.tsx, musicode-ui/src/pages/AlbumsPage.tsx, musicode-ui/src/pages/ArtistsPage.tsx, musicode-ui/src/pages/TracksPage.tsx, musicode-ui/src/pages/SearchPage.tsx, musicode-ui/src/pages/SettingsPage.tsx, musicode-ui/src/pages/UsersPage.tsx
  - Verify: npm run build compiles cleanly
- [x] **T02: console.debug in auth/player/axios + didactic comments + errors.test.ts — 40 tests green, coverage met.** — Add console.debug calls to: AuthContext (login success/fail, logout, session restore result), axios interceptor (refresh attempt, refresh success/fail, queue size), usePlayer (track change, playback error, audio source). Add didactic comments to: PlayerContext (why useReducer, why separate state/dispatch contexts, why shuffle preserves current track), usePlayer (why singleton Audio, why Symbol owner pattern, why sync effects), AuthContext (why getMe on mount, why catch-ignore on logout), axios interceptor (why queue, what happens without it, why skip login/refresh). Verify build compiles and tests pass.
  - Estimate: 20min
  - Files: musicode-ui/src/context/AuthContext.tsx, musicode-ui/src/api/client.ts, musicode-ui/src/hooks/usePlayer.ts, musicode-ui/src/context/PlayerContext.tsx
  - Verify: npm run build + npm run test:coverage — all pass
