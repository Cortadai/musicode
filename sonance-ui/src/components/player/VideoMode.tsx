import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronLeft, ChevronRight, SkipBack, Play, Pause, SkipForward } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { listVideos } from '../../api/videoFolders';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import audioGraph from '../../audio/audioGraph';

interface Props {
  open: boolean;
  onClose: () => void;
}

const VIDEO_STATE_KEY = 'sonance-video-state';

interface VideoState {
  videos: string[];
  idx: number;
}

function loadVideoState(): VideoState | null {
  try {
    const raw = localStorage.getItem(VIDEO_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.videos) && typeof parsed.idx === 'number') return parsed as VideoState;
  } catch { /* ignore */ }
  return null;
}

function saveVideoState(videos: string[], idx: number) {
  try {
    localStorage.setItem(VIDEO_STATE_KEY, JSON.stringify({ videos, idx }));
  } catch { /* ignore */ }
}

function getVideoStreamUrl(filename: string) {
  return `/api/videos/stream/${encodeURIComponent(filename)}`;
}

export default function VideoMode({ open, onClose }: Props) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    queue, queueIndex, repeatMode,
    pause, resume, next, prev, seek, setVolume,
  } = usePlayer();

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleVideoEnded = useCallback(() => {
    if (videos.length > 1) {
      setCurrentVideoIdx(i => {
        const next = (i + 1) % videos.length;
        saveVideoState(videos, next);
        return next;
      });
    }
  }, [videos]);

  const handleNextVideo = useCallback(() => {
    if (videos.length > 1) {
      setCurrentVideoIdx(i => {
        const next = (i + 1) % videos.length;
        saveVideoState(videos, next);
        return next;
      });
    }
  }, [videos]);

  const handlePrevVideo = useCallback(() => {
    if (videos.length > 1) {
      setCurrentVideoIdx(i => {
        const prev = (i - 1 + videos.length) % videos.length;
        saveVideoState(videos, prev);
        return prev;
      });
    }
  }, [videos]);

  const handlePlayPause = useCallback(() => {
    audioGraph.init();
    if (isPlaying) pause(); else resume();
  }, [isPlaying, pause, resume]);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    if (!open) return;
    listVideos().then(list => {
      if (list.length === 0) return;
      const saved = loadVideoState();
      if (saved && saved.videos.length > 0 && saved.videos.every(v => list.includes(v))) {
        setVideos(saved.videos);
        setCurrentVideoIdx(saved.idx < saved.videos.length ? saved.idx : 0);
      } else {
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setVideos(shuffled);
        setCurrentVideoIdx(0);
        saveVideoState(shuffled, 0);
      }
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'ArrowRight' && e.shiftKey) { e.preventDefault(); handleNextVideo(); }
      if (e.key === 'ArrowLeft' && e.shiftKey) { e.preventDefault(); handlePrevVideo(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose, handleNextVideo, handlePrevVideo]);

  useEffect(() => {
    if (open) overlayRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const fn = window.electronAPI?.setTitleBarOverlayVisible;
    if (!fn) return;
    fn(!open);
    return () => { fn(true); };
  }, [open]);

  useEffect(() => {
    if (open) showControls();
    return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); };
  }, [open, showControls]);

  if (!open || !currentTrack) return null;

  const hasNext = queueIndex < queue.length - 1 || repeatMode === 'all';
  const hasPrev = queueIndex > 0 || currentTime > 3 || repeatMode === 'all';
  const currentVideo = videos[currentVideoIdx];

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-label="Video Mode"
      aria-modal="true"
      tabIndex={-1}
      className={`video-mode-overlay ${open ? 'now-playing-open' : 'now-playing-closed'} ${!controlsVisible ? 'video-mode-idle' : ''}`}
      onMouseMove={showControls}
      onClick={showControls}
    >
      {/* Fullscreen video background */}
      {currentVideo && (
        <video
          ref={videoRef}
          key={currentVideo}
          src={getVideoStreamUrl(currentVideo)}
          autoPlay
          muted
          loop={videos.length === 1}
          onEnded={handleVideoEnded}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark vignette overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Top bar — minimal, fades with controls */}
      <div className={`video-mode-controls absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
          <span className="text-sm uppercase tracking-wider font-medium">Video Mode</span>
        </button>

        {videos.length > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevVideo}
              aria-label="Previous video"
              className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white/40 text-xs tabular-nums">
              {currentVideoIdx + 1} / {videos.length}
            </span>
            <button
              onClick={handleNextVideo}
              aria-label="Next video"
              className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom floating bar — Layout A (cinematic bottom) */}
      <div className={`absolute bottom-0 left-0 right-0 z-10 transition-opacity duration-300 ${controlsVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="px-8 pb-8 pt-4">
          {/* Progress bar */}
          <div className="mb-4">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
              trackId={currentTrack.id}
              waveformEnabled={false}
            />
          </div>

          {/* Track info + Transport + Volume */}
          <div className="flex items-center gap-6">
            {/* Track info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-white truncate">{currentTrack.title}</h2>
              <p className="text-sm text-white/60 truncate">
                {currentTrack.artist?.name ?? 'Unknown Artist'}
                {currentTrack.album?.title ? ` — ${currentTrack.album.title}` : ''}
              </p>
            </div>

            {/* Transport controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                disabled={!hasPrev}
                className="text-white/70 hover:text-white disabled:text-white/30 transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={handlePlayPause}
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>
              <button
                onClick={next}
                disabled={!hasNext}
                className="text-white/70 hover:text-white disabled:text-white/30 transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center">
              <VolumeControl volume={volume} onVolumeChange={setVolume} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
