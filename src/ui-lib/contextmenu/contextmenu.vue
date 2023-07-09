<style lang="stylus">
.contextmenu-body
  position fixed
  padding 15px 0
  border-radius 4px
  box-shadow 2px 2px 10px rgba(0, 0, 0, .2), 1px 1px 3px rgba(0, 0, 0, .2)
  overflow hidden
  background #2f2f37
  .contextmenu-item
    color #bdbdc7
    &:hover
      background: #26262c
.contextmenu-item
  padding 0 20px
  line-height 42px
  font-size 14px
  cursor pointer
  transition .15s
</style>

<template>
  <teleport to="#v-ui">
    <transition name="slidedown">
      <div
        v-if="visible"
        v-clickoutside="onClickoutside"
        class="contextmenu-body"
        :style="{
          width: width + 'px',
          top: top + 'px',
          left: left + 'px',
          zIndex: currentZIndex
        }"
        @click.stop
        @contextmenu.prevent
      >
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { ref, watch, provide, defineComponent } from 'vue'
import { getNextZIndex } from '../utils'
export default defineComponent({
  props: {
    width: {
      type: [String, Number],
      default: 140,
    },
  },
  emits: ['beforeVisible', 'afterClose'],
  setup(props, context) {
    const visible = ref(false)
    const currentZIndex = ref(0)
    watch(visible, isVisible => {
      getNextZIndex
      if (isVisible) {
        currentZIndex.value = getNextZIndex()
        context.emit('beforeVisible')
      } else {
        context.emit('afterClose')
      }
    })
    provide('close-dropdown', () => {
      visible.value = false
    })
    return {
      top: 0,
      left: 0,
      visible,
      currentZIndex,
      onClickoutside() {
        visible.value = false
      },
    }
  },
})
</script>
