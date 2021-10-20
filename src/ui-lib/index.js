import Components from './components/index.js';
import clickOutSide from "./directives/click-out-side";
import VueMdijs from 'vue-mdijs';
import { mdiClose, mdiRegex, mdiBook, mdiAppleKeyboardCommand, mdiHail, mdiTune } from '@mdi/js';

export default {
  install(app) {
    app.use(Components)
    app.use(clickOutSide)
    // mdi 图标
    VueMdijs.add({ mdiClose, mdiRegex, mdiBook, mdiAppleKeyboardCommand, mdiHail, mdiTune });
    app.use(VueMdijs)
  }
}