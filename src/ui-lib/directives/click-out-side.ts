import { App as Application }  from 'vue'

export default {
  install(app: Application) {
    app.directive('clickoutside', {
      mounted (el, binding) {
        const callback = typeof binding.value === 'function' ? binding.value : null
        const bodyClickListener = (clickEvent: Event) => {
          if (!el.contains(clickEvent.target)) {
              setTimeout(callback, 30)
          }
        }
        let bodyNode = document.body || document.getElementsByTagName('body')[0]
        setTimeout(() => {
          bodyNode.addEventListener('click', bodyClickListener)
          el._removeGloballistener = function() {
            bodyNode.removeEventListener('click', bodyClickListener)
          }
        }, 20)
      },
      unmounted(el) {
        if (el._removeGloballistener) {
          el._removeGloballistener()
          el._removeGloballistener = null
        }
      },
    })
  }
}
