import { createVNode, render, ComponentPublicInstance, VNode }  from 'vue'
import VMessage from './message.vue'

type messageOptions = {
  message: string,
  duration?: number,
  confirm?: () => void,
  confirmText?: string,
  cancelText?: string,
}
export class Message {
  vNode: VNode
  constructor (options: messageOptions) {
    this.vNode = this.init(options)
  }
  init (options: messageOptions) {
    const tempNode = document.createElement('div')
    const vNode = createVNode(VMessage, {
      message: options.message,
      duration: options.duration,
      confirm: options.confirm,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onClose() {
        render(null, tempNode)
      },
    }, null)
    
    render(vNode, tempNode)

    const bodyNode: HTMLElement = document.body

    const vmNode = tempNode.firstElementChild
    if (vmNode) {
      bodyNode.appendChild(vmNode)
    }

    return vNode
  }
  close() {
    const component =  this.vNode.component
    if (!component || !component.proxy) {
      return
    }
    const componentVM = component.proxy as ComponentPublicInstance<{ visible: boolean }>
    componentVM.visible = false
  }
}
// export default {
//   install(app: Application) {
//   }
// }
