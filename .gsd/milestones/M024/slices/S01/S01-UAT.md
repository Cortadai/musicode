# S01: CI Pipeline Verde — UAT

**Milestone:** M024
**Written:** 2026-05-10T08:06:19.058Z

## UAT: S01 — CI Pipeline Verde

### Checks
- [ ] `cd musicode-server && mvn -B verify` exits 0 with all tests passing
- [ ] `cd musicode-ui && npx tsc --noEmit` exits 0
- [ ] `cd musicode-ui && npx vitest --run` exits 0 with all tests passing
- [ ] `cd musicode-ui && npm run build` exits 0
- [ ] `.github/workflows/ci.yml` references correct working directories and versions
