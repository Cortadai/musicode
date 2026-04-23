import { useState, useEffect, useCallback, useRef } from 'react';
import { usePlayerState } from '../context/PlayerContext';
import { extractColors, getCachedPalette, type ColorPalette } from '../audio/colorExtraction';
import { loadPreferences, savePreferences } from '../audio/audioPreferences';

const CSS_VARS = ['--np-color-1', '--np-color-2', '--np-bg'] as const;

function applyPalette(palette: ColorPalette) {
  const root = document.documentElement;
  root.style.setProperty('--np-color-1', palette.primary);
  root.style.setProperty('--np-color-2', palette.secondary);
  root.style.setProperty('--np-bg', palette.background);
}

function clearPalette() {
  const root = document.documentElement;
  for (const v of CSS_VARS) root.style.removeProperty(v);
}

export function useDynamicTheme() {
  const { currentTrack } = usePlayerState();
  const [enabled, setEnabled] = useState(() => loadPreferences().dynamicTheme);
  const [colors, setColors] = useState<ColorPalette | null>(null);
  const albumIdRef = useRef<number | null>(null);

  const toggle = useCallback(() => {
    setEnabled(prev => {
      const next = !prev;
      savePreferences({ dynamicTheme: next });
      if (!next) {
        clearPalette();
        setColors(null);
      }
      return next;
    });
  }, []);

  const albumId = currentTrack?.album?.id ?? null;
  const hasCover = currentTrack?.album?.hasCoverArt ?? false;

  useEffect(() => {
    if (!enabled || !albumId || !hasCover) {
      if (enabled) clearPalette();
      setColors(null);
      albumIdRef.current = null;
      return;
    }

    if (albumId === albumIdRef.current) return;
    albumIdRef.current = albumId;

    const cached = getCachedPalette(albumId);
    if (cached) {
      applyPalette(cached);
      setColors(cached);
      return;
    }

    let cancelled = false;
    extractColors(albumId).then(palette => {
      if (cancelled) return;
      applyPalette(palette);
      setColors(palette);
    });

    return () => { cancelled = true; };
  }, [enabled, albumId, hasCover]);

  useEffect(() => {
    return () => clearPalette();
  }, []);

  return { enabled, toggle, colors };
}
