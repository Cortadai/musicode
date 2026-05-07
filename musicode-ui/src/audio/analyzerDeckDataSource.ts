import audioGraph from './audioGraph';

/**
 * Shared audio data source for the Analyzer Deck.
 *
 * Creates a dedicated AnalyserNode with high FFT size (4096) separate from
 * the existing one (FFT 256) used by the player visualizers. Both nodes
 * tap the same audio graph — no duplication of audio processing.
 */

let deckAnalyser: AnalyserNode | null = null;
let frequencyData: Float32Array | null = null;
let timeDomainData: Float32Array | null = null;

const DEFAULT_FFT_SIZE = 4096;
const DEFAULT_SMOOTHING = 0.8;

export interface DeckDataSource {
  getFrequencyData(): Float32Array;
  getTimeDomainData(): Float32Array;
  getSampleRate(): number;
  getFFTSize(): number;
  getBinCount(): number;
  isReady(): boolean;
}

function ensureNode(): AnalyserNode | null {
  if (deckAnalyser) return deckAnalyser;

  const ctx = audioGraph.getAudioContext();
  const insertOutput = audioGraph.getInsertChainOutput();
  if (!ctx || !insertOutput) return null;

  deckAnalyser = ctx.createAnalyser();
  deckAnalyser.fftSize = DEFAULT_FFT_SIZE;
  deckAnalyser.smoothingTimeConstant = DEFAULT_SMOOTHING;

  // Tap the signal after EQ but before destination
  insertOutput.connect(deckAnalyser);

  frequencyData = new Float32Array(deckAnalyser.frequencyBinCount);
  timeDomainData = new Float32Array(deckAnalyser.fftSize);

  return deckAnalyser;
}

export const deckDataSource: DeckDataSource = {
  getFrequencyData(): Float32Array {
    const node = ensureNode();
    if (node && frequencyData) {
      node.getFloatFrequencyData(frequencyData);
      return frequencyData;
    }
    return new Float32Array(DEFAULT_FFT_SIZE / 2);
  },

  getTimeDomainData(): Float32Array {
    const node = ensureNode();
    if (node && timeDomainData) {
      node.getFloatTimeDomainData(timeDomainData);
      return timeDomainData;
    }
    return new Float32Array(DEFAULT_FFT_SIZE);
  },

  getSampleRate(): number {
    return audioGraph.getAudioContext()?.sampleRate ?? 48000;
  },

  getFFTSize(): number {
    return deckAnalyser?.fftSize ?? DEFAULT_FFT_SIZE;
  },

  getBinCount(): number {
    return deckAnalyser?.frequencyBinCount ?? DEFAULT_FFT_SIZE / 2;
  },

  isReady(): boolean {
    return ensureNode() !== null;
  },
};

export function disposeDeckAnalyser(): void {
  if (deckAnalyser) {
    deckAnalyser.disconnect();
    deckAnalyser = null;
    frequencyData = null;
    timeDomainData = null;
  }
}
