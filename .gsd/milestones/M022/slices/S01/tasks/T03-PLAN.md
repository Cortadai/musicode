---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T03: Wire LyricsSidebar into all 3 shells

Add LyricsSidebar next to QueuePanel in EvolvedShell, NovaShell, and MinimalShell. Both panels sit in the same flex container — only one renders at a time due to mutual exclusion.

## Inputs

- `Shell component patterns`

## Expected Output

- `All 3 shells render LyricsSidebar alongside QueuePanel`

## Verification

Browser verification: lyrics button toggles sidebar in all 3 shells, mutual exclusion with queue works
