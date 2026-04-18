/**
 * Centralized Audio Graph — single module that owns the entire Web Audio API pipeline.
 *
 * Graph topology (dual-element for gapless):
 *   activeElement → MediaElementSourceNode ─┐
 *                                           ├→ GainNode → [insert chain] → AnalyserNode → destination
 *   nextElement   → MediaElementSourceNode ─┘  (disconnected until swap)
 *
 * GAPLESS ARCHITECTURE:
 * Two HTMLAudioElements (A and B) alternate roles. While one plays, the other
 * pre-loads the next track. On swap, the active source disconnects and the next
 * source connects — the browser handles the ~0-50ms transition. Both source nodes
 * are created once at init() (createMediaElementSource is one-shot per element).
 *
 * WHY CENTRALIZED:
 * Previously, globalAudio lived in usePlayer.ts and AudioContext/AnalyserNode lived in
 * useAudioAnalyser.ts — they didn't coordinate. Volume was set via HTMLAudioElement.volume
 * (bypassing the graph). This module consolidates everything into one graph with a single
 * API surface for playback, volume, analysis, and future node insertion (EQ, crossfade).
 *
 * WHY MODULE-LEVEL SINGLETONS:
 * - HTMLAudioElements must survive React component unmounts (navigating between pages)
 * - createMediaElementSource() can only be called ONCE per element — module scope ensures this
 * - AudioContext must be created/resumed on a user gesture — init() handles this
 *
 * FUTURE (M010): The insert chain between GainNode and AnalyserNode is where EQ bands
 * and crossfade gain nodes will be inserted via connect()/disconnect().
 */

// --- Singleton state ---

let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
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

let onTimeUpdate: TimeCallback | null = null;
let onLoadedMetadata: AudioCallback | null = null;
let onEnded: AudioCallback | null = null;

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

elementA.addEventListener('timeupdate', handleTimeUpdate(elementA));
elementA.addEventListener('loadedmetadata', handleLoadedMetadata(elementA));
elementA.addEventListener('ended', handleEnded(elementA));

elementB.addEventListener('timeupdate', handleTimeUpdate(elementB));
elementB.addEventListener('loadedmetadata', handleLoadedMetadata(elementB));
elementB.addEventListener('ended', handleEnded(elementB));

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

  // GainNode — volume control lives here, not on the HTMLAudioElement
  gainNode = audioContext.createGain();

  // Create both source nodes (one-shot per element — must do it now)
  sourceA = audioContext.createMediaElementSource(elementA);
  sourceB = audioContext.createMediaElementSource(elementB);

  // Chain: gain → analyser → destination (shared by both sources)
  gainNode.connect(analyserNode);
  analyserNode.connect(audioContext.destination);

  // Connect only the active source initially
  sourceA.connect(gainNode);
  // sourceB stays disconnected until swap

  // Apply pending volume from pre-init setVolume calls
  gainNode.gain.value = pendingVolume;

  initialized = true;
  console.log('[audioGraph] Graph initialized: dual-element, active=A (volume:', pendingVolume + ')');
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
 */
function cancelPrepare(): void {
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
 * Disconnects the old active source, connects the new active source,
 * and starts playback on the new active element.
 *
 * Returns true if the swap happened, false if nothing was prepared.
 */
function swap(): boolean {
  if (!nextPrepared || !initialized) return false;

  const oldActive = getActive();
  const newActive = getNext();

  // Disconnect old source, connect new source to the gain chain
  oldActive.source?.disconnect();
  newActive.source?.connect(gainNode!);

  // Pause and reset old element
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
  elementA.pause();
  elementA.removeAttribute('src');
  elementA.load();

  elementB.pause();
  elementB.removeAttribute('src');
  elementB.load();

  // Reset to element A as active, reconnect source if initialized
  if (initialized && sourceA && sourceB && gainNode) {
    // Disconnect whichever is currently connected
    try { sourceA.disconnect(); } catch { /* may not be connected */ }
    try { sourceB.disconnect(); } catch { /* may not be connected */ }
    sourceA.connect(gainNode);
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
 * Set volume via GainNode (0.0 to 1.0).
 * The HTMLAudioElement.volume stays at 1.0 — all volume control is in the graph.
 */
function setVolume(value: number): void {
  const clamped = Math.max(0, Math.min(1, value));
  if (gainNode) {
    gainNode.gain.value = clamped;
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
 * Check whether the graph has been initialized.
 */
function isInitialized(): boolean {
  return initialized;
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

// --- Export as namespace-like object ---

const audioGraph = {
  init,
  setSource,
  prepareNext,
  cancelPrepare,
  swap,
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
  isInitialized,
  setOnTimeUpdate,
  setOnLoadedMetadata,
  setOnEnded,
} as const;

export default audioGraph;
