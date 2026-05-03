import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getArtist } from '../api/artists';
import AlbumCard from '../components/library/AlbumCard';
import { ArrowLeft } from 'lucide-react';
import { artistGradient, artistInitials } from '../utils/artistAvatar';
import type { Album } from '../types';
import { ArtistDetailSkeleton } from '../components/common/Skeletons';
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

  if (isLoading) return <ArtistDetailSkeleton />;
  if (error || !artist) return <ErrorMessage message="Artist not found" detail={getErrorMessage(error)} />;

  const albums: Album[] = artist.albums ? [...artist.albums] : [];

  return (
    <div>
      <Link to="/library?tab=artists" className="inline-flex items-center gap-1.5 text-sm mc-interactive-muted mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to artists
      </Link>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-24 h-24 rounded-full flex items-center justify-center shrink-0" style={{ background: artistGradient(artist.name) }}>
          <span className="text-2xl font-bold text-white/90 select-none">{artistInitials(artist.name)}</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--mc-text-muted)' }}>Artist</p>
          <h2 className="text-3xl font-bold" style={{ color: 'var(--mc-text-primary)' }}>{artist.name}</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--mc-text-secondary)' }}>{albums.length} album{albums.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-6 xl:grid-cols-7 gap-3">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--mc-text-muted)' }}>No albums found for this artist.</p>
      )}
    </div>
  );
}
