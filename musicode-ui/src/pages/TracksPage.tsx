import { useQuery } from '@tanstack/react-query';
import { getTracks } from '../api/tracks';
import TrackList from '../components/library/TrackList';

export default function TracksPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tracks'],
    queryFn: () => getTracks(0, 200, 'title,asc'),
  });

  if (isLoading) return <p className="text-zinc-500">Loading tracks…</p>;
  if (error) return <p className="text-red-400">Failed to load tracks</p>;
  if (!data?.content.length) return <p className="text-zinc-500">No tracks found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Tracks <span className="text-sm font-normal text-zinc-500">({data.totalElements})</span>
      </h2>
      <TrackList tracks={data.content} showAlbum />
    </div>
  );
}
