import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { CALL_STORY } from '../content';

// A pinned, scroll-driven scene: Rahul walks in from the left and dials Meera's private number,
// Meera walks in from the right and her phone rings, she picks up, the call connects - then the
// chat carries on between them. People and phones are our own drawings (SVG + HTML).

const W = 1100;
const H = 620;
const NUMBER = '#86369';

// scroll progress -> phase
const PHASES = [
  { at: 0, key: 'enterA' },
  { at: 0.12, key: 'dial' },
  { at: 0.3, key: 'calling' },
  { at: 0.48, key: 'ringing' },
  { at: 0.62, key: 'incall' },
  { at: 0.8, key: 'chat' },
];
const phaseAt = (p) => PHASES.reduce((cur, ph) => (p >= ph.at ? ph.key : cur), 'enterA');
const ORDER = PHASES.map((p) => p.key);
const after = (phase, key) => ORDER.indexOf(phase) >= ORDER.indexOf(key);
// caption shown for each phase
const CAPTION = { enterA: 0, dial: 0, calling: 1, ringing: 1, incall: 2, chat: 3 };

// ---------- people ----------
const PEOPLE = {
  rahul: { skin: '#F1C29B', skinDark: '#D9A47C', shirt: '#1B6E75', collar: '#145A60', hair: '#2A2730', long: false },
  meera: { skin: '#C98E6B', skinDark: '#B07655', shirt: '#E8A23A', collar: '#C9852A', hair: '#2E211C', long: true },
};

const Person = ({ who }) => {
  const c = PEOPLE[who];
  return (
    <svg className="person-svg" viewBox="0 0 360 600" aria-hidden="true">
      {c.long ? (
        <path d="M96 330 C78 200 126 140 182 140 C240 140 288 196 268 330 C264 360 240 372 226 360 L230 250 L136 250 L140 360 C124 372 100 360 96 330 Z" fill={c.hair} />
      ) : null}
      {/* body */}
      <path d="M24 600 C24 470 92 404 180 404 C268 404 336 470 336 600 Z" fill={c.shirt} />
      <path d="M150 404 L180 450 L210 404 Z" fill={c.collar} />
      {/* arm going to the phone (the phone sits over the hand) */}
      <path d="M300 470 C 330 520 320 560 290 590" stroke={c.shirt} strokeWidth="54" strokeLinecap="round" fill="none" />
      <path d="M300 470 C 330 520 320 560 290 590" stroke={c.collar} strokeWidth="54" strokeLinecap="round" fill="none" opacity="0.25" />
      {/* neck + head */}
      <rect x="152" y="320" width="56" height="96" rx="24" fill={c.skinDark} />
      <circle cx="106" cy="262" r="15" fill={c.skinDark} />
      <circle cx="254" cy="262" r="15" fill={c.skinDark} />
      <ellipse cx="180" cy="250" rx="74" ry="86" fill={c.skin} />
      {/* hair */}
      {c.long ? (
        <path d="M104 250 C100 170 150 150 184 152 C236 154 262 196 256 246 C232 214 214 192 176 198 C150 214 126 232 104 250 Z" fill={c.hair} />
      ) : (
        <path d="M104 250 C96 166 150 146 184 150 C236 152 266 186 256 246 C246 212 226 196 196 196 C160 196 126 210 104 250 Z" fill={c.hair} />
      )}
      {/* face, looking a little toward the phone */}
      <ellipse cx="160" cy="262" rx="7" ry="9" fill="#1B2A2F" />
      <ellipse cx="212" cy="262" rx="7" ry="9" fill="#1B2A2F" />
      <circle cx="146" cy="290" r="10" fill="#F0838A" opacity="0.25" />
      <circle cx="226" cy="290" r="10" fill="#F0838A" opacity="0.25" />
      <path d="M166 298 Q186 316 206 298" stroke="#1B2A2F" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
};

// ---------- phone screens (HTML) ----------
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '#', '0', '⌫'];

const Screen = ({ mode, digits, secs, chatN, name, from }) => {
  const time = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const typed = NUMBER.slice(0, digits);
  const nextKey = NUMBER[digits] || '';
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={mode}
        className={`scr scr-${mode}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
      >
        {mode === 'idle' ? (
          <>
            <span className="scr-logo">TalkLink</span>
            <span className="scr-lock">9:41</span>
          </>
        ) : null}
        {mode === 'dial' ? (
          <>
            <span className="scr-title">Dialpad</span>
            <span className="scr-number">{typed || ' '}</span>
            <span className="scr-hint">{digits >= NUMBER.length ? 'Meera · online' : 'Private number'}</span>
            <span className="scr-keys">
              {KEYS.map((k) => (
                <i key={k} className={k === nextKey ? 'hit' : ''}>
                  {k}
                </i>
              ))}
            </span>
            <span className={`scr-call${digits >= NUMBER.length ? ' ready' : ''}`}>
              <PhoneGlyph />
            </span>
          </>
        ) : null}
        {mode === 'calling' || mode === 'ringing' || mode === 'incall' ? (
          <>
            <span className={`scr-av${mode === 'incall' ? ' talking' : ''}`}>{name[0]}</span>
            <b className="scr-name">{name}</b>
            <span className="scr-sub">
              {mode === 'calling' ? 'Calling…' : mode === 'ringing' ? 'Incoming TalkLink call' : time}
            </span>
            {mode === 'incall' ? (
              <span className="scr-wave">
                {Array.from({ length: 9 }, (_, i) => (
                  <i key={i} style={{ animationDelay: `${i * 0.08}s` }} />
                ))}
              </span>
            ) : null}
            <span className="scr-btns">
              {mode === 'ringing' ? (
                <>
                  <i className="end">
                    <PhoneGlyph />
                  </i>
                  <i className="ok pulse">
                    <PhoneGlyph />
                  </i>
                </>
              ) : (
                <>
                  <i className="soft">🎤</i>
                  <i className="end">
                    <PhoneGlyph />
                  </i>
                  <i className="soft">🔊</i>
                </>
              )}
            </span>
          </>
        ) : null}
        {mode === 'chat' ? (
          <>
            <span className="scr-chat-head">
              <i>{name[0]}</i>
              {name}
            </span>
            <span className="scr-chat">
              {CALL_STORY.chat.slice(0, chatN).map((m, i) => (
                <motion.em
                  key={i}
                  className={(m.from === 'rahul') === (from === 'Rahul') ? 'out' : 'in'}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {m.text}
                </motion.em>
              ))}
            </span>
          </>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
};

const PhoneGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
    />
  </svg>
);

/** A hand holding a phone: palm behind, thumb in front, fingers round the far edge. */
const HandPhone = ({ who, side, shake, children }) => {
  const c = PEOPLE[who];
  return (
    <div className={`hand-phone hp-${side}${shake ? ' shake' : ''}`} style={{ '--skin': c.skin, '--skin-d': c.skinDark }}>
      <span className="palm" />
      <div className="phone">
        <span className="notch" />
        <div className="phone-screen">{children}</div>
      </div>
      <span className="thumb" />
      <span className="finger f1" />
      <span className="finger f2" />
      <span className="finger f3" />
    </div>
  );
};

const CallStory = () => {
  const ref = useRef(null);
  const stageRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const fixed = useMotionValue(0.9);
  const progress = reduce ? fixed : smooth;

  const [phase, setPhase] = useState(reduce ? 'chat' : 'enterA');
  const [digits, setDigits] = useState(reduce ? NUMBER.length : 0);
  const [secs, setSecs] = useState(reduce ? 42 : 0);
  const [chatN, setChatN] = useState(reduce ? CALL_STORY.chat.length : 0);
  const [scale, setScale] = useState(1);

  useMotionValueEvent(progress, 'change', (p) => {
    setPhase(phaseAt(p));
    setDigits(Math.max(0, Math.min(NUMBER.length, Math.floor(((p - 0.13) / 0.15) * NUMBER.length))));
    setSecs(Math.max(0, Math.floor((p - 0.64) * 240)));
    setChatN(Math.max(0, Math.min(CALL_STORY.chat.length, Math.floor((p - 0.8) / 0.045))));
  });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const fit = () => {
      const r = el.getBoundingClientRect();
      // narrow screens crop the outer shoulders (the phones stay in view)
      const visW = r.width < 700 ? W - 300 : W;
      setScale(Math.min(1.05, r.width / visW, (r.height - 12) / H));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // people slide in from both sides
  const ax = useTransform(progress, [0, 0.1], [-420, 0]);
  const ao = useTransform(progress, [0, 0.06], [0, 1]);
  const bx = useTransform(progress, [0.36, 0.47], [420, 0]);
  const bo = useTransform(progress, [0.36, 0.42], [0, 1]);
  // the call line between the two phones draws in when Meera picks up
  const line = useTransform(progress, [0.62, 0.7], [0, 1]);

  const aMode = phase === 'enterA' ? 'idle' : phase === 'dial' ? 'dial' : phase === 'calling' || phase === 'ringing' ? 'calling' : phase === 'incall' ? 'incall' : 'chat';
  const bMode = phase === 'ringing' ? 'ringing' : phase === 'incall' ? 'incall' : phase === 'chat' ? 'chat' : 'idle';
  const cap = CALL_STORY.steps[CAPTION[phase]];

  return (
    <section className="callstory" id="call" ref={ref} aria-labelledby="call-title">
      <div className="callstory-pin">
        <div className="wrap callstory-head">
          <span className="kicker">Calling</span>
          <h2 id="call-title">{CALL_STORY.title}</h2>
          <div className="cs-caption" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={cap.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <span className="cs-n">{cap.n}</span>
                {cap.text}
              </motion.p>
            </AnimatePresence>
          </div>
          {/* the whole story as plain text, for search engines and screen readers */}
          <ol className="sr-only">
            {CALL_STORY.steps.map((s) => (
              <li key={s.n}>{s.text}</li>
            ))}
          </ol>
        </div>

        <div className="cs-stage" ref={stageRef} aria-hidden="true">
          <div className="cs-scene" style={{ width: W, height: H, transform: `translate(-50%, -50%) scale(${scale})` }}>
            {/* signal between the phones */}
            <svg className="cs-signal" viewBox={`0 0 ${W} ${H}`}>
              {phase === 'calling' || phase === 'ringing'
                ? [30, 60, 90, 120].map((r, i) => (
                    <path key={r} className="ring-arc" style={{ animationDelay: `${i * 0.25}s` }} d={`M415 ${415 - r} A ${r} ${r} 0 0 1 415 ${415 + r}`} />
                  ))
                : null}
              <motion.path
                className="call-line"
                d="M415 400 C 490 280, 610 280, 685 400"
                style={{ pathLength: line, opacity: after(phase, 'incall') ? 1 : 0 }}
              />
              {after(phase, 'incall') ? (
                <path className="call-line flow" d="M415 400 C 490 280, 610 280, 685 400" />
              ) : null}
            </svg>
            {phase === 'incall' ? (
              <div className="cs-badge">
                <span className="core-dot" /> Connected · encrypted
              </div>
            ) : null}
            {phase === 'chat' ? (
              <div className="cs-badge">💬 Chat continues after the call</div>
            ) : null}
            <AnimatePresence>
              {phase === 'chat' && chatN > 0 ? (
                <motion.div
                  key={chatN}
                  className={`cs-float ${CALL_STORY.chat[chatN - 1].from}`}
                  initial={{ opacity: 0, y: 40, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                >
                  {CALL_STORY.chat[chatN - 1].text}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.div className="person p-left" style={{ x: ax, opacity: ao }}>
              <Person who="rahul" />
              <HandPhone who="rahul" side="right">
                <Screen mode={aMode} digits={digits} secs={secs} chatN={chatN} name="Meera" from="Rahul" />
              </HandPhone>
              <span className="name-tag">Rahul</span>
            </motion.div>

            <motion.div className="person p-right" style={{ x: bx, opacity: bo }}>
              <Person who="meera" />
              <HandPhone who="meera" side="left" shake={phase === 'ringing'}>
                <Screen mode={bMode} digits={0} secs={secs} chatN={chatN} name="Rahul" from="Meera" />
              </HandPhone>
              <span className="name-tag">Meera</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallStory;
