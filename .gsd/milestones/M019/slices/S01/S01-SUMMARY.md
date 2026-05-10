---
id: S01
parent: M019
milestone: M019
provides:
  - ["ThemeProvider context with useTheme hook", "CSS variable system (--mc-* tokens on :root)", "3 layout shells (Evolved/Novatouch/Minimal)", "Theme selector in Settings page", "localStorage theme persistence"]
requires:
  []
affects:
  - ["All UI components now consume CSS variables instead of hardcoded Tailwind colors", "AppShell delegates to shell components — no longer a single monolithic layout", "Settings page has new Appearance section"]
key_files:
  - ["musicode-ui/src/themes/types.ts", "musicode-ui/src/themes/ThemeProvider.tsx", "musicode-ui/src/themes/useTheme.ts", "musicode-ui/src/themes/tokens/evolved.ts", "musicode-ui/src/themes/tokens/novatouch.ts", "musicode-ui/src/themes/tokens/minimal.ts", "musicode-ui/src/components/layout/AppShell.tsx", "musicode-ui/src/components/layout/shells/EvolvedShell.tsx", "musicode-ui/src/components/layout/shells/NovatouchShell.tsx", "musicode-ui/src/components/layout/shells/MinimalShell.tsx", "musicode-ui/src/components/common/ThemeSelector.tsx", "musicode-ui/src/pages/SettingsPage.tsx", "musicode-ui/src/index.css"]
key_decisions:
  - ["CSS variable naming: --mc-{camelCase} prefix to avoid Tailwind collisions", "ThemeProvider wraps entire app (outside AuthProvider) — themes work on login page too", "Theme selector lives exclusively in Settings page, not inline in shells", "All 3 themes share indigo accent palette (V1) — palette differentiation deferred", "Tailwind arbitrary value syntax bg-[var(--mc-*)] preserves utility-first approach"]
patterns_established:
  - ["CSS variable consumption via Tailwind arbitrary values: bg-[var(--mc-bgBase)]", "Shell architecture: AppShell → {Evolved,Novatouch,Minimal}Shell delegation", "Theme token sets as TypeScript objects converted to CSS vars at runtime"]
observability_surfaces:
  - none
drill_down_paths:
  []
duration: ""
verification_result: passed
completed_at: 2026-05-03T09:09:15.258Z
blocker_discovered: false
---

# S01: Theme Architecture + Evolved Shell

**Built complete CSS variable theming system with 3 switchable layout shells (Evolved/Novatouch/Minimal) and migrated all components to CSS custom properties**

## What Happened

S01 delivered the full theming foundation for Musicode in 4 tasks:

**T01** — Created ThemeProvider context, TypeScript types (ThemeName, ShellLayout, ThemeTokens with 40+ tokens, ThemeConfig), useTheme hook, and token sets for all 3 themes. ThemeProvider injects --mc-* CSS variables on :root, persists to localStorage, and sets data-theme attribute.

**T02** — Refactored AppShell into a theme-aware shell architecture. Created EvolvedShell (sidebar + topbar), NovatouchShell (56px icon sidebar), and MinimalShell (horizontal nav). AppShell delegates to the active shell based on ThemeContext. Keyboard shortcuts shared across all shells.

**T03** — Migrated ~40 component files from hardcoded Tailwind zinc/indigo classes to CSS variable equivalents using arbitrary value syntax (bg-[var(--mc-bgBase)]). Added glassmorphism utilities to index.css. Visual no-op — Evolved theme renders identically to pre-migration.

**T04** — Built ThemeSelector segmented control. Iterated on placement through user testing: started in TopBar, tried popover in Novatouch sidebar, ultimately settled in Settings page (Appearance section) as the canonical home. Unified accent colors to indigo across all 3 themes per user feedback.

All subsequent slices (S02-S08) build on this foundation — every component now consumes CSS variables that the theme system controls.

## Verification

TypeScript compiles clean (tsc --noEmit). Vite production build passes. All 3 themes verified in browser: layout shells switch correctly, CSS variables apply, accent colors are consistent indigo, localStorage persists theme choice across reload. User confirmed all themes working correctly and approved closure.

## Requirements Advanced

None.

## Requirements Validated

None.

## New Requirements Surfaced

None.

## Requirements Invalidated or Re-scoped

None.

## Operational Readiness

None.

## Deviations

T03 expanded from 7 planned files to ~40 files to ensure complete migration. T04 iterated on theme selector placement (TopBar → popover → Settings page) based on user testing.

## Known Limitations

None.

## Follow-ups

S02 (Home Page) is next in the roadmap. S07/S08 will flesh out Novatouch and Minimal shells beyond the current placeholders.

## Files Created/Modified

None.
