---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Dev workflow integration

Add npm scripts to start React dev server and Electron concurrently. Configure electron to wait for vite dev server before loading. Add .gitignore for node_modules and dist.

## Inputs

- `sonance-ui vite config for dev server port`

## Expected Output

- `Concurrent dev workflow functional`
- `Hot reload works inside Electron window`

## Verification

Single command starts both vite and electron, hot reload works in the electron window
