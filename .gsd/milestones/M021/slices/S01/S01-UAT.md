# S01: Token Architecture — Split Shell vs Palette — UAT

**Milestone:** M021
**Written:** 2026-05-09T09:05:07.169Z

## UAT — S01: Token Architecture

### Preconditions
- Dev server running, app loaded

### Tests

| # | Step | Expected | Result |
|---|------|----------|--------|
| 1 | Load app with default palette | App renders with Indigo palette colors | PASS |
| 2 | Set localStorage `musicode-palette` to `cobalt`, reload | All 3 shells show Cobalt blue-tinted backgrounds | PASS |
| 3 | Switch shell (evolved → nova → minimal) with Cobalt | Each shell maintains its layout, Cobalt colors persist | PASS |
| 4 | Set palette back to `indigo`, reload | Original Indigo colors restored across all shells | PASS |
| 5 | Run `npm run build` | Clean compilation, no type errors | PASS |
