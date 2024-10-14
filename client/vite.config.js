import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy all API requests to the Express server
    proxy: {
      '/api': 'http://localhost:3000', // Proxy to Express API
    },
  },
});