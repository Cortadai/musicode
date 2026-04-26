import { useRef, useEffect, useCallback } from 'react';
import audioGraph from '../../../audio/audioGraph';
import type { DeckThemeId } from './DeckThemeToggle';

interface Props {
  isPlaying: boolean;
  width?: number;
  height?: number;
  theme: DeckThemeId;
}

const NEEDLE_ATTACK = 12;   // Fast rise (units/sec)
const NEEDLE_DECAY = 4;     // Slow fall — classic VU ballistics
const NEEDLE_MIN_ANGLE = -45;  // degrees — far left (silence)
const NEEDLE_MAX_ANGLE = 45;   // degrees — far right (peak)
const OVERSHOOT = 8;           // degrees past max for red zone bounce

export default function VUMeter({ isPlaying, width = 260, height = 160, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const needleLRef = useRef(0);
  const needleRRef = useRef(0);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const themeRef = useRef(theme);
  themeRef.current = theme;

  const drawMeter = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    needlePos: number, label: string
  ) => {
    const t = themeRef.current;
    const s = t === 'synthwave';
    const ind = t === 'indigo';
    const cx = x + w / 2;
    const bottom = y + h - 12;
    const needleLen = h * 0.65;

    ctx.save();
    ctx.beginPath();
    roundRect(ctx, x, y, w, h, 6);
    ctx.fillStyle = s ? '#0e0828' : ind ? '#0f0f12' : '#1c1915';
    ctx.fill();
    ctx.strokeStyle = s ? '#3b1f8e' : ind ? '#27272a' : '#3a352e';
    ctx.lineWidth = 1;
    ctx.stroke();

    const faceMargin = 8;
    ctx.beginPath();
    roundRect(ctx, x + faceMargin, y + faceMargin, w - faceMargin * 2, h - faceMargin * 2 - 8, 4);
    ctx.fillStyle = s ? '#1a1040' : ind ? '#111114' : '#f5eed8';
    ctx.fill();

    const scaleRadius = needleLen - 10;
    const numTicks = 11;
    for (let i = 0; i <= numTicks; i++) {
      const tt = i / numTicks;
      const angleDeg = NEEDLE_MIN_ANGLE + tt * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE);
      const angleRad = (angleDeg - 90) * Math.PI / 180;
      const innerR = scaleRadius - (i >= 8 ? 12 : 8);
      const outerR = scaleRadius;

      const x1 = cx + Math.cos(angleRad) * innerR;
      const y1 = bottom + Math.sin(angleRad) * innerR;
      const x2 = cx + Math.cos(angleRad) * outerR;
      const y2 = bottom + Math.sin(angleRad) * outerR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = i >= 8
        ? (s ? '#f472b6' : ind ? '#f87171' : '#c43')
        : (s ? '#67e8f9' : ind ? '#a5b4fc' : '#555');
      ctx.lineWidth = i % 2 === 0 ? 2 : 1;
      ctx.stroke();
    }

    const scaleLabels = ['-20', '', '-10', '', '-5', '-3', '0', '+1', '', '+3', ''];
    const labelRadius = scaleRadius - 18;
    ctx.font = `bold ${Math.max(8, w * 0.035)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= numTicks; i++) {
      if (!scaleLabels[i]) continue;
      const tt = i / numTicks;
      const angleDeg = NEEDLE_MIN_ANGLE + tt * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE);
      const angleRad = (angleDeg - 90) * Math.PI / 180;
      const lx = cx + Math.cos(angleRad) * labelRadius;
      const ly = bottom + Math.sin(angleRad) * labelRadius;
      ctx.fillStyle = i >= 8
        ? (s ? '#f9a8d4' : ind ? '#fca5a5' : '#c43')
        : (s ? '#a5f3fc' : ind ? '#c7d2fe' : '#666');
      ctx.fillText(scaleLabels[i], lx, ly);
    }

    ctx.font = `bold ${Math.max(10, w * 0.05)}px monospace`;
    ctx.fillStyle = s ? '#c4b5fd' : ind ? '#a5b4fc' : '#888';
    ctx.textAlign = 'center';
    ctx.fillText('VU', cx, y + h * 0.32);

    const redStart = (NEEDLE_MIN_ANGLE + (8 / numTicks) * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE) - 90) * Math.PI / 180;
    const redEnd = (NEEDLE_MAX_ANGLE - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.arc(cx, bottom, scaleRadius + 2, redStart, redEnd);
    ctx.strokeStyle = s ? 'rgba(244, 114, 182, 0.5)' : ind ? 'rgba(248, 113, 113, 0.35)' : 'rgba(204, 68, 51, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();

    const clampedPos = Math.max(0, Math.min(1.08, needlePos));
    const needleDeg = NEEDLE_MIN_ANGLE + clampedPos * (NEEDLE_MAX_ANGLE - NEEDLE_MIN_ANGLE + OVERSHOOT);
    const needleRad = (needleDeg - 90) * Math.PI / 180;
    const tipX = cx + Math.cos(needleRad) * needleLen;
    const tipY = bottom + Math.sin(needleRad) * needleLen;

    ctx.beginPath();
    ctx.moveTo(cx + 1, bottom + 1);
    ctx.lineTo(tipX + 1, tipY + 1);
    ctx.strokeStyle = s ? 'rgba(139,92,246,0.2)' : ind ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx, bottom);
    ctx.lineTo(tipX, tipY);
    ctx.strokeStyle = s ? '#ffffff' : ind ? '#e4e4e7' : '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.stroke();

    if (s || ind) {
      ctx.beginPath();
      ctx.moveTo(cx, bottom);
      ctx.lineTo(tipX, tipY);
      ctx.strokeStyle = s ? 'rgba(192,132,252,0.3)' : 'rgba(129,140,248,0.25)';
      ctx.lineWidth = 6;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(cx, bottom, 4, 0, Math.PI * 2);
    ctx.fillStyle = s ? '#7c3aed' : ind ? '#3f3f46' : '#333';
    ctx.fill();

    ctx.font = `bold ${Math.max(9, w * 0.04)}px monospace`;
    ctx.fillStyle = s ? '#a78bfa' : ind ? '#818cf8' : '#999';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, y + h - 4);

    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const freqData = new Uint8Array(128);
    const meterW = (width * dpr) / 2 - 6;
    const meterH = height * dpr - 8;

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      let targetL = 0;
      let targetR = 0;

      if (isPlayingRef.current) {
        const analyser = audioGraph.getAnalyser();
        if (analyser) {
          analyser.getByteFrequencyData(freqData);
          const half = freqData.length / 2;
          let sumL = 0, sumR = 0;
          for (let i = 0; i < half; i++) {
            sumL += freqData[i];
            sumR += freqData[i + half];
          }
          targetL = sumL / (half * 255);
          targetR = sumR / (half * 255);
        }
      }

      // VU ballistics: fast attack, slow decay
      const attackL = targetL > needleLRef.current ? NEEDLE_ATTACK : NEEDLE_DECAY;
      const attackR = targetR > needleRRef.current ? NEEDLE_ATTACK : NEEDLE_DECAY;
      needleLRef.current += (targetL - needleLRef.current) * Math.min(1, attackL * dt);
      needleRRef.current += (targetR - needleRRef.current) * Math.min(1, attackR * dt);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMeter(ctx, 2, 4, meterW, meterH, needleLRef.current, 'L');
      drawMeter(ctx, meterW + 10, 4, meterW, meterH, needleRRef.current, 'R');

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [width, height, drawMeter]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      aria-label="VU meters"
    />
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}
