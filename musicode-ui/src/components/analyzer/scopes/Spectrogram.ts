import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';

const MIN_FREQ = 20;
const MAX_FREQ = 20000;
const MIN_DB = -90;
const MAX_DB = -12;
const DB_RANGE = MAX_DB - MIN_DB;
const TILT_DB_PER_OCTAVE = 4.0;
const TILT_REF_HZ = 1000;
const DISPLAY_GAIN_DB = 2;
const GAMMA = 1.6;

const LOG_MIN = Math.log10(MIN_FREQ);
const LOG_MAX = Math.log10(MAX_FREQ);
const LOG_RANGE = LOG_MAX - LOG_MIN;

// Heat color stops: black → deep navy → indigo (#4834d4) → bright blue → warm white
const HEAT_STOPS: [number, number, number, number, number][] = [
  // [position 0-1, r, g, b, a]
  [0.00,   0,   0,   0,   0],
  [0.10,   8,   4,  30, 255],
  [0.25,  30,  18, 100, 255],
  [0.45,  72,  52, 212, 255],
  [0.65, 110, 100, 240, 255],
  [0.82, 170, 165, 255, 255],
  [1.00, 235, 232, 255, 255],
];

let heatLUT: Uint8ClampedArray | null = null;

function ensureHeatLUT(): Uint8ClampedArray {
  if (heatLUT) return heatLUT;
  heatLUT = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let s0 = HEAT_STOPS[0];
    let s1 = HEAT_STOPS[HEAT_STOPS.length - 1];
    for (let j = 0; j < HEAT_STOPS.length - 1; j++) {
      if (t <= HEAT_STOPS[j + 1][0]) {
        s0 = HEAT_STOPS[j];
        s1 = HEAT_STOPS[j + 1];
        break;
      }
    }
    const span = Math.max(1e-6, s1[0] - s0[0]);
    const f = Math.max(0, Math.min(1, (t - s0[0]) / span));
    const idx = i * 4;
    heatLUT[idx]     = Math.round(s0[1] + (s1[1] - s0[1]) * f);
    heatLUT[idx + 1] = Math.round(s0[2] + (s1[2] - s0[2]) * f);
    heatLUT[idx + 2] = Math.round(s0[3] + (s1[3] - s0[3]) * f);
    heatLUT[idx + 3] = Math.round(s0[4] + (s1[4] - s0[4]) * f);
  }
  return heatLUT;
}

// Pre-compute row → frequency bin mapping for a given canvas height
let rowBins: Float32Array | null = null;
let rowTilt: Float32Array | null = null;
let mappedHeight = 0;
let mappedBinCount = 0;
let mappedSampleRate = 0;

function ensureRowMapping(height: number, binCount: number, sampleRate: number): void {
  if (rowBins && mappedHeight === height && mappedBinCount === binCount && mappedSampleRate === sampleRate) return;
  mappedHeight = height;
  mappedBinCount = binCount;
  mappedSampleRate = sampleRate;

  const nyquist = sampleRate / 2;
  const binWidth = nyquist / binCount;

  rowBins = new Float32Array(height);
  rowTilt = new Float32Array(height);

  for (let row = 0; row < height; row++) {
    // row 0 = top = high freq, row height-1 = bottom = low freq
    const normalizedPos = 1 - row / Math.max(1, height - 1);
    const freq = Math.pow(10, LOG_MIN + normalizedPos * LOG_RANGE);
    rowBins[row] = Math.max(0, Math.min(binCount - 1, freq / binWidth));
    rowTilt[row] = freq > 0 ? TILT_DB_PER_OCTAVE * Math.log2(freq / TILT_REF_HZ) : 0;
  }
}

// Waterfall state
let waterfallCanvas: OffscreenCanvas | null = null;
let waterfallCtx: OffscreenCanvasRenderingContext2D | null = null;
let wfW = 0;
let wfH = 0;
let columnImageData: ImageData | null = null;
let lastFFTSize = 0;

function ensureWaterfall(w: number, h: number): void {
  if (w < 1 || h < 1) return;
  if (waterfallCanvas && wfW === w && wfH === h) return;

  const oldCanvas = waterfallCanvas;
  const oldW = wfW;
  const oldH = wfH;

  wfW = w;
  wfH = h;
  waterfallCanvas = new OffscreenCanvas(w, h);
  waterfallCtx = waterfallCanvas.getContext('2d');
  if (!waterfallCtx) return;
  waterfallCtx.imageSmoothingEnabled = false;

  // Preserve existing waterfall content on resize — anchor right edge
  if (oldCanvas && oldW > 0 && oldH > 0) {
    const srcX = Math.max(0, oldW - w);
    const srcW = Math.min(oldW, w);
    const dstX = Math.max(0, w - oldW);
    waterfallCtx.drawImage(oldCanvas, srcX, 0, srcW, oldH, dstX, 0, srcW, h);
  }

  columnImageData = new ImageData(1, h);
}

// Frequency axis label grid overlay
let gridCanvas: OffscreenCanvas | null = null;
let gridKey = '';

const FREQ_LABELS: [number, string][] = [
  [50, '50'], [100, '100'], [200, '200'], [500, '500'],
  [1000, '1k'], [2000, '2k'], [5000, '5k'], [10000, '10k'],
];

function freqToRow(freq: number, height: number): number {
  const normalizedPos = (Math.log10(freq) - LOG_MIN) / LOG_RANGE;
  return (1 - normalizedPos) * (height - 1);
}

function getThemeColor(prop: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
}

function ensureGrid(w: number, h: number): void {
  if (w < 1 || h < 1) return;
  const dpr = window.devicePixelRatio || 1;
  const gridColor = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.06)');
  const key = `${w}|${h}|${dpr}|${gridColor}`;
  if (gridCanvas && gridKey === key) return;

  gridKey = key;
  gridCanvas = new OffscreenCanvas(Math.round(w * dpr), Math.round(h * dpr));
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;
  ctx.font = '9px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.textAlign = 'right';

  for (const [freq, label] of FREQ_LABELS) {
    const y = freqToRow(freq, h);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    ctx.fillText(label, w - 4, y - 3);
  }
}

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dataSource: DeckDataSource,
): void {
  const freqData = dataSource.getFrequencyData();
  const binCount = dataSource.getBinCount();
  const sampleRate = dataSource.getSampleRate();
  const currentFFT = dataSource.getFFTSize();

  if (lastFFTSize !== 0 && lastFFTSize !== currentFFT) {
    waterfallCanvas = null;
    waterfallCtx = null;
    columnImageData = null;
  }
  lastFFTSize = currentFFT;

  ensureRowMapping(h, binCount, sampleRate);
  ensureWaterfall(Math.round(w), Math.round(h));
  ensureHeatLUT();

  if (!waterfallCtx || !waterfallCanvas || !columnImageData || !rowBins || !rowTilt || !heatLUT) return;

  // Build a 1-pixel column from the current frequency data
  const imgData = columnImageData.data;
  for (let row = 0; row < h; row++) {
    const centerBin = rowBins[row];
    const binLo = Math.floor(centerBin);
    const binHi = Math.min(binLo + 1, binCount - 1);
    const frac = centerBin - binLo;
    const db = freqData[binLo] * (1 - frac) + freqData[binHi] * frac;

    const displayDb = db + rowTilt[row] + DISPLAY_GAIN_DB;
    const normalized = Math.max(0, Math.min(1, (displayDb - MIN_DB) / DB_RANGE));
    const intensity = Math.pow(normalized, GAMMA);

    const lutIdx = Math.round(intensity * 255) * 4;
    const px = row * 4;
    imgData[px]     = heatLUT[lutIdx];
    imgData[px + 1] = heatLUT[lutIdx + 1];
    imgData[px + 2] = heatLUT[lutIdx + 2];
    imgData[px + 3] = Math.round(heatLUT[lutIdx + 3] * intensity);
  }

  // Shift waterfall left by 1px, paint new column at right edge
  const prevComposite = waterfallCtx.globalCompositeOperation;
  waterfallCtx.globalCompositeOperation = 'copy';
  waterfallCtx.drawImage(waterfallCanvas, -1, 0);
  waterfallCtx.globalCompositeOperation = prevComposite;
  waterfallCtx.putImageData(columnImageData, Math.round(w) - 1, 0);

  // Draw waterfall + grid to the visible canvas
  ctx.fillStyle = getThemeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(waterfallCanvas, 0, 0, w, h);

  ensureGrid(Math.round(w), Math.round(h));
  if (gridCanvas) {
    ctx.drawImage(gridCanvas, 0, 0, w, h);
  }
}

export const spectrogram: ScopeRenderer = {
  id: 'spectrogram',
  name: 'Spectrogram',
  render,
  dispose(): void {
    waterfallCanvas = null;
    waterfallCtx = null;
    columnImageData = null;
    gridCanvas = null;
    rowBins = null;
    rowTilt = null;
    heatLUT = null;
    lastFFTSize = 0;
  },
};
