import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';

const MIN_LUFS = -60;
const MAX_LUFS = 0;
const LUFS_RANGE = MAX_LUFS - MIN_LUFS;
const TARGET_LUFS = -14;
const PAD_L = 32;
const PAD_R = 8;

const TICKS = [-48, -36, -24, -18, -14, -9, -6, -3, 0];

// K-weighting filter coefficients (ITU-R BS.1770-4)
// Pre-filter: high shelf ~+4 dB above ~1.7 kHz
// RLB filter: high-pass ~38 Hz
interface BiquadCoeffs { b0: number; b1: number; b2: number; a1: number; a2: number }
interface BiquadState { x1: number; x2: number; y1: number; y2: number }

const PRE_F0 = 1681.9744509555319;
const PRE_GAIN_DB = 3.999843853973347;
const PRE_Q = 0.7071752369554193;
const RLB_F0 = 38.13547087613982;
const RLB_Q = 0.5003270373223665;

function preFilterCoeffs(sr: number): BiquadCoeffs {
  const K = Math.tan(Math.PI * PRE_F0 / sr);
  const Vh = Math.pow(10, PRE_GAIN_DB / 20);
  const Vb = Math.pow(Vh, 0.499666774155997);
  const KK = K * K;
  const a0 = 1 + K / PRE_Q + KK;
  return {
    b0: (Vh + (Vb * K) / PRE_Q + KK) / a0,
    b1: (2 * (KK - Vh)) / a0,
    b2: (Vh - (Vb * K) / PRE_Q + KK) / a0,
    a1: (2 * (KK - 1)) / a0,
    a2: (1 - K / PRE_Q + KK) / a0,
  };
}

function rlbFilterCoeffs(sr: number): BiquadCoeffs {
  const K = Math.tan(Math.PI * RLB_F0 / sr);
  const KK = K * K;
  const a0 = 1 + K / RLB_Q + KK;
  return {
    b0: 1, b1: -2, b2: 1,
    a1: (2 * (KK - 1)) / a0,
    a2: (1 - K / RLB_Q + KK) / a0,
  };
}

function bqState(): BiquadState { return { x1: 0, x2: 0, y1: 0, y2: 0 }; }

function bqApply(c: BiquadCoeffs, s: BiquadState, x: number): number {
  const y = c.b0 * x + c.b1 * s.x1 + c.b2 * s.x2 - c.a1 * s.y1 - c.a2 * s.y2;
  s.x2 = s.x1; s.x1 = x;
  s.y2 = s.y1; s.y1 = y;
  return y;
}

// State
let preL = bqState(), preR = bqState();
let rlbL = bqState(), rlbR = bqState();
let preCo: BiquadCoeffs | null = null;
let rlbCo: BiquadCoeffs | null = null;
let lastSR = 0;

// Ring buffer for K-weighted squared samples (3s at 48 kHz ≈ 144k entries)
// We store per-frame averages, not per-sample — one entry per rAF tick
const HIST_LEN = 180; // ~3s at 60fps
let histL = new Float32Array(HIST_LEN);
let histR = new Float32Array(HIST_LEN);
let histPos = 0;
let histFilled = 0;

let momentaryLUFS = MIN_LUFS;
let shortTermLUFS = MIN_LUFS;
let integratedLUFS = MIN_LUFS;
let integratedSum = 0;
let integratedCount = 0;

let gridCanvas: OffscreenCanvas | null = null;
let gridKey = '';

function lufsToX(lufs: number, w: number): number {
  const norm = Math.max(0, Math.min(1, (lufs - MIN_LUFS) / LUFS_RANGE));
  return PAD_L + norm * (w - PAD_L - PAD_R);
}

function themeColor(prop: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
}

function ensureGrid(w: number, h: number): OffscreenCanvas | null {
  if (w < 1 || h < 1) return null;
  const dpr = window.devicePixelRatio || 1;
  const gc = themeColor('--mc-scope-grid', 'rgba(255,255,255,0.06)');
  const key = `${w}|${h}|${dpr}|${gc}`;
  if (gridCanvas && gridKey === key) return gridCanvas;

  gridKey = key;
  gridCanvas = new OffscreenCanvas(Math.round(w * dpr), Math.round(h * dpr));
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(dpr, dpr);
  ctx.font = '9px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.strokeStyle = gc;
  ctx.lineWidth = 0.5;

  for (const tick of TICKS) {
    const x = lufsToX(tick, w);
    if (x < PAD_L || x > w - PAD_R) continue;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.fillStyle = tick === TARGET_LUFS
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(255, 255, 255, 0.25)';
    ctx.fillText(`${tick}`, x, 10);
  }
  return gridCanvas;
}

function ensureCoeffs(sr: number): void {
  if (sr === lastSR && preCo) return;
  lastSR = sr;
  preCo = preFilterCoeffs(sr);
  rlbCo = rlbFilterCoeffs(sr);
}

function kWeightedMeanSquare(samples: Float32Array, pre: BiquadCoeffs, rlb: BiquadCoeffs, preS: BiquadState, rlbS: BiquadState): number {
  let sum = 0;
  for (let i = 0; i < samples.length; i++) {
    const kw = bqApply(rlb, rlbS, bqApply(pre, preS, samples[i]));
    sum += kw * kw;
  }
  return sum / samples.length;
}

function powerToLUFS(power: number): number {
  if (power < 1e-10) return MIN_LUFS;
  return Math.max(MIN_LUFS, -0.691 + 10 * Math.log10(power));
}

function drawBar(ctx: CanvasRenderingContext2D, w: number, y: number, h: number, lufs: number, color: string): void {
  const end = lufsToX(lufs, w);
  if (end <= PAD_L) return;
  ctx.fillStyle = color;
  ctx.fillRect(PAD_L, y, end - PAD_L, h);
}

function drawTarget(ctx: CanvasRenderingContext2D, w: number, y0: number, h: number): void {
  const x = lufsToX(TARGET_LUFS, w);
  ctx.setLineDash([3, 3]);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y0);
  ctx.lineTo(x, y0 + h);
  ctx.stroke();
  ctx.setLineDash([]);
}

function render(ctx: CanvasRenderingContext2D, w: number, h: number, dataSource: DeckDataSource): void {
  const sr = dataSource.getSampleRate();
  ensureCoeffs(sr);

  const left = dataSource.getLeftTimeDomainData();
  const right = dataSource.getRightTimeDomainData();

  // K-weight and compute mean square for this frame
  const msL = kWeightedMeanSquare(left, preCo!, rlbCo!, preL, rlbL);
  const msR = kWeightedMeanSquare(right, preCo!, rlbCo!, preR, rlbR);

  // Store in ring buffer
  histL[histPos] = msL;
  histR[histPos] = msR;
  histPos = (histPos + 1) % HIST_LEN;
  if (histFilled < HIST_LEN) histFilled++;

  // Momentary: last ~400ms ≈ 24 frames at 60fps
  const momFrames = Math.min(24, histFilled);
  let momSumL = 0, momSumR = 0;
  for (let i = 0; i < momFrames; i++) {
    const idx = (histPos - 1 - i + HIST_LEN) % HIST_LEN;
    momSumL += histL[idx];
    momSumR += histR[idx];
  }
  momentaryLUFS = powerToLUFS((momSumL + momSumR) / momFrames);

  // Short-term: last ~3s = full buffer
  const stFrames = histFilled;
  let stSumL = 0, stSumR = 0;
  for (let i = 0; i < stFrames; i++) {
    const idx = (histPos - 1 - i + HIST_LEN) % HIST_LEN;
    stSumL += histL[idx];
    stSumR += histR[idx];
  }
  shortTermLUFS = powerToLUFS((stSumL + stSumR) / stFrames);

  // Integrated: running average with absolute gate (-70 LUFS)
  const framePower = msL + msR;
  const frameLUFS = powerToLUFS(framePower);
  if (frameLUFS > -70) {
    integratedSum += framePower;
    integratedCount++;
    integratedLUFS = powerToLUFS(integratedSum / integratedCount);
  }

  // ─── Draw ───
  ctx.fillStyle = themeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
  ctx.fillRect(0, 0, w, h);

  const grid = ensureGrid(Math.round(w), Math.round(h));
  if (grid) ctx.drawImage(grid, 0, 0, w, h);

  const topPad = 14;
  const gap = 3;
  const usableH = h - topPad - gap * 4;
  const barH = Math.max(4, usableH / 3);

  const yM = topPad + gap;
  const yS = yM + barH + gap;
  const yI = yS + barH + gap;

  // Labels
  ctx.font = '9px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('M', PAD_L - 4, yM + barH / 2 + 3);
  ctx.fillText('S', PAD_L - 4, yS + barH / 2 + 3);
  ctx.fillText('I', PAD_L - 4, yI + barH / 2 + 3);

  // Bars — color coded: indigo normal, amber near target, red above 0
  drawBar(ctx, w, yM, barH, momentaryLUFS, '#4834d4');
  drawBar(ctx, w, yS, barH, shortTermLUFS, '#6366f1');
  drawBar(ctx, w, yI, barH, integratedLUFS, '#818cf8');

  // Target line
  drawTarget(ctx, w, topPad, h - topPad);

  // Numeric readouts
  ctx.font = '9px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  const fmtLufs = (v: number) => v <= MIN_LUFS + 1 ? '-∞' : v.toFixed(1);
  ctx.fillText(fmtLufs(momentaryLUFS), w - PAD_R, yM + barH / 2 + 3);
  ctx.fillText(fmtLufs(shortTermLUFS), w - PAD_R, yS + barH / 2 + 3);
  ctx.fillText(fmtLufs(integratedLUFS), w - PAD_R, yI + barH / 2 + 3);

}

export const lufsMeter: ScopeRenderer = {
  id: 'lufs',
  name: 'LUFS Meter',
  render,
  dispose(): void {
    momentaryLUFS = shortTermLUFS = integratedLUFS = MIN_LUFS;
    integratedSum = 0;
    integratedCount = 0;
    histL = new Float32Array(HIST_LEN);
    histR = new Float32Array(HIST_LEN);
    histPos = 0;
    histFilled = 0;
    preL = bqState(); preR = bqState();
    rlbL = bqState(); rlbR = bqState();
    gridCanvas = null;
    gridKey = '';
    lastSR = 0;
    preCo = null;
    rlbCo = null;
  },
};
