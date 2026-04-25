import { NavLink, useNavigate } from 'react-router';
import { Disc3, Users, Music, Search, Settings, UserCog, LogOut, TrendingUp, HeartPulse, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
    { to: '/', label: 'Albums', icon: Disc3 },
    { to: '/artists', label: 'Artists', icon: Users },
    { to: '/tracks', label: 'Tracks', icon: Music },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/stats', label: 'Stats', icon: TrendingUp },
  ];

  const adminItems = [
    { to: '/settings', label: 'Settings', icon: Settings, end: true },
    { to: '/settings/health', label: 'Library Health', icon: HeartPulse },
    { to: '/users', label: 'Users', icon: UserCog },
  ];

  async function handleLogout() {
    audioGraph.stop();
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-56'} bg-zinc-950 border-r border-zinc-800 flex flex-col h-full transition-[width] duration-200 ease-in-out`}>
      {/* Header */}
      <div className={`py-5 flex items-center ${collapsed ? 'px-0 justify-center' : 'px-5 justify-between'}`}>
        <h1 className={`font-bold tracking-tight text-white flex items-center gap-2 ${collapsed ? 'text-base' : 'text-lg'}`}>
          <Music className="w-5 h-5 text-indigo-400 shrink-0" />
          {!collapsed && <span className="transition-opacity duration-200">Musicode</span>}
        </h1>
        {!collapsed && (
          <button onClick={onToggle} className="text-zinc-500 hover:text-zinc-300 transition-colors" title="Collapse sidebar">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapse toggle in collapsed mode */}
      {collapsed && (
        <button onClick={onToggle} className="mx-auto mb-2 text-zinc-500 hover:text-zinc-300 transition-colors" title="Expand sidebar">
          <PanelLeftOpen className="w-4 h-4" />
        </button>
      )}

      {/* Navigation */}
      <nav className={`flex-1 space-y-0.5 ${collapsed ? 'px-2' : 'px-3'}`}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2'} rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className="my-3 border-t border-zinc-800" />
            {adminItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2'} rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
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
      <div className={`pb-4 border-t border-zinc-800 pt-3 ${collapsed ? 'px-2' : 'px-3'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 mb-2">
            <span className="text-sm text-zinc-300 truncate flex-1">{user?.username}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              isAdmin ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {user?.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2'} rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors w-full`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </aside>
  );
}
