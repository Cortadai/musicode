---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T03: Reel physics and tape winding animation

Implement reel animation with accurate tape physics. Each reel has a hub radius and tape radius that changes with progress (left shrinks, right grows). Angular velocity = linearSpeed / currentRadius (constant linear tape speed). Tape is visible as brown area on each reel (hub to tape radius). Use requestAnimationFrame loop. Props: progress (0-1), isPlaying (drives spin), onFrame callback for parent sync. When paused, reels decelerate with inertia wobble. When seeking, reels spin at accelerated speed in the correct direction.

## Inputs

- `Tape physics formulas: r = sqrt(hub² + tape_amount * thickness / π)`
- `requestAnimationFrame pattern from Visualizer.tsx`

## Expected Output

- `reelPhysics.ts — physics calculations`
- `CassetteCanvas.tsx — animated reels with tape transfer`

## Verification

Reels spin when playing, left reel shrinks and right grows over track duration, pause causes deceleration, seek causes fast-forward visual
