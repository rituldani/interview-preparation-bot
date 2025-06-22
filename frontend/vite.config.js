import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // 👈 expose to external
    port: process.env.PORT || 5173, // 👈 allow Render to assign the port
    allowedHosts: ['interview-preparation-bot-frontend.onrender.com'],
  },
})
