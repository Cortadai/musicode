import { useMemo, lazy, Suspense } from 'react';
import { Outlet } from 'react-router';
import Sidebar from '../Sidebar';
import TopBar from '../TopBar';
import PlayerBar from '../../player/PlayerBar';
import QueuePanel from '../../player/QueuePanel';
import LyricsSidebar from '../../player/LyricsSidebar';
import { AnalyzerDeck, buildScopeMap } from '../../analyzer';
import { useParticlesEnabled } from '../../../hooks/useParticles';

const ParticlesBackground = lazy(() => import('../ParticlesBackground'));

export default function EvolvedShell() {
  const scopeMap = useMemo(() => buildScopeMap(), []);
  const particles = useParticlesEnabled();

  return (
    <div className="h-screen flex overflow-hidden relative" style={{ backgroundColor: 'var(--mc-bg-base)', color: 'var(--mc-text-primary)' }}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-[var(--mc-bg-surface)] focus:text-[var(--mc-text-primary)] focus:rounded-md focus:m-2">
        Skip to main content
      </a>
      {particles && <Suspense><ParticlesBackground /></Suspense>}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-[1]">
        <TopBar />
        <AnalyzerDeck scopeMap={scopeMap} />
        <div className="flex-1 flex min-h-0">
          <main id="main-content" className="flex-1 overflow-y-auto p-6">
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
