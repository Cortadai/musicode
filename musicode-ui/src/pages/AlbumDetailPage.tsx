import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAlbum, getCoverUrl } from '../api/albums';
import TrackList from '../components/library/TrackList';
import { ArrowLeft, Disc3 } from 'lucide-react';

export default function AlbumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const albumId = Number(id);

  const { data: album, isLoading, error } = useQuery({
    queryKey: ['album', albumId],
    queryFn: () => getAlbum(albumId),
    enabled: !isNaN(albumId),
  });

  if (isLoading) return <p className="text-zinc-500">Loading…</p>;
  if (error || !album) return <p className="text-red-400">Album not found</p>;

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to albums
      </Link>

      <div className="flex gap-8 mb-8">
        <div className="w-48 h-48 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
          {album.hasCoverArt ? (
            <img src={getCoverUrl(album.id)} alt={album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="w-16 h-16 text-zinc-600" />
            </div>
          )}
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Album</p>
          <h2 className="text-3xl font-bold text-white mb-2">{album.title}</h2>
          <p className="text-sm text-zinc-400">
            {album.artist?.name ?? 'Unknown Artist'}
            {album.year && ` · ${album.year}`}
            {album.tracks && ` · ${album.tracks.length} tracks`}
          </p>
        </div>
      </div>

      {album.tracks && <TrackList tracks={album.tracks} />}
    </div>
  );
}
