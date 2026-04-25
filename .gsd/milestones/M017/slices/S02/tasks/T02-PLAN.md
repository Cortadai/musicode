---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Right controls responsive collapse

Replace w-48 shrink-0 with responsive classes. Hide VolumeControl and auxiliary popovers (CrossfadePopover, EqPopover) below 900px. Keep ScrobbleIndicator visible as it's a small icon. Use Tailwind responsive variants.

## Inputs

- `Current right section with w-48 shrink-0`

## Expected Output

- `Right section collapses gracefully, no fixed width below 900px`

## Verification

Resize to 800px — volume and popovers hidden, scrobble indicator visible, no overflow
