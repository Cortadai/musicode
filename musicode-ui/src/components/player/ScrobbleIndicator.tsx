import { memo, useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { getScrobbleSettings } from '../../api/scrobble';
import type { ScrobbleStatus } from '../../hooks/useScrobble';

interface Props {
  status: ScrobbleStatus;
}

const STATUS_CONFIG = {
  idle: { color: 'text-zinc-600', tooltip: 'Scrobble: waiting for 50% playback' },
  reported: { color: 'text-indigo-400', tooltip: 'Scrobble: play reported' },
  error: { color: 'text-amber-500', tooltip: 'Scrobble: failed to report play' },
} as const;

function ScrobbleIndicator({ status }: Props) {
  const [configured, setConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    getScrobbleSettings()
      .then(s => setConfigured(s.lastfmConnected || s.listenbrainzConnected))
      .catch(() => setConfigured(false));
  }, []);

  if (configured === null || configured === false) return null;

  const { color, tooltip } = STATUS_CONFIG[status];

  return (
    <span title={tooltip} className={`flex items-center transition-colors ${color}`}>
      <Radio className="w-3.5 h-3.5" />
    </span>
  );
}

export default memo(ScrobbleIndicator);
