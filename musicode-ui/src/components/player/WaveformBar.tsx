import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../themes/useTheme';

interface Props {
  peaks: number[];
  progress: number; // 0–1
  onSeek: (ratio: number) => void;
}

const BAR_WIDTH = 3;
const BAR_GAP = 2;
const MIN_HEIGHT_RATIO = 0.06;

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function WaveformBar({ peaks, progress, onSeek }: Props) {
  const { theme } = useTheme();
  const colors = useMemo(() => ({
    played: hexToRgba(theme.tokens.accentPrimary, 0.95),
    unplayed: hexToRgba(theme.tokens.textMuted, 0.3),
    overlay: hexToRgba(theme.tokens.accentPrimary, 0.08),
  }), [theme.tokens.accentPrimary, theme.tokens.textMuted]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const barStep = BAR_WIDTH + BAR_GAP;
    const barCount = Math.floor(w / barStep);
    if (barCount === 0) return;

    const progressX = progress * w;

    const radius = BAR_WIDTH / 2;

    for (let i = 0; i < barCount; i++) {
      const peakIdx = Math.floor((i / barCount) * peaks.length);
      const peak = peaks[peakIdx] ?? 0;
      const barH = Math.max(h * peak, h * MIN_HEIGHT_RATIO);
      const x = i * barStep;
      const y = (h - barH) / 2;

      ctx.fillStyle = x + BAR_WIDTH <= progressX ? colors.played : colors.unplayed;
      ctx.beginPath();
      ctx.roundRect(x, y, BAR_WIDTH, barH, radius);
      ctx.fill();
    }

    if (progress > 0 && progress < 1) {
      const lineX = Math.round(progressX);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillRect(lineX - 1, 0, 2, h);
    }
  }, [peaks, progress, colors]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => draw());
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  const seekFromEvent = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(ratio);
    },
    [onSeek]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      draggingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      seekFromEvent(e.clientX);
    },
    [seekFromEvent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggingRef.current) seekFromEvent(e.clientX);
    },
    [seekFromEvent]
  );

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 h-14 cursor-pointer relative rounded-lg"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="slider"
      aria-label="Seek position"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}
