import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { getCoverUrl } from '../../api/albums';
import CassetteCanvas from './cassette/CassetteCanvas';
import VUMeter from './cassette/VUMeter';
import Odometer from './cassette/Odometer';
import DeckTransport from './cassette/DeckTransport';
import DeckLEDs from './cassette/DeckLEDs';
import DeckThemeToggle, { type DeckThemeId } from './cassette/DeckThemeToggle';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import audioGraph from '../../audio/audioGraph';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function RetroMode({ open, onClose }: Props) {
  const {
    currentTrack, isPlaying, currentTime, duration, volume,
    queue, queueIndex, repeatMode,
    pause, resume, next, prev, seek, setVolume,
  } = usePlayer();

  const [deckTheme, setDeckTheme] = useState<DeckThemeId>('classic');
  const shellRef = useRef<HTMLDivElement>(null);

  const THEME_ORDER: DeckThemeId[] = ['classic', 'indigo', 'synthwave'];
  const toggleTheme = useCallback(() => {
    setDeckTheme(t => THEME_ORDER[(THEME_ORDER.indexOf(t) + 1) % THEME_ORDER.length]);
  }, []);

  const handlePlayPause = useCallback(() => {
    audioGraph.init();
    if (isPlaying) pause(); else resume();
  }, [isPlaying, pause, resume]);

  const handleStop = useCallback(() => {
    if (isPlaying) pause();
    seek(0);
  }, [isPlaying, pause, seek]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) shellRef.current?.focus();
  }, [open]);

  if (!open || !currentTrack) return null;

  const hasNext = queueIndex < queue.length - 1 || repeatMode === 'all';
  const hasPrev = queueIndex > 0 || currentTime > 3 || repeatMode === 'all';
  const synth = deckTheme === 'synthwave';
  const indigo = deckTheme === 'indigo';

  const albumId = currentTrack.album?.id;
  const hasCover = currentTrack.album?.hasCoverArt ?? false;
  const coverUrl = hasCover && albumId ? getCoverUrl(albumId) : undefined;

  // Theme-aware color helpers
  const bg = synth ? '#0a0614' : indigo ? '#09090b' : '#09090b';
  const housingBg = synth
    ? 'linear-gradient(180deg, #1a1030 0%, #120c24 40%, #0e0818 100%)'
    : indigo
      ? 'linear-gradient(180deg, #18181b 0%, #111113 40%, #09090b 100%)'
      : 'linear-gradient(180deg, #1e1c18 0%, #161412 40%, #121110 100%)';
  const housingBorder = synth ? '#2d1f5e' : indigo ? '#27272a' : '#2a2825';
  const housingShadow = synth
    ? '0 8px 32px rgba(88,28,135,0.3), inset 0 1px 0 rgba(139,92,246,0.05)'
    : indigo
      ? '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(99,102,241,0.04)'
      : '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)';
  const vuBg = synth
    ? 'linear-gradient(180deg, #0c0820 0%, #100a28 100%)'
    : indigo
      ? 'linear-gradient(180deg, #0f0f12 0%, #121215 100%)'
      : 'linear-gradient(180deg, #0e0d0b 0%, #141310 100%)';
  const vuBorder = synth ? '#2d1f5e' : indigo ? '#27272a' : '#2a2825';
  const vuShadow = synth
    ? 'inset 0 2px 6px rgba(88,28,135,0.3), inset 0 -1px 0 rgba(139,92,246,0.03)'
    : indigo
      ? 'inset 0 2px 6px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(99,102,241,0.03)'
      : 'inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(255,255,255,0.02)';
  const wellBg = synth ? '#080418' : indigo ? '#0a0a0c' : '#0c0b09';
  const wellBorder = synth ? '#1e1445' : indigo ? '#1e1e22' : '#222';
  const wellShadow = synth
    ? 'inset 0 2px 8px rgba(88,28,135,0.3)'
    : indigo
      ? 'inset 0 2px 8px rgba(0,0,0,0.6)'
      : 'inset 0 2px 8px rgba(0,0,0,0.7)';
  const divider = synth
    ? 'linear-gradient(90deg, transparent, #4c1d95 20%, #7c3aed 50%, #4c1d95 80%, transparent)'
    : indigo
      ? 'linear-gradient(90deg, transparent, #3f3f46 20%, #6366f1 50%, #3f3f46 80%, transparent)'
      : 'linear-gradient(90deg, transparent, #3a3530 20%, #4a4540 50%, #3a3530 80%, transparent)';
  const counterLabel = synth ? '#7c3aed80' : indigo ? '#6366f180' : '#71717a';
  const progBg = synth ? 'rgba(139,92,246,0.08)' : indigo ? 'rgba(99,102,241,0.08)' : 'transparent';
  const progBorder = synth ? '1px solid rgba(139,92,246,0.12)' : indigo ? '1px solid rgba(99,102,241,0.12)' : 'none';
  const brandPrimary = synth ? '#a78bfa' : indigo ? '#818cf8' : '#71717a';
  const brandSecondary = synth ? '#7c3aed80' : indigo ? '#6366f180' : '#52525b';

  return createPortal(
    <div
      ref={shellRef}
      role="dialog"
      aria-label="Retro Mode"
      aria-modal="true"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ animation: 'retro-fade-in 0.3s ease-out', background: bg }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close retro mode"
        className="absolute top-4 right-4 z-20 text-zinc-500 hover:text-zinc-300 transition-colors p-2"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Theme toggle */}
      <div className="absolute top-4 left-4 z-20">
        <DeckThemeToggle theme={deckTheme} onToggle={toggleTheme} />
      </div>

      {/* Deck housing */}
      <div
        className="relative flex flex-col items-center w-full max-w-3xl mx-auto px-6"
        style={{
          background: housingBg,
          border: `1px solid ${housingBorder}`,
          borderRadius: '12px',
          boxShadow: housingShadow,
          padding: '14px 24px 16px',
        }}
      >
        {/* Scanlines overlay (synthwave only) */}
        {synth && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none z-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
              mixBlendMode: 'multiply',
            }}
          />
        )}

        {/* Top row: LEDs + Odometer */}
        <div className="w-full flex items-center justify-between mb-2 relative z-20">
          <DeckLEDs isPlaying={isPlaying} theme={deckTheme} />
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[9px] tracking-widest uppercase"
              style={{ color: counterLabel }}
            >
              Counter
            </span>
            <Odometer seconds={currentTime} theme={deckTheme} />
          </div>
        </div>

        {/* VU Meters — recessed panel housing */}
        <div
          className="w-full flex justify-center mb-2 relative z-20"
          style={{
            background: vuBg,
            border: `1px solid ${vuBorder}`,
            borderRadius: '5px',
            boxShadow: vuShadow,
            padding: '8px 12px 6px',
          }}
        >
          <VUMeter isPlaying={isPlaying} width={380} height={120} theme={deckTheme} />
        </div>

        {/* Cassette well — recessed with dark border */}
        <div
          className="w-full flex justify-center mb-1.5 relative z-20"
          style={{
            background: wellBg,
            border: `1px solid ${wellBorder}`,
            borderRadius: '5px',
            boxShadow: wellShadow,
            padding: '6px',
            maxWidth: '460px',
            alignSelf: 'center',
          }}
        >
          <div className="w-full" style={{ maxWidth: '440px' }}>
            <CassetteCanvas
              trackTitle={currentTrack.title}
              artistName={currentTrack.artist?.name ?? 'Unknown Artist'}
              albumTitle={currentTrack.album?.title ?? ''}
              coverUrl={coverUrl}
              progress={duration > 0 ? currentTime / duration : 0}
              isPlaying={isPlaying}
              theme={deckTheme}
            />
          </div>
        </div>

        {/* Horizontal divider — brushed metal stripe */}
        <div
          className="w-full my-1.5 relative z-20"
          style={{ height: '1px', background: divider }}
        />

        {/* Progress bar */}
        <div
          className="w-full max-w-sm mb-1.5 relative z-20 rounded px-2 py-1"
          style={{ background: progBg, border: progBorder }}
        >
          <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} trackId={currentTrack.id} waveformEnabled={false} />
        </div>

        {/* Transport controls */}
        <div className="flex items-center justify-center mb-1.5 relative z-20">
          <DeckTransport
            isPlaying={isPlaying}
            hasPrev={hasPrev}
            hasNext={hasNext}
            onPlayPause={handlePlayPause}
            onPrev={prev}
            onNext={next}
            onStop={handleStop}
            theme={deckTheme}
          />
        </div>

        {/* Volume */}
        <div className="flex items-center justify-center gap-2 w-full max-w-[200px] relative z-20">
          <VolumeControl volume={volume} onVolumeChange={setVolume} />
        </div>

        {/* Bottom brand strip */}
        <div
          className="w-full mt-2 flex items-center justify-between relative z-20"
          style={{ borderTop: `1px solid ${housingBorder}`, paddingTop: '8px' }}
        >
          <span
            className="font-mono text-[10px] tracking-[0.25em] font-bold"
            style={{ color: brandPrimary }}
          >
            MUSICODE
          </span>
          <span
            className="font-mono text-[9px] tracking-[0.15em]"
            style={{ color: brandSecondary }}
          >
            STEREO CASSETTE DECK
          </span>
          <span
            className="font-mono text-[9px] tracking-widest"
            style={{ color: brandSecondary }}
          >
            HI-FI
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
}
