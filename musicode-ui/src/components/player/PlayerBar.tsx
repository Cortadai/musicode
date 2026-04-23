import { usePlayer } from '../../hooks/usePlayer';
import { initAudioContext } from '../../hooks/useAudioAnalyser';
import { useCallback, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';
import type { VisualizerMode } from '../../audio/audioPreferences';
import TrackInfo from './TrackInfo';
import TransportControls from './TransportControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import CrossfadePopover from './CrossfadePopover';
import EqPopover from './EqPopover';
import Visualizer from './Visualizer';
import NowPlayingOverlay from './NowPlayingOverlay';
import ScrobbleIndicator from './ScrobbleIndicator';

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    queue, queueIndex, shuffle, repeatMode,
    pause, resume, next, prev, seek, setVolume,
    toggleShuffle, toggleRepeat, setCrossfadeDuration, getCrossfadeDuration,
    scrobbleStatus,
  } = usePlayer();

  const [showVisualizer, setShowVisualizer] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(() => loadPreferences().visualizerMode);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  const handlePlayPause = useCallback(() => {
    initAudioContext();
    if (isPlaying) pause(); else resume();
  }, [isPlaying, pause, resume]);

  const handleToggleVisualizer = useCallback(() => {
    initAudioContext();
    setShowVisualizer((v) => !v);
  }, []);

  const handleVisualizerModeChange = useCallback((mode: VisualizerMode) => {
    setVisualizerMode(mode);
    savePreferences({ visualizerMode: mode });
  }, []);

  if (!currentTrack) return null;

  const hasNext = queueIndex < queue.length - 1 || repeatMode === 'all';
  const hasPrev = queueIndex > 0 || currentTime > 3 || repeatMode === 'all';

  return (
    <div role="region" aria-label="Music player" className="bg-zinc-900 border-t border-zinc-800 shrink-0 animate-slide-up">
      <Visualizer visible={showVisualizer} mode={visualizerMode} onModeChange={handleVisualizerModeChange} />

      <div className="h-20 flex items-center px-4 gap-4">
        <TrackInfo
          title={currentTrack.title}
          artistName={currentTrack.artist?.name ?? 'Unknown'}
          albumId={currentTrack.album?.id}
          hasCover={currentTrack.album?.hasCoverArt}
          isPlaying={isPlaying}
          onArtworkClick={() => setShowNowPlaying(true)}
        />

        <div className="flex-1 flex flex-col items-center gap-1 max-w-2xl mx-auto">
          <TransportControls
            isPlaying={isPlaying}
            shuffle={shuffle}
            repeatMode={repeatMode}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPlayPause={handlePlayPause}
            onNext={next}
            onPrev={prev}
            onToggleShuffle={toggleShuffle}
            onToggleRepeat={toggleRepeat}
          />
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
        </div>

        <div className="flex items-center gap-2 w-48 shrink-0 justify-end">
          <ScrobbleIndicator status={scrobbleStatus} />
          <CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />
          <EqPopover />
          <button
            onClick={handleToggleVisualizer}
            aria-label={showVisualizer ? 'Hide visualizer' : 'Show visualizer'}
            aria-pressed={showVisualizer}
            className={`flex items-center justify-center transition-colors ${showVisualizer ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <VolumeControl volume={volume} onVolumeChange={setVolume} />
        </div>
      </div>
      <NowPlayingOverlay open={showNowPlaying} onClose={() => setShowNowPlaying(false)} />
    </div>
  );
}
