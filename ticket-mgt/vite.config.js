import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Vercel deployment, API routes in /api directory work automatically
  // For development, proxy API requests to json-server
  build: {
    // Ensure the build output works correctly with Vercel's routing
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    fs: {
      // Allow serving files from project root
      allow: ['..']
    },
    proxy: {
      '/users': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '/tickets': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
