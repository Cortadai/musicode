import { useEffect } from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PlayerBar from '../player/PlayerBar';
import { usePlayer } from '../../hooks/usePlayer';
import { useSidebarCollapse } from '../../hooks/useSidebarCollapse';

export default function AppShell() {
  const { isPlaying, currentTrack, pause, resume, next, prev, setVolume, volume } = usePlayer();
  const { collapsed, toggle } = useSidebarCollapse();

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture keys when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (!currentTrack) return;
          isPlaying ? pause() : resume();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 0.8);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTrack, pause, resume, next, prev, setVolume, volume]);

  return (
    <div className="h-screen flex overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <PlayerBar />
      </div>
    </div>
  );
}
