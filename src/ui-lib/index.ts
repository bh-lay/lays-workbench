import { App as Application }  from 'vue'
import Components from './components/index.ts';
import clickOutSide from "./directives/click-out-side.ts";
import VueMdijs from 'vue-mdijs';
import { mdiClose, mdiRegex, mdiBook, mdiAppleKeyboardCommand, mdiHail, mdiTune, mdiCodeJson, mdiLaptop } from '@mdi/js';

export default {
  install(app: Application) {
    app.use(Components)
    app.use(clickOutSide)
    // mdi 图标
    VueMdijs.add({ mdiClose, mdiRegex, mdiBook, mdiAppleKeyboardCommand, mdiHail, mdiTune, mdiCodeJson, mdiLaptop });
    app.use(VueMdijs)
  }
}