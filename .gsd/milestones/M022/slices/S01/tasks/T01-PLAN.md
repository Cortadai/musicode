---
estimated_steps: 1
estimated_files: 3
skills_used: []
---

# T01: LyricsSidebarContext + mutual exclusion

Create LyricsSidebarContext (mirror QueuePanelContext pattern with isOpen/toggle/close). Add close() to QueuePanelContext. Wire LyricsSidebarProvider into AppShell alongside QueuePanelProvider.

## Inputs

- `QueuePanelContext.tsx pattern`

## Expected Output

- `LyricsSidebarContext.tsx with isOpen/toggle/close`
- `QueuePanelContext updated with close()`
- `AppShell wraps Shell in both providers`

## Verification

TypeScript compiles, both contexts export correctly
