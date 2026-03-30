import { useQuery } from '@tanstack/react-query';
import { getAlbums } from '../api/albums';
import AlbumCard from '../components/library/AlbumCard';

export default function AlbumsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['albums'],
    queryFn: () => getAlbums(0, 100),
  });

  if (isLoading) return <p className="text-zinc-500">Loading albums…</p>;
  if (error) return <p className="text-red-400">Failed to load albums</p>;
  if (!data?.content.length) return <p className="text-zinc-500">No albums found. Scan a folder in Settings.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Albums</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.content.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
