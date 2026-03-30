import type { Track } from '../../types';
import { formatDuration } from '../../utils/format';
import { usePlayerState } from '../../context/PlayerContext';
import { Play } from 'lucide-react';

interface Props {
  tracks: Track[];
  showAlbum?: boolean;
  onPlay?: (track: Track, index: number) => void;
}

export default function TrackList({ tracks, showAlbum = false, onPlay }: Props) {
  const { currentTrack, isPlaying } = usePlayerState();

  return (
    <div className="space-y-0.5">
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.id === track.id;
        return (
          <div
            key={track.id}
            onClick={() => onPlay?.(track, index)}
            className={`flex items-center gap-4 px-4 py-2.5 rounded-lg cursor-pointer transition-colors group ${
              isCurrent ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
            }`}
          >
            <span className="w-8 text-right text-xs tabular-nums relative">
              {isCurrent && isPlaying ? (
                <span className="text-indigo-400 text-sm">♪</span>
              ) : (
                <>
                  <span className="group-hover:hidden text-zinc-500">
                    {track.trackNumber ?? '—'}
                  </span>
                  <span className="hidden group-hover:inline text-zinc-300">
                    <Play className="w-3.5 h-3.5 inline" />
                  </span>
                </>
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${isCurrent ? 'text-indigo-400 font-medium' : 'text-zinc-100'}`}>
                {track.title}
              </p>
              <p className="text-xs text-zinc-500 truncate">
                {track.artist?.name ?? 'Unknown'}
                {showAlbum && track.album && ` · ${track.album.title}`}
              </p>
            </div>
            <span className="text-xs text-zinc-500 tabular-nums">
              {formatDuration(track.duration)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
