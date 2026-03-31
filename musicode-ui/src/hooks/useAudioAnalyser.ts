import { useEffect, useState } from 'react';
import { globalAudio } from './usePlayer';

/**
 * Audio analysis hook — manages AudioContext + AnalyserNode lifecycle.
 *
 * WHY LAZY INITIALIZATION:
 * Browsers block AudioContext creation until a user gesture (click/tap).
 * If we create it on module load, it starts in 'suspended' state and
 * the visualizer shows nothing. We defer creation to the first play action.
 *
 * WHY MODULE-LEVEL SINGLETONS:
 * createMediaElementSource(audioElement) can only be called ONCE per element.
 * Calling it twice throws "HTMLMediaElement already connected". Module-level
 * variables ensure we create the connection exactly once, surviving React
 * re-renders and component unmounts.
 */

let audioContext: AudioContext | null = null;
let analyserNode: AnalyserNode | null = null;
let sourceConnected = false;

/**
 * Initialize the AudioContext and connect to the global Audio element.
 * Call this on a user gesture (play button click) to satisfy autoplay policy.
 */
export function initAudioContext(): void {
  if (audioContext && audioContext.state !== 'closed') {
    // Resume if suspended (Chrome suspends until user gesture)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
      console.debug('[visualizer] AudioContext resumed');
    }
    return;
  }

  audioContext = new AudioContext();
  analyserNode = audioContext.createAnalyser();

  // FFT size determines frequency resolution: 256 = 128 frequency bins.
  // Higher values (512, 1024) give more bars but less responsiveness.
  analyserNode.fftSize = 256;
  analyserNode.smoothingTimeConstant = 0.8;

  if (!sourceConnected) {
    const source = audioContext.createMediaElementSource(globalAudio);
    source.connect(analyserNode);
    analyserNode.connect(audioContext.destination);
    sourceConnected = true;
    console.debug('[visualizer] AudioContext created, source connected, fftSize:', analyserNode.fftSize);
  }
}

/**
 * Hook that provides the AnalyserNode for visualizer components.
 * Returns null until initAudioContext() has been called.
 */
export function useAudioAnalyser(): AnalyserNode | null {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(analyserNode);

  useEffect(() => {
    // Re-check after mount in case initAudioContext was called externally
    if (analyserNode && !analyser) {
      setAnalyser(analyserNode);
    }
  });

  // Poll for analyser availability (initAudioContext called from play gesture)
  useEffect(() => {
    if (analyser) return;

    const interval = setInterval(() => {
      if (analyserNode) {
        setAnalyser(analyserNode);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [analyser]);

  return analyser;
}
