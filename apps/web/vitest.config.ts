import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@job-ai/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@job-ai/types': path.resolve(__dirname, '../../packages/types/src'),
      '@job-ai/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@job-ai/config': path.resolve(__dirname, '../../packages/config/src'),
    },
  },
})
