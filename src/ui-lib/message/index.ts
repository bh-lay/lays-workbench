import { createVNode, render, App as Application, ComponentPublicInstance, VNode }  from 'vue'
import MessageModule from './message.vue'

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
    const vNode = createVNode(MessageModule, {
      message: options.message,
      duration: options.duration,
      confirm: options.confirm,
      confirmText: options.confirmText,
      cancelText: options.cancelText,
      onClose() {
        render(null, tempNode)
      }
    }, null)
    
    render(vNode, tempNode)

    const bodyNode: HTMLElement = document.body
    bodyNode.appendChild(tempNode.firstElementChild!)

    return vNode
  }
  close() {
    var component = this.vNode.component!.proxy! as ComponentPublicInstance<{ visible: boolean }>
    component.visible = false
  }
}
export default {
  install(app: Application) {
  }
}
