# S01: Theme Architecture + Evolved Shell — UAT

**Milestone:** M019
**Written:** 2026-05-03T09:09:15.258Z

## UAT: S01 — Theme Architecture + Evolved Shell

### Prerequisites
- Musicode running at localhost:5173
- Logged in as any user

### Test Cases

| # | Step | Expected | Pass |
|---|------|----------|------|
| 1 | Open app → default theme is Evolved | Sidebar + TopBar layout, indigo accents | ✅ |
| 2 | Navigate to Settings → Appearance section visible | Theme selector shows Evolved/Novatouch/Minimal | ✅ |
| 3 | Select Novatouch | Layout switches to 56px icon-only sidebar, indigo accents | ✅ |
| 4 | Select Minimal | Layout switches to horizontal nav bar, indigo accents | ✅ |
| 5 | Select Evolved | Layout returns to sidebar + TopBar | ✅ |
| 6 | Reload page | Theme persists (same shell renders) | ✅ |
| 7 | Navigate all pages in Evolved | All pages render correctly, no hardcoded colors | ✅ |
| 8 | Navigate all pages in Novatouch | All nav links work, pages render | ✅ |
| 9 | Navigate all pages in Minimal | All nav links work, pages render | ✅ |
| 10 | Inspect :root in DevTools | --mc-* CSS variables present | ✅ |
| 11 | npm run build | Zero errors | ✅ |
