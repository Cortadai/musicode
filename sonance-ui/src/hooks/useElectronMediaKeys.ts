import { useEffect } from 'react';
import { usePlayer } from './usePlayer';

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      onMediaKey: (callback: (key: string) => void) => void;
    };
  }
}

export function useElectronMediaKeys() {
  const { pause, resume, next, prev, stop, isPlaying } = usePlayer();

  useEffect(() => {
    if (!window.electronAPI) return;

    window.electronAPI.onMediaKey((key) => {
      switch (key) {
        case 'play-pause':
          if (isPlaying) pause();
          else resume();
          break;
        case 'next':
          next();
          break;
        case 'previous':
          prev();
          break;
        case 'stop':
          stop();
          break;
      }
    });
  }, [pause, resume, next, prev, stop, isPlaying]);
}
