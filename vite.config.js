import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // the SSR build only renders HTML: no need to copy public/ (and the 56 MB APK) into dist-ssr
  publicDir: isSsrBuild ? false : 'public',
  server: {
    port: 5174,
    open: false,
    // never watch build output: a running dev server crashed on the APK copy there
    watch: { ignored: ['**/dist/**', '**/dist-ssr/**'] },
  },
  preview: { port: 4174 },
}));
