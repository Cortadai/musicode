/**
 * Heat scale color mapping for spectrum analyzer.
 *
 * Builds a 256-entry LUT mapping normalized dB values (0–1) to RGBA colors.
 * Interpolates between 3 control colors: cold (silence) → warm (mid) → hot (peak).
 */

const LUT_SIZE = 256;

export interface HeatColors {
  cold: [number, number, number];  // RGB for silence
  warm: [number, number, number];  // RGB for mid energy
  hot: [number, number, number];   // RGB for peak energy
}

const DEFAULT_COLORS: HeatColors = {
  cold: [10, 10, 40],       // deep navy
  warm: [180, 40, 180],     // magenta
  hot: [255, 220, 140],     // warm peach
};

let currentLut: Uint8Array | null = null;
let currentColors: HeatColors = DEFAULT_COLORS;

function buildLut(colors: HeatColors): Uint8Array {
  const lut = new Uint8Array(LUT_SIZE * 4);
  const { cold, warm, hot } = colors;

  // Stop positions: cold at 0.0, warm at 0.45, hot at 1.0
  const stops: [number, [number, number, number]][] = [
    [0.0, cold],
    [0.45, warm],
    [1.0, hot],
  ];

  for (let i = 0; i < LUT_SIZE; i++) {
    const t = i / (LUT_SIZE - 1);
    const gamma = Math.pow(t, 1 / 1.4); // Gamma correction for perceptual distribution

    let seg = 0;
    for (let s = 1; s < stops.length; s++) {
      if (gamma <= stops[s][0]) { seg = s - 1; break; }
    }

    const [t0, c0] = stops[seg];
    const [t1, c1] = stops[seg + 1];
    const f = (gamma - t0) / (t1 - t0);

    const idx = i * 4;
    lut[idx] = Math.round(c0[0] + (c1[0] - c0[0]) * f);
    lut[idx + 1] = Math.round(c0[1] + (c1[1] - c0[1]) * f);
    lut[idx + 2] = Math.round(c0[2] + (c1[2] - c0[2]) * f);
    lut[idx + 3] = 255;
  }
  return lut;
}

export function getHeatLut(colors?: HeatColors): Uint8Array {
  const c = colors ?? DEFAULT_COLORS;
  if (currentLut && c === currentColors) return currentLut;
  currentColors = c;
  currentLut = buildLut(c);
  return currentLut;
}

export function heatColor(normalizedDb: number, lut: Uint8Array): string {
  const idx = Math.max(0, Math.min(LUT_SIZE - 1, Math.round(normalizedDb * (LUT_SIZE - 1)))) * 4;
  return `rgb(${lut[idx]},${lut[idx + 1]},${lut[idx + 2]})`;
}

export function normalizeDb(db: number, minDb: number, maxDb: number): number {
  return Math.max(0, Math.min(1, (db - minDb) / (maxDb - minDb)));
}
