import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index:    resolve(__dirname, 'index.html'),
        about:    resolve(__dirname, 'about.html'),
        services: resolve(__dirname, 'services.html'),
        gallery:  resolve(__dirname, 'gallery.html'),
        areas:    resolve(__dirname, 'areas.html'),
        contact:  resolve(__dirname, 'contact.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
