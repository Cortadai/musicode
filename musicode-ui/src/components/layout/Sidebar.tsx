import { NavLink, useNavigate } from 'react-router';
import { Home, Library, Settings, UserCog, LogOut, TrendingUp, HeartPulse, PanelLeftClose, PanelLeftOpen, Music } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import audioGraph from '../../audio/audioGraph';
import ActivityFeed from '../activity/ActivityFeed';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/stats', label: 'Stats', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings, end: true },
  ];

  const adminItems = [
    { to: '/settings/health', label: 'Library Health', icon: HeartPulse },
    { to: '/users', label: 'Users', icon: UserCog },
  ];

  async function handleLogout() {
    audioGraph.stop();
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-56'} flex flex-col h-full transition-[width] duration-200 ease-in-out`}
      style={{ backgroundColor: 'var(--mc-sidebar-background)', borderRight: '1px solid var(--mc-sidebar-border)' }}
    >
      {/* Header */}
      <div className={`py-5 flex items-center ${collapsed ? 'px-0 justify-center' : 'px-5 justify-between'}`}>
        <h1 className={`font-bold tracking-tight flex items-center gap-2 ${collapsed ? 'text-base' : 'text-lg'}`} style={{ color: 'var(--mc-text-primary)' }}>
          <Music className="w-5 h-5 shrink-0" style={{ color: 'var(--mc-accent-primary)' }} />
          {!collapsed && <span className="transition-opacity duration-200">Musicode</span>}
        </h1>
        {!collapsed && (
          <button onClick={onToggle} className="mc-interactive-muted transition-colors" title="Collapse sidebar">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapse toggle in collapsed mode */}
      {collapsed && (
        <button onClick={onToggle} className="mx-auto mb-2 mc-interactive-muted transition-colors" title="Expand sidebar">
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className={`flex-1 space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2'} rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'mc-nav-active'
                  : 'mc-nav-item'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="my-3" style={{ borderTop: '1px solid var(--mc-border-default)' }} />
            {adminItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2'} rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'mc-nav-active'
                      : 'mc-nav-item'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Activity feed - hidden when collapsed */}
      {!collapsed && <ActivityFeed />}

      {/* User info + logout */}
      <div className={`pb-4 pt-3 ${collapsed ? 'px-2' : 'px-3'}`} style={{ borderTop: '1px solid var(--mc-border-default)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 mb-2">
            <span className="text-sm truncate flex-1" style={{ color: 'var(--mc-text-primary)' }}>{user?.username}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              isAdmin ? 'mc-badge' : 'mc-badge-muted'
            }`}>
              {user?.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2'} rounded-lg text-sm font-medium mc-nav-item transition-colors w-full`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
