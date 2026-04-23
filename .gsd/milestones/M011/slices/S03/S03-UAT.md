# S03: Accesibilidad (ARIA + semántica) — UAT

**Milestone:** M011
**Written:** 2026-04-18T17:24:34.749Z

## UAT — S03: Accesibilidad (ARIA + semántica)

### Keyboard Navigation

| # | Test Case | Steps | Expected | Result |
|---|-----------|-------|----------|--------|
| 1 | Tab through player controls | Press Tab repeatedly from page content | Focus moves: track rows → transport buttons → progress slider → crossfade → EQ → visualizer toggle → volume mute → volume slider | PASS |
| 2 | Progress slider keyboard | Focus progress bar, press Arrow Right/Left | Seek position changes, aria-valuetext updates | PASS |
| 3 | Volume slider keyboard | Focus volume slider, press Arrow Right/Left | Volume changes, aria-valuetext shows percentage | PASS |
| 4 | TrackRow activation | Tab to a track row, press Enter or Space | Track starts playing | PASS |
| 5 | Crossfade popover open/close | Focus crossfade button, press Enter. Then Escape. | Popover opens, focus moves to slider. Escape closes, focus returns to trigger. | PASS |
| 6 | EQ popover open/close | Focus EQ button, press Enter. Then Escape. | Popover opens, focus moves to first control. Escape closes, focus returns to trigger. | PASS |
| 7 | EQ toggle switch | Tab to toggle inside EQ popover, press Space | Toggle switches, aria-checked updates | PASS |
| 8 | EQ band sliders | Tab to a band slider, press Up/Down arrows | Band gain changes, aria-valuetext shows dB | PASS |

### Screen Reader Announcements

| # | Test Case | Expected Announcement | Result |
|---|-----------|----------------------|--------|
| 9 | Player region | "Music player, region" landmark | PASS |
| 10 | Play/Pause button | "Play" or "Pause" depending on state | PASS |
| 11 | Shuffle toggle | "Shuffle, toggle button, pressed/not pressed" | PASS |
| 12 | Repeat toggle | "Repeat: off/all/one, toggle button" | PASS |
| 13 | Seek slider | "Seek position, slider, 1:23 of 4:56" | PASS |
| 14 | Volume slider | "Volume, slider, 75%" | PASS |
| 15 | Mute button | "Mute" or "Unmute" depending on state | PASS |
| 16 | Track row | "Play [title] by [artist], button" + aria-current on playing track | PASS |
| 17 | Crossfade trigger | "Crossfade: 4s, expanded/collapsed" | PASS |
| 18 | EQ trigger | "Equalizer: Rock, expanded/collapsed" | PASS |
| 19 | Crossfade dialog | "Crossfade settings, dialog" | PASS |
| 20 | EQ dialog | "Equalizer settings, dialog" | PASS |
| 21 | EQ toggle | "Equalizer, switch, on/off" | PASS |
| 22 | Album card link | "[Album title] by [Artist name]" | PASS |
| 23 | Vinyl animation | Not announced (aria-hidden) | PASS |
| 24 | Visualizer canvas | "Audio visualizer, image" | PASS |

### Focus Visibility

| # | Test Case | Expected | Result |
|---|-----------|----------|--------|
| 25 | Progress slider focus ring | Indigo ring visible when focused via keyboard | PASS |
| 26 | Volume slider focus ring | Indigo ring visible when focused via keyboard | PASS |
| 27 | TrackRow focus ring | Indigo ring visible when focused via keyboard | PASS |
| 28 | Crossfade slider focus ring | Indigo ring visible inside popover | PASS |
