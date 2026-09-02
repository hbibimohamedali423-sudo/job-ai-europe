import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@job-ai/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@job-ai/types': path.resolve(__dirname, '../../packages/types/src'),
      '@job-ai/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@job-ai/config': path.resolve(__dirname, '../../packages/config/src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:54321',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
})
