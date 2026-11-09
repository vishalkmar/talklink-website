import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { MODULES } from '../content';
import { CoinPart, MatchPart, NumberPart, OncePart, StatusPart, StreakPart, VoicePart } from './parts';

// Features as a row of "modules" on a rail. The section is pinned and vertical scroll slides the
// rail sideways; each module's part floats at its own depth (parallax) as it passes.

const VISUAL = {
  random: () => <MatchPart />,
  number: () => (
    <div className="mod-stack">
      <NumberPart />
      <div className="mini-pad" aria-hidden="true">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0', '✓'].map((k) => (
          <span key={k}>{k}</span>
        ))}
      </div>
    </div>
  ),
  voice: () => <VoicePart big />,
  once: () => (
    <div className="mod-stack">
      <OncePart />
      <div className="part p-opened">Opened · deleted for both</div>
    </div>
  ),
  status: () => <StatusPart />,
  rewards: () => (
    <div className="mod-stack">
      <StreakPart />
      <CoinPart />
    </div>
  ),
};

const Module = ({ m, i, progress, count }) => {
  // -1..1 while the card crosses the screen: drives its own depth/tilt
  const centre = count > 1 ? i / (count - 1) : 0;
  const rel = useTransform(progress, [centre - 0.35, centre, centre + 0.35], [1, 0, -1]);
  const vx = useTransform(rel, (v) => v * 40);
  const rotY = useTransform(rel, (v) => v * -10);
  const V = VISUAL[m.id];
  return (
    <motion.article className="module" style={{ rotateY: rotY }} aria-labelledby={`mod-${m.id}`}>
      <div className="module-top">
        <span className="module-n">M-{String(i + 1).padStart(2, '0')}</span>
        <span className="module-tag">{m.tag}</span>
      </div>
      <motion.div className="module-visual" style={{ x: vx }}>
        <V />
      </motion.div>
      <h3 id={`mod-${m.id}`}>{m.title}</h3>
      <p>{m.text}</p>
    </motion.article>
  );
};

const Modules = () => {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  const x = useTransform(progress, (v) => -v * dist);

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 32));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const pinned = !reduce && dist > 0;
  return (
    <section
      className={`modules${pinned ? ' is-pinned' : ''}`}
      id="features"
      ref={ref}
      style={pinned ? { height: `calc(100vh + ${dist}px)` } : undefined}
      aria-labelledby="features-title"
    >
      <div className="modules-pin">
        <div className="wrap modules-head">
          <span className="kicker">Features</span>
          <h2 id="features-title">Everything you need. Nothing you don't.</h2>
        </div>
        <motion.div className="rail" ref={trackRef} style={pinned ? { x } : undefined}>
          {MODULES.map((m, i) => (
            <Module key={m.id} m={m} i={i} progress={progress} count={MODULES.length} />
          ))}
        </motion.div>
        <div className="wrap rail-meter" aria-hidden="true">
          <motion.span style={{ scaleX: progress }} />
        </div>
      </div>
    </section>
  );
};

export default Modules;
