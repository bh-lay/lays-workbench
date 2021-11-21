import { App as Application }  from 'vue'
import Modal from './modal.vue'
import Dropdown from './dropdown.vue'

export default {
  install(app: Application) {
    app.component('modal', Modal)
    app.component('dropdown', Dropdown)
  }
}
