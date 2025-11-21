<style lang="stylus" scoped>
.v-slider
  height 14px
  padding-top 10px
  &:has(.railway-station-label)
    margin 0 5px 20px
.railway-track
  position relative
  height 4px
  border-radius 4px
  background: #ddd
.railway-train
  position relative
  height 4px
  max-width 100%
  border-radius 4px
  background #2196f3
.railway-engine
  position absolute
  top -18px
  margin-left -22px
  width 40px
  height 40px
  transition transform .15s
  &:before
    content ''
    position relative
    display block
    top 13px
    left 13px
    width 10px
    height 10px
    border-radius 10px
    border 2px solid #2196f3
    background #fff
  &:hover
    cursor grab
    transform scale(1.4)
  &.active
  &:active
    cursor grabbing
    transform scale(1.7)
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
  background rgba(255, 255, 255, .4)
.railway-station-label
  position relative
  top 10px
  left -5px
  font-size 12px
  white-space nowrap
  opacity .6
.touch-mode .railway-engine
  &.active
    cursor grabbing
    transform scale(2.5)
</style>

<template>
  <div :class="['v-slider', supportTouch ? 'touch-mode' : '']">
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
          <div
            v-if="mark.label"
            class="railway-station-label"
          >
            {{ mark.label }}
          </div>
        </div>
      </div>
      <div
        v-drag="dragOption"
        :class="['railway-engine', isInDragMode ? 'active' : '']"
        :style="{
          left: isInDragMode ? screenWidthByDrag : screenWidthByValue,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, Ref, PropType } from 'vue'
import { dragOptions, supportTouch } from '@/assets/ts/drag-handle'
type markItem = {
  value: number,
  label?: string
}
const props = defineProps({
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
  step: {
    type: Number,
    default: 0,
  },
  marks: {
    type: Array as PropType<markItem[]>,
    default() {
      return []
    },
  },
})
const emits =defineEmits(['update:modelValue', 'after-change'])

const screenWidthByValue = ref('0%')
const screenWidthByDrag = ref('0px')
const trackRef: Ref<HTMLDivElement | null> = ref(null)
const isInDragMode = ref(false)
const dragValue = ref(0)
let trackWidth = 0
let startWidth = 0
watch(
  [() => props.modelValue, () => props.min, () => props.max],
  () => {
    let widthRate = (props.modelValue - props.min) / (props.max - props.min)
    widthRate = Math.max(Math.min(widthRate, 1), 0)
    screenWidthByValue.value = widthRate * 100 + '%'
  },
  { immediate: true }
)
function applyStep(value: number): number {
  if(props.step) {
    return Math.round(value / props.step) * props.step
  }
  return value
}

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
    emits('update:modelValue', applyStep(value))
  }, 10)
}

const dragOption: dragOptions = {
  touchStableTime: 0,
  beforeStart() {
    const trackNode = trackRef.value
    if (trackNode === null) {
      return
    }
    trackWidth = trackNode.clientWidth
    // 开始值
    startWidth =
      ((props.modelValue - props.min) / (props.max - props.min)) *
      trackWidth
  },
  start() {
    isInDragMode.value = true
  },
  move(params) {
    const { width, value } = countValueByDrag(params.xOffset)
    screenWidthByDrag.value = width + 'px'
    dragValue.value = applyStep(value)
    delayTriggerUpdate(value)
  },
  end(params) {
    const { value } = countValueByDrag(params.xOffset)
    const parsedValue = applyStep(value)
    emits('update:modelValue', parsedValue)
    emits('after-change', parsedValue)
    isInDragMode.value = false
  },
  cancel() {
    isInDragMode.value = false
  },
}
</script>
