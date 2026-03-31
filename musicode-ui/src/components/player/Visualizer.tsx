import { useRef, useEffect, useCallback } from 'react';
import { useAudioAnalyser } from '../../hooks/useAudioAnalyser';
import { usePlayerState } from '../../context/PlayerContext';

interface Props {
  visible: boolean;
}

/**
 * Real-time frequency spectrum visualizer using Web Audio API + Canvas 2D.
 *
 * Reads frequency data from the AnalyserNode on each animation frame and
 * draws vertical bars. Uses requestAnimationFrame for smooth 60fps rendering.
 * Pauses when: not visible (toggled off), not playing, or page is hidden
 * (Page Visibility API) to save CPU.
 */
export default function Visualizer({ visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const analyser = useAudioAnalyser();
  const { isPlaying } = usePlayerState();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Use ~60% of frequency bins (higher bins are mostly empty for music)
    const usableBins = Math.floor(bufferLength * 0.6);
    const barWidth = width / usableBins;
    const gap = 1;

    for (let i = 0; i < usableBins; i++) {
      // Normalize 0-255 to 0-1
      const value = dataArray[i] / 255;
      const barHeight = value * height;

      // Indigo gradient: darker at bottom, brighter at top
      const hue = 240;
      const saturation = 70;
      const lightness = 40 + value * 30;
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.6 + value * 0.4})`;

      ctx.fillRect(
        i * barWidth + gap / 2,
        height - barHeight,
        barWidth - gap,
        barHeight
      );
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [analyser]);

  useEffect(() => {
    if (!visible || !isPlaying || !analyser) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    // Page Visibility: pause rendering when tab is hidden
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
  }, [visible, isPlaying, analyser, draw]);

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      // Update logical dimensions for drawing
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-12 rounded-lg"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
