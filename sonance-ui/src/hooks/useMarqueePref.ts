import { useState, useEffect, useCallback } from 'react';
import { loadPreferences, savePreferences } from '../audio/audioPreferences';

const EVENT_NAME = 'sonance-marquee-changed';

function fireChange() {
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function useMarqueePlaybar(): boolean {
  const [enabled, setEnabled] = useState(() => loadPreferences().marqueePlaybar);

  useEffect(() => {
    const handler = () => setEnabled(loadPreferences().marqueePlaybar);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  return enabled;
}

export function useMarqueeAlbumCards(): boolean {
  const [enabled, setEnabled] = useState(() => loadPreferences().marqueeAlbumCards);

  useEffect(() => {
    const handler = () => setEnabled(loadPreferences().marqueeAlbumCards);
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  return enabled;
}

export function useMarqueeSettings() {
  const [playbar, setPlaybar] = useState(() => loadPreferences().marqueePlaybar);
  const [albumCards, setAlbumCards] = useState(() => loadPreferences().marqueeAlbumCards);

  useEffect(() => {
    const handler = () => {
      const prefs = loadPreferences();
      setPlaybar(prefs.marqueePlaybar);
      setAlbumCards(prefs.marqueeAlbumCards);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const togglePlaybar = useCallback((value: boolean) => {
    savePreferences({ marqueePlaybar: value });
    fireChange();
  }, []);

  const toggleAlbumCards = useCallback((value: boolean) => {
    savePreferences({ marqueeAlbumCards: value });
    fireChange();
  }, []);

  return { playbar, albumCards, togglePlaybar, toggleAlbumCards };
}
