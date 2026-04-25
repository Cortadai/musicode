import { NavLink, useNavigate } from 'react-router';
import { Disc3, Users, Music, Search, Settings, UserCog, LogOut, TrendingUp, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import audioGraph from '../../audio/audioGraph';
import ActivityFeed from '../activity/ActivityFeed';

export default function Sidebar() {
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
    <aside className="w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full">
      <div className="px-5 py-5">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <Music className="w-5 h-5 text-indigo-400" />
          Musicode
        </h1>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
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
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* Activity feed */}
      <ActivityFeed />

      {/* User info + logout */}
      <div className="px-3 pb-4 border-t border-zinc-800 pt-3">
        <div className="flex items-center gap-2 px-3 mb-2">
          <span className="text-sm text-zinc-300 truncate flex-1">{user?.username}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            isAdmin ? 'bg-indigo-500/20 text-indigo-300' : 'bg-zinc-800 text-zinc-500'
          }`}>
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
