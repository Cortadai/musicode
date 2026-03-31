# S03: Spectrum Visualizer & Micro-animations — UAT

**Milestone:** M005
**Written:** 2026-03-31T11:02:19.546Z

## UAT: S03 \u2014 Spectrum Visualizer & Micro-animations\n\n### Test 1: Visualizer toggle\n1. Play a track\n2. Click the BarChart3 icon next to volume\n3. **Expected:** Indigo frequency bars animate above the progress bar\n4. Click again\n5. **Expected:** Visualizer hides\n\n### Test 2: Visualizer responds to music\n1. Toggle visualizer on, play a track with bass\n2. **Expected:** Left bars (low frequencies) jump higher than right bars\n3. Pause playback\n4. **Expected:** Bars freeze/disappear\n\n### Test 3: Disc spin\n1. Play a track\n2. Look at the cover art circle in the PlayerBar\n3. **Expected:** Cover rotates slowly (8s per revolution)\n4. Pause\n5. **Expected:** Rotation stops\n\n### Test 4: PlayerBar slide-up\n1. Refresh the page (no track playing)\n2. Click play on a track\n3. **Expected:** PlayerBar slides up from the bottom smoothly\n\n### Test 5: Cover art fade-in\n1. Navigate to Albums page\n2. **Expected:** Album covers fade in as images load\n\n### Test 6: Build and tests\n1. npm run build + npm run test:coverage\n2. **Expected:** Both pass
