import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api/auth': 'http://localhost:8081',
      '/api/menus': 'http://localhost:8082',
      '/api/hr': 'http://localhost:8083',
      '/api/events': 'http://localhost:8084'
    }
  }
});
