<style lang="stylus" scoped>
.modal-outer
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  display flex
  align-items center
  justify-content center
  transition 0
  z-index 1001
  &.hidden
    // 各种方法保证视觉上弹窗不可见，且不影响动画显示
    pointer-events none
    visibility hidden
    opacity 0
    width 0
    height 0
    transition .1s 1s
.modal-mask
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  z-index 100
  background: rgba(0, 0, 0, .7)
.modal-title
  padding 15px 20px
  line-height 30px
  font-weight bold
  font-size 16px
  color #b9bdc6
.modal-close
  position absolute
  top 5px
  right 5px
  width 40px
  height 40px
  display flex
  align-items center
  justify-content center
  z-index 102
  transition-delay .2s
  cursor pointer
  margin-left 5px
  transition .2s
  svg
    fill #aaa
  &:hover
    background #212127
  &:active
    background #16181d
.modal-body
  position relative
  box-sizing border-box
  width 80%
  max-width 1400px
  max-height 900px
  z-index 101
@media screen and (max-width:600px)
  .modal-mask
    transition 0s !important
  .modal-body
    top 0
    left 0
    width 100% !important
    height 100% !important
</style>

<template>
  <teleport to="#v-ui">
    <div
      :class="['modal-outer', modelValue ? 'visible' : 'hidden']"
      @contextmenu.prevent
    >
      <transition name="fade-slow">
        <div
          v-if="modelValue"
          class="modal-mask"
          @click="maskClickHandle"
        />
      </transition>
      <transition name="slidedown">
        <div
          v-if="modelValue"
          class="modal-body"
          :style="modalBodyStyle"
        >
          <div
            v-if="title"
            class="modal-title"
          >
            {{ title }}
          </div>
          <slot />
          <div
            class="modal-close"
            @click="closeModal"
          >
            <v-mdi
              name="mdi-close"
              size="22"
            />
          </div>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script lang="ts">
import { watch } from 'vue'
type modalStyle = {
  background: string,
  width?: string,
  height?: string
}
interface CustomEventTarget extends EventTarget {
  tagName: string,
  composing: boolean,
  blur: () => void
}
function inputSize2Style(input: string | number): string {
  if (typeof input === 'number') {
    return input + 'px'
  }
  return input
}
export default {
  name: 'VModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: '',
    },
    height: {
      type: [String, Number],
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    undercoat: {
      type: String,
      default: '#26262c',
    },
    closeOnClickModal: {
      type: Boolean,
      default: false,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['after-open', 'after-close', 'update:modelValue'],
  setup(props, context) {
    const modalBodyStyle: modalStyle = {
      background: props.undercoat,
    }
    if (props.width) {
      modalBodyStyle.width = inputSize2Style(props.width)
    }
    if (props.height) {
      modalBodyStyle.height = inputSize2Style(props.height)
    }
    function closeModal() {
      context.emit('update:modelValue', false)
    }
    const keydownListener = function (event: KeyboardEvent) {
      // 只处理 Esc 按键
      if (event.key !== 'Escape') {
        return
      }
      // 判断是否在 input、textarea 中按下 Esc
      const target = event.target as CustomEventTarget
      if (target && target.tagName.match(/input|textarea/i)) {
        if (target.composing) {
          // 输入法参与过程中，不处理
        } else {
          // 非输入过程中，释放焦点
          target.blur()
        }
        return
      }
      closeModal()
    }
    watch(
      () => props.modelValue,
      isVisible => {
        if (isVisible) {
          context.emit('after-open')
          // 仅在配置了按下 Esc 关闭时才注册事件监听
          if (props.closeOnPressEscape) {
            window.addEventListener('keydown', keydownListener)
          }
        } else {
          context.emit('after-close')
          // 未放置外部修改 closeOnPressEscape 值，无论是否绑定都尝试移除事件
          window.removeEventListener('keydown', keydownListener)
        }
      }
    )
    return {
      modalBodyStyle,
      closeModal,
      maskClickHandle() {
        if (props.closeOnClickModal) {
          closeModal()
        }
      },
    }
  },
}
</script>
