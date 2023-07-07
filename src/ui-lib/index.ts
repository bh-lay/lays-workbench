import { App as Application }  from 'vue'
import Components from './components/index'
import Directives from './directives/index'
import contextmenu from './contextmenu/index'
import dropdown from './dropdown/index'
export { default as FocalPlane } from './components/focal-plane.vue'

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
    app.use(Directives)
    app.use(contextmenu)
    app.use(dropdown)
  },
}