import { useCallback } from 'react';
import { useSearchParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { search } from '../api/search';
import TrackList from '../components/library/TrackList';
import AlbumCard from '../components/library/AlbumCard';
import { usePlayer } from '../hooks/usePlayer';
import { User } from 'lucide-react';
import type { Track } from '../types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { playTrack } = usePlayer();

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.length > 0,
  });

  const handlePlay = useCallback(
    (track: Track, index: number) => playTrack(track, data?.tracks ?? [], index),
    [playTrack, data?.tracks]
  );

  if (!query) {
    return (
      <div style={{ color: 'var(--mc-text-muted)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--mc-text-primary)' }}>Search</h2>
        <p>Type something in the search bar above.</p>
      </div>
    );
  }

  if (isLoading) return <p style={{ color: 'var(--mc-text-muted)' }}>Searching…</p>;

  if (!data) return null;

  const hasResults = data.tracks.length > 0 || data.albums.length > 0 || data.artists.length > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Results for "<span style={{ color: 'var(--mc-accent-primary)' }}>{query}</span>"
      </h2>

      {!hasResults && <p style={{ color: 'var(--mc-text-muted)' }}>No results found.</p>}

      {data.artists.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Artists</h3>
          <div className="flex gap-4 flex-wrap">
            {data.artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artists/${artist.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mc-nav-item"
                style={{ backgroundColor: 'var(--mc-bg-surface)' }}
              >
                <User className="w-5 h-5" style={{ color: 'var(--mc-text-muted)' }} />
                <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>{artist.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.albums.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Albums</h3>
          <div className="grid grid-cols-6 xl:grid-cols-7 gap-3">
            {data.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {data.tracks.length > 0 && (
        <section>
          <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Tracks</h3>
          <TrackList
            tracks={data.tracks}
            showAlbum
            onPlay={handlePlay}
          />
        </section>
      )}
    </div>
  );
}
