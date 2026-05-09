import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCustomPresets,
  saveCustomPreset,
  deleteCustomPreset,
  exportPreset,
  importPreset,
  isReservedName,
} from './eqPresetStorage';
import type { CustomPreset } from './eqPresetStorage';
import type { EqBand } from './eqProcessor';

const STORAGE_KEY = 'musicode-eq-presets';

const validBands: EqBand[] = [
  { id: 'b1', type: 'lowshelf', frequency: 60, gain: 0, Q: 0.707 },
  { id: 'b2', type: 'peaking', frequency: 250, gain: 3, Q: 1.0 },
  { id: 'b3', type: 'peaking', frequency: 1000, gain: -2, Q: 1.0 },
  { id: 'b4', type: 'peaking', frequency: 4000, gain: 4, Q: 1.0 },
  { id: 'b5', type: 'highshelf', frequency: 12000, gain: 1, Q: 0.707 },
];

beforeEach(() => {
  localStorage.clear();
});

describe('isReservedName', () => {
  it('rejects built-in preset names', () => {
    expect(isReservedName('flat')).toBe(true);
    expect(isReservedName('bass-boost')).toBe(true);
    expect(isReservedName('rock')).toBe(true);
  });

  it('accepts custom names', () => {
    expect(isReservedName('My Preset')).toBe(false);
    expect(isReservedName('evening')).toBe(false);
  });
});

describe('getCustomPresets', () => {
  it('returns empty array when nothing stored', () => {
    expect(getCustomPresets()).toEqual([]);
  });

  it('returns empty array for invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');
    expect(getCustomPresets()).toEqual([]);
  });

  it('filters out invalid presets', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { name: 'good', bands: validBands, preamp: 0 },
      { name: '', bands: validBands, preamp: 0 },
      { name: 'bad-preamp', bands: validBands, preamp: 999 },
    ]));
    const result = getCustomPresets();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('good');
  });
});

describe('saveCustomPreset', () => {
  it('saves a new preset', () => {
    expect(saveCustomPreset('My Preset', validBands, -2)).toBe(true);
    const presets = getCustomPresets();
    expect(presets).toHaveLength(1);
    expect(presets[0].name).toBe('My Preset');
    expect(presets[0].preamp).toBe(-2);
    expect(presets[0].bands).toHaveLength(5);
  });

  it('overwrites existing preset with same name', () => {
    saveCustomPreset('Test', validBands, 0);
    saveCustomPreset('Test', validBands, 3);
    const presets = getCustomPresets();
    expect(presets).toHaveLength(1);
    expect(presets[0].preamp).toBe(3);
  });

  it('rejects reserved names', () => {
    expect(saveCustomPreset('flat', validBands, 0)).toBe(false);
    expect(saveCustomPreset('bass-boost', validBands, 0)).toBe(false);
    expect(getCustomPresets()).toHaveLength(0);
  });

  it('rejects empty name', () => {
    expect(saveCustomPreset('', validBands, 0)).toBe(false);
    expect(saveCustomPreset('   ', validBands, 0)).toBe(false);
  });
});

describe('deleteCustomPreset', () => {
  it('deletes existing preset', () => {
    saveCustomPreset('ToDelete', validBands, 0);
    expect(deleteCustomPreset('ToDelete')).toBe(true);
    expect(getCustomPresets()).toHaveLength(0);
  });

  it('returns false for non-existing preset', () => {
    expect(deleteCustomPreset('nope')).toBe(false);
  });
});

describe('exportPreset', () => {
  it('produces valid JSON', () => {
    const preset: CustomPreset = { name: 'Export Me', bands: validBands, preamp: -1 };
    const json = exportPreset(preset);
    const parsed = JSON.parse(json);
    expect(parsed.name).toBe('Export Me');
    expect(parsed.bands).toHaveLength(5);
    expect(parsed.preamp).toBe(-1);
  });
});

describe('importPreset', () => {
  it('imports valid JSON', () => {
    const json = JSON.stringify({ name: 'Imported', bands: validBands, preamp: 2 });
    const result = importPreset(json);
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Imported');
    expect(result!.preamp).toBe(2);
  });

  it('rejects invalid JSON', () => {
    expect(importPreset('not json')).toBeNull();
  });

  it('rejects preset with invalid bands', () => {
    const json = JSON.stringify({ name: 'Bad', bands: [1, 2, 3], preamp: 0 });
    expect(importPreset(json)).toBeNull();
  });

  it('rejects preset with no bands', () => {
    const json = JSON.stringify({ name: 'Empty', bands: [], preamp: 0 });
    expect(importPreset(json)).toBeNull();
  });
});
