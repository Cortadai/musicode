import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useDeckStore } from './useDeckStore';
import { FFT_SIZES } from './types';
import type { WaveformSpeed, OscilloscopeSpeed } from './types';

interface Props {
  scopeId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

export default function ScopeOptionsPopover({ scopeId, anchorEl, onClose }: Props) {
  const { fftSize, setFFTSize, vectorMode, setVectorMode, vuMode, setVuMode, waveformSpeed, setWaveformSpeed, oscilloscopeSpeed, setOscilloscopeSpeed } = useDeckStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
    });
  }, [anchorEl]);

  useEffect(() => {
    updatePosition();
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        anchorEl && !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', updatePosition);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorEl, onClose, updatePosition]);

  const showFFT = scopeId === 'spectrum' || scopeId === 'spectrogram';
  const showVector = scopeId === 'vectorscope';
  const showVu = scopeId === 'vu';
  const showOscilloscope = scopeId === 'oscilloscope';
  const showWaveform = scopeId === 'waveform';
  if (!showFFT && !showVector && !showVu && !showOscilloscope && !showWaveform) return null;

  return createPortal(
    <div
      ref={panelRef}
      className="scope-options"
      style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
    >
      {showFFT && (
        <div className="scope-options__row">
          <span className="scope-options__label">FFT Size</span>
          <div className="scope-options__fft-list">
            {FFT_SIZES.map((size) => (
              <button
                key={size}
                className={`scope-options__fft-btn${size === fftSize ? ' scope-options__fft-btn--active' : ''}`}
                onClick={() => setFFTSize(size)}
              >
                {size.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}
      {showVector && (
        <div className="scope-options__row">
          <span className="scope-options__label">Mode</span>
          <div className="scope-options__fft-list">
            <button
              className={`scope-options__fft-btn${vectorMode === 'lissajous' ? ' scope-options__fft-btn--active' : ''}`}
              onClick={() => setVectorMode('lissajous')}
            >
              Lissajous
            </button>
            <button
              className={`scope-options__fft-btn${vectorMode === 'polar' ? ' scope-options__fft-btn--active' : ''}`}
              onClick={() => setVectorMode('polar')}
            >
              Polar
            </button>
          </div>
        </div>
      )}
      {showVu && (
        <div className="scope-options__row">
          <span className="scope-options__label">Mode</span>
          <div className="scope-options__fft-list">
            <button
              className={`scope-options__fft-btn${vuMode === 'needle' ? ' scope-options__fft-btn--active' : ''}`}
              onClick={() => setVuMode('needle')}
            >
              Needle
            </button>
            <button
              className={`scope-options__fft-btn${vuMode === 'bars' ? ' scope-options__fft-btn--active' : ''}`}
              onClick={() => setVuMode('bars')}
            >
              Bars
            </button>
          </div>
        </div>
      )}
      {showOscilloscope && (
        <div className="scope-options__row">
          <span className="scope-options__label">Speed</span>
          <div className="scope-options__fft-list">
            {([0.5, 1, 1.5] as OscilloscopeSpeed[]).map((speed) => (
              <button
                key={speed}
                className={`scope-options__fft-btn${oscilloscopeSpeed === speed ? ' scope-options__fft-btn--active' : ''}`}
                onClick={() => setOscilloscopeSpeed(speed)}
              >
                ×{speed}
              </button>
            ))}
          </div>
        </div>
      )}
      {showWaveform && (
        <div className="scope-options__row">
          <span className="scope-options__label">Speed</span>
          <div className="scope-options__fft-list">
            {([0.5, 1, 1.5] as WaveformSpeed[]).map((speed) => (
              <button
                key={speed}
                className={`scope-options__fft-btn${waveformSpeed === speed ? ' scope-options__fft-btn--active' : ''}`}
                onClick={() => setWaveformSpeed(speed)}
              >
                ×{speed}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
