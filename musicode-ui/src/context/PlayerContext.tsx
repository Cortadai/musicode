import { createContext, useContext, useMemo, useReducer, useEffect, useRef, type ReactNode, type Dispatch } from 'react';
import type { Track } from '../types';
import { loadPreferences, savePreferences } from '../audio/audioPreferences';

/**
 * Player state management using useReducer.
 *
 * WHY useReducer OVER useState:
 * Player state has many interdependent fields (currentTrack, queue, queueIndex,
 * isPlaying, shuffle, repeat). A single state update often needs to change multiple
 * fields atomically (e.g. NEXT changes currentTrack + queueIndex + currentTime + duration).
 * useReducer guarantees atomic state transitions — no intermediate states where
 * currentTrack and queueIndex are out of sync.
 *
 * WHY TWO CONTEXTS (state + dispatch):
 * Components that only read state (TrackList highlighting current track) don't need
 * the dispatch function. Components that only dispatch (play buttons) don't need the
 * full state. Separate contexts prevent unnecessary re-renders — a component consuming
 * only dispatch won't re-render when state changes.
 *
 * WHY originalQueue:
 * When shuffle is toggled on, we randomize the queue but keep a copy of the original
 * order. When shuffle is toggled off, we restore the original order and find the
 * current track's position in it. Without this, disabling shuffle would lose the
 * original album/artist track order.
 */

// --- State ---

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  originalQueue: Track[]; // pre-shuffle order
  queueIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
}

// Hydrate persisted preferences (volume, shuffle, repeatMode) from localStorage
const savedPrefs = loadPreferences();

export const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  originalQueue: [],
  queueIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: savedPrefs.volume,
  shuffle: savedPrefs.shuffle,
  repeatMode: savedPrefs.repeatMode,
};

// --- Actions ---

export type PlayerAction =
  | { type: 'PLAY_TRACK'; track: Track; queue?: Track[]; queueIndex?: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_TIME'; time: number }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'STOP' };

function shuffleArray<T>(arr: T[], keepIndex: number): { shuffled: T[]; newIndex: number } {
  const current = arr[keepIndex];
  const rest = arr.filter((_, i) => i !== keepIndex);
  // Fisher-Yates on rest
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return { shuffled: [current, ...rest], newIndex: 0 };
}

export function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY_TRACK': {
      const queue = action.queue ?? [action.track];
      const queueIndex = action.queueIndex ?? 0;
      if (state.shuffle && queue.length > 1) {
        const { shuffled, newIndex } = shuffleArray(queue, queueIndex);
        return {
          ...state,
          currentTrack: action.track,
          queue: shuffled,
          originalQueue: queue,
          queueIndex: newIndex,
          isPlaying: true,
          currentTime: 0,
          duration: 0,
        };
      }
      return {
        ...state,
        currentTrack: action.track,
        queue,
        originalQueue: queue,
        queueIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    }
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESUME':
      return { ...state, isPlaying: true };
    case 'NEXT': {
      // Repeat one — restart current track
      if (state.repeatMode === 'one') {
        return { ...state, currentTime: 0 };
      }
      const nextIndex = state.queueIndex + 1;
      if (nextIndex >= state.queue.length) {
        // Repeat all — loop to start
        if (state.repeatMode === 'all' && state.queue.length > 0) {
          return {
            ...state,
            currentTrack: state.queue[0],
            queueIndex: 0,
            isPlaying: true,
            currentTime: 0,
            duration: 0,
          };
        }
        return { ...state, isPlaying: false };
      }
      return {
        ...state,
        currentTrack: state.queue[nextIndex],
        queueIndex: nextIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    }
    case 'PREV': {
      if (state.currentTime > 3) {
        return { ...state, currentTime: 0 };
      }
      const prevIndex = state.queueIndex - 1;
      if (prevIndex < 0) {
        // Repeat all — loop to end
        if (state.repeatMode === 'all' && state.queue.length > 0) {
          const lastIndex = state.queue.length - 1;
          return {
            ...state,
            currentTrack: state.queue[lastIndex],
            queueIndex: lastIndex,
            isPlaying: true,
            currentTime: 0,
            duration: 0,
          };
        }
        return { ...state, currentTime: 0 };
      }
      return {
        ...state,
        currentTrack: state.queue[prevIndex],
        queueIndex: prevIndex,
        isPlaying: true,
        currentTime: 0,
        duration: 0,
      };
    }
    case 'SET_TIME':
      return { ...state, currentTime: action.time };
    case 'SET_DURATION':
      return { ...state, duration: action.duration };
    case 'SET_VOLUME':
      return { ...state, volume: Math.max(0, Math.min(1, action.volume)) };
    case 'TOGGLE_SHUFFLE': {
      const newShuffle = !state.shuffle;
      if (newShuffle && state.queue.length > 1 && state.queueIndex >= 0) {
        const { shuffled, newIndex } = shuffleArray(state.queue, state.queueIndex);
        return { ...state, shuffle: true, queue: shuffled, queueIndex: newIndex };
      }
      if (!newShuffle && state.originalQueue.length > 0 && state.currentTrack) {
        // Restore original order, find current track
        const idx = state.originalQueue.findIndex(t => t.id === state.currentTrack!.id);
        return {
          ...state,
          shuffle: false,
          queue: state.originalQueue,
          queueIndex: idx >= 0 ? idx : 0,
        };
      }
      return { ...state, shuffle: newShuffle };
    }
    case 'TOGGLE_REPEAT': {
      const modes: RepeatMode[] = ['off', 'all', 'one'];
      const currentIdx = modes.indexOf(state.repeatMode);
      return { ...state, repeatMode: modes[(currentIdx + 1) % modes.length] };
    }
    case 'STOP':
      return { ...initialState, volume: state.volume };
    default:
      return state;
  }
}

// --- Context ---

const PlayerStateContext = createContext<PlayerState>(initialState);
const PlayerDispatchContext = createContext<Dispatch<PlayerAction>>(() => {});

/**
 * Narrow context carrying only current-track identity and play state.
 * Components like TrackList that need to highlight the active track can
 * subscribe here instead of PlayerStateContext, avoiding re-renders on
 * every currentTime tick (~4 Hz).
 */
interface CurrentTrackInfo {
  trackId: number | null;
  isPlaying: boolean;
}
const CurrentTrackContext = createContext<CurrentTrackInfo>({ trackId: null, isPlaying: false });

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  // Persist preferences to localStorage when they change
  const isFirstRender = useRef(true);
  useEffect(() => {
    // Skip the initial render — we just loaded these values from localStorage
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    savePreferences({
      volume: state.volume,
      shuffle: state.shuffle,
      repeatMode: state.repeatMode,
    });
  }, [state.volume, state.shuffle, state.repeatMode]);

  const currentTrackInfo = useMemo<CurrentTrackInfo>(
    () => ({ trackId: state.currentTrack?.id ?? null, isPlaying: state.isPlaying }),
    [state.currentTrack?.id, state.isPlaying]
  );

  return (
    <PlayerStateContext.Provider value={state}>
      <CurrentTrackContext.Provider value={currentTrackInfo}>
        <PlayerDispatchContext.Provider value={dispatch}>
          {children}
        </PlayerDispatchContext.Provider>
      </CurrentTrackContext.Provider>
    </PlayerStateContext.Provider>
  );
}

export function usePlayerState() {
  return useContext(PlayerStateContext);
}

export function usePlayerDispatch() {
  return useContext(PlayerDispatchContext);
}

/** Narrow subscription — only re-renders when the playing track ID or isPlaying changes. */
export function useCurrentTrackInfo() {
  return useContext(CurrentTrackContext);
}
