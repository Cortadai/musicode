---
estimated_steps: 1
estimated_files: 5
skills_used: []
---

# T02: Refactor AppShell into theme-aware layout shell architecture

Wire ThemeProvider into App.tsx (wrap inside PlayerProvider). Refactor AppShell to read activeTheme from useTheme and delegate to a shell component based on layoutType. Create EvolvedShell that renders current Sidebar+TopBar+Outlet+PlayerBar layout (extract from AppShell). Create NovatouchShell placeholder with 56px icon-only sidebar + content + PlayerBar — icons only, no labels, functional NavLinks. Create MinimalShell placeholder with horizontal nav bar at top + content + PlayerBar — horizontal tabs, functional NavLinks. Move keyboard shortcut logic to AppShell (shared across all shells). Each shell is a standalone layout component that receives children via Outlet.

## Inputs

- `musicode-ui/src/App.tsx`
- `musicode-ui/src/components/layout/AppShell.tsx`
- `musicode-ui/src/components/layout/Sidebar.tsx`
- `musicode-ui/src/components/layout/TopBar.tsx`
- `musicode-ui/src/context/ThemeContext.tsx`

## Expected Output

- `musicode-ui/src/App.tsx`
- `musicode-ui/src/components/layout/AppShell.tsx`
- `musicode-ui/src/components/layout/shells/EvolvedShell.tsx`
- `musicode-ui/src/components/layout/shells/NovatouchShell.tsx`
- `musicode-ui/src/components/layout/shells/MinimalShell.tsx`

## Verification

npm run build passes. App renders EvolvedShell by default. All nav links work. Keyboard shortcuts work.
