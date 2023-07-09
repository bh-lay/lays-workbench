<style lang="stylus" scoped>
.focal-plane-outer
  position fixed
  width 100%
  height 100%
  top 0
  left 0
  display flex
  align-items center
  justify-content center
  transition 0
  &.hidden
    // 各种方法保证视觉上弹窗不可见，且不影响动画显示
    pointer-events none
    visibility hidden
    opacity 0
    width 0
    height 0
    transition .1s 1s
.focal-plane-mask
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  z-index 100
  background: rgba(0, 0, 0, .7)
  -webkit-backdrop-filter blur(10px) contrast(0.5) saturate(0.5)
  backdrop-filter blur(10px) contrast(0.5) saturate(0.5)
.focal-plane-close
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
.focal-plane-body
  position relative
  box-sizing border-box
  width 80%
  max-width 1400px
  max-height 900px
  z-index 101
  color #e3e3e8
@media screen and (max-width:600px)
  .focal-plane-mask
    transition 0s !important
  .focal-plane-body
    top 0
    left 0
    width 100% !important
    height 100% !important
</style>

<template>
  <teleport to="#v-ui">
    <div
      :class="['focal-plane-outer', modelValue ? 'visible' : 'hidden']"
      :style="{
        zIndex: currentZIndex
      }"
      @contextmenu.prevent
    >
      <transition name="fade-slow">
        <div
          v-if="modelValue"
          class="focal-plane-mask"
          @click="maskClickHandle"
        />
      </transition>
      <transition name="slidedown">
        <div
          v-if="modelValue"
          class="focal-plane-body"
          :style="modalBodyStyle"
        >
          <slot />
        </div>
      </transition>
      <transition name="fade-fast">
        <div
          v-if="modelValue"
          class="focal-plane-close"
          @click="closeModal"
        >
          <v-mdi
            name="mdi-close"
            size="22"
          />
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { getNextZIndex } from '../utils'
type modalStyle = {
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
const props = defineProps({
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
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['after-open', 'after-close', 'update:modelValue'])

const modalBodyStyle: modalStyle = {}
if (props.width) {
  modalBodyStyle.width = inputSize2Style(props.width)
}
if (props.height) {
  modalBodyStyle.height = inputSize2Style(props.height)
}
function closeModal() {
  emits('update:modelValue', false)
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
const currentZIndex = ref(0)
watch(
  () => props.modelValue,
  isVisible => {
    if (isVisible) {
      currentZIndex.value = getNextZIndex()
      emits('after-open')
      // 仅在配置了按下 Esc 关闭时才注册事件监听
      if (props.closeOnPressEscape) {
        window.addEventListener('keydown', keydownListener)
      }
    } else {
      emits('after-close')
      // 未放置外部修改 closeOnPressEscape 值，无论是否绑定都尝试移除事件
      window.removeEventListener('keydown', keydownListener)
    }
  }
)
function maskClickHandle() {
  if (props.closeOnClickModal) {
    closeModal()
  }
}
</script>
