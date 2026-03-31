import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFolders, addFolder, removeFolder, startScan, getScanStatus } from '../api/library';
import { getScrobbleSettings, updateScrobbleSettings, disconnectLastfm, disconnectListenBrainz } from '../api/scrobble';
import { getErrorMessage } from '../utils/errors';
import { FolderOpen, Trash2, RefreshCw, Plus, Radio, Unlink } from 'lucide-react';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [newPath, setNewPath] = useState('');

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

  const addMutation = useMutation({
    mutationFn: addFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      setNewPath('');
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });

  const scanMutation = useMutation({
    mutationFn: startScan,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scanStatus'] }),
  });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (newPath.trim()) {
      addMutation.mutate(newPath.trim());
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Settings</h2>

      {/* Library Folders */}
      <section className="mb-8">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Library Folders</h3>

        {foldersLoading ? (
          <p className="text-zinc-500 text-sm">Loading…</p>
        ) : folders && folders.length > 0 ? (
          <div className="space-y-2 mb-4">
            {folders.map((folder) => (
              <div key={folder.id} className="flex items-center gap-3 px-4 py-3 bg-zinc-900 rounded-lg">
                <FolderOpen className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className="text-sm text-zinc-200 flex-1 truncate">{folder.path}</span>
                <button
                  onClick={() => removeMutation.mutate(folder.id)}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                  title="Remove folder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 text-sm mb-4">No folders added yet.</p>
        )}

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="C:\Users\you\Music"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
        {addMutation.isError && (
          <p className="text-red-400 text-sm mt-2">
            {getErrorMessage(addMutation.error, 'Failed to add folder')}
          </p>
        )}
      </section>

      {/* Scan */}
      <section>
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Library Scan</h3>

        <button
          onClick={() => scanMutation.mutate()}
          disabled={scanStatus?.scanning || scanMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${scanStatus?.scanning ? 'animate-spin' : ''}`} />
          {scanStatus?.scanning ? 'Scanning…' : 'Start Scan'}
        </button>

        {scanStatus && (scanStatus.scanning || scanStatus.completedAt) && (
          <div className="mt-4 p-4 bg-zinc-900 rounded-lg text-sm space-y-1">
            <p className="text-zinc-300">
              {scanStatus.scanning ? 'Scanning in progress…' : '✓ Scan complete'}
            </p>
            <p className="text-zinc-500">Files found: {scanStatus.filesFound}</p>
            <p className="text-zinc-500">Processed: {scanStatus.filesProcessed}</p>
            <p className="text-zinc-500">New tracks: {scanStatus.newTracks}</p>
            <p className="text-zinc-500">Updated: {scanStatus.updatedTracks}</p>
            {scanStatus.errors > 0 && (
              <p className="text-red-400">Errors: {scanStatus.errors}</p>
            )}
          </div>
        )}
      </section>

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
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Scrobbling</h3>

      {/* ListenBrainz */}
      <div className="p-4 bg-zinc-900 rounded-lg mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-zinc-200">ListenBrainz</span>
          </div>
          {settings?.listenbrainzConnected && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Connected</span>
          )}
        </div>
        {settings?.listenbrainzConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Token: {settings.listenbrainzTokenMasked}</span>
            <button
              onClick={() => disconnectLbMutation.mutate()}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
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
              placeholder="Paste your ListenBrainz token"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
            <button type="submit" disabled={!lbToken.trim() || connectMutation.isPending}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium rounded transition-colors disabled:opacity-50">
              Connect
            </button>
          </form>
        )}
      </div>

      {/* Last.fm */}
      <div className="p-4 bg-zinc-900 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-zinc-200">Last.fm</span>
          </div>
          {settings?.lastfmConnected && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Connected</span>
          )}
        </div>
        {settings?.lastfmConnected ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Session: {settings.lastfmSessionKeyMasked}</span>
            <button
              onClick={() => disconnectLfmMutation.mutate()}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
            >
              <Unlink className="w-3 h-3" /> Disconnect
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); connectMutation.mutate({ lastfmUsername: lfmUsername, lastfmPassword: lfmPassword }); }} className="space-y-2">
            <div className="flex gap-2">
              <input type="text" value={lfmUsername} onChange={(e) => setLfmUsername(e.target.value)}
                placeholder="Last.fm username"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600" />
              <input type="password" value={lfmPassword} onChange={(e) => setLfmPassword(e.target.value)}
                placeholder="Last.fm password"
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600" />
            </div>
            <button type="submit" disabled={!lfmUsername.trim() || !lfmPassword.trim() || connectMutation.isPending}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded transition-colors disabled:opacity-50">
              Connect Last.fm
            </button>
          </form>
        )}
      </div>

      {connectMutation.isError && (
        <p className="text-red-400 text-sm mt-2">{getErrorMessage(connectMutation.error, 'Connection failed')}</p>
      )}
    </section>
  );
}
