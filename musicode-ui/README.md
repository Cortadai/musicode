# Musicode UI

React frontend for Musicode. Browse your music library, play tracks with full player controls, manage users (admin), and authenticate — all in a dark-themed SPA.

## Tech Stack

- React 19 + TypeScript
- Vite 8 (dev server + build)
- Tailwind CSS v4
- TanStack Query (server state)
- Axios (API client with auth interceptor)
- Lucide React (icons)
- Vitest + v8 coverage

## Running

```bash
npm install
npm run dev        # Dev server on http://localhost:5173
npm run build      # Production build to dist/
npm run preview    # Preview production build
npm test           # Run tests
npm run test:coverage  # Tests with coverage thresholds
```

The dev server proxies `/api` requests to `http://localhost:8080` (Spring Boot).

## Pages

| Route | Component | Auth |
|---|---|---|
| `/login` | LoginPage | public |
| `/` | AlbumsPage | any |
| `/albums/:id` | AlbumDetailPage | any |
| `/artists` | ArtistsPage | any |
| `/artists/:id` | ArtistDetailPage | any |
| `/tracks` | TracksPage | any |
| `/search` | SearchPage | any |
| `/settings` | SettingsPage | ADMIN |
| `/users` | UsersPage | ADMIN |

## Auth Flow

1. Browser opens app → `AuthContext` calls `GET /api/auth/me` to check existing session
2. No session → redirect to `/login`
3. Login form → `POST /api/auth/login` → server sets HttpOnly cookies → redirect to `/`
4. Subsequent API calls include cookies automatically (axios `withCredentials: true`)
5. On 401 → axios interceptor attempts `POST /api/auth/refresh` → retries original request
6. Concurrent 401s queue behind a single refresh call to prevent race conditions
7. Refresh fails → redirect to `/login`

## Project Structure

```
src/
├── api/              API functions + axios client with auth interceptor
├── components/
│   ├── auth/         ProtectedRoute
│   ├── common/       Spinner, ErrorMessage, ErrorBoundary
│   ├── layout/       AppShell, Sidebar, TopBar
│   ├── library/      AlbumCard, TrackList
│   └── player/       PlayerBar
├── context/
│   ├── AuthContext    User session state (login/logout/restore)
│   └── PlayerContext  Player state (useReducer + dual contexts)
├── hooks/
│   ├── usePlayer        Singleton Audio element + dispatch bridge + Media Session
│   └── useAudioAnalyser Web Audio API analyser for spectrum visualizer
├── pages/            Route components
├── types/            TypeScript interfaces
└── utils/
    ├── errors.ts     Error extraction utility
    └── format.ts     Duration formatting
```

## Key Patterns

### Player Architecture
- **Singleton Audio element** at module level — survives component unmounts
- **useReducer** for atomic state transitions (track + queue + index change together)
- **Dual contexts** (state + dispatch) — prevents unnecessary re-renders
- **Symbol owner pattern** — ensures only one `usePlayer` instance wires audio events

### Error Handling
- **ErrorBoundary** wraps entire app — catches runtime crashes, shows reload UI
- **ErrorMessage** component with optional retry button — replaces inline error strings
- **getErrorMessage()** extracts backend `ErrorResponse.error` field or provides fallback

### Auth
- Cookies managed by browser — frontend never sees tokens directly
- Axios interceptor handles transparent refresh with request queuing
- `useAuth()` provides `isAdmin` for conditional UI rendering

## Tests

```bash
npm run test:coverage
```

Coverage thresholds enforced on `context/` and `utils/` (lines ≥80%, branches ≥80%, functions ≥50%).

Components, pages, hooks, and API layer excluded from thresholds — tested via integration.
auses rendering when tab is hidden

### Auth
- Cookies managed by browser — frontend never sees tokens directly
- Axios interceptor handles transparent refresh with request queuing
- `useAuth()` provides `isAdmin` for conditional UI rendering

## Tests

```bash
npm run test:coverage
```

Coverage thresholds enforced on `context/` and `utils/` (lines ≥80%, branches ≥80%, functions ≥50%).

Components, pages, hooks, and API layer excluded from thresholds — tested via integration.
