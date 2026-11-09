import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { LAYERS } from '../content';
import { Icon, Reveal } from './ui';

// Safety, shown as three live controls that act out while the section scrolls past (no pinning):
// an unknown caller gets stamped BLOCKED, the "who can call me" switch slides over, the lock
// between two people clicks shut.

const OPTIONS = ['Everyone', 'People I talked to', 'Nobody'];

const Card = ({ i, progress, children }) => {
  const start = 0.05 + i * 0.12;
  const x = useTransform(progress, [start, start + 0.2], [120, 0]);
  const rotate = useTransform(progress, [start, start + 0.2], [6, 0]);
  const opacity = useTransform(progress, [start, start + 0.14], [0, 1]);
  return (
    <motion.div className={`pv-card pv-${i}`} style={{ x, rotate, opacity }}>
      {children}
    </motion.div>
  );
};

const Privacy = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });

  // 1 - blocked stamp
  const stampS = useTransform(progress, [0.3, 0.4], [2.2, 1]);
  const stampO = useTransform(progress, [0.3, 0.36], [0, 1]);
  const callerO = useTransform(progress, [0.36, 0.45], [1, 0.45]);
  // 2 - who can call me
  const pill = useTransform(progress, [0.45, 0.6], ['0%', '100%']);
  // 3 - lock
  const shackle = useTransform(progress, [0.62, 0.75], [-9, 0]);
  const lockBg = useTransform(progress, [0.7, 0.76], ['#e3f1f2', '#22878f']);
  const lockFg = useTransform(progress, [0.7, 0.76], ['#22878f', '#ffffff']);
  const wire = useTransform(progress, [0.6, 0.78], [0, 1]);
  const encO = useTransform(progress, [0.74, 0.82], [0, 1]);

  return (
    <section className="section privacy" id="safety" ref={ref} aria-labelledby="safety-title">
      <div className="wrap privacy-grid">
        <div>
          <Reveal className="kicker">Safety</Reveal>
          <Reveal as="h2" id="safety-title" i={1}>
            You decide who reaches you.
          </Reveal>
          <Reveal as="p" className="section-lead" i={2}>
            TalkLink is for adults who want good conversations. Three controls keep it that way.
          </Reveal>
          <ul className="pv-list">
            {LAYERS.map((l, i) => (
              <Reveal as="li" key={l.title} i={i + 2}>
                <span className="layer-ico">
                  <Icon name={['flag', 'users', 'lock'][i]} size={16} />
                </span>
                <span>
                  <b>{l.title}</b>
                  {l.text}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="pv-stack" aria-hidden="true">
          <Card i={0} progress={progress}>
            <span className="pv-label">Incoming call</span>
            <motion.div className="pv-caller" style={{ opacity: callerO }}>
              <span className="av" style={{ '--c': '#6B787C', width: 42, height: 42, fontSize: 16 }}>
                ?
              </span>
              <span>
                <b>Unknown</b>
                <small>#55210 · rude last time</small>
              </span>
            </motion.div>
            <motion.span className="pv-stamp" style={{ scale: stampS, opacity: stampO }}>
              BLOCKED
            </motion.span>
          </Card>

          <Card i={1} progress={progress}>
            <span className="pv-label">Who can call me</span>
            <div className="pv-seg">
              <motion.span className="pv-seg-pill" style={{ left: useTransform(pill, (v) => `calc(${v} * 0.333 + 4px)`) }} />
              {OPTIONS.map((o) => (
                <span key={o}>{o}</span>
              ))}
            </div>
          </Card>

          <Card i={2} progress={progress}>
            <span className="pv-label">Every call</span>
            <div className="pv-lockrow">
              <span className="av" style={{ '--c': '#1B6E75', width: 38, height: 38, fontSize: 15 }}>
                R
              </span>
              <svg className="pv-wire" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M0 10 H200" className="pv-wire-base" />
                <motion.path d="M0 10 H200" className="pv-wire-on" style={{ pathLength: wire }} />
              </svg>
              <motion.span className="pv-lock" style={{ background: lockBg, color: lockFg }}>
                <svg width="20" height="22" viewBox="0 0 20 22">
                  <motion.path d="M5 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ y: shackle }} />
                  <rect x="3" y="10" width="14" height="10" rx="2.5" fill="currentColor" />
                </svg>
              </motion.span>
              <svg className="pv-wire" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path d="M0 10 H200" className="pv-wire-base" />
                <motion.path d="M0 10 H200" className="pv-wire-on" style={{ pathLength: wire }} />
              </svg>
              <span className="av" style={{ '--c': '#8E44C9', width: 38, height: 38, fontSize: 15 }}>
                M
              </span>
            </div>
            <motion.span className="pv-enc" style={{ opacity: encO }}>
              Encrypted · never recorded
            </motion.span>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
