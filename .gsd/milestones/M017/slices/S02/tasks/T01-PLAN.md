---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: TrackInfo responsive shrink

Replace w-60 shrink-0 with min-w-0 flex-shrink and responsive width classes. Ensure artwork stays visible, title truncates with ellipsis, and artist line truncates or hides below a breakpoint.

## Inputs

- `Current TrackInfo with w-60 shrink-0`

## Expected Output

- `TrackInfo shrinks below 240px without breaking layout`

## Verification

Resize to 800px — artwork visible, title truncates, no overflow
