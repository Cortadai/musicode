import { usePlayer } from '../../hooks/usePlayer';
import { getCoverUrl } from '../../api/albums';
import { formatDuration } from '../../utils/format';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Disc3 } from 'lucide-react';
import { useCallback, useRef } from 'react';

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    queueIndex,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(ratio * duration);
    },
    [duration, seek]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(ratio);
    },
    [setVolume]
  );

  if (!currentTrack) return null;

  const albumId = currentTrack.album?.id;
  const hasCover = currentTrack.album?.hasCoverArt;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasNext = queueIndex < queue.length - 1;
  const hasPrev = queueIndex > 0 || currentTime > 3;

  return (
    <div className="h-20 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 gap-4 shrink-0">
      {/* Track info */}
      <div className="flex items-center gap-3 w-56 shrink-0">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
          {hasCover && albumId ? (
            <img src={getCoverUrl(albumId)} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="w-6 h-6 text-zinc-600" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-100 truncate">{currentTrack.title}</p>
          <p className="text-xs text-zinc-500 truncate">
            {currentTrack.artist?.name ?? 'Unknown'}
          </p>
        </div>
      </div>

      {/* Controls + progress */}
      <div className="flex-1 flex flex-col items-center gap-1 max-w-2xl mx-auto">
        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            disabled={!hasPrev}
            className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={isPlaying ? pause : resume}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={next}
            disabled={!hasNext}
            className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-[11px] text-zinc-500 tabular-nums w-10 text-right">
            {formatDuration(Math.floor(currentTime))}
          </span>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer group relative"
          >
            <div
              className="h-full bg-zinc-100 rounded-full group-hover:bg-indigo-400 transition-colors relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" />
            </div>
          </div>
          <span className="text-[11px] text-zinc-500 tabular-nums w-10">
            {formatDuration(Math.floor(duration))}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-36 shrink-0 justify-end">
        <button
          onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
          className="text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div
          ref={volumeRef}
          onClick={handleVolumeClick}
          className="w-20 h-1 bg-zinc-700 rounded-full cursor-pointer group"
        >
          <div
            className="h-full bg-zinc-400 rounded-full group-hover:bg-zinc-200 transition-colors"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
