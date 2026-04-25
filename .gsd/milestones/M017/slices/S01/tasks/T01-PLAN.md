---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Sidebar collapse state hook + localStorage

Create useSidebarCollapse hook: manages collapsed boolean, syncs to localStorage, listens to window resize to auto-collapse below 1024px. Manual toggle overrides auto behavior until next resize cross.

## Inputs

- `Current AppShell layout structure`

## Expected Output

- `useSidebarCollapse.ts hook with collapsed state, toggle function, localStorage sync`

## Verification

Hook returns correct collapsed state, persists to localStorage, auto-collapses on resize below 1024px
