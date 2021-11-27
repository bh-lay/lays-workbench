<style lang="stylus" scoped>
.draged-layer
  position fixed
  top 0
  left 0
  width 100%
  height 100%
  z-index 1000
.shadow-rect
  position relative
  box-sizing border-box
  border 0 solid #3d4c5c
  background rgba(3, 169, 244, .5)
  border-radius 14px
  transition .2s
  &.line
    border 2px solid transparent
  &.block
    border 6px solid #3d4c5c
</style>

<template>
<teleport to="body">
  <div class="draged-layer">
    <transition name="fade-fast">
      <div v-if="data.type" :class="['shadow-rect', data.type === 'enter' ? 'block' : 'line']" :style="shadowRectStyle"></div>
    </transition>
  </div>
</teleport>
</template>

<script>
import { computed } from 'vue'
import { getVariables } from '../assets/js/css-variables.ts'
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  setup(props, context) {
    const enterPadding = 3
    const beforeMarging = 2
    const shadowRectStyle = computed(() => {
      const { gridGap } = getVariables()
      if (props.data.type === 'enter') {
        return {
          top: props.data.top - enterPadding + 'px',
          left: props.data.left - enterPadding + gridGap / 2 + 'px',
          width: props.data.right - props.data.left + enterPadding * 2 - gridGap + 'px',
          height: props.data.bottom - props.data.top + enterPadding * 2 - gridGap + 'px',
        }
      } else {
        return {
          top: props.data.top + beforeMarging + 'px',
          left: props.data.left + 'px',
          width: 6 + 'px',
          height: props.data.bottom - props.data.top - beforeMarging * 2 - gridGap + 'px',
        }
      }
    })
    return {
      shadowRectStyle,
    }
  },
};
</script>
