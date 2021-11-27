import { createApp } from 'vue'
import App from './App.vue'
import uiLib from './ui-lib/index.ts'
import { initVariables } from './assets/js/css-variables.ts'
import './assets/stylus/index.styl'
import {
  bookmarkInsertService,
  bookmarkGetService,
  bookmarkUpdateService,
  bookmarkRemoveService,
  bookmarkListService,
  bookmarkResortService,
} from './database/services/bookmark-service.ts'

window['test'] = {
  bookmarkInsertService,
  bookmarkGetService,
  bookmarkUpdateService,
  bookmarkRemoveService,
  bookmarkListService,
  bookmarkResortService,
}
initVariables()
const app = createApp(App)
app.use(uiLib)
app.mount('#app')
