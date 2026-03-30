import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFolders, addFolder, removeFolder, startScan, getScanStatus } from '../api/library';
import { FolderOpen, Trash2, RefreshCw, Plus } from 'lucide-react';

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
            {(addMutation.error as Error).message || 'Failed to add folder'}
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
    </div>
  );
}
