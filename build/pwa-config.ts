import { VitePWA } from 'vite-plugin-pwa'

export function initPluginPWA() {
  return VitePWA({
    manifest: {
      name: '小剧起始页 - 更适合前端的上网首页！',
      short_name: '小剧起始页',
      theme_color: '#3b4b54',
    },
    registerType: 'autoUpdate',
    injectRegister: 'inline',
    workbox: {
      globPatterns: ['**/*.{icon,png,svg}', '**/*.{js,css,html}', '**/*.json'],
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 20,
    },
  })
}
