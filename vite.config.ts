import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [
    vue(),
    vueI18n({
      include: fileURLToPath(new URL('./src/i18n/**', import.meta.url)),
      defaultSFCLang: 'yaml',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/v1': 'http://localhost:3000',
    },
  },
});
