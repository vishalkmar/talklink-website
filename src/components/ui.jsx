import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { SITE } from '../content';

// 24x24 stroke icons (our own, no icon font)
const PATHS = {
  download: 'M12 3v12m0 0 5-5m-5 5-5-5M4 19h16',
  dial: 'M6 5h.01M12 5h.01M18 5h.01M6 11h.01M12 11h.01M18 11h.01M6 17h.01M12 17h.01M18 17h.01',
  wave: 'M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4M21 12h0',
  users:
    'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm13 9v-1a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  spark: 'M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8',
  phone:
    'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Zm6 4v2',
  mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  once: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-1.5-12.5L12 7v10',
  check2: 'm2 12 5 5L18 6m-6 11 1 1L22 9',
  image: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm0 12 5-5 4 4 3-3 5 5M15.5 9.5h.01',
  eye: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  flame: 'M12 22c4 0 7-3 7-7 0-4-3-6-4-10-1.5 2-2 3.5-2 5-1.5-1-2.5-3-2.5-5C7 7 5 10.5 5 15c0 4 3 7 7 7Z',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 21V7m0 0H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7Zm0 0h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7Z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  mail: 'M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm-1 1 9 7 9-7',
  check: 'm5 12 5 5L20 7',
  plus: 'M12 5v14M5 12h14',
  android:
    'M7 10v6m10-6v6M8.5 4.5 7 3m8.5 1.5L17 3M6 9a6 6 0 0 1 12 0v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1Zm3-3h.01M15 6h.01M9 18v3m6-3v3',
  coin: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v8m-2.5-6h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4',
};

export const Icon = ({ name, size = 24, stroke = 2, fill = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d={PATHS[name]}
      fill={fill ? 'currentColor' : 'none'}
      stroke={fill ? 'none' : 'currentColor'}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** The TalkLink mark: white chat bubble with a teal voice wave (same paths as the app icon). */
export const Logo = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 256 256" aria-hidden="true" focusable="false">
    <rect width="256" height="256" rx="60" fill="url(#lg)" />
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2AA3AC" />
        <stop offset="1" stopColor="#1B6E75" />
      </linearGradient>
    </defs>
    <g transform="translate(43.5 43.5) scale(0.66)">
      <path d="M76 36H180A48 48 0 0 1 228 84V138A48 48 0 0 1 180 186H122L62 226L78 186H76A48 48 0 0 1 28 138V84A48 48 0 0 1 76 36Z" fill="#fff" />
      {[
        'M68 91A8 8 0 0 1 76 99V123A8 8 0 0 1 60 123V99A8 8 0 0 1 68 91Z',
        'M98 73A8 8 0 0 1 106 81V141A8 8 0 0 1 90 141V81A8 8 0 0 1 98 73Z',
        'M128 59A8 8 0 0 1 136 67V155A8 8 0 0 1 120 155V67A8 8 0 0 1 128 59Z',
        'M158 73A8 8 0 0 1 166 81V141A8 8 0 0 1 150 141V81A8 8 0 0 1 158 73Z',
        'M188 91A8 8 0 0 1 196 99V123A8 8 0 0 1 180 123V99A8 8 0 0 1 188 91Z',
      ].map((d) => (
        <path key={d} d={d} fill="#22878F" />
      ))}
    </g>
  </svg>
);

export const Tick = () => (
  <span className="tick">
    <Icon name="check" size={13} stroke={3} />
  </span>
);

/** The one download action of the page: a direct APK link (not the Play Store). */
export const DownloadButton = ({ size = 'lg', label = 'Download APK', className = '' }) => (
  <a
    className={`btn btn-primary btn-${size} ${className}`}
    href={SITE.apkUrl}
    download="TalkLink.apk"
    type="application/vnd.android.package-archive"
    aria-label={`${label} - TalkLink for Android, version ${SITE.apkVersion}, ${SITE.apkSize}`}
  >
    <span className="btn-icon">
      <Icon name="download" size={size === 'sm' ? 16 : 20} stroke={2.4} />
    </span>
    <span>
      {label}
      {size === 'lg' ? (
        <span className="btn-sub">
          v{SITE.apkVersion} · {SITE.apkSize} · {SITE.minAndroid}
        </span>
      ) : null}
    </span>
  </a>
);

const reveal = {
  hidden: { opacity: 0, y: 36, filter: 'blur(8px)' },
  show: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Fades, un-blurs and lifts its child into view on scroll; `i` staggers siblings. */
export const Reveal = ({ as = 'div', i = 0, children, ...rest }) => {
  const M = motion[as];
  return (
    <M variants={reveal} custom={i} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} {...rest}>
      {children}
    </M>
  );
};

/** Heading whose words rise one by one out of a mask. The full text stays in the HTML for SEO. */
export const WordsReveal = ({ text, as = 'h2', className = '', id }) => {
  const M = motion[as];
  const words = text.split(' ');
  return (
    <M
      id={id}
      className={`words ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.06 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <React.Fragment key={`${w}-${i}`}>
          <span className="word" aria-hidden="true">
            <motion.span
              className="word-in"
              variants={{ hidden: { y: '110%' }, show: { y: '0%', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </M>
  );
};

/** "3 sec", "100", "24 h" - counts up when scrolled into view; the final value is in the pre-rendered HTML. */
export const CountUp = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const match = /^([\d,]+)(.*)$/.exec(value);
  const end = match ? Number(match[1].replace(/,/g, '')) : null;
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!inView || end === null || end === 0) return undefined;
    const controls = animate(0, end, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(`${Math.round(v).toLocaleString('en-IN')}${match[2]}`),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return <span ref={ref}>{shown}</span>;
};

// clay tile colours, from the app's accent palette
const TONES = {
  teal: ['#9FE3E7', '#22878F', '#145A60'],
  gold: ['#FFE0A8', '#E8A23A', '#9A6214'],
  flame: ['#FFC4A0', '#F4732A', '#A8410F'],
  purple: ['#E2C9F5', '#8E44C9', '#5A2287'],
  blue: ['#BBD7F7', '#2E7CC4', '#164C82'],
  green: ['#B7E8CB', '#2E9E5B', '#17603A'],
  pink: ['#F7C3DD', '#D63384', '#8E1C55'],
};

/** Glossy "clay" 3D icon tile that tilts toward the pointer. */
export const Icon3D = ({ name, tone = 'teal', size = 64 }) => {
  const [a, b, c] = TONES[tone] || TONES.teal;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 15 });
  const sry = useSpring(ry, { stiffness: 200, damping: 15 });
  const shadowX = useTransform(sry, (v) => `${-v * 0.6}px`);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 30);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 30);
  };
  return (
    <motion.div
      className="icon3d"
      style={{ width: size, height: size, rotateX: srx, rotateY: sry, '--a': a, '--b': b, '--c': c, '--sx': shadowX }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <span className="icon3d-glyph">
        <Icon name={name} size={size * 0.46} stroke={2.4} />
      </span>
    </motion.div>
  );
};
