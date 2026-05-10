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
        className={`flex transition-colors ${shuffle ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
      >
        <Shuffle className="w-4 h-4" />
      </button>
      <button
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous track"
        className="mc-interactive-muted transition-colors disabled:opacity-30"
      >
        <SkipBack className="w-4 h-4" />
      </button>
      <button
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:opacity-85 active:scale-95"
        style={{ backgroundColor: 'var(--mc-text-primary)', color: 'var(--mc-text-inverse)' }}
      >
        {isPlaying ? <Pause className="w-[18px] h-[18px]" /> : <Play className="w-[18px] h-[18px] ml-0.5" />}
      </button>
      <button
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next track"
        className="mc-interactive-muted transition-colors disabled:opacity-30"
      >
        <SkipForward className="w-4 h-4" />
      </button>
      <button
        onClick={onToggleRepeat}
        aria-label={`Repeat: ${repeatMode}`}
        aria-pressed={repeatMode !== 'off'}
        className={`flex transition-colors ${repeatMode !== 'off' ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
      >
        <RepeatIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default memo(TransportControls);
