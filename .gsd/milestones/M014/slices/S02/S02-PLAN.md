# S02: Frontend: Health dashboard UI

**Goal:** Frontend health dashboard page with summary cards, filterable issue table, and MusicBrainz Picard guidance
**Demo:** Navegar a /library/health, ver cards de resumen, click para ver detalles con paginación

## Must-Haves

- Cards show correct counts, table filters by type, pagination works, Picard message visible

## Proof Level

- This slice proves: visual-verification

## Integration Closure

Feature complete end-to-end

## Verification

- Not provided.

## Tasks

- [x] **T01: LibraryHealthPage with summary cards and issue table** `est:2h`
  React page at /library/health showing summary cards per issue type with counts, clickable to filter a paginated table of affected tracks/albums. Includes MusicBrainz Picard guidance message.
  - Files: `musicode-ui/src/pages/LibraryHealthPage.tsx`, `musicode-ui/src/api/libraryHealth.ts`
  - Verify: Visual verification in browser: cards show counts, click filters table, pagination works

## Files Likely Touched

- musicode-ui/src/pages/LibraryHealthPage.tsx
- musicode-ui/src/api/libraryHealth.ts
