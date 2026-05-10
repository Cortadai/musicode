---
estimated_steps: 1
estimated_files: 4
skills_used: []
---

# T02: ScopeRenderer types + AnalyzerDeck container component

Define ScopeRenderer interface: { id, name, render(ctx, width, height, dataSource), dispose() }. Build AnalyzerDeck React component: collapsible horizontal bar (100px height), renders active scopes as Canvas elements in a CSS flex container with proportional widths. Includes collapse/expand toggle button. Shows flat state when not playing. Zustand store (useDeckStore) for deck state: visible, activeScopes, scopeOrder, scopeProportions — persisted to localStorage.

## Inputs

- `T01 outputs`
- `reference/screenshots/prism/home.jpg (layout reference)`

## Expected Output

- `AnalyzerDeck.tsx component`
- `useDeckStore.ts Zustand store`
- `ScopeRenderer type definition`

## Verification

Render AnalyzerDeck in isolation — verify collapse/expand animation, canvas elements resize on container resize, store persists to localStorage.
