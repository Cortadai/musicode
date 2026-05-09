import { memo, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { getCoverUrl } from '../../api/albums';
import type { Album } from '../../types';
import { Disc3 } from 'lucide-react';
import { useMarqueeAlbumCards } from '../../hooks/useMarqueePref';

interface Props {
  album: Album;
}

function AlbumCard({ album }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const marqueeEnabled = useMarqueeAlbumCards();

  const handleLoad = useCallback(() => {
    imgRef.current?.classList.add('loaded');
  }, []);

  return (
    <Link
      to={`/albums/${album.id}`}
      aria-label={`${album.title} by ${album.artist?.name ?? 'Unknown Artist'}`}
      className="group block rounded-2xl overflow-hidden transition-all duration-200 mc-nav-item hover:-translate-y-1 hover:shadow-lg"
      style={{
        backgroundColor: 'var(--mc-glass-background)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--mc-glass-border)',
      }}
    >
      <div className="p-2.5 pb-0">
        <div className="aspect-square relative overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}>
          {album.hasCoverArt ? (
            <img
              ref={imgRef}
              src={getCoverUrl(album.id)}
              alt={album.title}
              className="w-full h-full object-cover animate-cover-fade"
              loading="lazy"
              onLoad={handleLoad}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="w-12 h-12" style={{ color: 'var(--mc-text-muted)' }} />
            </div>
          )}
        </div>
      </div>
      <div className="px-3 py-2.5 overflow-hidden">
        <div className="overflow-hidden">
          {marqueeEnabled ? (
            <div className="card-marquee-container">
              <span
                className="text-sm font-medium whitespace-nowrap card-marquee-text"
                style={{ color: 'var(--mc-text-primary)' }}
              >
                {album.title}
              </span>
              <span
                className="text-sm font-medium whitespace-nowrap card-marquee-text"
                style={{ color: 'var(--mc-text-primary)' }}
                aria-hidden="true"
              >
                {album.title}
              </span>
            </div>
          ) : (
            <p className="text-sm font-medium truncate" style={{ color: 'var(--mc-text-primary)' }}>
              {album.title}
            </p>
          )}
        </div>
        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--mc-text-muted)' }}>
          {album.artist?.name ?? 'Unknown Artist'}
          {album.year && ` · ${album.year}`}
        </p>
      </div>
    </Link>
  );
}

export default memo(AlbumCard);
