import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Same-origin in dev, so the httpOnly auth cookie just works.
    proxy: {
      // Override with API_URL to point the dev server at another backend.
      '/api': process.env.API_URL ?? 'http://localhost:4000',
    },
  },
})
