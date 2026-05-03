import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { ThemeProvider } from './themes';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import Spinner from './components/common/Spinner';
import HomePage from './pages/HomePage';

const LoginPage = lazy(() => import('./pages/LoginPage'));

const LibraryPage = lazy(() => import('./pages/LibraryPage'));
const AlbumDetailPage = lazy(() => import('./pages/AlbumDetailPage'));
const ArtistDetailPage = lazy(() => import('./pages/ArtistDetailPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const StatsPage = lazy(() => import('./pages/StatsPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const LibraryHealthPage = lazy(() => import('./pages/LibraryHealthPage'));

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
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Suspense fallback={<Spinner />}><LoginPage /></Suspense>} />

              {/* Protected routes — any authenticated user */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route index element={<HomePage />} />
                  <Route path="/library" element={<Suspense fallback={<Spinner />}><LibraryPage /></Suspense>} />
                  <Route path="/albums/:id" element={<Suspense fallback={<Spinner />}><AlbumDetailPage /></Suspense>} />
                  <Route path="/artists/:id" element={<Suspense fallback={<Spinner />}><ArtistDetailPage /></Suspense>} />
                  <Route path="/search" element={<Suspense fallback={<Spinner />}><SearchPage /></Suspense>} />
                  <Route path="/stats" element={<Suspense fallback={<Spinner />}><StatsPage /></Suspense>} />
                  <Route path="/settings" element={<Suspense fallback={<Spinner />}><SettingsPage /></Suspense>} />
                  {/* Redirects from old routes */}
                  <Route path="/albums" element={<Navigate to="/library?tab=albums" replace />} />
                  <Route path="/artists" element={<Navigate to="/library?tab=artists" replace />} />
                  <Route path="/tracks" element={<Navigate to="/library?tab=tracks" replace />} />
                </Route>
              </Route>

              {/* Admin-only routes */}
              <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
                <Route element={<AppShell />}>
                  <Route path="/settings/health" element={<Suspense fallback={<Spinner />}><LibraryHealthPage /></Suspense>} />
                  <Route path="/users" element={<Suspense fallback={<Spinner />}><UsersPage /></Suspense>} />
                </Route>
              </Route>
            </Routes>
            </BrowserRouter>
          </PlayerProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}
