import { useSearchParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { search } from '../api/search';
import TrackList from '../components/library/TrackList';
import AlbumCard from '../components/library/AlbumCard';
import { User } from 'lucide-react';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => search(query),
    enabled: query.length > 0,
  });

  if (!query) {
    return (
      <div className="text-zinc-500">
        <h2 className="text-xl font-semibold text-zinc-100 mb-4">Search</h2>
        <p>Type something in the search bar above.</p>
      </div>
    );
  }

  if (isLoading) return <p className="text-zinc-500">Searching…</p>;
  if (!data) return null;

  const hasResults = data.tracks.length > 0 || data.albums.length > 0 || data.artists.length > 0;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Results for "<span className="text-indigo-400">{query}</span>"
      </h2>

      {!hasResults && <p className="text-zinc-500">No results found.</p>}

      {data.artists.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Artists</h3>
          <div className="flex gap-4 flex-wrap">
            {data.artists.map((artist) => (
              <Link
                key={artist.id}
                to={`/artists/${artist.id}`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
              >
                <User className="w-5 h-5 text-zinc-500" />
                <span className="text-sm text-zinc-100">{artist.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {data.albums.length > 0 && (
        <section className="mb-8">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Albums</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {data.tracks.length > 0 && (
        <section>
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Tracks</h3>
          <TrackList tracks={data.tracks} showAlbum />
        </section>
      )}
    </div>
  );
}
