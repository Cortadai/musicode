import { X, Mic2 } from 'lucide-react';
import { useLyricsSidebar } from '../../context/LyricsSidebarContext';
import { usePlayer } from '../../hooks/usePlayer';
import LyricsPanel from './LyricsPanel';

export default function LyricsSidebar() {
  const { isOpen, close } = useLyricsSidebar();
  const { currentTrack, currentTime } = usePlayer();

  if (!isOpen || !currentTrack) return null;

  return (
    <aside
      className="w-80 shrink-0 flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--mc-bg-surface)',
        borderLeft: '1px solid var(--mc-border-subtle)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 h-12 shrink-0"
        style={{ borderBottom: '1px solid var(--mc-border-subtle)' }}
      >
        <div className="flex items-center gap-2">
          <Mic2 className="w-4 h-4" style={{ color: 'var(--mc-accent-primary)' }} />
          <span className="text-sm font-semibold">Lyrics</span>
        </div>
        <button
          onClick={close}
          className="p-1.5 rounded-md mc-interactive-muted transition-colors"
          title="Close lyrics"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <LyricsPanel trackId={currentTrack.id} currentTime={currentTime} compact />
      </div>
    </aside>
  );
}
