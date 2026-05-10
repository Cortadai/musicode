import type { EqBand } from './eqProcessor';
import { FREQ_MIN, FREQ_MAX, GAIN_MIN, GAIN_MAX } from './eqProcessor';

export function computeFilterMagnitude(band: EqBand, testFreq: number, sampleRate: number): number {
  if (sampleRate <= 0) return 0;

  const w0 = (2 * Math.PI * band.frequency) / sampleRate;
  const w = (2 * Math.PI * testFreq) / sampleRate;
  const A = Math.pow(10, band.gain / 40);
  const sinW0 = Math.sin(w0);
  const cosW0 = Math.cos(w0);
  const alpha = sinW0 / (2 * band.Q);

  let b0: number, b1: number, b2: number;
  let a0: number, a1: number, a2: number;

  switch (band.type) {
    case 'peaking':
      b0 = 1 + alpha * A;
      b1 = -2 * cosW0;
      b2 = 1 - alpha * A;
      a0 = 1 + alpha / A;
      a1 = -2 * cosW0;
      a2 = 1 - alpha / A;
      break;
    case 'lowshelf': {
      const sqrtA = Math.sqrt(A);
      b0 = A * ((A + 1) - (A - 1) * cosW0 + 2 * sqrtA * alpha);
      b1 = 2 * A * ((A - 1) - (A + 1) * cosW0);
      b2 = A * ((A + 1) - (A - 1) * cosW0 - 2 * sqrtA * alpha);
      a0 = (A + 1) + (A - 1) * cosW0 + 2 * sqrtA * alpha;
      a1 = -2 * ((A - 1) + (A + 1) * cosW0);
      a2 = (A + 1) + (A - 1) * cosW0 - 2 * sqrtA * alpha;
      break;
    }
    case 'highshelf': {
      const sqrtA = Math.sqrt(A);
      b0 = A * ((A + 1) + (A - 1) * cosW0 + 2 * sqrtA * alpha);
      b1 = -2 * A * ((A - 1) + (A + 1) * cosW0);
      b2 = A * ((A + 1) + (A - 1) * cosW0 - 2 * sqrtA * alpha);
      a0 = (A + 1) - (A - 1) * cosW0 + 2 * sqrtA * alpha;
      a1 = 2 * ((A - 1) - (A + 1) * cosW0);
      a2 = (A + 1) - (A - 1) * cosW0 - 2 * sqrtA * alpha;
      break;
    }
    case 'lowpass':
      b0 = (1 - cosW0) / 2;
      b1 = 1 - cosW0;
      b2 = (1 - cosW0) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
      break;
    case 'highpass':
      b0 = (1 + cosW0) / 2;
      b1 = -(1 + cosW0);
      b2 = (1 + cosW0) / 2;
      a0 = 1 + alpha;
      a1 = -2 * cosW0;
      a2 = 1 - alpha;
      break;
  }

  const cosW = Math.cos(w);
  const sinW = Math.sin(w);
  const cos2W = Math.cos(2 * w);
  const sin2W = Math.sin(2 * w);

  const numReal = b0 / a0 + (b1 / a0) * cosW + (b2 / a0) * cos2W;
  const numImag = -(b1 / a0) * sinW - (b2 / a0) * sin2W;
  const denReal = 1 + (a1 / a0) * cosW + (a2 / a0) * cos2W;
  const denImag = -(a1 / a0) * sinW - (a2 / a0) * sin2W;

  const numMag = Math.sqrt(numReal * numReal + numImag * numImag);
  const denMag = Math.sqrt(denReal * denReal + denImag * denImag);

  return 20 * Math.log10(numMag / (denMag + 1e-20));
}

export function computeCombinedMagnitude(bands: readonly EqBand[], testFreq: number, sampleRate: number): number {
  let totalDb = 0;
  for (const band of bands) {
    totalDb += computeFilterMagnitude(band, testFreq, sampleRate);
  }
  return totalDb;
}

// --- Coordinate mapping for SVG ---

const LOG_MIN = Math.log10(FREQ_MIN);
const LOG_MAX = Math.log10(FREQ_MAX);
const LOG_RANGE = LOG_MAX - LOG_MIN;
const DB_RANGE = GAIN_MAX - GAIN_MIN;

export function freqToX(freq: number, width: number): number {
  return ((Math.log10(freq) - LOG_MIN) / LOG_RANGE) * width;
}

export function xToFreq(x: number, width: number): number {
  return Math.pow(10, LOG_MIN + (x / width) * LOG_RANGE);
}

export function dbToY(db: number, height: number): number {
  return ((GAIN_MAX - db) / DB_RANGE) * height;
}

export function yToDb(y: number, height: number): number {
  return GAIN_MAX - (y / height) * DB_RANGE;
}

export function formatFreqLabel(hz: number): string {
  if (hz >= 1000) {
    const k = hz / 1000;
    return hz >= 10000 ? `${Math.round(k)}k` : `${k.toFixed(1)}k`;
  }
  return `${Math.round(hz)}`;
}

// --- Curve path generation ---

const CURVE_POINTS = 200;
const FREQ_GRID = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
const DB_GRID = [-12, -6, 0, 6, 12];

export { FREQ_GRID, DB_GRID };

// --- Spectrum path generation (maps FFT bin data to SVG coordinates) ---

const SPECTRUM_DB_FLOOR = -80;
const SPECTRUM_DB_CEIL = -10;
const SPECTRUM_DB_RANGE = SPECTRUM_DB_CEIL - SPECTRUM_DB_FLOOR;
const SPECTRUM_POINTS = 200;

export function computeSpectrumPath(
  frequencyData: Float32Array,
  binCount: number,
  sampleRate: number,
  width: number,
  height: number,
): string {
  if (width <= 0 || height <= 0 || binCount <= 0) return '';

  const binFreqStep = sampleRate / (binCount * 2);
  let path = '';

  for (let i = 0; i <= SPECTRUM_POINTS; i++) {
    const logFreq = LOG_MIN + (i / SPECTRUM_POINTS) * LOG_RANGE;
    const freq = Math.pow(10, logFreq);

    const exactBin = freq / binFreqStep;
    const binLow = Math.floor(exactBin);
    const binHigh = Math.min(binLow + 1, binCount - 1);
    const frac = exactBin - binLow;

    const dbLow = binLow < binCount ? frequencyData[binLow] : SPECTRUM_DB_FLOOR;
    const dbHigh = binHigh < binCount ? frequencyData[binHigh] : SPECTRUM_DB_FLOOR;
    let db = dbLow + frac * (dbHigh - dbLow);

    if (!isFinite(db)) db = SPECTRUM_DB_FLOOR;
    db = Math.max(SPECTRUM_DB_FLOOR, Math.min(SPECTRUM_DB_CEIL, db));

    const x = (i / SPECTRUM_POINTS) * width;
    const y = height * (1 - (db - SPECTRUM_DB_FLOOR) / SPECTRUM_DB_RANGE);

    path += i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : ` L${x.toFixed(1)},${y.toFixed(1)}`;
  }

  return path;
}

export function computeCurvePaths(
  bands: readonly EqBand[],
  enabled: boolean,
  sampleRate: number,
  width: number,
  height: number,
): { curvePath: string; fillPath: string } {
  if (width <= 0 || height <= 0) return { curvePath: '', fillPath: '' };

  const zeroY = dbToY(0, height);
  const points: string[] = [];

  for (let i = 0; i <= CURVE_POINTS; i++) {
    const x = (i / CURVE_POINTS) * width;
    const freq = xToFreq(x, width);
    let db = enabled ? computeCombinedMagnitude(bands, freq, sampleRate) : 0;
    db = Math.max(GAIN_MIN - 2, Math.min(GAIN_MAX + 2, db));
    const y = dbToY(db, height);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const curvePath = `M${points.join(' L')}`;
  const fillPath = `M0,${zeroY.toFixed(1)} L${points.join(' L')} L${width.toFixed(1)},${zeroY.toFixed(1)} Z`;
  return { curvePath, fillPath };
}
