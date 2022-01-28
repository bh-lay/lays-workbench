<style lang="stylus" scoped>
.triangle-selector
  position relative
  width 100px
  height 100px
  border 1px dashed #7a9cb8
  span
    display block
    width 0
    height 0
    border 50px solid transparent
    cursor pointer
    &.selected-8,
    &.selected-1,
    &.selected-2
      border-right-color #364f63
    &.selected-2,
    &.selected-3,
    &.selected-4
      border-top-color #364f63
    &.selected-4,
    &.selected-5,
    &.selected-6
      border-left-color #364f63
    &.selected-6,
    &.selected-7,
    &.selected-8
      border-bottom-color #364f63
  &:before,
  &:after
    position absolute
    content ''
    display block
    width 141.421%
    height 1px
    border-top 1px dashed #7a9cb8
    transform-origin left center
    pointer-events none
  &:before
    transform rotate(45deg)
  &:after
    transform rotate(-45deg)
</style>

<template>
  <div
    ref="vmRef"
    class="triangle-selector"
    @mouseenter="countPosition"
    @mousemove="hanldeMouseMove"
    @mouseleave="hanldeMouseLeave"
    @click="handleSelected"
  >
    <span
      :class="['selected-' + (hoverIndex > -1 ? hoverIndex : modelValue)]"
    />
  </div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue'
// import { Bookmark, BookmarkSize } from '@database/entity/bookmark'
// import { replaceRouter } from '@/assets/ts/router'

type rect = {
  top: number,
  left: number,
  width: number,
  height: number,
}
function getTriggered(
  point: { clientX: number, clientY: number },
  selectorRect: rect
) {
  const centerX = selectorRect.left + selectorRect.width / 2
  const centerY = selectorRect.top + selectorRect.height / 2
  const x = point.clientX - centerX
  const y = point.clientY - centerY
  let rad = Math.atan2(-y, x) * 360 / (2 * Math.PI)
  // 将负值角度转化为正值
  if (rad < 0) {
    rad += 360
  }
  // 将整个角度旋转 1/16
  rad += 22.5
  if (rad > 337.5) {
    rad -= 337.5
  }
  // 返回坐标在第几个区间内
  return Math.ceil(rad/45)
}
export default {
  name: 'TriangleSelector',
  props: {
    modelValue: {
      type: Number,
      default: -1,
    },
  },
  emits: ['selected', 'update:modelValue'],
  setup(props, context) {
    const selectorRect: rect = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    }
    const vmRef: Ref<HTMLDivElement | null> = ref(null)
    const hoverIndex: Ref<number> = ref(-1)
    return {
      vmRef,
      hoverIndex,
      countPosition() {
        const thisEl = vmRef.value
        if (!thisEl) {
          return
        }
        const rect = thisEl.getBoundingClientRect()
        selectorRect.top = rect.top
        selectorRect.left = rect.left
        selectorRect.width = rect.width
        selectorRect.height = rect.height
      },
      hanldeMouseMove(event: MouseEvent) {
        const { clientX, clientY } = event
        hoverIndex.value = getTriggered({ clientX, clientY }, selectorRect)
      },
      hanldeMouseLeave() {
        hoverIndex.value = -1
      },
      handleSelected(event: MouseEvent) {
        const { clientX, clientY } = event
        const selectedIndex = getTriggered({ clientX, clientY }, selectorRect)
        context.emit('update:modelValue', selectedIndex)
        context.emit('selected', selectedIndex)
      },
    }
  },
}
</script>
