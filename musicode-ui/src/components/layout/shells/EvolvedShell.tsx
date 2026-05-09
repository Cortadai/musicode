import { useMemo } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import PlayerBar from '../../player/PlayerBar';
import QueuePanel from '../../player/QueuePanel';
import LyricsSidebar from '../../player/LyricsSidebar';
import { AnalyzerDeck, buildScopeMap } from '../../analyzer';

export default function EvolvedShell() {
  const scopeMap = useMemo(() => buildScopeMap(), []);

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--mc-bg-base)', color: 'var(--mc-text-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
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
    </div>
  );
}
