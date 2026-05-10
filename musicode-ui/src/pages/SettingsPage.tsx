import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { getFolders, addFolder, removeFolder, startScan, getScanStatus, resetLibrary } from '../api/library';
import { getScrobbleSettings, updateScrobbleSettings, disconnectLastfm, disconnectListenBrainz } from '../api/scrobble';
import { getErrorMessage } from '../utils/errors';
import { FolderOpen, Trash2, RefreshCw, Plus, Radio, Unlink, AlertTriangle, Palette, SlidersHorizontal, MessageSquare, UserPlus, Shield, Headphones, ChevronDown, Layers, Sparkles, Wand2 } from 'lucide-react';
import type { LoginTransition } from '../audio/audioPreferences';
import ThemeSelector from '../components/layout/ThemeSelector';
import PaletteSelector from '../components/layout/PaletteSelector';
import { useAuth } from '../context/AuthContext';
import { useMarqueeSettings } from '../hooks/useMarqueePref';
import { loadPreferences, savePreferences } from '../audio/audioPreferences';
import type { UserInfo } from '../types';

export default function SettingsPage() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [newPath, setNewPath] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'LISTENER'>('LISTENER');
  const [roleOpen, setRoleOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const marquee = useMarqueeSettings();
  const [greetingMessages, setGreetingMessages] = useState(() => loadPreferences().greetingMessages);
  const [particlesEnabled, setParticlesEnabled] = useState(() => loadPreferences().particlesEnabled);
  const [loginTransition, setLoginTransition] = useState<LoginTransition>(() => loadPreferences().loginTransition);

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['folders'],
    queryFn: getFolders,
  });

  const { data: scanStatus } = useQuery({
    queryKey: ['scanStatus'],
    queryFn: getScanStatus,
    refetchInterval: (query) => query.state.data?.scanning ? 1000 : false,
  });

  // When scan finishes, invalidate library data so albums/tracks/artists refresh
  const prevScanning = useRef(false);
  useEffect(() => {
    if (prevScanning.current && scanStatus && !scanStatus.scanning) {
      console.debug('[settings] Scan finished — invalidating library queries');
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['tracks-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    }
    prevScanning.current = scanStatus?.scanning ?? false;
  }, [scanStatus?.scanning, queryClient]);

  useEffect(() => {
    if (!roleOpen) return;
    const onDown = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) setRoleOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setRoleOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [roleOpen]);

  const addMutation = useMutation({
    mutationFn: addFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setNewPath('');
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['tracks-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetLibrary,
    onSuccess: () => {
      setShowResetConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      queryClient.invalidateQueries({ queryKey: ['tracks-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['scanStatus'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['activity'] });
    },
  });

  const scanMutation = useMutation({
    mutationFn: startScan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scanStatus'] }),
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get<UserInfo[]>('/users');
      return data;
    },
    enabled: isAdmin,
  });

  const createUserMutation = useMutation({
    mutationFn: async () => {
      await api.post('/users', { username: newUsername, password: newPassword, role: newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewUsername('');
      setNewPassword('');
      setNewRole('LISTENER');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => { await api.delete(`/users/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (newUsername.trim() && newPassword.trim()) createUserMutation.mutate();
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (newPath.trim()) {
      addMutation.mutate(newPath.trim());
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>

      {/* Appearance */}
      <section className="mb-8">
        <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Appearance</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-4 px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>Shell</span>
            </div>
            <ThemeSelector />
          </div>
          <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>Palette</span>
            </div>
            <PaletteSelector />
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
              <div>
                <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>Particles</span>
                <p className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>Floating particle background with hover interaction</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={particlesEnabled}
              onClick={() => {
                const next = !particlesEnabled;
                setParticlesEnabled(next);
                savePreferences({ particlesEnabled: next });
                window.dispatchEvent(new Event('musicode-particles-changed'));
              }}
              className="mc-toggle"
              data-on={particlesEnabled || undefined}
            >
              <span className="mc-toggle__thumb" />
            </button>
          </div>
          <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
              <div>
                <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>Login transition</span>
                <p className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>Animated transition after signing in</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                ['random', 'Random'],
                ['ripple', 'Ripple'],
                ['curtain', 'Curtain'],
                ['fade', 'Fade'],
                ['sweep', 'Sweep'],
                ['pixels', 'Pixels'],
                ['diagonal', 'Diagonal'],
                ['wave', 'Wave'],
                ['none', 'None'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setLoginTransition(value);
                    savePreferences({ loginTransition: value });
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                  style={loginTransition === value
                    ? { backgroundColor: 'var(--mc-accent-primary)', color: 'var(--mc-accent-text)' }
                    : { backgroundColor: 'var(--mc-bg-surface-hover)', color: 'var(--mc-text-secondary)' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Behavior */}
      <section className="mb-8">
        <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Behavior</h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
              <div>
                <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>Player marquee</span>
                <p className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>Scroll long titles in the play bar</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={marquee.playbar}
              onClick={() => marquee.togglePlaybar(!marquee.playbar)}
              className="mc-toggle"
              data-on={marquee.playbar || undefined}
            >
              <span className="mc-toggle__thumb" />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
              <div>
                <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>Album card marquee</span>
                <p className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>Scroll long titles on hover in album grid</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={marquee.albumCards}
              onClick={() => marquee.toggleAlbumCards(!marquee.albumCards)}
              className="mc-toggle"
              data-on={marquee.albumCards || undefined}
            >
              <span className="mc-toggle__thumb" />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: 'var(--mc-text-muted)' }} />
              <div>
                <span className="text-sm" style={{ color: 'var(--mc-text-primary)' }}>Greeting messages</span>
                <p className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>Show quotes and fun greetings on the home page</p>
              </div>
            </div>
            <button
              role="switch"
              aria-checked={greetingMessages}
              onClick={() => {
                const next = !greetingMessages;
                setGreetingMessages(next);
                savePreferences({ greetingMessages: next });
              }}
              className="mc-toggle"
              data-on={greetingMessages || undefined}
            >
              <span className="mc-toggle__thumb" />
            </button>
          </div>
        </div>
      </section>

      {isAdmin && (
        <>
          {/* User Management */}
          <section className="mb-8">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Users</h3>

            {usersLoading ? (
              <p className="text-sm" style={{ color: 'var(--mc-text-muted)' }}>Loading…</p>
            ) : users && users.length > 0 ? (
              <div className="space-y-2 mb-4">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
                    {u.role === 'ADMIN' ? (
                      <Shield className="w-4 h-4 shrink-0" style={{ color: 'var(--mc-accent-primary)' }} />
                    ) : (
                      <Headphones className="w-4 h-4 shrink-0" style={{ color: 'var(--mc-text-muted)' }} />
                    )}
                    <span className="text-sm flex-1" style={{ color: 'var(--mc-text-primary)' }}>{u.username}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${u.role === 'ADMIN' ? 'mc-badge' : 'mc-badge-muted'}`}>
                      {u.role}
                    </span>
                    {!u.enabled && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(248,113,113,0.2)', color: 'var(--mc-text-error)' }}>
                        disabled
                      </span>
                    )}
                    <button
                      onClick={() => deleteUserMutation.mutate(u.id)}
                      className="mc-interactive-danger transition-colors"
                      aria-label="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm mb-4" style={{ color: 'var(--mc-text-muted)' }}>No users found.</p>
            )}
            {deleteUserMutation.isError && (
              <p className="text-sm mb-2" style={{ color: 'var(--mc-text-error)' }}>
                {getErrorMessage(deleteUserMutation.error, 'Failed to delete user')}
              </p>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                aria-label="New username"
                placeholder="Username"
                required
                className="w-full px-4 py-2 text-sm mc-input"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-label="New password"
                placeholder="Password"
                required
                className="w-full px-4 py-2 text-sm mc-input"
              />
              <div className="relative" ref={roleRef}>
                <button
                  type="button"
                  onClick={() => setRoleOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={roleOpen}
                  aria-label="User role"
                  className="flex items-center justify-between w-full px-4 py-2 text-sm mc-input cursor-pointer"
                >
                  {newRole === 'ADMIN' ? 'Admin' : 'Listener'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {roleOpen && (
                  <ul
                    role="listbox"
                    aria-label="User roles"
                    className="absolute left-0 top-full mt-1 w-full border rounded-lg shadow-xl z-50 py-1"
                    style={{ backgroundColor: 'var(--mc-bg-surface-hover)', borderColor: 'var(--mc-scrollbar-thumb-hover)' }}
                  >
                    {([['LISTENER', 'Listener'], ['ADMIN', 'Admin']] as const).map(([val, label]) => (
                      <li
                        key={val}
                        role="option"
                        aria-selected={newRole === val}
                        onClick={() => { setNewRole(val); setRoleOpen(false); }}
                        className="px-4 py-2 text-sm cursor-pointer transition-colors"
                        style={newRole === val
                          ? { backgroundColor: 'var(--mc-accent-primary-hover)', color: 'var(--mc-text-primary)' }
                          : { color: 'var(--mc-text-primary)' }}
                        onMouseEnter={(e) => { if (newRole !== val) e.currentTarget.style.backgroundColor = 'var(--mc-bg-surface)'; }}
                        onMouseLeave={(e) => { if (newRole !== val) e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="submit"
                disabled={createUserMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 mc-btn-primary text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" /> Create User
              </button>
              {createUserMutation.isError && (
                <p className="text-sm" style={{ color: 'var(--mc-text-error)' }}>
                  {getErrorMessage(createUserMutation.error, 'Failed to create user')}
                </p>
              )}
            </form>
          </section>

          {/* Library Folders */}
          <section className="mb-8">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Library Folders</h3>

            {foldersLoading ? (
              <p className="text-sm" style={{ color: 'var(--mc-text-muted)' }}>Loading…</p>
            ) : folders && folders.length > 0 ? (
              <div className="space-y-2 mb-4">
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
                    <FolderOpen className="w-4 h-4 shrink-0" style={{ color: 'var(--mc-text-muted)' }} />
                    <span className="text-sm flex-1 truncate" style={{ color: 'var(--mc-text-primary)' }}>{folder.path}</span>
                    <button
                      onClick={() => removeMutation.mutate(folder.id)}
                      className="mc-interactive-danger transition-colors"
                      aria-label="Remove folder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm mb-4" style={{ color: 'var(--mc-text-muted)' }}>No folders added yet.</p>
            )}

            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                aria-label="Library folder path"
                placeholder="C:\Users\you\Music"
                className="flex-1 px-4 py-2 text-sm mc-input"
              />
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 mc-btn-primary text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>
            {addMutation.isError && (
              <p className="text-sm mt-2" style={{ color: 'var(--mc-text-error)' }}>
                {getErrorMessage(addMutation.error, 'Failed to add folder')}
              </p>
            )}
          </section>

          {/* Scan */}
          <section>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Library Scan</h3>

            <button
              onClick={() => scanMutation.mutate()}
              disabled={scanStatus?.scanning || scanMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 mc-btn-secondary text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${scanStatus?.scanning ? 'animate-spin' : ''}`} />
              {scanStatus?.scanning ? 'Scanning…' : 'Start Scan'}
            </button>

            {scanStatus && (scanStatus.scanning || scanStatus.completedAt) && (
              <div className="mt-4 p-4 rounded-lg text-sm space-y-1" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
                <p style={{ color: 'var(--mc-text-secondary)' }}>
                  {scanStatus.scanning ? 'Scanning in progress…' : '✓ Scan complete'}
                </p>
                <p style={{ color: 'var(--mc-text-muted)' }}>Files found: {scanStatus.filesFound}</p>
                <p style={{ color: 'var(--mc-text-muted)' }}>Processed: {scanStatus.filesProcessed}</p>
                <p style={{ color: 'var(--mc-text-muted)' }}>New tracks: {scanStatus.newTracks}</p>
                <p style={{ color: 'var(--mc-text-muted)' }}>Updated: {scanStatus.updatedTracks}</p>
                {scanStatus.errors > 0 && (
                  <p style={{ color: 'var(--mc-text-error)' }}>Errors: {scanStatus.errors}</p>
                )}
              </div>
            )}
          </section>

          {/* Danger Zone */}
          <section className="mt-8">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-error)', opacity: 0.8 }}>Danger Zone</h3>

            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--mc-bg-surface)', borderColor: 'color-mix(in srgb, var(--mc-text-error) 20%, transparent)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--mc-text-primary)' }}>Reset Library</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--mc-text-muted)' }}>
                    Remove all tracks, albums, artists, covers, folders, and play history. Audio files on disk are not affected.
                  </p>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  disabled={scanStatus?.scanning || resetMutation.isPending}
                  className="shrink-0 px-4 py-2 mc-btn-danger-outline text-sm font-medium rounded-lg border transition-colors disabled:opacity-50"
                >
                  Reset
                </button>
              </div>

              {showResetConfirm && (
                <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: 'color-mix(in srgb, var(--mc-text-error) 8%, transparent)', borderColor: 'color-mix(in srgb, var(--mc-text-error) 20%, transparent)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: 'var(--mc-text-error)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--mc-text-error)' }}>This action cannot be undone</span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: 'var(--mc-text-secondary)' }}>
                    All library data will be permanently deleted. You will need to re-add folders and re-scan.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => resetMutation.mutate()}
                      disabled={resetMutation.isPending}
                      className="px-3 py-1.5 mc-btn-danger text-xs font-medium rounded transition-colors disabled:opacity-50"
                    >
                      {resetMutation.isPending ? 'Resetting…' : 'Yes, reset everything'}
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 mc-btn-secondary text-xs font-medium rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {resetMutation.isError && (
                <p className="text-sm mt-2" style={{ color: 'var(--mc-text-error)' }}>{getErrorMessage(resetMutation.error, 'Reset failed')}</p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Scrobbling */}
      <ScrobbleSection />
    </div>
  );
}

function ScrobbleSection() {
  const queryClient = useQueryClient();
  const [lbToken, setLbToken] = useState('');
  const [lfmUsername, setLfmUsername] = useState('');
  const [lfmPassword, setLfmPassword] = useState('');

  const { data: settings } = useQuery({
    queryKey: ['scrobbleSettings'],
    queryFn: getScrobbleSettings,
  });

  const connectMutation = useMutation({
    mutationFn: updateScrobbleSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scrobbleSettings'] });
      setLbToken('');
      setLfmUsername('');
      setLfmPassword('');
    },
  });

  const disconnectLbMutation = useMutation({
    mutationFn: disconnectListenBrainz,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scrobbleSettings'] }),
  });

  const disconnectLfmMutation = useMutation({
    mutationFn: disconnectLastfm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scrobbleSettings'] }),
  });

  return (
    <section className="mt-8">
      <h3 className="text-sm font-medium uppercase tracking-wider mb-3" style={{ color: 'var(--mc-text-secondary)' }}>Scrobbling</h3>

      {/* ListenBrainz */}
      <div className="p-4 rounded-lg mb-3" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4" style={{ color: '#fb923c' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--mc-text-primary)' }}>ListenBrainz</span>
          </div>
          {settings?.listenbrainzConnected && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--mc-text-success) 20%, transparent)', color: 'var(--mc-text-success)' }}>Connected</span>
          )}
        </div>
        {settings?.listenbrainzConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>Token: {settings.listenbrainzTokenMasked}</span>
            <button
              onClick={() => disconnectLbMutation.mutate()}
              className="flex items-center gap-1 text-xs mc-interactive-danger transition-colors"
            >
              <Unlink className="w-3 h-3" /> Disconnect
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); connectMutation.mutate({ listenbrainzToken: lbToken }); }} className="flex gap-2">
            <input
              type="text"
              value={lbToken}
              onChange={(e) => setLbToken(e.target.value)}
              aria-label="ListenBrainz token"
              placeholder="Paste your ListenBrainz token"
              className="flex-1 px-3 py-1.5 text-xs mc-input"
            />
            <button type="submit" disabled={!lbToken.trim() || connectMutation.isPending}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium rounded transition-colors disabled:opacity-50">
              Connect
            </button>
          </form>
        )}
      </div>

      {/* Last.fm */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--mc-bg-surface)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4" style={{ color: '#f87171' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--mc-text-primary)' }}>Last.fm</span>
          </div>
          {settings?.lastfmConnected && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--mc-text-success) 20%, transparent)', color: 'var(--mc-text-success)' }}>Connected</span>
          )}
        </div>
        {settings?.lastfmConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>Session: {settings.lastfmSessionKeyMasked}</span>
            <button
              onClick={() => disconnectLfmMutation.mutate()}
              className="flex items-center gap-1 text-xs mc-interactive-danger transition-colors"
            >
              <Unlink className="w-3 h-3" /> Disconnect
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); connectMutation.mutate({ lastfmUsername: lfmUsername, lastfmPassword: lfmPassword }); }} className="space-y-2">
            <div className="flex gap-2">
              <input type="text" value={lfmUsername} onChange={(e) => setLfmUsername(e.target.value)}
                aria-label="Last.fm username"
                placeholder="Last.fm username"
                className="flex-1 px-3 py-1.5 text-xs mc-input" />
              <input type="password" value={lfmPassword} onChange={(e) => setLfmPassword(e.target.value)}
                aria-label="Last.fm password"
                placeholder="Last.fm password"
                className="flex-1 px-3 py-1.5 text-xs mc-input" />
            </div>
            <button type="submit" disabled={!lfmUsername.trim() || !lfmPassword.trim() || connectMutation.isPending}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition-colors disabled:opacity-50">
              Connect Last.fm
            </button>
          </form>
        )}
      </div>

      {connectMutation.isError && (
        <p className="text-sm mt-2" style={{ color: 'var(--mc-text-error)' }}>{getErrorMessage(connectMutation.error, 'Connection failed')}</p>
      )}
    </section>
  );
}
