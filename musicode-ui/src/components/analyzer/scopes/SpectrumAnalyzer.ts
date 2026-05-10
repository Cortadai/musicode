import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';

const MIN_DB = -90;
const MAX_DB = -10;
const DB_RANGE = MAX_DB - MIN_DB;
const MIN_FREQ = 20;
const MAX_FREQ = 20000;
const TILT_DB_PER_OCTAVE = 3.0;
const TILT_REF_HZ = 1000;
const SMOOTHING = 0.85;
const LOG_MIN = Math.log10(MIN_FREQ);
const LOG_MAX = Math.log10(MAX_FREQ);
const LOG_RANGE = LOG_MAX - LOG_MIN;

const GRID_DB_STEPS = [-80, -60, -40, -20];
const GRID_FREQ_LABELS: [number, string][] = [
  [50, '50'], [100, '100'], [200, '200'], [500, '500'],
  [1000, '1k'], [2000, '2k'], [5000, '5k'], [10000, '10k'],
];

let smoothedBins: Float32Array | null = null;

let gridCanvas: OffscreenCanvas | null = null;
let gridW = 0;
let gridH = 0;
let gridDpr = 0;
let gridColors = '';

let cachedLineColor = '';
let cachedFillGradient: CanvasGradient | null = null;
let gradientH = 0;

function getThemeColor(prop: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
}

function parseRgb(color: string): [number, number, number] | null {
  let m = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
  if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}

function freqToX(freq: number, width: number): number {
  return ((Math.log10(freq) - LOG_MIN) / LOG_RANGE) * width;
}

function dbToY(db: number, height: number): number {
  return (1 - (db - MIN_DB) / DB_RANGE) * height;
}

function tiltCompensation(freq: number): number {
  if (freq <= 0) return 0;
  return TILT_DB_PER_OCTAVE * Math.log2(freq / TILT_REF_HZ);
}

function ensureGridCache(w: number, h: number): void {
  if (w < 1 || h < 1) return;
  const dpr = window.devicePixelRatio || 1;
  const currentGridColor = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.08)');
  if (gridCanvas && gridW === w && gridH === h && gridDpr === dpr && gridColors === currentGridColor) return;
  gridW = w;
  gridH = h;
  gridDpr = dpr;
  gridColors = currentGridColor;
  gridCanvas = new OffscreenCanvas(Math.round(w * dpr), Math.round(h * dpr));
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);
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
    ctx.fillText(`${db}dB`, w - 4, y - 3);
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

function ensureFillGradient(ctx: CanvasRenderingContext2D, h: number, lineColor: string): CanvasGradient {
  if (cachedFillGradient && gradientH === h && cachedLineColor === lineColor) return cachedFillGradient;
  cachedLineColor = lineColor;
  gradientH = h;
  const rgb = parseRgb(lineColor);
  const [r, g, b] = rgb ?? [72, 52, 212];
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.35)`);
  grad.addColorStop(0.6, `rgba(${r},${g},${b},0.12)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0.02)`);
  cachedFillGradient = grad;
  return grad;
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

  if (!smoothedBins || smoothedBins.length !== binCount) {
    smoothedBins = new Float32Array(binCount);
    smoothedBins.fill(MIN_DB);
  }

  for (let i = 0; i < binCount; i++) {
    const raw = Math.max(MIN_DB - 30, freqData[i]);
    smoothedBins[i] = smoothedBins[i] * SMOOTHING + raw * (1 - SMOOTHING);
  }

  ctx.fillStyle = getThemeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
  ctx.fillRect(0, 0, w, h);

  ensureGridCache(Math.round(w), Math.round(h));
  if (gridCanvas) {
    ctx.drawImage(gridCanvas, 0, 0, w, h);
  }

  const pointCount = Math.min(Math.round(w / 1.5), 512);
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < pointCount; i++) {
    const t = i / pointCount;
    const freq = Math.pow(10, LOG_MIN + t * LOG_RANGE);
    const nextT = (i + 1) / pointCount;
    const nextFreq = Math.pow(10, LOG_MIN + nextT * LOG_RANGE);

    const binStart = Math.max(0, Math.floor(freq / binWidth));
    const binEnd = Math.min(binCount - 1, Math.ceil(nextFreq / binWidth));

    let sum = MIN_DB;
    let count = 0;
    for (let b = binStart; b <= binEnd; b++) {
      const val = smoothedBins[b];
      if (count === 0) {
        sum = val;
      } else {
        sum = 10 * Math.log10(Math.pow(10, sum / 10) + Math.pow(10, val / 10));
      }
      count++;
    }
    if (count > 1) sum -= 10 * Math.log10(count);

    const db = sum + tiltCompensation(freq);
    const x = freqToX((freq + nextFreq) / 2, w);
    const y = dbToY(Math.max(MIN_DB, Math.min(MAX_DB, db)), h);
    points.push({ x, y });
  }

  const lineColor = getThemeColor('--mc-scope-line', '#4834d4');

  // Fill under the curve
  ctx.beginPath();
  ctx.moveTo(points[0].x, h);
  for (const p of points) ctx.lineTo(p.x, p.y);
  ctx.lineTo(points[points.length - 1].x, h);
  ctx.closePath();
  ctx.fillStyle = ensureFillGradient(ctx, h, lineColor);
  ctx.fill();

  // Stroke the line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2.5;
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
