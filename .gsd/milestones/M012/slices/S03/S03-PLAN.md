# S03: GitHub Actions CI workflow

**Goal:** Add GitHub Actions CI workflow that runs backend (mvn verify) and frontend (vitest + tsc + build) on every push and PR. Two parallel jobs for fast feedback.
**Demo:** Push to main triggers CI. GitHub shows green check with backend (mvn verify) and frontend (vitest + build) jobs.

## Must-Haves

- 1. .github/workflows/ci.yml exists and is valid YAML
- 2. Backend job: checkout + setup-java 21 + mvn -B verify
- 3. Frontend job: checkout + setup-node 20 + npm ci + tsc --noEmit + vitest --run + npm run build
- 4. Both jobs run in parallel on push and pull_request

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Create GitHub Actions CI workflow** `est:10min`
  Create .github/workflows/ci.yml with two parallel jobs: backend (Maven + Java 21) and frontend (Node 20 + Vite). Validate YAML syntax.
  - Files: `.github/workflows/ci.yml`
  - Verify: YAML lint or actionlint validation

## Files Likely Touched

- .github/workflows/ci.yml
