import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
import audioGraph from '../../audio/audioGraph';
import { useCurrentTrackInfo } from '../../context/PlayerContext';
import type { VisualizerMode } from '../../audio/audioPreferences';
import type { ColorPalette } from '../../audio/colorExtraction';
import { BarChart3, AudioWaveform, Disc3 } from 'lucide-react';
import { useTheme } from '../../themes/useTheme';

interface Props {
  visible: boolean;
  mode: VisualizerMode;
  onModeChange: (mode: VisualizerMode) => void;
  fullSize?: boolean;
  hideControls?: boolean;
  dynamicColors?: ColorPalette | null;
}

const MODE_ICONS: { mode: VisualizerMode; Icon: typeof BarChart3; label: string }[] = [
  { mode: 'bars', Icon: BarChart3, label: 'Bars' },
  { mode: 'waveform', Icon: AudioWaveform, label: 'Waveform' },
  { mode: 'circular', Icon: Disc3, label: 'Circular' },
];

/** Smoothing factor for waveform — lower = smoother/slower (0..1) */
const WAVEFORM_SMOOTHING = 0.25;

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Real-time audio visualizer with 3 modes: frequency bars, waveform, and circular.
 *
 * Uses Web Audio API AnalyserNode + Canvas 2D. Pauses rendering when not visible,
 * not playing, or page is hidden.
 */
export default function Visualizer({ visible, mode, onModeChange, fullSize, hideControls, dynamicColors }: Props) {
  const { theme } = useTheme();
  const defaults = useMemo(() => {
    const accent = theme.tokens.accentPrimary;
    const accentHover = theme.tokens.accentPrimaryHover;
    const hsl = hexToHsl(accent);
    return {
      hue: hsl.h,
      sat: hsl.s,
      hex: accent,
      rgba: hexToRgba(accent, 1).replace(/, 1\)$/, ','),
      glow: hexToRgba(accentHover, 1).replace(/, 1\)$/, ','),
    };
  }, [theme.tokens.accentPrimary, theme.tokens.accentPrimaryHover]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(audioGraph.getAnalyser());

  useEffect(() => {
    if (analyser) return;
    const interval = setInterval(() => {
      const node = audioGraph.getAnalyser();
      if (node) { setAnalyser(node); clearInterval(interval); }
    }, 200);
    return () => clearInterval(interval);
  }, [analyser]);
  const { isPlaying } = useCurrentTrackInfo();

  // Waveform smoothing — keeps previous frame data for temporal interpolation
  const prevWaveformRef = useRef<Float32Array | null>(null);

  // Fade-out decay when playback stops (1.0 = full, 0.0 = cleared)
  const decayRef = useRef(0);

  // --- Drawing functions ---

  const drawBars = useCallback(
    (ctx: CanvasRenderingContext2D, analyserNode: AnalyserNode, width: number, height: number) => {
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const usableBins = Math.floor(bufferLength * 0.6);
      const barWidth = width / usableBins;
      const gap = 1;

      const hsl = dynamicColors ? hexToHsl(dynamicColors.primary) : null;
      const hue = hsl?.h ?? defaults.hue;
      const saturation = hsl?.s ?? defaults.sat;

      for (let i = 0; i < usableBins; i++) {
        const value = dataArray[i] / 255;
        const barHeight = value * height;
        const lightness = 40 + value * 30;
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.6 + value * 0.4})`;
        ctx.fillRect(i * barWidth + gap / 2, height - barHeight, barWidth - gap, barHeight);
      }
    },
    [dynamicColors]
  );

  const drawWaveform = useCallback(
    (ctx: CanvasRenderingContext2D, analyserNode: AnalyserNode, width: number, height: number) => {
      const bufferLength = analyserNode.frequencyBinCount;
      const rawData = new Uint8Array(bufferLength);
      analyserNode.getByteTimeDomainData(rawData);

      // Convert to float and apply temporal smoothing against previous frame
      let smoothed: Float32Array;
      if (prevWaveformRef.current && prevWaveformRef.current.length === bufferLength) {
        smoothed = new Float32Array(bufferLength);
        for (let i = 0; i < bufferLength; i++) {
          const current = rawData[i] / 128.0 - 1.0;
          smoothed[i] =
            prevWaveformRef.current[i] * (1 - WAVEFORM_SMOOTHING) +
            current * WAVEFORM_SMOOTHING;
        }
      } else {
        smoothed = new Float32Array(bufferLength);
        for (let i = 0; i < bufferLength; i++) {
          smoothed[i] = rawData[i] / 128.0 - 1.0;
        }
      }
      prevWaveformRef.current = smoothed;

      ctx.clearRect(0, 0, width, height);

      const mainColor = dynamicColors?.primary ?? defaults.hex;
      const glowColor = dynamicColors ? hexToRgba(dynamicColors.primary, 0.15) : `${defaults.rgba} 0.15)`;

      // Main line
      ctx.lineWidth = 2;
      ctx.strokeStyle = mainColor;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const y = (1 - smoothed[i]) * height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Subtle glow effect
      ctx.lineWidth = 6;
      ctx.strokeStyle = glowColor;
      ctx.beginPath();
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const y = (1 - smoothed[i]) * height / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    },
    [dynamicColors]
  );

  const drawCircular = useCallback(
    (ctx: CanvasRenderingContext2D, analyserNode: AnalyserNode, width: number, height: number) => {
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const minDim = Math.min(width, height);
      const innerRadius = minDim * 0.15;
      const maxBarLength = minDim * 0.32;

      // Use fewer bars for cleaner look — group frequency bins
      const barCount = 64;
      const usableBins = Math.floor(bufferLength * 0.6);
      const binsPerBar = Math.floor(usableBins / barCount);

      const hsl = dynamicColors ? hexToHsl(dynamicColors.primary) : null;
      const hue = hsl?.h ?? defaults.hue;
      const saturation = hsl?.s ?? defaults.sat;

      for (let i = 0; i < barCount; i++) {
        // Average the frequency bins for this bar
        let sum = 0;
        for (let j = 0; j < binsPerBar; j++) {
          sum += dataArray[i * binsPerBar + j];
        }
        const value = sum / (binsPerBar * 255);

        const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2; // start from top
        const barLength = value * maxBarLength + 2; // minimum 2px so circle shape is visible

        const x1 = centerX + Math.cos(angle) * innerRadius;
        const y1 = centerY + Math.sin(angle) * innerRadius;
        const x2 = centerX + Math.cos(angle) * (innerRadius + barLength);
        const y2 = centerY + Math.sin(angle) * (innerRadius + barLength);

        const lightness = 40 + value * 35;
        const alpha = 0.5 + value * 0.5;
        ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.lineWidth = Math.max(1.5, (Math.PI * 2 * innerRadius) / barCount * 0.6);
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Inner circle glow
      const glowInner = dynamicColors ? hexToRgba(dynamicColors.secondary, 0.08) : `${defaults.glow} 0.08)`;
      const glowOuter = dynamicColors ? hexToRgba(dynamicColors.secondary, 0) : `${defaults.glow} 0)`;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, innerRadius * 0.5,
        centerX, centerY, innerRadius
      );
      gradient.addColorStop(0, glowInner);
      gradient.addColorStop(1, glowOuter);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.fill();
    },
    [dynamicColors]
  );

  // Main render loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    switch (mode) {
      case 'bars':
        drawBars(ctx, analyser, width, height);
        break;
      case 'waveform':
        drawWaveform(ctx, analyser, width, height);
        break;
      case 'circular':
        drawCircular(ctx, analyser, width, height);
        break;
    }

    ctx.restore();
    animationRef.current = requestAnimationFrame(draw);
  }, [analyser, mode, drawBars, drawWaveform, drawCircular]);

  // Clear smoothing buffer on mode change
  useEffect(() => {
    prevWaveformRef.current = null;
  }, [mode]);

  // Fade-out loop — overlays semi-transparent black each frame until canvas clears
  const fadeOut = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Overlay dark layer to progressively dim the last frame
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    decayRef.current -= 0.1;
    if (decayRef.current > 0) {
      animationRef.current = requestAnimationFrame(fadeOut);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      decayRef.current = 0;
      prevWaveformRef.current = null;
    }
  }, []);

  // Animation lifecycle
  useEffect(() => {
    cancelAnimationFrame(animationRef.current);

    if (!visible || !analyser) return;

    if (isPlaying) {
      decayRef.current = 1;

      const handleVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(animationRef.current);
        } else {
          animationRef.current = requestAnimationFrame(draw);
        }
      };

      document.addEventListener('visibilitychange', handleVisibility);
      animationRef.current = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(animationRef.current);
        document.removeEventListener('visibilitychange', handleVisibility);
      };
    }

    // Not playing — fade out if there's anything on canvas
    if (decayRef.current > 0) {
      animationRef.current = requestAnimationFrame(fadeOut);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [visible, isPlaying, analyser, draw, fadeOut]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [visible]);

  if (fullSize) {
    return (
      <div className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          aria-label="Audio visualizer"
          role="img"
          className="w-full h-full"
          style={{ imageRendering: mode === 'bars' ? 'pixelated' : 'auto' }}
        />
        {!hideControls && (
          <div className="absolute top-1.5 right-1.5 flex gap-0.5 backdrop-blur-sm rounded-md p-0.5" style={{ backgroundColor: 'color-mix(in srgb, var(--mc-bg-surface) 80%, transparent)' }} role="group" aria-label="Visualizer mode">
            {MODE_ICONS.map(({ mode: m, Icon, label }) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                aria-label={`${label} visualization`}
                aria-pressed={mode === m}
                className={`p-1 rounded transition-colors ${
                  mode === m
                    ? 'mc-toggle-accent'
                    : 'mc-interactive-muted'
                }`}
                style={mode === m ? { backgroundColor: 'var(--mc-bg-surface-hover)' } : undefined}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="visualizer-panel" data-open={visible || undefined}>
      <div className="overflow-hidden">
        <div className="relative">
          <canvas
            ref={canvasRef}
            aria-label="Audio visualizer"
            role="img"
            className="w-full h-24 rounded-t-lg"
            style={{ backgroundColor: 'color-mix(in srgb, var(--mc-bg-base) 50%, transparent)', imageRendering: mode === 'bars' ? 'pixelated' : 'auto' }}
          />
          {/* Mode selector — overlaid top-right */}
          <div className="absolute top-1.5 right-1.5 flex gap-0.5 backdrop-blur-sm rounded-md p-0.5" style={{ backgroundColor: 'color-mix(in srgb, var(--mc-bg-surface) 80%, transparent)' }} role="group" aria-label="Visualizer mode">
            {MODE_ICONS.map(({ mode: m, Icon, label }) => (
              <button
                key={m}
                onClick={() => onModeChange(m)}
                aria-label={`${label} visualization`}
                aria-pressed={mode === m}
                className={`p-1 rounded transition-colors ${
                  mode === m
                    ? 'mc-toggle-accent'
                    : 'mc-interactive-muted'
                }`}
                style={mode === m ? { backgroundColor: 'var(--mc-bg-surface-hover)' } : undefined}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
