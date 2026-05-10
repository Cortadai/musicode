# S01: Theme Architecture + Evolved Shell

**Goal:** ThemeProvider architecture that injects CSS variables + layout shell per theme. Theme selector switches between Evolved (fully styled), Novatouch (placeholder icon sidebar), and Minimal (placeholder horizontal nav). Evolved theme uses indigo accent palette from mockup-B. All shared components consume CSS variables instead of hardcoded Tailwind zinc-* classes.
**Demo:** Theme selector switches between Evolved layout (sidebar) and placeholder shells for Novatouch/Minimal. CSS variables change colors/spacing per theme.

## Must-Haves

- Theme selector visible in UI, persists choice across page reloads (localStorage)
- Switching to Evolved renders sidebar+topbar layout with indigo accent colors
- Switching to Novatouch renders icon-only sidebar placeholder (functional nav)
- Switching to Minimal renders horizontal nav placeholder (functional nav)
- No hardcoded zinc-950/900/800 in AppShell, Sidebar, TopBar — all via CSS variables
- All existing pages render correctly under Evolved theme (no visual regressions)
- `npm run build` passes with zero errors

## Proof Level

- This slice proves: integration — real runtime required, visual verification in browser

## Integration Closure

Upstream: existing AppShell, Sidebar, TopBar, PlayerBar, all page components. New wiring: ThemeProvider wraps app in App.tsx, AppShell delegates to shell components. After S01, every subsequent slice builds on theme architecture — S02-S08 all depend on S01.

## Verification

- Active theme stored in localStorage key `musicode-theme`. ThemeProvider logs theme switch to console in dev mode. CSS variables visible in browser DevTools on :root.

## Tasks

- [x] **T01: Create ThemeProvider context, theme types, and Evolved token set** `est:45m`
  Define the ThemeConfig type with id, name, cssVars record, and layoutType enum (evolved|novatouch|minimal). Create Evolved theme tokens from mockup-B CSS variables (--bg-base, --bg-surface, --bg-elevated, --border, --text, --text-2, --text-3, --accent, --accent-dim, --accent-glow, --glass-bg, --glass-border, --radius-sm/md/lg, --wf-played/unplayed/buffered). Create ThemeContext with provider that: (1) reads initial theme from localStorage, (2) injects CSS variables on document.documentElement, (3) exposes activeTheme + setTheme. Create stub token sets for Novatouch (purple-cold palette) and Minimal (neutral). Export useTheme hook.
  - Files: `musicode-ui/src/types/theme.ts`, `musicode-ui/src/context/ThemeContext.tsx`, `musicode-ui/src/themes/evolved.ts`, `musicode-ui/src/themes/novatouch.ts`, `musicode-ui/src/themes/minimal.ts`, `musicode-ui/src/themes/index.ts`
  - Verify: npm run build passes. ThemeProvider renders without errors. useTheme returns evolved as default.

- [x] **T02: Refactor AppShell into theme-aware layout shell architecture** `est:1h`
  Wire ThemeProvider into App.tsx (wrap inside PlayerProvider). Refactor AppShell to read activeTheme from useTheme and delegate to a shell component based on layoutType. Create EvolvedShell that renders current Sidebar+TopBar+Outlet+PlayerBar layout (extract from AppShell). Create NovatouchShell placeholder with 56px icon-only sidebar + content + PlayerBar — icons only, no labels, functional NavLinks. Create MinimalShell placeholder with horizontal nav bar at top + content + PlayerBar — horizontal tabs, functional NavLinks. Move keyboard shortcut logic to AppShell (shared across all shells). Each shell is a standalone layout component that receives children via Outlet.
  - Files: `musicode-ui/src/App.tsx`, `musicode-ui/src/components/layout/AppShell.tsx`, `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`, `musicode-ui/src/components/layout/shells/NovatouchShell.tsx`, `musicode-ui/src/components/layout/shells/MinimalShell.tsx`
  - Verify: npm run build passes. App renders EvolvedShell by default. All nav links work. Keyboard shortcuts work.

- [x] **T03: Migrate shared component colors from hardcoded Tailwind to CSS variables** `est:1h30m`
  Replace hardcoded zinc-950, zinc-900, zinc-800, zinc-700, zinc-500, zinc-400, zinc-300, zinc-100 Tailwind classes in layout and shared components with CSS variable equivalents using Tailwind arbitrary values (e.g. bg-[var(--bg-base)], text-[var(--text)], border-[var(--border)]). Target files: Sidebar, TopBar, PlayerBar wrapper, page container backgrounds, card borders. Add glassmorphism utility classes to index.css (.glass-card, .glass-panel) using theme CSS variables. Ensure Evolved theme looks identical to current app — this is a refactor, not a visual change.
  - Files: `musicode-ui/src/index.css`, `musicode-ui/src/components/layout/Sidebar.tsx`, `musicode-ui/src/components/layout/TopBar.tsx`, `musicode-ui/src/components/player/PlayerBar.tsx`, `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`, `musicode-ui/src/components/layout/shells/NovatouchShell.tsx`, `musicode-ui/src/components/layout/shells/MinimalShell.tsx`
  - Verify: npm run build passes. Visual comparison in browser: Evolved theme looks identical to current app. Novatouch/Minimal shells pick up their respective color tokens.

- [x] **T04: Add theme selector UI and verify end-to-end theme switching** `est:45m`
  Create ThemeSelector component — segmented control showing three theme names with active indicator (indigo highlight). Place it in TopBar (right side, before user menu). Clicking a theme: updates ThemeContext, CSS variables swap on :root, layout shell switches. Verify in browser: (1) Evolved renders current sidebar layout with indigo accents, (2) Novatouch renders icon sidebar with purple-cold palette, (3) Minimal renders horizontal nav with neutral palette, (4) choice persists across page reload, (5) all navigation links work in all three shells, (6) PlayerBar renders correctly in all shells, (7) keyboard shortcuts work in all shells. Run npm run build to confirm zero errors.
  - Files: `musicode-ui/src/components/common/ThemeSelector.tsx`, `musicode-ui/src/components/layout/TopBar.tsx`
  - Verify: npm run build passes. Theme selector visible in TopBar. Switching themes changes layout and colors. localStorage musicode-theme persists across reload.

## Files Likely Touched

- musicode-ui/src/types/theme.ts
- musicode-ui/src/context/ThemeContext.tsx
- musicode-ui/src/themes/evolved.ts
- musicode-ui/src/themes/novatouch.ts
- musicode-ui/src/themes/minimal.ts
- musicode-ui/src/themes/index.ts
- musicode-ui/src/App.tsx
- musicode-ui/src/components/layout/AppShell.tsx
- musicode-ui/src/components/layout/shells/EvolvedShell.tsx
- musicode-ui/src/components/layout/shells/NovatouchShell.tsx
- musicode-ui/src/components/layout/shells/MinimalShell.tsx
- musicode-ui/src/index.css
- musicode-ui/src/components/layout/Sidebar.tsx
- musicode-ui/src/components/layout/TopBar.tsx
- musicode-ui/src/components/player/PlayerBar.tsx
- musicode-ui/src/components/common/ThemeSelector.tsx
