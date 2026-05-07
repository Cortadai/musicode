import { useSyncExternalStore, useCallback } from 'react';
import type { DeckConfig, VectorMode, VuMode, WaveformSpeed, OscilloscopeSpeed } from './types';
import { DEFAULT_DECK_CONFIG, SCOPE_REGISTRY } from './types';

const STORAGE_KEY = 'musicode-deck';

let state: DeckConfig = loadFromStorage();
const listeners = new Set<() => void>();

const CONFIG_VERSION = 13;

function loadFromStorage(): DeckConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DECK_CONFIG };
    const parsed = JSON.parse(raw);
    if (parsed._v !== CONFIG_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return { ...DEFAULT_DECK_CONFIG };
    }
    return {
      visible: typeof parsed.visible === 'boolean' ? parsed.visible : DEFAULT_DECK_CONFIG.visible,
      activeScopes: Array.isArray(parsed.activeScopes) ? parsed.activeScopes : [...DEFAULT_DECK_CONFIG.activeScopes],
      proportions: Array.isArray(parsed.proportions) ? parsed.proportions : [...DEFAULT_DECK_CONFIG.proportions],
      fftSize: typeof parsed.fftSize === 'number' ? parsed.fftSize : DEFAULT_DECK_CONFIG.fftSize,
      vectorMode: parsed.vectorMode === 'lissajous' || parsed.vectorMode === 'polar' ? parsed.vectorMode : DEFAULT_DECK_CONFIG.vectorMode,
      vuMode: parsed.vuMode === 'bars' || parsed.vuMode === 'needle' ? parsed.vuMode : DEFAULT_DECK_CONFIG.vuMode,
      waveformSpeed: parsed.waveformSpeed === 0.5 || parsed.waveformSpeed === 1 || parsed.waveformSpeed === 1.5 ? parsed.waveformSpeed : DEFAULT_DECK_CONFIG.waveformSpeed,
      oscilloscopeSpeed: parsed.oscilloscopeSpeed === 0.5 || parsed.oscilloscopeSpeed === 1 || parsed.oscilloscopeSpeed === 1.5 ? parsed.oscilloscopeSpeed : DEFAULT_DECK_CONFIG.oscilloscopeSpeed,
    };
  } catch {
    return { ...DEFAULT_DECK_CONFIG };
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, _v: CONFIG_VERSION }));
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
  toggleScope: (id: string) => void;
  setFFTSize: (size: number) => void;
  setVectorMode: (mode: VectorMode) => void;
  setVuMode: (mode: VuMode) => void;
  setWaveformSpeed: (speed: WaveformSpeed) => void;
  setOscilloscopeSpeed: (speed: OscilloscopeSpeed) => void;
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

  const toggleScope = useCallback((id: string) => {
    const isActive = state.activeScopes.includes(id);
    if (isActive && state.activeScopes.length <= 1) return;
    const newActive = isActive
      ? state.activeScopes.filter((s) => s !== id)
      : [...state.activeScopes, id].sort(
          (a, b) => SCOPE_REGISTRY.findIndex((r) => r.id === a) - SCOPE_REGISTRY.findIndex((r) => r.id === b),
        );
    const newProportions = newActive.map(
      (s) => SCOPE_REGISTRY.find((r) => r.id === s)?.defaultProportion ?? 1,
    );
    update({ activeScopes: newActive, proportions: newProportions });
  }, []);

  const setFFTSize = useCallback((size: number) => {
    update({ fftSize: size });
  }, []);

  const setVectorMode = useCallback((mode: VectorMode) => {
    update({ vectorMode: mode });
  }, []);

  const setVuMode = useCallback((mode: VuMode) => {
    update({ vuMode: mode });
  }, []);

  const setWaveformSpeed = useCallback((speed: WaveformSpeed) => {
    update({ waveformSpeed: speed });
  }, []);

  const setOscilloscopeSpeed = useCallback((speed: OscilloscopeSpeed) => {
    update({ oscilloscopeSpeed: speed });
  }, []);

  return { ...config, toggleVisible, setActiveScopes, setProportions, toggleScope, setFFTSize, setVectorMode, setVuMode, setWaveformSpeed, setOscilloscopeSpeed };
}

export function getDeckVisible(): boolean {
  return state.visible;
}

export function getDeckVectorMode(): VectorMode {
  return state.vectorMode;
}

export function getDeckVuMode(): VuMode {
  return state.vuMode;
}

export function getDeckWaveformSpeed(): WaveformSpeed {
  return state.waveformSpeed;
}

export function getDeckOscilloscopeSpeed(): OscilloscopeSpeed {
  return state.oscilloscopeSpeed;
}
