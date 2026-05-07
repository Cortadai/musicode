/**
 * Centralized Audio Graph — single module that owns the entire Web Audio API pipeline.
 *
 * Graph topology (dual-gain for gapless + crossfade):
 *   sourceA → gainA ─┐
 *                     ├→ masterGain → [insert chain] → AnalyserNode → destination
 *   sourceB → gainB ─┘
 *
 * Both sources are permanently connected through their per-source gain nodes.
 * Gapless swap is a gain flip (active=1, inactive=0). Crossfade (T02) replaces
 * the instant flip with linearRampToValueAtTime on gainA/gainB.
 *
 * WHY DUAL-GAIN:
 * Single-gain with connect/disconnect can't crossfade — you need both sources
 * audible simultaneously with independent volume control. Per-source gains also
 * eliminate the disconnect/connect race during swap.
 *
 * WHY CENTRALIZED:
 * Previously, globalAudio lived in usePlayer.ts and AudioContext/AnalyserNode lived in
 * useAudioAnalyser.ts — they didn't coordinate. Volume was set via HTMLAudioElement.volume
 * (bypassing the graph). This module consolidates everything into one graph with a single
 * API surface for playback, volume, analysis, and node insertion (EQ, crossfade).
 *
 * WHY MODULE-LEVEL SINGLETONS:
 * - HTMLAudioElements must survive React component unmounts (navigating between pages)
 * - createMediaElementSource() can only be called ONCE per element — module scope ensures this
 * - AudioContext must be created/resumed on a user gesture — init() handles this
 */

import eqProcessor from './eqProcessor';

// --- Singleton state ---

let audioContext: AudioContext | null = null;
let insertChainOutput: AudioNode | null = null;
let gainA: GainNode | null = null;
let gainB: GainNode | null = null;
let masterGain: GainNode | null = null;
let analyserNode: AnalyserNode | null = null;

// Dual-element state
const elementA = new Audio();
const elementB = new Audio();
elementA.preload = 'metadata';
elementB.preload = 'metadata';
// Volume is controlled exclusively via GainNode — keep elements at max
elementA.volume = 1.0;
elementB.volume = 1.0;

let sourceA: MediaElementAudioSourceNode | null = null;
let sourceB: MediaElementAudioSourceNode | null = null;

// Which element is currently playing ('A' or 'B')
let activeSlot: 'A' | 'B' = 'A';

// Whether the next element has been pre-loaded and is ready for swap
let nextPrepared = false;

let initialized = false;

// Crossfade state — tracks whether a crossfade is currently in progress
let crossfadeInProgress = false;
let crossfadeTimer: ReturnType<typeof setTimeout> | null = null;

// --- Helpers ---

function getActive(): { element: HTMLAudioElement; source: MediaElementAudioSourceNode | null } {
  return activeSlot === 'A'
    ? { element: elementA, source: sourceA }
    : { element: elementB, source: sourceB };
}

function getNext(): { element: HTMLAudioElement; source: MediaElementAudioSourceNode | null } {
  return activeSlot === 'A'
    ? { element: elementB, source: sourceB }
    : { element: elementA, source: sourceA };
}

// --- Event callbacks (set by consumers like usePlayer) ---

type AudioCallback = () => void;
type TimeCallback = (time: number) => void;
type ErrorCallback = (element: HTMLAudioElement) => void;

let onTimeUpdate: TimeCallback | null = null;
let onLoadedMetadata: AudioCallback | null = null;
let onEnded: AudioCallback | null = null;
let onError: ErrorCallback | null = null;

// Wire native events — both elements fire through the same callbacks,
// but only the active element's events are meaningful.
function handleTimeUpdate(element: HTMLAudioElement) {
  return () => {
    if (element === getActive().element) {
      onTimeUpdate?.(element.currentTime);
    }
  };
}

function handleLoadedMetadata(element: HTMLAudioElement) {
  return () => {
    if (element === getActive().element) {
      onLoadedMetadata?.();
    }
  };
}

function handleEnded(element: HTMLAudioElement) {
  return () => {
    if (element === getActive().element) {
      onEnded?.();
    }
  };
}

function handleError(element: HTMLAudioElement) {
  return () => {
    if (element === getActive().element) {
      onError?.(element);
    }
  };
}

elementA.addEventListener('timeupdate', handleTimeUpdate(elementA));
elementA.addEventListener('loadedmetadata', handleLoadedMetadata(elementA));
elementA.addEventListener('ended', handleEnded(elementA));
elementA.addEventListener('error', handleError(elementA));

elementB.addEventListener('timeupdate', handleTimeUpdate(elementB));
elementB.addEventListener('loadedmetadata', handleLoadedMetadata(elementB));
elementB.addEventListener('ended', handleEnded(elementB));
elementB.addEventListener('error', handleError(elementB));

// --- Public API ---

/**
 * Initialize the AudioContext and build the graph with both source nodes.
 * MUST be called from a user gesture (click/tap) to satisfy browser autoplay policy.
 * Safe to call multiple times — subsequent calls resume a suspended context.
 */
function init(): void {
  if (initialized && audioContext) {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    return;
  }

  audioContext = new AudioContext();

  // AnalyserNode — same config as the previous useAudioAnalyser
  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 256;
  analyserNode.smoothingTimeConstant = 0.8;

  // Per-source gains — independent volume for crossfade overlap
  gainA = audioContext.createGain();
  gainB = audioContext.createGain();
  gainA.gain.value = 1; // Active source starts at full
  gainB.gain.value = 0; // Inactive source starts silent

  // Master gain — user volume control
  masterGain = audioContext.createGain();

  // Create both source nodes (one-shot per element — must do it now)
  sourceA = audioContext.createMediaElementSource(elementA);
  sourceB = audioContext.createMediaElementSource(elementB);

  // Dual-gain topology: both sources permanently connected
  // sourceA → gainA → masterGain → [EQ chain] → analyser → destination
  // sourceB → gainB → masterGain → [EQ chain] → analyser → destination
  sourceA.connect(gainA);
  sourceB.connect(gainB);
  gainA.connect(masterGain);
  gainB.connect(masterGain);

  // Insert EQ chain between masterGain and analyserNode
  const eq = eqProcessor.init(audioContext);
  masterGain.connect(eq.input);
  eq.output.connect(analyserNode);
  insertChainOutput = eq.output;

  analyserNode.connect(audioContext.destination);

  // Apply pending volume from pre-init setVolume calls
  masterGain.gain.value = pendingVolume;

  initialized = true;
  console.debug('[audioGraph] Graph initialized: dual-gain, active=A (volume:', pendingVolume + ')');
}

/**
 * Set the audio source URL on the ACTIVE element and load it.
 * Cancels any pending pre-load on the next element.
 * Does not auto-play — call play() after.
 */
function setSource(src: string): void {
  const { element } = getActive();
  const fullSrc = window.location.origin + src;
  if (element.src !== fullSrc) {
    console.debug('[audioGraph] Loading source on', activeSlot + ':', src);
    element.src = src;
    element.load();
  }
  // Cancel any pending pre-load — the caller is explicitly setting a new track
  cancelPrepare();
}

/**
 * Pre-load the next track on the inactive element for gapless transition.
 * Call this ~3s before the active track ends.
 */
function prepareNext(src: string): void {
  const { element } = getNext();
  const fullSrc = window.location.origin + src;
  if (element.src === fullSrc && nextPrepared) {
    return; // Already prepared
  }
  console.debug('[audioGraph] Pre-loading next on', (activeSlot === 'A' ? 'B' : 'A') + ':', src);
  element.src = src;
  element.load();
  nextPrepared = true;
}

/**
 * Cancel a pending pre-load (e.g., user skipped manually).
 * Also cancels any in-progress crossfade.
 */
function cancelPrepare(): void {
  cancelCrossfade();
  if (nextPrepared) {
    const { element } = getNext();
    element.removeAttribute('src');
    element.load(); // Reset
    nextPrepared = false;
    console.debug('[audioGraph] Pre-load cancelled');
  }
}

/**
 * Swap active and next elements for gapless transition.
 * Flips per-source gains (old=0, new=1) and starts playback on the new element.
 * No disconnect/connect — both sources stay wired through their gain nodes.
 *
 * Returns true if the swap happened, false if nothing was prepared.
 */
function swap(): boolean {
  if (!nextPrepared || !initialized) return false;

  const oldActive = getActive();
  const newActive = getNext();
  const [oldGain, newGain] = activeSlot === 'A' ? [gainA!, gainB!] : [gainB!, gainA!];

  // Instant gain flip — gapless, no overlap
  oldGain.gain.value = 0;
  newGain.gain.value = 1;

  // Pause old element (it's now silent)
  oldActive.element.pause();

  // Flip the active slot
  activeSlot = activeSlot === 'A' ? 'B' : 'A';
  nextPrepared = false;

  console.debug('[audioGraph] Swapped to', activeSlot);

  // Start playback on the newly active element
  newActive.element.play().catch((err) => {
    console.error('[audioGraph] Swap playback error:', err.message);
  });

  return true;
}

/**
 * Start a crossfade transition over `duration` seconds.
 * Ramps active gain 1→0 and next gain 0→1 using linearRampToValueAtTime.
 * Starts playback on the next element immediately, pauses old element after ramp.
 *
 * Returns true if the crossfade started, false if preconditions weren't met.
 */
function crossfade(duration: number): boolean {
  if (!nextPrepared || !initialized || crossfadeInProgress) return false;
  if (!audioContext || !gainA || !gainB) return false;

  crossfadeInProgress = true;
  const now = audioContext.currentTime;
  const endTime = now + duration;

  const [oldGain, newGain] = activeSlot === 'A' ? [gainA, gainB] : [gainB, gainA];
  const oldElement = getActive().element;
  const newElement = getNext().element;

  // Cancel any scheduled ramps, set current value as starting point
  oldGain.gain.cancelScheduledValues(now);
  newGain.gain.cancelScheduledValues(now);
  oldGain.gain.setValueAtTime(1, now);
  newGain.gain.setValueAtTime(0, now);

  // Ramp: active fades out, next fades in
  oldGain.gain.linearRampToValueAtTime(0, endTime);
  newGain.gain.linearRampToValueAtTime(1, endTime);

  // Start playback on the next element now (it plays under the ramp)
  newElement.play().catch((err) => {
    console.error('[audioGraph] Crossfade playback error:', err.message);
  });

  const newSlot = activeSlot === 'A' ? 'B' : 'A';
  console.debug(`[audioGraph] Crossfade started: ${duration}s, ${activeSlot}→${newSlot}`);

  // Flip active slot immediately — the new element is playing and should own
  // timeupdate/loadedmetadata callbacks so React state stays in sync.
  activeSlot = newSlot;
  nextPrepared = false;

  // After the ramp completes, pause the old element and clear crossfade state
  crossfadeTimer = setTimeout(() => {
    oldElement.pause();
    crossfadeInProgress = false;
    crossfadeTimer = null;
    console.debug('[audioGraph] Crossfade complete, active:', activeSlot);
  }, duration * 1000);

  return true;
}

/**
 * Cancel an in-progress crossfade (e.g., user skipped manually).
 * Resets gains to clean state: active=1, inactive=0.
 */
function cancelCrossfade(): void {
  if (!crossfadeInProgress) return;

  if (crossfadeTimer) {
    clearTimeout(crossfadeTimer);
    crossfadeTimer = null;
  }

  if (audioContext && gainA && gainB) {
    const now = audioContext.currentTime;
    const [activeGain, inactiveGain] = activeSlot === 'A' ? [gainA, gainB] : [gainB, gainA];
    activeGain.gain.cancelScheduledValues(now);
    inactiveGain.gain.cancelScheduledValues(now);
    activeGain.gain.setValueAtTime(1, now);
    inactiveGain.gain.setValueAtTime(0, now);
  }

  // Pause the next element that was playing during crossfade
  getNext().element.pause();

  crossfadeInProgress = false;
  console.debug('[audioGraph] Crossfade cancelled');
}

/**
 * Whether a crossfade is currently in progress.
 */
function isCrossfading(): boolean {
  return crossfadeInProgress;
}

/**
 * Check if the next element has been pre-loaded and is ready.
 */
function isNextPrepared(): boolean {
  return nextPrepared;
}

function play(): Promise<void> {
  init();
  const { element } = getActive();
  element.volume = 1.0;
  return element.play().catch((err) => {
    console.error('[audioGraph] Playback error:', err.message);
  }) as Promise<void>;
}

function pause(): void {
  getActive().element.pause();
}

/**
 * Stop playback completely and reset BOTH elements.
 * Used on logout to ensure audio doesn't keep playing after session ends.
 */
function stop(): void {
  cancelCrossfade();

  elementA.pause();
  elementA.removeAttribute('src');
  elementA.load();

  elementB.pause();
  elementB.removeAttribute('src');
  elementB.load();

  // Reset gains: A active (audible), B silent
  if (initialized && gainA && gainB) {
    const now = audioContext?.currentTime ?? 0;
    gainA.gain.cancelScheduledValues(now);
    gainB.gain.cancelScheduledValues(now);
    gainA.gain.value = 1;
    gainB.gain.value = 0;
  }
  activeSlot = 'A';
  nextPrepared = false;
}

function seek(time: number): void {
  getActive().element.currentTime = time;
}

function getCurrentTime(): number {
  return getActive().element.currentTime;
}

function getDuration(): number {
  return getActive().element.duration || 0;
}

function getCurrentSrc(): string {
  return getActive().element.src;
}

/**
 * Set master volume (0.0 to 1.0).
 * Controls masterGain — per-source gains (gainA/gainB) handle crossfade independently.
 */
function setVolume(value: number): void {
  const clamped = Math.max(0, Math.min(1, value));
  if (masterGain) {
    masterGain.gain.value = clamped;
  }
  pendingVolume = clamped;
}

// Pending volume for pre-init calls (e.g., restoring from localStorage before user gesture)
let pendingVolume = 0.8;

/**
 * Get the AnalyserNode for visualizer components.
 * Returns null until init() has been called.
 */
function getAnalyser(): AnalyserNode | null {
  return analyserNode;
}

/**
 * Get per-source gain nodes for crossfade control.
 * Returns null until init() has been called.
 * The active gain is at 1.0, inactive at 0.0 during normal playback.
 */
function getSourceGains(): { gainA: GainNode; gainB: GainNode; activeSlot: 'A' | 'B' } | null {
  if (!gainA || !gainB) return null;
  return { gainA, gainB, activeSlot };
}

/**
 * Get the master gain node for EQ chain insertion.
 * EQ nodes connect between masterGain output and analyserNode input.
 * Returns null until init() has been called.
 */
function getMasterGain(): GainNode | null {
  return masterGain;
}

/**
 * Check whether the graph has been initialized.
 */
function isInitialized(): boolean {
  return initialized;
}

function getAudioContext(): AudioContext | null {
  return audioContext;
}

/**
 * Returns the node after EQ processing — deck analyser connects here
 * to tap the post-EQ signal without duplicating the chain.
 */
function getInsertChainOutput(): AudioNode | null {
  return insertChainOutput;
}

/**
 * Get the remaining time (in seconds) on the active element.
 * Returns Infinity if duration is unknown.
 */
function getRemaining(): number {
  const { element } = getActive();
  const dur = element.duration;
  if (!dur || isNaN(dur)) return Infinity;
  return dur - element.currentTime;
}

// --- Callback registration ---

function setOnTimeUpdate(cb: TimeCallback | null): void {
  onTimeUpdate = cb;
}

function setOnLoadedMetadata(cb: AudioCallback | null): void {
  onLoadedMetadata = cb;
}

function setOnEnded(cb: AudioCallback | null): void {
  onEnded = cb;
}

function setOnError(cb: ErrorCallback | null): void {
  onError = cb;
}

// --- Export as namespace-like object ---

const audioGraph = {
  init,
  setSource,
  prepareNext,
  cancelPrepare,
  swap,
  crossfade,
  cancelCrossfade,
  isCrossfading,
  isNextPrepared,
  play,
  pause,
  stop,
  seek,
  getCurrentTime,
  getDuration,
  getCurrentSrc,
  getRemaining,
  setVolume,
  getAnalyser,
  getSourceGains,
  getMasterGain,
  isInitialized,
  getAudioContext,
  getInsertChainOutput,
  setOnTimeUpdate,
  setOnLoadedMetadata,
  setOnEnded,
  setOnError,
} as const;

export default audioGraph;
