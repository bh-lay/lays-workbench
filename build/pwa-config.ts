import { VitePWA } from 'vite-plugin-pwa'

export function initPluginPWA() {
  return VitePWA({
    manifest: {
      name: '小剧起始页 - 更适合前端的上网首页！',
      short_name: '小剧起始页',
    },
    registerType: 'autoUpdate',
    injectRegister: 'inline',
    workbox: {
      globPatterns: ['**/*.{icon,png,svg}', '**/*.{js,css,html}', '**/*.json'],
      maximumFileSizeToCacheInBytes: 1024 * 1024 * 10,
    },
  })
}
