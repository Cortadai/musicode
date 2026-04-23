---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Create GitHub Actions CI workflow

Create .github/workflows/ci.yml with two parallel jobs: backend (Maven + Java 21) and frontend (Node 20 + Vite). Validate YAML syntax.

## Inputs

- `Project structure: musicode-server (Maven) + musicode-ui (Vite/npm)`

## Expected Output

- `.github/workflows/ci.yml with backend and frontend jobs`

## Verification

YAML lint or actionlint validation
