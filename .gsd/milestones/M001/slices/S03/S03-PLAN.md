# S03: React UI Shell + Library Pages

**Goal:** Functional React frontend with dark theme, routing, API client, and all library browsing pages connected to the real backend API.
**Demo:** After this: Browse the full music library in the browser: album grid with covers, track lists, artist pages, search, and settings with folder management.

## Tasks
- [x] **T01: React project scaffolded with Tailwind, TanStack Query, and typed API client layer.** — Scaffold React + Vite + TypeScript project. Install deps: tailwindcss, react-router, @tanstack/react-query, axios, lucide-react. Configure Tailwind with dark theme. Create API client with axios base config pointing at localhost:8080. Define TypeScript interfaces for Track, Album, Artist, SearchResults matching the backend JSON.

Steps:
1. npm create vite@latest musicode-ui -- --template react-ts
2. Install deps: tailwindcss @tailwindcss/vite react-router @tanstack/react-query axios lucide-react
3. Configure Tailwind
4. Create src/api/client.ts with axios baseURL
5. Create src/types/index.ts with all interfaces
6. Create src/api/ modules: tracks.ts, albums.ts, artists.ts, search.ts, library.ts
7. Verify dev server starts
  - Estimate: 45m
  - Files: musicode-ui/package.json, musicode-ui/vite.config.ts, musicode-ui/tailwind.config.js, musicode-ui/src/api/client.ts, musicode-ui/src/types/index.ts, musicode-ui/src/api/tracks.ts, musicode-ui/src/api/albums.ts, musicode-ui/src/api/artists.ts, musicode-ui/src/api/search.ts, musicode-ui/src/api/library.ts
  - Verify: cd musicode-ui && npm run dev — dev server starts on :5173 without errors
- [x] **T02: App shell with sidebar navigation, search bar, and full routing.** — Create the app shell layout: sidebar with navigation links (Albums, Artists, Tracks, Search, Settings), top bar with search input, and main content area. Set up React Router with routes for all pages (placeholder components). Apply dark theme styling.

Steps:
1. Create layout components: AppShell, Sidebar, TopBar
2. Set up React Router with routes
3. Create placeholder page components
4. Style with Tailwind dark theme
5. Verify navigation works between pages
  - Estimate: 1h
  - Files: musicode-ui/src/App.tsx, musicode-ui/src/components/layout/AppShell.tsx, musicode-ui/src/components/layout/Sidebar.tsx, musicode-ui/src/components/layout/TopBar.tsx, musicode-ui/src/pages/AlbumsPage.tsx, musicode-ui/src/pages/AlbumDetailPage.tsx, musicode-ui/src/pages/ArtistsPage.tsx, musicode-ui/src/pages/ArtistDetailPage.tsx, musicode-ui/src/pages/TracksPage.tsx, musicode-ui/src/pages/SearchPage.tsx, musicode-ui/src/pages/SettingsPage.tsx
  - Verify: Open http://localhost:5173 — dark themed shell with sidebar navigation. Click each nav link — routes change, page titles update.
- [x] **T03: Library pages — albums grid with covers, album detail, artists, tracks — all connected to real API.** — Implement the library browsing pages that connect to the real API: Albums grid with cover art, Album detail with track list, Artists list, Artist detail with albums, Tracks list. Use TanStack Query for data fetching.

Steps:
1. AlbumsPage: fetch /api/albums, render grid of album cards with cover art from /api/covers/{albumId}
2. AlbumDetailPage: fetch /api/albums/{id}, show album info + track list
3. ArtistsPage: fetch /api/artists, render artist list
4. ArtistDetailPage: fetch /api/artists/{id}, show artist info + album cards
5. TracksPage: fetch /api/tracks, render scrollable track list
6. Create reusable components: AlbumCard, TrackList
7. Verify all pages load real data
  - Estimate: 1.5h
  - Files: musicode-ui/src/pages/AlbumsPage.tsx, musicode-ui/src/pages/AlbumDetailPage.tsx, musicode-ui/src/pages/ArtistsPage.tsx, musicode-ui/src/pages/ArtistDetailPage.tsx, musicode-ui/src/pages/TracksPage.tsx, musicode-ui/src/components/library/AlbumCard.tsx, musicode-ui/src/components/library/TrackList.tsx
  - Verify: Open albums page — grid of album cards with cover art images. Click album — detail page shows tracks. Artists page lists artists. Tracks page shows all tracks.
- [x] **T04: Search page with grouped results and Settings page with folder management and scan trigger.** — Implement Search page and Settings page. Search queries /api/search?q= and shows results grouped by tracks/albums/artists. Settings manages library folders (add/remove) and triggers scan.

Steps:
1. SearchPage: search input, fetch /api/search?q=, display grouped results
2. SettingsPage: fetch /api/library/folders, add folder form, delete button, scan trigger with status polling
3. Wire TopBar search input to navigate to search page
4. Verify search works with real data, folder management works
  - Estimate: 1h
  - Files: musicode-ui/src/pages/SearchPage.tsx, musicode-ui/src/pages/SettingsPage.tsx, musicode-ui/src/components/layout/TopBar.tsx
  - Verify: Search for 'dark' — results show matching tracks. Settings page shows folders, can add new folder path, trigger scan, see scan complete.
