import { App as Application }  from 'vue'
import VButton from './v-button.vue'
import VSlider from './v-slider.vue'
import Modal from './modal.vue'
import VueMdijs from './vue-mdijs.vue'
import * as mdiIcons from '@mdi/js';

// 全量引入 mdi 图标
VueMdijs.add(mdiIcons);


export default {
  install(app: Application) {
    app.component('v-button', VButton)
    app.component('v-slider', VSlider)
    app.component('modal', Modal)
    app.component('v-mdi', VueMdijs);
  }
}
