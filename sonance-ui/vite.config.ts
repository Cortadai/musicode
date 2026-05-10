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
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
          if (id.includes('node_modules/@tsparticles') || id.includes('node_modules/tsparticles')) {
            return 'tsparticles';
          }
          if (id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'tanstack';
          }
        },
      },
    },
  },
  server: {
    port: 17381,
    proxy: {
      '/api': {
        target: 'http://localhost:17380',
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
        'src/**/*.d.ts',
        'src/components/activity/**',
        'src/components/auth/**',
        'src/components/common/**',
        'src/components/layout/**',
        'src/components/library/**',
        'src/components/player/PlayerBar.tsx',
        'src/components/player/Visualizer.tsx',
        'src/components/player/NowPlayingOverlay.tsx',
        'src/components/player/LyricsPanel.tsx',
        'src/components/player/LyricsSidebar.tsx',
        'src/components/player/QueuePanel.tsx',
        'src/components/player/RetroMode.tsx',
        'src/components/player/WaveformBar.tsx',
        'src/components/player/cassette/**',
        'src/components/analyzer/**',
        'src/components/icons/**',
        'src/audio/audioGraph.ts',
        'src/audio/eqProcessor.ts',
        'src/audio/eqSpectrumSource.ts',
        'src/audio/colorExtraction.ts',
        'src/audio/analyzerDeckDataSource.ts',
        'src/pages/**',
        'src/hooks/**',
        'src/context/AuthContext.tsx',
      ],
    },
  },
})
