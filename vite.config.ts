import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'quansync': path.resolve(__dirname, 'node_modules/quansync')
      }
    },
    optimizeDeps: {
      exclude: ['@standard-community/standard-json'],
      include: ['zod'],
      esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      }
    },
    ssr: {
      noExternal: ['@standard-community/standard-json']
    }
  };
});
