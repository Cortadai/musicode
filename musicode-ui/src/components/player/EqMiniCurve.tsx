import { useMemo } from 'react';
import type { EqBand } from '../../audio/eqProcessor';
import { computeCombinedMagnitude } from '../../audio/eqMath';
import { GAIN_MIN, GAIN_MAX } from '../../audio/eqProcessor';

const POINTS = 48;
const DB_RANGE = GAIN_MAX - GAIN_MIN;
const LOG_MIN = Math.log10(20);
const LOG_RANGE = Math.log10(20000) - LOG_MIN;
const SAMPLE_RATE = 48000;
const W = 48;
const H = 18;

interface EqMiniCurveProps {
  bands: readonly EqBand[];
  enabled: boolean;
}

export default function EqMiniCurve({ bands, enabled }: EqMiniCurveProps) {
  const curvePath = useMemo(() => {
    if (!enabled) return '';

    const pts: string[] = [];
    for (let i = 0; i <= POINTS; i++) {
      const x = (i / POINTS) * W;
      const freq = Math.pow(10, LOG_MIN + (i / POINTS) * LOG_RANGE);
      let db = computeCombinedMagnitude(bands, freq, SAMPLE_RATE);
      db = Math.max(GAIN_MIN - 2, Math.min(GAIN_MAX + 2, db));
      const y = ((GAIN_MAX - db) / DB_RANGE) * H;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M${pts.join(' L')}`;
  }, [bands, enabled]);

  if (!enabled) return null;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="pointer-events-none ml-0.5 shrink-0"
      style={{ width: W, height: H }}
      aria-hidden="true"
    >
      <path
        d={curvePath}
        fill="none"
        stroke="var(--mc-accent-primary, currentColor)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  );
}
