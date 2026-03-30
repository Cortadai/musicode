import { describe, it, expect } from 'vitest';
import { playerReducer, initialState, type PlayerState } from './PlayerContext';
import type { Track } from '../types';

// --- Helpers ---

function makeTrack(id: number, title: string = `Track ${id}`): Track {
  return {
    id,
    title,
    trackNumber: id,
    discNumber: 1,
    duration: 200,
    filePath: `/music/track${id}.flac`,
    fileSize: 10_000_000,
    bitRate: 1411,
    sampleRate: 44100,
    bitsPerSample: 16,
    year: 2024,
    genre: 'Electronic',
    album: { id: 1, title: 'Test Album', year: 2024, hasCoverArt: false },
    artist: { id: 1, name: 'Test Artist' },
  };
}

const t1 = makeTrack(1, 'Alpha');
const t2 = makeTrack(2, 'Beta');
const t3 = makeTrack(3, 'Gamma');
const threeTrackQueue = [t1, t2, t3];

function stateWith(overrides: Partial<PlayerState>): PlayerState {
  return { ...initialState, ...overrides };
}

// --- Tests ---

describe('playerReducer', () => {
  // --- PLAY_TRACK ---
  describe('PLAY_TRACK', () => {
    it('sets current track and starts playing', () => {
      const state = playerReducer(initialState, { type: 'PLAY_TRACK', track: t1 });
      expect(state.currentTrack).toEqual(t1);
      expect(state.isPlaying).toBe(true);
      expect(state.currentTime).toBe(0);
      expect(state.queue).toEqual([t1]);
    });

    it('sets queue and index when provided', () => {
      const state = playerReducer(initialState, {
        type: 'PLAY_TRACK',
        track: t2,
        queue: threeTrackQueue,
        queueIndex: 1,
      });
      expect(state.currentTrack).toEqual(t2);
      expect(state.queue).toEqual(threeTrackQueue);
      expect(state.queueIndex).toBe(1);
    });

    it('shuffles queue when shuffle is on', () => {
      const shuffledState = stateWith({ shuffle: true });
      const state = playerReducer(shuffledState, {
        type: 'PLAY_TRACK',
        track: t2,
        queue: threeTrackQueue,
        queueIndex: 1,
      });
      // Current track should always be first after shuffle
      expect(state.queue[0]).toEqual(t2);
      expect(state.queueIndex).toBe(0);
      expect(state.queue).toHaveLength(3);
    });
  });

  // --- PAUSE / RESUME ---
  describe('PAUSE / RESUME', () => {
    it('pauses playback', () => {
      const playing = stateWith({ isPlaying: true, currentTrack: t1 });
      const state = playerReducer(playing, { type: 'PAUSE' });
      expect(state.isPlaying).toBe(false);
    });

    it('resumes playback', () => {
      const paused = stateWith({ isPlaying: false, currentTrack: t1 });
      const state = playerReducer(paused, { type: 'RESUME' });
      expect(state.isPlaying).toBe(true);
    });
  });

  // --- NEXT ---
  describe('NEXT', () => {
    it('advances to next track', () => {
      const playing = stateWith({
        currentTrack: t1,
        queue: threeTrackQueue,
        queueIndex: 0,
        isPlaying: true,
      });
      const state = playerReducer(playing, { type: 'NEXT' });
      expect(state.currentTrack).toEqual(t2);
      expect(state.queueIndex).toBe(1);
      expect(state.isPlaying).toBe(true);
    });

    it('stops at end of queue with repeat off', () => {
      const atEnd = stateWith({
        currentTrack: t3,
        queue: threeTrackQueue,
        queueIndex: 2,
        isPlaying: true,
        repeatMode: 'off',
      });
      const state = playerReducer(atEnd, { type: 'NEXT' });
      expect(state.isPlaying).toBe(false);
    });

    it('wraps to start with repeat all', () => {
      const atEnd = stateWith({
        currentTrack: t3,
        queue: threeTrackQueue,
        queueIndex: 2,
        isPlaying: true,
        repeatMode: 'all',
      });
      const state = playerReducer(atEnd, { type: 'NEXT' });
      expect(state.currentTrack).toEqual(t1);
      expect(state.queueIndex).toBe(0);
      expect(state.isPlaying).toBe(true);
    });

    it('restarts current track with repeat one', () => {
      const playing = stateWith({
        currentTrack: t2,
        queue: threeTrackQueue,
        queueIndex: 1,
        isPlaying: true,
        currentTime: 120,
        repeatMode: 'one',
      });
      const state = playerReducer(playing, { type: 'NEXT' });
      expect(state.currentTrack).toEqual(t2); // same track
      expect(state.currentTime).toBe(0); // restarted
      expect(state.queueIndex).toBe(1); // same index
    });
  });

  // --- PREV ---
  describe('PREV', () => {
    it('restarts if currentTime > 3s', () => {
      const midTrack = stateWith({
        currentTrack: t2,
        queue: threeTrackQueue,
        queueIndex: 1,
        currentTime: 30,
      });
      const state = playerReducer(midTrack, { type: 'PREV' });
      expect(state.currentTrack).toEqual(t2); // same track
      expect(state.currentTime).toBe(0); // restarted
    });

    it('goes to previous track if currentTime <= 3s', () => {
      const earlyInTrack = stateWith({
        currentTrack: t2,
        queue: threeTrackQueue,
        queueIndex: 1,
        currentTime: 2,
        isPlaying: true,
      });
      const state = playerReducer(earlyInTrack, { type: 'PREV' });
      expect(state.currentTrack).toEqual(t1);
      expect(state.queueIndex).toBe(0);
    });

    it('restarts first track with repeat off', () => {
      const atStart = stateWith({
        currentTrack: t1,
        queue: threeTrackQueue,
        queueIndex: 0,
        currentTime: 1,
        repeatMode: 'off',
      });
      const state = playerReducer(atStart, { type: 'PREV' });
      expect(state.currentTime).toBe(0);
      expect(state.currentTrack).toEqual(t1);
    });

    it('wraps to end with repeat all', () => {
      const atStart = stateWith({
        currentTrack: t1,
        queue: threeTrackQueue,
        queueIndex: 0,
        currentTime: 1,
        repeatMode: 'all',
        isPlaying: true,
      });
      const state = playerReducer(atStart, { type: 'PREV' });
      expect(state.currentTrack).toEqual(t3);
      expect(state.queueIndex).toBe(2);
    });
  });

  // --- TOGGLE_SHUFFLE ---
  describe('TOGGLE_SHUFFLE', () => {
    it('enables shuffle and keeps current track first', () => {
      const playing = stateWith({
        currentTrack: t2,
        queue: threeTrackQueue,
        originalQueue: threeTrackQueue,
        queueIndex: 1,
        shuffle: false,
      });
      const state = playerReducer(playing, { type: 'TOGGLE_SHUFFLE' });
      expect(state.shuffle).toBe(true);
      expect(state.queue[0]).toEqual(t2); // current track first
      expect(state.queueIndex).toBe(0);
      expect(state.queue).toHaveLength(3);
    });

    it('disabling shuffle restores original queue order', () => {
      const shuffled = stateWith({
        currentTrack: t2,
        queue: [t2, t3, t1], // shuffled
        originalQueue: threeTrackQueue,
        queueIndex: 0,
        shuffle: true,
      });
      const state = playerReducer(shuffled, { type: 'TOGGLE_SHUFFLE' });
      expect(state.shuffle).toBe(false);
      expect(state.queue).toEqual(threeTrackQueue); // restored
      expect(state.queueIndex).toBe(1); // t2 is at index 1 in original
    });
  });

  // --- TOGGLE_REPEAT ---
  describe('TOGGLE_REPEAT', () => {
    it('cycles off → all → one → off', () => {
      let state = stateWith({ repeatMode: 'off' });

      state = playerReducer(state, { type: 'TOGGLE_REPEAT' });
      expect(state.repeatMode).toBe('all');

      state = playerReducer(state, { type: 'TOGGLE_REPEAT' });
      expect(state.repeatMode).toBe('one');

      state = playerReducer(state, { type: 'TOGGLE_REPEAT' });
      expect(state.repeatMode).toBe('off');
    });
  });

  // --- SET_VOLUME ---
  describe('SET_VOLUME', () => {
    it('sets volume', () => {
      const state = playerReducer(initialState, { type: 'SET_VOLUME', volume: 0.5 });
      expect(state.volume).toBe(0.5);
    });

    it('clamps to 0', () => {
      const state = playerReducer(initialState, { type: 'SET_VOLUME', volume: -0.5 });
      expect(state.volume).toBe(0);
    });

    it('clamps to 1', () => {
      const state = playerReducer(initialState, { type: 'SET_VOLUME', volume: 1.5 });
      expect(state.volume).toBe(1);
    });
  });

  // --- SET_TIME / SET_DURATION ---
  describe('SET_TIME / SET_DURATION', () => {
    it('sets current time', () => {
      const state = playerReducer(initialState, { type: 'SET_TIME', time: 42 });
      expect(state.currentTime).toBe(42);
    });

    it('sets duration', () => {
      const state = playerReducer(initialState, { type: 'SET_DURATION', duration: 300 });
      expect(state.duration).toBe(300);
    });
  });

  // --- STOP ---
  describe('STOP', () => {
    it('resets to initial state but preserves volume', () => {
      const playing = stateWith({
        currentTrack: t2,
        queue: threeTrackQueue,
        queueIndex: 1,
        isPlaying: true,
        currentTime: 100,
        duration: 200,
        volume: 0.6,
        shuffle: true,
        repeatMode: 'all',
      });
      const state = playerReducer(playing, { type: 'STOP' });
      expect(state.currentTrack).toBeNull();
      expect(state.queue).toEqual([]);
      expect(state.isPlaying).toBe(false);
      expect(state.volume).toBe(0.6); // preserved
      expect(state.shuffle).toBe(false);
      expect(state.repeatMode).toBe('off');
    });
  });
});
