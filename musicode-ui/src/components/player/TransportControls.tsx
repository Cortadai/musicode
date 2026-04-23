import { memo } from 'react';
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
} from 'lucide-react';
import type { RepeatMode } from '../../context/PlayerContext';

interface Props {
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: RepeatMode;
  hasNext: boolean;
  hasPrev: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

function TransportControls({
  isPlaying, shuffle, repeatMode,
  hasNext, hasPrev,
  onPlayPause, onNext, onPrev, onToggleShuffle, onToggleRepeat,
}: Props) {
  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div className="flex items-center gap-3" role="group" aria-label="Playback controls">
      <button
        onClick={onToggleShuffle}
        aria-label="Shuffle"
        aria-pressed={shuffle}
        className={`transition-colors ${shuffle ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Shuffle className="w-4 h-4" />
      </button>
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous track"
        className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 transition-colors"
      >
        <SkipBack className="w-4 h-4" />
      </button>
      <button
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next track"
        className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 transition-colors"
      >
        <SkipForward className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleRepeat}
        aria-label={`Repeat: ${repeatMode}`}
        aria-pressed={repeatMode !== 'off'}
        className={`transition-colors ${repeatMode !== 'off' ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <RepeatIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default memo(TransportControls);
