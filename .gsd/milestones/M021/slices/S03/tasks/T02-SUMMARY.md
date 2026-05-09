---
id: T02
parent: S03
milestone: M021
key_files:
  - musicode-ui/src/components/library/AlbumCard.tsx
  - musicode-ui/src/components/library/ArtistCard.tsx
  - musicode-ui/src/pages/HomePage.tsx
  - musicode-ui/src/pages/StatsPage.tsx
key_decisions:
  - (none)
duration: 
verification_result: passed
completed_at: 2026-05-09T09:06:11.778Z
blocker_discovered: false
---

# T02: Fixed card visibility on light backgrounds with CSS custom properties and border-subtle

**Fixed card visibility on light backgrounds with CSS custom properties and border-subtle**

## What Happened

Replaced hardcoded rgba(255,255,255,0.05/0.08) glass values in AlbumCard and ArtistCard with var(--mc-glass-background) and var(--mc-glass-border). Added border: 1px solid var(--mc-border-subtle) to HomePage cards (recent plays, top albums) and StatsPage cards (SummaryCard, chart containers, TopList). On dark palettes the border is nearly invisible; on light palettes it provides clear card definition. User confirmed the fix after reviewing screenshots.

## Verification

User confirmed cards are well-defined on all light palettes and dark palettes are unaffected

## Verification Evidence

| # | Command | Exit Code | Verdict | Duration |
|---|---------|-----------|---------|----------|
| 1 | `npm run build` | 0 | pass | 5000ms |

## Deviations

None.

## Known Issues

None.

## Files Created/Modified

- `musicode-ui/src/components/library/AlbumCard.tsx`
- `musicode-ui/src/components/library/ArtistCard.tsx`
- `musicode-ui/src/pages/HomePage.tsx`
- `musicode-ui/src/pages/StatsPage.tsx`
