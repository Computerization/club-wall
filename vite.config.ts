import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed as a GitHub Pages project site at /club-wall/, so assets must be
// served from that base path.
export default defineConfig({
  base: '/club-wall/',
  plugins: [react()],
})
