import { createApp } from 'vue'
import App from './App.vue'
import uiLib from './ui-lib/index.ts'
import './assets/stylus/index.styl'
import {
  insertBookmarkService,
  getBookmarkService,
  updateBookmarkService,
  removeBookmarkService,
  listBookmarkService,
} from './database/services/bookmark-service.ts'

window['test'] = {
  insertBookmarkService,
  getBookmarkService,
  updateBookmarkService,
  removeBookmarkService,
  listBookmarkService,
}
const app = createApp(App)
app.use(uiLib)
app.mount('#app')
