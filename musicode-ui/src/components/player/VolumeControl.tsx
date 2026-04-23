import { memo, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

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

  return (
    <>
      <button
        onClick={handleMuteToggle}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        className="text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
        className="w-20 h-1 appearance-none bg-zinc-700 rounded-full cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-200
          [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-zinc-200 [&::-moz-range-thumb]:border-0
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
        style={{
          background: `linear-gradient(to right, rgb(161 161 170) ${pct}%, rgb(63 63 70) ${pct}%)`,
        }}
      />
    </>
  );
}

export default memo(VolumeControl);
