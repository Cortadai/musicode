import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { Track } from '../types';

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

export const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  originalQueue: [],
  queueIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  shuffle: false,
  repeatMode: 'off',
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

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  return (
    <PlayerStateContext.Provider value={state}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerStateContext.Provider>
  );
}

export function usePlayerState() {
  return useContext(PlayerStateContext);
}

export function usePlayerDispatch() {
  return useContext(PlayerDispatchContext);
}
