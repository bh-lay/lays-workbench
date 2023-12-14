import { h, defineComponent } from 'vue'
export default defineComponent({
  props: {
    content: {
      type: String,
      default: '',
    },
    keyword: {
      type: String,
      default: '',
    },
  },
  setup(props: { content: string, keyword: string}) {
    return function() {
      const parsedContent = props.content.replace(/[<>]/g, function (c){
        return c === '<' ? '&lt;':'&gt;'
      })
      const html = parsedContent.replace(new RegExp(`(${props.keyword})`, 'gmi'), '<b>$1</b>')
      return h('span', {
        innerHTML: html,
      })
    }
  },
})
