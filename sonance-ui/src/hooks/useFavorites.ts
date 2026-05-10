import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavoriteIds, toggleFavorite } from '../api/favorites';

const FAVORITE_IDS_KEY = ['favorite-ids'] as const;

export function useFavorites() {
  const queryClient = useQueryClient();

  const { data: favoriteIds = new Set<number>() } = useQuery({
    queryKey: FAVORITE_IDS_KEY,
    queryFn: getFavoriteIds,
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (trackId: number) => {
      await queryClient.cancelQueries({ queryKey: FAVORITE_IDS_KEY });
      const previous = queryClient.getQueryData<Set<number>>(FAVORITE_IDS_KEY);

      queryClient.setQueryData<Set<number>>(FAVORITE_IDS_KEY, (old) => {
        const next = new Set(old);
        if (next.has(trackId)) next.delete(trackId);
        else next.add(trackId);
        return next;
      });

      return { previous };
    },
    onError: (_err, _trackId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(FAVORITE_IDS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITE_IDS_KEY });
      queryClient.invalidateQueries({ queryKey: ['favorites-count'] });
    },
  });

  return {
    favoriteIds,
    isFavorite: (trackId: number) => favoriteIds.has(trackId),
    toggle: (trackId: number) => mutation.mutate(trackId),
  };
}
