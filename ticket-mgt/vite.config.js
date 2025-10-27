import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For Vercel deployment, API routes in /api directory work automatically
  // No proxy configuration needed for development
  build: {
    // Ensure the build output works correctly with Vercel's routing
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
