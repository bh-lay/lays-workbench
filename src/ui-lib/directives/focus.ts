import { App as Application, nextTick }  from 'vue'
const allowFocusTagnames: string[] = ['input', 'textarea', 'button']
export default {
  install(app: Application) {
    app.directive('focus', {
      mounted (el: HTMLElement) {
        let focusElement = el
        if (allowFocusTagnames.indexOf(el.tagName) === -1 && el.getAttribute('tab-index') !== 'string') {
          const findInputEl = el.querySelector('input')
          if (findInputEl) {
            focusElement = findInputEl
          }
        }
        nextTick(() => {
          focusElement.focus()
        })
      },
    })
  },
}
