import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { Track } from '../../types';
import { formatDuration } from '../../utils/format';
import { useCurrentTrackInfo } from '../../context/PlayerContext';
import { Play, Disc3 } from 'lucide-react';
import { getCoverUrl } from '../../api/albums';
import HeartButton from '../common/HeartButton';
import { useFavorites } from '../../hooks/useFavorites';

const CODEC_MAP: Record<string, string> = {
  flac: 'FLAC', mp3: 'MP3', ogg: 'OGG', m4a: 'AAC', wav: 'WAV',
  opus: 'OPUS', aac: 'AAC', wma: 'WMA', alac: 'ALAC', aiff: 'AIFF', aif: 'AIFF',
};

function extractCodec(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  return CODEC_MAP[ext] ?? ext.toUpperCase();
}

function CoverThumb({ albumId, title }: { albumId: number; title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="w-8 h-8 rounded shrink-0 flex items-center justify-center"
        style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}
      >
        <Disc3 className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
      </div>
    );
  }
  return (
    <img
      src={getCoverUrl(albumId)}
      alt={title}
      className="w-8 h-8 rounded shrink-0 object-cover"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

interface TrackRowProps {
  track: Track;
  index: number;
  showAlbum: boolean;
  isCurrent: boolean;
  isPlaying: boolean;
  isScrollTarget: boolean;
  scrollTargetRef?: React.Ref<HTMLDivElement>;
  onPlay?: (track: Track, index: number) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (trackId: number) => void;
}

const TrackRow = memo(function TrackRow({
  track, index, showAlbum, isCurrent, isPlaying,
  isScrollTarget, scrollTargetRef, onPlay,
  isFavorite: favorited, onToggleFavorite,
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
      <span className="w-8 text-right text-xs tabular-nums relative shrink-0">
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
      {showAlbum && track.album?.hasCoverArt && track.album ? (
        <CoverThumb albumId={track.album.id} title={track.album.title} />
      ) : showAlbum ? (
        <div
          className="w-8 h-8 rounded shrink-0 flex items-center justify-center"
          style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}
        >
          <Disc3 className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
        </div>
      ) : null}
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color: isCurrent ? 'var(--mc-accent-primary)' : 'var(--mc-text-primary)', fontWeight: isCurrent ? 500 : undefined }}>
          {track.title}
        </p>
        <p className="text-xs truncate" style={{ color: 'var(--mc-text-muted)' }}>
          {track.artist?.name ?? 'Unknown'}
          {showAlbum && track.album && ` · ${track.album.title}`}
        </p>
      </div>
      {onToggleFavorite && (
        <span className="flex shrink-0 justify-center w-6">
          <HeartButton
            active={!!favorited}
            onClick={() => onToggleFavorite(track.id)}
            size={14}
          />
        </span>
      )}
      <span className="flex w-14 shrink-0 justify-center">
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--mc-text-muted) 15%, transparent)',
            color: 'var(--mc-text-muted)',
          }}
        >
          {extractCodec(track.filePath)}
        </span>
      </span>
      <span className="text-xs tabular-nums shrink-0 w-12 text-right" style={{ color: 'var(--mc-text-muted)' }}>
        {formatDuration(track.duration)}
      </span>
    </div>
  );
});

interface Props {
  tracks: Track[];
  showAlbum?: boolean;
  showFavorites?: boolean;
  scrollToTrackId?: number;
  onPlay?: (track: Track, index: number) => void;
}

export default function TrackList({ tracks, showAlbum = false, showFavorites = false, scrollToTrackId, onPlay }: Props) {
  const { trackId: currentTrackId, isPlaying } = useCurrentTrackInfo();
  const { isFavorite, toggle: toggleFavorite } = useFavorites();
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
      {showAlbum && (
        <div
          className="flex items-center gap-4 px-4 py-1.5 text-[11px] uppercase tracking-wider"
          style={{ color: 'var(--mc-text-muted)' }}
        >
          <span className="w-8 text-right shrink-0">#</span>
          <span className="w-8 shrink-0" />
          <span className="flex-1 min-w-0">Title</span>
          {showFavorites && <span className="w-6 shrink-0" />}
          <span className="w-14 shrink-0 text-center">Codec</span>
          <span className="w-12 text-right shrink-0">Time</span>
        </div>
      )}
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
          isFavorite={showFavorites ? isFavorite(track.id) : undefined}
          onToggleFavorite={showFavorites ? toggleFavorite : undefined}
        />
      ))}
    </div>
  );
}
