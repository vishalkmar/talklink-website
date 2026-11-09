import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { LAYERS } from '../content';
import { Icon } from './ui';

// Safety as an exploded stack: three plates lie flat on top of each other and lift apart while you
// scroll; the list beside it lights up layer by layer.

const ICONS = ['flag', 'users', 'lock'];
const N = LAYERS.length;

const Plate = ({ i, progress, unit }) => {
  const level = N - 1 - i; // the top plate (i = 0) lifts highest
  const z = useTransform(progress, [0.08, 0.7], [level * 8, level * unit]);
  const glow = useTransform(progress, [0.25 + i * 0.12, 0.45 + i * 0.12], [0, 1]);
  return (
    <motion.div className={`plate plate-${i}`} style={{ z }}>
      <span className="plate-grid" />
      <motion.span className="plate-edge" style={{ opacity: glow }} />
      <span className="plate-ico">
        <Icon name={ICONS[i]} size={28} stroke={2.2} />
      </span>
    </motion.div>
  );
};

const Layers = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const one = useMotionValue(1);
  const progress = reduce ? one : smooth;
  const turn = useTransform(progress, [0, 1], [-38, -52]);
  const tilt = useTransform(progress, [0, 1], [62, 56]);
  // smaller lift on narrow screens so the stack stays inside its box
  const [unit, setUnit] = useState(110);
  useEffect(() => {
    const fit = () => setUnit(window.innerWidth < 960 ? 55 : 110);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  const [lit, setLit] = useState(reduce ? N : 0);
  useMotionValueEvent(progress, 'change', (v) => {
    setLit(LAYERS.filter((_, i) => v > 0.3 + i * 0.12).length);
  });

  return (
    <section className="layers" id="safety" ref={ref} aria-labelledby="safety-title">
      <div className="layers-pin">
        <div className="wrap layers-grid">
          <div className="layers-text">
            <span className="kicker">Safety</span>
            <h2 id="safety-title">Three layers between you and anyone rude.</h2>
            <p>For adults who want good conversations. You decide who reaches you.</p>
            <ul className="layer-list">
              {LAYERS.map((l, i) => (
                <li key={l.title} className={i < lit ? 'on' : ''}>
                  <span className="layer-ico">
                    <Icon name={ICONS[i]} size={16} />
                  </span>
                  <span>
                    <b>{l.title}</b>
                    {l.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="stack-stage" aria-hidden="true">
            <motion.div className="stack" style={{ rotateX: tilt, rotateZ: turn }}>
              {LAYERS.map((l, i) => (
                <Plate key={l.title} i={i} progress={progress} unit={unit} />
              )).reverse()}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Layers;
