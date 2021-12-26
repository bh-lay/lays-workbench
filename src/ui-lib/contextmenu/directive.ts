import { App as Application, DirectiveBinding, nextTick, ComponentPublicInstance }  from 'vue'
declare interface customMouseEvent extends MouseEvent {
  _hasTriggered?: boolean
}
export default {
  install(app: Application) {
    app.directive('contextmenu', {
      mounted (el: HTMLElement, binding: DirectiveBinding) {
        const $refKey: string = binding.arg || ''

        el.addEventListener('contextmenu', function(event: customMouseEvent){
          event.preventDefault()
          // event.stopPropagation()
          // 若已触发过右键菜单，则
          if (event._hasTriggered) {
            return
          }
          event._hasTriggered = true
          if (!binding.instance || !binding.instance.$refs) {
            return
          }
          const contextmenuVM = binding.instance.$refs[$refKey] as ComponentPublicInstance<{
            visible?: boolean,
            top: number,
            left: number
          }>
          if (!contextmenuVM) {
            return
          }
          contextmenuVM.visible = false

          const bindingValue = binding.value
          if (bindingValue && bindingValue.beforeVisible) {
            bindingValue.beforeVisible()
          }
          nextTick(() => {
            contextmenuVM.left = event.clientX
            contextmenuVM.top = event.clientY
            contextmenuVM.visible = true
          })
        }, false)
      },
    })
  },
}
