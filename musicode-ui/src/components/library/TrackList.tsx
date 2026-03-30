import type { Track } from '../../types';
import { formatDuration } from '../../utils/format';

interface Props {
  tracks: Track[];
  showAlbum?: boolean;
}

export default function TrackList({ tracks, showAlbum = false }: Props) {
  return (
    <div className="space-y-0.5">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center gap-4 px-4 py-2.5 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors group"
        >
          <span className="w-8 text-right text-xs text-zinc-500 tabular-nums">
            {track.trackNumber ?? '—'}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-100 truncate">{track.title}</p>
            <p className="text-xs text-zinc-500 truncate">
              {track.artist?.name ?? 'Unknown'}
              {showAlbum && track.album && ` · ${track.album.title}`}
            </p>
          </div>
          <span className="text-xs text-zinc-500 tabular-nums">
            {formatDuration(track.duration)}
          </span>
        </div>
      ))}
    </div>
  );
}
