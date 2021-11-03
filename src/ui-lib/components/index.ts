import { App as Application }  from 'vue'
import Modal from './modal.vue'

export default {
  install(app: Application) {
    app.component('modal', Modal)
  }
}
