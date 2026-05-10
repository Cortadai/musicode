/**
 * Parametric EQ processor — variable-band (5–10) with multiple filter types,
 * per-band Q, and preamp gain.
 *
 * Graph insertion point (managed by audioGraph.ts):
 *   masterGain → preamp → filter[0] → … → filter[N-1] → [postEqNode]
 *
 * Filter types: peaking, lowshelf, highshelf, highpass, lowpass
 * Highpass/lowpass filters force gain to 0 dB (they only cut).
 *
 * Structural changes (add/remove band) trigger a full chain rebuild.
 * Parameter changes (gain, freq, Q, type) on existing bands are efficient
 * single-node updates — no disconnection needed.
 */

// --- Types ---

export type EqFilterType = 'lowshelf' | 'peaking' | 'highshelf' | 'highpass' | 'lowpass';

export interface EqBand {
  id: string;
  type: EqFilterType;
  frequency: number; // Hz, 20–20000
  gain: number;      // dB, -12 to +12
  Q: number;         // 0.1–18
}

export interface EqPreset {
  name: string;
  label: string;
  bands: EqBand[];
  preamp: number; // dB, -12 to +12
  isDefault?: boolean;
}

// --- Constants ---

export const GAIN_MIN = -12;
export const GAIN_MAX = 12;
export const PREAMP_MIN = -12;
export const PREAMP_MAX = 12;
export const Q_MIN = 0.1;
export const Q_MAX = 18;
export const FREQ_MIN = 20;
export const FREQ_MAX = 20000;
export const MIN_BANDS = 1;
export const MAX_BANDS = 10;

const PASS_FILTER_TYPES: EqFilterType[] = ['highpass', 'lowpass'];

export function isPassFilter(type: EqFilterType): boolean {
  return PASS_FILTER_TYPES.includes(type);
}

export function normalizeBand(band: EqBand): EqBand {
  if (isPassFilter(band.type) && band.gain !== 0) {
    return { ...band, gain: 0 };
  }
  return band;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

let nextBandId = 1;
export function generateBandId(): string {
  return `band-${nextBandId++}`;
}

// --- Default bands (5-band classic layout) ---

export const DEFAULT_BANDS: EqBand[] = [
  { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 0, Q: 0.707 },
  { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 0, Q: 1.0 },
  { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 0, Q: 1.0 },
  { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 0, Q: 1.0 },
  { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 0, Q: 0.707 },
];

// --- Built-in presets ---

export const EQ_PRESETS: EqPreset[] = [
  {
    name: 'flat', label: 'Flat', preamp: 0, isDefault: true,
    bands: [
      { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 0, Q: 0.707 },
      { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 0, Q: 1.0 },
      { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 0, Q: 1.0 },
      { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 0, Q: 1.0 },
      { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 0, Q: 0.707 },
    ],
  },
  {
    name: 'bass-boost', label: 'Bass Boost', preamp: -2, isDefault: true,
    bands: [
      { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 6,  Q: 0.707 },
      { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 4,  Q: 1.0 },
      { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 0,  Q: 1.0 },
      { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 0,  Q: 1.0 },
      { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 0,  Q: 0.707 },
    ],
  },
  {
    name: 'treble-boost', label: 'Treble Boost', preamp: -2, isDefault: true,
    bands: [
      { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 0,  Q: 0.707 },
      { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 0,  Q: 1.0 },
      { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 0,  Q: 1.0 },
      { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 4,  Q: 1.0 },
      { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 6,  Q: 0.707 },
    ],
  },
  {
    name: 'vocal', label: 'Vocal', preamp: 0, isDefault: true,
    bands: [
      { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: -2, Q: 0.707 },
      { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 0,  Q: 1.0 },
      { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: 4,  Q: 1.0 },
      { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 3,  Q: 1.0 },
      { id: 'band-5', type: 'highshelf', frequency: 12000, gain: -1, Q: 0.707 },
    ],
  },
  {
    name: 'rock', label: 'Rock', preamp: -1, isDefault: true,
    bands: [
      { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 4,  Q: 0.707 },
      { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 2,  Q: 1.0 },
      { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: -1, Q: 1.0 },
      { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 3,  Q: 1.0 },
      { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 5,  Q: 0.707 },
    ],
  },
  {
    name: 'loudness', label: 'Loudness', preamp: -4, isDefault: true,
    bands: [
      { id: 'band-1', type: 'lowshelf',  frequency: 60,    gain: 6,  Q: 0.707 },
      { id: 'band-2', type: 'peaking',   frequency: 250,   gain: 2,  Q: 1.0 },
      { id: 'band-3', type: 'peaking',   frequency: 1000,  gain: -1, Q: 1.0 },
      { id: 'band-4', type: 'peaking',   frequency: 4000,  gain: 2,  Q: 1.0 },
      { id: 'band-5', type: 'highshelf', frequency: 12000, gain: 6,  Q: 0.707 },
    ],
  },
];

// --- Frequency label helper ---

export function freqLabel(hz: number): string {
  if (hz >= 1000) {
    const k = hz / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  return String(Math.round(hz));
}

// --- Module state ---

let audioCtx: AudioContext | null = null;
let preampNode: GainNode | null = null;
let filters: BiquadFilterNode[] = [];
let currentBands: EqBand[] = DEFAULT_BANDS.map((b) => ({ ...b }));
let currentPreamp = 0; // dB
let enabled = false;
let currentPreset = 'flat';
let eqInitialized = false;

// Post-EQ passthrough node — stable output reference that survives chain rebuilds
let postEqNode: GainNode | null = null;

// --- Internal helpers ---

function mapFilterType(type: EqFilterType): BiquadFilterType {
  switch (type) {
    case 'lowshelf':  return 'lowshelf';
    case 'highshelf': return 'highshelf';
    case 'peaking':   return 'peaking';
    case 'highpass':  return 'highpass';
    case 'lowpass':   return 'lowpass';
  }
}

function dBToLinear(dB: number): number {
  return Math.pow(10, dB / 20);
}

function applyBandToFilter(filter: BiquadFilterNode, band: EqBand, ctx: AudioContext): void {
  const normalized = normalizeBand(band);
  filter.type = mapFilterType(normalized.type);
  filter.frequency.setValueAtTime(normalized.frequency, ctx.currentTime);
  filter.Q.setValueAtTime(normalized.Q, ctx.currentTime);
  filter.gain.setValueAtTime(enabled ? normalized.gain : 0, ctx.currentTime);
}

function rebuildChain(): void {
  if (!audioCtx || !preampNode || !postEqNode) return;

  // Disconnect old chain
  try { preampNode.disconnect(); } catch { /* ok */ }
  for (const f of filters) {
    try { f.disconnect(); } catch { /* ok */ }
  }
  filters = [];

  if (enabled && currentBands.length > 0) {
    filters = currentBands.map((band) => {
      const f = audioCtx!.createBiquadFilter();
      applyBandToFilter(f, band, audioCtx!);
      return f;
    });

    preampNode.connect(filters[0]);
    for (let i = 0; i < filters.length - 1; i++) {
      filters[i].connect(filters[i + 1]);
    }
    filters[filters.length - 1].connect(postEqNode);
  } else {
    // Bypass: preamp straight to output
    preampNode.connect(postEqNode);
  }
}

function updatePreampGain(): void {
  if (!preampNode || !audioCtx) return;
  const linearPreamp = enabled ? dBToLinear(currentPreamp) : 1.0;
  preampNode.gain.setValueAtTime(linearPreamp, audioCtx.currentTime);
}

function matchPreset(): string {
  for (const preset of EQ_PRESETS) {
    if (preset.preamp !== currentPreamp) continue;
    if (preset.bands.length !== currentBands.length) continue;
    const match = preset.bands.every((pb, i) => {
      const cb = currentBands[i];
      return pb.type === cb.type &&
             pb.frequency === cb.frequency &&
             pb.gain === cb.gain &&
             pb.Q === cb.Q;
    });
    if (match) return preset.name;
  }
  return 'custom';
}

// --- Public API ---

function init(ctx: AudioContext): { input: AudioNode; output: AudioNode } {
  if (eqInitialized && preampNode && postEqNode) {
    return { input: preampNode, output: postEqNode };
  }

  audioCtx = ctx;

  // Preamp: GainNode before filter chain
  preampNode = ctx.createGain();
  preampNode.gain.value = enabled ? dBToLinear(currentPreamp) : 1.0;

  // Stable output node — audioGraph connects to this once, chain rebuilds don't affect it
  postEqNode = ctx.createGain();
  postEqNode.gain.value = 1.0;

  // Build the initial filter chain
  rebuildChain();

  eqInitialized = true;

  console.debug('[eqProcessor] Parametric EQ initialized:', currentBands.length, 'bands,',
    enabled ? `enabled (preamp: ${currentPreamp}dB)` : 'disabled');

  return { input: preampNode, output: postEqNode };
}

/**
 * Update a single band's parameters in-place (no chain rebuild).
 */
function updateBand(bandIndex: number, updates: Partial<Omit<EqBand, 'id'>>): void {
  if (bandIndex < 0 || bandIndex >= currentBands.length) return;

  const band = currentBands[bandIndex];
  if (updates.type !== undefined) band.type = updates.type;
  if (updates.frequency !== undefined) band.frequency = clamp(updates.frequency, FREQ_MIN, FREQ_MAX);
  if (updates.gain !== undefined) band.gain = clamp(updates.gain, GAIN_MIN, GAIN_MAX);
  if (updates.Q !== undefined) band.Q = clamp(updates.Q, Q_MIN, Q_MAX);

  // Normalize pass filters
  const normalized = normalizeBand(band);
  currentBands[bandIndex] = normalized;

  // Apply to live filter node
  if (filters[bandIndex] && audioCtx) {
    applyBandToFilter(filters[bandIndex], normalized, audioCtx);
  }

  currentPreset = matchPreset();
}

/**
 * Replace all bands at once (triggers chain rebuild).
 */
function setBands(bands: EqBand[]): void {
  currentBands = bands.map((b) => normalizeBand({ ...b }));
  rebuildChain();
  currentPreset = matchPreset();
}

/**
 * Add a band. Returns the new band, or null if at max.
 * Places the new band at the optimal frequency gap on log scale.
 */
function addBand(): EqBand | null {
  if (currentBands.length >= MAX_BANDS) return null;

  // Find largest frequency gap on log scale
  const sorted = [...currentBands].sort((a, b) => a.frequency - b.frequency);
  let bestFreq = 1000;
  let bestGap = 0;

  // Check gap before first band (from FREQ_MIN)
  const logMin = Math.log10(FREQ_MIN);
  const logMax = Math.log10(FREQ_MAX);

  if (sorted.length === 0) {
    bestFreq = 1000;
  } else {
    // Gap from min to first
    let gap = Math.log10(sorted[0].frequency) - logMin;
    if (gap > bestGap) {
      bestGap = gap;
      bestFreq = Math.pow(10, logMin + gap / 2);
    }
    // Gaps between adjacent
    for (let i = 0; i < sorted.length - 1; i++) {
      gap = Math.log10(sorted[i + 1].frequency) - Math.log10(sorted[i].frequency);
      if (gap > bestGap) {
        bestGap = gap;
        bestFreq = Math.pow(10, (Math.log10(sorted[i].frequency) + Math.log10(sorted[i + 1].frequency)) / 2);
      }
    }
    // Gap from last to max
    gap = logMax - Math.log10(sorted[sorted.length - 1].frequency);
    if (gap > bestGap) {
      bestGap = gap;
      bestFreq = Math.pow(10, Math.log10(sorted[sorted.length - 1].frequency) + gap / 2);
    }
  }

  bestFreq = Math.round(clamp(bestFreq, FREQ_MIN, FREQ_MAX));

  const newBand: EqBand = {
    id: generateBandId(),
    type: 'peaking',
    frequency: bestFreq,
    gain: 0,
    Q: 1.0,
  };

  currentBands.push(newBand);
  // Sort by frequency for consistent ordering
  currentBands.sort((a, b) => a.frequency - b.frequency);
  rebuildChain();
  currentPreset = 'custom';
  return newBand;
}

/**
 * Remove a band by index. Returns false if at min or index invalid.
 */
function removeBand(bandIndex: number): boolean {
  if (currentBands.length <= MIN_BANDS) return false;
  if (bandIndex < 0 || bandIndex >= currentBands.length) return false;

  currentBands.splice(bandIndex, 1);
  rebuildChain();
  currentPreset = matchPreset();
  return true;
}

function setPreamp(dB: number): void {
  currentPreamp = clamp(dB, PREAMP_MIN, PREAMP_MAX);
  updatePreampGain();
  currentPreset = matchPreset();
}

function setEnabled(on: boolean): void {
  enabled = on;
  if (!eqInitialized) return;
  updatePreampGain();
  rebuildChain();
  console.debug('[eqProcessor] EQ', on ? 'enabled' : 'disabled');
}

function applyPreset(presetName: string): void {
  const preset = EQ_PRESETS.find((p) => p.name === presetName);
  if (!preset) return;

  currentPreset = presetName;
  currentPreamp = preset.preamp;
  currentBands = preset.bands.map((b) => ({ ...b }));
  updatePreampGain();
  rebuildChain();
}

// --- Legacy compat: apply gains array to current bands (for old presets / preferences migration) ---

function setAllGains(gains: number[]): void {
  for (let i = 0; i < currentBands.length && i < gains.length; i++) {
    currentBands[i].gain = clamp(gains[i] ?? 0, GAIN_MIN, GAIN_MAX);
    currentBands[i] = normalizeBand(currentBands[i]);
    if (filters[i] && audioCtx) {
      applyBandToFilter(filters[i], currentBands[i], audioCtx);
    }
  }
  currentPreset = matchPreset();
}

// --- Getters ---

function getBands(): EqBand[] {
  return currentBands.map((b) => ({ ...b }));
}

function getPreamp(): number {
  return currentPreamp;
}

function getPreset(): string {
  return currentPreset;
}

function isEnabled(): boolean {
  return enabled;
}

function isInitialized(): boolean {
  return eqInitialized;
}

function getBandCount(): number {
  return currentBands.length;
}

// --- Export ---

const eqProcessor = {
  init,
  updateBand,
  setBands,
  addBand,
  removeBand,
  setAllGains,
  setPreamp,
  setEnabled,
  applyPreset,
  getBands,
  getPreamp,
  getPreset,
  isEnabled,
  isInitialized,
  getBandCount,
} as const;

export default eqProcessor;
