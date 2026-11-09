import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { STEPS } from '../content';
import { CallPart, CoinPart, MatchPart, NumberPart, OncePart, StreakPart, VoicePart } from './parts';

// "How it works" as a journey: a line runs down the middle and fills as you scroll, a glowing
// signal rides on it, and each step lights up as the signal reaches it - its text slides in from
// one side while the real app parts rise up (3D) on the other. Nothing is pinned.

const VISUALS = [
  () => (
    <>
      <MatchPart />
      <span className="hw-float hw-f1">
        <NumberPart />
      </span>
    </>
  ),
  () => <CallPart />,
  () => (
    <>
      <VoicePart />
      <span className="hw-float hw-f2">
        <OncePart />
      </span>
    </>
  ),
  () => (
    <>
      <StreakPart />
      <span className="hw-float hw-f3">
        <CoinPart />
      </span>
    </>
  ),
];

const EASE = [0.22, 1, 0.36, 1];

const Step = ({ s, i, p }) => {
  // the node lights up as the signal on the line reaches it
  const at = (i + 0.5) / STEPS.length;
  const on = useTransform(p, [at - 0.06, at], [0, 1]);
  const nodeBg = useTransform(on, [0, 1], ['#ffffff', '#22878F']);
  const nodeFg = useTransform(on, [0, 1], ['#22878F', '#ffffff']);
  const nodeS = useTransform(on, [0, 1], [0.7, 1]);
  const left = i % 2 === 0; // text on the left, visual on the right
  const V = VISUALS[i];
  return (
    <li className={`hw-step ${left ? 'hw-l' : 'hw-r'}`}>
      <motion.div
        className="hw-text"
        initial={{ opacity: 0, x: left ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span className="hw-n">{s.n}</span>
        <h3>{s.title}</h3>
        <p>{s.text}</p>
      </motion.div>

      <motion.span className="hw-node" style={{ backgroundColor: nodeBg, color: nodeFg, scale: nodeS }} aria-hidden="true">
        {i + 1}
      </motion.span>

      <div className="hw-visual" aria-hidden="true">
        <motion.div
          className="hw-pad"
          initial={{ opacity: 0, rotateX: 55, y: 60, scale: 0.85 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        >
          <motion.div
            className="hw-pad-inner"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.45 }}
          >
            <V />
          </motion.div>
        </motion.div>
      </div>
    </li>
  );
};

const HowItWorks = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 60%'] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const top = useTransform(p, (v) => `${v * 100}%`);

  return (
    <section className="section how" id="how" aria-labelledby="how-title">
      <div className="wrap">
        <div className="how-head">
          <motion.span className="kicker" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            How it works
          </motion.span>
          <motion.h2
            id="how-title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Four steps. One good conversation.
          </motion.h2>
        </div>
        <ol className="hw-list" ref={ref}>
          <span className="hw-track" aria-hidden="true">
            <motion.span className="hw-fill" style={{ scaleY: p }} />
            <motion.span className="hw-signal" style={{ top }} />
          </span>
          {STEPS.map((s, i) => (
            <Step key={s.n} s={s} i={i} p={p} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
