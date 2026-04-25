# S01: Collapsible Sidebar — UAT

**Milestone:** M017
**Written:** 2026-04-25T19:07:01.418Z

## UAT — S01: Collapsible Sidebar

### Auto-collapse
- [ ] Resize browser window below 1024px → sidebar collapses to icon-only (w-16)
- [ ] Navigation icons remain visible and centered
- [ ] Tooltips appear on hover over collapsed icons

### Auto-expand
- [ ] Resize browser window above 1024px → sidebar expands to full width (w-64)
- [ ] Labels fade in smoothly

### Manual toggle
- [ ] Click toggle button → sidebar collapses/expands regardless of viewport width
- [ ] After manual collapse, resizing above 1024px does NOT auto-expand (manual override)
- [ ] After manual expand, resizing below 1024px still auto-collapses

### Persistence
- [ ] Collapse sidebar manually, reload page → sidebar remains collapsed
- [ ] Expand sidebar manually, reload page → sidebar remains expanded

### Visual quality
- [ ] Transition animation is smooth (no jumps or flicker)
- [ ] No layout shift in main content area during transition
- [ ] Toggle button icon changes appropriately (PanelLeft ↔ PanelLeftClose)
