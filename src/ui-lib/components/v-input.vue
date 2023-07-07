<style lang="stylus">
.v-input
  input
    box-sizing border-box
    width 100%
    height 40px
    padding 0 12px
    background #2f2f37
    border 1px solid #1c1c21
    border-radius 4px
    color #888
    transition .4s
    &:focus
      outline none
      border-color #2154ba
</style>

<script lang="ts">
import { watch, h, onMounted, getCurrentInstance, defineComponent } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: 100,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(
    props: {
      modelValue: string,
      placeholder: string,
      maxlength: string | number
    },
    context
  ) {
    function triggerValueUpdate(inputEl: HTMLInputElement) {
      if (props.modelValue !== inputEl.value) {
        context.emit('update:modelValue', inputEl.value)
      }
    }
    function applyPropsValue(inputEl:HTMLInputElement, propsValue: string) {
      if (inputEl.value === propsValue) {
        return
      }
      inputEl.value = propsValue
    }
    function bindInputEvent(inputEl: HTMLInputElement) {
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
      const inputEl = moduleOuterNode.querySelector('input')
      if (!inputEl) {
        return
      }
      applyPropsValue(inputEl, props.modelValue)
      bindInputEvent(inputEl)
      watch(
        () => props.modelValue,
        () => {
          console.log('props.modelValue', props.modelValue)
          if (props.modelValue !== inputEl.value) {
            applyPropsValue(inputEl, props.modelValue)
          }
        }
      )
    })
    return function() {
      return h(
        'div',
        {
          class: 'v-input',
        },
        [
          h(
            'input',
            {
              placeholder: props.placeholder,
              maxlength: props.maxlength
            }
          ),
        ]
      )
    }
  },
})
</script>
