// TalkLink's own screens drawn on a 2D canvas (the 3D phone uses it as its screen texture; the
// no-WebGL fallback draws it into a plain <canvas>). Colours and layout follow the app:
// teal #22878F, off-white #F4F6F5 background, white cards, ink #1B2A2F text.
// drawScreenMode(ctx, mode, t) returns a key that changes only when the picture changes.

export const SCREEN_W = 540;
export const SCREEN_H = 1140;

export const C = {
  teal: '#22878F',
  tealDark: '#1B6E75',
  tealSoft: '#E3F1F2',
  tealLight: '#7BC6CC',
  red: '#F04A55',
  ink: '#1B2A2F',
  grey: '#8A9496',
  bg: '#F4F6F5',
  card: '#FFFFFF',
  line: '#E6E9E8',
  gold: '#E8A23A',
  flame: '#F4732A',
  green: '#2E9E5B',
  blue: '#2F80ED',
  purple: '#8E44C9',
};

const F = '"Inter", system-ui, sans-serif';
const FD = '"Outfit", "Inter", system-ui, sans-serif';
const clamp = (x) => Math.min(1, Math.max(0, x));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);

export const rr = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const fillRR = (ctx, x, y, w, h, r, color) => {
  rr(ctx, x, y, w, h, r);
  ctx.fillStyle = color;
  ctx.fill();
};

const text = (ctx, s, x, y, { size = 24, weight = 600, color = C.ink, align = 'left', font = F } = {}) => {
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.fillText(s, x, y);
};

const statusBar = (ctx, dark) => {
  text(ctx, '9:41', 40, 50, { size: 24, color: dark ? '#fff' : C.ink });
  text(ctx, '5G  ▮▮▮  92%', SCREEN_W - 40, 50, { size: 20, color: dark ? '#fff' : C.ink, align: 'right' });
};

const avatar = (ctx, x, y, r, color, letter) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  text(ctx, letter, x, y + r * 0.36, { size: r, weight: 700, color: '#fff', align: 'center', font: FD });
};

const icon = (ctx, d, x, y, s, color, stroke = 2.4) => {
  ctx.save();
  ctx.translate(x - s / 2, y - s / 2);
  ctx.scale(s / 24, s / 24);
  ctx.strokeStyle = color;
  ctx.lineWidth = stroke;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(d));
  ctx.restore();
};

const I = {
  phone:
    'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z',
  mic: 'M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3',
  speaker: 'M11 5 6 9H2v6h4l5 4V5Zm4.5 3.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
  chat: 'M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12Z',
  dial: 'M6 5h.01M12 5h.01M18 5h.01M6 11h.01M12 11h.01M18 11h.01M6 17h.01M12 17h.01M18 17h.01',
  play: 'M7 4v16l13-8L7 4Z',
  send: 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
  download: 'M12 3v12m0 0 5-5m-5 5-5-5M4 19h16',
  check: 'm5 12 5 5L20 7',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
  plus: 'M12 5v14M5 12h14',
};

const tabBar = (ctx, active) => {
  fillRR(ctx, 40, SCREEN_H - 120, SCREEN_W - 80, 84, 42, C.card);
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  rr(ctx, 40, SCREEN_H - 120, SCREEN_W - 80, 84, 42);
  ctx.stroke();
  ['Call', 'Chat', 'Goals', 'Profile'].forEach((name, i) => {
    const x = 40 + ((SCREEN_W - 80) / 4) * (i + 0.5);
    const on = name === active;
    ctx.beginPath();
    ctx.arc(x, SCREEN_H - 90, 9, 0, Math.PI * 2);
    ctx.fillStyle = on ? C.teal : '#C9CFCE';
    ctx.fill();
    text(ctx, name, x, SCREEN_H - 56, { size: 17, color: on ? C.teal : C.grey, align: 'center', weight: on ? 700 : 500 });
  });
};

// ---------- Call tab (hero) ----------
const drawHome = (ctx, t) => {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx);
  text(ctx, 'Call', 40, 140, { size: 52, weight: 800, font: FD });
  fillRR(ctx, 260, 104, 130, 48, 24, C.card);
  text(ctx, '🪙 1,140', 325, 137, { size: 21, weight: 700, align: 'center' });
  const bounce = Math.abs(Math.sin(t * 2.2)) * 4;
  text(ctx, '🔥 7', 444, 137 - bounce, { size: 24, weight: 800, align: 'center' });
  // search + dialpad
  fillRR(ctx, 40, 178, 380, 60, 20, '#E7EBEA');
  text(ctx, '⌕  Search', 66, 217, { size: 21, color: C.grey, weight: 500 });
  fillRR(ctx, 432, 178, 68, 60, 20, C.teal);
  icon(ctx, I.dial, 466, 208, 30, '#fff', 3.4);
  // online + availability
  ctx.beginPath();
  ctx.arc(52, 278, 7, 0, Math.PI * 2);
  ctx.fillStyle = C.green;
  ctx.fill();
  text(ctx, `${128 + Math.floor((t * 3) % 9)} online`, 68, 285, { size: 19, color: C.ink, weight: 600 });
  text(ctx, 'Available', SCREEN_W - 110, 285, { size: 18, color: C.grey, align: 'right', weight: 500 });
  fillRR(ctx, SCREEN_W - 96, 262, 56, 32, 16, C.teal);
  ctx.beginPath();
  ctx.arc(SCREEN_W - 56, 278, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  // history rows
  const rows = [
    ['Meera', '#8E44C9', '↙ 12m 4s', '2m'],
    ['Aarav', '#E8A23A', '↗ 4m 31s', '1h'],
    ['Diya', '#2E9E5B', '💬 Chat', '3h'],
    ['Kabir', '#2E7CC4', '↙ 21m 9s', 'Yday'],
  ];
  rows.forEach(([name, col, sub, when], i) => {
    const y = 340 + i * 112;
    const appear = ease(((t % 10) - i * 0.25) / 0.6);
    ctx.globalAlpha = 0.25 + 0.75 * appear;
    avatar(ctx, 86, y + 40, 38, col, name[0]);
    text(ctx, name, 142, y + 34, { size: 26, weight: 700 });
    text(ctx, sub, 142, y + 68, { size: 19, color: sub.startsWith('↙') ? C.blue : C.grey, weight: 500 });
    text(ctx, when, SCREEN_W - 40, y + 34, { size: 18, color: C.grey, align: 'right', weight: 500 });
    ctx.globalAlpha = 1;
  });
  // start talking
  const pulse = 1 + Math.sin(t * 3) * 0.03;
  ctx.save();
  ctx.translate(SCREEN_W / 2, SCREEN_H - 200);
  ctx.scale(pulse, pulse);
  fillRR(ctx, -150, -40, 300, 80, 40, C.teal);
  icon(ctx, I.phone, -98, 0, 30, '#fff', 2.6);
  text(ctx, 'Start talking', 18, 10, { size: 27, weight: 700, color: '#fff', align: 'center' });
  ctx.restore();
  tabBar(ctx, 'Call');
  return `home:${Math.floor(t * 12)}`;
};

// ---------- searching / matched ----------
const drawConnect = (ctx, t) => {
  const s = t % 7;
  const matched = s > 4.6;
  const g = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
  g.addColorStop(0, '#1B6E75');
  g.addColorStop(1, '#22878F');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx, true);
  const cx = SCREEN_W / 2;
  const cy = 470;
  if (!matched) {
    for (let i = 0; i < 4; i += 1) {
      const p = (s * 0.5 + i / 4) % 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 90 + p * 210, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${(1 - p) * 0.5})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    avatar(ctx, cx, cy, 86, '#7BC6CC', 'R');
    text(ctx, 'Finding someone...', cx, 760, { size: 34, weight: 800, color: '#fff', align: 'center', font: FD });
    text(ctx, `Audio · Anyone · 0:0${Math.floor(s)}`, cx, 806, { size: 22, color: 'rgba(255,255,255,0.8)', align: 'center', weight: 500 });
  } else {
    const k = ease((s - 4.6) / 0.5);
    avatar(ctx, cx - 70 * k, cy, 80, '#7BC6CC', 'R');
    avatar(ctx, cx + 70 * k, cy, 80, '#8E44C9', 'M');
    ctx.globalAlpha = k;
    fillRR(ctx, cx - 120, cy + 120, 240, 54, 27, 'rgba(255,255,255,0.18)');
    text(ctx, '✨ Matched!', cx, cy + 156, { size: 24, weight: 800, color: '#fff', align: 'center' });
    text(ctx, 'Meera · 🇮🇳 · 🔥 12', cx, 760, { size: 32, weight: 800, color: '#fff', align: 'center', font: FD });
    text(ctx, 'Connecting...', cx, 806, { size: 22, color: 'rgba(255,255,255,0.8)', align: 'center', weight: 500 });
    ctx.globalAlpha = 1;
  }
  fillRR(ctx, cx - 150, SCREEN_H - 200, 300, 76, 38, matched ? 'rgba(255,255,255,0.2)' : C.red);
  text(ctx, matched ? 'Say hi 👋' : 'Cancel', cx, SCREEN_H - 152, { size: 26, weight: 700, color: '#fff', align: 'center' });
  return `connect:${Math.floor(t * 15)}`;
};

// ---------- in a call ----------
const drawInCall = (ctx, t) => {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx);
  // doodles
  ctx.globalAlpha = 0.25;
  ['♪', '☆', '♡', '☺', '✦', '♫'].forEach((d, i) => {
    text(ctx, d, 60 + ((i * 97) % 430), 150 + ((i * 173) % 900), { size: 40, color: C.grey, weight: 400 });
  });
  ctx.globalAlpha = 1;
  const cx = SCREEN_W / 2;
  // speaking rings
  const level = 0.5 + 0.5 * Math.abs(Math.sin(t * 5.3) * Math.sin(t * 2.1));
  ctx.beginPath();
  ctx.arc(cx, 380, 120 + level * 22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(34,135,143,0.12)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, 380, 108, 0, Math.PI * 2);
  ctx.strokeStyle = '#5FC0C7';
  ctx.lineWidth = 8;
  ctx.stroke();
  avatar(ctx, cx, 380, 100, '#8E44C9', 'M');
  text(ctx, 'Meera', cx, 560, { size: 40, weight: 800, align: 'center', font: FD });
  const sec = 754 + Math.floor(t);
  text(ctx, `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`, cx, 604, {
    size: 26,
    color: C.teal,
    align: 'center',
    weight: 700,
  });
  fillRR(ctx, cx - 112, 630, 224, 46, 23, C.tealSoft);
  text(ctx, '🔒 Encrypted', cx, 661, { size: 19, color: C.tealDark, align: 'center', weight: 600 });
  // controls
  const ctr = [
    [I.mic, 'Mute', '#E7EBEA', C.ink],
    [I.speaker, 'Speaker', C.teal, '#fff'],
    [I.chat, 'Chat', '#E7EBEA', C.ink],
  ];
  ctr.forEach(([d, label, bg, fg], i) => {
    const x = cx + (i - 1) * 140;
    ctx.beginPath();
    ctx.arc(x, 820, 50, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();
    icon(ctx, d, x, 820, 34, fg);
    text(ctx, label, x, 900, { size: 19, color: C.grey, align: 'center', weight: 500 });
  });
  ctx.beginPath();
  ctx.arc(cx, 1010, 56, 0, Math.PI * 2);
  ctx.fillStyle = C.red;
  ctx.fill();
  ctx.save();
  ctx.translate(cx, 1010);
  ctx.rotate(Math.PI * 0.75);
  icon(ctx, I.phone, 0, 0, 38, '#fff', 2.6);
  ctx.restore();
  return `incall:${Math.floor(t * 12)}`;
};

// ---------- chat: text, voice note, view once ----------
const drawChat = (ctx, t) => {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  fillRR(ctx, 0, 0, SCREEN_W, 160, 0, C.card);
  statusBar(ctx);
  avatar(ctx, 76, 118, 30, '#8E44C9', 'M');
  text(ctx, 'Meera', 122, 112, { size: 26, weight: 700 });
  const s = t % 9;
  const typing = s > 6.2 && s < 7.6;
  text(ctx, typing ? 'typing...' : 'online', 122, 142, { size: 18, color: C.teal, weight: 600 });
  icon(ctx, I.phone, SCREEN_W - 56, 118, 30, C.teal);

  let y = 200;
  const bubble = (mine, w, h, draw, show) => {
    if (!show) return;
    const x = mine ? SCREEN_W - 40 - w : 40;
    fillRR(ctx, x, y, w, h, 26, mine ? C.teal : C.card);
    draw(x, y, mine);
    y += h + 18;
  };
  bubble(false, 300, 76, (x) => text(ctx, 'Hey! That call was fun 😄', x + 22, y + 46, { size: 21, weight: 500 }), true);
  bubble(true, 270, 76, (x) => text(ctx, 'Haha same! Again soon?', x + 22, y + 46, { size: 21, weight: 500, color: '#fff' }), true);
  // voice note with a moving play head
  bubble(
    false,
    360,
    96,
    (x) => {
      const p = (s % 4.5) / 4.5;
      ctx.beginPath();
      ctx.arc(x + 48, y + 48, 26, 0, Math.PI * 2);
      ctx.fillStyle = C.teal;
      ctx.fill();
      ctx.save();
      ctx.translate(x + 50, y + 48);
      ctx.fillStyle = '#fff';
      ctx.fill(new Path2D('M-8 -12 L12 0 L-8 12 Z'));
      ctx.restore();
      for (let i = 0; i < 22; i += 1) {
        const h = 10 + Math.abs(Math.sin(i * 1.7)) * 34;
        ctx.fillStyle = i / 22 < p ? C.teal : '#C9D6D5';
        fillRR(ctx, x + 92 + i * 10, y + 48 - h / 2, 6, h, 3, ctx.fillStyle);
      }
      text(ctx, '0:12', x + 330, y + 86, { size: 15, color: C.grey, align: 'right', weight: 500 });
    },
    s > 1,
  );
  // view once, then "Opened"
  bubble(
    true,
    300,
    76,
    (x) => {
      const opened = s > 5;
      text(ctx, opened ? '👁  Opened' : '①  View once message', x + 22, y + 46, {
        size: 21,
        weight: 600,
        color: opened ? 'rgba(255,255,255,0.75)' : '#fff',
      });
    },
    s > 2.4,
  );
  bubble(false, 240, 76, (x) => text(ctx, 'Status dekha? 🌅', x + 22, y + 46, { size: 21, weight: 500 }), s > 7.6);
  if (typing) {
    fillRR(ctx, 40, y, 110, 60, 30, C.card);
    [0, 1, 2].forEach((i) => {
      ctx.beginPath();
      ctx.arc(70 + i * 24, y + 30 + Math.sin(t * 8 + i) * 5, 7, 0, Math.PI * 2);
      ctx.fillStyle = C.grey;
      ctx.fill();
    });
  }
  // input bar with mic
  fillRR(ctx, 30, SCREEN_H - 110, SCREEN_W - 150, 72, 36, '#E7EBEA');
  text(ctx, 'Message', 64, SCREEN_H - 64, { size: 22, color: C.grey, weight: 500 });
  text(ctx, '①', SCREEN_W - 172, SCREEN_H - 62, { size: 30, color: C.teal, weight: 700, align: 'center' });
  const rec = s > 0.2 && s < 1;
  ctx.beginPath();
  ctx.arc(SCREEN_W - 70, SCREEN_H - 74, 38 + (rec ? Math.sin(t * 12) * 4 : 0), 0, Math.PI * 2);
  ctx.fillStyle = rec ? C.red : C.teal;
  ctx.fill();
  icon(ctx, I.mic, SCREEN_W - 70, SCREEN_H - 74, 32, '#fff');
  return `chat:${Math.floor(t * 12)}`;
};

// ---------- status viewer ----------
const drawStatus = (ctx, t) => {
  const s = t % 9;
  const idx = Math.min(2, Math.floor(s / 3));
  const p = (s % 3) / 3;
  const scenes = [
    ['#F4732A', '#E8A23A', 'Sunset at the ghats 🌅'],
    ['#22878F', '#7BC6CC', 'Chai & chats ☕'],
    ['#8E44C9', '#D63384', 'Weekend mood 🎶'],
  ];
  const [c1, c2, caption] = scenes[idx];
  const g = ctx.createLinearGradient(0, 0, SCREEN_W, SCREEN_H);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  // soft shapes = the "photo"
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(SCREEN_W * 0.7, 420 + Math.sin(t) * 20, 170, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(SCREEN_W * 0.25, 780, 230, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  statusBar(ctx, true);
  // progress bars
  [0, 1, 2].forEach((i) => {
    const x = 30 + i * 164;
    fillRR(ctx, x, 76, 152, 8, 4, 'rgba(255,255,255,0.35)');
    const fill = i < idx ? 1 : i === idx ? p : 0;
    if (fill > 0) fillRR(ctx, x, 76, 152 * fill, 8, 4, '#fff');
  });
  avatar(ctx, 70, 136, 30, '#1B6E75', 'D');
  text(ctx, 'Diya', 116, 130, { size: 24, weight: 700, color: '#fff' });
  text(ctx, `${2 + idx}h ago`, 116, 158, { size: 18, color: 'rgba(255,255,255,0.85)', weight: 500 });
  text(ctx, caption, SCREEN_W / 2, SCREEN_H - 220, { size: 32, weight: 800, color: '#fff', align: 'center', font: FD });
  fillRR(ctx, SCREEN_W / 2 - 120, SCREEN_H - 160, 240, 64, 32, 'rgba(0,0,0,0.25)');
  icon(ctx, I.download, SCREEN_W / 2 - 64, SCREEN_H - 128, 28, '#fff');
  text(ctx, 'Download', SCREEN_W / 2 + 18, SCREEN_H - 119, { size: 22, weight: 700, color: '#fff', align: 'center' });
  return `status:${idx}:${Math.floor(p * 60)}`;
};

// ---------- goals, streak, aura ----------
const drawGoals = (ctx, t) => {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx);
  text(ctx, 'Goals', 40, 140, { size: 52, weight: 800, font: FD });
  fillRR(ctx, 40, 176, SCREEN_W - 80, 250, 32, C.card);
  const s = t % 8;
  const streak = s > 2.4 ? 7 : 6;
  const jump = s > 2.4 && s < 3 ? Math.sin(((s - 2.4) / 0.6) * Math.PI) * 18 : 0;
  text(ctx, '🔥', SCREEN_W / 2 - 50, 280 - jump, { size: 64, align: 'center' });
  text(ctx, String(streak), SCREEN_W / 2 + 30, 284 - jump, { size: 76, weight: 800, color: C.flame, align: 'center', font: FD });
  text(ctx, 'DAY STREAK', SCREEN_W / 2, 320, { size: 18, weight: 700, color: C.grey, align: 'center' });
  text(ctx, '🏆 Best 12      ✨ Aura 1,284', SCREEN_W / 2, 372, { size: 22, weight: 700, color: C.ink, align: 'center' });
  if (s > 2.4 && s < 5) {
    ctx.globalAlpha = ease((s - 2.4) / 0.4);
    fillRR(ctx, SCREEN_W / 2 - 150, 390, 300, 50, 25, '#FDF1D3');
    text(ctx, '+200 bonus credits 🎉', SCREEN_W / 2, 423, { size: 21, weight: 800, color: '#9A6214', align: 'center' });
    ctx.globalAlpha = 1;
  }
  text(ctx, "TODAY'S GOALS", 40, 492, { size: 18, weight: 700, color: C.grey });
  const goals = [
    ['Talk for 10 minutes', 1, '🪙 +50'],
    ['Make 3 new connections', clamp((s - 1) / 3) * 0.67 + 0.33, '🪙 +50'],
    ['Spin the wheel once', 1, '🪙 +20'],
    ['Send 20 messages', clamp(s / 8) * 0.55 + 0.2, '🪙 +30'],
  ];
  fillRR(ctx, 40, 512, SCREEN_W - 80, 440, 32, C.card);
  goals.forEach(([g, p, r], i) => {
    const y = 556 + i * 102;
    text(ctx, g, 72, y, { size: 22, weight: 700 });
    fillRR(ctx, 72, y + 18, 280, 12, 6, '#E7EBEA');
    fillRR(ctx, 72, y + 18, 280 * p, 12, 6, p >= 1 ? C.green : C.teal);
    text(ctx, r, 72, y + 60, { size: 17, color: C.grey, weight: 500 });
    if (p >= 1) {
      fillRR(ctx, SCREEN_W - 172, y - 4, 104, 50, 25, C.teal);
      text(ctx, 'Claim', SCREEN_W - 120, y + 28, { size: 20, weight: 700, color: '#fff', align: 'center' });
    }
  });
  tabBar(ctx, 'Goals');
  return `goals:${Math.floor(t * 10)}`;
};

// ---------- privacy: who can call me ----------
const drawPrivacy = (ctx, t) => {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx);
  text(ctx, 'Who can call me', 40, 140, { size: 38, weight: 800, font: FD });
  const sel = Math.floor((t % 9) / 3);
  const opts = [
    ['🌍', 'Everyone', 'Anyone with your number'],
    ['🤝', 'People I talked to', 'Only past calls & chats'],
    ['⛔', 'Nobody', 'Random matches still work'],
  ];
  fillRR(ctx, 40, 180, SCREEN_W - 80, 360, 32, C.card);
  opts.forEach(([e, title, sub], i) => {
    const y = 236 + i * 110;
    text(ctx, e, 82, y + 14, { size: 36, align: 'center' });
    text(ctx, title, 130, y, { size: 24, weight: 700 });
    text(ctx, sub, 130, y + 32, { size: 18, color: C.grey, weight: 500 });
    ctx.beginPath();
    ctx.arc(SCREEN_W - 84, y + 6, 16, 0, Math.PI * 2);
    ctx.strokeStyle = i === sel ? C.teal : '#C9CFCE';
    ctx.lineWidth = 4;
    ctx.stroke();
    if (i === sel) {
      ctx.beginPath();
      ctx.arc(SCREEN_W - 84, y + 6, 8, 0, Math.PI * 2);
      ctx.fillStyle = C.teal;
      ctx.fill();
    }
  });
  text(ctx, 'YOUR PRIVATE NUMBER', 40, 598, { size: 18, weight: 700, color: C.grey });
  fillRR(ctx, 40, 618, SCREEN_W - 80, 120, 32, C.card);
  text(ctx, '# 86369', 76, 696, { size: 46, weight: 800, font: FD });
  text(ctx, 'phone number hidden', SCREEN_W - 72, 690, { size: 18, color: C.green, weight: 600, align: 'right' });
  fillRR(ctx, 40, 776, SCREEN_W - 80, 96, 28, '#FDE4E6');
  icon(ctx, I.shield, 92, 824, 34, C.red);
  text(ctx, 'Block & report in one tap', 132, 834, { size: 23, weight: 700, color: '#B3242E' });
  fillRR(ctx, 40, 892, SCREEN_W - 80, 96, 28, C.tealSoft);
  text(ctx, '18+ only · email code login', 72, 950, { size: 23, weight: 700, color: C.tealDark });
  return `privacy:${sel}`;
};

// ---------- install ----------
const drawInstall = (ctx, t) => {
  const g = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
  g.addColorStop(0, '#F4F6F5');
  g.addColorStop(1, '#E3F1F2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
  statusBar(ctx);
  const s = t % 7;
  const p = clamp(s / 3.5);
  const cx = SCREEN_W / 2;
  // app icon
  fillRR(ctx, cx - 110, 230, 220, 220, 54, C.teal);
  fillRR(ctx, cx - 70, 284, 140, 96, 36, '#fff');
  ctx.beginPath();
  ctx.moveTo(cx - 40, 372);
  ctx.lineTo(cx - 54, 410);
  ctx.lineTo(cx - 10, 380);
  ctx.closePath();
  ctx.fillStyle = '#fff';
  ctx.fill();
  [-36, -18, 0, 18, 36].forEach((dx, i) => {
    const h = [24, 44, 60, 44, 24][i];
    fillRR(ctx, cx + dx - 5, 332 - h / 2, 10, h, 5, C.teal);
  });
  text(ctx, 'TalkLink', cx, 520, { size: 44, weight: 800, align: 'center', font: FD });
  text(ctx, 'v1.0.0 · 56 MB · Android 7.0+', cx, 562, { size: 20, color: C.grey, align: 'center', weight: 500 });
  fillRR(ctx, 70, 640, SCREEN_W - 140, 18, 9, '#D5DFDE');
  fillRR(ctx, 70, 640, (SCREEN_W - 140) * p, 18, 9, C.teal);
  const done = s > 3.6;
  text(ctx, done ? 'Installed ✓' : `Downloading ${Math.round(p * 100)}%`, cx, 712, {
    size: 26,
    weight: 700,
    color: done ? C.green : C.ink,
    align: 'center',
  });
  fillRR(ctx, cx - 150, 820, 300, 80, 40, done ? C.teal : '#C9D6D5');
  text(ctx, done ? 'Open' : 'Install', cx, 870, { size: 28, weight: 800, color: '#fff', align: 'center' });
  return `install:${done}:${Math.round(p * 50)}`;
};

const MODES = {
  home: drawHome,
  connect: drawConnect,
  incall: drawInCall,
  chat: drawChat,
  status: drawStatus,
  goals: drawGoals,
  privacy: drawPrivacy,
  install: drawInstall,
};

export const drawScreenMode = (ctx, mode, t) => (MODES[mode] || drawHome)(ctx, t);
