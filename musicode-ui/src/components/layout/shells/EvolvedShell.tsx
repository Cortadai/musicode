import { Outlet } from 'react-router';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import PlayerBar from '../../player/PlayerBar';
import QueuePanel from '../../player/QueuePanel';
import { useSidebarCollapse } from '../../../hooks/useSidebarCollapse';

export default function EvolvedShell() {
  const { collapsed, toggle } = useSidebarCollapse();

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--mc-bg-base)', color: 'var(--mc-text-primary)' }}>
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
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
