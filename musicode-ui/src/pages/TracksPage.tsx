import { useInfiniteQuery } from '@tanstack/react-query';
import { getTracks } from '../api/tracks';
import TrackList from '../components/library/TrackList';
import { usePlayer } from '../hooks/usePlayer';
import Spinner from '../components/common/Spinner';
import { useEffect, useRef, useCallback } from 'react';
import type { Track } from '../types';

const PAGE_SIZE = 30;

export default function TracksPage() {
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
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
    initialPageParam: 0,
  });

  // Intersection observer for infinite scroll
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

  if (isLoading) return <Spinner text="Loading tracks…" />;
  if (error) return <p className="text-red-400">Failed to load tracks</p>;

  const allTracks: Track[] = data?.pages.flatMap((p) => p.content) ?? [];
  const totalElements = data?.pages[0]?.totalElements ?? 0;

  if (allTracks.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Tracks</h2>
        <p className="text-zinc-500">No tracks found. Scan a folder in Settings.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tracks <span className="text-sm font-normal text-zinc-500">({totalElements})</span>
      </h2>
      <TrackList
        tracks={allTracks}
        showAlbum
        onPlay={(track, index) => playTrack(track, allTracks, index)}
      />
      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-8" />
      {isFetchingNextPage && <Spinner text="Loading more…" />}
    </div>
  );
}
