import { App as Application }  from 'vue'
import WbButton from './wb-button.vue'
import Modal from './modal.vue'

export default {
  install(app: Application) {
    app.component('wb-button', WbButton)
    app.component('modal', Modal)
  }
}
