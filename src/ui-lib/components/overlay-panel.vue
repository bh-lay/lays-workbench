<style lang="stylus" scoped>
@import '../../assets/stylus/functions/scrollbar.styl'
.overlay-panel-outer
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
.overlay-panel-body
  position relative
  box-sizing border-box
  width 100%
  height 100%
  overflow auto
  z-index 101
  color #e3e3e8
  scrollbar()

.overlay-panel-close
  position absolute
  top 10px
  right 20px
  width 45px
  height 45px
  display flex
  align-items center
  justify-content center
  z-index 102
  transition-delay .2s
  cursor pointer
  transition .2s
  svg
    fill #aaa
  &:hover
    background #212127
  &:active
    background #16181d
.overlay-panel-shape
  position absolute
  top 0
  left 0
  width 100%
  height 100%

.overlay-fade-enter-active
	transform translateY(-100px)
	opacity 0
.overlay-fade-enter-to
  opacity 1
  transform:translateY(0) rotate(0)
  pointer-events auto
  transition 1s 0.2s

.overlay-fade-leave-active
  transition 0.15s
.overlay-fade-leave-to
  transform translateY(20px)
  opacity 0
</style>

<template>
  <teleport to="#v-ui">
    <div
      :class="['overlay-panel-outer', modelValue ? 'visible' : 'hidden']"
      :style="{
        zIndex: currentZIndex
      }"
      @contextmenu.prevent
    >
      <svg
        ref="overlaysShape"
        class="overlay-panel-shape"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path fill="#3e4451" />
      </svg>
      <transition name="overlay-fade">
        <div
          v-if="modelValue"
          class="overlay-panel-body"
        >
          <slot />
        </div>
      </transition>
      <transition name="fade-fast">
        <div
          v-if="modelValue"
          class="overlay-panel-close"
          @click="closeFocusPlane"
        >
          <v-mdi
            name="mdi-close"
            size="26"
          />
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref, watch } from 'vue'
import { getNextZIndex } from '../utils'
import { ShapeOverlays } from './shape-overlays'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['after-open', 'after-close', 'update:modelValue'])

function closeFocusPlane() {
  emits('update:modelValue', false)
}
const overlaysShape: Ref<HTMLElement | null> = ref(null)
const currentZIndex = ref(0)
onMounted(() => {
  if (overlaysShape.value) {
    const overlay = new ShapeOverlays(overlaysShape.value)
    watch(
      () => props.modelValue,
      isVisible => {
        if (isVisible) {
          currentZIndex.value = getNextZIndex()
          overlay.open()
          emits('after-open')
        } else {
          setTimeout(() => {
            overlay.close()
          }, 100)
          emits('after-close')
        }
      }
    )
  }

})


</script>
