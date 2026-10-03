import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Instagram downloads are already compressed, so there is nothing to gain
    // from re-compressing them. Keep the assets verbatim.
    assetsInlineLimit: 2048,
  },
})
