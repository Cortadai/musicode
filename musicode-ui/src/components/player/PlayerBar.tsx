import { usePlayer } from '../../hooks/usePlayer';
import audioGraph from '../../audio/audioGraph';
import { useCallback, useState } from 'react';
import { BarChart3, Activity, CassetteTape, ListMusic } from 'lucide-react';
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
import RetroMode from './RetroMode';
import ScrobbleIndicator from './ScrobbleIndicator';
import HeartButton from '../common/HeartButton';
import { useFavorites } from '../../hooks/useFavorites';
import { useQueuePanel } from '../../context/QueuePanelContext';

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    queue, queueIndex, shuffle, repeatMode,
    pause, resume, next, prev, seek, setVolume,
    toggleShuffle, toggleRepeat, setCrossfadeDuration, getCrossfadeDuration,
    scrobbleStatus,
  } = usePlayer();

  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { isOpen: isQueueOpen, toggle: toggleQueue } = useQueuePanel();

  const [showVisualizer, setShowVisualizer] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(() => {
    const saved = loadPreferences().visualizerMode;
    return saved === 'vinyl' ? 'bars' : saved;
  });
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [showRetroMode, setShowRetroMode] = useState(false);
  const [waveformEnabled, setWaveformEnabled] = useState(() => loadPreferences().waveformEnabled);

  const handleToggleWaveform = useCallback(() => {
    setWaveformEnabled((v) => {
      savePreferences({ waveformEnabled: !v });
      return !v;
    });
  }, []);

  const handlePlayPause = useCallback(() => {
    audioGraph.init();
    if (isPlaying) pause(); else resume();
  }, [isPlaying, pause, resume]);

  const handleToggleVisualizer = useCallback(() => {
    audioGraph.init();
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
    <div role="region" aria-label="Music player" className="shrink-0 animate-slide-up" style={{ background: 'linear-gradient(to top, var(--mc-player-background), var(--mc-glass-background))', borderTop: '1px solid var(--mc-glass-border)', backdropFilter: 'blur(var(--mc-glass-blur))', WebkitBackdropFilter: 'blur(var(--mc-glass-blur))' }}>
      <Visualizer visible={showVisualizer} mode={visualizerMode} onModeChange={handleVisualizerModeChange} />

      <div className={`${waveformEnabled ? 'h-28' : 'h-20'} flex items-center px-4 gap-4 transition-[height] duration-200`}>
        <TrackInfo
          title={currentTrack.title}
          artistName={currentTrack.artist?.name ?? 'Unknown'}
          albumId={currentTrack.album?.id}
          hasCover={currentTrack.album?.hasCoverArt}
          isPlaying={isPlaying}
          onArtworkClick={() => setShowNowPlaying(true)}
          filePath={currentTrack.filePath}
          bitRate={currentTrack.bitRate}
          sampleRate={currentTrack.sampleRate}
          bitsPerSample={currentTrack.bitsPerSample}
        />
        <HeartButton
          active={isFavorite(currentTrack.id)}
          onClick={() => toggleFavorite(currentTrack.id)}
        />

        <div className="flex-1 flex flex-col items-center gap-1 min-w-0 max-w-2xl mx-auto">
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
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} trackId={currentTrack.id} waveformEnabled={waveformEnabled} />
        </div>

        <div className="flex items-center gap-2 w-44 shrink-0 justify-end">
          <ScrobbleIndicator status={scrobbleStatus} />
          <button
            onClick={handleToggleWaveform}
            aria-label={waveformEnabled ? 'Switch to flat progress bar' : 'Switch to waveform'}
            aria-pressed={waveformEnabled}
            className={`flex items-center justify-center transition-colors ${waveformEnabled ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
          >
            <Activity className="w-4 h-4" />
          </button>
          <CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />
          <EqPopover />
          <button
            onClick={handleToggleVisualizer}
            aria-label={showVisualizer ? 'Hide visualizer' : 'Show visualizer'}
            aria-pressed={showVisualizer}
            className={`flex items-center justify-center transition-colors ${showVisualizer ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowRetroMode(true)}
            aria-label="Retro cassette mode"
            className="flex items-center justify-center transition-colors mc-interactive-warning"
          >
            <CassetteTape className="w-4 h-4" />
          </button>
          <button
            onClick={toggleQueue}
            aria-label={isQueueOpen ? 'Hide queue' : 'Show queue'}
            aria-pressed={isQueueOpen}
            className={`flex items-center justify-center transition-colors ${isQueueOpen ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
          >
            <ListMusic className="w-4 h-4" />
          </button>
          <VolumeControl volume={volume} onVolumeChange={setVolume} />
        </div>
      </div>
      <NowPlayingOverlay open={showNowPlaying} onClose={() => setShowNowPlaying(false)} />
      <RetroMode open={showRetroMode} onClose={() => setShowRetroMode(false)} />
    </div>
  );
}
