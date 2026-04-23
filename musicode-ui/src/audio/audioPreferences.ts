/**
 * Audio preferences persistence — localStorage read/write for player settings.
 *
 * Persisted keys: volume, shuffle, repeatMode.
 * Stored as a single JSON object under STORAGE_KEY.
 *
 * Invalid/missing values fall back to defaults silently — no errors surfaced to user.
 */

import type { RepeatMode } from '../context/PlayerContext';

const STORAGE_KEY = 'musicode-prefs';

export type VisualizerMode = 'bars' | 'waveform' | 'circular';

export interface AudioPreferences {
  volume: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  crossfadeDuration: number; // seconds, 0 = gapless (no overlap)
  eqEnabled: boolean;
  eqBands: number[]; // 5 gain values in dB (-12 to +12)
  eqPreset: string;  // preset name or 'custom'
  visualizerMode: VisualizerMode;
  dynamicTheme: boolean;
}

const DEFAULTS: AudioPreferences = {
  volume: 0.8,
  shuffle: false,
  repeatMode: 'off',
  crossfadeDuration: 0,
  eqEnabled: false,
  eqBands: [0, 0, 0, 0, 0],
  eqPreset: 'flat',
  visualizerMode: 'bars',
  dynamicTheme: false,
};

/**
 * Load preferences from localStorage.
 * Returns defaults for any missing/invalid fields.
 */
export function loadPreferences(): AudioPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };

    const parsed = JSON.parse(raw);

    const volume =
      typeof parsed.volume === 'number' && parsed.volume >= 0 && parsed.volume <= 1
        ? parsed.volume
        : DEFAULTS.volume;

    const shuffle = typeof parsed.shuffle === 'boolean' ? parsed.shuffle : DEFAULTS.shuffle;

    const repeatMode = ['off', 'all', 'one'].includes(parsed.repeatMode)
      ? (parsed.repeatMode as RepeatMode)
      : DEFAULTS.repeatMode;

    const crossfadeDuration =
      typeof parsed.crossfadeDuration === 'number' &&
      parsed.crossfadeDuration >= 0 &&
      parsed.crossfadeDuration <= 12
        ? parsed.crossfadeDuration
        : DEFAULTS.crossfadeDuration;

    const eqEnabled = typeof parsed.eqEnabled === 'boolean' ? parsed.eqEnabled : DEFAULTS.eqEnabled;

    const eqBands =
      Array.isArray(parsed.eqBands) &&
      parsed.eqBands.length === 5 &&
      parsed.eqBands.every((v: unknown) => typeof v === 'number' && v >= -12 && v <= 12)
        ? (parsed.eqBands as number[])
        : [...DEFAULTS.eqBands];

    const eqPreset =
      typeof parsed.eqPreset === 'string' ? parsed.eqPreset : DEFAULTS.eqPreset;

    const visualizerMode: VisualizerMode =
      ['bars', 'waveform', 'circular'].includes(parsed.visualizerMode)
        ? (parsed.visualizerMode as VisualizerMode)
        : DEFAULTS.visualizerMode;

    const dynamicTheme = typeof parsed.dynamicTheme === 'boolean' ? parsed.dynamicTheme : DEFAULTS.dynamicTheme;

    return { volume, shuffle, repeatMode, crossfadeDuration, eqEnabled, eqBands, eqPreset, visualizerMode, dynamicTheme };
  } catch {
    // Corrupted JSON — reset to defaults
    localStorage.removeItem(STORAGE_KEY);
    return { ...DEFAULTS };
  }
}

/**
 * Save preferences to localStorage.
 * Merges with existing values — only provided fields are updated.
 */
export function savePreferences(partial: Partial<AudioPreferences>): void {
  try {
    const current = loadPreferences();
    const merged = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}
