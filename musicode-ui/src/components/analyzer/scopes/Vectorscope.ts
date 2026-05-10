import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';
import { getDeckVectorMode } from '../useDeckStore';

const PERSISTENCE_ALPHA = 0.10;
const POLAR_PERSISTENCE_ALPHA = 0.15;
const DISPLAY_SAMPLES = 1024;
const POLAR_DISPLAY_SAMPLES = 2048;
const AUTO_GAIN_SMOOTHING = 0.92;
const MIN_GAIN = 1.2;
const MAX_GAIN = 3.5;
const POLAR_MIN_GAIN = 3.0;
const POLAR_MAX_GAIN = 16;
const DOT_SIZE = 1.2;
const POLAR_DOT_SIZE = 0.9;
const PADDING = 4;

let gridCanvas: OffscreenCanvas | null = null;
let gridKey = '';

let trailCanvas: OffscreenCanvas | null = null;
let trailCtx: OffscreenCanvasRenderingContext2D | null = null;
let trailW = 0;
let trailH = 0;
let currentGain = MIN_GAIN;
let lastMode: 'lissajous' | 'polar' = 'lissajous';

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

function ensureGrid(w: number, h: number, mode: 'lissajous' | 'polar'): void {
  if (w < 1 || h < 1) return;
  const dpr = window.devicePixelRatio || 1;
  const gridColor = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.08)');
  const key = `${w}|${h}|${dpr}|${gridColor}|${mode}`;
  if (gridCanvas && gridKey === key) return;

  gridKey = key;
  const pw = Math.round(w * dpr);
  const ph = Math.round(h * dpr);
  gridCanvas = new OffscreenCanvas(pw, ph);
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);
  const cx = w / 2;
  const cy = h / 2;

  ctx.strokeStyle = gridColor;

  if (mode === 'lissajous') {
    ctx.lineWidth = 0.5;
    ctx.strokeRect(PADDING, PADDING, w - PADDING * 2, h - PADDING * 2);

    ctx.beginPath();
    ctx.moveTo(cx, PADDING);
    ctx.lineTo(cx, h - PADDING);
    ctx.moveTo(PADDING, cy);
    ctx.lineTo(w - PADDING, cy);
    ctx.stroke();

    ctx.lineWidth = 0.4;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(PADDING, PADDING);
    ctx.lineTo(w - PADDING, h - PADDING);
    ctx.moveTo(w - PADDING, PADDING);
    ctx.lineTo(PADDING, h - PADDING);
    ctx.stroke();
    ctx.setLineDash([]);
  } else {
    const radius = Math.min(w, h) / 2 - PADDING;

    // Concentric circles at 33%, 66%, 100%
    ctx.lineWidth = 0.4;
    for (const frac of [0.33, 0.66, 1.0]) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * frac, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial lines: L, R, M (center top), S (center bottom), and diagonals
    ctx.lineWidth = 0.4;
    ctx.setLineDash([3, 5]);
    const angles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, -(3 * Math.PI) / 4, -Math.PI / 2, -Math.PI / 4];
    for (const a of angles) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * radius, cy - Math.sin(a) * radius);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Labels
    const labelColor = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.08)');
    ctx.fillStyle = labelColor;
    ctx.font = `${9 * dpr / dpr}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('M', cx, PADDING + 8);
    ctx.fillText('L', PADDING + 6, cy - 2);
    ctx.fillText('R', w - PADDING - 6, cy - 2);
  }
}

function ensureTrail(w: number, h: number): void {
  const dpr = window.devicePixelRatio || 1;
  const pw = Math.round(w * dpr);
  const ph = Math.round(h * dpr);
  if (trailCanvas && trailW === pw && trailH === ph) return;
  trailW = pw;
  trailH = ph;
  trailCanvas = new OffscreenCanvas(pw, ph);
  trailCtx = trailCanvas.getContext('2d');
  if (trailCtx) {
    trailCtx.scale(dpr, dpr);
  }
}

function renderLissajous(
  trailCtx: OffscreenCanvasRenderingContext2D,
  leftData: Float32Array,
  rightData: Float32Array,
  count: number,
  gain: number,
  r: number, g: number, b: number,
  w: number, h: number,
): void {
  const plotL = PADDING;
  const plotT = PADDING;
  const plotW = w - PADDING * 2;
  const plotH = h - PADDING * 2;
  const cx = plotL + plotW / 2;
  const cy = plotT + plotH / 2;
  const halfW = plotW / 2;
  const halfH = plotH / 2;

  const segments = 4;
  const segLen = Math.floor(count / segments);
  for (let seg = 0; seg < segments; seg++) {
    const alpha = 0.25 + (seg / (segments - 1)) * 0.75;
    trailCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    const start = seg * segLen;
    const end = seg === segments - 1 ? count : (seg + 1) * segLen;
    for (let i = start; i < end; i++) {
      const L = Math.max(-1, Math.min(1, leftData[i] * gain));
      const R = Math.max(-1, Math.min(1, rightData[i] * gain));
      const px = cx + R * halfW;
      const py = cy - L * halfH;
      trailCtx.fillRect(px - DOT_SIZE / 2, py - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE);
    }
  }
}

function renderPolar(
  trailCtx: OffscreenCanvasRenderingContext2D,
  leftData: Float32Array,
  rightData: Float32Array,
  count: number,
  gain: number,
  r: number, g: number, b: number,
  w: number, h: number,
): void {
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2 - PADDING;
  const ds = POLAR_DOT_SIZE;

  const segments = 4;
  const segLen = Math.floor(count / segments);
  for (let seg = 0; seg < segments; seg++) {
    const alpha = 0.2 + (seg / (segments - 1)) * 0.6;
    trailCtx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
    const start = seg * segLen;
    const end = seg === segments - 1 ? count : (seg + 1) * segLen;
    for (let i = start; i < end; i++) {
      const L = leftData[i] * gain;
      const R = rightData[i] * gain;
      const mid = (L + R) * 0.5;
      const side = (L - R) * 0.5;
      const angle = Math.atan2(side, mid);
      const rawMag = Math.sqrt(mid * mid + side * side);
      // sqrt scaling pushes points outward — prevents center clumping
      const mag = Math.min(1, Math.sqrt(Math.min(1, rawMag)));
      const dist = mag * radius;
      const px = cx - Math.sin(angle) * dist;
      const py = cy - Math.cos(angle) * dist;
      trailCtx.fillRect(px - ds / 2, py - ds / 2, ds, ds);
    }
  }
}

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dataSource: DeckDataSource,
): void {
  const mode = getDeckVectorMode();
  const bg = getThemeColor('--mc-deck-bg', 'rgb(8, 8, 20)');

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  if (mode !== lastMode) {
    trailCanvas = null;
    trailCtx = null;
    currentGain = mode === 'polar' ? POLAR_MIN_GAIN : MIN_GAIN;
    lastMode = mode;
  }

  ensureTrail(w, h);
  if (trailCtx && trailCanvas) {
    const isPolar = mode === 'polar';
    const fadeAlpha = isPolar ? POLAR_PERSISTENCE_ALPHA : PERSISTENCE_ALPHA;

    trailCtx.save();
    trailCtx.resetTransform();
    trailCtx.globalCompositeOperation = 'destination-in';
    trailCtx.fillStyle = `rgba(0,0,0,${1 - fadeAlpha})`;
    trailCtx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);
    trailCtx.restore();

    const leftData = dataSource.getLeftTimeDomainData();
    const rightData = dataSource.getRightTimeDomainData();
    const lineColor = getThemeColor('--mc-scope-line', '#4834d4');
    const rgb = parseRgb(lineColor);
    const [r, g, b] = rgb ?? [72, 52, 212];
    const maxSamples = isPolar ? POLAR_DISPLAY_SAMPLES : DISPLAY_SAMPLES;
    const count = Math.min(maxSamples, leftData.length, rightData.length);

    let peak = 0;
    for (let i = 0; i < count; i++) {
      const absL = Math.abs(leftData[i]);
      const absR = Math.abs(rightData[i]);
      if (absL > peak) peak = absL;
      if (absR > peak) peak = absR;
    }
    const maxGain = isPolar ? POLAR_MAX_GAIN : MAX_GAIN;
    const minGain = isPolar ? POLAR_MIN_GAIN : MIN_GAIN;
    const targetGain = peak > 0.001 ? Math.min(maxGain, 0.7 / peak) : minGain;
    currentGain = currentGain * AUTO_GAIN_SMOOTHING + targetGain * (1 - AUTO_GAIN_SMOOTHING);
    const gain = Math.max(minGain, currentGain);

    if (isPolar) {
      renderPolar(trailCtx, leftData, rightData, count, gain, r, g, b, w, h);
    } else {
      renderLissajous(trailCtx, leftData, rightData, count, gain, r, g, b, w, h);
    }

    ctx.drawImage(trailCanvas, 0, 0, w, h);
  }

  ensureGrid(w, h, mode);
  if (gridCanvas) {
    ctx.drawImage(gridCanvas, 0, 0, w, h);
  }
}

export const vectorscope: ScopeRenderer = {
  id: 'vectorscope',
  name: 'Vectorscope',
  render,
  dispose(): void {
    gridCanvas = null;
    trailCanvas = null;
    trailCtx = null;
    currentGain = MIN_GAIN;
  },
};
