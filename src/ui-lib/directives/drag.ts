import { App as Application }  from 'vue'
import dragHandle, { mouseDragHandle, touchDragHandle } from '@/assets/ts/drag-handle'
function executeFuncton (callback: unknown, params: unknown[]) {
  if (typeof callback !== 'function') {
    return
  }
  callback(...params)
}
export default {
  install(app: Application) {
    app.directive('drag', {
      mounted (el: HTMLElement, binding) {
        const bindingValue = typeof binding.value === 'object' ? binding.value : {}
        const triggerElement = el
        if ('ontouchend' in document) {
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
  },
}
