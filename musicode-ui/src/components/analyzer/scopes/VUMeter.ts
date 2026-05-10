import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';
import { getDeckVuMode } from '../useDeckStore';

const MIN_DB = -60;
const MAX_DB = 0;
const DB_RANGE = MAX_DB - MIN_DB;
const PEAK_HOLD_MS = 750;
const PEAK_DECAY_DB_PER_S = 18;
const BAR_ATTACK_MS = 5;
const BAR_RELEASE_MS = 180;
const PAD_L = 32;
const PAD_R = 8;

const NEEDLE_MIN_ANGLE = -45;
const NEEDLE_MAX_ANGLE = 45;
const NEEDLE_OVERSHOOT = 8;

// Cassette-style VU ballistics (1st-order, asymmetric)
const NEEDLE_ATTACK = 12;
const NEEDLE_DECAY = 4;

const VU_TICKS = [-48, -36, -24, -18, -12, -9, -6, -3, 0];

let barLDb = MIN_DB;
let barRDb = MIN_DB;
let peakLDb = MIN_DB;
let peakRDb = MIN_DB;
let peakLTime = 0;
let peakRTime = 0;
let lastFrameTime = 0;

let needleL = 0;
let needleR = 0;

let gridCanvas: OffscreenCanvas | null = null;
let gridKey = '';

let needleGridCanvas: OffscreenCanvas | null = null;
let needleGridKey = '';

function rmsDb(samples: Float32Array, maxLen?: number): number {
  const len = maxLen ? Math.min(samples.length, maxLen) : samples.length;
  let sum = 0;
  for (let i = 0; i < len; i++) sum += samples[i] * samples[i];
  const rms = Math.sqrt(sum / len);
  if (rms < 1e-10) return MIN_DB;
  return Math.max(MIN_DB, 20 * Math.log10(rms));
}

function instPeakDb(samples: Float32Array, maxLen?: number): number {
  const len = maxLen ? Math.min(samples.length, maxLen) : samples.length;
  let peak = 0;
  for (let i = 0; i < len; i++) {
    const abs = Math.abs(samples[i]);
    if (abs > peak) peak = abs;
  }
  if (peak < 1e-10) return MIN_DB;
  return Math.max(MIN_DB, 20 * Math.log10(peak));
}

function correlation(left: Float32Array, right: Float32Array): number {
  let sumLR = 0, sumLL = 0, sumRR = 0;
  const len = Math.min(left.length, right.length);
  for (let i = 0; i < len; i++) {
    sumLR += left[i] * right[i];
    sumLL += left[i] * left[i];
    sumRR += right[i] * right[i];
  }
  const denom = Math.sqrt(sumLL * sumRR);
  return denom < 1e-10 ? 0 : sumLR / denom;
}

function smooth(current: number, target: number, dtMs: number, attackMs: number, releaseMs: number): number {
  const tau = target > current ? attackMs : releaseMs;
  const coeff = 1 - Math.exp(-dtMs / tau);
  return current + (target - current) * coeff;
}

function dbToX(db: number, w: number): number {
  const norm = Math.max(0, Math.min(1, (db - MIN_DB) / DB_RANGE));
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
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.strokeStyle = gc;
  ctx.lineWidth = 0.5;

  for (const tick of VU_TICKS) {
    const x = dbToX(tick, w);
    if (x < PAD_L || x > w - PAD_R) continue;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
    ctx.fillText(`${tick}`, x, 10);
  }
  return gridCanvas;
}

function drawBar(ctx: CanvasRenderingContext2D, w: number, y: number, h: number, db: number): void {
  const end = dbToX(db, w);
  if (end <= PAD_L) return;

  const x9 = dbToX(-9, w);
  const x3 = dbToX(-3, w);

  const safeEnd = Math.min(end, x9);
  if (safeEnd > PAD_L) {
    ctx.fillStyle = '#4834d4';
    ctx.fillRect(PAD_L, y, safeEnd - PAD_L, h);
  }
  if (end > x9) {
    const warmEnd = Math.min(end, x3);
    if (warmEnd > x9) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x9, y, warmEnd - x9, h);
    }
  }
  if (end > x3) {
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x3, y, end - x3, h);
  }
}

function drawPeak(ctx: CanvasRenderingContext2D, db: number, w: number, y: number, h: number): void {
  if (db <= MIN_DB + 1) return;
  const x = dbToX(db, w);
  ctx.fillStyle = db >= -3 ? '#ef4444' : 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(x - 1, y, 2, h);
}

function drawCorrelation(ctx: CanvasRenderingContext2D, corr: number, y: number, w: number, h: number): void {
  const barW = w - PAD_L - PAD_R;
  const x0 = PAD_L;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fillRect(x0, y, barW, h);

  const cx = x0 + barW / 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, y);
  ctx.lineTo(cx, y + h);
  ctx.stroke();

  const fill = (corr * barW) / 2;
  const absW = Math.abs(fill);
  if (absW > 0.5) {
    ctx.fillStyle = corr >= 0 ? 'rgba(72, 52, 212, 0.6)' : 'rgba(239, 68, 68, 0.6)';
    ctx.fillRect(corr >= 0 ? cx : cx + fill, y + 2, absW, h - 4);
  }

  ctx.font = '8px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.textAlign = 'left';
  ctx.fillText('-1', x0 + 2, y + h - 2);
  ctx.textAlign = 'center';
  ctx.fillText('C', cx, y + h - 2);
  ctx.textAlign = 'right';
  ctx.fillText('+1', x0 + barW - 2, y + h - 2);
}

// ─── Needle mode ───

const NEEDLE_SCALE_LABELS = ['-20', '', '-10', '', '-5', '-3', '0', '+1', '', '+3', ''];
const NEEDLE_NUM_TICKS = NEEDLE_SCALE_LABELS.length - 1;

function ensureNeedleGrid(w: number, h: number): OffscreenCanvas | null {
  if (w < 1 || h < 1) return null;
  const dpr = window.devicePixelRatio || 1;
  const accent = themeColor('--mc-scope-line', '#4834d4');
  const key = `needle|${w}|${h}|${dpr}|${accent}`;
  if (needleGridCanvas && needleGridKey === key) return needleGridCanvas;

  needleGridKey = key;
  needleGridCanvas = new OffscreenCanvas(Math.round(w * dpr), Math.round(h * dpr));
  const ctx = needleGridCanvas.getContext('2d');
  if (!ctx) return null;
  ctx.scale(dpr, dpr);

  const gap = 8;
  const meterW = (w - gap) / 2;
  drawNeedleFace(ctx as unknown as CanvasRenderingContext2D, 0, 0, meterW, h, 'L', accent);
  drawNeedleFace(ctx as unknown as CanvasRenderingContext2D, meterW + gap, 0, meterW, h, 'R', accent);
  return needleGridCanvas;
}

function drawNeedleFace(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  label: string, accent: string,
): void {
  const cx = x + w / 2;
  const bottom = y + h - 6;
  const needleLen = Math.min(h * 0.75, w * 0.45);
  const scaleRadius = needleLen - 8;

  // face background
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, x, y, w, h, 5);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // inner face
  const fm = 6;
  ctx.beginPath();
  roundRect(ctx, x + fm, y + fm, w - fm * 2, h - fm * 2 - 6, 3);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.fill();

  // scale ticks
  for (let i = 0; i <= NEEDLE_NUM_TICKS; i++) {
    const t = i / NEEDLE_NUM_TICKS;
    const angleDeg = NEEDLE_MIN_ANGLE + t * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE);
    const angleRad = (angleDeg - 90) * Math.PI / 180;
    const isLong = i % 2 === 0 || i >= 8;
    const innerR = scaleRadius - (isLong ? 10 : 6);
    const outerR = scaleRadius;
    const isRed = i >= 8;

    const x1 = cx + Math.cos(angleRad) * innerR;
    const y1 = bottom + Math.sin(angleRad) * innerR;
    const x2 = cx + Math.cos(angleRad) * outerR;
    const y2 = bottom + Math.sin(angleRad) * outerR;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isRed ? '#ef4444' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = isLong ? 1.5 : 0.8;
    ctx.stroke();
  }

  // scale labels
  const labelRadius = scaleRadius - 18;
  ctx.font = `bold ${Math.max(8, w * 0.045)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= NEEDLE_NUM_TICKS; i++) {
    if (!NEEDLE_SCALE_LABELS[i]) continue;
    const t = i / NEEDLE_NUM_TICKS;
    const angleDeg = NEEDLE_MIN_ANGLE + t * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE);
    const angleRad = (angleDeg - 90) * Math.PI / 180;
    const lx = cx + Math.cos(angleRad) * labelRadius;
    const ly = bottom + Math.sin(angleRad) * labelRadius;
    ctx.fillStyle = i >= 8 ? '#ef4444' : 'rgba(255, 255, 255, 0.3)';
    ctx.fillText(NEEDLE_SCALE_LABELS[i], lx, ly);
  }

  // red zone arc
  const redStart = (NEEDLE_MIN_ANGLE + (8 / NEEDLE_NUM_TICKS) * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE) - 90) * Math.PI / 180;
  const redEnd = (NEEDLE_MAX_ANGLE - 90) * Math.PI / 180;
  ctx.beginPath();
  ctx.arc(cx, bottom, scaleRadius + 2, redStart, redEnd);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // VU label
  ctx.font = `bold ${Math.max(10, w * 0.06)}px system-ui, sans-serif`;
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.5;
  ctx.textAlign = 'center';
  ctx.fillText('VU', cx, bottom - needleLen - 8);
  ctx.globalAlpha = 1;

  // channel label
  ctx.font = `bold ${Math.max(9, w * 0.05)}px system-ui, sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillText(label, cx, y + h - 2);

  // pivot dot
  ctx.beginPath();
  ctx.arc(cx, bottom, 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();

  ctx.restore();
}

function drawNeedle(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  pos: number, accent: string,
): void {
  const cx = x + w / 2;
  const bottom = y + h - 6;
  const needleLen = Math.min(h * 0.75, w * 0.45);

  const clamped = Math.max(0, Math.min(1.08, pos));
  const angleDeg = NEEDLE_MIN_ANGLE + clamped * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE + NEEDLE_OVERSHOOT);
  const angleRad = (angleDeg - 90) * Math.PI / 180;
  const tipX = cx + Math.cos(angleRad) * needleLen;
  const tipY = bottom + Math.sin(angleRad) * needleLen;

  // shadow
  ctx.beginPath();
  ctx.moveTo(cx + 1, bottom + 1);
  ctx.lineTo(tipX + 1, tipY + 1);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // glow
  ctx.beginPath();
  ctx.moveTo(cx, bottom);
  ctx.lineTo(tipX, tipY);
  ctx.strokeStyle = accent.replace(')', ', 0.2)').replace('rgb(', 'rgba(');
  ctx.lineWidth = 5;
  ctx.stroke();

  // main needle
  ctx.beginPath();
  ctx.moveTo(cx, bottom);
  ctx.lineTo(tipX, tipY);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}

// ─── Main render ───

function render(ctx: CanvasRenderingContext2D, w: number, h: number, dataSource: DeckDataSource): void {
  const now = performance.now();
  const dt = lastFrameTime > 0 ? now - lastFrameTime : 16;
  lastFrameTime = now;

  const mode = getDeckVuMode();

  ctx.fillStyle = themeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
  ctx.fillRect(0, 0, w, h);

  if (mode === 'needle') {
    // Same approach as cassette VU: byte frequency data, split in half
    const byteFreq = dataSource.getByteFrequencyData(128);
    const half = byteFreq.length / 2;
    let sumL = 0, sumR = 0;
    for (let i = 0; i < half; i++) {
      sumL += byteFreq[i];
      sumR += byteFreq[i + half];
    }
    const targetL = sumL / (half * 255);
    const targetR = sumR / (half * 255);

    const dtSec = Math.min(dt / 1000, 0.1);
    const rateL = targetL > needleL ? NEEDLE_ATTACK : NEEDLE_DECAY;
    const rateR = targetR > needleR ? NEEDLE_ATTACK : NEEDLE_DECAY;
    needleL += (targetL - needleL) * Math.min(1, rateL * dtSec);
    needleR += (targetR - needleR) * Math.min(1, rateR * dtSec);

    const gap = 8;
    const meterW = (w - gap) / 2;
    const meterH = h;

    const grid = ensureNeedleGrid(Math.round(w), Math.round(h));
    if (grid) ctx.drawImage(grid, 0, 0, w, h);

    const accent = themeColor('--mc-scope-line', '#4834d4');
    drawNeedle(ctx, 0, 0, meterW, meterH, needleL, accent);
    drawNeedle(ctx, meterW + gap, 0, meterW, meterH, needleR, accent);
  } else {
    const left = dataSource.getLeftTimeDomainData();
    const right = dataSource.getRightTimeDomainData();

    const rmsL = rmsDb(left, 512);
    const rmsR = rmsDb(right, 512);
    const pkL = instPeakDb(left, 512);
    const pkR = instPeakDb(right, 512);
    const corr = correlation(left, right);

    const levelL = rmsL + (pkL - rmsL) * 0.25;
    const levelR = rmsR + (pkR - rmsR) * 0.25;

    barLDb = smooth(barLDb, levelL, dt, BAR_ATTACK_MS, BAR_RELEASE_MS);
    barRDb = smooth(barRDb, levelR, dt, BAR_ATTACK_MS, BAR_RELEASE_MS);

    if (pkL >= peakLDb) { peakLDb = pkL; peakLTime = now; }
    else if (now - peakLTime > PEAK_HOLD_MS) peakLDb = Math.max(MIN_DB, peakLDb - PEAK_DECAY_DB_PER_S * (dt / 1000));

    if (pkR >= peakRDb) { peakRDb = pkR; peakRTime = now; }
    else if (now - peakRTime > PEAK_HOLD_MS) peakRDb = Math.max(MIN_DB, peakRDb - PEAK_DECAY_DB_PER_S * (dt / 1000));

    const gap = 4;
    const corrH = 12;
    const topPad = 14;
    const usableH = h - topPad - corrH - gap * 3;
    const barH = Math.max(4, usableH / 2);
    const yL = topPad + gap;
    const yR = yL + barH + gap;
    const yC = yR + barH + gap;

    const grid = ensureGrid(Math.round(w), Math.round(h));
    if (grid) ctx.drawImage(grid, 0, 0, w, h);

    ctx.font = '9px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('L', PAD_L - 4, yL + barH / 2 + 3);
    ctx.fillText('R', PAD_L - 4, yR + barH / 2 + 3);

    drawBar(ctx, w, yL, barH, barLDb);
    drawBar(ctx, w, yR, barH, barRDb);
    drawPeak(ctx, peakLDb, w, yL, barH);
    drawPeak(ctx, peakRDb, w, yR, barH);
    drawCorrelation(ctx, corr, yC, w, corrH);
  }
}

export const vuMeter: ScopeRenderer = {
  id: 'vu',
  name: 'VU Meter',
  render,
  dispose(): void {
    barLDb = barRDb = peakLDb = peakRDb = MIN_DB;
    peakLTime = peakRTime = lastFrameTime = 0;
    needleL = needleR = 0;
    gridCanvas = null;
    gridKey = '';
    needleGridCanvas = null;
    needleGridKey = '';
  },
};
