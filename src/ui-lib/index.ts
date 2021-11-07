import { App as Application }  from 'vue'
import Components from './components/index.ts';
import clickOutSide from "./directives/click-out-side.ts";
import VueMdijs from 'vue-mdijs';
import * as mdiIcons from '@mdi/js';

export default {
  install(app: Application) {
    app.use(Components)
    app.use(clickOutSide)
    // 全量引入 mdi 图标
    VueMdijs.add(mdiIcons);
    app.use(VueMdijs)
  }
}