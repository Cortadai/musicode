import { useCallback, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, ListMusic, Pencil, Play, Square, Check, X, ChevronUp, ChevronDown, Trash2, Minus } from 'lucide-react';
import { usePlaylistDetail, usePlaylists } from '../hooks/usePlaylists';
import { usePlayer } from '../hooks/usePlayer';
import { useCurrentTrackInfo } from '../context/PlayerContext';
import TrackList from '../components/library/TrackList';
import Spinner from '../components/common/Spinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getErrorMessage } from '../utils/errors';
import type { Track } from '../types';

function formatTotalDuration(totalSec: number): string {
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  if (hours === 0) return `${mins} min`;
  return `${hours}h ${mins}m`;
}

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const playlistId = Number(id);
  const navigate = useNavigate();
  const { data: playlist, isLoading, error } = usePlaylistDetail(playlistId);
  const { rename, remove, reorderTracks, removeTracks } = usePlaylists();
  const { playAlbum, stop } = usePlayer();
  const { trackId: currentTrackId, isPlaying } = useCurrentTrackInfo();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [reordering, setReordering] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const tracks: Track[] = useMemo(
    () =>
      (playlist?.tracks ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        trackNumber: t.trackNumber ?? null,
        discNumber: null,
        duration: t.duration ?? null,
        filePath: t.filePath,
        fileSize: null,
        bitRate: null,
        sampleRate: null,
        bitsPerSample: null,
        year: null,
        genre: null,
        album: t.album ? { ...t.album, year: null, hasCoverArt: true } : null,
        artist: t.artist ?? null,
      })),
    [playlist],
  );

  const totalDuration = useMemo(
    () => tracks.reduce((sum, t) => sum + (t.duration ?? 0), 0),
    [tracks],
  );

  const isPlaylistPlaying = isPlaying && currentTrackId != null && tracks.some((t) => t.id === currentTrackId);

  const handlePlay = useCallback(
    (_track: Track, index: number) => playAlbum(tracks, index),
    [playAlbum, tracks],
  );

  const handlePlayAll = useCallback(() => {
    if (isPlaylistPlaying) {
      stop();
    } else if (tracks.length > 0) {
      playAlbum(tracks, 0);
    }
  }, [isPlaylistPlaying, stop, playAlbum, tracks]);

  const handleStartEdit = useCallback(() => {
    if (playlist) {
      setEditName(playlist.name);
      setEditing(true);
    }
  }, [playlist]);

  const handleSaveEdit = useCallback(async () => {
    const name = editName.trim();
    if (name && playlist && name !== playlist.name) {
      await rename(playlist.id, name);
    }
    setEditing(false);
  }, [editName, playlist, rename]);

  const handleEditKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSaveEdit();
      if (e.key === 'Escape') setEditing(false);
    },
    [handleSaveEdit],
  );

  const handleDelete = useCallback(async () => {
    if (!playlist) return;
    await remove(playlist.id);
    navigate('/playlists');
  }, [playlist, remove, navigate]);

  const handleMoveUp = useCallback(
    async (index: number) => {
      if (index === 0 || !playlist) return;
      const ids = tracks.map((t) => t.id);
      [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
      await reorderTracks(playlist.id, ids);
    },
    [tracks, playlist, reorderTracks],
  );

  const handleMoveDown = useCallback(
    async (index: number) => {
      if (index >= tracks.length - 1 || !playlist) return;
      const ids = tracks.map((t) => t.id);
      [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
      await reorderTracks(playlist.id, ids);
    },
    [tracks, playlist, reorderTracks],
  );

  const handleRemoveTrack = useCallback(
    async (trackId: number) => {
      if (!playlist) return;
      await removeTracks(playlist.id, [trackId]);
    },
    [playlist, removeTracks],
  );

  if (isLoading) return <Spinner />;
  if (error || !playlist) return <ErrorMessage message="Playlist not found" detail={getErrorMessage(error)} />;

  return (
    <div>
      <Link to="/playlists" className="inline-flex items-center gap-1.5 text-sm mc-interactive-muted mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to playlists
      </Link>

      <div className="flex gap-8 mb-6">
        {/* Playlist icon */}
        <div
          className="w-48 h-48 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
          style={{ backgroundColor: 'var(--mc-bg-surface-hover)' }}
        >
          <ListMusic className="w-16 h-16" style={{ color: 'var(--mc-text-muted)' }} />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-end min-w-0">
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--mc-text-muted)' }}>
            Playlist
          </p>
          {editing ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleEditKeyDown}
                autoFocus
                className="text-3xl font-bold bg-transparent outline-none border-b-2"
                style={{
                  color: 'var(--mc-text-primary)',
                  borderColor: 'var(--mc-accent-primary)',
                }}
              />
              <button onClick={handleSaveEdit} className="mc-interactive-muted p-1" aria-label="Save name">
                <Check className="w-5 h-5" />
              </button>
              <button onClick={() => setEditing(false)} className="mc-interactive-muted p-1" aria-label="Cancel edit">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold truncate" style={{ color: 'var(--mc-text-primary)' }}>
                {playlist.name}
              </h2>
              <button onClick={handleStartEdit} className="mc-interactive-muted p-1 shrink-0" aria-label="Rename playlist">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-sm" style={{ color: 'var(--mc-text-secondary)' }}>
            {playlist.trackCount} {playlist.trackCount === 1 ? 'track' : 'tracks'}
            {totalDuration > 0 && ` · ${formatTotalDuration(totalDuration)}`}
          </p>
          <div className="flex items-center gap-3 mt-3">
            {tracks.length > 0 && (
              <button
                onClick={handlePlayAll}
                className="play-album-btn flex items-center gap-2 w-fit px-5 py-2.5 rounded-full text-sm font-medium focus-visible:outline-none focus-visible:ring-2"
                style={{
                  color: 'var(--mc-bg-base)',
                  ['--tw-ring-color' as string]: 'var(--mc-accent-primary)',
                }}
              >
                {isPlaylistPlaying ? (
                  <><Square className="w-3.5 h-3.5" fill="currentColor" /> Stop</>
                ) : (
                  <><Play className="w-4 h-4" fill="currentColor" /> Play</>
                )}
              </button>
            )}
            {tracks.length > 1 && (
              <button
                onClick={() => setReordering(!reordering)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors"
                style={{
                  backgroundColor: reordering ? 'var(--mc-accent-primary)' : 'var(--mc-bg-surface)',
                  color: reordering ? 'var(--mc-bg-base)' : 'var(--mc-text-secondary)',
                  border: reordering ? 'none' : '1px solid var(--mc-border-default)',
                }}
              >
                <ChevronUp className="w-3 h-3" />
                <ChevronDown className="w-3 h-3 -ml-1.5" />
                Reorder
              </button>
            )}
            {confirmDelete ? (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
                style={{ backgroundColor: 'var(--mc-bg-surface)', border: '1px solid var(--mc-border-default)' }}
              >
                <span style={{ color: 'var(--mc-text-secondary)' }}>Delete playlist?</span>
                <button
                  onClick={handleDelete}
                  className="px-2 py-0.5 rounded text-xs font-medium"
                  style={{ backgroundColor: '#ef4444', color: '#fff' }}
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-0.5 rounded text-xs mc-interactive-muted"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium mc-interactive-muted transition-colors"
                style={{
                  backgroundColor: 'var(--mc-bg-surface)',
                  border: '1px solid var(--mc-border-default)',
                }}
                aria-label="Delete playlist"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <ListMusic className="w-12 h-12" style={{ color: 'var(--mc-text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--mc-text-muted)' }}>
            This playlist is empty. Add tracks from the library.
          </p>
        </div>
      ) : reordering ? (
        <div className="mt-6 space-y-0.5">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg"
              style={{ backgroundColor: 'var(--mc-bg-surface)' }}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-0.5 rounded transition-colors disabled:opacity-20"
                  style={{ color: 'var(--mc-text-secondary)' }}
                  aria-label={`Move ${track.title} up`}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === tracks.length - 1}
                  className="p-0.5 rounded transition-colors disabled:opacity-20"
                  style={{ color: 'var(--mc-text-secondary)' }}
                  aria-label={`Move ${track.title} down`}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <span className="w-6 text-right text-xs tabular-nums" style={{ color: 'var(--mc-text-muted)' }}>
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate" style={{ color: 'var(--mc-text-primary)' }}>{track.title}</p>
                <p className="text-xs truncate" style={{ color: 'var(--mc-text-muted)' }}>
                  {track.artist?.name ?? 'Unknown'}
                </p>
              </div>
              <button
                onClick={() => handleRemoveTrack(track.id)}
                className="p-1.5 rounded transition-colors mc-interactive-muted"
                aria-label={`Remove ${track.title}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <TrackList tracks={tracks} showAlbum showFavorites onPlay={handlePlay} />
        </div>
      )}
    </div>
  );
}
