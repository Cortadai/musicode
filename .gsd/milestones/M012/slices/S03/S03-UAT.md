# S03: GitHub Actions CI workflow — UAT

**Milestone:** M012
**Written:** 2026-04-18T18:31:46.435Z

## UAT: S03 — GitHub Actions CI workflow

### Pre-conditions
- Repository pushed to GitHub

### Test Cases

#### TC1: CI triggers on push
1. Push a commit to main
2. Go to GitHub → Actions tab
3. Verify CI workflow appears and runs
- **Pass criteria:** Both backend and frontend jobs run and show green

#### TC2: CI triggers on PR
1. Create a branch, push a commit, open a PR
2. Verify CI runs as a check on the PR
- **Pass criteria:** PR shows CI status check

#### TC3: CI catches failures
1. Introduce a deliberate test failure on a branch
2. Push and verify CI goes red
- **Pass criteria:** Failed job shows clear error in logs
