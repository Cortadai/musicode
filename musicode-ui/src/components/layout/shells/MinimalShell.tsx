import { NavLink, useNavigate } from 'react-router';
import { Outlet } from 'react-router';
import { useState } from 'react';
import { Home, Library, Music, Search, Settings, UserCog, TrendingUp, HeartPulse, LogOut } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import audioGraph from '../../../audio/audioGraph';
import PlayerBar from '../../player/PlayerBar';
import QueuePanel from '../../player/QueuePanel';

export default function MinimalShell() {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { to: '/', icon: Home, label: 'Home', end: true },
    { to: '/library', icon: Library, label: 'Library' },
    { to: '/stats', icon: TrendingUp, label: 'Stats' },
    { to: '/settings', icon: Settings, label: 'Settings', end: true },
  ];

  const adminItems = [
    { to: '/settings/health', icon: HeartPulse, label: 'Health' },
    { to: '/users', icon: UserCog, label: 'Users' },
  ];

  async function handleLogout() {
    audioGraph.stop();
    await logout();
    navigate('/login', { replace: true });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--mc-bg-base)', color: 'var(--mc-text-primary)' }}>
      <header
        className="h-12 flex items-center px-5 gap-6 shrink-0"
        style={{
          background: 'linear-gradient(to right, var(--mc-sidebar-background), var(--mc-glass-background))',
          borderBottom: '1px solid var(--mc-glass-border)',
          backdropFilter: 'blur(var(--mc-glass-blur))',
          WebkitBackdropFilter: 'blur(var(--mc-glass-blur))',
        }}
      >
        <span className="font-semibold text-sm tracking-tight flex items-center gap-1.5" style={{ color: 'var(--mc-accent-primary)' }}>
          <Music className="w-4 h-4" />
          Musicode
        </span>

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'mc-nav-active'
                    : 'mc-interactive-muted'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
            >
              {label}
            </NavLink>
          ))}

          {isAdmin && adminItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'mc-nav-active'
                    : 'mc-interactive-muted'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="ml-auto flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--mc-text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="w-40 bg-transparent border rounded-md pl-8 pr-3 py-1 text-xs mc-input focus:outline-none transition-colors"
              style={{
                borderColor: 'var(--mc-border-subtle)',
                color: 'var(--mc-text-primary)',
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--mc-text-muted)' }}>{user?.username}</span>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="mc-interactive-muted transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </header>

      <div className="flex-1 flex min-h-0">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <QueuePanel />
      </div>

      <PlayerBar />
    </div>
  );
}
