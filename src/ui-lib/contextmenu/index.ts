import { App as Application }  from 'vue'
import directive from './directive'
import VContextmenu from './contextmenu.vue'
import VContextmenuItem from './contextmenu-item.vue'

export default {
  install(app: Application) {
    app.use(directive)
    app.component('VContextmenu', VContextmenu)
    app.component('VContextmenuItem', VContextmenuItem)
  },
}
