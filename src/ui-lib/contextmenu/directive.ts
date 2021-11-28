import { App as Application, DirectiveBinding, nextTick, ComponentInternalInstance }  from 'vue'

export default {
  install(app: Application) {
    app.directive('contextmenu', {
      mounted (el, binding: DirectiveBinding) {
        const $refKey: string = binding.arg || ''

        el.addEventListener('contextmenu', function(event: MouseEvent){
          event.preventDefault();
          if (!binding.instance || !binding.instance.$refs) {
            return
          }
          const contextmenuVM: any = binding.instance.$refs[$refKey]
          if (!contextmenuVM) {
            return
          }
          contextmenuVM.visible = false;

          const bindingValue = binding.value
          if (bindingValue && bindingValue.onVisible) {
            bindingValue.onVisible()
          }
          nextTick(() => {
            contextmenuVM.left = event.clientX;
            contextmenuVM.top = event.clientY;
            contextmenuVM.visible = true;
          });
        }, false)
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
