import { App as Application, nextTick }  from 'vue'
declare interface customHTMLElement extends HTMLDivElement {
  _removeGloballistener: (() => void) | null
}
export default {
  install(app: Application) {
    app.directive('focus', {
      mounted (el: customHTMLElement) {
        nextTick(() => {
          el.focus()
        })
      },
    })
  },
}
