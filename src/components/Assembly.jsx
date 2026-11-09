import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { STEPS } from '../content';
import { Logo } from './ui';
import { CallPart, CoinPart, MatchPart, NumberPart, OncePart, StatusPart, StreakPart, VoicePart } from './parts';

// "How it works": a pinned blueprint. The app's parts start exploded around the board, each with a
// spec label; as you scroll they snap into place one step at a time, like a machine being assembled.

const BOARD_W = 580;
const BOARD_H = 480;

// final centre (x, y) on the board, where it comes from (dx, dy, rotations, depth) and its step
const PARTS = [
  { key: 'match', C: MatchPart, x: 150, y: 88, from: [-100, -90, -24, 30, 160], step: 0, label: 'MATCH ENGINE' },
  { key: 'number', C: NumberPart, x: 420, y: 62, from: [170, -110, 18, -40, 140], step: 0, label: 'PRIVATE ID' },
  { key: 'call', C: CallPart, x: 424, y: 178, from: [200, -10, -14, 35, 180], step: 1, label: 'VOICE CHANNEL' },
  { key: 'coin', C: CoinPart, x: 430, y: 410, from: [170, 110, 22, -30, 150], step: 1, label: 'WALLET' },
  { key: 'voice', C: VoicePart, x: 150, y: 214, from: [-90, 10, 16, -35, 200], step: 2, label: 'VOICE NOTE' },
  { key: 'once', C: OncePart, x: 128, y: 318, from: [-90, 60, -20, 25, 170], step: 2, label: 'VIEW ONCE' },
  { key: 'status', C: StatusPart, x: 428, y: 300, from: [190, 60, -16, 30, 170], step: 3, label: 'STATUS 24H' },
  { key: 'streak', C: StreakPart, x: 176, y: 414, from: [-90, 100, 20, -25, 160], step: 3, label: 'STREAK' },
];

// wire from the central hub to a part's socket
const wirePath = (p) => `M${BOARD_W / 2} ${BOARD_H / 2} C ${BOARD_W / 2} ${p.y}, ${BOARD_W / 2} ${p.y}, ${p.x} ${p.y}`;

/** A part's wire lights up (draws from the hub) as that part locks in. */
const LiveWire = ({ part, progress, index }) => {
  const [a, b] = WINDOWS[part.step];
  const stagger = (index % 2) * 0.03;
  const len = useTransform(progress, [a + stagger, b], [0, 1], { clamp: true });
  return <motion.path className="wire-live" d={wirePath(part)} style={{ pathLength: len }} />;
};

// scroll window in which each step's parts fly in
const WINDOWS = [
  [0.02, 0.18],
  [0.18, 0.34],
  [0.34, 0.5],
  [0.5, 0.66],
];

const Part = ({ part, progress, index }) => {
  const [a, b] = WINDOWS[part.step];
  const stagger = (index % 2) * 0.03;
  const p = useTransform(progress, [a + stagger, b], [0, 1], { clamp: true });
  const [dx, dy, rx, ry, z] = part.from;
  const x = useTransform(p, (v) => dx * (1 - v));
  const y = useTransform(p, (v) => dy * (1 - v));
  const rotateX = useTransform(p, (v) => rx * (1 - v));
  const rotateY = useTransform(p, (v) => ry * (1 - v));
  const z3 = useTransform(p, (v) => z * (1 - v));
  const opacity = useTransform(p, [0, 1], [0.92, 1]);
  const labelOpacity = useTransform(p, [0, 0.6, 0.9], [1, 1, 0]);
  const lineScale = useTransform(p, [0, 0.8], [1, 0]);
  const snapped = useTransform(p, [0.85, 0.95, 1], [0, 0.9, 0]);
  const C = part.C;
  return (
    <div className="slot" style={{ left: part.x, top: part.y }}>
      <motion.div className="slot-part" style={{ x, y, rotateX, rotateY, z: z3, opacity }}>
        <motion.span className="snap-flash" style={{ opacity: snapped }} />
        <C />
        <motion.span className={`spec ${part.from[0] < 0 ? 'spec-l' : 'spec-r'}`} style={{ opacity: labelOpacity }}>
          <motion.i style={{ scaleX: lineScale }} />
          {String(index + 1).padStart(2, '0')} · {part.label}
        </motion.span>
      </motion.div>
    </div>
  );
};

const Assembly = () => {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
  const done = useMotionValue(1);
  const progress = reduce ? done : smooth;
  const [step, setStep] = useState(reduce ? 3 : 0);
  const [scale, setScale] = useState(1);

  useMotionValueEvent(progress, 'change', (v) => {
    const s = WINDOWS.findIndex(([, b]) => v < b);
    setStep(s === -1 ? 3 : s);
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const fit = () => {
      const r = el.getBoundingClientRect();
      setScale(Math.min(1, r.width / (BOARD_W + 40), r.height / (BOARD_H + 40)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const core = useTransform(progress, [0.66, 0.74], [0, 1]);
  const coreY = useTransform(core, [0, 1], [12, 0]);
  const hub = useTransform(progress, [0, 0.66, 0.74], [0.85, 0.95, 1.12]);
  const hubGlow = useTransform(progress, [0.6, 0.74], [0, 1]);
  const bar = useTransform(progress, [0.02, 0.66], ['0%', '100%']);

  return (
    <section className="assembly" id="how" ref={ref} aria-labelledby="how-title">
      <div className="assembly-pin">
        <div className="wrap assembly-grid">
          <div className="assembly-text">
            <span className="kicker">How it works</span>
            <h2 id="how-title">Four parts. One good conversation.</h2>
            <ol className="step-list">
              {STEPS.map((s, i) => (
                <li key={s.n} className={i === step ? 'on' : i < step ? 'done' : ''}>
                  <span className="step-n">{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="assembly-meter" aria-hidden="true">
              <motion.span style={{ width: bar }} />
            </div>
          </div>
          <div className="assembly-stage" ref={stageRef} aria-hidden="true">
            <div className="board" style={{ width: BOARD_W, height: BOARD_H, transform: `translate(-50%, -50%) scale(${scale})` }}>
              <svg className="board-wires" viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}>
                {PARTS.map((p, i) => (
                  <LiveWire key={`live-${p.key}`} part={p} progress={progress} index={i} />
                ))}
              </svg>
              <motion.div className="hub-logo" style={{ scale: hub }}>
                <motion.span className="hub-glow" style={{ opacity: hubGlow }} />
                <Logo size={64} />
              </motion.div>
              <motion.div className="board-core" style={{ opacity: core, y: coreY }}>
                <span className="core-dot" />
                All parts connected
              </motion.div>
              {PARTS.map((p, i) => (
                <Part key={p.key} part={p} progress={progress} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assembly;
