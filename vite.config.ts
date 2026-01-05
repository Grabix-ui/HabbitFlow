import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Ustawienie './' sprawia, że ścieżki do zasobów (JS, CSS) są relatywne
  base: '/habitflow/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
});
