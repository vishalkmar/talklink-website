// Keeps public/downloads/TalkLink.apk in step with the newest APK built in the TalkLink app repo
// (../talklink/App/apk/*.apk) when that folder exists next to this one. Elsewhere (Vercel, a fresh
// clone of this repo) the committed public/downloads/TalkLink.apk is served as is.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dest = path.join(root, 'public', 'downloads', 'TalkLink.apk');
const apkDir = path.join(root, '..', 'talklink', 'App', 'apk');

const newest = fs.existsSync(apkDir)
  ? fs
      .readdirSync(apkDir)
      .filter((f) => f.endsWith('.apk'))
      .map((f) => ({ f, s: fs.statSync(path.join(apkDir, f)) }))
      .sort((a, b) => b.s.mtimeMs - a.s.mtimeMs)[0]
  : null;

if (!newest) {
  console.log(
    fs.existsSync(dest)
      ? '[copy-apk] using public/downloads/TalkLink.apk'
      : '[copy-apk] WARNING: public/downloads/TalkLink.apk is missing - the Download APK button will 404.',
  );
} else {
  const src = path.join(apkDir, newest.f);
  const d = fs.existsSync(dest) ? fs.statSync(dest) : null;
  if (!d || d.size !== newest.s.size) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log(`[copy-apk] copied ${newest.f} (${(newest.s.size / 1048576).toFixed(1)} MB) -> public/downloads/TalkLink.apk`);
  } else {
    console.log('[copy-apk] APK is up to date');
  }
}
