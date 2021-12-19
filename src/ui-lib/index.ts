import { App as Application }  from 'vue'
import Components from './components/index';
import clickOutSide from "./directives/click-out-side";
import contextmenu from "./contextmenu/index";
import dropdown from "./dropdown/index";

import VueMdijs from 'vue-mdijs';
import * as mdiIcons from '@mdi/js';

function initUiLayer() {
  const uiNode = document.querySelector('#v-ui')
  if (uiNode) {
    return
  }
  const newUiNode = document.createElement('div')
  newUiNode.setAttribute('id', 'v-ui')
  document.body.appendChild(newUiNode)
}
export default {
  install(app: Application) {
    initUiLayer()
    app.use(Components)
    app.use(clickOutSide)
    app.use(contextmenu)
    app.use(dropdown)
    // 全量引入 mdi 图标
    VueMdijs.add(mdiIcons);
    app.use(VueMdijs)
  }
}