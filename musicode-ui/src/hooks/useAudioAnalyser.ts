import { useEffect, useState } from 'react';
import audioGraph from '../audio/audioGraph';

/**
 * Thin wrapper around audioGraph — provides the AnalyserNode to visualizer components.
 * Returns null until audioGraph.init() has been called (on user gesture).
 *
 * initAudioContext() is re-exported for backward compatibility with PlayerBar.
 * TODO(M010): Remove this file — have components import audioGraph directly.
 */

export function initAudioContext(): void {
  audioGraph.init();
}

export function useAudioAnalyser(): AnalyserNode | null {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(audioGraph.getAnalyser());

  useEffect(() => {
    if (analyser) return;

    // Poll for analyser availability (audioGraph.init() called from play gesture)
    const interval = setInterval(() => {
      const node = audioGraph.getAnalyser();
      if (node) {
        setAnalyser(node);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [analyser]);

  return analyser;
}
