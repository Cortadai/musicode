import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react';
import type { Track } from '../types';

// --- State ---

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  queueIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  queue: [],
  queueIndex: -1,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
};

// --- Actions ---

type PlayerAction =
  | { type: 'PLAY_TRACK'; track: Track; queue?: Track[]; queueIndex?: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'SET_TIME'; time: number }
  | { type: 'SET_DURATION'; duration: number }
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'STOP' };

function playerReducer(state: PlayerState, action: PlayerAction): PlayerState {
  switch (action.type) {
    case 'PLAY_TRACK': {
      const queue = action.queue ?? [action.track];
      const queueIndex = action.queueIndex ?? 0;
      return {
        ...state,
        currentTrack: action.track,
        queue,
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
      const nextIndex = state.queueIndex + 1;
      if (nextIndex >= state.queue.length) {
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
      // If past 3s, restart current track
      if (state.currentTime > 3) {
        return { ...state, currentTime: 0 };
      }
      const prevIndex = state.queueIndex - 1;
      if (prevIndex < 0) {
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
