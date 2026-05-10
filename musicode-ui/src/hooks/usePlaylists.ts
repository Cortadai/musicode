import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  renamePlaylist,
  deletePlaylist,
  addTracksToPlaylist,
  removeTracksFromPlaylist,
  reorderPlaylistTracks,
} from '../api/playlists';

const PLAYLISTS_KEY = ['playlists'];
const playlistKey = (id: number) => ['playlist', id];

export function usePlaylists() {
  const queryClient = useQueryClient();

  const { data: playlists = [], isLoading } = useQuery({
    queryKey: PLAYLISTS_KEY,
    queryFn: getPlaylists,
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createPlaylist(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PLAYLISTS_KEY }),
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => renamePlaylist(id, name),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PLAYLISTS_KEY });
      queryClient.invalidateQueries({ queryKey: playlistKey(id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePlaylist(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PLAYLISTS_KEY }),
  });

  const addTracksMutation = useMutation({
    mutationFn: ({ id, trackIds }: { id: number; trackIds: number[] }) => addTracksToPlaylist(id, trackIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PLAYLISTS_KEY });
      queryClient.invalidateQueries({ queryKey: playlistKey(id) });
    },
  });

  const removeTracksMutation = useMutation({
    mutationFn: ({ id, trackIds }: { id: number; trackIds: number[] }) => removeTracksFromPlaylist(id, trackIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PLAYLISTS_KEY });
      queryClient.invalidateQueries({ queryKey: playlistKey(id) });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ id, trackIds }: { id: number; trackIds: number[] }) => reorderPlaylistTracks(id, trackIds),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: playlistKey(id) });
    },
  });

  return {
    playlists,
    isLoading,
    create: createMutation.mutateAsync,
    rename: (id: number, name: string) => renameMutation.mutateAsync({ id, name }),
    remove: deleteMutation.mutateAsync,
    addTracks: (id: number, trackIds: number[]) => addTracksMutation.mutateAsync({ id, trackIds }),
    removeTracks: (id: number, trackIds: number[]) => removeTracksMutation.mutateAsync({ id, trackIds }),
    reorderTracks: (id: number, trackIds: number[]) => reorderMutation.mutateAsync({ id, trackIds }),
  };
}

export function usePlaylistDetail(id: number) {
  return useQuery({
    queryKey: playlistKey(id),
    queryFn: () => getPlaylist(id),
    enabled: !isNaN(id) && id > 0,
    staleTime: 30_000,
  });
}
