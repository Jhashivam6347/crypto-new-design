import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/crypto-new-design/', // 👈 must match your repo name exactly
  build: {
    outDir: 'dist', // 👈 this is where vite outputs build files
  },
});
