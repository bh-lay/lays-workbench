import { App as Application }  from 'vue'
import { supportTouch, mouseDragHandle, touchDragHandle } from '@/assets/ts/drag-handle'

export default {
  install(app: Application) {
    app.directive('drag', {
      mounted (el: HTMLElement, binding) {
        const bindingValue = typeof binding.value === 'object' ? binding.value : {}
        const triggerElement = el
        if (supportTouch) {
          triggerElement.addEventListener('touchstart', (event: TouchEvent) => {
            touchDragHandle(event, bindingValue)
          })
        } else {
          triggerElement.addEventListener('mousedown', (event: MouseEvent) => {
            mouseDragHandle(event, bindingValue)
          })
        }
      },
    })
    app.directive('drag-start', {
      mounted (el: HTMLElement, binding) {
        const triggerElement = el
        if (supportTouch) {
          triggerElement.addEventListener('touchstart', (event: TouchEvent) => {
            if (typeof binding.value === 'function') {
              binding.value(event)
            }
          })
        } else {
          triggerElement.addEventListener('mousedown', (event: MouseEvent) => {
            if (typeof binding.value === 'function') {
              binding.value(event)
            }
          })
        }
      },
    })
  },
}
