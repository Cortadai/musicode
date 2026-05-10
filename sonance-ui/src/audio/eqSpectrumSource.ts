import audioGraph from './audioGraph';

let eqAnalyser: AnalyserNode | null = null;
let frequencyData: Float32Array | null = null;

const FFT_SIZE = 2048;
const SMOOTHING = 0.75;

function ensureNode(): AnalyserNode | null {
  if (eqAnalyser) return eqAnalyser;

  const ctx = audioGraph.getAudioContext();
  const insertOutput = audioGraph.getInsertChainOutput();
  if (!ctx || !insertOutput) return null;

  eqAnalyser = ctx.createAnalyser();
  eqAnalyser.fftSize = FFT_SIZE;
  eqAnalyser.smoothingTimeConstant = SMOOTHING;

  insertOutput.connect(eqAnalyser);
  frequencyData = new Float32Array(eqAnalyser.frequencyBinCount);

  return eqAnalyser;
}

export function getEqFrequencyData(): Float32Array | null {
  const node = ensureNode();
  if (!node || !frequencyData) return null;
  node.getFloatFrequencyData(frequencyData);
  return frequencyData;
}

export function getEqSampleRate(): number {
  return audioGraph.getAudioContext()?.sampleRate ?? 48000;
}

export function getEqBinCount(): number {
  return eqAnalyser?.frequencyBinCount ?? FFT_SIZE / 2;
}

export function disposeEqAnalyser(): void {
  if (eqAnalyser) {
    eqAnalyser.disconnect();
    eqAnalyser = null;
    frequencyData = null;
  }
}
