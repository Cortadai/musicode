---
estimated_steps: 9
estimated_files: 10
skills_used: []
---

# T01: Scaffold React project with Tailwind, Router, TanStack Query, and API client layer

Scaffold React + Vite + TypeScript project. Install deps: tailwindcss, react-router, @tanstack/react-query, axios, lucide-react. Configure Tailwind with dark theme. Create API client with axios base config pointing at localhost:8080. Define TypeScript interfaces for Track, Album, Artist, SearchResults matching the backend JSON.

Steps:
1. npm create vite@latest musicode-ui -- --template react-ts
2. Install deps: tailwindcss @tailwindcss/vite react-router @tanstack/react-query axios lucide-react
3. Configure Tailwind
4. Create src/api/client.ts with axios baseURL
5. Create src/types/index.ts with all interfaces
6. Create src/api/ modules: tracks.ts, albums.ts, artists.ts, search.ts, library.ts
7. Verify dev server starts

## Inputs

- `PLAN.md`

## Expected Output

- `musicode-ui/package.json`
- `musicode-ui/src/api/client.ts`
- `musicode-ui/src/types/index.ts`

## Verification

cd musicode-ui && npm run dev — dev server starts on :5173 without errors
