import { memo } from 'react';
import { Link } from 'react-router';
import { Disc3 } from 'lucide-react';
import { getCoverUrl } from '../../api/albums';
import TechBadges from './TechBadges';
import MarqueeText from './MarqueeText';

interface Props {
  title: string;
  artistName: string;
  albumId?: number;
  hasCover?: boolean;
  isPlaying: boolean;
  onArtworkClick?: () => void;
  filePath?: string;
  bitRate?: number | null;
  sampleRate?: number | null;
  bitsPerSample?: number | null;
}

function TrackInfo({ title, artistName, albumId, hasCover, isPlaying, onArtworkClick, filePath, bitRate, sampleRate, bitsPerSample }: Props) {
  return (
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="relative shrink-0" style={{ width: 84, height: 56 }}>
        {/* Vinyl disc — behind the sleeve */}
        <div
          aria-hidden="true"
          className="absolute rounded-full transition-transform duration-500 ease-out"
          style={{
            width: 48,
            height: 48,
            top: 4,
            left: 4,
            transform: isPlaying ? 'translateX(28px)' : 'translateX(0px)',
            zIndex: 0,
          }}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden relative ring-1"
            style={{
              ['--tw-ring-color' as string]: 'color-mix(in srgb, var(--mc-waveform-buffered) 50%, transparent)',
              background: 'radial-gradient(circle, #2a2a2a 20%, #151515 100%)',
              boxShadow: '2px 0 15px rgba(0,0,0,0.5), inset 0 0 3px rgba(255,255,255,0.05)',
              animation: 'vinyl-spin 8s linear infinite',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            <div className="absolute inset-0 vinyl-grooves" />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full overflow-hidden ring-1"
              style={{ ['--tw-ring-color' as string]: 'var(--mc-waveform-buffered)' }}
            >
              {hasCover && albumId ? (
                <img
                  src={getCoverUrl(albumId)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full" style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }} />
              )}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ring-1" style={{ backgroundColor: 'var(--mc-bg-surface)', ['--tw-ring-color' as string]: 'var(--mc-waveform-buffered)' }} />
            </div>
          </div>
        </div>

        {/* Cover sleeve — square, on top */}
        <button
          onClick={onArtworkClick}
          aria-label="Open Now Playing"
          className="absolute top-0 left-0 rounded-lg overflow-hidden shadow-md hover:ring-2 transition-shadow cursor-pointer"
          style={{
            backgroundColor: 'var(--mc-bg-surface-hover)',
            ['--tw-ring-color' as string]: 'color-mix(in srgb, var(--mc-accent-primary-hover) 50%, transparent)',
            width: 56,
            height: 56,
            zIndex: 1,
          }}
        >
          {hasCover && albumId ? (
            <img
              src={getCoverUrl(albumId)}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 className="w-7 h-7" style={{ color: 'var(--mc-text-muted)' }} />
            </div>
          )}
        </button>
      </div>
      <div className="min-w-0">
        <MarqueeText className="text-sm font-medium mc-link-accent">
          <Link
            to={albumId ? `/albums/${albumId}` : '#'}
            state={{ scrollToTrack: true }}
            aria-label={`${title} — go to album`}
            className="transition-colors"
          >
            {title}
          </Link>
        </MarqueeText>
        <p className="text-xs truncate" style={{ color: 'var(--mc-text-muted)' }}>{artistName}</p>
        {filePath && (
          <TechBadges
            filePath={filePath}
            bitRate={bitRate ?? null}
            sampleRate={sampleRate ?? null}
            bitsPerSample={bitsPerSample ?? null}
          />
        )}
      </div>
    </div>
  );
}

export default memo(TrackInfo);
