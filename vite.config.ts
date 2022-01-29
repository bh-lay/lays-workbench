import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

function resolve(dir: string) {
  return path.join(__dirname, dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@database': resolve('./src/database'),
    },
  },
  build:{
    rollupOptions:{
      output:{
        // 分包逻辑
        manualChunks(id){
          // mdi 较大，单独拆包
          if(id.includes('@mdi')){
            return 'mdi'
          }
          // JSON formatter 分离
          if (id.includes('node_modules/json-formatter-js')) {
            return 'json-formatter'
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