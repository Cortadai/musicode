---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T03: AppShell integration + layout adjustment

Wire useSidebarCollapse into AppShell.tsx, pass collapsed prop to Sidebar. Main content area must adjust fluidly — no jump or layout shift during transition.

## Inputs

- `useSidebarCollapse hook`
- `Updated Sidebar component`

## Expected Output

- `Updated AppShell.tsx with collapse integration`

## Verification

Layout adjusts smoothly when sidebar collapses/expands, no content jump, main area fills available space
