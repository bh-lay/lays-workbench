<style lang="stylus">
.v-input
  input,
  textarea
    box-sizing border-box
    width 100%
    padding 8px 12px
    background #2f2f37
    border 1px solid #1c1c21
    border-radius 4px
    color #ccc
    transition .4s
    &:focus
      outline none
      border-color #2154ba
  input
    height 40px
  textarea
    min-height 80px
    resize vertical
  &.is-disabled
    input,
    textarea
      cursor not-allowed
      opacity .5
      background #272730
      color #ccc
</style>

<script lang="ts">
import { watch, h, onMounted, getCurrentInstance, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: Infinity,
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    type InputOrTextarea = HTMLInputElement | HTMLTextAreaElement
    function triggerValueUpdate(inputEl: InputOrTextarea) {
      const valueInNode = props.type === 'number' ? Number(inputEl.value) : inputEl.value
      if (props.modelValue !== valueInNode) {
        context.emit('update:modelValue', valueInNode)
      }
    }
    function applyPropsValue(inputEl: InputOrTextarea, propsValue: string) {
      if (inputEl.value === propsValue) {
        return
      }
      inputEl.value = propsValue
    }
    function bindInputEvent(inputEl: InputOrTextarea) {
      let isComposition = false
      inputEl.addEventListener('input', () => {
        if (isComposition) {
          return
        }
        triggerValueUpdate(inputEl)
      })
      inputEl.addEventListener('compositionstart', () => {
        isComposition = true
      })
      inputEl.addEventListener('compositionend', () => {
        isComposition = false
        triggerValueUpdate(inputEl)
      })
    }
    onMounted(() => {
      const internalInstance = getCurrentInstance()
      const moduleOuterNode = internalInstance?.proxy?.$el as HTMLElement
      const selector = props.type === 'textarea' ? 'textarea' : 'input'
      const inputEl = moduleOuterNode.querySelector(selector) as InputOrTextarea | null
      if (!inputEl) {
        return
      }
      applyPropsValue(inputEl, `${props.modelValue ?? ''}`)
      bindInputEvent(inputEl)
      watch(
        () => props.modelValue,
        () => {
          if (props.modelValue !== inputEl.value) {
            const value = props.type === 'number' ? props.modelValue.toString() : props.modelValue as string
            applyPropsValue(inputEl, value)
          }
        }
      )
    })
    return function() {
      const isTextarea = props.type === 'textarea'
      const elementTag = isTextarea ? 'textarea' : 'input'
      const elementProps = {
        placeholder: props.placeholder,
        maxlength: props.maxlength,
        disabled: props.disabled,
        ...(isTextarea ? {} : { type: props.type }),
      }
      return h(
        'div',
        {
          class: ['v-input', { 'is-disabled': props.disabled }],
        },
        [
          h(
            elementTag,
            elementProps
          ),
        ]
      )
    }
  },
})
</script>
