import { App as Application }  from 'vue'
import VButton from './v-button.vue'
import VSlider from './v-slider.vue'
import Modal from './modal.vue'

export default {
  install(app: Application) {
    app.component('v-button', VButton)
    app.component('v-slider', VSlider)
    app.component('modal', Modal)
  }
}
