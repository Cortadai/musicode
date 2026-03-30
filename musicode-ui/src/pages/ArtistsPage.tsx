import { useQuery } from '@tanstack/react-query';
import { getArtists } from '../api/artists';
import { Link } from 'react-router';
import { User } from 'lucide-react';

export default function ArtistsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists(0, 100),
  });

  if (isLoading) return <p className="text-zinc-500">Loading artists…</p>;
  if (error) return <p className="text-red-400">Failed to load artists</p>;
  if (!data?.content.length) return <p className="text-zinc-500">No artists found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Artists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.content.map((artist) => (
          <Link
            key={artist.id}
            to={`/artists/${artist.id}`}
            className="flex flex-col items-center gap-3 p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800/80 transition-colors"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
              <User className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-100 text-center truncate w-full">
              {artist.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
