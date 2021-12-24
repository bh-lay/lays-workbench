import { App as Application }  from 'vue'
declare interface customHTMLElement extends HTMLDivElement {
  _removeGloballistener: (() => void) | null
}
export default {
  install(app: Application) {
    app.directive('clickoutside', {
      mounted (el: customHTMLElement, binding) {
        const callback = typeof binding.value === 'function' ? binding.value : null
        const bodyClickListener = (clickEvent: Event) => {
          const eventTarget = clickEvent.target as customHTMLElement
          if (!el.contains(eventTarget)) {
              setTimeout(callback, 30)
          }
        }
        let bodyNode = document.body || document.getElementsByTagName('body')[0]
        setTimeout(() => {
          bodyNode.addEventListener('click', bodyClickListener)
          bodyNode.addEventListener('contextmenu', bodyClickListener)
          el._removeGloballistener = function() {
            bodyNode.removeEventListener('click', bodyClickListener)
            bodyNode.removeEventListener('contextmenu', bodyClickListener)
          }
        }, 20)
      },
      unmounted(el: customHTMLElement) {
        if (el._removeGloballistener) {
          el._removeGloballistener()
          el._removeGloballistener = null
        }
      },
    })
  }
}
