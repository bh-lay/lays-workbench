<style lang="stylus" scoped>
.v-sider
  height 18px
  padding-top 12px
.railway-track
  height 6px
  border-radius 4px
  background: #edf0f2
.railway-train
  position relative
  height 6px
  max-width 100%
  border-radius 4px
  background #2196f3
.railway-engine
  position absolute
  top -4px
  right -7px
  width 12px
  height 12px
  border-radius 10px
  border 2px solid #2196f3
  background #fff
  transition .15s
  &:hover
    cursor grab
    transform scale(1.3)
  &:active,
  &.active
    cursor grabbing
    transform scale(1.5)
</style>

<template>
  <div class="v-sider">
    <div ref="trackRef" class="railway-track">
      <div
        class="railway-train"
        :style="{
          width: isInDragMode ? screenWidthByDrag : screenWidthByValue,
        }"
      >
        <div
          :class="['railway-engine', isInDragMode ? 'active' : '']"
          @mousedown="dragHandleStart"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import dragHandle from '@/assets/js/drag-handle';
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
  },
  setup(props, context) {
    const screenWidthByValue = ref('0%');
    const screenWidthByDrag = ref('0px');
    const trackRef = ref(null);
    const isInDragMode = ref(false);
    const dragValue = ref(0);
    watch(
      [() => props.modelValue, () => props.min, () => props.max],
      () => {
        screenWidthByValue.value =
          ((props.modelValue - props.min) / (props.max - props.min)) * 100 +
          '%';
      },
      { immediate: true }
    );

    return {
      dragValue,
      trackRef,
      isInDragMode,
      screenWidthByValue,
      screenWidthByDrag,
      dragHandleStart(event) {
        const trackNode = trackRef.value;
        const trackWidth = trackNode.clientWidth;
        // 开始值
        const startWidth =
          ((props.modelValue - props.min) / (props.max - props.min)) *
          trackWidth;
        function countNewValue(xOffset) {
          let newWidth = startWidth + xOffset;
          newWidth = Math.max(Math.min(newWidth, trackWidth), 0);

          const widthRate = newWidth / trackWidth;
          let newValue = widthRate * (props.max - props.min) + props.min;
          newValue = Math.max(Math.min(props.max, newValue), props.min);
          return {
            width: newWidth,
            value: newValue,
          };
        }
        let timer = null
        function delayTriggerUpdate(value) {
          clearTimeout(timer)
          timer = setTimeout(() => {
            context.emit('update:modelValue', value);
          }, 10) 
        }
        dragHandle(event, {
          stableDistance: 20,
          stableStart() {
            isInDragMode.value = true;
          },
          move(params) {
            const { width, value } = countNewValue(params.xOffset);
            screenWidthByDrag.value = width + 'px';
            dragValue.value = value;
            delayTriggerUpdate(value)
          },
          end(params) {
            const { value } = countNewValue(params.xOffset);
            context.emit('update:modelValue', value);
            isInDragMode.value = false;
          },
        });
      },
    };
  },
};
</script>
