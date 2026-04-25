import { useRef, useEffect, useCallback } from 'react';

interface Props {
  peaks: number[];
  progress: number; // 0–1
  onSeek: (ratio: number) => void;
}

const BAR_WIDTH = 2;
const BAR_GAP = 1;
const MIN_HEIGHT_RATIO = 0.05;

const COLOR_PLAYED = 'rgba(244, 244, 245, 0.9)';
const COLOR_UNPLAYED = 'rgba(113, 113, 122, 0.5)';
const COLOR_PLAYED_OVERLAY = 'rgba(129, 140, 248, 0.15)';

export default function WaveformBar({ peaks, progress, onSeek }: Props) {
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

    for (let i = 0; i < barCount; i++) {
      const peakIdx = Math.floor((i / barCount) * peaks.length);
      const peak = peaks[peakIdx] ?? 0;
      const barH = Math.max(h * peak, h * MIN_HEIGHT_RATIO);
      const x = i * barStep;
      const y = (h - barH) / 2;

      ctx.fillStyle = x + BAR_WIDTH <= progressX ? COLOR_PLAYED : COLOR_UNPLAYED;
      ctx.fillRect(x, y, BAR_WIDTH, barH);
    }

    // Subtle glow overlay on played portion
    if (progressX > 0) {
      ctx.fillStyle = COLOR_PLAYED_OVERLAY;
      ctx.fillRect(0, 0, progressX, h);
    }
  }, [peaks, progress]);

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
      className="flex-1 h-8 cursor-pointer relative"
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
