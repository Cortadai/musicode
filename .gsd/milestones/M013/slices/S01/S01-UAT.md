# S01: Color extraction engine with opt-in dynamic theming — UAT

**Milestone:** M013
**Written:** 2026-04-18T19:29:13.506Z

## UAT: S01 — Color Extraction Engine\n\n### Preconditions\n- App running with albums that have cover art\n\n### Test Cases\n\n- [ ] **Default off**: Dynamic theme is disabled by default — no CSS variables on root\n- [ ] **Toggle on**: When enabled via useDynamicTheme toggle, CSS variables --np-color-1, --np-color-2, --np-bg appear on document root\n- [ ] **Colors match artwork**: Extracted colors visually relate to the dominant colors of the album cover\n- [ ] **Track change updates**: Switching tracks with different album art updates the CSS variables\n- [ ] **Cache hit**: Returning to a previously played album's track applies colors instantly (no flicker)\n- [ ] **Toggle off clears**: Disabling dynamic theme removes all CSS variables from root\n- [ ] **Missing artwork fallback**: Tracks without cover art get indigo-400/zinc-900 fallback\n- [ ] **Preference persists**: Reloading the app remembers the dynamic theme on/off state
