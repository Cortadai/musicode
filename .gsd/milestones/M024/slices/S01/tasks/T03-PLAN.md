---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: Validate CI workflow config

Review ci.yml for correctness: paths, Node/Java versions, caching config. Ensure it matches current project structure.

## Inputs

- `.github/workflows/ci.yml`
- `musicode-ui/package.json`
- `musicode-server/pom.xml`

## Expected Output

- `CI config validated`
- `No path mismatches`

## Verification

CI config references correct directories, versions, and dependency paths
