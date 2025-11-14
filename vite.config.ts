import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist/renderer',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer'),
      '@models': path.resolve(__dirname, './src/renderer/models'),
      '@services': path.resolve(__dirname, './src/renderer/services'),
      '@utils': path.resolve(__dirname, './src/renderer/utils'),
    },
  },
  server: {
    port: 5173,
  },
});
