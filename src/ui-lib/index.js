import clickOutSide from "./directives/click-out-side";
import VueMdijs from 'vue-mdijs';
import { mdiClose } from '@mdi/js';

export default {
  install(app) {
    app.use(clickOutSide)
    // mdi 图标
    VueMdijs.add({ mdiClose });
    app.use(VueMdijs)
  }
}