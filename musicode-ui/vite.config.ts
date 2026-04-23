/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) {
            return 'recharts';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/App.tsx',
        'src/api/**',
        'src/types/**',
        'src/components/activity/**',
        'src/components/auth/**',
        'src/components/common/**',
        'src/components/layout/**',
        'src/components/library/**',
        'src/components/player/PlayerBar.tsx',
        'src/components/player/Visualizer.tsx',
        'src/audio/audioGraph.ts',
        'src/audio/eqProcessor.ts',
        'src/pages/**',
        'src/hooks/**',
        'src/context/AuthContext.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 50,
        branches: 80,
      },
    },
  },
})
