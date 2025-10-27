import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // For production deployment to Netlify, API calls will be redirected
  // to Netlify Functions via netlify.toml configuration
  build: {
    // Ensure the build output works correctly with Netlify's routing
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
