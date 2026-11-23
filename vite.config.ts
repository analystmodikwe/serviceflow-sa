import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // NEW: Tailwind's Vite plugin

export default defineConfig({
  // NEW: add tailwindcss() next to the react plugin
  plugins: [react(), tailwindcss()],
})