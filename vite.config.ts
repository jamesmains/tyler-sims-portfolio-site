import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', 
  plugins: [react()],
  server: {
    // ⬅️ Add this section
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // The address of your live API
        changeOrigin: true, // Needed for virtual hosting sites
        secure: false, // Use if your remote API is not using HTTPS (usually not recommended)
      },
    },
  },
});