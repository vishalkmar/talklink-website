import React from 'react';
import { motion } from 'framer-motion';
import { HERO, STATS, SITE } from '../content';
import { DownloadButton, Icon, Tick, CountUp } from './ui';
import PhoneMock from './PhoneMock';

// The headline and intro are in the pre-rendered HTML (fast first paint / SEO): they only slide.
const slide = (delay = 0) => ({
  initial: { y: 18 },
  animate: { y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const FloatChip = ({ style, icon, tone = '', title, sub, delay, className = '' }) => (
  <motion.div
    className={`float-chip ${className}`}
    style={style}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
    transition={{ opacity: { delay }, scale: { delay }, y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay } }}
  >
    <span className={`chip-icon ${tone}`}>
      <Icon name={icon} size={18} />
    </span>
    <span>
      {title}
      <small>{sub}</small>
    </span>
  </motion.div>
);

const Hero = () => (
  <section className="hero" id="top" aria-labelledby="hero-title">
    <div className="bg-glow">
      <div className="bg-grid" />
    </div>
    <div className="wrap hero-grid" id="download">
      <div>
        <motion.span className="eyebrow" {...up(0)}>
          <span className="eyebrow-dot" />
          {HERO.eyebrow}
        </motion.span>
        <motion.h1 id="hero-title" {...slide(0.08)}>
          {HERO.title[0]} <span className="accent">{HERO.title[1]}</span>
        </motion.h1>
        <motion.p className="hero-text" {...slide(0.2)}>
          {HERO.text}
        </motion.p>
        <motion.div className="hero-cta" {...slide(0.28)}>
          <DownloadButton />
          <a className="btn btn-ghost btn-glass" href="#install">
            How to install
          </a>
        </motion.div>
        <motion.p className="hero-note" {...up(0.34)}>
          Direct download from the official site - not on the Play Store yet. Free to install and free to talk.
        </motion.p>
        <motion.ul className="hero-points" {...up(0.4)}>
          {HERO.points.map((p) => (
            <li key={p}>
              <Tick />
              {p}
            </li>
          ))}
        </motion.ul>
      </div>

      <motion.div
        className="stage phone-anchor"
        data-phone
        data-screen="home"
        data-prop="sparks"
        data-rot="8,-22,0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        {/* shown until the 3D phone is ready, and on phones without WebGL */}
        <div className="stage-fallback">
          <PhoneMock screen="home" label="TalkLink Call tab with recent calls and the Start talking button" />
        </div>
        <FloatChip style={{ top: '4%', left: '-2%' }} icon="wave" title="Matched in 3 sec" sub="audio or text" delay={0.9} />
        <FloatChip
          style={{ bottom: '20%', right: '-2%' }}
          icon="flame"
          tone="flame"
          title="7 day streak 🔥"
          sub="+200 bonus credits"
          delay={1.2}
        />
        <FloatChip
          className="hide-sm"
          style={{ bottom: '4%', left: '4%' }}
          icon="lock"
          tone="gold"
          title="# 86369"
          sub="your private number"
          delay={1.5}
        />
      </motion.div>
    </div>

    <div className="wrap stats" role="list" aria-label={`${SITE.name} in numbers`}>
      {STATS.map((s, i) => (
        <motion.div
          className="stat glass"
          role="listitem"
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.6 }}
        >
          <div className="stat-value">
            <CountUp value={s.value} />
          </div>
          <div className="stat-label">{s.label}</div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Hero;
