import { createApp } from 'vue'
import App from './App.vue'
import uiLib from './ui-lib/index'
import { initAppConfig } from './assets/ts/app-config'
import { initVariables } from './assets/ts/css-variables'
import './assets/stylus/index.styl'

initAppConfig()
initVariables()

const app = createApp(App)
app.use(uiLib)
app.mount('#app')
