import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: { port: 5174, open: false },
  preview: { port: 4174 },
  build: isSsrBuild
    ? {}
    : {
        // three.js is big: its own chunk, loaded only for the 3D phone, so the page text comes first
        rollupOptions: { output: { manualChunks: { three: ['three', '@react-three/fiber'] } } },
        chunkSizeWarningLimit: 900,
      },
}));
