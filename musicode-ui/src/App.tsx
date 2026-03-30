import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router';
import { PlayerProvider } from './context/PlayerContext';
import AppShell from './components/layout/AppShell';
import AlbumsPage from './pages/AlbumsPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import TracksPage from './pages/TracksPage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlayerProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<AlbumsPage />} />
              <Route path="/albums/:id" element={<AlbumDetailPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artists/:id" element={<ArtistDetailPage />} />
              <Route path="/tracks" element={<TracksPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </QueryClientProvider>
  );
}
