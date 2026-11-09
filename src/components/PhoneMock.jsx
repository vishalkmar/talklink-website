import React, { useEffect, useRef } from 'react';
import { SCREEN_W, SCREEN_H, drawScreenMode } from '../three/screens';

/**
 * 2D phone with a live TalkLink screen. Shown before the 3D scene is ready, and on phones without
 * WebGL / with reduced motion. Same drawings as the 3D phone's screen.
 */
const PhoneMock = ({ screen = 'home', label }) => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return undefined;
    const ctx = c.getContext('2d');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(c);
    const tick = () => {
      if (visible) drawScreenMode(ctx, screen, (performance.now() - start) / 1000);
      if (!reduce) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [screen]);
  return (
    <div className="css-phone" role="img" aria-label={label}>
      <canvas ref={ref} className="css-phone-screen" width={SCREEN_W} height={SCREEN_H} />
    </div>
  );
};

export default PhoneMock;
