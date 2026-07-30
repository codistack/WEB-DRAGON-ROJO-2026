import React, { useEffect, useRef } from 'react';

interface FlameCanvasProps {
  enabled?: boolean;
}

export const FlameCanvas: React.FC<FlameCanvasProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool for embers
    interface Ember {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;
      maxLife: number;
      life: number;
    }

    const emberColors = ['#f97316', '#ef4444', '#f59e0b', '#dc2626', '#fbbf24'];
    const embers: Ember[] = [];
    const maxEmbers = Math.min(60, Math.floor(width / 25));

    for (let i = 0; i < maxEmbers; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.8,
        speedY: Math.random() * 1.2 + 0.4,
        speedX: (Math.random() - 0.5) * 0.6,
        opacity: Math.random() * 0.7 + 0.3,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        maxLife: Math.random() * 180 + 100,
        life: Math.random() * 100,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life++;
        e.y -= e.speedY;
        e.x += e.speedX + Math.sin(e.life * 0.05) * 0.3;

        // Fade out as it reaches top or end of life
        const lifeRatio = e.life / e.maxLife;
        const currentOpacity = e.opacity * (1 - lifeRatio);

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = Math.max(0, currentOpacity);
        ctx.shadowBlur = e.size * 3;
        ctx.shadowColor = e.color;
        ctx.fill();

        // Respawn
        if (e.y < -10 || e.life >= e.maxLife) {
          e.x = Math.random() * width;
          e.y = height + 10;
          e.life = 0;
          e.size = Math.random() * 2.5 + 0.8;
          e.speedY = Math.random() * 1.2 + 0.4;
          e.opacity = Math.random() * 0.7 + 0.3;
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
