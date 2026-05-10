import { useCallback, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { Music, Clock, Users, Disc3, User } from 'lucide-react';
import { getSummary, getTopAlbums, getTopArtists, getRecentPlays } from '../api/stats';
import { getCoverUrl } from '../api/albums';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';
import Carousel from '../components/home/Carousel';
import { chooseGreeting, getTimeGreeting } from '../utils/greetings';
import { loadPreferences } from '../audio/audioPreferences';

function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s`;
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
}

const statCards = [
  { key: 'totalPlays', label: 'Total Plays', icon: Music },
  { key: 'totalListeningSec', label: 'Listening Time', icon: Clock },
  { key: 'uniqueArtists', label: 'Artists', icon: Users },
  { key: 'uniqueAlbums', label: 'Albums', icon: Disc3 },
] as const;

type SummaryKey = (typeof statCards)[number]['key'];

function formatValue(key: SummaryKey, value: number): string {
  if (key === 'totalListeningSec') return formatDuration(value);
  return value.toLocaleString();
}

function CoverImage({ albumId, alt }: { albumId: number | null; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = useCallback(() => {
    if (imgRef.current) imgRef.current.style.display = 'none';
  }, []);

  if (!albumId) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}>
        <Disc3 className="w-8 h-8" style={{ color: 'var(--mc-text-muted)' }} />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}>
      <img
        ref={imgRef}
        src={getCoverUrl(albumId)}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={handleError}
      />
    </div>
  );
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/* ── Skeleton placeholders ── */

function StatCardSkeleton() {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--mc-glass-background)',
        border: '1px solid var(--mc-glass-border)',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="mc-skeleton w-5 h-5 rounded" />
        <div className="mc-skeleton w-20 h-3" />
      </div>
      <div className="mc-skeleton w-16 h-7 rounded-lg" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div
      className="flex-shrink-0 w-40 rounded-xl overflow-hidden"
      style={{ backgroundColor: 'var(--mc-bg-surface)', border: '1px solid var(--mc-border-subtle)' }}
    >
      <div className="aspect-square mc-skeleton rounded-none" />
      <div className="p-2.5 space-y-2">
        <div className="mc-skeleton w-28 h-3.5" />
        <div className="mc-skeleton w-20 h-3" />
        <div className="mc-skeleton w-12 h-3" />
      </div>
    </div>
  );
}

function ArtistSkeleton() {
  return (
    <div className="flex-shrink-0 w-32 flex flex-col items-center gap-2 py-3">
      <div className="mc-skeleton w-20 h-20 rounded-full" />
      <div className="mc-skeleton w-20 h-3.5" />
      <div className="mc-skeleton w-12 h-3" />
    </div>
  );
}

function CarouselSkeleton({ count, variant }: { count: number; variant: 'card' | 'artist' }) {
  const Skel = variant === 'artist' ? ArtistSkeleton : CardSkeleton;
  return (
    <div className="flex gap-4">
      {Array.from({ length: count }, (_, i) => <Skel key={i} />)}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl py-10 px-6 text-center"
      style={{
        backgroundColor: 'var(--mc-bg-surface)',
        border: '1px solid var(--mc-glass-border)',
      }}
    >
      <Music size={32} className="mx-auto mb-3" style={{ color: 'var(--mc-text-muted)', opacity: 0.5 }} />
      <p className="text-sm" style={{ color: 'var(--mc-text-muted)' }}>{message}</p>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const greeting = useMemo(() => {
    const prefs = loadPreferences();
    if (!prefs.greetingMessages) return null;
    return chooseGreeting();
  }, []);

  const summary = useQuery({
    queryKey: ['stats', 'summary', 'all'],
    queryFn: () => getSummary('all'),
  });

  const recentPlays = useQuery({
    queryKey: ['stats', 'recent-plays'],
    queryFn: () => getRecentPlays(20),
  });

  const topAlbums = useQuery({
    queryKey: ['stats', 'top-albums', 'all', 10],
    queryFn: () => getTopAlbums('all', 10),
  });

  const topArtists = useQuery({
    queryKey: ['stats', 'top-artists', 'all', 10],
    queryFn: () => getTopArtists('all', 10),
  });

  if (summary.error) {
    return (
      <ErrorMessage
        message="Failed to load stats"
        detail={getErrorMessage(summary.error)}
        onRetry={() => summary.refetch()}
      />
    );
  }

  const s = summary.data;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--mc-text-primary)' }}
        >
          {greeting ? greeting.text : `${getTimeGreeting()}, ${user?.username ?? 'there'}`}
        </h1>
        {greeting?.subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--mc-text-muted)' }}>
            — {greeting.subtitle}
          </p>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        {summary.isLoading
          ? Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(({ key, label, icon: Icon }) => (
            <div
              key={key}
              className="rounded-xl p-5 flex flex-col gap-2 mc-card-lift"
              style={{
                background: 'var(--mc-glass-background)',
                border: '1px solid var(--mc-glass-border)',
                backdropFilter: 'blur(var(--mc-glass-blur))',
              }}
            >
              <div className="flex items-center gap-2">
                <Icon
                  size={18}
                  style={{ color: 'var(--mc-accent-primary)' }}
                />
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: 'var(--mc-text-muted)' }}
                >
                  {label}
                </span>
              </div>
              <span
                className="text-2xl font-bold"
                style={{ color: 'var(--mc-text-primary)' }}
              >
                {s ? formatValue(key, s[key]) : '—'}
              </span>
            </div>
          ))}
      </div>

      {/* Recently Played */}
      <Carousel title="Recently Played">
        {recentPlays.isLoading ? (
          <CarouselSkeleton count={6} variant="card" />
        ) : !recentPlays.data || recentPlays.data.length === 0 ? (
          <EmptyState message="No recently played tracks yet. Start listening!" />
        ) : (
          recentPlays.data.map((play, i) => (
            <div
              key={`${play.albumId}-${play.playedAt}-${i}`}
              className="flex-shrink-0 w-40 rounded-xl overflow-hidden mc-card-lift"
              style={{
                backgroundColor: 'var(--mc-bg-surface)',
                border: '1px solid var(--mc-border-subtle)',
                scrollSnapAlign: 'start',
              }}
            >
              {play.albumId ? (
                <Link to={`/albums/${play.albumId}`}>
                  <div className="aspect-square overflow-hidden">
                    <CoverImage albumId={play.albumId} alt={play.albumTitle} />
                  </div>
                </Link>
              ) : (
                <div className="aspect-square overflow-hidden">
                  <CoverImage albumId={null} alt={play.albumTitle} />
                </div>
              )}
              <div className="p-2.5">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--mc-text-primary)' }}>
                  {play.trackTitle}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--mc-text-muted)' }}>
                  {play.artistName}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--mc-text-muted)', opacity: 0.7 }}>
                  {timeAgo(play.playedAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </Carousel>

      {/* Top Albums */}
      <Carousel title="Top Albums">
        {topAlbums.isLoading ? (
          <CarouselSkeleton count={6} variant="card" />
        ) : !topAlbums.data || topAlbums.data.length === 0 ? (
          <EmptyState message="No top albums yet. Play some music to see your favorites!" />
        ) : (
          topAlbums.data.map((album) => (
            <Link
              key={album.albumId}
              to={`/albums/${album.albumId}`}
              className="flex-shrink-0 w-40 rounded-xl overflow-hidden mc-card-lift"
              style={{
                backgroundColor: 'var(--mc-bg-surface)',
                border: '1px solid var(--mc-border-subtle)',
                scrollSnapAlign: 'start',
              }}
            >
              <div className="aspect-square overflow-hidden">
                <CoverImage albumId={album.albumId} alt={album.title} />
              </div>
              <div className="p-2.5">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--mc-text-primary)' }}>
                  {album.title}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--mc-text-muted)' }}>
                  {album.artistName}
                </p>
                <p className="text-xs font-medium mt-1" style={{ color: 'var(--mc-accent-primary)' }}>
                  {album.playCount} {album.playCount === 1 ? 'play' : 'plays'}
                </p>
              </div>
            </Link>
          ))
        )}
      </Carousel>

      {/* Top Artists */}
      <Carousel title="Top Artists">
        {topArtists.isLoading ? (
          <CarouselSkeleton count={6} variant="artist" />
        ) : !topArtists.data || topArtists.data.length === 0 ? (
          <EmptyState message="No top artists yet. Your listening stats will appear here." />
        ) : (
          topArtists.data.map((artist) => (
            <Link
              key={artist.artistId}
              to={`/artists/${artist.artistId}`}
              className="flex-shrink-0 w-32 flex flex-col items-center gap-2 py-3"
              style={{ scrollSnapAlign: 'start', textDecoration: 'none' }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mc-card-lift"
                style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}
              >
                <User size={28} style={{ color: 'var(--mc-text-muted)' }} />
              </div>
              <p
                className="text-sm font-medium text-center truncate w-full px-1"
                style={{ color: 'var(--mc-text-primary)' }}
              >
                {artist.name}
              </p>
              <p className="text-xs font-medium" style={{ color: 'var(--mc-accent-primary)' }}>
                {artist.playCount} {artist.playCount === 1 ? 'play' : 'plays'}
              </p>
            </Link>
          ))
        )}
      </Carousel>
    </div>
  );
}
