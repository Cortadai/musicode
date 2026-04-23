import { useCallback } from 'react';
import { formatDuration } from '../../utils/format';

interface Props {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export default function ProgressBar({ currentTime, duration, onSeek }: Props) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (duration === 0) return;
      onSeek((Number(e.target.value) / 100) * duration);
    },
    [duration, onSeek]
  );

  return (
    <div className="flex items-center gap-2 w-full">
      <span className="text-[11px] text-zinc-500 tabular-nums w-10 text-right">
        {formatDuration(Math.floor(currentTime))}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onChange={handleChange}
        aria-label="Seek position"
        aria-valuetext={`${formatDuration(Math.floor(currentTime))} of ${formatDuration(Math.floor(duration))}`}
        className="flex-1 h-1 appearance-none bg-zinc-700 rounded-full cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:hover:opacity-100
          [&::-webkit-slider-thumb]:transition-opacity [&::-webkit-slider-thumb]:shadow
          [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0
          hover:[&::-webkit-slider-thumb]:opacity-100
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
        style={{
          background: `linear-gradient(to right, rgb(244 244 245) ${progress}%, rgb(63 63 70) ${progress}%)`,
        }}
      />
      <span className="text-[11px] text-zinc-500 tabular-nums w-10">
        {formatDuration(Math.floor(duration))}
      </span>
    </div>
  );
}
