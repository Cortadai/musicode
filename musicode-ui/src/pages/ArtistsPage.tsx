import { useQuery } from '@tanstack/react-query';
import { getArtists } from '../api/artists';
import { Link } from 'react-router';
import { User } from 'lucide-react';
import { ArtistGridSkeleton } from '../components/common/Skeletons';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';

export default function ArtistsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['artists'],
    queryFn: () => getArtists(0, 100),
  });

  if (isLoading) return <ArtistGridSkeleton />;
  if (error) return <ErrorMessage message="Failed to load artists" detail={getErrorMessage(error)} onRetry={() => refetch()} />;

  if (!data?.content.length) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Artists</h2>
        <p style={{ color: 'var(--mc-text-muted)' }}>No artists found. Scan a music folder in Settings.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Artists</h2>
      <div className="grid grid-cols-5 gap-4">
        {data.content.map((artist) => (
          <Link
            key={artist.id}
            to={`/artists/${artist.id}`}
            className="flex flex-col items-center gap-3 p-4 rounded-xl transition-colors mc-nav-item"
            style={{ backgroundColor: 'var(--mc-bg-surface)' }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}>
              <User className="w-8 h-8" style={{ color: 'var(--mc-text-muted)' }} />
            </div>
            <p className="text-sm font-medium text-center truncate w-full" style={{ color: 'var(--mc-text-primary)' }}>
              {artist.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
