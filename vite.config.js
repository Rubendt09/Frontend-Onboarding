import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1'),
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1'),
      },
    ],
  },
  server: {
    port: 3030,
    proxy: {
      // Proxy que redirige las solicitudes a tu backend
      '/api': {
        target: 'http://localhost:8080', // URL de tu backend
        changeOrigin: true,  // Cambiar el origen para que coincida con el destino
        rewrite: (path) => path.replace(/^\/api/, ''), // Opcionalmente reescribe las rutas
      },
    },
  },
  preview: {
    port: 3030,
  },
});
