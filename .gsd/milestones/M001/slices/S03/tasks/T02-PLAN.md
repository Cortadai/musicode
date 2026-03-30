---
estimated_steps: 7
estimated_files: 11
skills_used: []
---

# T02: App shell — sidebar, top bar, routing, dark theme

Create the app shell layout: sidebar with navigation links (Albums, Artists, Tracks, Search, Settings), top bar with search input, and main content area. Set up React Router with routes for all pages (placeholder components). Apply dark theme styling.

Steps:
1. Create layout components: AppShell, Sidebar, TopBar
2. Set up React Router with routes
3. Create placeholder page components
4. Style with Tailwind dark theme
5. Verify navigation works between pages

## Inputs

- `musicode-ui/src/api/client.ts`

## Expected Output

- `musicode-ui/src/components/layout/AppShell.tsx`
- `musicode-ui/src/components/layout/Sidebar.tsx`

## Verification

Open http://localhost:5173 — dark themed shell with sidebar navigation. Click each nav link — routes change, page titles update.
