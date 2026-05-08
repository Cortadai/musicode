import { NavLink, useNavigate } from 'react-router';
import { Outlet } from 'react-router';
import { Home, Library, Music, Search, Settings, LogOut, TrendingUp, HeartPulse } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import audioGraph from '../../../audio/audioGraph';
import PlayerBar from '../../player/PlayerBar';
import QueuePanel from '../../player/QueuePanel';
import { AnalyzerDeck, useDeckStore, buildScopeMap } from '../../analyzer';

export default function NovaShell() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { visible: deckVisible } = useDeckStore();
  const scopeMap = useMemo(() => buildScopeMap(), []);

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
    if (!searchOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setSearchOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [searchOpen]);

  async function handleLogout() {
    audioGraph.stop();
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--mc-bg-base)', color: 'var(--mc-text-primary)' }}>
      <aside
        className="w-14 flex flex-col items-center py-4 gap-1 shrink-0"
        style={{
          backgroundColor: 'var(--mc-sidebar-background)',
          borderRight: '1px solid var(--mc-sidebar-border)',
        }}
      >
        <div className="mb-3">
          <Music className="w-5 h-5" style={{ color: 'var(--mc-accent-primary)' }} />
        </div>

        <nav className="flex-1 flex flex-col items-center gap-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                  isActive
                    ? 'mc-nav-active'
                    : 'mc-nav-item'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
            >
              <Icon className="w-4 h-4" />
            </NavLink>
          ))}

          {/* Search with floating input */}
          <div className="relative" ref={searchContainerRef}>
            <button
              onClick={() => setSearchOpen(v => !v)}
              title="Search"
              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                searchOpen ? 'mc-nav-active' : 'mc-nav-item'
              }`}
              style={searchOpen ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
            >
              <Search className="w-4 h-4" />
            </button>
            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute left-full top-0 ml-2 z-50 flex items-center rounded-lg shadow-lg overflow-hidden"
                style={{
                  backgroundColor: 'var(--mc-bg-surface)',
                  border: '1px solid var(--mc-border-default)',
                }}
              >
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-56 px-3 py-2 text-sm bg-transparent outline-none selectable"
                  style={{ color: 'var(--mc-text-primary)' }}
                />
              </form>
            )}
          </div>

        </nav>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center justify-center w-9 h-9 rounded-lg mc-nav-item transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <AnalyzerDeck scopeMap={scopeMap} />
        <div className="flex-1 flex min-h-0">
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
          <QueuePanel />
        </div>
        <PlayerBar />
      </div>
    </div>
  );
}
