import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { initPluginPWA } from './build/pwa-config'
const path = require('path')

function resolve(dir: string) {
  return path.join(__dirname, dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    initPluginPWA(),
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@database': resolve('./src/database'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  build:{
    chunkSizeWarningLimit: 20 * 1024 * 1024,
    rollupOptions:{
      output:{
        // 分包逻辑
        manualChunks(id){
          // mdi 较大，单独拆包
          if(id.includes('@mdi')){
            return 'mdi'
          }
          // monaco-editor 较大，单独拆包
          if(id.includes('node_modules/monaco-editor')){
            return 'monaco-editor'
          }

          // JSON formatter 分离
          if (id.includes('node_modules/json-formatter-js')) {
            return 'json-formatter'
          }
          // 二维码相关
          if (
            id.includes('/components/widgets/qrcode/') ||
            id.includes('node_modules/jsqr') ||
            id.includes('node_modules/qrcode')
          ) {
            return 'qrcode'
          }
          // 其余依赖均拆分至 libs 模块
          if(id.includes('node_modules')){
            return 'libs'
          }
        },
      },
    },
  },
})