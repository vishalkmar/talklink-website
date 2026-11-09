// All page text in one place (also the source for the FAQ structured data). Keep it short, true,
// and in step with what the TalkLink app really does.

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
  { id: 'call', label: 'Calling' },
  { id: 'how', label: 'How it works' },
  { id: 'safety', label: 'Safety' },
  { id: 'install', label: 'Install' },
  { id: 'faq', label: 'FAQ' },
];

export const HERO = {
  eyebrow: 'Free for Android · 18+',
  title: ['Talk to someone new.', 'Right now.'],
  text: 'Random voice calls and chats with real people. Your phone number stays private.',
};

// "How it works": the parts that fly together while you scroll (components/Assembly.jsx)
export const STEPS = [
  { n: '01', title: 'Get matched', text: 'Tap Start talking. Someone online picks up in seconds.' },
  { n: '02', title: 'Talk', text: 'Clear voice calls. Mute, speaker, Bluetooth.' },
  { n: '03', title: 'Keep in touch', text: 'Chat, voice notes, view-once messages.' },
  { n: '04', title: 'Come back', text: 'Streaks, goals and free credits every day.' },
];

// the scroll scene under the hero (components/CallStory.jsx)
export const CALL_STORY = {
  title: 'Two people. One tap. A real conversation.',
  steps: [
    { n: '01', text: "Rahul opens TalkLink and dials Meera's private number, #86369." },
    { n: '02', text: "One tap on call - Meera's phone rings, wherever she is." },
    { n: '03', text: 'She picks up. A clear, encrypted voice call - no phone numbers shared.' },
    { n: '04', text: 'After the call the chat keeps going: texts, voice notes, view-once.' },
  ],
  chat: [
    { from: 'meera', text: 'That was fun! 😄' },
    { from: 'rahul', text: 'Same here. Talk tomorrow?' },
    { from: 'meera', text: '🎤 Voice note · 0:12' },
    { from: 'rahul', text: '① View once photo' },
  ],
};

// safety layers (components/Layers.jsx), top to bottom
export const LAYERS = [
  { title: 'Block & report', text: 'One tap, from a call, a chat or a profile.' },
  { title: 'Who can call me', text: 'Everyone, people you talked to, or nobody.' },
  { title: 'Encrypted calls', text: 'Phone to phone. Never recorded.' },
];

export const INSTALL = [
  { title: 'Download', text: `Tap Download APK (${'56 MB'}).` },
  { title: 'Allow', text: 'Let your browser install apps, once.' },
  { title: 'Sign in', text: 'Email, 6-digit code, a name. No phone number.' },
  { title: 'Talk', text: '100 welcome credits are already waiting.' },
];

export const FAQ = [
  {
    q: 'Is TalkLink free?',
    a: 'Yes. Calls, chats, voice notes and status are free. Credits are only for the gender filter, and you can earn them free.',
  },
  {
    q: 'Can people see my phone number?',
    a: 'No. You sign in with email and get a private TalkLink number. Share it only with people you choose.',
  },
  {
    q: 'What is a view-once message?',
    a: 'A text or voice note that opens one single time. After that it is deleted for both of you.',
  },
  {
    q: 'Who sees my status?',
    a: 'Only people you have talked to on TalkLink, minus anyone you blocked. It disappears after 24 hours.',
  },
  {
    q: 'Why an APK and not the Play Store?',
    a: 'TalkLink is in early access, so it is shared from this site. The Play Store listing is coming.',
  },
  {
    q: 'Which phones are supported?',
    a: 'Android 7.0 or newer. An iPhone version is planned.',
  },
];

export const KEYWORDS = [
  'talk to new people',
  'random voice call app',
  'chat with strangers',
  'make new friends online',
  'private number calling',
  'voice notes',
  'view once messages',
  '24 hour status',
  'TalkLink APK download',
];
