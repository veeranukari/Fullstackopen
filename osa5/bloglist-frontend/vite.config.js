/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testSetup.js'
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:3003',
        changeOrigin: true
      }
    }
  }
})
