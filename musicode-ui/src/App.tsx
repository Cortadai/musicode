import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import Spinner from './components/common/Spinner';
import AlbumsPage from './pages/AlbumsPage';

const LoginPage = lazy(() => import('./pages/LoginPage'));

const AlbumDetailPage = lazy(() => import('./pages/AlbumDetailPage'));
const ArtistsPage = lazy(() => import('./pages/ArtistsPage'));
const ArtistDetailPage = lazy(() => import('./pages/ArtistDetailPage'));
const TracksPage = lazy(() => import('./pages/TracksPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PlayerProvider>
            <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Suspense fallback={<Spinner />}><LoginPage /></Suspense>} />

              {/* Protected routes — any authenticated user */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route index element={<AlbumsPage />} />
                  <Route path="/albums/:id" element={<Suspense fallback={<Spinner />}><AlbumDetailPage /></Suspense>} />
                  <Route path="/artists" element={<Suspense fallback={<Spinner />}><ArtistsPage /></Suspense>} />
                  <Route path="/artists/:id" element={<Suspense fallback={<Spinner />}><ArtistDetailPage /></Suspense>} />
                  <Route path="/tracks" element={<Suspense fallback={<Spinner />}><TracksPage /></Suspense>} />
                  <Route path="/search" element={<Suspense fallback={<Spinner />}><SearchPage /></Suspense>} />
                  <Route path="/stats" element={<Suspense fallback={<Spinner />}><StatsPage /></Suspense>} />

                </Route>
              </Route>

              {/* Admin-only routes */}
              <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                <Route element={<AppShell />}>
                  <Route path="/settings" element={<Suspense fallback={<Spinner />}><SettingsPage /></Suspense>} />
                  <Route path="/users" element={<Suspense fallback={<Spinner />}><UsersPage /></Suspense>} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </PlayerProvider>
      </AuthProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}
