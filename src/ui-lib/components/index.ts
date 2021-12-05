import { App as Application }  from 'vue'
import VButton from './v-button.vue'
import Modal from './modal.vue'

export default {
  install(app: Application) {
    app.component('v-button', VButton)
    app.component('modal', Modal)
  }
}
