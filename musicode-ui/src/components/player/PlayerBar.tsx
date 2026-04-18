import { usePlayer } from '../../hooks/usePlayer';
import { initAudioContext } from '../../hooks/useAudioAnalyser';
import { getCoverUrl } from '../../api/albums';
import { formatDuration } from '../../utils/format';
import Visualizer from './Visualizer';
import { Link } from 'react-router';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Disc3,
  Shuffle, Repeat, Repeat1,
  BarChart3, Blend, SlidersHorizontal,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import eqProcessor, { EQ_PRESETS, GAIN_MIN, GAIN_MAX, BAND_COUNT } from '../../audio/eqProcessor';
import { loadPreferences, savePreferences } from '../../audio/audioPreferences';

export default function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    queueIndex,
    shuffle,
    repeatMode,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    setCrossfadeDuration,
    getCrossfadeDuration,
  } = usePlayer();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showCrossfade, setShowCrossfade] = useState(false);
  const [crossfadeValue, setCrossfadeValue] = useState(() => getCrossfadeDuration());
  const crossfadePopoverRef = useRef<HTMLDivElement>(null);

  // EQ state — initialized from saved preferences
  const [showEq, setShowEq] = useState(false);
  const [eqEnabled, setEqEnabled] = useState(() => loadPreferences().eqEnabled);
  const [eqBands, setEqBands] = useState<number[]>(() => loadPreferences().eqBands);
  const [eqPreset, setEqPreset] = useState(() => loadPreferences().eqPreset);
  const eqPopoverRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || duration === 0) return;
      const rect = progressRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seek(ratio * duration);
    },
    [duration, seek]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setVolume(ratio);
    },
    [setVolume]
  );

  /**
   * Play/resume with AudioContext initialization.
   * The AudioContext must be created/resumed on a user gesture (click).
   * We piggyback on the play button — the most natural user gesture.
   */
  const handlePlayPause = useCallback(() => {
    initAudioContext();
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isPlaying, pause, resume]);

  const handleToggleVisualizer = useCallback(() => {
    initAudioContext();
    setShowVisualizer((v) => !v);
  }, []);

  const handleCrossfadeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      setCrossfadeValue(val);
      setCrossfadeDuration(val);
    },
    [setCrossfadeDuration]
  );

  // Apply saved EQ state on mount — values are stored immediately and applied
  // to filter nodes when audioGraph.init() creates them on first user gesture
  useEffect(() => {
    eqProcessor.setAllGains(eqBands);
    eqProcessor.setEnabled(eqEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleEqToggle = useCallback(() => {
    const next = !eqEnabled;
    setEqEnabled(next);
    eqProcessor.setEnabled(next);
    savePreferences({ eqEnabled: next });
  }, [eqEnabled]);

  const handleEqBandChange = useCallback(
    (bandIndex: number, value: number) => {
      const newBands = [...eqBands];
      newBands[bandIndex] = value;
      setEqBands(newBands);
      eqProcessor.setGain(bandIndex, value);
      const preset = eqProcessor.getPreset();
      setEqPreset(preset);
      savePreferences({ eqBands: newBands, eqPreset: preset });
    },
    [eqBands]
  );

  const handleEqPresetChange = useCallback(
    (presetName: string) => {
      const preset = EQ_PRESETS.find((p) => p.name === presetName);
      if (!preset) return;
      setEqPreset(presetName);
      setEqBands([...preset.gains]);
      eqProcessor.applyPreset(presetName);
      savePreferences({ eqBands: [...preset.gains], eqPreset: presetName });
    },
    []
  );

  // Close EQ popover when clicking outside
  useEffect(() => {
    if (!showEq) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (eqPopoverRef.current && !eqPopoverRef.current.contains(e.target as Node)) {
        setShowEq(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEq]);

  // Close crossfade popover when clicking outside
  useEffect(() => {
    if (!showCrossfade) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (crossfadePopoverRef.current && !crossfadePopoverRef.current.contains(e.target as Node)) {
        setShowCrossfade(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCrossfade]);

  if (!currentTrack) return null;

  const albumId = currentTrack.album?.id;
  const hasCover = currentTrack.album?.hasCoverArt;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasNext = queueIndex < queue.length - 1 || repeatMode === 'all';
  const hasPrev = queueIndex > 0 || currentTime > 3 || repeatMode === 'all';

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <div className="bg-zinc-900 border-t border-zinc-800 shrink-0 animate-slide-up">
      {/* Visualizer — above the player controls */}
      <Visualizer visible={showVisualizer} />

      <div className="h-20 flex items-center px-4 gap-4">
        {/* Track info — cover sleeve + vinyl disc */}
        <div className="flex items-center gap-3 w-60 shrink-0">
          <div className="relative shrink-0" style={{ width: 84, height: 56 }}>
            {/* Vinyl disc — behind the sleeve */}
            <div
              className="absolute rounded-full transition-transform duration-500 ease-out"
              style={{
                width: 48,
                height: 48,
                top: 4,
                left: 4,
                transform: isPlaying ? 'translateX(28px)' : 'translateX(0px)',
                zIndex: 0,
              }}
            >
              <div
                className="w-full h-full rounded-full overflow-hidden vinyl-disc"
                style={{
                  animation: 'spin 8s linear infinite',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
              >
                {/* Black vinyl body */}
                <div className="w-full h-full bg-zinc-950" />
                {/* Vinyl grooves overlay */}
                <div className="absolute inset-0 vinyl-grooves" />
                {/* Center label with album art */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full overflow-hidden ring-1 ring-zinc-700">
                  {hasCover && albumId ? (
                    <img
                      src={getCoverUrl(albumId)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
                  )}
                  {/* Center hole */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-zinc-900 ring-1 ring-zinc-700" />
                </div>
              </div>
            </div>

            {/* Cover sleeve — square, on top */}
            <Link
              to={albumId ? `/albums/${albumId}` : '#'}
              className="absolute top-0 left-0 rounded-lg overflow-hidden bg-zinc-800 shadow-md hover:ring-2 hover:ring-indigo-500/50 transition-all"
              style={{ width: 56, height: 56, zIndex: 1 }}
              title="Go to album"
            >
              {hasCover && albumId ? (
                <img
                  src={getCoverUrl(albumId)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Disc3 className="w-7 h-7 text-zinc-600" />
                </div>
              )}
            </Link>
          </div>
          <div className="min-w-0">
            <Link
              to={albumId ? `/albums/${albumId}` : '#'}
              className="text-sm font-medium text-zinc-100 truncate block hover:text-indigo-400 transition-colors"
              title="Go to album"
            >
              {currentTrack.title}
            </Link>
            <p className="text-xs text-zinc-500 truncate">
              {currentTrack.artist?.name ?? 'Unknown'}
            </p>
          </div>
        </div>

        {/* Controls + progress */}
        <div className="flex-1 flex flex-col items-center gap-1 max-w-2xl mx-auto">
          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleShuffle}
              className={`transition-colors ${shuffle ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title={shuffle ? 'Shuffle on' : 'Shuffle off'}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={prev}
              disabled={!hasPrev}
              className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-900 hover:bg-white transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={next}
              disabled={!hasNext}
              className="text-zinc-400 hover:text-zinc-100 disabled:text-zinc-700 transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`transition-colors ${repeatMode !== 'off' ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title={`Repeat: ${repeatMode}`}
            >
              <RepeatIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-[11px] text-zinc-500 tabular-nums w-10 text-right">
              {formatDuration(Math.floor(currentTime))}
            </span>
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="flex-1 h-1 bg-zinc-700 rounded-full cursor-pointer group relative"
            >
              <div
                className="h-full bg-zinc-100 rounded-full group-hover:bg-indigo-400 transition-colors relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" />
              </div>
            </div>
            <span className="text-[11px] text-zinc-500 tabular-nums w-10">
              {formatDuration(Math.floor(duration))}
            </span>
          </div>
        </div>

        {/* Volume + Crossfade + Visualizer toggle */}
        <div className="flex items-center gap-2 w-48 shrink-0 justify-end">
          {/* Crossfade popover */}
          <div className="relative flex items-center" ref={crossfadePopoverRef}>
            <button
              onClick={() => setShowCrossfade((v) => !v)}
              className={`flex items-center justify-center transition-colors ${crossfadeValue > 0 ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title={crossfadeValue === 0 ? 'Crossfade: Gapless' : `Crossfade: ${crossfadeValue}s`}
            >
              <Blend className="w-4 h-4" />
            </button>
            {showCrossfade && (
              <div className="absolute bottom-8 right-0 bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl z-50 w-48">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400">Crossfade</span>
                  <span className="text-xs font-medium text-zinc-200">
                    {crossfadeValue === 0 ? 'Gapless' : `${crossfadeValue}s`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={crossfadeValue}
                  onChange={handleCrossfadeChange}
                  className="w-full h-1 bg-zinc-600 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-zinc-500">0s</span>
                  <span className="text-[10px] text-zinc-500">12s</span>
                </div>
              </div>
            )}
          </div>
          {/* EQ popover */}
          <div className="relative flex items-center" ref={eqPopoverRef}>
            <button
              onClick={() => setShowEq((v) => !v)}
              className={`flex items-center justify-center transition-colors ${eqEnabled ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
              title={eqEnabled ? `EQ: ${eqPreset}` : 'EQ: Off'}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {showEq && (
              <div className="absolute bottom-8 right-0 bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-xl z-50 w-64">
                {/* Header: toggle + preset selector */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Equalizer</span>
                    <button
                      onClick={handleEqToggle}
                      className={`w-8 h-4 rounded-full transition-colors relative ${eqEnabled ? 'bg-indigo-500' : 'bg-zinc-600'}`}
                    >
                      <span
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${eqEnabled ? 'left-4' : 'left-0.5'}`}
                      />
                    </button>
                  </div>
                  <select
                    value={eqPreset}
                    onChange={(e) => handleEqPresetChange(e.target.value)}
                    className="text-[11px] bg-zinc-700 text-zinc-300 border border-zinc-600 rounded px-1.5 py-0.5 outline-none focus:border-indigo-500"
                  >
                    {EQ_PRESETS.map((p) => (
                      <option key={p.name} value={p.name}>{p.label}</option>
                    ))}
                    {eqPreset === 'custom' && (
                      <option value="custom">Custom</option>
                    )}
                  </select>
                </div>

                {/* 5-band vertical sliders */}
                <div className="flex items-end justify-between gap-1 h-28">
                  {eqProcessor.BAND_DEFS.map((band, i) => (
                    <div key={band.frequency} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[10px] text-zinc-500 tabular-nums">
                        {eqBands[i] > 0 ? '+' : ''}{eqBands[i]}
                      </span>
                      <input
                        type="range"
                        min={GAIN_MIN}
                        max={GAIN_MAX}
                        step={1}
                        value={eqBands[i]}
                        onChange={(e) => handleEqBandChange(i, Number(e.target.value))}
                        disabled={!eqEnabled}
                        className="eq-slider appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40"
                        style={{
                          writingMode: 'vertical-lr',
                          direction: 'rtl',
                          height: '80px',
                          width: '20px',
                        }}
                      />
                      <span className="text-[10px] text-zinc-500">{band.label}</span>
                    </div>
                  ))}
                </div>

                {/* dB range labels */}
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-zinc-600">-12 dB</span>
                  <span className="text-[9px] text-zinc-600">+12 dB</span>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleToggleVisualizer}
            className={`flex items-center justify-center transition-colors ${showVisualizer ? 'text-indigo-400 hover:text-indigo-300' : 'text-zinc-500 hover:text-zinc-300'}`}
            title={showVisualizer ? 'Hide visualizer' : 'Show visualizer'}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <div
            ref={volumeRef}
            onClick={handleVolumeClick}
            className="w-20 h-1 bg-zinc-700 rounded-full cursor-pointer group"
          >
            <div
              className="h-full bg-zinc-400 rounded-full group-hover:bg-zinc-200 transition-colors"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
