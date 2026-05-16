---
estimated_steps: 1
estimated_files: 2
skills_used: []
---

# T02: Graceful shutdown and zombie prevention

On app quit and window-all-closed, kill the Java child process. Handle edge cases: process already dead, SIGTERM not enough (escalate to SIGKILL after 5s), cleanup on uncaught exceptions and SIGINT.

## Inputs

- `Windows process kill behavior`

## Expected Output

- `No zombie Java processes after any exit path`

## Verification

Close electron, verify no java.exe processes remain via tasklist
