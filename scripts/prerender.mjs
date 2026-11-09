// Build step: renders the React page to HTML inside dist/index.html, so search engines and AI
// crawlers read the full text without running JavaScript, and writes the real domain into the SEO files.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { loadEnv } from 'vite';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const env = loadEnv('production', root, 'VITE_');
const siteUrl = (env.VITE_SITE_URL || 'https://talklink-website-eight.vercel.app').replace(/\/$/, '');

const { render } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const appHtml = render();

const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
if (!html.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html');
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
// Without JavaScript the scroll animations never run: show everything instead of leaving it faded out.
html = html.replace(
  '<noscript>',
  '<noscript><style>[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important}.word-in{transform:none!important}</style></noscript>\n    <noscript>',
);
fs.writeFileSync(indexPath, html);

for (const f of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
  const p = path.join(dist, f);
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replaceAll('https://talklink-website-eight.vercel.app', siteUrl));
}
fs.rmSync(path.join(root, 'dist-ssr'), { recursive: true, force: true });
console.log(`[prerender] ${(appHtml.length / 1024).toFixed(1)} KB of page HTML written; site URL ${siteUrl}`);
