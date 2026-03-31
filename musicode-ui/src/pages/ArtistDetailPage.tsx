import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getArtist } from '../api/artists';
import AlbumCard from '../components/library/AlbumCard';
import { ArrowLeft, User } from 'lucide-react';
import type { Album } from '../types';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';

export default function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const artistId = Number(id);

  const { data: artist, isLoading, error } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtist(artistId),
    enabled: !isNaN(artistId),
  });

  if (isLoading) return <Spinner text="Loading artist…" />;
  if (error || !artist) return <ErrorMessage message="Artist not found" detail={getErrorMessage(error)} />;

  const albums: Album[] = artist.albums ? [...artist.albums] : [];

  return (
    <div>
      <Link to="/artists" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to artists
      </Link>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
          <User className="w-10 h-10 text-zinc-600" />
        </div>
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Artist</p>
          <h2 className="text-3xl font-bold text-white">{artist.name}</h2>
          <p className="text-sm text-zinc-400 mt-1">{albums.length} album{albums.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">No albums found for this artist.</p>
      )}
    </div>
  );
}
