import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // 에셋 파일명에 해시 포함하여 캐싱 최적화
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Cache-Control': 'max-age=31536000, immutable',
    },
    proxy: {
      '/api': {
        target: 'https://moyamo.site',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
});
