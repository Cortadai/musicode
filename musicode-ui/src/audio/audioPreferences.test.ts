import { loadPreferences, savePreferences } from './audioPreferences';

describe('audioPreferences', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('loadPreferences', () => {
    it('returns defaults when nothing stored', () => {
      const prefs = loadPreferences();
      expect(prefs.volume).toBe(0.8);
      expect(prefs.shuffle).toBe(false);
      expect(prefs.repeatMode).toBe('off');
      expect(prefs.crossfadeDuration).toBe(0);
      expect(prefs.eqEnabled).toBe(false);
      expect(prefs.eqBands).toEqual([0, 0, 0, 0, 0]);
      expect(prefs.eqPreset).toBe('flat');
      expect(prefs.visualizerMode).toBe('bars');
    });

    it('loads valid stored values', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({
        volume: 0.5,
        shuffle: true,
        repeatMode: 'all',
        crossfadeDuration: 6,
        eqEnabled: true,
        eqBands: [3, -2, 0, 4, 1],
        eqPreset: 'rock',
        visualizerMode: 'waveform',
        dynamicTheme: true,
      }));
      const prefs = loadPreferences();
      expect(prefs.volume).toBe(0.5);
      expect(prefs.shuffle).toBe(true);
      expect(prefs.repeatMode).toBe('all');
      expect(prefs.crossfadeDuration).toBe(6);
      expect(prefs.eqEnabled).toBe(true);
      expect(prefs.eqBands).toEqual([3, -2, 0, 4, 1]);
      expect(prefs.eqPreset).toBe('rock');
      expect(prefs.visualizerMode).toBe('waveform');
      expect(prefs.dynamicTheme).toBe(true);
    });

    it('falls back to defaults for invalid volume', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ volume: 2.5 }));
      expect(loadPreferences().volume).toBe(0.8);
    });

    it('falls back to defaults for invalid repeatMode', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ repeatMode: 'invalid' }));
      expect(loadPreferences().repeatMode).toBe('off');
    });

    it('falls back to defaults for out-of-range crossfadeDuration', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ crossfadeDuration: 20 }));
      expect(loadPreferences().crossfadeDuration).toBe(0);
    });

    it('falls back to defaults for invalid eqBands', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ eqBands: [1, 2] }));
      expect(loadPreferences().eqBands).toEqual([0, 0, 0, 0, 0]);
    });

    it('falls back for eqBands with out-of-range values', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ eqBands: [0, 0, 0, 0, 99] }));
      expect(loadPreferences().eqBands).toEqual([0, 0, 0, 0, 0]);
    });

    it('falls back to defaults for invalid visualizerMode', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ visualizerMode: 'invalid' }));
      expect(loadPreferences().visualizerMode).toBe('bars');
    });

    it('returns default false for dynamicTheme when not stored', () => {
      expect(loadPreferences().dynamicTheme).toBe(false);
    });

    it('loads stored dynamicTheme true', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ dynamicTheme: true }));
      expect(loadPreferences().dynamicTheme).toBe(true);
    });

    it('falls back for non-boolean dynamicTheme', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ dynamicTheme: 'yes' }));
      expect(loadPreferences().dynamicTheme).toBe(false);
    });

    it('resets on corrupted JSON', () => {
      localStorage.setItem('musicode-prefs', '{broken json!!');
      const prefs = loadPreferences();
      expect(prefs.volume).toBe(0.8);
      expect(localStorage.getItem('musicode-prefs')).toBeNull();
    });

    it('falls back for non-boolean shuffle', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ shuffle: 'yes' }));
      expect(loadPreferences().shuffle).toBe(false);
    });

    it('falls back for non-boolean eqEnabled', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ eqEnabled: 1 }));
      expect(loadPreferences().eqEnabled).toBe(false);
    });

    it('falls back for negative volume', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ volume: -0.5 }));
      expect(loadPreferences().volume).toBe(0.8);
    });

    it('falls back for non-string eqPreset', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ eqPreset: 123 }));
      expect(loadPreferences().eqPreset).toBe('flat');
    });

    it('falls back for non-number crossfadeDuration', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ crossfadeDuration: 'fast' }));
      expect(loadPreferences().crossfadeDuration).toBe(0);
    });

    it('falls back for negative crossfadeDuration', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ crossfadeDuration: -1 }));
      expect(loadPreferences().crossfadeDuration).toBe(0);
    });

    it('falls back for non-array eqBands', () => {
      localStorage.setItem('musicode-prefs', JSON.stringify({ eqBands: 'flat' }));
      expect(loadPreferences().eqBands).toEqual([0, 0, 0, 0, 0]);
    });
  });

  describe('savePreferences', () => {
    it('saves and loads partial preferences', () => {
      savePreferences({ volume: 0.3 });
      const prefs = loadPreferences();
      expect(prefs.volume).toBe(0.3);
      expect(prefs.shuffle).toBe(false);
    });

    it('merges with existing preferences', () => {
      savePreferences({ volume: 0.3 });
      savePreferences({ shuffle: true });
      const prefs = loadPreferences();
      expect(prefs.volume).toBe(0.3);
      expect(prefs.shuffle).toBe(true);
    });
  });
});
