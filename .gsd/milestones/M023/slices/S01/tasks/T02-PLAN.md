---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T02: Update audioGraph.ts — preamp node in signal chain

Insert preamp GainNode between masterGain and EQ filter chain. Update init() to create preamp node, wire it into the topology: masterGain → preamp → [EQ filters] → analyser. Expose preamp node to eqProcessor. Update getInsertChainOutput() if needed.

## Inputs

- `Current audioGraph.ts`
- `Updated eqProcessor.ts API`

## Expected Output

- `audioGraph.ts with preamp node wired into signal chain`

## Verification

Build compiles. Audio plays through with EQ enabled and disabled.
