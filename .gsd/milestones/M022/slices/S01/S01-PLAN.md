# S01: Lyrics Sidebar Panel

**Goal:** Add a lyrics sidebar panel to the normal UI, toggled from PlayerBar, reusing existing LyricsPanel sync logic. Mutually exclusive with queue panel.
**Demo:** Click lyrics button in PlayerBar → right sidebar opens with synced lyrics for current track. Click queue button → lyrics closes, queue opens. Works in all 3 shells.

## Must-Haves

- Lyrics sidebar opens/closes from PlayerBar button; shows synced lyrics with auto-scroll; mutually exclusive with queue panel; works in Evolved, Nova, Minimal shells

## Proof Level

- This slice proves: manual-browser

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: LyricsSidebarContext + mutual exclusion** `est:15m`
  Create LyricsSidebarContext (mirror QueuePanelContext pattern with isOpen/toggle/close). Add close() to QueuePanelContext. Wire LyricsSidebarProvider into AppShell alongside QueuePanelProvider.
  - Files: `musicode-ui/src/context/LyricsSidebarContext.tsx`, `musicode-ui/src/context/QueuePanelContext.tsx`, `musicode-ui/src/components/layout/AppShell.tsx`
  - Verify: TypeScript compiles, both contexts export correctly

- [x] **T02: LyricsSidebar component + PlayerBar button** `est:20m`
  Create LyricsSidebar component that wraps LyricsPanel in a sidebar aside (same styling as QueuePanel). Add lyrics toggle button (Mic2 icon) to PlayerBar right section, with mutual exclusion logic (opening lyrics closes queue, opening queue closes lyrics).
  - Files: `musicode-ui/src/components/player/LyricsSidebar.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`
  - Verify: TypeScript compiles, button renders in PlayerBar

- [x] **T03: Wire LyricsSidebar into all 3 shells** `est:10m`
  Add LyricsSidebar next to QueuePanel in EvolvedShell, NovaShell, and MinimalShell. Both panels sit in the same flex container — only one renders at a time due to mutual exclusion.
  - Files: `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`, `musicode-ui/src/components/layout/shells/NovaShell.tsx`, `musicode-ui/src/components/layout/shells/MinimalShell.tsx`
  - Verify: Browser verification: lyrics button toggles sidebar in all 3 shells, mutual exclusion with queue works

## Files Likely Touched

- musicode-ui/src/context/LyricsSidebarContext.tsx
- musicode-ui/src/context/QueuePanelContext.tsx
- musicode-ui/src/components/layout/AppShell.tsx
- musicode-ui/src/components/player/LyricsSidebar.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/layout/shells/EvolvedShell.tsx
- musicode-ui/src/components/layout/shells/NovaShell.tsx
- musicode-ui/src/components/layout/shells/MinimalShell.tsx
