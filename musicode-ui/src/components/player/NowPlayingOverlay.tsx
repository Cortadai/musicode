import { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Palette, BarChart3, AudioWaveform, Disc3, Orbit, ChevronDown, MicVocal, Activity } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useDynamicTheme } from '../../hooks/useDynamicTheme';
import audioGraph from '../../audio/audioGraph';
import { getCoverUrl } from '../../api/albums';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';
import type { VisualizerMode } from '../../audio/audioPreferences';
import TransportControls from './TransportControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import Visualizer from './Visualizer';
import VinylVisualizer from './VinylVisualizer';
import LyricsPanel from './LyricsPanel';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NowPlayingOverlay({ open, onClose }: Props) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    queue, queueIndex, shuffle, repeatMode,
    pause, resume, next, prev, seek, setVolume,
    toggleShuffle, toggleRepeat,
  } = usePlayer();

  const { enabled: dynamicEnabled, toggle: toggleDynamic, colors } = useDynamicTheme();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [showVisualizer, setShowVisualizer] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(() => loadPreferences().visualizerMode);
  const [showLyrics, setShowLyrics] = useState(false);
  const [waveformEnabled, setWaveformEnabled] = useState(() => loadPreferences().waveformEnabled);

  const handleToggleWaveform = useCallback(() => {
    setWaveformEnabled((v) => {
      savePreferences({ waveformEnabled: !v });
      return !v;
    });
  }, []);

  // Artwork crossfade state
  const [prevCoverSrc, setPrevCoverSrc] = useState<string | null>(null);
  const [coverFading, setCoverFading] = useState(false);
  const prevTrackIdRef = useRef<number | null>(null);

  const handlePlayPause = useCallback(() => {
    audioGraph.init();
    if (isPlaying) pause(); else resume();
  }, [isPlaying, pause, resume]);

  const handleSelectVisualizer = useCallback((mode: VisualizerMode) => {
    audioGraph.init();
    if (showVisualizer && visualizerMode === mode) {
      setShowVisualizer(false);
    } else {
      setVisualizerMode(mode);
      setShowVisualizer(true);
      savePreferences({ visualizerMode: mode });
    }
  }, [showVisualizer, visualizerMode]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) overlayRef.current?.focus();
  }, [open]);

  // Artwork crossfade on track change
  useEffect(() => {
    if (!currentTrack || !open) return;

    if (prevTrackIdRef.current !== null && prevTrackIdRef.current !== currentTrack.id) {
      if (prevCoverSrc) {
        setCoverFading(true);
        const timer = setTimeout(() => {
          setCoverFading(false);
          setPrevCoverSrc(null);
        }, 500);
        return () => clearTimeout(timer);
      }
    }

    prevTrackIdRef.current = currentTrack.id;
    const albumId = currentTrack.album?.id;
    const hasCover = currentTrack.album?.hasCoverArt;
    if (hasCover && albumId) {
      setPrevCoverSrc(getCoverUrl(albumId));
    } else {
      setPrevCoverSrc(null);
    }
  }, [currentTrack?.id, open]);

  if (!currentTrack) return null;

  const hasNext = queueIndex < queue.length - 1 || repeatMode === 'all';
  const hasPrev = queueIndex > 0 || currentTime > 3 || repeatMode === 'all';
  const nextTrack = queueIndex < queue.length - 1 ? queue[queueIndex + 1] : null;

  const albumId = currentTrack.album?.id;
  const hasCover = currentTrack.album?.hasCoverArt;
  const coverSrc = hasCover && albumId ? getCoverUrl(albumId) : null;

  const isVinylMode = showVisualizer && visualizerMode === 'vinyl';

  const bgStyle = !isVinylMode && dynamicEnabled && colors
    ? { background: `radial-gradient(ellipse at center, ${colors.primary}18 0%, ${colors.background} 70%) no-repeat, #09090b` }
    : {};

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-label="Now Playing"
      aria-modal="true"
      tabIndex={-1}
      className={`now-playing-overlay ${open ? 'now-playing-open' : 'now-playing-closed'}`}
      style={bgStyle}
    >
      {/* Vinyl blurred cover background */}
      {isVinylMode && coverSrc && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={coverSrc} alt="" className="w-full h-full object-cover scale-125 blur-[50px] opacity-50" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Canvas visualizer as full-overlay background (non-vinyl modes) */}
      {showVisualizer && !isVinylMode && (
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
          <Visualizer visible={showVisualizer && open} mode={visualizerMode} onModeChange={handleSelectVisualizer} fullSize hideControls dynamicColors={dynamicEnabled ? colors : null} />
        </div>
      )}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-4 pb-2">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors group"
        >
          <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
          <span className="text-sm uppercase tracking-wider font-medium flex items-center gap-2">
            Now Playing
            {isPlaying && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </span>
        </button>

        <div className="flex items-center gap-1">
          {([
            { mode: 'vinyl' as VisualizerMode, Icon: Disc3, label: 'Vinyl visualizer' },
            { mode: 'bars' as VisualizerMode, Icon: BarChart3, label: 'Bars visualizer' },
            { mode: 'waveform' as VisualizerMode, Icon: AudioWaveform, label: 'Waveform visualizer' },
            { mode: 'circular' as VisualizerMode, Icon: Orbit, label: 'Circular visualizer' },
          ]).map(({ mode, Icon, label }) => {
            const active = showVisualizer && visualizerMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleSelectVisualizer(mode)}
                aria-label={active ? `Hide ${label}` : label}
                aria-pressed={active}
                className={`p-1.5 rounded transition-colors ${active ? 'text-indigo-400 bg-indigo-400/10 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}

          <div className="w-px h-4 bg-zinc-700 mx-1" />

          <button
            onClick={toggleDynamic}
            aria-label={dynamicEnabled ? 'Disable dynamic colors' : 'Enable dynamic colors'}
            aria-pressed={dynamicEnabled}
            className={`p-1.5 rounded transition-colors ${dynamicEnabled ? 'text-indigo-400 bg-indigo-400/10 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Palette className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleWaveform}
            aria-label={waveformEnabled ? 'Switch to flat progress bar' : 'Switch to waveform'}
            aria-pressed={waveformEnabled}
            className={`p-1.5 rounded transition-colors ${waveformEnabled ? 'text-indigo-400 bg-indigo-400/10 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Activity className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowLyrics(prev => !prev)}
            aria-label={showLyrics ? 'Hide lyrics' : 'Show lyrics'}
            aria-pressed={showLyrics}
            className={`p-1.5 rounded transition-all duration-300 ${showLyrics ? 'text-indigo-400 bg-indigo-400/15 shadow-[0_0_8px_rgba(129,140,248,0.3)] hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MicVocal className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-zinc-700 mx-1" />

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-zinc-400 hover:text-zinc-100 transition-colors p-1.5 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden pb-6 grid transition-[grid-template-columns] duration-300 ease-out"
        style={{ gridTemplateColumns: showLyrics ? '1fr 1fr' : '1fr 0fr' }}
      >
        {/* Left side (or full width when lyrics hidden) */}
        <div className={`flex flex-col items-center justify-center gap-3 ${showLyrics ? 'px-4' : 'px-8'}`}>
          {/* Artwork — vinyl mode or standard crossfade */}
          {isVinylMode ? (
            <VinylVisualizer key={currentTrack.id} coverSrc={coverSrc} isPlaying={isPlaying} />
          ) : (
            <div
              className={`relative rounded-2xl overflow-hidden shadow-2xl ${
                showLyrics
                  ? 'w-48 h-48 md:w-56 md:h-56 lg:w-72 lg:h-72'
                  : 'w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96'
              }`}
              style={dynamicEnabled && colors ? { boxShadow: `0 20px 60px ${colors.primary}30` } : {}}
            >
              {coverFading && prevCoverSrc && (
                <img
                  src={prevCoverSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover np-cover-exit"
                />
              )}

              {coverSrc ? (
                <img
                  src={coverSrc}
                  alt={`${currentTrack.album?.title} cover`}
                  className={`w-full h-full object-cover ${coverFading ? 'np-cover-enter' : ''}`}
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-6xl text-zinc-600">&#9835;</span>
                </div>
              )}
            </div>
          )}

          {/* Track info */}
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold text-zinc-100 truncate">{currentTrack.title}</h2>
            <p className="text-sm text-zinc-400 mt-0.5 truncate">
              {currentTrack.artist?.name ?? 'Unknown Artist'}
              {currentTrack.album?.title ? ` \u2014 ${currentTrack.album.title}` : ''}
            </p>
          </div>

          {/* Progress */}
          <div className={`w-full ${showLyrics ? 'max-w-sm' : 'max-w-md'}`}>
            <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} trackId={currentTrack.id} waveformEnabled={waveformEnabled} />
          </div>

          {/* Transport */}
          <div className="flex items-center gap-4">
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
          </div>

          {/* Volume */}
          <div className="flex items-center justify-center gap-2">
            <VolumeControl volume={volume} onVolumeChange={setVolume} />
            <div className="w-4" aria-hidden="true" />
          </div>

          {/* Up Next */}
          {nextTrack && (
            <div className="text-center mt-1">
              <span className="text-[11px] text-zinc-600 uppercase tracking-wider">Up Next</span>
              <p className="text-sm text-zinc-400 truncate max-w-xs mx-auto">
                {nextTrack.title} {'\u2014'} {nextTrack.artist?.name ?? 'Unknown'}
              </p>
            </div>
          )}
        </div>

        {/* Right side — Lyrics panel */}
        <div className={`border-l border-zinc-800/50 min-h-0 overflow-hidden transition-opacity duration-300 ${
          showLyrics ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {showLyrics && (
            <LyricsPanel trackId={currentTrack.id} currentTime={currentTime} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
