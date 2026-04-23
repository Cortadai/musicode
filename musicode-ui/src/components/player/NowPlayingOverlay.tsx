import { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Palette, BarChart3, AudioWaveform, Disc3 } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useDynamicTheme } from '../../hooks/useDynamicTheme';
import { initAudioContext } from '../../hooks/useAudioAnalyser';
import { getCoverUrl } from '../../api/albums';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';
import type { VisualizerMode } from '../../audio/audioPreferences';
import TransportControls from './TransportControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import Visualizer from './Visualizer';

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

  const [showVisualizer, setShowVisualizer] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(() => loadPreferences().visualizerMode);

  // Artwork crossfade state
  const [prevCoverSrc, setPrevCoverSrc] = useState<string | null>(null);
  const [coverFading, setCoverFading] = useState(false);
  const prevTrackIdRef = useRef<number | null>(null);

  const handlePlayPause = useCallback(() => {
    initAudioContext();
    if (isPlaying) pause(); else resume();
  }, [isPlaying, pause, resume]);

  const handleSelectVisualizer = useCallback((mode: VisualizerMode) => {
    initAudioContext();
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

  const bgStyle = dynamicEnabled && colors
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
      {/* Visualizer as full-overlay background */}
      {showVisualizer && (
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
          <Visualizer visible={showVisualizer && open} mode={visualizerMode} onModeChange={handleSelectVisualizer} fullSize hideControls />
        </div>
      )}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-4 pb-2">
        <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Now Playing</span>

        <div className="flex items-center gap-1">
          {([
            { mode: 'bars' as VisualizerMode, Icon: BarChart3, label: 'Bars visualizer' },
            { mode: 'waveform' as VisualizerMode, Icon: AudioWaveform, label: 'Waveform visualizer' },
            { mode: 'circular' as VisualizerMode, Icon: Disc3, label: 'Circular visualizer' },
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
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-6 overflow-hidden">
        {/* Artwork with crossfade */}
        <div
          className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl"
          style={dynamicEnabled && colors ? { boxShadow: `0 20px 60px ${colors.primary}30` } : {}}
        >
          {/* Previous cover (fading out) */}
          {coverFading && prevCoverSrc && (
            <img
              src={prevCoverSrc}
              alt=""
              className="absolute inset-0 w-full h-full object-cover np-cover-exit"
            />
          )}

          {/* Current cover (fading in) */}
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

        {/* Track info */}
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-zinc-100 truncate">{currentTrack.title}</h2>
          <p className="text-sm text-zinc-400 mt-1 truncate">
            {currentTrack.artist?.name ?? 'Unknown Artist'}
            {currentTrack.album?.title ? ` \u2014 ${currentTrack.album.title}` : ''}
          </p>
        </div>

        {/* Progress */}
        <div className="w-full max-w-md">
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
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
          <div className="text-center mb-8">
            <span className="text-[11px] text-zinc-600 uppercase tracking-wider">Up Next</span>
            <p className="text-sm text-zinc-400 truncate max-w-xs">
              {nextTrack.title} \u2014 {nextTrack.artist?.name ?? 'Unknown'}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
