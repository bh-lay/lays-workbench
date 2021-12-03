import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

function resolve(dir: string) {
  return path.join(__dirname, dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@database': resolve('./src/database')
    }
  }
});