import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface Props {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

function VolumeControl({ volume, onVolumeChange }: Props) {
  const [showPopover, setShowPopover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const hideTimerRef = useRef<number>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const pct = volume * 100;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const handleMuteToggle = useCallback(
    () => onVolumeChange(volume > 0 ? 0 : 0.8),
    [volume, onVolumeChange],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      onVolumeChange(Math.max(0, Math.min(1, volume + delta)));
    },
    [volume, onVolumeChange],
  );

  const handleMouseEnter = useCallback(() => {
    clearTimeout(hideTimerRef.current);
    setShowPopover(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (dragging) return;
    hideTimerRef.current = window.setTimeout(() => setShowPopover(false), 300);
  }, [dragging]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    return () => clearTimeout(hideTimerRef.current);
  }, []);

  const handleSliderMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(true);
      const track = e.currentTarget;
      const update = (clientY: number) => {
        const rect = track.getBoundingClientRect();
        const ratio = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
        onVolumeChange(ratio);
      };
      update(e.clientY);
      const onMove = (ev: MouseEvent) => update(ev.clientY);
      const onUp = () => {
        setDragging(false);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [onVolumeChange],
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleMuteToggle}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        className="mc-interactive-muted transition-colors shrink-0"
      >
        <VolumeIcon className="w-4 h-4" />
      </button>
      {showPopover && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 border rounded-lg px-2.5 py-3 shadow-xl z-50 flex flex-col items-center gap-2"
          style={{
            backgroundColor: 'var(--mc-bg-surface-hover)',
            borderColor: 'var(--mc-waveform-buffered)',
          }}
        >
          <button
            onClick={() => onVolumeChange(0.8)}
            aria-label={`Volume ${Math.round(pct)}% — click to reset`}
            className="text-[10px] font-mono tabular-nums hover:opacity-75 transition-opacity"
            style={{ color: 'var(--mc-accent-primary)' }}
          >
            {Math.round(pct)}%
          </button>
          <div
            className="relative flex justify-center cursor-pointer"
            style={{ width: '20px', height: '80px' }}
            onMouseDown={handleSliderMouseDown}
            role="slider"
            aria-label="Volume"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pct)}
            aria-valuetext={`${Math.round(pct)}%`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
                e.preventDefault();
                onVolumeChange(Math.min(1, volume + 0.05));
              } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
                e.preventDefault();
                onVolumeChange(Math.max(0, volume - 0.05));
              }
            }}
          >
            <div
              className="absolute w-[3px] h-full rounded-full"
              style={{ backgroundColor: 'var(--mc-waveform-buffered)' }}
            />
            <div
              className="absolute w-[3px] rounded-full bottom-0"
              style={{ height: `${pct}%`, backgroundColor: 'var(--mc-text-secondary)' }}
            />
            <div
              className="absolute w-2.5 h-2.5 rounded-full shadow-sm"
              style={{
                left: '50%',
                top: `${(1 - volume) * 100}%`,
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--mc-accent-primary)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(VolumeControl);
