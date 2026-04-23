import { memo, useCallback, useRef } from 'react';
import { Link } from 'react-router';
import { getCoverUrl } from '../../api/albums';
import type { Album } from '../../types';
import { Disc3 } from 'lucide-react';

interface Props {
  album: Album;
}

function AlbumCard({ album }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    imgRef.current?.classList.add('loaded');
  }, []);

  return (
    <Link
      to={`/albums/${album.id}`}
      aria-label={`${album.title} by ${album.artist?.name ?? 'Unknown Artist'}`}
      className="group block bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800/80 transition-colors"
    >
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        {album.hasCoverArt ? (
          <img
            ref={imgRef}
            src={getCoverUrl(album.id)}
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-cover-fade"
            loading="lazy"
            onLoad={handleLoad}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Disc3 className="w-12 h-12 text-zinc-600" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-zinc-100 truncate">{album.title}</p>
        <p className="text-xs text-zinc-500 truncate mt-0.5">
          {album.artist?.name ?? 'Unknown Artist'}
          {album.year && ` · ${album.year}`}
        </p>
      </div>
    </Link>
  );
}

export default memo(AlbumCard);
