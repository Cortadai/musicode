import { NavLink, useNavigate } from 'react-router';
import { Outlet } from 'react-router';
import { Home, Library, Music, Search, Settings, UserCog, LogOut, TrendingUp, HeartPulse } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import audioGraph from '../../../audio/audioGraph';
import PlayerBar from '../../player/PlayerBar';
import QueuePanel from '../../player/QueuePanel';

export default function NovatouchShell() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', icon: Home, label: 'Home', end: true },
    { to: '/library', icon: Library, label: 'Library' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/stats', icon: TrendingUp, label: 'Stats' },
    { to: '/settings', icon: Settings, label: 'Settings', end: true },
  ];

  const adminItems = [
    { to: '/settings/health', icon: HeartPulse, label: 'Library Health' },
    { to: '/users', icon: UserCog, label: 'Users' },
  ];

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
                    : 'mc-interactive-muted'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
            >
              <Icon className="w-4 h-4" />
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <div className="w-6 my-2" style={{ borderTop: '1px solid var(--mc-border-subtle)' }} />
              {adminItems.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  title={label}
                  className={({ isActive }) =>
                    `flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                      isActive
                        ? 'mc-nav-active'
                        : 'mc-interactive-muted'
                    }`
                  }
                  style={({ isActive }) => isActive ? { backgroundColor: 'var(--mc-sidebar-active-background)' } : undefined}
                >
                  <Icon className="w-4 h-4" />
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center justify-center w-9 h-9 rounded-lg mc-interactive-muted transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
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
