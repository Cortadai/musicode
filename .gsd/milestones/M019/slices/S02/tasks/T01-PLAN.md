---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T01: HomePage scaffold — route, greeting, stats cards

Create HomePage component with time-of-day greeting (Good morning/afternoon/evening, {username}), 4 stats summary cards (total plays, listening time, unique artists, unique albums) using /stats/summary endpoint, and wire the / route to HomePage instead of AlbumsPage. Stats cards use glassmorphism tokens (glass background, border, blur). Responsive grid: 2 cols mobile, 4 cols desktop.

## Inputs

- `musicode-ui/src/api/stats.ts (getSummary)`
- `musicode-ui/src/pages/StatsPage.tsx (card pattern reference)`
- `musicode-ui/src/index.css (glassmorphism tokens)`

## Expected Output

- `HomePage.tsx with greeting + stats grid`
- `/ route points to HomePage`

## Verification

Page loads at /, greeting reflects time of day, 4 stats cards render with real data, CSS variables used throughout, TypeScript compiles clean.
