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
.draged-shadow
  position absolute
  width 40px
  height 40px
  margin -10px 0 0 -10px
  border-radius 4px
  background #333
  box-shadow 1px 1px 2px rgba(0, 0, 0, 0.2),2px 2px 20px rgba(0, 0, 0, 0.2)
</style>

<template>
<teleport to="body">
  <div class="draged-layer">
    <transition name="fade-fast">
      <div v-if="data.type" :class="['shadow-rect', data.type === 'enter' ? 'block' : 'line']" :style="shadowRectStyle"></div>
    </transition>
    <div class="draged-shadow" :style="{
      top: data.clientY + 'px',
      left: data.clientX + 'px',
      background: data.undercoat,
    }"></div>
  </div>
</teleport>
</template>

<script>
import { computed } from 'vue'
import { getAppConfigItem } from '@/assets/js/app-config.ts'
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
    const beforeMarging = -4
    const shadowRectStyle = computed(() => {
      const gridGap = getAppConfigItem('gridGap')
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
          left: props.data.left + 3 + 'px',
          width: 8 + 'px',
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
