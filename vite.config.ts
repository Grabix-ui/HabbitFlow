
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // base: './' sprawia, że ścieżki w zbudowanej aplikacji są relatywne
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
