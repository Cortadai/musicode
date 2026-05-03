import { useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { useTheme } from '../../themes';
import EvolvedShell from './shells/EvolvedShell';
import NovatouchShell from './shells/NovatouchShell';
import MinimalShell from './shells/MinimalShell';

const shellByLayout = {
  'sidebar-expanded': EvolvedShell,
  'sidebar-icons': NovatouchShell,
  'horizontal': MinimalShell,
} as const;

export default function AppShell() {
  const { isPlaying, currentTrack, pause, resume, next, prev, setVolume, volume } = usePlayer();
  const { theme } = useTheme();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
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

    function handleContextMenu(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return;
      if (target.closest('.selectable')) return;
      e.preventDefault();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isPlaying, currentTrack, pause, resume, next, prev, setVolume, volume]);

  const Shell = shellByLayout[theme.layout];
  return <Shell />;
}
