import { createVNode, render, App as Application, ComponentPublicInstance }  from 'vue'
import MessageModule from './message.vue'

type messageOptions = {
  message: string,
  duration?: number
}
export function Message (options: messageOptions) {
  const tempNode = document.createElement('div')
  const vNode = createVNode(MessageModule, {
    message: options.message,
    duration: options.duration,
    onClose() {
      render(null, tempNode)
    }
  }, null)
  const bodyNode: HTMLElement = document.body
  
  render(vNode, tempNode)
  bodyNode.appendChild(tempNode.firstElementChild!)
  return {
    close() {
      var component = vNode.component!.proxy! as ComponentPublicInstance<{ visible: boolean }>
      component.visible = false
    }
  }
}
export default {
  install(app: Application) {
  }
}
