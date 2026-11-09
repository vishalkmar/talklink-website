import React from 'react';
import { Icon } from './ui';

// Small, real pieces of the TalkLink UI, built in HTML. The page assembles them, explodes them and
// slides them around - there is no phone mock-up on this site.

const Avatar = ({ letter, color, size = 40, ring = false }) => (
  <span className={`av${ring ? ' av-ring' : ''}`} style={{ '--c': color, width: size, height: size, fontSize: size * 0.42 }}>
    {letter}
  </span>
);

export const MatchPart = () => (
  <div className="part p-match">
    <div className="p-match-row">
      <Avatar letter="R" color="#7BC6CC" size={44} />
      <span className="p-link">
        <i />
        <i />
        <i />
      </span>
      <Avatar letter="M" color="#8E44C9" size={44} />
    </div>
    <b>Matched</b>
    <small>Meera · 3 sec</small>
  </div>
);

export const CallPart = () => (
  <div className="part p-call">
    <div className="p-call-top">
      <span className="p-live" />
      <b>12:34</b>
      <small>Encrypted</small>
    </div>
    <div className="p-call-btns">
      <span className="cb">
        <Icon name="mic" size={16} />
      </span>
      <span className="cb on">
        <Icon name="wave" size={16} />
      </span>
      <span className="cb end">
        <Icon name="phone" size={16} />
      </span>
    </div>
  </div>
);

const BARS = [8, 14, 22, 12, 26, 18, 9, 20, 28, 15, 10, 22, 16, 8, 18, 24, 12];
export const VoicePart = ({ big = false }) => (
  <div className={`part p-voice${big ? ' big' : ''}`}>
    <span className="p-play">
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4v16l13-8z" fill="currentColor" />
      </svg>
    </span>
    <span className="p-wave">
      {BARS.map((h, i) => (
        <i key={i} style={{ height: h, animationDelay: `${i * 0.07}s` }} />
      ))}
    </span>
    <small>0:12</small>
  </div>
);

export const OncePart = () => (
  <div className="part p-once">
    <span className="p-once-ico">1</span>
    <span>
      <b>View once</b>
      <small>Tap to open</small>
    </span>
  </div>
);

export const StatusPart = () => (
  <div className="part p-status">
    <span className="p-ring">
      <Avatar letter="D" color="#1B6E75" size={46} />
    </span>
    <span>
      <b>Diya</b>
      <small>2h ago · 3 updates</small>
    </span>
  </div>
);

export const StreakPart = () => (
  <div className="part p-streak">
    <span className="p-flame">🔥</span>
    <span>
      <b>7</b>
      <small>day streak</small>
    </span>
    <em>+200</em>
  </div>
);

export const NumberPart = () => (
  <div className="part p-number">
    <small>Private number</small>
    <b>#86369</b>
  </div>
);

export const CoinPart = () => (
  <div className="part p-coin">
    <span className="p-coin-ico">
      <Icon name="coin" size={18} />
    </span>
    <b>1,140</b>
    <small>credits</small>
  </div>
);
