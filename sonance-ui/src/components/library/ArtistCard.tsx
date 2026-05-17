import { Link } from 'react-router';
import { EyeOff } from 'lucide-react';
import type { Artist } from '../../types';
import { artistGradient, artistInitials } from '../../utils/artistAvatar';

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      to={`/artists/${artist.id}`}
      className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 mc-nav-item hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--mc-glass-background)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--mc-glass-border)',
        opacity: artist.hidden ? 0.5 : 1,
      }}
    >
      {artist.hidden && (
        <div className="absolute top-2 right-2" title="Albums hidden from library">
          <EyeOff className="w-3.5 h-3.5" style={{ color: 'var(--mc-text-muted)' }} />
        </div>
      )}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center transition-shadow duration-200 group-hover:shadow-md"
        style={{ background: artistGradient(artist.name) }}
      >
        <span className="text-xl font-bold text-white/90">
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
