
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // WAŻNE: To musi pasować DOKŁADNIE do nazwy Twojego repozytorium na GitHubie
  base: '/HabbitFlow/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
