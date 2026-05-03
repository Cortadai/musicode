import { useSearchParams } from 'react-router';
import { Disc3, Users, Music, Heart } from 'lucide-react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { getAlbums } from '../api/albums';
import { getArtists } from '../api/artists';
import { getTracks } from '../api/tracks';
import { getFavorites, getFavoriteCount } from '../api/favorites';
import AlbumCard from '../components/library/AlbumCard';
import TrackList from '../components/library/TrackList';
import ArtistCard from '../components/library/ArtistCard';
import { usePlayer } from '../hooks/usePlayer';
import Spinner from '../components/common/Spinner';
import { TrackListSkeleton, AlbumGridSkeleton, ArtistGridSkeleton } from '../components/common/Skeletons';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';
import type { Track } from '../types';

type Tab = 'tracks' | 'albums' | 'artists' | 'favorites';

const TABS: { id: Tab; label: string; icon: typeof Music }[] = [
  { id: 'albums', label: 'Albums', icon: Disc3 },
  { id: 'artists', label: 'Artists', icon: Users },
  { id: 'tracks', label: 'Tracks', icon: Music },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

const PAGE_SIZE = 30;

export default function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as Tab) || 'albums';

  function setTab(tab: Tab) {
    setSearchParams({ tab }, { replace: true });
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 border-b" style={{ borderColor: 'var(--mc-border-default)' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === id
                ? 'border-current'
                : 'border-transparent hover:opacity-80'
            }`}
            style={{
              color: activeTab === id ? 'var(--mc-accent-primary)' : 'var(--mc-text-muted)',
            }}
          >
            <Icon className="w-4 h-4" />
            {label}
            <TabCount tab={id} />
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'tracks' && <TracksTab />}
      {activeTab === 'albums' && <AlbumsTab />}
      {activeTab === 'artists' && <ArtistsTab />}
      {activeTab === 'favorites' && <FavoritesTab />}
    </div>
  );
}

function TabCount({ tab }: { tab: Tab }) {
  const { data: albumsData } = useQuery({
    queryKey: ['albums-count'],
    queryFn: () => getAlbums(0, 1),
  });
  const { data: artistsData } = useQuery({
    queryKey: ['artists-count'],
    queryFn: () => getArtists(0, 1),
  });
  const { data: tracksData } = useQuery({
    queryKey: ['tracks-count'],
    queryFn: () => getTracks(0, 1, 'title,asc'),
  });
  const { data: favCount } = useQuery({
    queryKey: ['favorites-count'],
    queryFn: getFavoriteCount,
  });

  let count: number | undefined;
  if (tab === 'albums') count = albumsData?.totalElements;
  if (tab === 'artists') count = artistsData?.totalElements;
  if (tab === 'tracks') count = tracksData?.totalElements;
  if (tab === 'favorites') count = favCount;

  if (count === undefined) return null;
  return (
    <span
      className="text-xs px-1.5 py-0.5 rounded-full"
      style={{ backgroundColor: 'var(--mc-bg-surface-hover)', color: 'var(--mc-text-muted)' }}
    >
      {count}
    </span>
  );
}

function TracksTab() {
  const { playTrack } = usePlayer();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['tracks-infinite'],
    queryFn: ({ pageParam = 0 }) => getTracks(pageParam, PAGE_SIZE, 'title,asc'),
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    initialPageParam: 0,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allTracks: Track[] = useMemo(
    () => data?.pages.flatMap((p) => p.content) ?? [],
    [data?.pages]
  );

  const handlePlay = useCallback(
    (track: Track, index: number) => playTrack(track, allTracks, index),
    [playTrack, allTracks]
  );

  if (isLoading) return <TrackListSkeleton />;
  if (error) return <ErrorMessage message="Failed to load tracks" detail={getErrorMessage(error)} />;

  if (allTracks.length === 0) {
    return <p style={{ color: 'var(--mc-text-muted)' }}>No tracks found. Scan a folder in Settings.</p>;
  }

  return (
    <>
      <TrackList tracks={allTracks} showAlbum showFavorites onPlay={handlePlay} />
      <div ref={sentinelRef} className="h-8" />
      {isFetchingNextPage && <Spinner text="Loading more…" />}
    </>
  );
}

function AlbumsTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['albums'],
    queryFn: () => getAlbums(0, 200),
  });

  if (isLoading) return <AlbumGridSkeleton />;
  if (error) return <ErrorMessage message="Failed to load albums" detail={getErrorMessage(error)} onRetry={() => refetch()} />;

  if (!data?.content.length) {
    return <p style={{ color: 'var(--mc-text-muted)' }}>No albums found. Add a music folder in Settings and scan your library.</p>;
  }

  return (
    <div className="grid grid-cols-6 xl:grid-cols-7 gap-3">
      {data.content.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}

function ArtistsTab() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists(0, 200),
  });

  if (isLoading) return <ArtistGridSkeleton />;
  if (error) return <ErrorMessage message="Failed to load artists" detail={getErrorMessage(error)} onRetry={() => refetch()} />;

  if (!data?.content.length) {
    return <p style={{ color: 'var(--mc-text-muted)' }}>No artists found. Scan a music folder in Settings.</p>;
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {data.content.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
}

function FavoritesTab() {
  const { playTrack } = usePlayer();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['favorites-infinite'],
    queryFn: ({ pageParam = 0 }) => getFavorites(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 0,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  const allTracks: Track[] = useMemo(
    () => data?.pages.flatMap((p) => p.content) ?? [],
    [data?.pages]
  );

  const handlePlay = useCallback(
    (track: Track, index: number) => playTrack(track, allTracks, index),
    [playTrack, allTracks]
  );

  if (isLoading) return <TrackListSkeleton />;
  if (error) return <ErrorMessage message="Failed to load favorites" detail={getErrorMessage(error)} />;

  if (allTracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Heart className="w-12 h-12" style={{ color: 'var(--mc-text-muted)' }} />
        <p style={{ color: 'var(--mc-text-muted)' }}>No favorites yet. Click the heart on any track to add it here.</p>
      </div>
    );
  }

  return (
    <>
      <TrackList tracks={allTracks} showAlbum showFavorites onPlay={handlePlay} />
      <div ref={sentinelRef} className="h-8" />
      {isFetchingNextPage && <Spinner text="Loading more…" />}
    </>
  );
}
