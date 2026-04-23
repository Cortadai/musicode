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

  const sorted = [...buckets.values()]
    .sort((a, b) => b.count - a.count);

  if (sorted.length === 0) return FALLBACK;

  const primary = averageColor(sorted[0]);
  const secondary = sorted.length > 1 ? averageColor(sorted[1]) : shiftHue(primary);
  const background = darken(primary, 0.2);

  return {
    primary: adjustBrightness(toHex(primary)),
    secondary: adjustBrightness(toHex(secondary)),
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
