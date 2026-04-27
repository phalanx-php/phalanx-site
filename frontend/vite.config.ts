import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
  ],
  server: {
    port: 3002,
    proxy: {
      '/api': 'http://localhost:8091',
      '/health': 'http://localhost:8091',
    },
  },
  build: {
    outDir: '../public/dist',
    emptyOutDir: true,
  },
})
