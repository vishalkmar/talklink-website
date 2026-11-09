import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { HERO, CALL_STORY } from '../content';
import { DownloadButton } from './ui';
import { Screen } from './CallStory';
import { CoinPart, NumberPart, StreakPart, VoicePart } from './parts';

// Hero: a phone in the middle plays a real TalkLink call on a loop (dial -> calling -> talking ->
// chat). Around it, pieces of the app fly in from every side, settle, float - and spread out
// with depth as you scroll away.

const EASE = [0.22, 1, 0.36, 1];
const NUMBER_LEN = 6;

// the call loop, in 0.1 s ticks
const LOOP = [
  { mode: 'dial', len: 22 },
  { mode: 'calling', len: 16 },
  { mode: 'incall', len: 30 },
  { mode: 'chat', len: 28 },
];
const LOOP_LEN = LOOP.reduce((s, x) => s + x.len, 0);
const stepAt = (t) => {
  let k = t % LOOP_LEN;
  for (const s of LOOP) {
    if (k < s.len) return { mode: s.mode, k };
    k -= s.len;
  }
  return { mode: 'dial', k: 0 };
};
const LABEL = { dial: 'Dialing #86369', calling: 'Ringing…', incall: 'On a call', chat: 'Chatting' };

const CallerCard = () => (
  <div className="part p-caller">
    <span className="av" style={{ '--c': '#8E44C9', width: 40, height: 40, fontSize: 17 }}>
      M
    </span>
    <span>
      <b>Meera</b>
      <small>
        <i className="dot-on" /> online now
      </small>
    </span>
  </div>
);

const MatchChip = () => (
  <div className="part p-chip">
    <span className="p-chip-ico">⚡</span>
    Matched in 3 sec
  </div>
);

const Bubble = ({ text, mine }) => <div className={`part p-bubble${mine ? ' mine' : ''}`}>{text}</div>;

// where each floating piece sits (% of the art box), where it flies in from, and its scroll depth
const PIECES = [
  { key: 'caller', C: CallerCard, at: [2, 12], from: [-260, -40], depth: 1.4, delay: 0.5 },
  { key: 'number', C: NumberPart, at: [70, 6], from: [220, -180], depth: 1.1, delay: 0.62 },
  { key: 'voice', C: VoicePart, at: [64, 46], from: [300, 20], depth: 1.6, delay: 0.74 },
  { key: 'match', C: MatchChip, at: [-4, 52], from: [-300, 60], depth: 1.2, delay: 0.86 },
  { key: 'bubble', C: () => <Bubble text="Hey! 👋 Kaise ho?" />, at: [6, 78], from: [-200, 220], depth: 1.5, delay: 0.98 },
  { key: 'streak', C: StreakPart, at: [62, 76], from: [240, 220], depth: 1.3, delay: 1.1 },
  { key: 'coin', C: CoinPart, at: [70, 27], from: [280, -60], depth: 0.9, delay: 1.22 },
];

const Piece = ({ p, out, i }) => {
  const dx = p.at[0] < 40 ? -1 : 1;
  const x = useTransform(out, [0, 1], [0, dx * 160 * p.depth]);
  const y = useTransform(out, [0, 1], [0, (p.at[1] < 50 ? -1 : 1) * 90 * p.depth]);
  const C = p.C;
  return (
    <motion.div className="piece" style={{ left: `${p.at[0]}%`, top: `${p.at[1]}%`, x, y }}>
      <motion.div
        initial={{ opacity: 0, x: p.from[0], y: p.from[1], scale: 0.6, rotate: dx * 18 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 70, damping: 14, delay: p.delay }}
      >
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.4 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
          <C />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Hero = () => {
  const ref = useRef(null);
  const artRef = useRef(null);
  const [tick, setTick] = useState(30); // start on "calling" in the pre-rendered HTML
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    setTick(0);
    const t = setInterval(() => setTick((v) => v + 1), 100);
    return () => clearInterval(t);
  }, []);
  const { mode, k } = stepAt(tick);
  const digits = mode === 'dial' ? Math.min(NUMBER_LEN, Math.floor(k / 3)) : NUMBER_LEN;
  const secs = mode === 'incall' ? Math.floor(k / 2) + 4 : 0;
  const chatN = mode === 'chat' ? Math.min(CALL_STORY.chat.length, Math.floor(k / 6) + 1) : 0;

  // pointer tilt for the phone
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-1, 1], [-14, 6]), { stiffness: 80, damping: 15 });
  const rotX = useSpring(useTransform(py, [-1, 1], [10, -4]), { stiffness: 80, damping: 15 });
  const onMove = (e) => {
    const r = artRef.current?.getBoundingClientRect();
    if (!r) return;
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const out = useSpring(scrollYProgress, { stiffness: 70, damping: 20 });
  const phoneY = useTransform(out, [0, 1], [0, 140]);
  const phoneS = useTransform(out, [0, 1], [1, 0.85]);
  const textY = useTransform(out, [0, 1], [0, -60]);
  const textO = useTransform(out, [0, 0.7], [1, 0]);

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title" onPointerMove={onMove}>
      <div className="wrap hero-grid" id="download">
        <motion.div style={{ y: textY, opacity: textO }}>
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <span className="eyebrow-dot" />
            {HERO.eyebrow}
          </motion.span>
          <h1 id="hero-title">
            {HERO.title.map((line, li) => (
              <span className={`line${li ? ' accent' : ''}`} key={line}>
                <motion.span
                  className="line-in"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, delay: 0.1 + li * 0.12, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-text" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: EASE }}>
            {HERO.text}
          </motion.p>
          <motion.div className="hero-cta" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: EASE }}>
            <DownloadButton />
            <a className="btn btn-ghost" href="#call">
              See a call happen
            </a>
          </motion.div>
          <motion.div className="hero-live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <span className="live-dot" />
            <span className="hero-live-text">{LABEL[mode]}</span>
            <span className="hero-live-steps" aria-hidden="true">
              {LOOP.map((s) => (
                <i key={s.mode} className={s.mode === mode ? 'on' : ''} />
              ))}
            </span>
          </motion.div>
        </motion.div>

        <div className="hero-art" ref={artRef} aria-hidden="true">
          <div className="hero-glow" />
          {mode === 'calling' || mode === 'incall'
            ? [0, 1, 2].map((i) => <span key={i} className="hero-ring" style={{ animationDelay: `${i * 0.6}s` }} />)
            : null}
          <motion.div className="hero-phone-wrap" style={{ y: phoneY, scale: phoneS, rotateX: rotX, rotateY: rotY }}>
            <motion.div
              className="hero-phone"
              initial={{ opacity: 0, y: 80, rotateX: 30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, ease: EASE }}
            >
              <span className="notch" />
              <div className="phone-screen">
                <Screen mode={mode} digits={digits} secs={secs} chatN={chatN} name="Meera" from="Rahul" />
              </div>
            </motion.div>
          </motion.div>
          {PIECES.map((p, i) => (
            <Piece key={p.key} p={p} out={out} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
