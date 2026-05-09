import type { EqBand } from './eqProcessor';
import { EQ_PRESETS, GAIN_MIN, GAIN_MAX, Q_MIN, Q_MAX, FREQ_MIN, FREQ_MAX, PREAMP_MIN, PREAMP_MAX, MIN_BANDS, MAX_BANDS } from './eqProcessor';
import type { EqFilterType } from './eqProcessor';

const STORAGE_KEY = 'musicode-eq-presets';
const VALID_FILTER_TYPES: EqFilterType[] = ['lowshelf', 'peaking', 'highshelf', 'highpass', 'lowpass'];
const RESERVED_NAMES = new Set(EQ_PRESETS.map((p) => p.name));

export interface CustomPreset {
  name: string;
  bands: EqBand[];
  preamp: number;
}

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

function isValidPreset(p: unknown): p is CustomPreset {
  if (typeof p !== 'object' || p === null) return false;
  const obj = p as Record<string, unknown>;
  if (typeof obj.name !== 'string' || obj.name.trim().length === 0) return false;
  if (typeof obj.preamp !== 'number' || obj.preamp < PREAMP_MIN || obj.preamp > PREAMP_MAX) return false;
  if (!Array.isArray(obj.bands)) return false;
  if (obj.bands.length < MIN_BANDS || obj.bands.length > MAX_BANDS) return false;
  return obj.bands.every(isValidBand);
}

export function getCustomPresets(): CustomPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidPreset);
  } catch {
    return [];
  }
}

function persistPresets(presets: CustomPreset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // localStorage full or unavailable
  }
}

export function isReservedName(name: string): boolean {
  return RESERVED_NAMES.has(name.toLowerCase().replace(/\s+/g, '-'));
}

export function saveCustomPreset(name: string, bands: EqBand[], preamp: number): boolean {
  const trimmed = name.trim();
  if (!trimmed || isReservedName(trimmed)) return false;

  const preset: CustomPreset = { name: trimmed, bands: bands.map((b) => ({ ...b })), preamp };
  const presets = getCustomPresets();
  const existingIndex = presets.findIndex((p) => p.name === trimmed);
  if (existingIndex >= 0) {
    presets[existingIndex] = preset;
  } else {
    presets.push(preset);
  }
  persistPresets(presets);
  return true;
}

export function deleteCustomPreset(name: string): boolean {
  const presets = getCustomPresets();
  const filtered = presets.filter((p) => p.name !== name);
  if (filtered.length === presets.length) return false;
  persistPresets(filtered);
  return true;
}

export function exportPreset(preset: CustomPreset): string {
  return JSON.stringify({ name: preset.name, bands: preset.bands, preamp: preset.preamp }, null, 2);
}

export function importPreset(json: string): CustomPreset | null {
  try {
    const parsed = JSON.parse(json);
    if (!isValidPreset(parsed)) return null;
    return { name: parsed.name.trim(), bands: parsed.bands, preamp: parsed.preamp };
  } catch {
    return null;
  }
}
