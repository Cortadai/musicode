import type { Track } from '../../types';
import { formatDuration } from '../../utils/format';
import { usePlayerState } from '../../context/PlayerContext';
import { Play } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';

interface Props {
  tracks: Track[];
  showAlbum?: boolean;
  scrollToTrackId?: number;
  onPlay?: (track: Track, index: number) => void;
}

export default function TrackList({ tracks, showAlbum = false, scrollToTrackId, onPlay }: Props) {
  const { currentTrack, isPlaying } = usePlayerState();
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);

  // Reset scroll flag when the target track changes
  useEffect(() => {
    hasScrolled.current = false;
  }, [scrollToTrackId]);

  // Scroll to the target track once after mount/change
  useEffect(() => {
    if (scrollToTrackId && scrollTargetRef.current && !hasScrolled.current) {
      hasScrolled.current = true;
      // Small delay to let the page finish layout
      requestAnimationFrame(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [scrollToTrackId, tracks]);

  return (
    <div className="space-y-0.5">
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.id === track.id;
        const isScrollTarget = track.id === scrollToTrackId;
        return (
          <div
            key={track.id}
            ref={isScrollTarget ? scrollTargetRef : undefined}
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
