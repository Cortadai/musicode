import { useCallback, useMemo, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAlbum, getCoverUrl } from '../api/albums';
import { getArtist } from '../api/artists';
import TrackList from '../components/library/TrackList';
import { usePlayer } from '../hooks/usePlayer';
import { useCurrentTrackInfo } from '../context/PlayerContext';
import { ArrowLeft, Disc3, ExternalLink, Play, Square } from 'lucide-react';
import { AlbumDetailSkeleton } from '../components/common/Skeletons';
import ErrorMessage from '../components/common/ErrorMessage';
import { AudioQualityBadges, RelatedAlbumsStrip, useArtistLastfmUrl } from '../components/library/AlbumInfoCard';
import { getErrorMessage } from '../utils/errors';
import { formatAlbumDuration } from '../utils/format';

function PlayAlbumButton({ onClick, albumTitle, totalDuration, isAlbumPlaying }: {
  onClick: () => void; albumTitle: string; totalDuration: number; isAlbumPlaying: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isAlbumPlaying ? `Stop ${albumTitle}` : `Play ${albumTitle}`}
      className={`play-album-btn flex items-center justify-between w-52 px-5 py-2.5 rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2${isAlbumPlaying ? ' play-album-btn--active' : ''}`}
      style={{
        color: 'var(--mc-bg-base)',
        ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
      }}
    >
      <span className="flex items-center gap-2">
        {isAlbumPlaying
          ? <><Square className="w-3.5 h-3.5" fill="currentColor" /> Stop</>
          : <><Play className="w-4 h-4" fill="currentColor" /> Play</>
        }
      </span>
      {totalDuration > 0 && (
        <span className="opacity-75 text-xs">{formatAlbumDuration(totalDuration)}</span>
      )}
    </button>
  );
}

function ArtistLine({ artistName, artistId, year, trackCount, lastfmUrl }: {
  artistName: string; artistId: number; year?: number; trackCount: number; lastfmUrl: string | null;
}) {
  return (
    <p className="text-sm flex items-center gap-1 flex-wrap" style={{ color: 'var(--mc-text-secondary)' }}>
      <span>{artistName}</span>
      {year && <span>· {year}</span>}
      <span>· {trackCount} tracks</span>
      {lastfmUrl && (
        <a
          href={lastfmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 mc-interactive-muted ml-1"
          title="View on Last.fm"
        >
          <ExternalLink className="w-3 h-3" />
          <span className="text-xs">Last.fm</span>
        </a>
      )}
    </p>
  );
}

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const albumId = Number(id);
  const location = useLocation();
  const { playAlbum, stop } = usePlayer();
  const { trackId: currentTrackId, isPlaying } = useCurrentTrackInfo();
  const shouldScrollToTrack = !!(location.state as { scrollToTrack?: boolean })?.scrollToTrack;

  const { data: album, isLoading, error } = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => getAlbum(albumId),
    enabled: !isNaN(albumId),
  });

  const tracks = useMemo(
    () => (album?.tracks ?? []).map(t => ({
      ...t,
      album: { id: album!.id, title: album!.title, year: album!.year, hasCoverArt: album!.hasCoverArt },
      artist: t.artist ?? album!.artist,
    })),
    [album]
  );

  const totalDuration = useMemo(
    () => tracks.reduce((sum, t) => sum + (t.duration ?? 0), 0),
    [tracks]
  );

  const handlePlay = useCallback(
    (_track: import('../types').Track, index: number) => playAlbum(tracks, index),
    [playAlbum, tracks]
  );

  const isAlbumPlaying = isPlaying && currentTrackId != null && tracks.some(t => t.id === currentTrackId);

  const handlePlayAlbum = useCallback(() => {
    if (isAlbumPlaying) {
      stop();
    } else {
      playAlbum(tracks, 0);
    }
  }, [isAlbumPlaying, stop, playAlbum, tracks]);

  const lastfmUrl = useArtistLastfmUrl(album?.artist?.id ?? 0);

  const { data: artistDetail } = useQuery({
    queryKey: ['artist', album?.artist?.id],
    queryFn: () => getArtist(album!.artist.id),
    enabled: !!album?.artist?.id,
    staleTime: 1000 * 60 * 5,
  });

  const hasRelated = useMemo(
    () => (artistDetail?.albums ?? []).some(a => a.id !== albumId),
    [artistDetail, albumId],
  );

  const [showRelated, setShowRelated] = useState(false);

  if (isLoading) return <AlbumDetailSkeleton />;
  if (error || !album) return <ErrorMessage message="Album not found" detail={getErrorMessage(error)} />;

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm mc-interactive-muted mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to albums
      </Link>

      <div className="flex gap-8 mb-6">
        <div className="w-48 h-48 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}>
          {album.hasCoverArt ? (
            <img src={getCoverUrl(album.id)} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="w-16 h-16" style={{ color: 'var(--mc-text-muted)' }} />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-end min-w-0">
          <AudioQualityBadges tracks={tracks} />
          <p className="text-xs uppercase tracking-wider mb-1 mt-2" style={{ color: 'var(--mc-text-muted)' }}>Album</p>
          <h2 className="text-3xl font-bold mb-2 truncate" style={{ color: 'var(--mc-text-primary)' }}>{album.title}</h2>
          <ArtistLine
            artistName={album.artist?.name ?? 'Unknown Artist'}
            artistId={album.artist.id}
            year={album.year}
            trackCount={tracks.length}
            lastfmUrl={lastfmUrl}
          />
          <div className="flex items-center gap-2 mt-3">
            <PlayAlbumButton onClick={handlePlayAlbum} albumTitle={album.title} totalDuration={totalDuration} isAlbumPlaying={isAlbumPlaying} />
            {hasRelated && (
              <button
                onClick={() => setShowRelated(v => !v)}
                aria-label={showRelated ? 'Hide related albums' : 'Show related albums'}
                className={`related-toggle-btn flex items-center justify-center w-10 h-10 rounded-full${showRelated ? ' related-toggle-btn--active' : ''}`}
              >
                <Disc3 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showRelated && <RelatedAlbumsStrip artistId={album.artist.id} currentAlbumId={album.id} />}

      <div className={album.artist ? 'mt-6' : ''}>
        <TrackList
          tracks={tracks}
          scrollToTrackId={shouldScrollToTrack && currentTrackId != null && tracks.some(t => t.id === currentTrackId) ? currentTrackId : undefined}
          onPlay={handlePlay}
        />
      </div>
    </div>
  );
}
