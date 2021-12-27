<style lang="stylus" scoped>
.v-sider
  height 14px
  padding-top 10px
.railway-track
  position relative
  height 4px
  border-radius 4px
  background: #e7ebee
.railway-train
  position relative
  height 4px
  max-width 100%
  border-radius 4px
  background #2196f3
.railway-engine
  position absolute
  top -5px
  margin-left -6px
  width 10px
  height 10px
  border-radius 10px
  border 2px solid #2196f3
  background #fff
  transition transform .15s
  &:hover
    cursor grab
    transform scale(1.4)
  &:active,
  &.active
    cursor grabbing
    transform scale(1.6)
.railway-stations
  position absolute
  width 100%
  height 100%
  top 0
  left 0
  z-index 0
.railway-station
  position absolute
  top 0
  margin-left -1px
  width 2px
  height 4px
  background rgba(255, 255, 255, .6)
</style>

<template>
  <div class="v-sider">
    <div
      ref="trackRef"
      class="railway-track"
    >
      <div
        class="railway-train"
        :style="{
          width: isInDragMode ? screenWidthByDrag : screenWidthByValue,
        }"
      />
      <div class="railway-stations">
        <div
          v-for="(mark, index) in marks"
          :key="index"
          class="railway-station"
          :style="{
            left: 100 * (mark.value - min) / (max - min) + '%'
          }"
        >
          <div class="label" />
        </div>
      </div>
      <div
        :class="['railway-engine', isInDragMode ? 'active' : '']"
        :style="{
          left: isInDragMode ? screenWidthByDrag : screenWidthByValue,
        }"
        @mousedown="dragHandleStart"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, Ref, PropType } from 'vue'
import dragHandle from '@/assets/ts/drag-handle'
type markItem = {
  value: number,
  label?: string
}
export default {
  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    marks: {
      type: Array as PropType<markItem[]>,
      default() {
        return []
      },
    },
  },
  emits: ['update:modelValue'],
  setup(
    props: {
      modelValue: number,
      min: number,
      max: number,
      marks: markItem[],
    },
    context
  ) {
    const screenWidthByValue = ref('0%')
    const screenWidthByDrag = ref('0px')
    const trackRef: Ref<HTMLDivElement | null> = ref(null)
    const isInDragMode = ref(false)
    const dragValue = ref(0)
    watch(
      [() => props.modelValue, () => props.min, () => props.max],
      () => {
        let widthRate = (props.modelValue - props.min) / (props.max - props.min)
        widthRate = Math.max(Math.min(widthRate, 1), 0)
        screenWidthByValue.value = widthRate * 100 + '%'
      },
      { immediate: true }
    )

    return {
      dragValue,
      trackRef,
      isInDragMode,
      screenWidthByValue,
      screenWidthByDrag,
      dragHandleStart(event: MouseEvent) {
        const trackNode = trackRef.value
        if (trackNode === null) {
          return
        }
        const trackWidth = trackNode.clientWidth
        // 开始值
        const startWidth =
          ((props.modelValue - props.min) / (props.max - props.min)) *
          trackWidth
        // 获取吸附的数值
        function sorptionValue(value: number) {
          // 不能超出最大、最小限制
          const newValue = Math.max(Math.min(props.max, value), props.min)
          if (newValue !== value) {
            return newValue
          }
          // 吸附范围在 最大最小值的差值 1/50
          const sorptionRange = (props.max - props.min) / 50
          // 遍历标记
          for (let i = 0; i < props.marks.length; i++) {
            let distance = Math.abs(props.marks[i].value - newValue)
            if (distance < sorptionRange) {
              return props.marks[i].value
            }
          }
          // 其他情况，原值返回
          return value
        }
        // 根据拖拽情况计算新值
        function countValueByDrag(xOffset: number) {
          const newWidth = startWidth + xOffset
          const widthRate = newWidth / trackWidth
          const dragValue = widthRate * (props.max - props.min) + props.min
          // 数值进行吸附处理
          const newValue = sorptionValue(dragValue)
          // 若吸附修正后的值和原值有差异，则使用修正后的值
          if (newValue !== dragValue) {
            return {
              width: trackWidth * (newValue - props.min) / (props.max - props.min),
              value: newValue,
            }
          }
          // 默认返回原职原值
          return {
            width: newWidth,
            value: newValue,
          }
        }
        let timer: number | null = null
        function delayTriggerUpdate(value: number) {
          timer && clearTimeout(timer)
          timer = setTimeout(() => {
            context.emit('update:modelValue', value)
          }, 10)
        }
        dragHandle(event, {
          stableDistance: 20,
          stableStart() {
            isInDragMode.value = true
          },
          move(params) {
            const { width, value } = countValueByDrag(params.xOffset)
            screenWidthByDrag.value = width + 'px'
            dragValue.value = value
            delayTriggerUpdate(value)
          },
          end(params) {
            const { value } = countValueByDrag(params.xOffset)
            context.emit('update:modelValue', value)
            isInDragMode.value = false
          },
        })
      },
    }
  },
}
</script>
