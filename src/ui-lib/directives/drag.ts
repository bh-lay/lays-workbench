import { App as Application }  from 'vue'
import dragHandle, { dragParams } from '@/assets/ts/drag-handle'
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
        triggerElement.addEventListener('mousedown', (event: MouseEvent) => {
          dragHandle(event, {
            stableDistance: 20,
            beforeStart(event: MouseEvent) {
              executeFuncton(bindingValue.beforeStart, [event])
            },
            start(startX: number, startY: number) {
              executeFuncton(bindingValue.start, [startX, startY])
            },
            move(params: dragParams) {
              executeFuncton(bindingValue.move, [params])
            },
            end(params: dragParams) {
              executeFuncton(bindingValue.end, [params])
            },
            cancel() {
              executeFuncton(bindingValue.cancel, [])
            },
          })
        })
      },
    })
  },
}
