/**
 * 5-band parametric EQ processor using Web Audio BiquadFilterNodes.
 *
 * Graph insertion point (managed by audioGraph.ts):
 *   masterGain → eq[0] → eq[1] → eq[2] → eq[3] → eq[4] → analyserNode
 *
 * Each band is a peaking filter — boosts/cuts at the center frequency
 * without affecting neighbours significantly.
 *
 * "Disabled" means all gains set to 0 dB (flat passthrough). No rewiring needed —
 * a peaking filter with 0 dB gain is acoustically transparent.
 *
 * Band frequencies (ISO-ish spacing):
 *   0: 60 Hz   (sub-bass)
 *   1: 230 Hz  (low-mid)
 *   2: 910 Hz  (mid)
 *   3: 3600 Hz (upper-mid / presence)
 *   4: 14000 Hz (air / brilliance)
 */

export interface EqBand {
  frequency: number;
  label: string;
  gain: number; // dB, -12 to +12
}

export interface EqPreset {
  name: string;
  label: string;
  gains: number[]; // 5 values, one per band
}

// --- Constants ---

const BAND_DEFS: { frequency: number; label: string }[] = [
  { frequency: 60, label: '60' },
  { frequency: 230, label: '230' },
  { frequency: 910, label: '910' },
  { frequency: 3600, label: '3.6k' },
  { frequency: 14000, label: '14k' },
];

const Q_FACTOR = 1.4; // Moderate bandwidth — wide enough to sound natural

export const EQ_PRESETS: EqPreset[] = [
  { name: 'flat', label: 'Flat', gains: [0, 0, 0, 0, 0] },
  { name: 'bass-boost', label: 'Bass Boost', gains: [6, 4, 0, 0, 0] },
  { name: 'treble-boost', label: 'Treble Boost', gains: [0, 0, 0, 4, 6] },
  { name: 'vocal', label: 'Vocal', gains: [-2, 0, 4, 3, -1] },
  { name: 'rock', label: 'Rock', gains: [4, 2, -1, 3, 5] },
];

export const GAIN_MIN = -12;
export const GAIN_MAX = 12;
export const BAND_COUNT = 5;

// --- State ---

let filters: BiquadFilterNode[] = [];
let enabled = false;
let currentGains: number[] = [0, 0, 0, 0, 0];
let currentPreset = 'flat';
let eqInitialized = false;

// --- Public API ---

/**
 * Create the 5 BiquadFilterNodes and chain them together.
 * Returns { input, output } for audioGraph to wire into its topology.
 *
 * Must be called with a live AudioContext (after audioGraph.init()).
 */
function init(ctx: AudioContext): { input: AudioNode; output: AudioNode } {
  if (eqInitialized && filters.length === BAND_COUNT) {
    return { input: filters[0], output: filters[BAND_COUNT - 1] };
  }

  filters = BAND_DEFS.map((def) => {
    const f = ctx.createBiquadFilter();
    f.type = 'peaking';
    f.frequency.value = def.frequency;
    f.Q.value = Q_FACTOR;
    f.gain.value = 0; // Start flat
    return f;
  });

  // Chain: f[0] → f[1] → f[2] → f[3] → f[4]
  for (let i = 0; i < filters.length - 1; i++) {
    filters[i].connect(filters[i + 1]);
  }

  eqInitialized = true;

  // Apply any gains that were set before init (from saved preferences)
  if (enabled) {
    for (let i = 0; i < BAND_COUNT; i++) {
      filters[i].gain.value = currentGains[i];
    }
  }

  console.debug('[eqProcessor] EQ chain initialized: 5-band peaking, Q=' + Q_FACTOR,
    enabled ? '(enabled, gains: ' + currentGains.join(',') + ')' : '(disabled)');

  return { input: filters[0], output: filters[BAND_COUNT - 1] };
}

/**
 * Set the gain for a specific band.
 * Clamped to [GAIN_MIN, GAIN_MAX].
 * If EQ is disabled, the value is stored but not applied to filters.
 */
function setGain(bandIndex: number, dB: number): void {
  if (bandIndex < 0 || bandIndex >= BAND_COUNT) return;
  const clamped = Math.max(GAIN_MIN, Math.min(GAIN_MAX, dB));
  currentGains[bandIndex] = clamped;

  if (enabled && filters[bandIndex]) {
    filters[bandIndex].gain.value = clamped;
  }

  // Clear preset if gains no longer match any preset
  currentPreset = matchPreset(currentGains);
}

/**
 * Set all 5 band gains at once.
 */
function setAllGains(gains: number[]): void {
  for (let i = 0; i < BAND_COUNT; i++) {
    const dB = gains[i] ?? 0;
    const clamped = Math.max(GAIN_MIN, Math.min(GAIN_MAX, dB));
    currentGains[i] = clamped;

    if (enabled && filters[i]) {
      filters[i].gain.value = clamped;
    }
  }
  currentPreset = matchPreset(currentGains);
}

/**
 * Enable or disable the EQ.
 * Disabled = all filter gains set to 0 (passthrough).
 * Enabled = stored gains applied to filters.
 */
function setEnabled(on: boolean): void {
  enabled = on;
  if (!eqInitialized) return;

  for (let i = 0; i < BAND_COUNT; i++) {
    if (filters[i]) {
      filters[i].gain.value = on ? currentGains[i] : 0;
    }
  }
  console.debug('[eqProcessor] EQ', on ? 'enabled' : 'disabled');
}

/**
 * Apply a named preset.
 */
function applyPreset(presetName: string): void {
  const preset = EQ_PRESETS.find((p) => p.name === presetName);
  if (!preset) return;

  currentPreset = presetName;
  setAllGains(preset.gains);
}

/**
 * Get the current state of all bands.
 */
function getBands(): EqBand[] {
  return BAND_DEFS.map((def, i) => ({
    frequency: def.frequency,
    label: def.label,
    gain: currentGains[i],
  }));
}

function isEnabled(): boolean {
  return enabled;
}

function getGains(): number[] {
  return [...currentGains];
}

function getPreset(): string {
  return currentPreset;
}

function isInitialized(): boolean {
  return eqInitialized;
}

// --- Helpers ---

function matchPreset(gains: number[]): string {
  for (const preset of EQ_PRESETS) {
    if (preset.gains.every((g, i) => g === gains[i])) {
      return preset.name;
    }
  }
  return 'custom';
}

// --- Export ---

const eqProcessor = {
  init,
  setGain,
  setAllGains,
  setEnabled,
  applyPreset,
  getBands,
  getGains,
  getPreset,
  isEnabled,
  isInitialized,
  BAND_DEFS,
} as const;

export default eqProcessor;
