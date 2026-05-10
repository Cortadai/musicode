# S01: CI Pipeline Verde

**Goal:** Verificar que el pipeline CI completo pasa localmente: backend mvn verify, frontend tsc + tests + build. Corregir cualquier problema que impida CI verde.
**Demo:** GitHub Actions workflow pasa localmente con act o simulación manual de los 3 jobs

## Must-Haves

- Los 3 checks del CI (backend verify, frontend tsc+tests, frontend build) pasan sin errores localmente, simulando el entorno de GitHub Actions.

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Verify backend mvn verify** `est:3min`
  Run mvn -B verify in musicode-server and confirm all tests pass and build succeeds.
  - Files: `musicode-server/pom.xml`
  - Verify: mvn -B verify exits 0 with all tests passing

- [x] **T02: Verify frontend tsc + tests + build** `est:3min`
  Run tsc --noEmit, vitest --run, and npm run build in musicode-ui. Fix any remaining issues.
  - Files: `musicode-ui/package.json`, `musicode-ui/tsconfig.json`, `musicode-ui/src/test-setup.ts`
  - Verify: tsc --noEmit exits 0, vitest --run exits 0 with all tests passing, npm run build exits 0

- [x] **T03: Validate CI workflow config** `est:2min`
  Review ci.yml for correctness: paths, Node/Java versions, caching config. Ensure it matches current project structure.
  - Files: `.github/workflows/ci.yml`
  - Verify: CI config references correct directories, versions, and dependency paths

## Files Likely Touched

- musicode-server/pom.xml
- musicode-ui/package.json
- musicode-ui/tsconfig.json
- musicode-ui/src/test-setup.ts
- .github/workflows/ci.yml
