import { App as Application }  from 'vue'
import directive from './directive'
import Contextmenu from './contextmenu.vue'
import ContextmenuItem from './contextmenu-item.vue'

export default {
  install(app: Application) {
    app.use(directive)
    app.component('contextmenu', Contextmenu)
    app.component('contextmenu-item', ContextmenuItem)
  }
}
