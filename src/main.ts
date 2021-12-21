import { createApp, nextTick } from 'vue'
import App from './App.vue'
import uiLib from './ui-lib/index'
import { initAppConfig } from './assets/ts/app-config'
import { initVariables } from './assets/ts/css-variables'
import './assets/stylus/index.styl'
function initApp() {
  initAppConfig()
  initVariables()

  const app = createApp(App)
  app.use(uiLib)
  app.mount('#app')
}
function removeMask() {
  const maskNode: HTMLElement | null = document.querySelector('.app-mask')
  if (!maskNode) {
    return
  }

  const styleAtrribute = maskNode.style
  styleAtrribute.setProperty('transition', '0.8s')
  nextTick(() => {
    styleAtrribute.setProperty('opacity', '0')
  })
  setTimeout(() => {
    maskNode.parentNode?.removeChild(maskNode)
  }, 1000)
}

initApp()
removeMask()
