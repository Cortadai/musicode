/**
 * Audio preferences persistence — localStorage read/write for player settings.
 *
 * Stored as a single JSON object under STORAGE_KEY.
 * Invalid/missing values fall back to defaults silently — no errors surfaced to user.
 *
 * EQ migration: old format stored eqBands as number[5] (gain-only).
 * New format stores eqBands as full EqBand[] with id, type, frequency, gain, Q.
 * Migration is automatic on load.
 */

import type { RepeatMode } from '../context/PlayerContext';
import type { EqBand, EqFilterType } from './eqProcessor';
import { DEFAULT_BANDS, GAIN_MIN, GAIN_MAX, PREAMP_MIN, PREAMP_MAX, Q_MIN, Q_MAX, FREQ_MIN, FREQ_MAX, MIN_BANDS, MAX_BANDS, isPassFilter } from './eqProcessor';

const STORAGE_KEY = 'musicode-prefs';

export type VisualizerMode = 'bars' | 'waveform' | 'circular' | 'vinyl';
export type LoginTransition = 'random' | 'ripple' | 'curtain' | 'fade' | 'sweep' | 'pixels' | 'diagonal' | 'wave' | 'none';

export interface AudioPreferences {
  volume: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  crossfadeDuration: number;
  eqEnabled: boolean;
  eqBands: EqBand[];
  eqPreamp: number;
  eqPreset: string;
  visualizerMode: VisualizerMode;
  dynamicTheme: boolean;
  waveformEnabled: boolean;
  marqueePlaybar: boolean;
  marqueeAlbumCards: boolean;
  greetingMessages: boolean;
  particlesEnabled: boolean;
  loginTransition: LoginTransition;
}

const DEFAULTS: AudioPreferences = {
  volume: 0.8,
  shuffle: false,
  repeatMode: 'off',
  crossfadeDuration: 0,
  eqEnabled: false,
  eqBands: DEFAULT_BANDS.map((b) => ({ ...b })),
  eqPreamp: 0,
  eqPreset: 'flat',
  visualizerMode: 'vinyl',
  dynamicTheme: false,
  waveformEnabled: false,
  marqueePlaybar: true,
  marqueeAlbumCards: true,
  greetingMessages: true,
  particlesEnabled: false,
  loginTransition: 'random',
};

const VALID_FILTER_TYPES: EqFilterType[] = ['lowshelf', 'peaking', 'highshelf', 'highpass', 'lowpass'];

function isValidBand(b: unknown): b is EqBand {
  if (typeof b !== 'object' || b === null) return false;
  const obj = b as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.type === 'string' && VALID_FILTER_TYPES.includes(obj.type as EqFilterType) &&
    typeof obj.frequency === 'number' && obj.frequency >= FREQ_MIN && obj.frequency <= FREQ_MAX &&
    typeof obj.gain === 'number' && obj.gain >= GAIN_MIN && obj.gain <= GAIN_MAX &&
    typeof obj.Q === 'number' && obj.Q >= Q_MIN && obj.Q <= Q_MAX
  );
}

function sanitizeBand(b: EqBand): EqBand {
  const band = { ...b };
  band.frequency = Math.max(FREQ_MIN, Math.min(FREQ_MAX, band.frequency));
  band.gain = Math.max(GAIN_MIN, Math.min(GAIN_MAX, band.gain));
  band.Q = Math.max(Q_MIN, Math.min(Q_MAX, band.Q));
  if (isPassFilter(band.type)) band.gain = 0;
  return band;
}

/**
 * Migrate old eqBands format (number[5]) to new EqBand[] format.
 */
function migrateOldBands(oldGains: number[]): EqBand[] {
  return DEFAULT_BANDS.map((def, i) => ({
    ...def,
    gain: typeof oldGains[i] === 'number'
      ? Math.max(GAIN_MIN, Math.min(GAIN_MAX, oldGains[i]))
      : 0,
  }));
}

function parseEqBands(parsed: Record<string, unknown>): EqBand[] {
  const raw = parsed.eqBands;

  if (!Array.isArray(raw)) return DEFAULTS.eqBands.map((b) => ({ ...b }));

  // Old format: array of numbers (gain-only, 5 values)
  if (raw.length > 0 && typeof raw[0] === 'number') {
    return migrateOldBands(raw as number[]);
  }

  // New format: array of EqBand objects
  const bands = raw.filter(isValidBand).map(sanitizeBand);
  if (bands.length < MIN_BANDS || bands.length > MAX_BANDS) {
    return DEFAULTS.eqBands.map((b) => ({ ...b }));
  }
  return bands;
}

export function loadPreferences(): AudioPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS, eqBands: DEFAULTS.eqBands.map((b) => ({ ...b })) };

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
    const eqBands = parseEqBands(parsed);

    const eqPreamp =
      typeof parsed.eqPreamp === 'number' &&
      parsed.eqPreamp >= PREAMP_MIN &&
      parsed.eqPreamp <= PREAMP_MAX
        ? parsed.eqPreamp
        : DEFAULTS.eqPreamp;

    const eqPreset =
      typeof parsed.eqPreset === 'string' ? parsed.eqPreset : DEFAULTS.eqPreset;

    const visualizerMode: VisualizerMode =
      ['bars', 'waveform', 'circular', 'vinyl'].includes(parsed.visualizerMode)
        ? (parsed.visualizerMode as VisualizerMode)
        : DEFAULTS.visualizerMode;

    const dynamicTheme = typeof parsed.dynamicTheme === 'boolean' ? parsed.dynamicTheme : DEFAULTS.dynamicTheme;
    const waveformEnabled = typeof parsed.waveformEnabled === 'boolean' ? parsed.waveformEnabled : DEFAULTS.waveformEnabled;
    const marqueePlaybar = typeof parsed.marqueePlaybar === 'boolean' ? parsed.marqueePlaybar : DEFAULTS.marqueePlaybar;
    const marqueeAlbumCards = typeof parsed.marqueeAlbumCards === 'boolean' ? parsed.marqueeAlbumCards : DEFAULTS.marqueeAlbumCards;
    const greetingMessages = typeof parsed.greetingMessages === 'boolean' ? parsed.greetingMessages : DEFAULTS.greetingMessages;
    const particlesEnabled = typeof parsed.particlesEnabled === 'boolean' ? parsed.particlesEnabled : DEFAULTS.particlesEnabled;

    const VALID_TRANSITIONS: LoginTransition[] = ['random', 'ripple', 'curtain', 'fade', 'sweep', 'pixels', 'diagonal', 'wave', 'none'];
    const loginTransition: LoginTransition = VALID_TRANSITIONS.includes(parsed.loginTransition)
      ? parsed.loginTransition as LoginTransition
      : DEFAULTS.loginTransition;

    return { volume, shuffle, repeatMode, crossfadeDuration, eqEnabled, eqBands, eqPreamp, eqPreset, visualizerMode, dynamicTheme, waveformEnabled, marqueePlaybar, marqueeAlbumCards, greetingMessages, particlesEnabled, loginTransition };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return { ...DEFAULTS, eqBands: DEFAULTS.eqBands.map((b) => ({ ...b })) };
  }
}

export function savePreferences(partial: Partial<AudioPreferences>): void {
  try {
    const current = loadPreferences();
    const merged = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage full or unavailable
  }
}
