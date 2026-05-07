import type { ScopeRenderer } from '../types';
import type { DeckDataSource } from '../../../audio/analyzerDeckDataSource';
import { getDeckWaveformSpeed } from '../useDeckStore';

const BASE_SCROLL_PX = 2;
const GRID_LINES = 4;

let waterfall: OffscreenCanvas | null = null;
let wfCtx: OffscreenCanvasRenderingContext2D | null = null;
let wfW = 0;
let wfH = 0;
let initialized = false;

function getThemeColor(prop: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
}

function parseRgb(color: string): [number, number, number] {
  const m = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i);
  if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  const m2 = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m2) return [+m2[1], +m2[2], +m2[3]];
  return [72, 52, 212];
}

function ensureWaterfall(w: number, h: number): void {
  if (w < 2 || h < 2) return;
  if (waterfall && wfW === w && wfH === h) return;

  wfW = w;
  wfH = h;
  waterfall = new OffscreenCanvas(w, h);
  wfCtx = waterfall.getContext('2d');
  initialized = false;
}

function render(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dataSource: DeckDataSource,
): void {
  const bg = getThemeColor('--mc-deck-bg', 'rgb(8, 8, 20)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const pw = Math.round(w);
  const ph = Math.round(h);
  ensureWaterfall(pw, ph);
  if (!waterfall || !wfCtx) return;

  if (!initialized) {
    wfCtx.fillStyle = bg;
    wfCtx.fillRect(0, 0, pw, ph);
    initialized = true;
  }

  const samplesL = dataSource.getLeftTimeDomainData();
  const samplesR = dataSource.getRightTimeDomainData();
  const fftSize = dataSource.getFFTSize();
  const lineColor = getThemeColor('--mc-scope-line', '#4834d4');
  const [cr, cg, cb] = parseRgb(lineColor);

  const scroll = Math.max(1, Math.round(BASE_SCROLL_PX * getDeckWaveformSpeed()));
  const laneH = ph / 2;

  wfCtx.drawImage(waterfall, -scroll, 0);
  wfCtx.fillStyle = bg;
  wfCtx.fillRect(pw - scroll, 0, scroll, ph);

  for (let col = 0; col < scroll; col++) {
    const x = pw - scroll + col;

    const chunkSize = Math.floor(fftSize / scroll);
    const offset = col * chunkSize;

    let minL = 1, maxL = -1;
    let minR = 1, maxR = -1;
    for (let i = 0; i < chunkSize; i++) {
      const sL = samplesL[offset + i] ?? 0;
      const sR = samplesR[offset + i] ?? 0;
      if (sL < minL) minL = sL;
      if (sL > maxL) maxL = sL;
      if (sR < minR) minR = sR;
      if (sR > maxR) maxR = sR;
    }

    const peakL = Math.max(Math.abs(minL), Math.abs(maxL));
    const peakR = Math.max(Math.abs(minR), Math.abs(maxR));
    const alphaL = Math.min(1, peakL * 2.5);
    const alphaR = Math.min(1, peakR * 2.5);

    const midL = laneH / 2;
    const y1L = midL - (maxL * midL);
    const y2L = midL - (minL * midL);
    if (y2L - y1L > 0.5) {
      wfCtx.fillStyle = `rgba(${cr},${cg},${cb},${alphaL.toFixed(2)})`;
      wfCtx.fillRect(x, y1L, 1, y2L - y1L);
    }

    const midR = laneH + laneH / 2;
    const y1R = midR - (maxR * (laneH / 2));
    const y2R = midR - (minR * (laneH / 2));
    if (y2R - y1R > 0.5) {
      wfCtx.fillStyle = `rgba(${cr},${cg},${cb},${alphaR.toFixed(2)})`;
      wfCtx.fillRect(x, y1R, 1, y2R - y1R);
    }
  }

  ctx.drawImage(waterfall, 0, 0, w, h);

  const gridColor = getThemeColor('--mc-scope-grid', 'rgba(255,255,255,0.08)');
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(0, laneH);
  ctx.lineTo(w, laneH);
  ctx.stroke();

  for (let lane = 0; lane < 2; lane++) {
    const top = lane * laneH;
    for (let i = 1; i <= GRID_LINES; i++) {
      const y = top + (i / (GRID_LINES + 1)) * laneH;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '9px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('L', 4, laneH - 4);
  ctx.fillText('R', 4, h - 4);
}

export const waveform: ScopeRenderer = {
  id: 'waveform',
  name: 'Waveform',
  render,
  dispose(): void {
    waterfall = null;
    wfCtx = null;
    initialized = false;
  },
};
