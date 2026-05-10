import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { ListMusic, Plus, Trash2, Heart } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';
import { useFavorites } from '../hooks/useFavorites';
import Spinner from '../components/common/Spinner';

export default function PlaylistsPage() {
  const { playlists, isLoading, create, remove } = usePlaylists();
  const { favoriteIds } = useFavorites();
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleCreate = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      await create(name);
      setNewName('');
    } finally {
      setCreating(false);
    }
  }, [newName, create]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleCreate();
    },
    [handleCreate],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await remove(id);
      setConfirmDelete(null);
    },
    [remove],
  );

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--mc-text-primary)' }}>
          Playlists
        </h2>
      </div>

      {/* Create playlist form */}
      <div className="flex items-center gap-3 mb-8">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New playlist name..."
          className="flex-1 max-w-sm px-4 py-2 rounded-lg text-sm outline-none transition-colors"
          style={{
            backgroundColor: 'var(--mc-bg-surface)',
            color: 'var(--mc-text-primary)',
            border: '1px solid var(--mc-border-default)',
          }}
          disabled={creating}
        />
        <button
          onClick={handleCreate}
          disabled={!newName.trim() || creating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
          style={{
            backgroundColor: 'var(--mc-accent-primary)',
            color: 'var(--mc-bg-base)',
          }}
        >
          <Plus className="w-4 h-4" />
          Create
        </button>
      </div>

      {/* Playlist grid */}
      <div className="grid grid-cols-6 xl:grid-cols-7 gap-3">
        {/* Favorites pseudo-playlist */}
        <Link
          to="/library?tab=favorites"
          className="group block rounded-2xl overflow-hidden transition-all duration-200 mc-nav-item hover:-translate-y-1 hover:shadow-lg"
          style={{
            backgroundColor: 'var(--mc-glass-background)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid var(--mc-glass-border)',
          }}
        >
          <div className="p-2.5 pb-0">
            <div
              className="aspect-square relative overflow-hidden rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--mc-accent-primary) 20%, transparent), color-mix(in srgb, var(--mc-accent-primary) 5%, transparent))',
              }}
            >
              <Heart className="w-12 h-12" style={{ color: 'var(--mc-accent-primary)' }} />
            </div>
          </div>
          <div className="px-3 py-2.5 overflow-hidden">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--mc-text-primary)' }}>
              Favorites
            </p>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--mc-text-muted)' }}>
              {favoriteIds.size} {favoriteIds.size === 1 ? 'track' : 'tracks'}
            </p>
          </div>
        </Link>

        {playlists.map((pl) => (
          <div key={pl.id} className="group relative">
            <Link
              to={`/playlists/${pl.id}`}
              className="group block rounded-2xl overflow-hidden transition-all duration-200 mc-nav-item hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: 'var(--mc-glass-background)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid var(--mc-glass-border)',
              }}
            >
              <div className="p-2.5 pb-0">
                <div
                  className="aspect-square relative overflow-hidden rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}
                >
                  <ListMusic className="w-12 h-12" style={{ color: 'var(--mc-text-muted)' }} />
                </div>
              </div>
              <div className="px-3 py-2.5 overflow-hidden">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--mc-text-primary)' }}>
                  {pl.name}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--mc-text-muted)' }}>
                  {pl.trackCount} {pl.trackCount === 1 ? 'track' : 'tracks'}
                </p>
              </div>
            </Link>
            {confirmDelete === pl.id ? (
              <div
                className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                style={{ backgroundColor: 'var(--mc-bg-surface)', border: '1px solid var(--mc-border-default)' }}
              >
                <button
                  onClick={() => handleDelete(pl.id)}
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: '#ef4444', color: '#fff' }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-2 py-0.5 rounded text-xs mc-interactive-muted"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(pl.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-opacity mc-interactive-muted"
                style={{ backgroundColor: 'var(--mc-bg-surface)' }}
                aria-label={`Delete ${pl.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
