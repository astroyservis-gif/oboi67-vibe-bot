import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: 'https://cdn.oboi67.ru/',
  plugins: [react()],
  server: {
    allowedHosts: true
  }
})
