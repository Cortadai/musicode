import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import { getArtist, getArtistBio } from '../../api/artists';
import { getCoverUrl } from '../../api/albums';
import { Disc3, Star } from 'lucide-react';
import type { Track } from '../../types';

const CODEC_MAP: Record<string, string> = {
  flac: 'FLAC', mp3: 'MP3', ogg: 'OGG', m4a: 'AAC', wav: 'WAV',
  opus: 'OPUS', aac: 'AAC', wma: 'WMA', alac: 'ALAC', aiff: 'AIFF', aif: 'AIFF',
};

function extractCodec(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  return CODEC_MAP[ext] ?? ext.toUpperCase();
}

interface AudioQuality {
  codecs: { name: string; count: number }[];
  bitRateRange: { min: number; max: number } | null;
  sampleRates: number[];
  bitsPerSample: number[];
  isHiRes: boolean;
}

function computeAudioQuality(tracks: Track[]): AudioQuality {
  const codecCounts = new Map<string, number>();
  let minBitRate = Infinity, maxBitRate = -Infinity;
  const sampleRateSet = new Set<number>();
  const bpsSet = new Set<number>();

  for (const t of tracks) {
    const codec = extractCodec(t.filePath);
    codecCounts.set(codec, (codecCounts.get(codec) ?? 0) + 1);
    if (t.bitRate != null && t.bitRate > 0) {
      minBitRate = Math.min(minBitRate, t.bitRate);
      maxBitRate = Math.max(maxBitRate, t.bitRate);
    }
    if (t.sampleRate != null && t.sampleRate > 0) sampleRateSet.add(t.sampleRate);
    if (t.bitsPerSample != null && t.bitsPerSample > 0) bpsSet.add(t.bitsPerSample);
  }

  const codecs = [...codecCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const sampleRates = [...sampleRateSet].sort((a, b) => b - a);
  const bitsPerSampleArr = [...bpsSet].sort((a, b) => b - a);
  const isHiRes = sampleRates.some(sr => sr > 44100) || bitsPerSampleArr.some(b => b > 16);

  return {
    codecs,
    bitRateRange: minBitRate <= maxBitRate ? { min: minBitRate, max: maxBitRate } : null,
    sampleRates,
    bitsPerSample: bitsPerSampleArr,
    isHiRes,
  };
}

function formatSampleRate(hz: number): string {
  return hz >= 1000 ? `${(hz / 1000).toFixed(hz % 1000 === 0 ? 0 : 1)} kHz` : `${hz} Hz`;
}

export function AudioQualityBadges({ tracks }: { tracks: Track[] }) {
  const quality = useMemo(() => computeAudioQuality(tracks), [tracks]);

  const badgeBg = quality.isHiRes
    ? 'color-mix(in srgb, #f59e0b 20%, transparent)'
    : 'color-mix(in srgb, var(--mc-accent-primary) 20%, transparent)';
  const badgeColor = quality.isHiRes ? '#f59e0b' : 'var(--mc-accent-primary)';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {quality.isHiRes && (
        <Star className="w-3 h-3 fill-current" style={{ color: '#f59e0b' }} />
      )}
      {quality.codecs.map(c => (
        <span
          key={c.name}
          className="px-2 py-0.5 rounded text-[10px] font-medium font-mono"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {c.count > 1 ? `${c.count}× ` : ''}{c.name}
        </span>
      ))}
      {quality.bitRateRange && (
        <span
          className="px-2 py-0.5 rounded text-[10px] font-mono"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {quality.bitRateRange.min === quality.bitRateRange.max
            ? `${quality.bitRateRange.min} kbps`
            : `${quality.bitRateRange.min}–${quality.bitRateRange.max} kbps`}
        </span>
      )}
      {quality.sampleRates.map(sr => (
        <span
          key={sr}
          className="px-2 py-0.5 rounded text-[10px] font-mono"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {formatSampleRate(sr)}
        </span>
      ))}
      {quality.bitsPerSample.map(bps => (
        <span
          key={bps}
          className="px-2 py-0.5 rounded text-[10px] font-mono"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {bps}-bit
        </span>
      ))}
    </div>
  );
}

export function useArtistLastfmUrl(artistId: number) {
  const { data: bio } = useQuery({
    queryKey: ['artist-bio', artistId],
    queryFn: () => getArtistBio(artistId),
    staleTime: 1000 * 60 * 60,
  });
  return bio && !bio.empty ? bio.lastfmUrl : null;
}

export function RelatedAlbumsStrip({ artistId, currentAlbumId }: { artistId: number; currentAlbumId: number }) {
  const { data: artist } = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtist(artistId),
    staleTime: 1000 * 60 * 5,
  });

  const related = useMemo(
    () => (artist?.albums ?? []).filter(a => a.id !== currentAlbumId),
    [artist, currentAlbumId],
  );

  if (related.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--mc-text-muted)' }}>
        More by {artist?.name}
      </h4>
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        {related.map(album => (
          <Link
            key={album.id}
            to={`/albums/${album.id}`}
            className="shrink-0 group"
            title={`${album.title}${album.year ? ` (${album.year})` : ''}`}
          >
            <div
              className="w-20 h-20 rounded-lg overflow-hidden"
              style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}
            >
              {album.hasCoverArt ? (
                <img
                  src={getCoverUrl(album.id)}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Disc3 className="w-8 h-8" style={{ color: 'var(--mc-text-muted)' }} />
                </div>
              )}
            </div>
            <p
              className="text-[10px] mt-1 truncate w-20"
              style={{ color: 'var(--mc-text-secondary)' }}
            >
              {album.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AlbumInfoCard({
  tracks,
  artistId,
  albumId,
}: {
  tracks: Track[];
  artistId: number;
  albumId: number;
}) {
  return (
    <div className="flex flex-col gap-4 min-w-0">
      <AudioQualityBadges tracks={tracks} />
      <RelatedAlbumsStrip artistId={artistId} currentAlbumId={albumId} />
    </div>
  );
}
