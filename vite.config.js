import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true
      }
    }
  },

  build: {
    // Raise warning threshold to 2000 kB to suppress warnings 
    // (our lazy imports in App.jsx will handle splitting routes naturally)
    chunkSizeWarningLimit: 2000
  }
})
