# S02: Home Page

**Goal:** Home page with dynamic greeting, horizontal scroll carousels (recently played, top albums, top artists), library stats mini-cards, and glassmorphism card styling — all using existing API endpoints.
**Demo:** Home page con saludo dinámico, carruseles de recently played/albums/artists con datos reales, stats de librería, glassmorphism cards con hover lift.

## Must-Haves

- HomePage renders at / with time-based greeting, 3 carousels with real data, 4 stats cards, glassmorphism styling. Visual parity across all 3 themes. No new backend endpoints needed.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [ ] **T01: HomePage scaffold — route, greeting, stats cards** `est:25min`
  Create HomePage component with time-of-day greeting (Good morning/afternoon/evening, {username}), 4 stats summary cards (total plays, listening time, unique artists, unique albums) using /stats/summary endpoint, and wire the / route to HomePage instead of AlbumsPage. Stats cards use glassmorphism tokens (glass background, border, blur). Responsive grid: 2 cols mobile, 4 cols desktop.
  - Files: `musicode-ui/src/pages/HomePage.tsx`, `musicode-ui/src/App.tsx`
  - Verify: Page loads at /, greeting reflects time of day, 4 stats cards render with real data, CSS variables used throughout, TypeScript compiles clean.

- [ ] **T02: Horizontal scroll carousels — recently played, top albums, top artists** `est:40min`
  Build a reusable Carousel component with horizontal scroll, snap behavior, and optional scroll arrows. Wire up 3 carousels on HomePage: (1) Recently Played using /activity/recent with album cover art, (2) Top Albums using /stats/top-albums with cover art, (3) Top Artists using /stats/top-artists. Each carousel item is a glassmorphism card with cover image, title, subtitle, and click navigation to detail page.
  - Files: `musicode-ui/src/components/home/Carousel.tsx`, `musicode-ui/src/components/home/CarouselCard.tsx`, `musicode-ui/src/pages/HomePage.tsx`
  - Verify: 3 carousels render with real data, horizontal scroll works with snap, cards show cover art, clicking navigates to detail page, responsive sizing, TypeScript compiles clean.

- [ ] **T03: Polish — hover effects, empty states, loading skeletons** `est:20min`
  Add hover lift effect to carousel cards (translateY + shadow), loading skeleton placeholders while data fetches, empty state messages when no data (new user with no plays). Add Home link to Sidebar navigation. Final visual verification across all 3 themes.
  - Files: `musicode-ui/src/pages/HomePage.tsx`, `musicode-ui/src/components/home/Carousel.tsx`, `musicode-ui/src/components/home/CarouselCard.tsx`, `musicode-ui/src/components/layout/Sidebar.tsx`
  - Verify: Hover lift animates smoothly, skeletons show during load, empty states display gracefully, Home link in sidebar navigates to /, visual check in all 3 themes.

## Files Likely Touched

- musicode-ui/src/pages/HomePage.tsx
- musicode-ui/src/App.tsx
- musicode-ui/src/components/home/Carousel.tsx
- musicode-ui/src/components/home/CarouselCard.tsx
- musicode-ui/src/components/layout/Sidebar.tsx
