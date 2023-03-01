import { createApp } from 'vue'
import App from './App.vue'
import uiLib from './ui-lib/index'
import { initAppConfig } from './assets/ts/app-config'
import { initVariables } from './assets/ts/css-variables'
import './assets/stylus/imported-styles/index.styl'
// import SevenSegmentDisplay from 'vue3-seven-segment-display'
function initApp() {
  initAppConfig()
  initVariables()

  const app = createApp(App)
  app.use(uiLib)
  // app.use(SevenSegmentDisplay as Plugin)
  app.mount('#app')
}
function removeMask() {
  const maskNode: HTMLElement | null = document.querySelector('.app-mask')
  if (!maskNode) {
    return
  }
  maskNode.classList.add('hide')
  setTimeout(() => {
    maskNode.parentNode?.removeChild(maskNode)
  }, 1000)
}

initApp()
removeMask()
