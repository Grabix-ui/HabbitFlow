
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Jeśli Twoja strona jest w folderze (np. github.io/moj-projekt/), 
// zmień base na '/moj-projekt/'
export default defineConfig({
  plugins: [react()],
  base: './HabbitFlow', 
});
