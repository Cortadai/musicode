import { memo, useCallback, useEffect, useRef } from 'react';
import type { Track } from '../../types';
import { formatDuration } from '../../utils/format';
import { useCurrentTrackInfo } from '../../context/PlayerContext';
import { Play } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  showAlbum: boolean;
  isCurrent: boolean;
  isPlaying: boolean;
  isScrollTarget: boolean;
  scrollTargetRef?: React.Ref<HTMLDivElement>;
  onPlay?: (track: Track, index: number) => void;
}

const TrackRow = memo(function TrackRow({
  track, index, showAlbum, isCurrent, isPlaying,
  isScrollTarget, scrollTargetRef, onPlay,
}: TrackRowProps) {
  const handleClick = useCallback(
    () => onPlay?.(track, index),
    [onPlay, track, index]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPlay?.(track, index);
      }
    },
    [onPlay, track, index]
  );

  const artistName = track.artist?.name ?? 'Unknown';

  return (
    <div
      ref={isScrollTarget ? scrollTargetRef : undefined}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Play ${track.title} by ${artistName}`}
      aria-current={isCurrent ? 'true' : undefined}
      className={`flex items-center gap-4 px-4 py-2.5 rounded-lg cursor-pointer transition-colors group
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
        isCurrent ? '' : 'mc-nav-item'
      }`}
      style={{
        ...(isCurrent ? { backgroundColor: 'var(--mc-bg-surface-hover)' } : {}),
        ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
        ['--tw-ring-offset-color' as string]: 'var(--mc-bg-surface)',
      }}
    >
      <span className="w-8 text-right text-xs tabular-nums relative">
        {isCurrent && isPlaying ? (
          <span className="text-sm" style={{ color: 'var(--mc-accent-primary)' }}>♪</span>
        ) : (
          <>
            <span className="group-hover:hidden" style={{ color: 'var(--mc-text-muted)' }}>
              {track.trackNumber ?? '—'}
            </span>
            <span className="hidden group-hover:inline" style={{ color: 'var(--mc-text-primary)' }}>
              <Play className="w-3.5 h-3.5 inline" />
            </span>
          </>
        )}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color: isCurrent ? 'var(--mc-accent-primary)' : 'var(--mc-text-primary)', fontWeight: isCurrent ? 500 : undefined }}>
          {track.title}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--mc-text-muted)' }}>
          {track.artist?.name ?? 'Unknown'}
          {showAlbum && track.album && ` · ${track.album.title}`}
        </p>
      </div>
      <span className="text-xs tabular-nums" style={{ color: 'var(--mc-text-muted)' }}>
        {formatDuration(track.duration)}
      </span>
    </div>
  );
});

interface Props {
  tracks: Track[];
  showAlbum?: boolean;
  scrollToTrackId?: number;
  onPlay?: (track: Track, index: number) => void;
}

export default function TrackList({ tracks, showAlbum = false, scrollToTrackId, onPlay }: Props) {
  const { trackId: currentTrackId, isPlaying } = useCurrentTrackInfo();
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
      requestAnimationFrame(() => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  }, [scrollToTrackId, tracks]);

  return (
    <div className="space-y-0.5">
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          index={index}
          showAlbum={showAlbum}
          isCurrent={currentTrackId === track.id}
          isPlaying={isPlaying}
          isScrollTarget={track.id === scrollToTrackId}
          scrollTargetRef={scrollTargetRef}
          onPlay={onPlay}
        />
      ))}
    </div>
  );
}
