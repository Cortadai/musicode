import {
  computeFilterMagnitude,
  computeCombinedMagnitude,
  freqToX,
  xToFreq,
  dbToY,
  yToDb,
  formatFreqLabel,
  computeCurvePaths,
  computeSpectrumPath,
} from './eqMath';
import type { EqBand } from './eqProcessor';

const SAMPLE_RATE = 44100;

function makeBand(overrides: Partial<EqBand> = {}): EqBand {
  return {
    id: 'test-1',
    type: 'peaking',
    frequency: 1000,
    gain: 6,
    Q: 1.0,
    ...overrides,
  };
}

describe('computeFilterMagnitude', () => {
  it('returns 0 dB at all frequencies for a flat (0 gain) peaking filter', () => {
    const band = makeBand({ gain: 0 });
    expect(computeFilterMagnitude(band, 100, SAMPLE_RATE)).toBeCloseTo(0, 2);
    expect(computeFilterMagnitude(band, 1000, SAMPLE_RATE)).toBeCloseTo(0, 2);
    expect(computeFilterMagnitude(band, 10000, SAMPLE_RATE)).toBeCloseTo(0, 2);
  });

  it('peaks near center frequency for peaking filter with positive gain', () => {
    const band = makeBand({ frequency: 1000, gain: 6, Q: 1.0 });
    const atCenter = computeFilterMagnitude(band, 1000, SAMPLE_RATE);
    const atFarBelow = computeFilterMagnitude(band, 50, SAMPLE_RATE);
    const atFarAbove = computeFilterMagnitude(band, 15000, SAMPLE_RATE);
    expect(atCenter).toBeGreaterThan(5);
    expect(atCenter).toBeLessThanOrEqual(6.1);
    expect(atFarBelow).toBeCloseTo(0, 0);
    expect(atFarAbove).toBeCloseTo(0, 0);
  });

  it('lowshelf boosts below center frequency', () => {
    const band = makeBand({ type: 'lowshelf', frequency: 200, gain: 6, Q: 0.707 });
    const atLow = computeFilterMagnitude(band, 50, SAMPLE_RATE);
    const atHigh = computeFilterMagnitude(band, 10000, SAMPLE_RATE);
    expect(atLow).toBeGreaterThan(3);
    expect(atHigh).toBeCloseTo(0, 0);
  });

  it('highshelf boosts above center frequency', () => {
    const band = makeBand({ type: 'highshelf', frequency: 5000, gain: 6, Q: 0.707 });
    const atLow = computeFilterMagnitude(band, 100, SAMPLE_RATE);
    const atHigh = computeFilterMagnitude(band, 15000, SAMPLE_RATE);
    expect(atLow).toBeCloseTo(0, 0);
    expect(atHigh).toBeGreaterThan(3);
  });

  it('highpass cuts below frequency', () => {
    const band = makeBand({ type: 'highpass', frequency: 500, gain: 0, Q: 0.707 });
    const atLow = computeFilterMagnitude(band, 30, SAMPLE_RATE);
    const atHigh = computeFilterMagnitude(band, 5000, SAMPLE_RATE);
    expect(atLow).toBeLessThan(-10);
    expect(atHigh).toBeCloseTo(0, 0);
  });

  it('lowpass cuts above frequency', () => {
    const band = makeBand({ type: 'lowpass', frequency: 500, gain: 0, Q: 0.707 });
    const atLow = computeFilterMagnitude(band, 30, SAMPLE_RATE);
    const atHigh = computeFilterMagnitude(band, 10000, SAMPLE_RATE);
    expect(atLow).toBeCloseTo(0, 0);
    expect(atHigh).toBeLessThan(-10);
  });

  it('returns 0 for zero sample rate', () => {
    expect(computeFilterMagnitude(makeBand(), 1000, 0)).toBe(0);
  });
});

describe('computeCombinedMagnitude', () => {
  it('sums magnitudes of multiple bands', () => {
    const bands = [
      makeBand({ id: 'b1', frequency: 100, gain: 6, type: 'lowshelf', Q: 0.707 }),
      makeBand({ id: 'b2', frequency: 10000, gain: 6, type: 'highshelf', Q: 0.707 }),
    ];
    const atMid = computeCombinedMagnitude(bands, 1000, SAMPLE_RATE);
    const atLow = computeCombinedMagnitude(bands, 30, SAMPLE_RATE);
    expect(atLow).toBeGreaterThan(atMid);
  });

  it('returns 0 for empty bands', () => {
    expect(computeCombinedMagnitude([], 1000, SAMPLE_RATE)).toBe(0);
  });
});

describe('coordinate mapping', () => {
  it('freqToX and xToFreq are inverse', () => {
    const w = 400;
    for (const freq of [20, 100, 1000, 10000, 20000]) {
      const x = freqToX(freq, w);
      const back = xToFreq(x, w);
      expect(back).toBeCloseTo(freq, 0);
    }
  });

  it('dbToY and yToDb are inverse', () => {
    const h = 200;
    for (const db of [-12, -6, 0, 6, 12]) {
      const y = dbToY(db, h);
      const back = yToDb(y, h);
      expect(back).toBeCloseTo(db, 5);
    }
  });

  it('freqToX maps 20 Hz to 0 and 20 kHz to width', () => {
    expect(freqToX(20, 400)).toBeCloseTo(0, 1);
    expect(freqToX(20000, 400)).toBeCloseTo(400, 1);
  });

  it('dbToY maps +12 dB to top (0) and -12 dB to bottom (height)', () => {
    expect(dbToY(12, 200)).toBeCloseTo(0, 1);
    expect(dbToY(-12, 200)).toBeCloseTo(200, 1);
  });
});

describe('formatFreqLabel', () => {
  it('formats sub-1k frequencies as integers', () => {
    expect(formatFreqLabel(50)).toBe('50');
    expect(formatFreqLabel(200)).toBe('200');
  });

  it('formats 1k–10k with one decimal', () => {
    expect(formatFreqLabel(1000)).toBe('1.0k');
    expect(formatFreqLabel(5000)).toBe('5.0k');
  });

  it('formats 10k+ as integer k', () => {
    expect(formatFreqLabel(10000)).toBe('10k');
    expect(formatFreqLabel(20000)).toBe('20k');
  });
});

describe('computeCurvePaths', () => {
  it('returns empty strings for zero dimensions', () => {
    const result = computeCurvePaths([], true, SAMPLE_RATE, 0, 100);
    expect(result.curvePath).toBe('');
    expect(result.fillPath).toBe('');
  });

  it('returns valid SVG path data for flat bands', () => {
    const bands = [makeBand({ gain: 0 })];
    const { curvePath, fillPath } = computeCurvePaths(bands, true, SAMPLE_RATE, 400, 200);
    expect(curvePath).toMatch(/^M[\d.]+,[\d.]+ L/);
    expect(fillPath).toMatch(/^M[\d.]+,[\d.]+ L.*Z$/);
  });

  it('produces flat curve at 0 dB line when disabled', () => {
    const bands = [makeBand({ gain: 12 })];
    const { curvePath } = computeCurvePaths(bands, false, SAMPLE_RATE, 400, 200);
    const zeroY = dbToY(0, 200);
    const points = curvePath.replace(/^M/, '').split(' L');
    for (const pt of points) {
      const y = parseFloat(pt.split(',')[1]);
      expect(y).toBeCloseTo(zeroY, 0);
    }
  });
});

describe('computeSpectrumPath', () => {
  const W = 400;
  const H = 200;

  function makeFftData(binCount: number, fillDb: number): Float32Array {
    const data = new Float32Array(binCount);
    data.fill(fillDb);
    return data;
  }

  it('returns empty string for zero dimensions', () => {
    const data = makeFftData(1024, -40);
    expect(computeSpectrumPath(data, 1024, SAMPLE_RATE, 0, H)).toBe('');
    expect(computeSpectrumPath(data, 1024, SAMPLE_RATE, W, 0)).toBe('');
  });

  it('generates valid SVG path with M start and L segments', () => {
    const data = makeFftData(1024, -40);
    const path = computeSpectrumPath(data, 1024, SAMPLE_RATE, W, H);
    expect(path).toMatch(/^M[\d.]+,[\d.]+ L/);
  });

  it('maps silence (-80 dB) to bottom of chart', () => {
    const data = makeFftData(1024, -80);
    const path = computeSpectrumPath(data, 1024, SAMPLE_RATE, W, H);
    const points = path.replace(/^M/, '').split(' L');
    for (const pt of points) {
      const y = parseFloat(pt.split(',')[1]);
      expect(y).toBeCloseTo(H, 0);
    }
  });

  it('maps loud signal (-10 dB) to top of chart', () => {
    const data = makeFftData(1024, -10);
    const path = computeSpectrumPath(data, 1024, SAMPLE_RATE, W, H);
    const points = path.replace(/^M/, '').split(' L');
    for (const pt of points) {
      const y = parseFloat(pt.split(',')[1]);
      expect(y).toBeCloseTo(0, 0);
    }
  });

  it('clamps values below floor and above ceiling', () => {
    const data = makeFftData(1024, -200);
    const pathFloor = computeSpectrumPath(data, 1024, SAMPLE_RATE, W, H);
    const pointsFloor = pathFloor.replace(/^M/, '').split(' L');
    for (const pt of pointsFloor) {
      const y = parseFloat(pt.split(',')[1]);
      expect(y).toBeCloseTo(H, 0);
    }

    data.fill(10);
    const pathCeil = computeSpectrumPath(data, 1024, SAMPLE_RATE, W, H);
    const pointsCeil = pathCeil.replace(/^M/, '').split(' L');
    for (const pt of pointsCeil) {
      const y = parseFloat(pt.split(',')[1]);
      expect(y).toBeCloseTo(0, 0);
    }
  });

  it('handles non-finite values gracefully', () => {
    const data = makeFftData(1024, -40);
    data[0] = -Infinity;
    data[1] = NaN;
    const path = computeSpectrumPath(data, 1024, SAMPLE_RATE, W, H);
    expect(path).toMatch(/^M[\d.]+,[\d.]+/);
    expect(path).not.toContain('NaN');
    expect(path).not.toContain('Infinity');
  });
});
