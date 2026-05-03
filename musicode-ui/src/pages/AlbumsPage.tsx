import { useQuery } from '@tanstack/react-query';
import { getAlbums } from '../api/albums';
import AlbumCard from '../components/library/AlbumCard';
import { AlbumGridSkeleton } from '../components/common/Skeletons';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';

export default function AlbumsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['albums'],
    queryFn: () => getAlbums(0, 100),
  });

  if (isLoading) return <AlbumGridSkeleton />;
  if (error) return <ErrorMessage message="Failed to load albums" detail={getErrorMessage(error)} onRetry={() => refetch()} />;

  if (!data?.content.length) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Albums</h2>
        <p style={{ color: 'var(--mc-text-muted)' }}>No albums found. Add a music folder in Settings and scan your library.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Albums</h2>
      <div className="grid grid-cols-5 xl:grid-cols-6 gap-4">
        {data.content.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
