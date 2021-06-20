import { createApp } from 'vue'
import App from './App.vue'
import uiLib from './ui-lib'
import './assets/stylus/index.styl'

const app = createApp(App)
app.use(uiLib)
app.mount('#app')
