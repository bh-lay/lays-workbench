import { App as Application }  from 'vue'
import WbButton from './wb-button.vue'
import Modal from './modal.vue'
import Dropdown from './dropdown.vue'
import DropdownItem from './dropdown-item.vue'

export default {
  install(app: Application) {
    app.component('wb-button', WbButton)
    app.component('modal', Modal)
    app.component('dropdown', Dropdown)
    app.component('dropdown-item', DropdownItem)
  }
}
