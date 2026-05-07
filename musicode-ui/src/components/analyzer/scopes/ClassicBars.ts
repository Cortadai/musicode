import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';

const BAR_COUNT = 32;
const MIN_FREQ = 30;
const MAX_FREQ = 16000;
const GAP_RATIO = 0.35;
const SMOOTHING = 0.82;

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

let smoothed: Float32Array | null = null;

let gridCanvas: OffscreenCanvas | null = null;
let gridW = 0;
let gridH = 0;
let gridDpr = 0;
let gridColor = '';

const GRID_LEVELS = [0.25, 0.5, 0.75];

function ensureGridCache(w: number, h: number): void {
  if (w < 1 || h < 1) return;
  const dpr = window.devicePixelRatio || 1;
  const color = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.08)');
  if (gridCanvas && gridW === w && gridH === h && gridDpr === dpr && gridColor === color) return;
  gridW = w;
  gridH = h;
  gridDpr = dpr;
  gridColor = color;
  gridCanvas = new OffscreenCanvas(Math.round(w * dpr), Math.round(h * dpr));
  const ctx = gridCanvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(dpr, dpr);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  for (const level of GRID_LEVELS) {
    const y = h * (1 - level);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

export const classicBars: ScopeRenderer = {
  id: 'classicBars',
  name: 'Classic Bars',

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    dataSource: DeckDataSource,
  ): void {
    ctx.fillStyle = getThemeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
    ctx.fillRect(0, 0, width, height);

    try { ensureGridCache(width, height); } catch { /* skip */ }
    if (gridCanvas) {
      const dpr = window.devicePixelRatio || 1;
      ctx.drawImage(gridCanvas, 0, 0, Math.round(width * dpr), Math.round(height * dpr), 0, 0, width, height);
    }

    const freqData = dataSource.getFrequencyData();
    const binCount = dataSource.getBinCount();
    const sampleRate = dataSource.getSampleRate();
    const nyquist = sampleRate / 2;
    const binWidth = nyquist / binCount;

    if (!smoothed || smoothed.length !== BAR_COUNT) {
      smoothed = new Float32Array(BAR_COUNT);
    }

    const logMin = Math.log10(MIN_FREQ);
    const logMax = Math.log10(MAX_FREQ);

    for (let i = 0; i < BAR_COUNT; i++) {
      const freqLo = Math.pow(10, logMin + (i / BAR_COUNT) * (logMax - logMin));
      const freqHi = Math.pow(10, logMin + ((i + 1) / BAR_COUNT) * (logMax - logMin));
      const binLo = Math.max(0, Math.floor(freqLo / binWidth));
      const binHi = Math.min(binCount - 1, Math.ceil(freqHi / binWidth));

      let peak = -120;
      for (let b = binLo; b <= binHi; b++) {
        if (freqData[b] > peak) peak = freqData[b];
      }

      const normalized = Math.max(0, Math.min(1, (peak + 90) / 80));
      smoothed[i] = smoothed[i] * SMOOTHING + normalized * (1 - SMOOTHING);
    }

    const lineColor = getThemeColor('--mc-scope-line', '#4834d4');
    const rgb = parseRgb(lineColor);
    const [r, g, b] = rgb ?? [72, 52, 212];

    const totalBarWidth = width / BAR_COUNT;
    const gap = totalBarWidth * GAP_RATIO;
    const barW = totalBarWidth - gap;

    for (let i = 0; i < BAR_COUNT; i++) {
      const value = smoothed[i];
      const barH = value * height * 0.92;
      const alpha = 0.25 + value * 0.45;
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fillRect(
        i * totalBarWidth + gap / 2,
        height - barH,
        barW,
        barH,
      );
    }
  },

  dispose(): void {
    smoothed = null;
    gridCanvas = null;
    gridW = 0;
    gridH = 0;
  },
};
