import { usePlayer } from '../../hooks/usePlayer';
import audioGraph from '../../audio/audioGraph';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { EqBand } from '../../audio/eqProcessor';
import { ListMusic, Activity, BarChart3, CassetteTape, Mic2, SlidersHorizontal } from 'lucide-react';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';
import TrackInfo from './TrackInfo';
import TransportControls from './TransportControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import CrossfadePopover from './CrossfadePopover';
import MoreControlsPopover from './MoreControlsPopover';
import EqPopover from './EqPopover';
import EqMiniCurve from './EqMiniCurve';
import NowPlayingOverlay from './NowPlayingOverlay';
import RetroMode from './RetroMode';
import ScrobbleIndicator from './ScrobbleIndicator';
import HeartButton from '../common/HeartButton';
import { useFavorites } from '../../hooks/useFavorites';
import { useQueuePanel } from '../../context/QueuePanelContext';
import { useLyricsSidebar } from '../../context/LyricsSidebarContext';
import { useDeckStore } from '../analyzer/useDeckStore';

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    queue, queueIndex, shuffle, repeatMode,
    pause, resume, next, prev, seek, setVolume,
    toggleShuffle, toggleRepeat, setCrossfadeDuration, getCrossfadeDuration,
    scrobbleStatus,
  } = usePlayer();

  const { isFavorite, toggle: toggleFavorite } = useFavorites();
  const { isOpen: isQueueOpen, toggle: toggleQueue, close: closeQueue } = useQueuePanel();
  const { isOpen: isLyricsOpen, toggle: toggleLyrics, close: closeLyrics } = useLyricsSidebar();
  const { visible: deckVisible, toggleVisible: toggleDeck } = useDeckStore();

  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [showRetroMode, setShowRetroMode] = useState(false);
  const [eqOpen, setEqOpen] = useState(false);
  const [eqEnabled, setEqEnabled] = useState(() => loadPreferences().eqEnabled);
  const [eqBands, setEqBands] = useState<EqBand[]>(() => loadPreferences().eqBands);
  const eqButtonRef = useRef<HTMLButtonElement>(null);
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

  const handleToggleDeck = useCallback(() => {
    audioGraph.init();
    toggleDeck();
  }, [toggleDeck]);

  const handleToggleQueue = useCallback(() => {
    if (!isQueueOpen) closeLyrics();
    toggleQueue();
  }, [isQueueOpen, closeLyrics, toggleQueue]);

  const handleToggleLyrics = useCallback(() => {
    if (!isLyricsOpen) closeQueue();
    toggleLyrics();
  }, [isLyricsOpen, closeQueue, toggleLyrics]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--mc-player-height',
      waveformEnabled ? '8rem' : '7rem',
    );
  }, [waveformEnabled]);

  if (!currentTrack) return null;

  const hasNext = queueIndex < queue.length - 1 || repeatMode === 'all';
  const hasPrev = queueIndex > 0 || currentTime > 3 || repeatMode === 'all';

  return (
    <div role="region" aria-label="Music player" className="shrink-0 animate-slide-up" style={{ background: 'linear-gradient(to top, var(--mc-player-background), var(--mc-glass-background))', borderTop: '1px solid var(--mc-glass-border)', backdropFilter: 'blur(var(--mc-glass-blur))', WebkitBackdropFilter: 'blur(var(--mc-glass-blur))' }}>
      <div className={`flex items-center px-4 gap-4 transition-[height] duration-200 ${waveformEnabled ? 'h-32' : 'h-28'}`}>
        {/* Left: Track info + Heart */}
        <div className="flex items-center gap-4 shrink-0 w-[260px]">
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
        </div>

        {/* Center: Transport stacked above Waveform/Progress */}
        <div className="flex-1 flex flex-col items-center justify-center gap-1 min-w-0">
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
          <div className="w-full">
            <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} trackId={currentTrack.id} waveformEnabled={waveformEnabled} />
          </div>
        </div>

        {/* Right: Controls + Volume */}
        <div className="flex items-center gap-3 shrink-0 relative">
          <ScrobbleIndicator status={scrobbleStatus} />

          {/* Inline controls — visible at >= 900px */}
          <div className="hidden min-[900px]:flex items-center gap-3">
            <button
              onClick={handleToggleWaveform}
              aria-label={waveformEnabled ? 'Switch to flat progress bar' : 'Switch to waveform'}
              aria-pressed={waveformEnabled}
              className={`flex items-center justify-center transition-colors ${waveformEnabled ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
            >
              <Activity className="w-[18px] h-[18px]" />
            </button>
            <CrossfadePopover getCrossfadeDuration={getCrossfadeDuration} setCrossfadeDuration={setCrossfadeDuration} />
            <div className="relative flex flex-col items-center">
              <button
                ref={eqButtonRef}
                onClick={() => setEqOpen(v => !v)}
                aria-label="Equalizer settings"
                aria-pressed={eqEnabled}
                className={`flex items-center justify-center transition-colors ${eqEnabled ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
              >
                <SlidersHorizontal className="w-[18px] h-[18px]" />
              </button>
              {!eqOpen && eqEnabled && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pointer-events-none">
                  <EqMiniCurve bands={eqBands} enabled={eqEnabled} />
                </div>
              )}
            </div>
            <button
              onClick={handleToggleDeck}
              aria-label={deckVisible ? 'Hide analyzer deck' : 'Show analyzer deck'}
              aria-pressed={deckVisible}
              className={`flex items-center justify-center transition-colors ${deckVisible ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
            >
              <BarChart3 className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => setShowRetroMode(true)}
              aria-label="Retro cassette mode"
              className="flex items-center justify-center transition-colors mc-interactive-warning"
            >
              <CassetteTape className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={handleToggleLyrics}
              aria-label={isLyricsOpen ? 'Hide lyrics' : 'Show lyrics'}
              aria-pressed={isLyricsOpen}
              className={`flex items-center justify-center transition-colors ${isLyricsOpen ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
            >
              <Mic2 className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Collapsed popover — visible at < 900px */}
          <div className="min-[900px]:hidden">
            <MoreControlsPopover
              waveformEnabled={waveformEnabled}
              onToggleWaveform={handleToggleWaveform}
              getCrossfadeDuration={getCrossfadeDuration}
              setCrossfadeDuration={setCrossfadeDuration}
              deckVisible={deckVisible}
              onToggleDeck={handleToggleDeck}
              onOpenCassette={() => setShowRetroMode(true)}
              isLyricsOpen={isLyricsOpen}
              onToggleLyrics={handleToggleLyrics}
              onOpenEq={() => setEqOpen(true)}
            />
          </div>

          <EqPopover open={eqOpen} onOpenChange={setEqOpen} anchorRef={eqButtonRef} onEqEnabledChange={setEqEnabled} onBandsChange={setEqBands} />

          <button
            onClick={handleToggleQueue}
            aria-label={isQueueOpen ? 'Hide queue' : 'Show queue'}
            aria-pressed={isQueueOpen}
            className={`flex items-center justify-center transition-colors ${isQueueOpen ? 'mc-toggle-accent' : 'mc-interactive-muted'}`}
          >
            <ListMusic className="w-[18px] h-[18px]" />
          </button>
          <VolumeControl volume={volume} onVolumeChange={setVolume} />
        </div>
      </div>
      <NowPlayingOverlay open={showNowPlaying} onClose={() => setShowNowPlaying(false)} />
      <RetroMode open={showRetroMode} onClose={() => setShowRetroMode(false)} />
    </div>
  );
}
