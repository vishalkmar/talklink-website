import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { HERO } from '../content';
import { DownloadButton } from './ui';

// Hero art: the TalkLink tile cycles through what the app does - chat, voice call, the Android app,
// messages - one glyph flipping into the next. Scrolling away tilts the tile back.

const EASE = [0.22, 1, 0.36, 1];

const BUBBLE =
  'M76 36H180A48 48 0 0 1 228 84V138A48 48 0 0 1 180 186H122L62 226L78 186H76A48 48 0 0 1 28 138V84A48 48 0 0 1 76 36Z';
const HANDSET =
  'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z';

const Bars = ({ y = 111, color = '#22878F' }) =>
  [
    [68, 32],
    [98, 68],
    [128, 96],
    [158, 68],
    [188, 32],
  ].map(([x, h], i) => (
    <motion.rect
      key={x}
      x={x - 8}
      y={y - h / 2}
      width="16"
      height={h}
      rx="8"
      fill={color}
      animate={{ scaleY: [1, 0.5 + (i % 2) * 0.25, 1] }}
      transition={{ duration: 1, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
    />
  ));

// each glyph is drawn in the 256 x 256 tile
const GLYPHS = [
  {
    label: 'Chat',
    art: (
      <g transform="translate(43.5 43.5) scale(0.66)">
        <path d={BUBBLE} fill="#fff" />
        <Bars />
      </g>
    ),
  },
  {
    label: 'Voice calls',
    art: (
      <g>
        <g transform="translate(58 62) scale(5.6)">
          <path d={HANDSET} fill="#fff" />
        </g>
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M${150 + i * 18} ${70 - i * 16} a ${40 + i * 22} ${40 + i * 22} 0 0 1 ${36 + i * 18} ${40 + i * 18}`}
            fill="none"
            stroke="#fff"
            strokeWidth="12"
            strokeLinecap="round"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </g>
    ),
  },
  {
    label: 'Android app',
    art: (
      <g>
        <rect x="80" y="34" width="96" height="188" rx="20" fill="#fff" />
        <rect x="90" y="54" width="76" height="140" rx="8" fill="#1B6E75" />
        <rect x="112" y="42" width="32" height="5" rx="2.5" fill="#1B6E75" />
        <circle cx="128" cy="208" r="6" fill="#1B6E75" />
        <circle cx="128" cy="98" r="18" fill="#7BC6CC" />
        <rect x="104" y="124" width="48" height="8" rx="4" fill="#fff" opacity="0.9" />
        <motion.circle
          cx="128"
          cy="166"
          r="13"
          fill="#2E9E5B"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      </g>
    ),
  },
  {
    label: 'Messages',
    art: (
      <g>
        <rect x="36" y="58" width="150" height="96" rx="34" fill="#fff" />
        <path d="M62 150 L52 182 L94 152 Z" fill="#fff" />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={80 + i * 31}
            cy="106"
            r="10"
            fill="#22878F"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
        <rect x="120" y="140" width="104" height="62" rx="26" fill="#FFD08A" />
        <path d="M200 198 L214 222 L184 200 Z" fill="#FFD08A" />
        <rect x="140" y="160" width="62" height="8" rx="4" fill="#9A6214" opacity="0.6" />
        <rect x="140" y="176" width="40" height="8" rx="4" fill="#9A6214" opacity="0.6" />
      </g>
    ),
  },
];

const Hero = () => {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setIdx((i) => (i + 1) % GLYPHS.length), 2600);
    return () => clearInterval(t);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const out = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });
  const artRotX = useTransform(out, [0, 1], [0, 35]);
  const artY = useTransform(out, [0, 1], [0, 120]);
  const textY = useTransform(out, [0, 1], [0, -60]);
  const textO = useTransform(out, [0, 0.7], [1, 0]);
  const g = GLYPHS[idx];

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <div className="wrap hero-grid" id="download">
        <motion.div style={{ y: textY, opacity: textO }}>
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
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
          <ul className="hero-modes" aria-label="What TalkLink does">
            {GLYPHS.map((m, i) => (
              <li key={m.label} className={i === idx ? 'on' : ''}>
                {m.label}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-blueprint">
            <span className="bp-ring r1" />
            <span className="bp-ring r2" />
            <span className="bp-axis ax" />
            <span className="bp-axis ay" />
          </div>
          <motion.div className="hero-tile-wrap" style={{ rotateX: artRotX, y: artY }}>
            <motion.svg
              className="hero-mark"
              viewBox="-40 -40 336 336"
              initial={{ opacity: 0, scale: 0.7, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <defs>
                <linearGradient id="heroTile" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2AA3AC" />
                  <stop offset="1" stopColor="#1B6E75" />
                </linearGradient>
              </defs>
              <rect width="256" height="256" rx="60" fill="url(#heroTile)" />
              <AnimatePresence mode="wait" initial={false}>
                <motion.g
                  key={g.label}
                  initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 25 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  style={{ transformOrigin: '128px 128px' }}
                >
                  {g.art}
                </motion.g>
              </AnimatePresence>
            </motion.svg>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={g.label}
                className="hero-mode-pill"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {g.label}
              </motion.span>
            </AnimatePresence>
          </motion.div>
          {[
            ['Matched in 3 sec', 'c1'],
            ['#86369', 'c2'],
            ['🔥 7 days', 'c3'],
          ].map(([t, c], i) => (
            <motion.span
              key={c}
              className={`hero-chip ${c}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 1 + i * 0.15 },
                scale: { delay: 1 + i * 0.15 },
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 },
              }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
