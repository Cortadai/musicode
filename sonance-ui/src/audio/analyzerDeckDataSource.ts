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
let byteFrequencyData: Uint8Array | null = null;
let timeDomainData: Float32Array | null = null;

let splitter: ChannelSplitterNode | null = null;
let analyserL: AnalyserNode | null = null;
let analyserR: AnalyserNode | null = null;
let timeDomainL: Float32Array | null = null;
let timeDomainR: Float32Array | null = null;
let downsampledByte: Uint8Array | null = null;

const DEFAULT_FFT_SIZE = 4096;
const DEFAULT_SMOOTHING = 0.8;

export interface DeckDataSource {
  getFrequencyData(): Float32Array;
  getByteFrequencyData(size?: number): Uint8Array;
  getTimeDomainData(): Float32Array;
  getLeftTimeDomainData(): Float32Array;
  getRightTimeDomainData(): Float32Array;
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

  insertOutput.connect(deckAnalyser);

  frequencyData = new Float32Array(deckAnalyser.frequencyBinCount);
  byteFrequencyData = new Uint8Array(deckAnalyser.frequencyBinCount);
  timeDomainData = new Float32Array(deckAnalyser.fftSize);

  splitter = ctx.createChannelSplitter(2);
  insertOutput.connect(splitter);

  analyserL = ctx.createAnalyser();
  analyserL.fftSize = DEFAULT_FFT_SIZE;
  analyserL.smoothingTimeConstant = DEFAULT_SMOOTHING;
  splitter.connect(analyserL, 0);

  analyserR = ctx.createAnalyser();
  analyserR.fftSize = DEFAULT_FFT_SIZE;
  analyserR.smoothingTimeConstant = DEFAULT_SMOOTHING;
  splitter.connect(analyserR, 1);

  timeDomainL = new Float32Array(DEFAULT_FFT_SIZE);
  timeDomainR = new Float32Array(DEFAULT_FFT_SIZE);

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

  getByteFrequencyData(size = 128): Uint8Array {
    const node = ensureNode();
    if (node && byteFrequencyData) {
      node.getByteFrequencyData(byteFrequencyData);
      const totalBins = byteFrequencyData.length;
      if (size >= totalBins) return byteFrequencyData.subarray(0, totalBins);
      if (!downsampledByte || downsampledByte.length !== size) {
        downsampledByte = new Uint8Array(size);
      }
      const step = totalBins / size;
      for (let i = 0; i < size; i++) {
        const start = Math.floor(i * step);
        const end = Math.floor((i + 1) * step);
        let sum = 0;
        for (let j = start; j < end; j++) sum += byteFrequencyData[j];
        downsampledByte[i] = sum / (end - start);
      }
      return downsampledByte;
    }
    return new Uint8Array(size);
  },

  getTimeDomainData(): Float32Array {
    const node = ensureNode();
    if (node && timeDomainData) {
      node.getFloatTimeDomainData(timeDomainData);
      return timeDomainData;
    }
    return new Float32Array(DEFAULT_FFT_SIZE);
  },

  getLeftTimeDomainData(): Float32Array {
    ensureNode();
    if (analyserL && timeDomainL) {
      analyserL.getFloatTimeDomainData(timeDomainL);
      return timeDomainL;
    }
    return new Float32Array(DEFAULT_FFT_SIZE);
  },

  getRightTimeDomainData(): Float32Array {
    ensureNode();
    if (analyserR && timeDomainR) {
      analyserR.getFloatTimeDomainData(timeDomainR);
      return timeDomainR;
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

export function setDeckFFTSize(size: number): void {
  const valid = [1024, 2048, 4096, 8192, 16384];
  if (!valid.includes(size)) return;
  if (!deckAnalyser) return;

  deckAnalyser.fftSize = size;
  frequencyData = new Float32Array(deckAnalyser.frequencyBinCount);
  byteFrequencyData = new Uint8Array(deckAnalyser.frequencyBinCount);
  timeDomainData = new Float32Array(size);

  if (analyserL) {
    analyserL.fftSize = size;
    timeDomainL = new Float32Array(size);
  }
  if (analyserR) {
    analyserR.fftSize = size;
    timeDomainR = new Float32Array(size);
  }
}

export function disposeDeckAnalyser(): void {
  if (deckAnalyser) {
    deckAnalyser.disconnect();
    deckAnalyser = null;
    frequencyData = null;
    byteFrequencyData = null;
    timeDomainData = null;
  }
  if (splitter) { splitter.disconnect(); splitter = null; }
  if (analyserL) { analyserL.disconnect(); analyserL = null; }
  if (analyserR) { analyserR.disconnect(); analyserR = null; }
  timeDomainL = null;
  timeDomainR = null;
}
