import { NavLink } from 'react-router';
import { Disc3, Users, Music, Search, Settings } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Albums', icon: Disc3 },
  { to: '/artists', label: 'Artists', icon: Users },
  { to: '/tracks', label: 'Tracks', icon: Music },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
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
      </nav>
    </aside>
  );
}
