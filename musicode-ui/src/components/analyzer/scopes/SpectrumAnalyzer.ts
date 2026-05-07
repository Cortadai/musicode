import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';
import { getHeatLut, heatColor, normalizeDb } from './heatScale';

const MIN_DB = -90;
const MAX_DB = -10;
const DB_RANGE = MAX_DB - MIN_DB;
const MIN_FREQ = 20;
const MAX_FREQ = 20000;
const TILT_DB_PER_OCTAVE = 3.0;
const TILT_REF_HZ = 1000;
const SMOOTHING = 0.85;

const GRID_DB_STEPS = [-80, -60, -40, -20];
const GRID_FREQ_LABELS: [number, string][] = [
  [50, '50'], [100, '100'], [200, '200'], [500, '500'],
  [1000, '1k'], [2000, '2k'], [5000, '5k'], [10000, '10k'],
];

// Smoothed magnitude buffer — persists across frames
let smoothedBins: Float32Array | null = null;

// Static grid cache
let gridCanvas: OffscreenCanvas | null = null;
let gridW = 0;
let gridH = 0;
let gridColors = '';

function getThemeColor(prop: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
}

function freqToX(freq: number, width: number): number {
  const logMin = Math.log10(MIN_FREQ);
  const logMax = Math.log10(MAX_FREQ);
  return ((Math.log10(freq) - logMin) / (logMax - logMin)) * width;
}

function dbToY(db: number, height: number): number {
  return (1 - (db - MIN_DB) / DB_RANGE) * height;
}

function tiltCompensation(freq: number): number {
  if (freq <= 0) return 0;
  return TILT_DB_PER_OCTAVE * Math.log2(freq / TILT_REF_HZ);
}

function ensureGridCache(w: number, h: number): void {
  const currentGridColor = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.08)');
  if (gridCanvas && gridW === w && gridH === h && gridColors === currentGridColor) return;
  gridW = w;
  gridH = h;
  gridColors = currentGridColor;
  gridCanvas = new OffscreenCanvas(w, h);
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  ctx.strokeStyle = currentGridColor;
  ctx.lineWidth = 1;
  ctx.font = '9px system-ui, sans-serif';

  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  for (const db of GRID_DB_STEPS) {
    const y = dbToY(db, h);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    ctx.fillText(`${db}`, w - 4, y - 3);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  for (const [freq, label] of GRID_FREQ_LABELS) {
    const x = freqToX(freq, w);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.fillText(label, x, h - 4);
  }
}

function renderSpectrum(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dataSource: DeckDataSource,
): void {
  const freqData = dataSource.getFrequencyData();
  const binCount = dataSource.getBinCount();
  const sampleRate = dataSource.getSampleRate();
  const nyquist = sampleRate / 2;
  const binWidth = nyquist / binCount;

  // Ensure smoothed buffer
  if (!smoothedBins || smoothedBins.length !== binCount) {
    smoothedBins = new Float32Array(binCount);
    smoothedBins.fill(MIN_DB);
  }

  // Smooth (clamp to floor — getFloatFrequencyData returns -Infinity when silent)
  for (let i = 0; i < binCount; i++) {
    const raw = Math.max(MIN_DB - 30, freqData[i]);
    smoothedBins[i] = smoothedBins[i] * SMOOTHING + raw * (1 - SMOOTHING);
  }

  // Background
  ctx.fillStyle = getThemeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
  ctx.fillRect(0, 0, w, h);

  // Grid (cached)
  ensureGridCache(Math.round(w), Math.round(h));
  if (gridCanvas) {
    ctx.drawImage(gridCanvas, 0, 0, w, h);
  }

  const lut = getHeatLut();
  const logMin = Math.log10(MIN_FREQ);
  const logMax = Math.log10(MAX_FREQ);
  const logRange = logMax - logMin;

  // Draw spectrum as vertical bars with heatmap coloring
  const barCount = Math.min(Math.round(w / 2), 256);

  for (let i = 0; i < barCount; i++) {
    const t = i / barCount;
    const freq = Math.pow(10, logMin + t * logRange);
    const nextFreq = Math.pow(10, logMin + ((i + 1) / barCount) * logRange);

    // Map frequency to FFT bin range
    const binStart = Math.max(0, Math.floor(freq / binWidth));
    const binEnd = Math.min(binCount - 1, Math.ceil(nextFreq / binWidth));

    // Average the bins in this frequency band
    let sum = MIN_DB;
    let count = 0;
    for (let b = binStart; b <= binEnd; b++) {
      const val = smoothedBins[b];
      if (count === 0) {
        sum = val;
      } else {
        // Log-domain average (more accurate for dB)
        sum = 10 * Math.log10(Math.pow(10, sum / 10) + Math.pow(10, val / 10));
      }
      count++;
    }
    if (count > 1) {
      sum -= 10 * Math.log10(count); // normalize
    }

    // Apply tilt compensation
    const db = sum + tiltCompensation(freq);
    const norm = normalizeDb(db, MIN_DB, MAX_DB);
    const x = freqToX(freq, w);
    const barW = Math.max(1, freqToX(nextFreq, w) - x);
    const barH = norm * h;

    if (barH > 0.5) {
      ctx.fillStyle = heatColor(norm, lut);
      ctx.fillRect(x, h - barH, barW, barH);
    }
  }

  // Draw line on top of bars
  ctx.beginPath();
  ctx.strokeStyle = getThemeColor('--mc-scope-line', 'rgba(0, 220, 255, 0.8)');
  ctx.lineWidth = 1.5;
  let first = true;

  for (let i = 0; i < barCount; i++) {
    const t = i / barCount;
    const freq = Math.pow(10, logMin + t * logRange);
    const nextFreq = Math.pow(10, logMin + ((i + 1) / barCount) * logRange);
    const binStart = Math.max(0, Math.floor(freq / binWidth));
    const binEnd = Math.min(binCount - 1, Math.ceil(nextFreq / binWidth));

    let sum = MIN_DB;
    let count = 0;
    for (let b = binStart; b <= binEnd; b++) {
      const val = smoothedBins[b];
      if (count === 0) sum = val;
      else sum = 10 * Math.log10(Math.pow(10, sum / 10) + Math.pow(10, val / 10));
      count++;
    }
    if (count > 1) sum -= 10 * Math.log10(count);

    const db = sum + tiltCompensation(freq);
    const y = dbToY(Math.max(MIN_DB, Math.min(MAX_DB, db)), h);
    const x = freqToX((freq + nextFreq) / 2, w);

    if (first) { ctx.moveTo(x, y); first = false; }
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

export const spectrumAnalyzer: ScopeRenderer = {
  id: 'spectrum',
  name: 'Spectrum',

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dataSource: DeckDataSource,
  ): void {
    renderSpectrum(ctx, width, height, dataSource);
  },

  dispose(): void {
    smoothedBins = null;
    gridCanvas = null;
  },
};
