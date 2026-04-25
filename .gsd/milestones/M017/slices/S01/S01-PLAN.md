# S01: Collapsible Sidebar

**Goal:** Sidebar colapsa automáticamente a modo iconos bajo 1024px de viewport, con toggle manual y persistencia en localStorage
**Demo:** Reducir ventana a <1024px → sidebar colapsa a iconos. Click en toggle → expande/colapsa. Refresh → estado persiste.

## Must-Haves

- 1. Sidebar colapsa a ~64px mostrando solo iconos cuando viewport < 1024px
- 2. Toggle manual funciona en cualquier ancho — estado persiste en localStorage
- 3. Tooltips en modo colapsado muestran el nombre del item
- 4. ActivityFeed y user info se ocultan en modo colapsado
- 5. Transición animada suave (width + opacity)
- 6. Sin regresiones en navegación, keyboard shortcuts, ni player

## Proof Level

- This slice proves: Not provided.

## Integration Closure

Not provided.

## Verification

- Not provided.

## Tasks

- [x] **T01: Sidebar collapse state hook + localStorage** `est:20min`
  Create useSidebarCollapse hook: manages collapsed boolean, syncs to localStorage, listens to window resize to auto-collapse below 1024px. Manual toggle overrides auto behavior until next resize cross.
  - Files: `musicode-ui/src/hooks/useSidebarCollapse.ts`
  - Verify: Hook returns correct collapsed state, persists to localStorage, auto-collapses on resize below 1024px

- [x] **T02: Sidebar component collapsed mode** `est:40min`
  Refactor Sidebar.tsx to accept collapsed prop. In collapsed mode: width shrinks to w-16 (64px), nav items show only icons with tooltip on hover, ActivityFeed and user details hidden, logo shrinks to icon-only. Add collapse toggle button. Animate width transition with CSS transition.
  - Files: `musicode-ui/src/components/layout/Sidebar.tsx`, `musicode-ui/src/index.css`
  - Verify: Sidebar renders correctly in both expanded and collapsed states, tooltips visible on hover in collapsed mode, toggle button works

- [x] **T03: AppShell integration + layout adjustment** `est:15min`
  Wire useSidebarCollapse into AppShell.tsx, pass collapsed prop to Sidebar. Main content area must adjust fluidly — no jump or layout shift during transition.
  - Files: `musicode-ui/src/components/layout/AppShell.tsx`
  - Verify: Layout adjusts smoothly when sidebar collapses/expands, no content jump, main area fills available space

- [x] **T04: Visual verification + edge cases** `est:20min`
  Browser verification: test at 1024px, 1023px, 800px, 1280px. Verify tooltip positioning, transition smoothness, localStorage persistence across reload, manual toggle override behavior. Check no regressions in nav, player, keyboard shortcuts.
  - Verify: All breakpoints behave correctly, tooltips work, localStorage persists, no regressions in existing features

## Files Likely Touched

- musicode-ui/src/hooks/useSidebarCollapse.ts
- musicode-ui/src/components/layout/Sidebar.tsx
- musicode-ui/src/index.css
- musicode-ui/src/components/layout/AppShell.tsx
