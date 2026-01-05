import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // To musi być nazwa Twojego repozytorium na GitHubie pomiędzy ukośnikami
  base: '/HabbitFlow/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});