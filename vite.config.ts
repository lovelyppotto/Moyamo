import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.glb'], // GLTF/GLB 파일을 assets로 인식
}); 