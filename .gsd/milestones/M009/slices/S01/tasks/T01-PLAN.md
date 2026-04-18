---
estimated_steps: 1
estimated_files: 1
skills_used: []
---

# T01: Create audioGraph.ts module

Create the centralized audio graph module as a singleton. Encapsulates: one HTMLAudioElement, AudioContext (lazy init on user gesture), createMediaElementSource, GainNode for volume, AnalyserNode for visualizer, and destination. Exports API: init(), play(src), pause(), resume(), seek(time), setVolume(0-1), getAnalyser(), getCurrentTime(), getDuration(), setSource(src), onTimeUpdate/onEnded/onLoadedMetadata callbacks. HTMLAudioElement.volume stays at 1.0 — volume is controlled exclusively via GainNode. Prepares a slot/comments for future insert chain (EQ, crossfade second source) but does not implement them yet.

## Inputs

- `Current useAudioAnalyser.ts pattern for AudioContext lazy init`
- `Current globalAudio singleton pattern`

## Expected Output

- `musicode-ui/src/audio/audioGraph.ts with full graph lifecycle API`
- `AudioContext created lazily on first init() call`
- `GainNode controls volume, HTMLAudioElement.volume fixed at 1.0`
- `AnalyserNode accessible via getAnalyser()`
- `Insert chain slot documented for M010 nodes`

## Verification

Module compiles. Unit test or manual verification that init() creates the graph, setVolume changes GainNode.gain.value, getAnalyser returns a valid AnalyserNode.
