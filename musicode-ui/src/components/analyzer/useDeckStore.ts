import { useSyncExternalStore, useCallback } from 'react';
import type { DeckConfig } from './types';
import { DEFAULT_DECK_CONFIG } from './types';

const STORAGE_KEY = 'musicode-deck';

let state: DeckConfig = loadFromStorage();
const listeners = new Set<() => void>();

function loadFromStorage(): DeckConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DECK_CONFIG };
    const parsed = JSON.parse(raw);
    return {
      visible: typeof parsed.visible === 'boolean' ? parsed.visible : DEFAULT_DECK_CONFIG.visible,
      activeScopes: Array.isArray(parsed.activeScopes) ? parsed.activeScopes : [...DEFAULT_DECK_CONFIG.activeScopes],
      proportions: Array.isArray(parsed.proportions) ? parsed.proportions : [...DEFAULT_DECK_CONFIG.proportions],
    };
  } catch {
    return { ...DEFAULT_DECK_CONFIG };
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function emit(): void {
  listeners.forEach((l) => l());
}

function update(partial: Partial<DeckConfig>): void {
  state = { ...state, ...partial };
  persist();
  emit();
}

function getSnapshot(): DeckConfig {
  return state;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDeckStore(): DeckConfig & {
  toggleVisible: () => void;
  setActiveScopes: (ids: string[], proportions?: number[]) => void;
  setProportions: (proportions: number[]) => void;
} {
  const config = useSyncExternalStore(subscribe, getSnapshot);

  const toggleVisible = useCallback(() => {
    update({ visible: !state.visible });
  }, []);

  const setActiveScopes = useCallback((ids: string[], proportions?: number[]) => {
    update({
      activeScopes: ids,
      proportions: proportions ?? ids.map(() => 1),
    });
  }, []);

  const setProportions = useCallback((proportions: number[]) => {
    update({ proportions });
  }, []);

  return { ...config, toggleVisible, setActiveScopes, setProportions };
}

export function getDeckVisible(): boolean {
  return state.visible;
}
