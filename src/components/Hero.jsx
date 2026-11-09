import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { HERO } from '../content';
import { DownloadButton } from './ui';

// The hero art is the TalkLink mark itself, built from its parts: the tile, the chat bubble and the
// five voice bars fly in and lock together on load; scrolling away pulls them apart again.

const BUBBLE =
  'M76 36H180A48 48 0 0 1 228 84V138A48 48 0 0 1 180 186H122L62 226L78 186H76A48 48 0 0 1 28 138V84A48 48 0 0 1 76 36Z';
const BARS = [
  { x: 68, h: 32 },
  { x: 98, h: 68 },
  { x: 128, h: 96 },
  { x: 158, h: 68 },
  { x: 188, h: 32 },
];
const EASE = [0.22, 1, 0.36, 1];

const Bar = ({ b, i, out }) => {
  const dir = i - 2;
  const y = useTransform(out, [0, 1], [0, 140 + Math.abs(dir) * 60]);
  const x = useTransform(out, [0, 1], [0, dir * 70]);
  const rotate = useTransform(out, [0, 1], [0, dir * 25]);
  return (
    <motion.g style={{ x, y, rotate }}>
      <motion.rect
        x={b.x - 8}
        y={111 - b.h / 2}
        width="16"
        height={b.h}
        rx="8"
        fill="#22878F"
        initial={{ opacity: 0, y: -160 - i * 20 }}
        animate={{ opacity: 1, y: 0, scaleY: [1, 0.55 + (i % 2) * 0.2, 1] }}
        transition={{
          opacity: { delay: 0.9 + i * 0.08, duration: 0.3 },
          y: { delay: 0.9 + i * 0.08, duration: 0.7, ease: EASE },
          scaleY: { delay: 1.8 + i * 0.1, duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
    </motion.g>
  );
};

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const out = useSpring(scrollYProgress, { stiffness: 100, damping: 24 });
  const tileRot = useTransform(out, [0, 1], [0, -18]);
  const tileY = useTransform(out, [0, 1], [0, 80]);
  const bubbleY = useTransform(out, [0, 1], [0, -120]);
  const bubbleRot = useTransform(out, [0, 1], [0, 12]);
  const textY = useTransform(out, [0, 1], [0, -60]);
  const textO = useTransform(out, [0, 0.7], [1, 0]);

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
            {[HERO.title[0], HERO.title[1]].map((line, li) => (
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
          <motion.p
            className="hero-text"
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {HERO.text}
          </motion.p>
          <motion.div
            className="hero-cta"
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
          >
            <DownloadButton />
            <a className="btn btn-ghost" href="#how">
              See how it works
            </a>
          </motion.div>
        </motion.div>

        <div className="hero-art" aria-hidden="true">
          <div className="hero-blueprint">
            <span className="bp-ring r1" />
            <span className="bp-ring r2" />
            <span className="bp-axis ax" />
            <span className="bp-axis ay" />
          </div>
          <svg className="hero-mark" viewBox="-40 -40 336 336">
            <defs>
              <linearGradient id="heroTile" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#2AA3AC" />
                <stop offset="1" stopColor="#1B6E75" />
              </linearGradient>
            </defs>
            <motion.g style={{ rotate: tileRot, y: tileY }}>
              <motion.rect
                width="256"
                height="256"
                rx="60"
                fill="url(#heroTile)"
                initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            </motion.g>
            <motion.g style={{ y: bubbleY, rotate: bubbleRot }}>
              <g transform="translate(43.5 43.5) scale(0.66)">
                <motion.path
                  d={BUBBLE}
                  fill="#fff"
                  initial={{ opacity: 0, x: 220, y: -120, rotate: 30 }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
                {BARS.map((b, i) => (
                  <Bar key={b.x} b={b} i={i} out={out} />
                ))}
              </g>
            </motion.g>
          </svg>
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
                opacity: { delay: 1.5 + i * 0.15 },
                scale: { delay: 1.5 + i * 0.15 },
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
