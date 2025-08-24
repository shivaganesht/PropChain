"use client";

import { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const DPR = Math.max(1, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1);

    function resize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * DPR);
      canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();

    const orbs = Array.from({ length: 6 }).map((_, i) => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      r: 60 + Math.random() * 140,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      color: `hsla(${200 + i * 28}, 80%, 60%, 0.12)`
    }));

    function drawFrame() {
      // local references to avoid nullable checks in loop
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);
      orbs.forEach(o => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -300) o.x = cw + 300;
        if (o.x > cw + 300) o.x = -300;
        if (o.y < -300) o.y = ch + 300;
        if (o.y > ch + 300) o.y = -300;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, o.color);
        grad.addColorStop(1, 'rgba(8,10,18,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(drawFrame);
    }

    drawFrame();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />;
}
