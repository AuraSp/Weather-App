import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, //Due bootstrap and scss issues until new bootstrap version release
      },
    },
    postcss: {
      plugins: [
        autoprefixer(),
      ]
    }
  },
})

