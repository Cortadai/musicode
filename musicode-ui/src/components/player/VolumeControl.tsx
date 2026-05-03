import { memo, useCallback } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface Props {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

function VolumeControl({ volume, onVolumeChange }: Props) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onVolumeChange(Number(e.target.value) / 100);
    },
    [onVolumeChange]
  );

  const handleMuteToggle = useCallback(
    () => onVolumeChange(volume > 0 ? 0 : 0.8),
    [volume, onVolumeChange]
  );

  const pct = volume * 100;
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleMuteToggle}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        className="mc-interactive-muted transition-colors shrink-0"
      >
        <VolumeIcon className="w-4 h-4" />
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={handleChange}
        aria-label="Volume"
        aria-valuetext={`${Math.round(pct)}%`}
        className="w-24 shrink-0 h-1 appearance-none rounded-full cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-0
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{
          background: `linear-gradient(to right, var(--mc-text-secondary) ${pct}%, var(--mc-waveform-buffered) ${pct}%)`,
          ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
          ['--tw-ring-offset-color' as string]: 'var(--mc-player-background)',
        }}
      />
      <button
        onClick={() => onVolumeChange(0.8)}
        aria-label={`Volume ${Math.round(pct)}% — click to reset`}
        className="text-xs font-mono tabular-nums cursor-pointer select-none hover:opacity-75 transition-opacity shrink-0"
        style={{ color: 'var(--mc-accent-primary)', background: 'none', border: 'none', padding: 0, minWidth: '1.5rem' }}
      >
        {Math.round(pct)}
      </button>
    </div>
  );
}

export default memo(VolumeControl);
