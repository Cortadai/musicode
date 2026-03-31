---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: AudioContext + AnalyserNode hook

Create hooks/useAudioAnalyser.ts — manages AudioContext + AnalyserNode lifecycle. Creates AudioContext on first call (lazy — avoids autoplay policy block). Connects to globalAudio via createMediaElementSource (once, guarded by module-level flag). Returns analyserNode and a boolean indicating if the context is ready. Exports initAudioContext() that can be called on user gesture. The AudioContext must be resumed on user gesture if in 'suspended' state (Chrome autoplay policy).

## Inputs

- `globalAudio from usePlayer.ts`

## Expected Output

- `hooks/useAudioAnalyser.ts`

## Verification

npm run build compiles
