import { useCallback, useRef, useMemo, useEffect } from 'react';
import type { EqBand } from '../../audio/eqProcessor';
import { isPassFilter, GAIN_MIN, GAIN_MAX, FREQ_MIN, FREQ_MAX } from '../../audio/eqProcessor';
import {
  computeCombinedMagnitude,
  computeCurvePaths,
  computeSpectrumPath,
  freqToX,
  xToFreq,
  dbToY,
  yToDb,
  formatFreqLabel,
  FREQ_GRID,
  DB_GRID,
} from '../../audio/eqMath';
import { getEqFrequencyData, getEqSampleRate, getEqBinCount, disposeEqAnalyser } from '../../audio/eqSpectrumSource';

interface EqFrequencyResponseProps {
  bands: EqBand[];
  enabled: boolean;
  selectedBandIndex: number | null;
  onBandDrag: (index: number, updates: Partial<EqBand>) => void;
  onBandSelect: (index: number) => void;
  sampleRate: number;
  width: number;
  height: number;
  showSpectrum?: boolean;
}

export default function EqFrequencyResponse({
  bands,
  enabled,
  selectedBandIndex,
  onBandDrag,
  onBandSelect,
  sampleRate,
  width,
  height,
  showSpectrum = false,
}: EqFrequencyResponseProps) {
  const draggingRef = useRef<number | null>(null);
  const dragOffsetRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const spectrumPathRef = useRef<SVGPathElement>(null);
  const spectrumFillRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!showSpectrum || width <= 0 || height <= 0) return;

    const tick = () => {
      const data = getEqFrequencyData();
      if (data && spectrumPathRef.current && spectrumFillRef.current) {
        const binCount = getEqBinCount();
        const sr = getEqSampleRate();
        const path = computeSpectrumPath(data, binCount, sr, width, height);
        spectrumPathRef.current.setAttribute('d', path);
        spectrumFillRef.current.setAttribute('d', path ? `${path} L${width},${height} L0,${height} Z` : '');
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [showSpectrum, width, height]);

  useEffect(() => {
    return () => disposeEqAnalyser();
  }, []);

  const { curvePath, fillPath } = useMemo(
    () => computeCurvePaths(bands, enabled, sampleRate, width, height),
    [bands, enabled, sampleRate, width, height],
  );

  const getSVGCoords = useCallback(
    (e: React.PointerEvent): { x: number; y: number } => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    },
    [],
  );

  const handlePointPointerDown = useCallback(
    (e: React.PointerEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      (e.currentTarget as SVGElement).setPointerCapture(e.pointerId);
      draggingRef.current = index;
      onBandSelect(index);

      const band = bands[index];
      if (band && !isPassFilter(band.type)) {
        const { y } = getSVGCoords(e);
        dragOffsetRef.current = band.gain - yToDb(y, height);
      } else {
        dragOffsetRef.current = 0;
      }
    },
    [bands, getSVGCoords, onBandSelect, height],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingRef.current === null) return;
      const band = bands[draggingRef.current];
      if (!band) return;
      const { x, y } = getSVGCoords(e);
      const freq = Math.round(Math.max(FREQ_MIN, Math.min(FREQ_MAX, xToFreq(x, width))));

      if (isPassFilter(band.type)) {
        onBandDrag(draggingRef.current, { frequency: freq });
        return;
      }

      const gain = Math.round(Math.max(GAIN_MIN, Math.min(GAIN_MAX, yToDb(y, height) + dragOffsetRef.current)) * 10) / 10;
      onBandDrag(draggingRef.current, { frequency: freq, gain });
    },
    [bands, getSVGCoords, onBandDrag, width, height],
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = null;
    dragOffsetRef.current = 0;
  }, []);

  if (width <= 0 || height <= 0) return null;

  const accentPrimary = 'var(--mc-accent-primary)';
  const accentHover = 'var(--mc-accent-primary-hover)';
  const gridColor = 'var(--mc-scrollbar-thumb)';
  const labelColor = 'var(--mc-text-muted)';
  const zeroLineColor = 'var(--mc-text-secondary)';
  const spectrumColor = 'var(--mc-text-secondary)';

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full h-full"
      style={{ touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Frequency grid lines */}
      {FREQ_GRID.map((f) => {
        const x = freqToX(f, width);
        return (
          <g key={`f-${f}`}>
            <line x1={x} y1={0} x2={x} y2={height} stroke={gridColor} strokeWidth={0.5} opacity={0.3} />
            <text
              x={x}
              y={height - 3}
              textAnchor="middle"
              fill={labelColor}
              fontSize={9}
              fontFamily="inherit"
            >
              {formatFreqLabel(f)}
            </text>
          </g>
        );
      })}

      {/* dB grid lines */}
      {DB_GRID.map((db) => {
        const y = dbToY(db, height);
        return (
          <g key={`db-${db}`}>
            <line
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={db === 0 ? zeroLineColor : gridColor}
              strokeWidth={db === 0 ? 1 : 0.5}
              opacity={db === 0 ? 0.5 : 0.3}
            />
            <text x={3} y={y - 3} fill={labelColor} fontSize={9} fontFamily="inherit">
              {db > 0 ? '+' : ''}{db}
            </text>
          </g>
        );
      })}

      {/* Spectrum analyzer overlay (behind EQ curve) */}
      {showSpectrum && (
        <>
          <path ref={spectrumFillRef} d="" fill={spectrumColor} opacity={0.08} />
          <path ref={spectrumPathRef} d="" fill="none" stroke={spectrumColor} strokeWidth={1} opacity={0.4} />
        </>
      )}

      {/* Fill under curve */}
      {fillPath && (
        <path d={fillPath} fill={accentPrimary} opacity={0.12} />
      )}

      {/* Curve line */}
      {curvePath && (
        <path d={curvePath} fill="none" stroke={accentPrimary} strokeWidth={2} opacity={0.9} />
      )}

      {/* Band control points */}
      {enabled &&
        bands.map((band, i) => {
          const pass = isPassFilter(band.type);
          const cx = freqToX(band.frequency, width);
          const pointDb = computeCombinedMagnitude(bands, band.frequency, sampleRate);
          const cy = dbToY(Math.max(GAIN_MIN - 2, Math.min(GAIN_MAX + 2, pointDb)), height);
          const selected = selectedBandIndex === i;

          return (
            <g
              key={band.id}
              onPointerDown={(e) => handlePointPointerDown(e, i)}
              style={{ cursor: 'grab', touchAction: 'none' }}
            >
              {/* Vertical guide for pass filters */}
              {pass && (
                <line
                  x1={cx} y1={0} x2={cx} y2={height}
                  stroke={accentPrimary}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  opacity={0.4}
                />
              )}

              {/* Invisible hit area */}
              {pass ? (
                <polygon
                  points={`${cx},${cy - 14} ${cx + 14},${cy} ${cx},${cy + 14} ${cx - 14},${cy}`}
                  fill="transparent"
                />
              ) : (
                <circle cx={cx} cy={cy} r={14} fill="transparent" />
              )}

              {/* Visible shape */}
              {pass ? (
                <polygon
                  points={`${cx},${cy - 7} ${cx + 7},${cy} ${cx},${cy + 7} ${cx - 7},${cy}`}
                  fill={selected ? accentHover : accentPrimary}
                  stroke={selected ? 'white' : 'none'}
                  strokeWidth={selected ? 1.5 : 0}
                  opacity={0.9}
                />
              ) : (
                <circle
                  cx={cx}
                  cy={cy}
                  r={selected ? 7 : 6}
                  fill={selected ? accentHover : accentPrimary}
                  stroke={selected ? 'white' : 'none'}
                  strokeWidth={selected ? 1.5 : 0}
                  opacity={0.9}
                />
              )}
            </g>
          );
        })}
    </svg>
  );
}
