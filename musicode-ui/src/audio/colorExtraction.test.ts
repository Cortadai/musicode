import { extractColors, getCachedPalette, clearColorCache } from './colorExtraction';

function makeImageData(r: number, g: number, b: number): Uint8ClampedArray {
  const size = 64 * 64 * 4;
  const data = new Uint8ClampedArray(size);
  for (let i = 0; i < size; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  return data;
}

let mockImageData: Uint8ClampedArray;
let mockImageLoadFails = false;

beforeEach(() => {
  clearColorCache();
  mockImageData = makeImageData(120, 80, 200);
  mockImageLoadFails = false;

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage: vi.fn(),
    getImageData: () => ({ data: mockImageData }),
  } as unknown as CanvasRenderingContext2D);

  // Mock Image constructor to auto-fire onload
  class MockImage {
    crossOrigin = '';
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    private _src = '';
    get src() { return this._src; }
    set src(v: string) {
      this._src = v;
      setTimeout(() => {
        if (mockImageLoadFails) this.onerror?.();
        else this.onload?.();
      }, 0);
    }
  }
  vi.stubGlobal('Image', MockImage);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('colorExtraction', () => {
  it('extracts colors from uniform image', async () => {
    const palette = await extractColors(999);
    expect(palette.primary).toMatch(/^#[0-9a-f]{6}$/);
    expect(palette.secondary).toMatch(/^#[0-9a-f]{6}$/);
    expect(palette.background).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('caches results by albumId', async () => {
    const first = await extractColors(888);
    const second = await extractColors(888);
    expect(first).toBe(second);
    expect(getCachedPalette(888)).toBe(first);
  });

  it('returns fallback when image fails to load', async () => {
    mockImageLoadFails = true;
    const palette = await extractColors(777);
    expect(palette.primary).toBe('#818cf8');
    expect(palette.background).toBe('#18181b');
  });

  it('returns fallback colors for all-black image', async () => {
    mockImageData = makeImageData(0, 0, 0);
    const palette = await extractColors(666);
    expect(palette.primary).toBe('#818cf8');
  });

  it('getCachedPalette returns undefined for unknown albumId', () => {
    expect(getCachedPalette(12345)).toBeUndefined();
  });
});
