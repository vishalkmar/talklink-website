// All page text in one place (also the source for structured data). Everything here describes what
// the TalkLink app really does - keep it in step with the app.

export const SITE = {
  name: 'TalkLink',
  apkUrl: '/downloads/TalkLink.apk',
  apkVersion: '1.0.0',
  apkSize: '56 MB',
  minAndroid: 'Android 7.0+',
  // optional links from .env - a link is hidden until its value is set
  privacyUrl: import.meta.env.VITE_PRIVACY_URL || '',
  termsUrl: import.meta.env.VITE_TERMS_URL || '',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || '',
};

export const NAV = [
  { id: 'talk', label: 'Random talk' },
  { id: 'chat', label: 'Chat' },
  { id: 'status', label: 'Status' },
  { id: 'rewards', label: 'Rewards' },
  { id: 'safety', label: 'Safety' },
  { id: 'faq', label: 'FAQ' },
];

export const HERO = {
  eyebrow: 'Free Android app · 18+ · Made in India',
  title: ['Talk to someone new,', 'right now.'],
  text:
    'TalkLink connects you with friendly people in seconds - by voice or by chat. Keep your phone number to yourself: you get a private number, voice notes, view-once messages, a 24-hour status and rewards for every day you show up.',
  points: [
    'Random voice calls & chats - free',
    'Private number, never your phone number',
    'Voice notes, view-once, status',
    'Streaks, aura, daily spin & free credits',
  ],
};

export const STATS = [
  { value: '3 sec', label: 'to start a random talk' },
  { value: '100', label: 'welcome credits' },
  { value: '24 h', label: 'and a status is gone' },
  { value: '0', label: 'phone numbers shared' },
];

// One chapter per feature. The 3D phone flies to each chapter's anchor, shows `screen`
// (three/screens.js) and brings `prop` (three/StoryScene.jsx). rot = phone tilt "x,y,z" in degrees.
export const STORY = [
  {
    id: 'talk',
    kicker: 'Random talk',
    title: 'Tap once. Meet someone new.',
    lead:
      'Choose audio or text, tap Start talking and TalkLink rings the people who are online right now. The first one to accept is yours - usually in a few seconds.',
    screen: 'connect',
    prop: 'waves',
    rot: '6,18,-2',
    textSide: 'left',
    items: [
      { icon: 'wave', title: 'Audio or text', text: 'Talk out loud, or keep it to typing. Switch any time you start a new search.' },
      { icon: 'users', title: 'Anyone - or pick who', text: 'Talk to anyone, or unlock the gender filter for 30 minutes with credits you earn for free.' },
      { icon: 'spark', title: 'No dead ends', text: 'Nobody free right now? You are told straight away - and filter credits come back if no one is found.' },
    ],
  },
  {
    id: 'calls',
    kicker: 'Calls & private number',
    title: 'Clear calls. Your number stays yours.',
    lead:
      'Every account gets a short private number like #86369. Share it with people you like - they find you with it, call you or message you. Your real phone number is never shown to anyone.',
    screen: 'incall',
    prop: 'orbit',
    rot: '4,-20,2',
    textSide: 'right',
    items: [
      { icon: 'dial', title: 'Dial a private number', text: 'The dialpad on the Call tab finds anyone by their number - then call or message in one tap.' },
      { icon: 'phone', title: 'Call from a profile', text: 'Liked talking to someone? Open their profile and call them back directly.' },
      { icon: 'lock', title: 'Encrypted, never recorded', text: 'Calls go phone to phone over an encrypted connection. Speaker, Bluetooth, mute and hold included.' },
    ],
  },
  {
    id: 'chat',
    kicker: 'Chat',
    title: 'Say it, send it, or let it disappear.',
    lead:
      'A proper chat for the people you meet: text, voice notes and private view-once messages - with delivered and seen ticks so you know they got it.',
    screen: 'chat',
    prop: 'bubbles',
    rot: '6,16,-3',
    textSide: 'left',
    items: [
      { icon: 'mic', title: 'Voice notes', text: 'Tap the mic, talk for up to two minutes, send. One tap to play - one note at a time.' },
      { icon: 'once', title: 'View once', text: 'Turn on view-once for a text or a voice note: it opens one time, then it is gone for both of you.' },
      { icon: 'check2', title: 'Ticks & typing', text: 'Sent, delivered, seen - and "typing..." while they answer.' },
    ],
  },
  {
    id: 'status',
    kicker: 'Status',
    title: 'Share your day for 24 hours.',
    lead:
      'Post a photo or a short video from your gallery. People you have talked to see it in full screen - and 24 hours later it disappears on its own.',
    screen: 'status',
    prop: 'rings',
    rot: '5,-18,2',
    textSide: 'right',
    items: [
      { icon: 'image', title: 'Photos & 30-second videos', text: 'Up to 3 statuses at a time. Tap to skip, hold to pause.' },
      { icon: 'eye', title: 'See who viewed it', text: 'Your own status shows who has seen it - delete it whenever you like.' },
      { icon: 'download', title: 'Save to gallery', text: 'Liked a status? Download it straight to your phone gallery.' },
    ],
  },
  {
    id: 'rewards',
    kicker: 'Goals & rewards',
    title: 'Show up daily. Get rewarded.',
    lead:
      'Every day you talk keeps your streak alive. Finish goals, collect aura, climb the weekly leaderboard - and fill your wallet with free credits.',
    screen: 'goals',
    prop: 'coins',
    rot: '6,18,-2',
    textSide: 'left',
    items: [
      { icon: 'flame', title: 'Streaks & best streak', text: 'A bonus every 7 days, badges at 7, 30, 100 and 365 days - and one video can save a missed day.' },
      { icon: 'star', title: 'Aura & leaderboard', text: 'Good calls, good ratings and finished goals earn aura. The top of the week gets the spotlight.' },
      { icon: 'gift', title: 'Spin, videos & invites', text: 'A free daily spin (up to 500 credits), credits for rewarded videos, and 200 for you and each friend you invite.' },
    ],
  },
  {
    id: 'safety',
    kicker: 'Safety & privacy',
    title: 'You decide who reaches you.',
    lead:
      'TalkLink is built for adults who want good conversations. You choose who can call you, and anyone who crosses a line is one tap away from blocked.',
    screen: 'privacy',
    prop: 'shield',
    rot: '4,-18,2',
    textSide: 'right',
    items: [
      { icon: 'shield', title: 'Who can call me', text: 'Everyone, only people you have talked to, or nobody - change it any time.' },
      { icon: 'flag', title: 'Block & report', text: 'Blocking works both ways at once: calls, chats, status and search. Reports are reviewed by the team.' },
      { icon: 'mail', title: 'Email code login', text: 'No passwords, no phone number. Sign in with a one-time code; delete your account in the app any time.' },
    ],
  },
  {
    id: 'install',
    kicker: 'Get the app',
    title: 'Download. Install. Say hello.',
    lead:
      'TalkLink is a direct download for Android - not on the Play Store yet. It takes about a minute.',
    screen: 'install',
    prop: 'download',
    rot: '6,16,-2',
    textSide: 'left',
    items: [],
  },
];

export const STEPS = [
  { n: 1, title: 'Download the APK', text: `Tap Download APK on this page (${'56 MB'}).` },
  { n: 2, title: 'Allow the install', text: 'Android asks once to allow installs from your browser - allow it for this file.' },
  { n: 3, title: 'Sign in with email', text: 'Enter your email, type the 6-digit code, pick a name and an avatar.' },
  { n: 4, title: 'Start talking', text: 'Tap Start talking - your 100 welcome credits are already in your wallet.' },
];

export const INSTALL_STEPS = [
  'Open the downloaded TalkLink.apk from your notifications or the Downloads folder.',
  'If asked, turn on "Allow from this source" for your browser, then tap Install.',
  'Open TalkLink and allow the microphone - it is needed for calls and voice notes.',
  'Allow notifications so calls can ring even when the app is closed.',
];

export const FAQ = [
  {
    q: 'Is TalkLink free?',
    a: 'Yes. Random calls, direct calls, chats, voice notes and status are free. Credits are only needed for the gender filter, and you can earn them free from the daily bonus, the spin wheel, rewarded videos and invites. Credit packs and Premium are optional.',
  },
  {
    q: 'Do other people see my phone number?',
    a: 'No. TalkLink never asks for your phone number to sign in and never shows it. Everyone gets a private TalkLink number like #86369 - share that only with people you choose.',
  },
  {
    q: 'How does random talk work?',
    a: 'Pick audio or text and tap Start talking. TalkLink sends your request to people who are online and available; the first one to accept is connected to you. If nobody is free, you are told right away.',
  },
  {
    q: 'What is a view-once message?',
    a: 'A text or voice note that the other person can open one single time. After that it is deleted from the chat for both of you, and it cannot be copied.',
  },
  {
    q: 'Who can see my status?',
    a: 'People you have already talked to in TalkLink, except anyone you blocked. A status lasts 24 hours and you can have up to 3 at a time - photos or videos of up to 30 seconds.',
  },
  {
    q: 'What are streaks and aura?',
    a: 'Your streak grows by one for every day you have at least one call or chat of a minute. Aura is a score for good conversations: talk time, 4-5 star ratings from others and finished goals.',
  },
  {
    q: 'Why is it an APK and not on the Play Store?',
    a: 'TalkLink is in early access, so it is shared directly from this site. Android may ask you to allow installs from your browser once. Play Store listing is coming.',
  },
  {
    q: 'Is TalkLink safe?',
    a: 'TalkLink is for adults (18+). Calls are encrypted and not recorded, you choose who can call you, and you can block or report anyone from a call, a chat or their profile. Blocked people cannot call, message, match with or find you.',
  },
  {
    q: 'Which phones does it work on?',
    a: 'Android phones running Android 7.0 or newer. An iPhone version is planned.',
  },
];

export const KEYWORDS = [
  'talk to new people',
  'random voice call app',
  'chat with strangers',
  'make new friends online',
  'private number calling',
  'voice notes chat',
  'view once messages',
  '24 hour status',
  'TalkLink APK download',
];
