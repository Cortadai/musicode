import { NavLink, useNavigate } from 'react-router';
import { Home, Library, ListMusic, Settings, LogOut, TrendingUp, HeartPulse, Music } from 'lucide-react';
import GitHubIcon from '../icons/GitHubIcon';
import { useAuth } from '../../context/AuthContext';
import audioGraph from '../../audio/audioGraph';
import ActivityFeed from '../activity/ActivityFeed';

export default function Sidebar() {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/playlists', label: 'Playlists', icon: ListMusic },
    { to: '/stats', label: 'Stats', icon: TrendingUp },
    { to: '/settings/health', label: 'Library Health', icon: HeartPulse },
    { to: '/settings', label: 'Settings', icon: Settings, end: true },
  ];

  async function handleLogout() {
    audioGraph.stop();
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className="w-56 flex flex-col h-full relative z-[1]"
      style={{
        background: 'linear-gradient(to bottom, var(--mc-sidebar-background), var(--mc-glass-background))',
        borderRight: '1px solid var(--mc-glass-border)',
        backdropFilter: 'blur(var(--mc-glass-blur))',
        WebkitBackdropFilter: 'blur(var(--mc-glass-blur))',
      }}
    >
      {/* Header */}
      <div className="py-5 px-5 flex items-center gap-3">
        <h1 className="font-bold tracking-tight flex items-center gap-2 text-lg" style={{ color: 'var(--mc-text-primary)' }}>
          <Music className="w-5 h-5 shrink-0" style={{ color: 'var(--mc-accent-primary)' }} />
          <span>Musicode</span>
        </h1>
        <a href="https://github.com/Cortadai/musicode" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="mc-interactive-muted transition-colors">
          <GitHubIcon className="w-4 h-4" />
        </a>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5 px-3 pb-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'mc-nav-active' : 'mc-nav-item'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

      </nav>

      <ActivityFeed />

      {/* User info + logout — height synced with PlayerBar via CSS var */}
      <div
        className="flex flex-col justify-center px-3 shrink-0 transition-[height] duration-200"
        style={{
          borderTop: '1px solid var(--mc-border-default)',
          height: 'calc(var(--mc-player-height, 7rem) + 1px)',
        }}
      >
        <div className="flex items-center gap-2 px-3 mb-2">
          <span className="text-sm truncate flex-1" style={{ color: 'var(--mc-text-primary)' }}>{user?.username}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            isAdmin ? 'mc-badge' : 'mc-badge-muted'
          }`}>
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium mc-nav-item transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
