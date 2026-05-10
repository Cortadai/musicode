import { useRef, useEffect, useCallback } from 'react';
import type { DeckThemeId } from './DeckThemeToggle';

interface Props {
  trackTitle: string;
  artistName: string;
  albumTitle: string;
  coverUrl?: string;
  progress: number;   // 0–1
  isPlaying: boolean;
  theme: DeckThemeId;
}

// Cassette proportions based on real Compact Cassette (100.4 x 63.8 mm)
// All coordinates in a 1000 x 635 virtual canvas, scaled to fit container
const W = 1000;
const H = 635;

// Layout constants (same for both themes)
const BODY_RADIUS = 16;
const WIN_X = 140;
const WIN_Y = 80;
const WIN_W = 720;
const WIN_H = 280;
const WIN_RADIUS = 12;
const LEFT_REEL_CX = 330;
const RIGHT_REEL_CX = 670;
const REEL_CY = 220;
const HUB_RADIUS = 32;
const MAX_TAPE_RADIUS = 110;
const TAPE_PATH_Y = 340;
const HEAD_GAP_X = 500;
const SCREW_RADIUS = 10;
const SCREW_POSITIONS = [
  [80, 50], [920, 50], [80, 585], [920, 585], [500, 50],
] as const;
const GUIDE_RADIUS = 8;
const GUIDE_POSITIONS = [
  [220, TAPE_PATH_Y], [780, TAPE_PATH_Y],
  [400, TAPE_PATH_Y + 15], [600, TAPE_PATH_Y + 15],
] as const;
const LABEL_X = 160;
const LABEL_Y = 380;
const LABEL_W = 680;
const LABEL_H = 190;
const LABEL_RADIUS = 6;

interface CassetteColors {
  body: string; bodyBorder: string; bodyBevel: string;
  window: string; windowBorder: string;
  tape: string; tapeEdge: string;
  hub: string; hubStroke: string; hubSpoke: string;
  screw: string; screwSlot: string;
  guide: string; guideBorder: string;
  labelBg: string; labelBorder: string; labelLines: string;
  labelBrand: string; labelDivider: string;
  labelTitle: string; labelArtist: string; labelMeta: string;
}

function getColors(theme: DeckThemeId): CassetteColors {
  if (theme === 'synthwave') {
    return {
      body: '#12082a', bodyBorder: '#3b1f8e', bodyBevel: 'rgba(139,92,246,0.05)',
      window: 'rgba(20, 6, 50, 0.6)', windowBorder: 'rgba(139, 92, 246, 0.35)',
      tape: '#2a1060', tapeEdge: 'rgba(139, 92, 246, 0.4)',
      hub: '#1e1245', hubStroke: '#a78bfa', hubSpoke: '#7c3aed',
      screw: '#3b1f8e', screwSlot: '#1a1040',
      guide: '#4c1d95', guideBorder: '#7c3aed',
      labelBg: '#1a0e3a', labelBorder: '#6d28d9', labelLines: 'rgba(139,92,246,0.2)',
      labelBrand: '#a78bfa', labelDivider: '#7c3aed',
      labelTitle: '#f5f3ff', labelArtist: '#c4b5fd', labelMeta: '#8b5cf6',
    };
  }
  if (theme === 'indigo') {
    return {
      body: '#09090b', bodyBorder: '#27272a', bodyBevel: 'rgba(99,102,241,0.04)',
      window: 'rgba(24, 24, 27, 0.7)', windowBorder: 'rgba(99, 102, 241, 0.25)',
      tape: '#1c1c20', tapeEdge: 'rgba(99, 102, 241, 0.3)',
      hub: '#27272a', hubStroke: '#818cf8', hubSpoke: '#6366f1',
      screw: '#3f3f46', screwSlot: '#18181b',
      guide: '#52525b', guideBorder: '#6366f1',
      labelBg: '#0c0c0f', labelBorder: '#4f46e5', labelLines: 'rgba(99,102,241,0.12)',
      labelBrand: '#818cf8', labelDivider: '#4f46e5',
      labelTitle: '#e4e4e7', labelArtist: '#a5b4fc', labelMeta: '#6366f1',
    };
  }
  return {
    body: '#1a1a1a', bodyBorder: '#2a2a2a', bodyBevel: 'rgba(255,255,255,0.03)',
    window: 'rgba(60, 40, 30, 0.35)', windowBorder: 'rgba(100, 80, 60, 0.3)',
    tape: '#3d2b1f', tapeEdge: 'rgba(80, 55, 40, 0.6)',
    hub: '#e8e0d4', hubStroke: '#ccc', hubSpoke: '#aaa',
    screw: '#555', screwSlot: '#333',
    guide: '#888', guideBorder: '#666',
    labelBg: '#f0e6d3', labelBorder: '#d4c4a8', labelLines: 'rgba(180, 160, 130, 0.4)',
    labelBrand: '#666', labelDivider: '#c4a882',
    labelTitle: '#222', labelArtist: '#555', labelMeta: '#999',
  };
}

function tapeRadius(progress: number): number {
  const tapeArea = MAX_TAPE_RADIUS * MAX_TAPE_RADIUS - HUB_RADIUS * HUB_RADIUS;
  return Math.sqrt(HUB_RADIUS * HUB_RADIUS + tapeArea * progress);
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawScrew(ctx: CanvasRenderingContext2D, cx: number, cy: number, c: CassetteColors) {
  ctx.beginPath();
  ctx.arc(cx, cy, SCREW_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = c.screw;
  ctx.fill();
  ctx.strokeStyle = c.screwSlot;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy);
  ctx.lineTo(cx + 5, cy);
  ctx.moveTo(cx, cy - 5);
  ctx.lineTo(cx, cy + 5);
  ctx.stroke();
}

function drawHub(ctx: CanvasRenderingContext2D, cx: number, cy: number, c: CassetteColors) {
  ctx.beginPath();
  ctx.arc(cx, cy, HUB_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = c.hub;
  ctx.fill();
  ctx.strokeStyle = c.hubStroke;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy);
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * (HUB_RADIUS - 4), Math.sin(angle) * (HUB_RADIUS - 4));
    ctx.strokeStyle = c.hubSpoke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

function drawReelTape(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, c: CassetteColors) {
  if (radius <= HUB_RADIUS) return;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = c.tape;
  ctx.fill();
  ctx.strokeStyle = c.tapeEdge;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawTapePath(ctx: CanvasRenderingContext2D, c: CassetteColors) {
  ctx.strokeStyle = c.tape;
  ctx.lineWidth = 3;
  ctx.beginPath();
  // Left guide → head gap → right guide
  ctx.moveTo(GUIDE_POSITIONS[0][0], GUIDE_POSITIONS[0][1]);
  ctx.lineTo(GUIDE_POSITIONS[2][0], GUIDE_POSITIONS[2][1]);
  ctx.lineTo(HEAD_GAP_X, TAPE_PATH_Y + 20);
  ctx.lineTo(GUIDE_POSITIONS[3][0], GUIDE_POSITIONS[3][1]);
  ctx.lineTo(GUIDE_POSITIONS[1][0], GUIDE_POSITIONS[1][1]);
  ctx.stroke();
}

function drawGuides(ctx: CanvasRenderingContext2D, c: CassetteColors) {
  for (const [gx, gy] of GUIDE_POSITIONS) {
    ctx.beginPath();
    ctx.arc(gx, gy, GUIDE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = c.guide;
    ctx.fill();
    ctx.strokeStyle = c.guideBorder;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  title: string,
  artist: string,
  album: string,
  c: CassetteColors,
  coverImage: HTMLImageElement | null,
) {
  ctx.save();
  drawRoundedRect(ctx, LABEL_X, LABEL_Y, LABEL_W, LABEL_H, LABEL_RADIUS);
  ctx.clip();

  if (coverImage) {
    const imgAspect = coverImage.naturalWidth / coverImage.naturalHeight;
    const labelAspect = LABEL_W / LABEL_H;
    let sx = 0, sy = 0, sw = coverImage.naturalWidth, sh = coverImage.naturalHeight;
    if (imgAspect > labelAspect) {
      sw = coverImage.naturalHeight * labelAspect;
      sx = (coverImage.naturalWidth - sw) / 2;
    } else {
      sh = coverImage.naturalWidth / labelAspect;
      sy = (coverImage.naturalHeight - sh) / 2;
    }
    ctx.drawImage(coverImage, sx, sy, sw, sh, LABEL_X, LABEL_Y, LABEL_W, LABEL_H);
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(LABEL_X, LABEL_Y, LABEL_W, LABEL_H);
  } else {
    ctx.fillStyle = c.labelBg;
    ctx.fill();

    // Diagonal hatching — like textured cassette label paper
    ctx.save();
    drawRoundedRect(ctx, LABEL_X, LABEL_Y, LABEL_W, LABEL_H, LABEL_RADIUS);
    ctx.clip();
    ctx.strokeStyle = c.labelLines;
    ctx.lineWidth = 0.4;
    const spacing = 8;
    for (let i = -LABEL_H; i < LABEL_W + LABEL_H; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(LABEL_X + i, LABEL_Y);
      ctx.lineTo(LABEL_X + i - LABEL_H, LABEL_Y + LABEL_H);
      ctx.stroke();
    }

    // Subtle dot grid — mimics paper grain
    ctx.fillStyle = c.labelLines;
    const dotSpacing = 12;
    for (let dx = LABEL_X + 6; dx < LABEL_X + LABEL_W; dx += dotSpacing) {
      for (let dy = LABEL_Y + 6; dy < LABEL_Y + LABEL_H; dy += dotSpacing) {
        ctx.beginPath();
        ctx.arc(dx, dy, 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  ctx.restore();

  drawRoundedRect(ctx, LABEL_X, LABEL_Y, LABEL_W, LABEL_H, LABEL_RADIUS);
  ctx.strokeStyle = c.labelBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  if (!coverImage) {
    // Horizontal writing lines over the texture
    ctx.strokeStyle = c.labelDivider;
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = 0.4;
    for (let y = LABEL_Y + 40; y < LABEL_Y + LABEL_H - 10; y += 22) {
      ctx.beginPath();
      ctx.moveTo(LABEL_X + 15, y);
      ctx.lineTo(LABEL_X + LABEL_W - 15, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }

  const textShadow = coverImage ? 'rgba(0,0,0,0.9)' : '';

  ctx.fillStyle = coverImage ? '#ffffffcc' : c.labelBrand;
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  if (textShadow) { ctx.shadowColor = textShadow; ctx.shadowBlur = 6; ctx.shadowOffsetY = 1; }
  ctx.fillText('SONANCE', LABEL_X + 20, LABEL_Y + 28);

  ctx.textAlign = 'right';
  ctx.font = '16px monospace';
  ctx.fillStyle = coverImage ? '#ffffff99' : c.labelMeta;
  ctx.fillText('C-90', LABEL_X + LABEL_W - 20, LABEL_Y + 28);

  ctx.strokeStyle = coverImage ? 'rgba(255,255,255,0.2)' : c.labelDivider;
  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(LABEL_X + 15, LABEL_Y + 36);
  ctx.lineTo(LABEL_X + LABEL_W - 15, LABEL_Y + 36);
  ctx.stroke();

  if (textShadow) { ctx.shadowColor = textShadow; ctx.shadowBlur = 8; ctx.shadowOffsetY = 1; }
  ctx.fillStyle = coverImage ? '#fff' : c.labelTitle;
  ctx.font = '600 24px "Courier New", "Courier", monospace';
  ctx.textAlign = 'center';
  const maxTextW = LABEL_W - 40;
  const truncatedTitle = truncateText(ctx, title, maxTextW);
  ctx.fillText(truncatedTitle, LABEL_X + LABEL_W / 2, LABEL_Y + 75);

  ctx.font = '18px "Courier New", "Courier", monospace';
  ctx.fillStyle = coverImage ? '#ffffffcc' : c.labelArtist;
  const artistAlbum = album ? `${artist} — ${album}` : artist;
  const truncatedArtist = truncateText(ctx, artistAlbum, maxTextW);
  ctx.fillText(truncatedArtist, LABEL_X + LABEL_W / 2, LABEL_Y + 105);

  ctx.font = 'bold 14px monospace';
  ctx.fillStyle = coverImage ? '#ffffff99' : c.labelMeta;
  ctx.textAlign = 'left';
  ctx.fillText('SIDE A ▸', LABEL_X + 20, LABEL_Y + LABEL_H - 15);

  ctx.textAlign = 'right';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('■ HQ', LABEL_X + LABEL_W - 20, LABEL_Y + LABEL_H - 15);

  ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let truncated = text;
  while (truncated.length > 0 && ctx.measureText(truncated + '…').width > maxWidth) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '…';
}

export default function CassetteCanvas({ trackTitle, artistName, albumTitle, coverUrl, progress, isPlaying, theme }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const coverImgRef = useRef<HTMLImageElement | null>(null);
  const coverUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (coverUrl === coverUrlRef.current) return;
    coverUrlRef.current = coverUrl;
    if (!coverUrl) { coverImgRef.current = null; return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { coverImgRef.current = img; };
    img.onerror = () => { coverImgRef.current = null; };
    img.src = coverUrl;
  }, [coverUrl]);

  const propsRef = useRef({ trackTitle, artistName, albumTitle, progress, isPlaying, theme });
  propsRef.current = { trackTitle, artistName, albumTitle, progress, isPlaying, theme };

  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, scale: number, angle: number) => {
    const { trackTitle: title, artistName: artist, albumTitle: album, progress: p, theme: t } = propsRef.current;
    const c = getColors(t);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, W, H);

    drawRoundedRect(ctx, 0, 0, W, H, BODY_RADIUS);
    ctx.fillStyle = c.body;
    ctx.fill();
    ctx.strokeStyle = c.bodyBorder;
    ctx.lineWidth = 2;
    ctx.stroke();

    drawRoundedRect(ctx, 8, 8, W - 16, H - 16, BODY_RADIUS - 4);
    ctx.strokeStyle = c.bodyBevel;
    ctx.lineWidth = 1;
    ctx.stroke();

    drawRoundedRect(ctx, WIN_X, WIN_Y, WIN_W, WIN_H, WIN_RADIUS);
    ctx.fillStyle = c.window;
    ctx.fill();
    ctx.strokeStyle = c.windowBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const leftTapeR = tapeRadius(1 - p);
    const rightTapeR = tapeRadius(p);
    drawReelTape(ctx, LEFT_REEL_CX, REEL_CY, leftTapeR, c);
    drawReelTape(ctx, RIGHT_REEL_CX, REEL_CY, rightTapeR, c);

    ctx.save();
    ctx.translate(LEFT_REEL_CX, REEL_CY);
    ctx.rotate(angle);
    ctx.translate(-LEFT_REEL_CX, -REEL_CY);
    drawHub(ctx, LEFT_REEL_CX, REEL_CY, c);
    ctx.restore();

    ctx.save();
    ctx.translate(RIGHT_REEL_CX, REEL_CY);
    ctx.rotate(angle);
    ctx.translate(-RIGHT_REEL_CX, -REEL_CY);
    drawHub(ctx, RIGHT_REEL_CX, REEL_CY, c);
    ctx.restore();

    drawTapePath(ctx, c);
    drawGuides(ctx, c);

    for (const [sx, sy] of SCREW_POSITIONS) {
      drawScrew(ctx, sx, sy, c);
    }

    drawLabel(ctx, title, artist, album, c, coverImgRef.current);

    ctx.restore();
  }, []);

  // Resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      const dpr = window.devicePixelRatio || 1;
      const displayH = width * (H / W);
      canvas.width = width * dpr;
      canvas.height = displayH * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${displayH}px`;
      const scale = (width * dpr) / W;
      drawFrame(ctx, scale, angleRef.current);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [drawFrame]);

  // Single stable animation loop — reads mutable state from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (propsRef.current.isPlaying) {
        const rightR = tapeRadius(propsRef.current.progress);
        const linearSpeed = 150;
        const angularV = linearSpeed / Math.max(rightR, HUB_RADIUS + 1);
        angleRef.current += angularV * dt;
      }

      const scale = canvas.width / W;
      drawFrame(ctx, scale, angleRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [drawFrame]);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  );
}
