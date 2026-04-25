---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Center section and ProgressBar flex adaptation

Ensure center section (TransportControls + ProgressBar) fills available space properly when siblings shrink. Remove max-w-2xl constraint below a breakpoint so progress bar uses full available width. Reduce gap/padding at smaller viewports.

## Inputs

- `Current center section with max-w-2xl mx-auto`

## Expected Output

- `Center section adapts fluidly, no wasted space at narrow widths`

## Verification

At 800px — transport controls centered, progress bar fills available space, time labels visible
