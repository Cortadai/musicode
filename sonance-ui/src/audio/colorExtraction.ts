import { getCoverUrl } from '../api/albums';

export interface ColorPalette {
  primary: string;
  secondary: string;
  background: string;
}

const FALLBACK: ColorPalette = {
  primary: '#818cf8',    // indigo-400
  secondary: '#6366f1',  // indigo-500
  background: '#18181b', // zinc-900
};

const cache = new Map<number, ColorPalette>();

const SAMPLE_SIZE = 64;
const MIN_BRIGHTNESS = 105;
const MAX_BRIGHTNESS = 185;
const MIN_SATURATION = 0.45;

export function getCachedPalette(albumId: number): ColorPalette | undefined {
  return cache.get(albumId);
}

export function clearColorCache(): void {
  cache.clear();
}

export async function extractColors(albumId: number): Promise<ColorPalette> {
  const cached = cache.get(albumId);
  if (cached) return cached;

  try {
    const palette = await extractFromImage(getCoverUrl(albumId));
    cache.set(albumId, palette);
    return palette;
  } catch {
    return FALLBACK;
  }
}

function extractFromImage(src: string): Promise<ColorPalette> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(FALLBACK); return; }

        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        const colors = quantize(data);
        resolve(colors);
      } catch {
        reject(new Error('Canvas extraction failed'));
      }
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = src;
  });
}

interface RGB { r: number; g: number; b: number }

function quantize(data: Uint8ClampedArray): ColorPalette {
  const buckets = new Map<string, { sum: RGB; count: number }>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    // Skip near-black and near-white pixels
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    if (brightness < 30 || brightness > 240) continue;

    // Bucket to reduce noise (divide by 32 → 8 buckets per channel)
    const key = `${(r >> 5) << 5},${(g >> 5) << 5},${(b >> 5) << 5}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.sum.r += r;
      bucket.sum.g += g;
      bucket.sum.b += b;
      bucket.count++;
    } else {
      buckets.set(key, { sum: { r, g, b }, count: 1 });
    }
  }

  const scored = [...buckets.values()].map(bucket => {
    const avg = averageColor(bucket);
    const sat = rgbSaturation(avg);
    // Weight: sqrt(count) keeps large areas relevant but dampens dominance,
    // multiply by (1 + sat*2) so a fully saturated bucket scores 3x a grey one
    const score = Math.sqrt(bucket.count) * (1 + sat * 2);
    return { bucket, avg, score };
  });
  scored.sort((a, b) => b.score - a.score);

  if (scored.length === 0) return FALLBACK;

  const primary = scored[0].avg;
  const secondary = scored.length > 1 ? scored[1].avg : shiftHue(primary);
  const background = darken(primary, 0.2);

  return {
    primary: adjustBrightness(toHex(boostSaturation(primary))),
    secondary: adjustBrightness(toHex(boostSaturation(secondary))),
    background: toHex(background),
  };
}

function averageColor(bucket: { sum: RGB; count: number }): RGB {
  return {
    r: Math.round(bucket.sum.r / bucket.count),
    g: Math.round(bucket.sum.g / bucket.count),
    b: Math.round(bucket.sum.b / bucket.count),
  };
}

function darken(color: RGB, factor: number): RGB {
  return {
    r: Math.round(color.r * factor),
    g: Math.round(color.g * factor),
    b: Math.round(color.b * factor),
  };
}

function shiftHue(color: RGB): RGB {
  return { r: color.b, g: color.r, b: color.g };
}

function toHex(c: RGB): string {
  return `#${[c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

function rgbSaturation(c: RGB): number {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max === min) return 0;
  const l = (max + min) / 2;
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
}

function boostSaturation(color: RGB): RGB {
  const r = color.r / 255, g = color.g / 255, b = color.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return color; // achromatic, nothing to boost

  let s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
  if (s >= MIN_SATURATION) return color;

  let h = 0;
  const d = max - min;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  s = MIN_SATURATION;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
  };
}

function adjustBrightness(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  if (brightness >= MIN_BRIGHTNESS && brightness <= MAX_BRIGHTNESS) return hex;

  const target = brightness < MIN_BRIGHTNESS ? MIN_BRIGHTNESS : MAX_BRIGHTNESS;
  const factor = target / brightness;

  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v * factor)));
  return toHex({ r: clamp(r), g: clamp(g), b: clamp(b) });
}
