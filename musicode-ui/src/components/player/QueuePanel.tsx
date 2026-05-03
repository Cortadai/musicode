import { useRef, useEffect } from 'react';
import { X, ListMusic, Trash2 } from 'lucide-react';
import { usePlayerState, usePlayerDispatch } from '../../context/PlayerContext';
import { useQueuePanel } from '../../context/QueuePanelContext';
import { getCoverUrl } from '../../api/albums';
import { formatDuration } from '../../utils/format';

export default function QueuePanel() {
  const { isOpen, toggle } = useQueuePanel();
  const { queue, queueIndex, currentTrack } = usePlayerState();
  const dispatch = usePlayerDispatch();
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isOpen, queueIndex]);

  if (!isOpen || !currentTrack) return null;

  const upcoming = queue.slice(queueIndex + 1);

  return (
    <aside
      className="w-80 shrink-0 flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--mc-bg-surface)',
        borderLeft: '1px solid var(--mc-border-subtle)',
      }}
    >
      <div className="flex items-center justify-between px-4 h-12 shrink-0" style={{ borderBottom: '1px solid var(--mc-border-subtle)' }}>
        <div className="flex items-center gap-2">
          <ListMusic className="w-4 h-4" style={{ color: 'var(--mc-accent-primary)' }} />
          <span className="text-sm font-semibold">Queue</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--mc-bg-elevated)', color: 'var(--mc-text-muted)' }}>
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {queue.length > 1 && (
            <button
              onClick={() => dispatch({ type: 'CLEAR_QUEUE' })}
              className="p-1.5 rounded-md mc-interactive-muted transition-colors"
              title="Clear queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={toggle}
            className="p-1.5 rounded-md mc-interactive-muted transition-colors"
            title="Close queue"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-3 shrink-0" style={{ borderBottom: '1px solid var(--mc-border-subtle)' }}>
        <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--mc-text-muted)' }}>
          Now Playing
        </p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: 'var(--mc-bg-elevated)' }}>
            {currentTrack.album?.hasCoverArt && currentTrack.album?.id ? (
              <img src={getCoverUrl(currentTrack.album.id)} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ListMusic className="w-5 h-5" style={{ color: 'var(--mc-text-muted)' }} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs truncate" style={{ color: 'var(--mc-text-secondary)' }}>
              {currentTrack.artist?.name ?? 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {upcoming.length === 0 ? (
          <p className="text-xs text-center py-8" style={{ color: 'var(--mc-text-muted)' }}>
            No more tracks in queue
          </p>
        ) : (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-wider px-4 pt-3 pb-1" style={{ color: 'var(--mc-text-muted)' }}>
              Next Up ({upcoming.length})
            </p>
            <div className="px-2 pb-2">
              {upcoming.map((track, i) => {
                const actualIndex = queueIndex + 1 + i;
                return (
                  <button
                    key={`${track.id}-${actualIndex}`}
                    ref={actualIndex === queueIndex + 1 ? activeRef : undefined}
                    onClick={() => dispatch({ type: 'JUMP_TO_INDEX', index: actualIndex })}
                    className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md group transition-colors mc-interactive-muted"
                  >
                    <span className="w-5 text-right text-[10px] shrink-0" style={{ color: 'var(--mc-text-muted)' }}>
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded overflow-hidden shrink-0" style={{ backgroundColor: 'var(--mc-bg-elevated)' }}>
                      {track.album?.hasCoverArt && track.album?.id ? (
                        <img src={getCoverUrl(track.album.id)} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ListMusic className="w-3 h-3" style={{ color: 'var(--mc-text-muted)' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-medium truncate">{track.title}</p>
                      <p className="text-[10px] truncate" style={{ color: 'var(--mc-text-secondary)' }}>
                        {track.artist?.name ?? 'Unknown'}
                      </p>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: 'var(--mc-text-muted)' }}>
                      {formatDuration(track.duration)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: 'REMOVE_FROM_QUEUE', index: actualIndex });
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mc-interactive-muted"
                      title="Remove from queue"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
