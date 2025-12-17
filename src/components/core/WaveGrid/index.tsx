// src/components/core/WaveGrid/index.tsx
// Animated wave grid with mouse-following illumination - inspired by vibary.art

import { useRef, useEffect, useCallback } from 'react';

export default function WaveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use CSS pixel dimensions for calculations (not DPR-scaled canvas size)
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Smooth mouse interpolation
    mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
    mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.08;

    // Clear canvas (use actual canvas dimensions)
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid settings
    const gridSpacing = 35;
    const rows = Math.ceil(height / gridSpacing) + 4;
    const cols = Math.ceil(width / gridSpacing) + 4;

    // Time for animation
    timeRef.current += 0.015;
    const time = timeRef.current;

    // Mouse position in CSS pixels (matches actual cursor position)
    const mouseX = mouseRef.current.x * width;
    const mouseY = mouseRef.current.y * height;

    // Draw grid lines with wave distortion
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;

    // Calculate distorted points
    const getDistortedPoint = (x: number, y: number): [number, number] => {
      // Base wave ripples traveling across the grid
      const wave1 = Math.sin(x * 0.008 + time * 1.5) * 8;
      const wave2 = Math.sin(y * 0.006 + time * 1.2) * 6;
      const wave3 = Math.sin((x + y) * 0.004 + time * 0.8) * 5;
      const wave4 = Math.cos(x * 0.01 - time * 1.0) * 4;
      const wave5 = Math.cos(y * 0.008 + time * 0.6) * 4;

      // Combined wave displacement
      const waveX = wave1 + wave3 + wave4;
      const waveY = wave2 + wave3 + wave5;

      // Mouse ripple effect
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 300;

      let mouseWaveX = 0;
      let mouseWaveY = 0;

      if (dist < maxDist) {
        const influence = 1 - dist / maxDist;
        const ripple = Math.sin(dist * 0.03 - time * 4) * influence * 20;
        const angle = Math.atan2(dy, dx);
        mouseWaveX = Math.cos(angle) * ripple;
        mouseWaveY = Math.sin(angle) * ripple;
      }

      return [
        x + waveX + mouseWaveX,
        y + waveY + mouseWaveY
      ];
    };

    // Calculate brightness based on distance to mouse
    const getBrightness = (x: number, y: number): number => {
      const dx = x - mouseX;
      const dy = y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 350;

      // Base brightness
      let brightness = 0.12;

      // Mouse glow
      if (dist < maxDist) {
        const glow = Math.pow(1 - dist / maxDist, 2);
        brightness += glow * 0.6;
      }

      return Math.min(brightness, 0.8);
    };

    // Draw horizontal lines
    for (let row = -2; row < rows; row++) {
      const baseY = row * gridSpacing;

      ctx.beginPath();
      let started = false;

      for (let col = -2; col <= cols; col++) {
        const baseX = col * gridSpacing;
        const [px, py] = getDistortedPoint(baseX, baseY);
        const brightness = getBrightness(baseX, baseY);

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }

        // Vary line opacity based on position
        ctx.strokeStyle = `rgba(255, 255, 255, ${brightness})`;
      }
      ctx.stroke();
    }

    // Draw vertical lines
    for (let col = -2; col < cols; col++) {
      const baseX = col * gridSpacing;

      ctx.beginPath();
      let started = false;

      for (let row = -2; row <= rows; row++) {
        const baseY = row * gridSpacing;
        const [px, py] = getDistortedPoint(baseX, baseY);
        const brightness = getBrightness(baseX, baseY);

        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${brightness})`;
      }
      ctx.stroke();
    }

    // Draw mouse glow overlay
    const gradient = ctx.createRadialGradient(
      mouseX, mouseY, 0,
      mouseX, mouseY, 300
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
