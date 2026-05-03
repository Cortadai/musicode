import { Link } from 'react-router';
import type { Artist } from '../../types';
import { artistGradient, artistInitials } from '../../utils/artistAvatar';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      to={`/artists/${artist.id}`}
      className="group flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 mc-nav-item hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center transition-shadow duration-200 group-hover:shadow-md"
        style={{ background: artistGradient(artist.name) }}
      >
        <span className="text-xl font-bold text-white/90 select-none">
          {artistInitials(artist.name)}
        </span>
      </div>
      <p
        className="text-sm font-medium text-center truncate w-full"
        style={{ color: 'var(--mc-text-primary)' }}
      >
        {artist.name}
      </p>
    </Link>
  );
}
