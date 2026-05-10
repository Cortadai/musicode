import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ListMusic, Plus, Check } from 'lucide-react';
import type { Track } from '../../types';
import { usePlaylists } from '../../hooks/usePlaylists';

interface Props {
  track: Track;
  x: number;
  y: number;
  onClose: () => void;
}

export default function TrackContextMenu({ track, x, y, onClose }: Props) {
  const { playlists, addTracks, create } = usePlaylists();
  const menuRef = useRef<HTMLDivElement>(null);
  const [addedTo, setAddedTo] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (rect.right > vw) menuRef.current.style.left = `${vw - rect.width - 8}px`;
    if (rect.bottom > vh) menuRef.current.style.top = `${vh - rect.height - 8}px`;
  }, [creating]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    function handleScroll() { onClose(); }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [onClose]);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  const handleAddToPlaylist = useCallback(async (playlistId: number) => {
    try {
      await addTracks(playlistId, [track.id]);
      setAddedTo(playlistId);
      setTimeout(onClose, 600);
    } catch { /* mutation error handled by React Query */ }
  }, [addTracks, track.id, onClose]);

  const handleCreateAndAdd = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const created = await create(name);
      await addTracks(created.id, [track.id]);
      setAddedTo(created.id);
      setTimeout(onClose, 600);
    } catch { /* mutation error handled by React Query */ }
  }, [newName, create, addTracks, track.id, onClose]);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-[100] min-w-[200px] rounded-xl shadow-2xl py-1 overflow-hidden"
      style={{
        left: x,
        top: y,
        backgroundColor: 'var(--mc-bg-elevated, var(--mc-bg-surface))',
        border: '1px solid var(--mc-border-default)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="px-3 py-2 text-xs font-medium uppercase tracking-wider"
        style={{ color: 'var(--mc-text-muted)' }}
      >
        Add to playlist
      </div>

      {playlists.length > 0 && (
        <div className="max-h-48 overflow-y-auto">
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => handleAddToPlaylist(pl.id)}
              disabled={addedTo !== null}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors mc-nav-item"
            >
              {addedTo === pl.id ? (
                <Check className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--mc-accent-primary)' }} />
              ) : (
                <ListMusic className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--mc-text-muted)' }} />
              )}
              <span className="truncate">{pl.name}</span>
              <span className="ml-auto text-xs shrink-0" style={{ color: 'var(--mc-text-muted)' }}>
                {pl.trackCount}
              </span>
            </button>
          ))}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--mc-border-default)', margin: '2px 0' }} />

      {creating ? (
        <div className="px-3 py-2 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateAndAdd();
              if (e.key === 'Escape') { setCreating(false); setNewName(''); }
            }}
            placeholder="Playlist name..."
            className="flex-1 px-2 py-1 rounded text-sm outline-none min-w-0"
            style={{
              backgroundColor: 'var(--mc-bg-surface)',
              color: 'var(--mc-text-primary)',
              border: '1px solid var(--mc-border-default)',
            }}
          />
          <button
            onClick={handleCreateAndAdd}
            disabled={!newName.trim()}
            className="px-2 py-1 rounded text-xs font-medium disabled:opacity-40"
            style={{ backgroundColor: 'var(--mc-accent-primary)', color: 'var(--mc-bg-base)' }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          disabled={addedTo !== null}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors mc-nav-item"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--mc-text-muted)' }} />
          <span>New playlist…</span>
        </button>
      )}
    </div>,
    document.body,
  );
}
