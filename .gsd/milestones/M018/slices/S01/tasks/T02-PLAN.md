---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Cassette body canvas rendering

Create CassetteCanvas component using Canvas 2D. Draw the cassette body: outer shell with rounded corners, transparent window area, two hub circles (empty reels), screw holes at corners, guide posts and pressure pad below the tape path, head gap. Use warm retro colors (dark plastic body, slightly transparent brown window). The canvas must be responsive — scale to fit the container while maintaining aspect ratio. Support devicePixelRatio for crisp rendering on HiDPI displays.

## Inputs

- `Canvas 2D API`
- `devicePixelRatio handling from Visualizer.tsx`

## Expected Output

- `CassetteCanvas.tsx — static cassette body rendering`

## Verification

Canvas renders a recognizable cassette body at multiple container sizes, crisp on HiDPI
