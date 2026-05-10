import { NavLink, useNavigate } from 'react-router';
import { Outlet } from 'react-router';
import { Home, Library, Music, Search, Settings, LogOut, TrendingUp, HeartPulse } from 'lucide-react';
import GitHubIcon from '../../icons/GitHubIcon';
import { useAuth } from '../../../context/AuthContext';
import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import audioGraph from '../../../audio/audioGraph';
import PlayerBar from '../../player/PlayerBar';
import QueuePanel from '../../player/QueuePanel';
import LyricsSidebar from '../../player/LyricsSidebar';
import { AnalyzerDeck, useDeckStore, buildScopeMap } from '../../analyzer';
import { useParticlesEnabled } from '../../../hooks/useParticles';

const ParticlesBackground = lazy(() => import('../ParticlesBackground'));

export default function NovaShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { visible: _deckVisible } = useDeckStore();
  const scopeMap = useMemo(() => buildScopeMap(), []);
  const particles = useParticlesEnabled();

  const navItems = [
    { to: '/', icon: Home, label: 'Home', end: true },
    { to: '/library', icon: Library, label: 'Library' },
    { to: '/stats', icon: TrendingUp, label: 'Stats' },
    { to: '/settings/health', icon: HeartPulse, label: 'Health' },
    { to: '/settings', icon: Settings, label: 'Settings', end: true },
  ];

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
      if (e.key === 'Escape' && searchOpen) setSearchOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  async function handleLogout() {
    audioGraph.stop();
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="h-screen flex overflow-hidden relative" style={{ backgroundColor: 'var(--mc-bg-base)', color: 'var(--mc-text-primary)' }}>
      {particles && <Suspense><ParticlesBackground /></Suspense>}
      <aside
        className="w-14 flex flex-col items-center py-4 gap-1 shrink-0 relative z-[1]"
        style={{
          backgroundColor: 'var(--mc-sidebar-background)',
          borderRight: '1px solid var(--mc-sidebar-border)',
        }}
      >
        <div className="mb-3">
          <Music className="w-5 h-5" style={{ color: 'var(--mc-accent-primary)' }} />
        </div>
        <a href="https://github.com/Cortadai/musicode" target="_blank" rel="noopener noreferrer" title="GitHub" className="mc-interactive-muted transition-colors">
          <GitHubIcon className="w-4 h-4" />
        </a>

        <div className="w-6 my-2" style={{ borderBottom: '1px solid var(--mc-sidebar-border)' }} />

        <nav className="flex-1 flex flex-col items-center gap-1">
          {/* Home */}
          <NavLink
            to="/"
            end
            title="Home"
            className={({ isActive }) =>
              `flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                isActive ? 'mc-nav-active' : 'mc-nav-item'
              }`
            }
            style={({ isActive }) => isActive ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
          >
            <Home className="w-4 h-4" />
          </NavLink>

          {/* Search — Spotlight style */}
          <button
            onClick={() => setSearchOpen(true)}
            title="Search (Ctrl+K)"
            className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
              searchOpen ? 'mc-nav-active' : 'mc-nav-item'
            }`}
            style={searchOpen ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Rest of nav items */}
          {navItems.slice(1).map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                  isActive ? 'mc-nav-active' : 'mc-nav-item'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
            >
              <Icon className="w-4 h-4" />
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center justify-center w-9 h-9 rounded-lg mc-nav-item transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative z-[1]">
        <AnalyzerDeck scopeMap={scopeMap} />
        <div className="flex-1 flex min-h-0">
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
          <QueuePanel />
          <LyricsSidebar />
        </div>
        <PlayerBar />
      </div>

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden outline-none"
            style={{
              backgroundColor: 'var(--mc-bg-surface)',
            }}
          >
            <div className="flex items-center px-4 gap-3">
              <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--mc-text-muted)' }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search artists, albums, tracks…"
                className="flex-1 py-4 text-base bg-transparent outline-none selectable"
                style={{ color: 'var(--mc-text-primary)', outline: 'none' }}
              />
              <kbd
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  color: 'var(--mc-text-muted)',
                  backgroundColor: 'var(--mc-bg-elevated)',
                }}
              >
                ESC
              </kbd>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
