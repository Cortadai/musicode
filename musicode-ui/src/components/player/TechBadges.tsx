import { memo, useMemo } from 'react';
import { Star } from 'lucide-react';

interface Props {
  filePath: string;
  bitRate: number | null;
  sampleRate: number | null;
  bitsPerSample: number | null;
  className?: string;
}

function extractCodec(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  const map: Record<string, string> = {
    flac: 'FLAC',
    mp3: 'MP3',
    ogg: 'OGG',
    m4a: 'AAC',
    wav: 'WAV',
    opus: 'OPUS',
    aac: 'AAC',
    wma: 'WMA',
    alac: 'ALAC',
    aiff: 'AIFF',
    aif: 'AIFF',
  };
  return map[ext] ?? ext.toUpperCase();
}

function formatBitRate(bitRate: number): string {
  return bitRate >= 1000 ? `${Math.round(bitRate / 1000)}k` : `${bitRate}k`;
}

function formatSampleRate(sampleRate: number): string {
  if (sampleRate % 1000 === 0) return `${sampleRate / 1000}kHz`;
  return `${(sampleRate / 1000).toFixed(1)}kHz`;
}

function TechBadges({ filePath, bitRate, sampleRate, bitsPerSample, className }: Props) {
  const badges = useMemo(() => {
    const items: string[] = [];
    items.push(extractCodec(filePath));
    if (bitsPerSample) items.push(`${bitsPerSample}bit`);
    if (sampleRate) items.push(formatSampleRate(sampleRate));
    if (bitRate) items.push(formatBitRate(bitRate));
    return items;
  }, [filePath, bitRate, sampleRate, bitsPerSample]);

  const isHiRes = (sampleRate ?? 0) > 44100 || (bitsPerSample ?? 0) > 16;

  const badgeBg = isHiRes
    ? 'color-mix(in srgb, #f59e0b 20%, transparent)'
    : 'color-mix(in srgb, var(--mc-accent-primary) 20%, transparent)';
  const badgeColor = isHiRes ? '#f59e0b' : 'var(--mc-accent-primary)';

  return (
    <div className={className ?? 'flex items-center gap-1 mt-0.5'}>
      {isHiRes && (
        <Star className="w-3 h-3 fill-current" style={{ color: '#f59e0b' }} />
      )}
      {badges.map((label) => (
        <span
          key={label}
          className="text-[10px] font-mono leading-none px-1.5 py-0.5 rounded"
          style={{ backgroundColor: badgeBg, color: badgeColor }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export default memo(TechBadges);
