import { App as Application }  from 'vue'
declare interface HTMLElement {
  _removeGloballistener: (() => void) | null
}
export default {
  install(app: Application) {
    app.directive('clickoutside', {
      mounted (el: HTMLElement, binding) {
        const callback = typeof binding.value === 'function' ? binding.value : null
        const bodyClickListener = (clickEvent: Event) => {
          if (!el.contains(clickEvent.target)) {
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
      unmounted(el: HTMLElement) {
        if (el._removeGloballistener) {
          el._removeGloballistener()
          el._removeGloballistener = null
        }
      },
    })
  }
}
