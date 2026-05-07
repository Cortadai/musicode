import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';
import { getDeckOscilloscopeSpeed } from '../useDeckStore';

const GRID_H_LINES = [-1, -0.5, 0, 0.5, 1];
const GRID_H_LABELS = ['-1', '', '0', '', '+1'];
const GRID_V_DIVISIONS = 8;
const AUTO_GAIN_SMOOTHING = 0.92;
const MIN_GAIN = 1.5;
const MAX_GAIN = 12;
const SPEED_TO_SKIP: Record<number, number> = { 0.5: 4, 1: 2, 1.5: 1 };

const PITCH_MIN = 40;
const PITCH_MAX = 1000;
const PITCH_SMOOTHING = 0.92;
const DISPLAY_CYCLES = 2;
const MIN_DISPLAY_SAMPLES = 256;
const MAX_DISPLAY_SAMPLES = 2048;
const VISUAL_GAIN = 1.8;
const V_SCALE = 1.0;

let gridCanvas: OffscreenCanvas | null = null;
let gridW = 0;
let gridH = 0;
let gridDpr = 0;
let gridKey = '';
let currentGain = MIN_GAIN;
let frameCount = 0;
let smoothedPitch = 200;
let lastTriggerOffset = 0;

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

function detectPitchAutocorrelation(samples: Float32Array, sampleRate: number): number {
  const n = samples.length;
  const minLag = Math.floor(sampleRate / PITCH_MAX);
  const maxLag = Math.min(Math.ceil(sampleRate / PITCH_MIN), n >> 1);

  let rms = 0;
  for (let i = 0; i < n; i++) rms += samples[i] * samples[i];
  rms = Math.sqrt(rms / n);
  if (rms < 0.005) return -1;

  let bestCorr = 0;
  let bestLag = -1;

  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    let norm1 = 0;
    let norm2 = 0;
    const count = n - lag;
    for (let i = 0; i < count; i++) {
      sum += samples[i] * samples[i + lag];
      norm1 += samples[i] * samples[i];
      norm2 += samples[i + lag] * samples[i + lag];
    }
    const denom = Math.sqrt(norm1 * norm2);
    if (denom < 1e-10) continue;
    const corr = sum / denom;

    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  if (bestCorr < 0.5 || bestLag <= 0) return -1;
  return sampleRate / bestLag;
}

function findTriggerPitchLocked(
  samples: Float32Array,
  fftSize: number,
  displaySamples: number,
  periodSamples: number,
): number {
  const searchEnd = Math.min(fftSize - displaySamples, 2048);

  let bestOffset = -1;
  let bestDistance = Infinity;

  for (let i = 1; i < searchEnd; i++) {
    if (samples[i - 1] < 0 && samples[i] >= 0) {
      const peakCheck = Math.min(Math.floor(periodSamples / 4), 64);
      let peak = 0;
      for (let j = 0; j < peakCheck && (i + j) < fftSize; j++) {
        const v = Math.abs(samples[i + j]);
        if (v > peak) peak = v;
      }
      if (peak < 0.005) continue;

      if (lastTriggerOffset > 0) {
        const dist = Math.abs(i - lastTriggerOffset) % periodSamples;
        const periodDist = Math.min(dist, periodSamples - dist);
        if (periodDist < bestDistance) {
          bestDistance = periodDist;
          bestOffset = i;
        }
      } else {
        bestOffset = i;
        break;
      }
    }
  }

  if (bestOffset >= 0) {
    lastTriggerOffset = bestOffset;
    return bestOffset;
  }

  for (let i = 1; i < searchEnd; i++) {
    if (samples[i - 1] <= 0 && samples[i] > 0) return i;
  }
  return 0;
}

function ensureGrid(w: number, h: number): void {
  if (w < 1 || h < 1) return;
  const dpr = window.devicePixelRatio || 1;
  const gridColor = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.08)');
  const key = `${w}|${h}|${dpr}|${gridColor}`;
  if (gridCanvas && gridKey === key) return;

  gridW = w;
  gridH = h;
  gridDpr = dpr;
  gridKey = key;
  gridCanvas = new OffscreenCanvas(Math.round(w * dpr), Math.round(h * dpr));
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.font = '9px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.textAlign = 'right';

  for (let i = 0; i < GRID_H_LINES.length; i++) {
    const amp = GRID_H_LINES[i];
    const y = ((1 - amp) / 2) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
    if (GRID_H_LABELS[i]) {
      ctx.fillText(GRID_H_LABELS[i], w - 4, y - 3);
    }
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 1; i < GRID_V_DIVISIONS; i++) {
    const x = (i / GRID_V_DIVISIONS) * w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
}

let cachedFillGradient: CanvasGradient | null = null;
let gradientH = 0;
let cachedLineColor = '';

function ensureFillGradient(ctx: CanvasRenderingContext2D, h: number, lineColor: string): CanvasGradient {
  if (cachedFillGradient && gradientH === h && cachedLineColor === lineColor) return cachedFillGradient;
  cachedLineColor = lineColor;
  gradientH = h;
  const rgb = parseRgb(lineColor);
  const [r, g, b] = rgb ?? [129, 140, 248];
  const mid = h / 2;
  const grad = ctx.createLinearGradient(0, mid, 0, 0);
  grad.addColorStop(0, `rgba(${r},${g},${b},0.0)`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0.22)`);
  cachedFillGradient = grad;
  return grad;
}

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dataSource: DeckDataSource,
): void {
  frameCount++;
  const skip = SPEED_TO_SKIP[getDeckOscilloscopeSpeed()] ?? 4;
  if (frameCount % skip !== 0) return;

  const samples = dataSource.getTimeDomainData();
  const fftSize = dataSource.getFFTSize();
  const sampleRate = dataSource.getSampleRate();

  const bgColor = getThemeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  ensureGrid(Math.round(w), Math.round(h));
  if (gridCanvas) {
    ctx.drawImage(gridCanvas, 0, 0, w, h);
  }

  const detectedPitch = detectPitchAutocorrelation(samples, sampleRate);
  let displaySamples: number;
  let periodSamples: number;

  if (detectedPitch > 0) {
    smoothedPitch = smoothedPitch * PITCH_SMOOTHING + detectedPitch * (1 - PITCH_SMOOTHING);
    periodSamples = Math.round(sampleRate / smoothedPitch);
    displaySamples = Math.min(MAX_DISPLAY_SAMPLES, Math.max(MIN_DISPLAY_SAMPLES, periodSamples * DISPLAY_CYCLES));
  } else {
    periodSamples = Math.round(sampleRate / smoothedPitch);
    displaySamples = Math.min(MAX_DISPLAY_SAMPLES, Math.max(MIN_DISPLAY_SAMPLES, periodSamples * DISPLAY_CYCLES));
  }

  if (displaySamples > fftSize - 512) displaySamples = fftSize - 512;

  const triggerStart = findTriggerPitchLocked(samples, fftSize, displaySamples, periodSamples);

  let peak = 0;
  for (let i = 0; i < displaySamples; i++) {
    const abs = Math.abs(samples[triggerStart + i] ?? 0);
    if (abs > peak) peak = abs;
  }
  const targetGain = peak > 0.001 ? Math.min(MAX_GAIN, 0.8 / peak) : MIN_GAIN;
  currentGain = currentGain * AUTO_GAIN_SMOOTHING + targetGain * (1 - AUTO_GAIN_SMOOTHING);
  const gain = Math.max(MIN_GAIN, Math.min(VISUAL_GAIN, currentGain));

  const lineColor = getThemeColor('--mc-scope-line', '#818cf8');
  const mid = h / 2;

  ctx.beginPath();
  ctx.moveTo(0, mid);
  for (let i = 0; i < displaySamples; i++) {
    const x = (i / displaySamples) * w;
    const sample = (samples[triggerStart + i] ?? 0) * gain;
    const clamped = Math.max(-1, Math.min(1, sample));
    const y = mid - clamped * mid * V_SCALE;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, mid);
  ctx.closePath();
  ctx.fillStyle = ensureFillGradient(ctx, h, lineColor);
  ctx.fill();

  ctx.beginPath();
  for (let i = 0; i < displaySamples; i++) {
    const x = (i / displaySamples) * w;
    const sample = (samples[triggerStart + i] ?? 0) * gain;
    const clamped = Math.max(-1, Math.min(1, sample));
    const y = mid - clamped * mid * V_SCALE;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

export const oscilloscope: ScopeRenderer = {
  id: 'oscilloscope',
  name: 'Oscilloscope',
  render,
  dispose(): void {
    gridCanvas = null;
    cachedFillGradient = null;
    currentGain = MIN_GAIN;
    smoothedPitch = 200;
    lastTriggerOffset = 0;
    frameCount = 0;
  },
};
