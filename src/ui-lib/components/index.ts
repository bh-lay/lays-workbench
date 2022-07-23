import { App as Application }  from 'vue'
import VButton from './v-button.vue'
import VInput from './v-input.vue'
import VSlider from './v-slider.vue'
import Modal from './modal.vue'
import VueMdijs from './vue-mdijs'
import HightlightText from './hightlight-text'
export default {
  install(app: Application) {
    app.component('VButton', VButton)
    app.component('VSlider', VSlider)
    app.component('VInput', VInput)
    app.component('VModal', Modal)
    app.component('VMdi', VueMdijs)
    app.component('HightlightText', HightlightText)
  },
}
